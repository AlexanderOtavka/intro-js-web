/**
 * ijs-person-detail.js
 *
 * Created by Zander Otavka on 11/17/16.
 */

class IJSPersonDetail extends HTMLElement {
    constructor() {
        super();
        this.personElement = null;

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

            const transitionDone = this._doneTransitioning();
            this.classList.toggle("person-detail--transitioning", true);

            element.expandTo(this._imageContainer.getBoundingClientRect(), transitionDone);
            this._doneTransitioning(element).then(() => {
                this.classList.toggle("person-detail--open", true);
            });

            transitionDone.then(() => {
                this.classList.toggle("person-detail--transitioning", false);
            });
        } else if (oldElement) {
            const transitionDone = this._doneTransitioning(oldElement);
            this.classList.toggle("person-detail--transitioning", true);

            this.classList.toggle("person-detail--open", false);
            oldElement.contractFrom(this._imageContainer.getBoundingClientRect(),
                                    this._doneTransitioning(), transitionDone);

            transitionDone.then(() => {
                this.classList.toggle("person-detail--transitioning", false);
            });
        } else {
            this.classList.toggle("person-detail--open", false);
        }
    }

    onClose() {
        this.personElement = null;
    }

    onResize() {
        const rect = this._wrapper.getBoundingClientRect();
        this._imageContainer.style.height = `${rect.width}px`;

        // todo: get values from css
        const smallWidth = 200;
        const smallFontSize = 18;
        const bigFontSize = (smallFontSize / smallWidth) * rect.width;
        this._name.style.fontSize = `${bigFontSize}px`;
    }

    _doneTransitioning(element = this) {
        return new Promise((resolve, reject) => {
            const listener = event => {
                resolve(event);
                element.removeEventListener("transitionend", listener);
            };

            element.addEventListener("transitionend", listener);
        });
    }
}

customElements.define("ijs-person-detail", IJSPersonDetail);