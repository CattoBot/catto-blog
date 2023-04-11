window.onload = async function () {
    await indexedDB.startDB()
    loadcontent()
    loadChecked()
    document.getElementById("saveCheck").addEventListener("change", savedOrNot)
    await sleep(500)
    destroyLoader()
}

function goback() {
    if (history.length > 1) return history.back()
    window.location = "../"
}

async function loadcontent() {
    const id = window.location.href.split("?")[1]
    const jsonContent = await require("./json/posts.json", true)
    const item = jsonContent.help.filter(item => item.id == id)[0]

    if (!item) return document.getElementById("secondInfoColumn").style.opacity = 0

    const labels = document.getElementById("labels")
    labels.innerHTML = `<li>${item.labels.join("</li><li>")}</li>`

    const username = document.getElementById("uthorname")
    username.innerHTML = item.author.name

    const pfp = document.getElementById("pfp")
    pfp.src = item.author.pfp

    const updatedate = document.getElementById("updatedate")
    const date = new Date(item.updates[item.updates.length - 1].unix * 1000)
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    updatedate.innerHTML = `${date.getDate()} ${meses[date.getMonth()]}, ${date.getFullYear()}`

    const content = document.getElementById("content")
    content.innerHTML = `<h1>${item.title}</h1>`
    item.content.forEach(e => {
        if (e.type == "text") content.innerHTML += `<p>${e.text.replace(/\\n+/g, "<br>")}</p>`
        if (e.type == "title") content.innerHTML += `<h3>${e.text.replace(/\\n+/g, "<br>")}</h3>`
        if (e.type == "img") content.innerHTML += `<img src="${e.src}" alt="${e.alt.replace(/\\n+/g, "<br>")}">`
        if (e.type == "a") content.innerHTML += `<a href="${e.href}" target="${e.target}">${e.text.replace(/\\n+/g, "<br>")}</p>`
        if (e.type == "actionRow") {
            // FALTA HACERLO
        }
    });
}

async function require(url, canonical) {
    return new Promise(function (resolve, reject) {
        if (window.location.href.startsWith("http://127.0.0.1:5501/")) {
            fetch(`${canonical ? `http://127.0.0.1:5501/${url}` : `${url}`}`).then(x => {
                resolve(x.json())
            })
        }
        fetch(`${canonical ? `${window.location.href.split("/")[0]}/${url}` : `${url}`}`).then(x => {
            resolve(x.json())
        })
    })
}

async function loadChecked() {
    return new Promise(async function (resolve, reject) {
        const id = window.location.href.split("?")[1]
        let exist = await indexedDB.has("saved", id)
        if (exist) {
            document.getElementById("saveCheck").checked = true
        } else {
            document.getElementById("saveCheck").checked = false
        }
        updateSaved()
        resolve()
    })
}

function updateSaved() {
    document.getElementById("saveCheck").checked ? document.querySelector(".saveLabel").classList.add("checked") : document.querySelector(".saveLabel").classList.remove("checked")
}

async function savedOrNot() {
    updateSaved()
    const id = window.location.href.split("?")[1]
    let exist = await indexedDB.has("saved", id)
    if (document.getElementById("saveCheck").checked && !exist) {
        indexedDB.addElement("saved", { id: id })
    } else if (!document.getElementById("saveCheck").checked && exist) {
        indexedDB.deleteItem("saved", id)
    }
}