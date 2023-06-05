/**
 * @name Put me ontop
 * @author Level 4
 * @description put me ontop the members list
 * @version 1.0.2
 */

const root = document.getElementById('app-mount');
const membersList = root.querySelector('.content-2a4AW9[role="list"]');

function putOntop() {
    const members = root.querySelectorAll(".member-2gU6Ar.container-1oeRFJ.clickable-28SzVr");
    for (const member of members) {
        const id = "314467927799627776";
        const currentId = member.querySelector('.avatarStack-3Bjmsl > img');
        if (currentId.getAttribute('src').includes(id)) {
            member.classList.add('ontop');
        }
    }
}

function removeEmptyRole() {
    const userOnTop = document.querySelector('div[class="member-2gU6Ar member-48YF_l container-1oeRFJ clickable-28SzVr ontop"]')
    const roleHeader = userOnTop.previousSibling;
    if (document.querySelector('h3 + .ontop + h3')) {
        roleHeader.style.display = "none";
    } else if (document.querySelector('h3 + .ontop') && document.querySelector('h3.membersGroup-2eiWxl.container-q97qHp[style="display: none;"]')) {
        roleHeader.style.display = "block";
    } else {
        document.querySelector('h3.membersGroup-2eiWxl.container-q97qHp[style="display: none;"]').style.display = "block";
    }
}


module.exports = class Plugin {
    start() {
        putOntop();
    }

    observer(membersList) {
        if (root.querySelector(".ontop") === null) {
            putOntop();
        }

        if (root.querySelector(".ontop")) {
            removeEmptyRole();
        }
    }

    stop() {}
}
