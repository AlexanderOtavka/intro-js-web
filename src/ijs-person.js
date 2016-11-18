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

    expandTo(otherRect) {
        const thisRect = this.getBoundingClientRect();

        const thisCenterX = (thisRect.left + thisRect.right) / 2;
        const thisCenterY = (thisRect.top + thisRect.bottom) / 2;
        const otherCenterX = (otherRect.left + otherRect.right) / 2;
        const otherCenterY = (otherRect.top + otherRect.bottom) / 2;
        const dx = otherCenterX - thisCenterX;
        const dy = otherCenterY - thisCenterY;

        const scaleX = otherRect.width / thisRect.width;
        const scaleY = otherRect.height / thisRect.height;

        this.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
        this.classList.add("person--transitioning");
    }

    contract() {
        this.style.transform = "";

        const stopTransitioning = () => {
            this.classList.remove("person--transitioning");
            this.removeEventListener("transitionend", stopTransitioning);
        };
        this.addEventListener("transitionend", stopTransitioning);
    }
}

customElements.define("ijs-person", IJSPerson);