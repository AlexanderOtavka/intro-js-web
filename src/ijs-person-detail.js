/**
 * ijs-person-detail.js
 *
 * Created by Zander Otavka on 11/17/16.
 * Copyright (C) 2016 Zander Otavka.  All rights reserved.
 *
 * Distributed under the GNU General Public License, Version 3.
 * See the accompanying file LICENSE or http://www.gnu.org/licenses/gpl-3.0.txt
 */

class IJSPersonDetail extends HTMLElement {
    static _doneTransitioning(element, property = null) {
        return new Promise((resolve, reject) => {
            const listener = event => {
                if (property && event.propertyName === property) {
                    resolve(event);
                    element.removeEventListener("transitionend", listener);
                }
            };

            element.addEventListener("transitionend", listener);
        });
    }

    constructor(personElement = null) {
        super();
        this._personElement = personElement;

        this.onClose = this.onClose.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    connectedCallback() {
        this._wrapper = this.querySelector(".person-detail__wrapper");
        this._closeButton = this.querySelector(".person-detail__close-button");
        this._content = this.querySelector(".person-detail__content");
        this._imageContainer = this.querySelector(".person-detail__image-container");
        this._image = this.querySelector(".person-detail__image");
        this._name = this.querySelector(".person-detail__name");
        this._bio = this.querySelector(".person-detail__bio");
        this._background = this.querySelector(".person-detail__background");

        // Run the setter function to set up initial state
        this.personElement = this._personElement;

        this._closeButton.addEventListener("click", this.onClose);
        this._background.addEventListener("click", this.onClose);
        window.addEventListener("resize", this.onResize);
    }

    disconnectedCallback() {
        this._closeButton.removeEventListener("click", this.onClose);
        this._background.removeEventListener("click", this.onClose);
        window.removeEventListener("resize", this.onResize);
    }

    get personElement() {
        return this._personElement;
    }

    set personElement(element) {
        if (this.classList.contains("person-detail--transitioning")) return;

        const oldElement = this._personElement;
        this._personElement = element;

        // Disable annoying scrolling on body when dialog is open
        document.body.classList.toggle("body--noscroll", !!element);

        // For accessibility
        this.inert = !element;
        this.setAttribute("aria-hidden", !element ? "true" : "false");

        if (element) {
            const data = element.data;
            this._image.src = data.image;
            this._image.alt = data.name;
            this._name.textContent = data.name;
            this._bio.textContent = data.bio;

            this._content.scrollTop = 0;

            // Wait for layout to be run with new image, name and bio before reading from the dom
            // to prevent forced reflow (aka forced synchronous layout)
            requestAnimationFrame(() => {
                this.onResize();

                // Again, wait for layout to be run on newly resized content before reading
                requestAnimationFrame(() => this._transitionIn(element));
            });
        } else if (oldElement) {
            this._transitionOut(oldElement);
        } else {
            this.classList.remove("person-detail--open");
        }

        if (!!oldElement === !element) {
            const event = new CustomEvent("ijs-person-detail-toggle", {
                detail: { isOpen: !!element },
                bubbles: true
            });

            this.dispatchEvent(event);
        }
    }

    onClose() {
        // Wait a frame so the click event doesn't fall through to whatever is behind the dialog
        requestAnimationFrame(() => {
            this.personElement = null;
        });
    }

    onResize() {
        if (!this.personElement || this.classList.contains("person-detail--transitioning")) return;

        // Read sizes of original element
        const personRect = this.personElement.getBoundingClientRect();
        const personWidth = personRect.width;
        const personFontSize = this._getStylePropValuePx("--person-name-font-size");
        const personNamePadding = this._getStylePropValuePx("--person-name-padding");

        // Calculate ratio and component sizes.
        const detailRect = this._wrapper.getBoundingClientRect();
        const detailWidth = detailRect.width;
        const detailRatio = detailWidth / personWidth;
        const detailFontSize = personFontSize * detailRatio;
        const detailNamePadding = personNamePadding * detailRatio;

        // Set new sizes only after all dom reads are done
        this._imageContainer.style.height = `${detailWidth}px`;
        this._name.style.fontSize = `${detailFontSize}px`;
        this._name.style.padding = `${detailNamePadding}px`;
    }

    _transitionIn(element) {
        const transitionDone = IJSPersonDetail._doneTransitioning(this, "opacity");
        this.classList.add("person-detail--transitioning");

        element.expandTo(this._imageContainer.getBoundingClientRect(), transitionDone);
        IJSPersonDetail._doneTransitioning(element, "transform").then(() => {
            this.classList.add("person-detail--open");
        });

        transitionDone.then(() => {
            this.classList.remove("person-detail--transitioning");
        });
    }

    _transitionOut(oldElement) {
        const transitionDone = IJSPersonDetail._doneTransitioning(oldElement, "transform");
        this.classList.add("person-detail--transitioning");

        this.classList.remove("person-detail--open");
        oldElement.contractFrom(this._imageContainer.getBoundingClientRect(),
                                IJSPersonDetail._doneTransitioning(this, "opacity"),
                                transitionDone);

        transitionDone.then(() => {
            this.classList.remove("person-detail--transitioning");
        });
    }

    _getStylePropValuePx(propName) {
        const styles = window.getComputedStyle(this.personElement);
        const valueStr = styles.getPropertyValue(propName);
        const match = valueStr.match(/(\d+)px/)[1];
        return +match;
    }
}

customElements.define("ijs-person-detail", IJSPersonDetail);
