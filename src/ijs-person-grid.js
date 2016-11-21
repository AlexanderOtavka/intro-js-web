/**
 * ijs-person-grid.js
 *
 * Created by Zander Otavka on 11/17/16.
 */

class IJSPersonGrid extends HTMLElement {
    static get observedAttributes() {
        return ["source-url"];
    }

    constructor(sourceURL) {
        super();

        this._sourceURL = sourceURL;
        this._isFetching = false;
        this._endSpacerLength = 0;
        this._personTemplate = document.querySelector("link#person-view").import
            .querySelector("#person-tmpl");

        this.onResize = this.onResize.bind(this);
    }

    connectedCallback() {
        this.fetchPeople();

        window.addEventListener("resize", this.onResize);
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.onResize);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case "source-url":
                this.sourceURL = newVal;
                break;
        }
    }

    get sourceURL() {
        return this._sourceURL;
    }

    set sourceURL(sourceURL) {
        this._sourceURL = sourceURL;
        this.fetchPeople();
    }

    fetchPeople() {
        if (!this.sourceURL || this._isFetching) return;

        this._isFetching = true;

        while (this.firstChild) {
            this.firstChild.remove();
        }

        fetch(this.sourceURL)
            .then(response => response.json())
            .then(people => {
                const documentFragment = document.createDocumentFragment();

                for (const personData of people) {
                    const personView = document.importNode(this._personTemplate.content, true);
                    const personElement = personView.querySelector(".person");
                    const image = personView.querySelector(".person__image");
                    const name = personView.querySelector(".person__name");

                    personElement.data = personData;
                    image.src = personData.image;
                    image.alt = personData.name;
                    name.textContent = personData.name;

                    documentFragment.appendChild(personView);
                }

                this.appendChild(documentFragment);
                this._isFetching = false;

                // Wait a frame for layout to rerun on the new elements
                requestAnimationFrame(() => this.onResize());
            });
    }

    onResize() {
        const personCount = this.querySelectorAll("ijs-person").length;
        if (personCount === 0) return;

        const width = this.getBoundingClientRect().width;
        const personWidth = +window.getComputedStyle(this)
            .getPropertyValue("--person-size")
            .match(/(\d+)px/)[1];

        const rowLength = Math.floor(width / personWidth);
        const lastRowLength = personCount % rowLength;
        const newEndSpacerLength = (lastRowLength === 0) ? 0 : rowLength - lastRowLength;

        if (newEndSpacerLength === this._endSpacerLength) return;
        this._endSpacerLength = newEndSpacerLength;

        let spacers = this.querySelectorAll(".person-grid__spacer");
        for (let i = spacers.length; i > newEndSpacerLength; i--) {
            spacers[i - 1].remove();
        }

        const documentFragment = document.createDocumentFragment();
        for (let i = spacers.length; i < newEndSpacerLength; i++) {
            const spacer = document.createElement("div");
            spacer.classList.add("person-grid__spacer", "person");
            documentFragment.appendChild(spacer);
        }

        this.appendChild(documentFragment);
    }
}

customElements.define("ijs-person-grid", IJSPersonGrid);