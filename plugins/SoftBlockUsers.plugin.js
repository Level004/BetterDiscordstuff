/**
 * @name Soft Block Users
 * @author Level 4
 * @description Block someone without unfriending them
 * @version 1.0.0
 */

const usersToBlock = ['312537082918731778','431102267077296138'];
const chatBox = document.querySelector('[data-list-id="chat-messages"]');

function blockUser() {
    const root = document.getElementById('app-mount');
    const allMessages = root.querySelectorAll(".messageListItem-ZZ7v6g");
    for (const message of allMessages) {
        for (const user of usersToBlock) {
            const currentUserId = message.querySelector(`.avatar-2e8lTP[src*=${CSS.escape(user)}]`);
            const hasId = message.querySelector('img.avatar-2e8lTP')
            console.log(hasId);
            if (currentUserId) {
                message.classList.add('blocked');
            }

            if (message.previousElementSibling.classList.contains('blocked') && !hasId){
                console.log('hi');
                message.classList.add('blocked');
            }
        }
    }
}

module.exports = class Plugin {
    start() {
        blockUser();
        BdApi.injectCSS("Soft-Block-User", `
        .blocked {
            display: none !important;
        }`);
    }

    observer(chatBox) {
        blockUser();
    }

    stop() {
        BdApi.clearCSS("Soft-Block-User");
    }
}