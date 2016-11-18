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
