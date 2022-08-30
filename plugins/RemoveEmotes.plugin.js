/**
 * @name Remove Emotes
 * @author Level 4
 * @description removes emotes from anywhere!
 * @version 1.0.3
 */

const chatBox = document.querySelector('[data-list-id="chat-messages"]');
const blackLisedEmotes = ["thisguy", "unko"];

function checkMessagesForEmotes() {
    const root = document.getElementById('app-mount');
    const allMessages = root.querySelectorAll(".messageListItem-ZZ7v6g");
    const reactionSelect = root.querySelectorAll(".reactionInner-YJjOtT");
    for (const blackList of blackLisedEmotes) {
        for (const selectedMessage of allMessages) {
            for (const reaction of reactionSelect) {
                if (reaction.getAttribute('aria-label').includes(blackList)) {
                    const reactionCount = selectedMessage.querySelector('.reactions-3ryImn');
                    reaction.closest('.reaction-3vwAF2').style.display = "none";
                    reaction.closest('.reaction-3vwAF2').setAttribute("data-removed", "removed");
                    if (reactionCount !== null) {
                        if (reactionCount.childElementCount === reactionCount.querySelectorAll(`[data-removed="removed"]`).length + 1) {
                            reactionCount.style.display = "none";
                            selectedMessage.querySelector('.container-2sjPya').style.padding = "0px";
                        } else {
                            reactionCount.style.display = "flex";
                            selectedMessage.querySelector('.container-2sjPya').style.paddingBottom = "4px";
                        }
                    }
                }
            }

            if (selectedMessage.querySelector(`[src*="size=96&"][alt*=${CSS.escape(blackList)}]`)) {
                selectedMessage.style.display = 'none';
                if (!selectedMessage.getAttribute('style').includes('list-item')) {
                    selectedMessage.style.display = 'none';
                }
                if (selectedMessage.getAttribute('style')) {
                    const userID = selectedMessage.querySelector('div');
                    const checkNextID = selectedMessage.nextElementSibling.querySelector('div');
                    if (userID !== null && checkNextID !== null) {
                        if (userID.getAttribute('data-author-id') === checkNextID.getAttribute('data-author-id') && userID.getAttribute('class').includes('groupStart')) {
                            selectedMessage.style.display = 'list-item';
                        }
                    }
                }
            }
        }
    }
}

module.exports = class Plugin {
    start() {
        BdApi.injectCSS("Remove-Emotes", `
        [style$="list-item;"] div div .markup-eYLPri.messageContent-2t3eCI{
            display: none;
        }

        li[style$="list-item;"] > div {
            min-height: 0 !important;
            padding-bottom: 0!important;
        }`);

        const removeEmoteStyle = document.getElementById('Remove-Emotes');
        for (const dissappearingEmote of blackLisedEmotes) {
            let style = `[alt*=${CSS.escape(dissappearingEmote)}]{display: none;}`;
            removeEmoteStyle.appendChild(document.createTextNode(style));
        }
    }

    observer(chatBox) {
        checkMessagesForEmotes();
    }

    stop() {
        BdApi.clearCSS("Remove-Emotes");
    }
}
