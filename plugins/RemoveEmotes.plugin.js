/**
 * @name Remove Emotes
 * @author Level 4
 * @authorLink https://github.com/Level004
 * @description removes emotes from anywhere!
 * @source https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/RemoveEmotes.plugin.js
 * @version 2.0.0
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
        version: "2.0.0",
        description: "Removes emotes from anywhere!",
        github: "https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/RemoveEmotes.plugin.js",
        github_raw: "https://raw.githack.com/Level004/BetterDiscordstuff/main/plugins/RemoveEmotes.plugin.js"
    },
    changelog: [
        {
            title: "2.0.0",
            type: "improved",
            items: [
                "rewrite"
            ]
        },
        {
            title: "1.2.4",
            type: "improved",
            items: [
                "added a feature to block emotes from spesific users"
            ]
        },
        {
            title: "1.1.4",
            type: "improved",
            items: [
                "figured out how to do new stuff"
            ]
        },
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
                    note: "Put the emote names (without the colons) next to eachother with a comma so like this: emote1,emote2,emote3",
                    value: ":apple:",
                    placeholder: "Emotes"
                }
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
        const { PluginUtilities } = Library;

        function addRemovedEmoteStyling(removeEmoteStyle) {
            const loadedData = PluginUtilities.loadSettings(config.info.name);
            let blackLisedEmotes;
            if (Object.keys(loadedData).length > 0) {
                blackLisedEmotes = loadedData.removedEmotes.emotes.split(',');
            } else {
                return;
            }

            for (const dissappearingEmote of blackLisedEmotes) {
                let style = `
                    [aria-label=":${CSS.escape(dissappearingEmote)}:"],
                    .messageListItem__5126c:has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']),
                    .messageListItem__5126c:has(.avatar_c19a55):has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']):has(+ .messageListItem__5126c .avatar_c19a55),
                    .messageListItem__5126c:has(.avatar_c19a55):has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']:only-child):last-of-type,
                    .messageListItem__5126c:has(.avatar_c19a55):has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']):has(+ div.divider__5126c) {
                        display: none;
                    }

                    .messageListItem__5126c:has(.avatar_c19a55):has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']:only-child) {
                        display: block;
                        height: 22px;
                    }

                    .messageListItem__5126c:has(.avatar_c19a55):has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']):has(span.emojiContainer__75abc + span + span.emojiContainer__75abc),
                    .messageListItem__5126c:has(span.emojiContainer__75abc img[aria-label=":${CSS.escape(dissappearingEmote)}:"][src$='?size=96']):has(span.emojiContainer__75abc + span + span.emojiContainer__75abc) {
                        display: block !important;
                        height: 82px;
                    }
                `;

                removeEmoteStyle.appendChild(document.createTextNode(style));
            }
        }

        return class RemoveEmotes extends Plugin {

            onStart() {
                BdApi.injectCSS("Remove-Emotes", '');
                const removeEmoteStyle = document.getElementById('Remove-Emotes');
                addRemovedEmoteStyling(removeEmoteStyle);
            }


            onStop() {
                BdApi.clearCSS("Remove-Emotes");
            }

            getSettingsPanel() {
                const panel = this.buildSettingsPanel();
                return panel.getElement();
            }
        };

    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
