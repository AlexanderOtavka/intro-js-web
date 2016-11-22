/**
 * event-handlers.js
 *
 * Created by Zander Otavka on 11/17/16.
 */

document.addEventListener("ijs-person-click", event => {
    const personDetail = document.querySelector("#person-detail");
    const person = event.target;

    personDetail.personElement = person;
});

document.addEventListener("ijs-person-detail-toggle", event => {
    const isOpen = event.detail.isOpen;

    const header = document.querySelector(".header");
    header.setAttribute("aria-hidden", isOpen ? "true" : "false");
    header.inert = isOpen;

    const main = document.querySelector(".main");
    main.setAttribute("aria-hidden", isOpen ? "true" : "false");
    main.inert = isOpen;
});
