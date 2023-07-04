/**
 * @name Remove Emotes
 * @author Level 4
 * @authorLink https://github.com/Level004
 * @description removes emotes from anywhere!
 * @source https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/RemoveEmotes.plugin.js
 * @version 1.1.4
 */

const config = {
    info: {
        name: "RemoveEmotes",
        invite: "",
        authors: [
            {
                name: "Level 4",
                github_username: "Level004"
            }
        ],
        authorLink: "https://github.com/Level004",
        version: "1.1.4",
        description: "Removes emotes from anywhere!",
        github: "https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/RemoveEmotes.plugin.js",
        github_raw: "https://raw.githack.com/Level004/BetterDiscordstuff/main/plugins/RemoveEmotes.plugin.js"
    },
    changelog: [
        {
            title: "1.1.4",
            type: "improved",
            items: [
                "figured out how to do new stuff"
            ]
        }
    ],
    defaultConfig: [
        {
            type: "category",
            id: "removedEmotes",
            name: "Removed Emotes",
            collapsible: false,
            shown: true,
            settings: [
                {
                    type: "textbox",
                    id: "emotes",
                    name: "",
                    note: "Put the emote names next to eachother with a comma so like this:   emote1,emote2,emote3",
                    value: "",
                    placeholder: "Emotes"
                },
                {
                    type: "textbox",
                    id: "useremotes",
                    name: "",
                    note: "Put the IDs of the users that you want to remove all emotes from. Sperate them with commas like with the emotes",
                    value: "",
                    placeholder: "User IDs"
                },
            ]
        },
    ]
};

if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                } else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}

const chatBox = document.querySelector('[data-list-id="chat-messages"]');

function checkMessagesForEmotes(emoteToBlock) {
    const root = document.getElementById('app-mount');
    const allMessages = root.querySelectorAll(".messageListItem-ZZ7v6g");
    const reactionSelect = root.querySelectorAll(".reactionInner-YJjOtT:not(.reaction-3vwAF2.reactionInner-YJjOtT.reactionMe-1PwQAc):not(.reaction-3vwAF2.reactionInner-YJjOtT)");
    for (const blackList of emoteToBlock) {
        for (const selectedMessage of allMessages) {
            for (const reaction of reactionSelect) {
                if (reaction.getAttribute('aria-label').includes(blackList)) {
                    const reactionCount = selectedMessage.querySelector('.reactions-3ryImn');
                    reaction.closest('.reaction-3vwAF2').style.display = "none";
                    reaction.closest('.reaction-3vwAF2').setAttribute("data-removed", "removed");
                    if (reactionCount !== null) {
                        if (reactionCount.childElementCount === reactionCount.querySelectorAll(`[data-removed="removed"]`).length + 3) {
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

                if (selectedMessage.getAttribute('style')) {
                    const userID = selectedMessage.querySelector('div');
                    const checkNextID = selectedMessage.nextElementSibling.querySelector('div');
                    if (userID !== null && checkNextID !== null) {
                        if (userID.querySelector('img.avatar-2e8lTP') !== checkNextID.querySelector('img.avatar-2e8lTP') && userID.getAttribute('class').includes('groupStart') && !checkNextID.querySelector(`[src*="size=96&"][alt*=${CSS.escape(blackList)}]`)) {
                            selectedMessage.style.display = 'list-item';
                        }
                    }
                }
            }
        }
    }
}

function removeEmotesFromUsers(users) {
    const root = document.getElementById('app-mount');
    const allMessages = root.querySelectorAll(".messageListItem-ZZ7v6g");
    for (const message of allMessages) {
        for (const user of users) {
            const currentUserId = message.querySelector(`.avatar-2e8lTP[src*=${CSS.escape(user)}]`);
            const hasId = message.querySelector('img.avatar-2e8lTP');
            if (currentUserId || message.previousElementSibling.classList.contains('emoteBlock') && !hasId) {
                message.classList.add('emoteBlock');
            }

            if (message.classList.contains('emoteBlock') && message.querySelector('[src*="size=96&"]')) {
                message.style.display = 'none';
                if (message.querySelector('div').getAttribute('class').includes('groupStart')){
                    message.style.display = 'list-item';
                }
            }
        }
    }
}

class emoteRemover {
    constructor() {
        this._config = config;
    }

    start() {
    }

    stop() {
    }
}


module.exports = !global.ZeresPluginLibrary ? emoteRemover : (([Plugin, Api]) => {
    const plugin = (Plugin, Library) => {

        const {PluginUtilities} = Library;
        let loadedData = PluginUtilities.loadSettings(config.info.name);
        let blackLisedEmotes = loadedData.removedEmotes.emotes.split(',');
        let blackListedUsers = loadedData.removedEmotes.useremotes.split(',');

        return class RemoveEmotes extends Plugin {

            onStart() {
                if (this.settings.has_seen_settings !== undefined) {
                    BdApi.showToast(`${config.info.name} plugins is running, you have to change the plugin settings to make it do something`,
                        {
                            type: "success",
                            icon: true,
                            timeout: 13000
                        }
                    );
                }
                BdApi.injectCSS("Remove-Emotes", `
                    [style$="list-item;"] div div .markup-eYLPri.messageContent-2t3eCI{
                        display: none;
                    }
            
                    li[style$="list-item;"] > div {
                        min-height: 0 !important;
                        padding-bottom: 0!important;
                    }
                    li:not(li.emoteBlock) + .emoteBlock[style$="list-item;"],
                    .emoteBlock .emojiContainer-2XKwXX{
                        display: none !important;
                    }`);
                const removeEmoteStyle = document.getElementById('Remove-Emotes');
                for (const dissappearingEmote of blackLisedEmotes) {
                    let style = `[alt*=${CSS.escape(dissappearingEmote)}]{display: none;}`;
                    removeEmoteStyle.appendChild(document.createTextNode(style));
                }}

            observer() {
                const newData = PluginUtilities.loadSettings(config.info.name);
                if (newData.removedEmotes.emotes !== loadedData.removedEmotes.emotes) {
                    loadedData = newData;
                    blackLisedEmotes = newData.removedEmotes.emotes.split(',');
                    blackListedUsers = loadedData.removedEmotes.useremotes.split(',');
                }
                checkMessagesForEmotes(blackLisedEmotes);
                removeEmotesFromUsers(blackListedUsers);
            }

            onStop() {
                BdApi.clearCSS("Remove-Emotes");
            }

            getSettingsPanel() {
                BdApi.setData(config.info.name, 'has_seen_settings', true);
                const panel = this.buildSettingsPanel();
                return panel.getElement();
            }
        };

    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));