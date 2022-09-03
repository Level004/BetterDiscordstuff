/**
 * @name Put me ontop
 * @author Level 4
 * @description put me ontop the members list
 * @version 1.0.1
 */

const root = document.getElementById('app-mount');

function createLabel(){
    const membersList = root.querySelector('.content-2a4AW9[role="list"]');
    const h2 = document.createElement('h2');
    const span =document.createElement('span');
    h2.classList.add("membersGroup-2eiWxl","container-q97qHp", "ontop");
    span.setAttribute('aria-hidden', "true");
    span.textContent = "Guilliano — 1";
    membersList.append(h2);
    h2.append(span);
}

function putOntop() {
    const members = root.querySelectorAll(".member-2gU6Ar.container-1oeRFJ.clickable-28SzVr");
    for (const member of members) {
        const name = member.querySelector('span.username-i5-wv-').firstChild.textContent;
        if (name.includes('Guilliano')){
            createLabel();
            member.classList.add('ontop');
        }
    }
}

module.exports = class Plugin {
    start() {
        putOntop();
    }

    onSwitch() {
        putOntop();
    }

    stop() {
    }
}