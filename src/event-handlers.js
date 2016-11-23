/**
 * event-handlers.js
 *
 * Created by Zander Otavka on 11/17/16.
 * Copyright (C) 2016 Zander Otavka.  All rights reserved.
 *
 * Distributed under the GNU General Public License, Version 3.
 * See the accompanying file LICENSE or http://www.gnu.org/licenses/gpl-3.0.txt
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
