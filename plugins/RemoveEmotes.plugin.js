/**
 * @name Remove Emotes
 * @author Level 4
 * @description removes emotes from anywhere!
 * @version 1.0.2
 */

const chatBox = document.querySelector('[data-list-id="chat-messages"]');

function checkMessagesForEmotes() {
    const selectedScroller = document.getElementById('app-mount');
    const allMessages = selectedScroller.querySelectorAll(".messageListItem-ZZ7v6g");
    const reactionSelect = selectedScroller.querySelectorAll(".reactionInner-YJjOtT");
    for (const selectedMessage of allMessages) {
        for (const reaction of reactionSelect) {
            if (reaction.getAttribute('aria-label').includes("thisguy")) {
                const reactionCount = selectedMessage.querySelector('.reactions-3ryImn');
                reaction.closest('.reaction-3vwAF2').style.display = "none";
                if (reactionCount !== null) {
                    if (reactionCount.childElementCount === 2 && reactionCount.querySelector('[alt*="thisguy"]')) {
                        reactionCount.style.display = "none";
                        selectedMessage.querySelector('.container-2sjPya').style.padding = "0px";
                    } else {
                        reactionCount.style.display = "flex";
                        selectedMessage.querySelector('.container-2sjPya').style.paddingBottom = "4px";
                    }
                }
            }
        }

        if (selectedMessage.querySelector('[src*="size=96&"][alt*="thisguy"]')) {
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

module.exports = class ExamplePlugin {
    start() {
    }

    observer(chatBox) {
        checkMessagesForEmotes();
    }

    stop() {
    }
}
