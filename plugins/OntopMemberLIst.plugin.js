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
		const name = member.querySelector('span.username-i5-wv-').firstChild.textContent;
		if (name.includes('Guilliano')) {
			member.classList.add('ontop');
		}
	}
}

module.exports = class Plugin {
	start() {putOntop();}

	observer(membersList) {
		if (root.querySelector(".ontop") === null) {
			putOntop();
		}
	}

	stop() {}
}
