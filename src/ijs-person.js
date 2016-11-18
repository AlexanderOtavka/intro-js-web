/**
 * ijs-person.js
 *
 * Created by Zander Otavka on 11/17/16.
 */

class IJSPerson extends HTMLElement {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    connectedCallback() {
        this.addEventListener("click", this.onClick);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.onClick);
    }

    onClick(event) {
        const clickEvent = new CustomEvent("ijs-person-click", {
            detail: { data: this.data },
            bubbles: true
        });
        this.dispatchEvent(clickEvent);
    }

    expandTo(otherRect, endDelayDone) {
        this.classList.toggle("person--transitioning", true);

        this.style.transform = this._getTransformFor(otherRect);

        endDelayDone.then(() => {
            this.classList.toggle("person--transitioning", false);
            this.classList.toggle("person--expanded", true);
            this.style.transform = "none";
        });
    }

    contractFrom(otherRect, delayDone, transitionDone) {
        this.classList.toggle("person--expanded", false);

        this.style.transform = this._getTransformFor(otherRect);

        requestAnimationFrame(() => {
            this.classList.toggle("person--transitioning", true);

            delayDone.then(() => {
                this.style.transform = "none"
            });

            transitionDone.then(() => {
                this.classList.toggle("person--transitioning", false)
            });
        });
    }

    _getTransformFor(otherRect) {
        const thisRect = this.getBoundingClientRect();

        const thisCenterX = (thisRect.left + thisRect.right) / 2;
        const thisCenterY = (thisRect.top + thisRect.bottom) / 2;
        const otherCenterX = (otherRect.left + otherRect.right) / 2;
        const otherCenterY = (otherRect.top + otherRect.bottom) / 2;
        const dx = otherCenterX - thisCenterX;
        const dy = otherCenterY - thisCenterY;

        const scaleX = otherRect.width / thisRect.width;
        const scaleY = otherRect.height / thisRect.height;

        return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    }
}

customElements.define("ijs-person", IJSPerson);