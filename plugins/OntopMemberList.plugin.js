/**
 * @name OntopMemberList
 * @author Level 4
 * @authorLink https://github.com/Level004
 * @description Puts spesific users on top of the members list with a special header
 * @source https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/OntopMemberList.plugin.js
 * @version 2.2.3
 */

const config = {
    info: {
        name: "OntopMemberList",
        invite: "",
        authors: [
            {
                name: "Level 4",
                github_username: "Level004"
            }
        ],
        authorLink: "https://github.com/Level004",
        version: "2.2.3",
        description: "Puts spesific users on top of the members list with a special header might not work if you're too far down the members list",
        github: "https://github.com/Level004/BetterDiscordstuff/blob/main/plugins/OntopMemberList.plugin.js",
        github_raw: "https://raw.githack.com/Level004/BetterDiscordstuff/main/plugins/OntopMemberList.plugin.js"
    },
    changelog: [
        {
            title: "2.2.3",
            type: "improved",
            items: [
                "Changed class names, thanks discord"
            ]
        },
        {
            title: "2.1.0",
            type: "improved",
            items: [
                "Overhaul because discord now can use :has()"
            ]
        }
    ],
    defaultConfig: [
        {
            type: "category",
            id: "content",
            name: "On top Members List",
            collapsible: false,
            shown: true,
            settings: [
                {
                    type: "textbox",
                    id: "users",
                    name: "Users",
                    note: "put the IDs of the users in here seperate with a , per ID",
                    value: "",
                    placeholder: "id1,id2,id3"
                },
                {
                    type: "textbox",
                    id: "header",
                    name: "Header",
                    note: "the name of the header",
                    value: "",
                    placeholder: "apple"
                }
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

        const { PluginUtilities } = Library;

        function addHeader(headerStyle) {
            const loadedData = PluginUtilities.loadSettings(config.info.name);
            let usersToPutOnTop;
            let headerName;
            if (Object.keys(loadedData).length > 0) {
                usersToPutOnTop = loadedData.content.users.split(',');
                headerName = loadedData.content.header;
            } else {
                return;
            }

            headerStyle.innerHTML = '';

            let ammount = 0;
            const listUsers = document.querySelectorAll("[class='member_a31c43 member_cbd271 container_d808b0 clickable_d808b0']");
            for (const currentUser of listUsers) {
                if (usersToPutOnTop.some(user => currentUser.querySelector(`.avatar_c51b4e[src*=${CSS.escape(user)}]`))) {
                    ammount++;
                }
            }

            headerStyle.innerHTML = `:root { --header-name: "${headerName}"; --header-count: "${ammount}"; }`
        }

        function putUsersOntop(ontopStyle) {
            const loadedData = PluginUtilities.loadSettings(config.info.name);
            let usersToPutOnTop;
            if (Object.keys(loadedData).length > 0) {
                usersToPutOnTop = loadedData.content.users.split(',');
            } else {
                return;
            }

            ontopStyle.innerHTML = '';
            const listUsers = document.querySelectorAll("[class='member_a31c43 member_cbd271 container_d808b0 clickable_d808b0']");
            let topUser = 0;

            for (const user of usersToPutOnTop) {
                if (!ontopStyle.textContent.includes(user)) {
                    const style = `.members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div h3:has(+ .member_a31c43 img[src*='${(user)}']):has(+ div + h3) { display: none; } .members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div .member_a31c43:not(.offline_a31c43):has(img[src*='${(user)}']) { order: -1; }`
                    ontopStyle.appendChild(document.createTextNode(style));
                }
            }

            for (const currentUser of listUsers) {
                if (usersToPutOnTop.some(user => currentUser.querySelector(`.avatar_c51b4e[src*=${CSS.escape(user)}]`))) {
                    if (topUser === 0) {
                        const firstUser = currentUser.querySelector('.avatar_c51b4e').src;
                        const user = firstUser.match(/\/(avatars\/(\d{18,})|\d{18,}\/avatars)\//);
                        let style = `
                            .members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div .member_a31c43:has(img[src*='${(user[1])}']) { padding-top: 41px; }
                            .members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div .member_a31c43:has(img[src*='${(user[1])}'])::before { position: absolute; top: 0; display: block; content: var(--header-name, "user") " — " var(--header-count, "1") ; font-family: var(--font-primary); font-weight: 500; font-size: 12px; letter-spacing: 0.24px; line-height: 16px; text-overflow: ellipsis; text-transform: uppercase; vertical-align: baseline; white-space: nowrap; color: rgb(210, 210, 210); padding: 24px 0 0 6px; }
                        `;
                        ontopStyle.appendChild(document.createTextNode(style));
                        topUser = 1;
                    }
                }
            }
        }

        var membersListObserver;

        return class OntopMemberList extends Plugin {

            onStart() {
                BdApi.injectCSS("OntopMemberList-header-root", '')
                BdApi.injectCSS("OntopMemberList-order", '')
                BdApi.injectCSS("OntopMemberList", '.members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div { display: flex; flex-direction: column; } .membersGroup_cbd271 { box-sizing: content-box; min-height: 19px; max-height: 19px; } div.content_eed6a8[aria-label="Members"] { min-height: 139% !important; }');
                const headerStyle = document.getElementById('OntopMemberList-header-root');
                const onTopStyle = document.getElementById('OntopMemberList-order');
                addHeader(headerStyle);
                putUsersOntop(onTopStyle);

                membersListObserver = new MutationObserver((mutationsList, observer) => {
                    addHeader(headerStyle);
                    putUsersOntop(onTopStyle);
                });

                membersListObserver.observe(document.querySelector(".members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div"), { attributes: false, childList: true, subtree: true });
            }

            onStop() {
                BdApi.clearCSS("OntopMemberList-header-root");
                BdApi.clearCSS("OntopMemberList-order");
                BdApi.clearCSS("OntopMemberList");
                if (membersListObserver) membersListObserver.disconnect();
            }

            onSwitch() {
                const headerStyle = document.getElementById('OntopMemberList-header-root');
                const onTopStyle = document.getElementById('OntopMemberList-order');
                addHeader(headerStyle);
                putUsersOntop(onTopStyle);

                membersListObserver = new MutationObserver((mutationsList, observer) => {
                    addHeader(headerStyle);
                    putUsersOntop(onTopStyle);
                });

                membersListObserver.observe(document.querySelector(".members_cbd271.thin_eed6a8.scrollerBase_eed6a8.fade_eed6a8 > div"), { attributes: false, childList: true, subtree: true });
            }

            getSettingsPanel() {
                const panel = this.buildSettingsPanel();
                return panel.getElement();
            }
        };

    };
    return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
