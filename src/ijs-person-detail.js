/**
 * ijs-person-detail.js
 *
 * Created by Zander Otavka on 11/17/16.
 */

class IJSPersonDetail extends HTMLElement {
    static get observedAttributes() {
        return ["is-open"];
    }

    constructor() {
        super();

        this.personElement = null;
        this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    connectedCallback() {
        this._wrapper = this.querySelector(".person-detail__wrapper");
        this._closeButton = this.querySelector(".person-detail__close-button");
        this._imageContainer = this.querySelector(".person-detail__image-container");
        this._image = this.querySelector(".person-detail__image");
        this._name = this.querySelector(".person-detail__name");
        this._bio = this.querySelector(".person-detail__bio");

        this._closeButton.addEventListener("click", this.onCloseButtonClick);
        window.addEventListener("resize", this.onResize);

        this.onResize();
    }

    disconnectedCallback() {
        this._closeButton.removeEventListener("click", this.onCloseButtonClick);
        window.removeEventListener("resize", this.onResize);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "is-open":
                this.isOpen = newVal !== null;
                break;
        }
    }

    get isOpen() {
        return this._isOpen;
    }

    set isOpen(isOpen) {
        this._isOpen = isOpen;

        this.classList.add("person-detail--transitioning");
        const stopTransitioning = () => {
            this.classList.remove("person-detail--transitioning");
            this.removeEventListener("transitionend", stopTransitioning);
        };
        this.addEventListener("transitionend", stopTransitioning);

        if (isOpen) {
            this.setAttribute("is-open", "");
        } else {
            this.removeAttribute("is-open");
        }
    }

    get personElement() {
        return this._personElement;
    }

    set personElement(element) {
        this._personElement = element;

        if (element) {
            const data = element.data;
            this._image.src = data.image;
            this._name.textContent = data.name;
            this._bio.textContent = data.bio;
            element.expandTo(this._imageContainer.getBoundingClientRect());
        }
    }

    onCloseButtonClick() {
        this.isOpen = false;
        this.personElement.contract();
    }

    onResize() {
        const rect = this._wrapper.getBoundingClientRect();
        this._imageContainer.style.height = `${rect.width}px`;

        const smallWidth = 200;
        const smallFontSize = 18;
        const bigFontSize = (smallFontSize / smallWidth) * rect.width;
        this._name.style.fontSize = `${bigFontSize}px`;
    }
}

customElements.define("ijs-person-detail", IJSPersonDetail);