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

        this._isFetching = false;
        this.sourceURL = sourceURL;
        this._personTemplate = document.querySelector("link#person-view").import
            .querySelector("#person-tmpl");
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
                    name.textContent = personData.name;

                    documentFragment.appendChild(personView);
                }

                this.appendChild(documentFragment);
                this._isFetching = false;
            });
    }
}

customElements.define("ijs-person-grid", IJSPersonGrid);