/**
 * ijs-person-detail.js
 *
 * Created by Zander Otavka on 11/17/16.
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

    constructor() {
        super();
        this._personElement = null;

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

        this._closeButton.addEventListener("click", this.onClose);
        this._background.addEventListener("click", this.onClose);
        window.addEventListener("resize", this.onResize);

        this.onResize();
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

        if (element) {
            const data = element.data;
            this._image.src = data.image;
            this._name.textContent = data.name;
            this._bio.textContent = data.bio;

            this._content.scrollTop = 0;

            requestAnimationFrame(() => {
                this.onResize();
                requestAnimationFrame(() => this._transitionIn(element));
            });
        } else if (oldElement) {
            this._transitionOut(oldElement);
        } else {
            this.classList.toggle("person-detail--open", false);
        }
    }

    onClose() {
        this.personElement = null;
    }

    onResize() {
        if (!this.personElement) return;

        const personRect = this.personElement.getBoundingClientRect();
        const personWidth = personRect.width;
        const personFontSize = this._getStylePropValuePx("--person-name-font-size");
        const personNamePadding = this._getStylePropValuePx("--person-name-padding");

        const detailRect = this._wrapper.getBoundingClientRect();
        const detailWidth = detailRect.width;
        const detailRatio = detailWidth / personWidth;
        const detailFontSize = personFontSize * detailRatio;
        const detailNamePadding = personNamePadding * detailRatio;

        this._imageContainer.style.height = `${detailWidth}px`;
        this._name.style.fontSize = `${detailFontSize}px`;
        this._name.style.padding = `${detailNamePadding}px`;
    }

    _transitionIn(element) {
        const transitionDone = IJSPersonDetail._doneTransitioning(this, "opacity");
        this.classList.toggle("person-detail--transitioning", true);

        element.expandTo(this._imageContainer.getBoundingClientRect(), transitionDone);
        IJSPersonDetail._doneTransitioning(element, "transform").then(() => {
            this.classList.toggle("person-detail--open", true);
        });

        transitionDone.then(() => {
            this.classList.toggle("person-detail--transitioning", false);
        });
    }

    _transitionOut(oldElement) {
        const transitionDone = IJSPersonDetail._doneTransitioning(oldElement, "transform");
        this.classList.toggle("person-detail--transitioning", true);

        this.classList.toggle("person-detail--open", false);
        oldElement.contractFrom(this._imageContainer.getBoundingClientRect(),
                                IJSPersonDetail._doneTransitioning(this, "opacity"),
                                transitionDone);

        transitionDone.then(() => {
            this.classList.toggle("person-detail--transitioning", false);
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