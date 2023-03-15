const build = {
    servers() {
        return new Promise(async function (resolve, reject) {
            if (!data.existe("server")) {
                data.establecer("server", "settings")
            }
            let guilds = loggeduser.guilds
            let list = []
            guilds.forEach(guild => {
                list.push({
                    separator: false,
                    id: guild.id,
                    img: {
                        src: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=128`,
                        id: `${guild.id}_icon`
                    },
                    name: guild.name
                })
            })
            list = list.sort((x, y) => parseInt(x.id) - parseInt(y.id));
            list = list.reverse()
            list.push({
                separator: true
            })
            list.push({
                separator: false,
                id: "settings",
                img: {
                    src: "./media/png/catto.png",
                    id: "cattopfp"
                },
                name: "Ajustes"
            })
            list = list.reverse()
            let procesado = []
            list.forEach(e => {
                if (e.separator) {
                    procesado.push('<div class="separator"></div>')
                } else {                                                                          // Cambiar a "false":"true" cuándo se arregle el reorganizador de servidores
                    procesado.push(`<div ${e.id ? `id="${e.id}"` : ""} draggable="${e.id == "settings" ? "false" : "false"}" onclick="goServer('${e.id}')" ${data.obtener("server") == e.id ? 'class="selected"' : ''}><img draggable="false" src="${e.img.src}" ${e.img.id ? `id="${e.img.id}"` : ""} alt="${e.name}" title="${e.name}"></div>`)
                }
            })
            procesado.push('<div class="new"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"></path></svg></div>')
            document.querySelector(".servers").innerHTML = procesado.join("\n")
        
            resolve()
        });
    },
    contextMenu() {
        return new Promise(async function (resolve, reject) {
            var contextMenu = document.getElementById("ctm");
            contextMenu.style.visibility = "hidden"
            window.oncontextmenu = function (e) {
                contextMenu.style.visibility = "hidden"
                if (e.target.id.endsWith("_icon")) {
                    contextMenu.style.visibility = "visible"
                    contextMenu.style.top = `${e.clientY}px`
                    contextMenu.style.left = `${e.clientX}px`
                    window.addEventListener("click", function (e) {
                        if (!contextMenu.contains(e.target)) {
                            contextMenu.style.visibility = "hidden"
                            window.removeEventListener("click", this)
                        }
                    })
                }
                return false
            }

            resolve()
        });
    },

    /**
     * @param {string} type
     */

    async options(type) {
        return new Promise(async function (resolve, reject) {
            const menu = await require("base/builders/menus.json", true)
            var array = undefined
            document.querySelector(".items").innerHTML = ""
            if (type == "server") {
                let useradmin = true;
                document.querySelector(".title p").innerHTML = data.obtener("server_name")
                menu.server.forEach(element => {
                    if (element.separator && (!element.admin || (element.admin && useradmin))) {
                        document.querySelector(".items").innerHTML += `<div class="separator"></div>`
                    } else if (!element.admin || (element.admin && useradmin)) {
                        document.querySelector(".items").innerHTML += `<div class="${element.disabled ? "disabled" : ""}" id="${element.id}" ${element.disabled?"":`onclick="goPage('${element.id}')"`}>${element.svg}<p>${element.title}</p></div>`
                    }
                })
            } else if (type == "settings") {
                document.querySelector(".title p").innerHTML = "Catto y tú"
                menu.settings.forEach(element => {
                    if (element.separator) {
                        document.querySelector(".items").innerHTML += `<div class="separator"></div>`
                    } else {
                        document.querySelector(".items").innerHTML += `<div class="${element.disabled ? "disabled" : ""}" id="${element.id}" ${element.disabled?"":`onclick="goPage('${element.id}')"`}>${element.svg}<p>${element.title}</p></div>`
                    }
                })
            }
            if (data.existe("page")) {
                document.getElementById(data.obtener("page")).classList.add("selected")
            }

            try {
                document.getElementById("ayuda").addEventListener("click", function() {
                    document.getElementById("help_window").style.visibility = "visible"
                    document.getElementById("help_window").style.opacity = "1"
                    document.getElementById("help_window").style.transform = "scale(1)"
                })
            } catch {}
            resolve()
        })
    },
    loginWindow(visible, buttonEnabled, msgList) {
        if (!visible) {
            document.querySelector(".glassmorphism").classList.add("hidden")
        } else {
            document.getElementById("msgList").innerHTML = ""
            document.querySelector(".glassmorphism").classList.remove("hidden")
            if (buttonEnabled==undefined || buttonEnabled) {
                document.querySelector("button.discord").classList.remove("disabled")
            } else {
                document.querySelector("button.discord").classList.add("disabled")
            }
            msgList.forEach(msg => {
                document.getElementById("msgList").innerHTML += `<p class="${msg.class}">${msg.text}</p>`
            })
        }
    }
}