/**
 * @name BackgroundPerServer
 * @author Level 4
 * @authorLink https://github.com/Level004
 * @description change theme per server. Only works with DevilBro's basic background theme
 * @source https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/BackgroundPerServer.plugin.js
 * @version 1.1.1
 */

const config = {
    info: {
        name: "BackgroundPerServer",
        invite: "",
        authors: [
            {
                name: "Level 4",
                github_username: "Level004"
            }
        ],
        authorLink: "https://github.com/Level004",
        version: "1.1.1",
        description: "change theme per server. Only works with DevilBro's basic background theme",
        github: "https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/BackgroundPerServer.plugin.js",
        github_raw: "https://raw.githack.com/Level004/BetterDiscordstuff/main/plugins/BackgroundPerServer.plugin.js"
    },
    changelog: [
        {
            title: "1.1.1",
            type: "improved",
            items: [
                "now uses on switch instead of messing around with an observer"
            ]
        },
        {
            title: "1.0.0",
            type: "improved",
            items: [
                "release of plugin"
            ]
        },
    ],
    defaultConfig: [
        {
            type: "category",
            id: "content",
            name: "Change Server Backgrounds",
            collapsible: false,
            shown: true,
            settings: [
                {
                    type: "textbox",
                    id: "serverbackgrounds",
                    name: "",
                    note: "put within [] first the server id and then the link to the background like this: SERVER_ID,LINK_TO_BACKGROUND then after add 2 commas and repeat for more servers",
                    value: "",
                    placeholder: "SERVER_ID,LINK_TO_BACKGROUND"
                },
            ]
        },
    ]
};

if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for this plugin is missing. Please click Download Now to install it.`, {
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

class dummy {
    constructor() {
        this._config = config;
    }

    start() {
    }

    stop() {
    }
}


module.exports = !global.ZeresPluginLibrary ? dummy : (([Plugin, Api]) => {
    const plugin = (Plugin, Library) => {

        const {PluginUtilities} = Library;
        let loadedData = PluginUtilities.loadSettings(config.info.name);
        let serverBackgrounds = loadedData.content.serverbackgrounds.split(',,');
        let parsedData = [];
        let refreshSettings;
        let currentGuild = window.location.href;

        for (const data of serverBackgrounds) {
            parsedData.push(data.split(','));
        }

        function applyBackground(style) {
            let set = 0;
            currentGuild = window.location.href;
            for (const entry of parsedData) {
                const serverId = entry[0];
                const background = entry[1];

                if (currentGuild.includes(serverId)) {
                    set = 1;
                }

                if (currentGuild.includes(serverId) && style.textContent.length === 0 || currentGuild.includes(serverId) && !style.textContent.includes(background)) {
                    style.innerHTML = `:root { --background: url('${background}') !important; }`;
                } else if (set !== 1 && style.textContent.length !== 0) {
                    style.innerHTML = '';
                }
            }
        }

        return class BackgroundPerServer extends Plugin {

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
                BdApi.injectCSS("BackgroundPerServer", '');
                const selectedStyle = document.getElementById('BackgroundPerServer');
                applyBackground(selectedStyle);

                refreshSettings = setInterval(function (){
                    loadedData = PluginUtilities.loadSettings(config.info.name);
                    serverBackgrounds = loadedData.content.serverbackgrounds.split(',,');
                    parsedData = [];
                    for (const data of serverBackgrounds) {
                        parsedData.push(data.split(','));
                    }
                }, 5000);
            }

            onStop() {
                BdApi.clearCSS("BackgroundPerServer");
                clearInterval(refreshSettings);
            }

            onSwitch() {
                const selectedStyle = document.getElementById('BackgroundPerServer');
                applyBackground(selectedStyle);
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