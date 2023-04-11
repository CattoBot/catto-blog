var mode = 0
const card2Format = `<a onclick="window.location = './page/index.html?%%ID%%'"><div class="card2"><h3 class="card__title">%%TITLE%%</h3><p class="card__content">%%DESCRIPTION%%</p><div class="card__date">%%DATE%%</div><div class="card__arrow"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path></svg></div></div></a>`
const cardFormat = `<a onclick="window.location = './page/index.html?%%ID%%'"><div class="card"><h3 class="card__title">%%TITLE%%</h3><p class="card__content">%%DESCRIPTION%%</p><div class="card__date">%%DATE%%</div><div class="card__arrow"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path></svg></div></div></a>`

window.onload = async function() {
    await indexedDB.startDB()
    resetValues()
    closeSearcher()
    checkModes()
    document.getElementById("searchbar").addEventListener("input", checkSearchBar)
    document.getElementById("titles").addEventListener("change", checkModes)
    document.getElementById("texts").addEventListener("change", checkModes)
    document.getElementById("labels").addEventListener("change", checkModes)
    document.getElementById("all").addEventListener("change", checkModes)
    loadHome()
    destroyLoader()
    setInterval(()=>{window.oncontextmenu = function(){return false}},200)
}

function resetValues() {
    document.getElementById("searchbar").value = "";
    document.getElementById("titles").checked = true;
}

function checkclickOut(e) {
    if (!document.querySelector('.searcher').contains(e.target)) {
        closeSearcher()
    }
}

async function openSearcher() {
    document.getElementById("windows").classList.add("visible")
    await sleep(200)
    window.addEventListener('click', checkclickOut);
}

function closeSearcher() {
    document.getElementById("windows").classList.remove("visible")
    window.removeEventListener("click", checkclickOut, false)
}

async function checkSearchBar() {
    loadResults()
    let sb = document.getElementById("searchbar")
    sb.value!=""?sb.classList.add("filled"):sb.classList.remove("filled")
}

function checkModes() {
    if (document.getElementById("titles").checked) mode = 1
    if (document.getElementById("texts").checked) mode = 2
    if (document.getElementById("labels").checked) mode = 3
    if (document.getElementById("all").checked) mode = 4
    checkSearchBar()
}

async function loadResults() {
    var sb = document.getElementById("searchbar")
    var rd = document.getElementById("resultsDiv")
    sb.value==""?document.getElementById("resultsDiv").classList.add("hidden"):document.getElementById("resultsDiv").classList.remove("hidden")
    const content = await require("./json/posts.json", true)
    let elements = []
    if (sb.value == "") return
    rd.innerHTML = ""
    await content.help.forEach(el => {
        var visible = false
        if (mode == 1 || mode == 4) if (el.title.toLowerCase().search(sb.value.toLowerCase())>=0) visible = true
        if (mode == 2 || mode == 4) {
            if (el.title.toLowerCase().search(sb.value.toLowerCase())>=0) visible = true
            else if (el.description.toLowerCase().search(sb.value.toLowerCase()) >= 0) visible = true
            else {
                el.content.forEach(con => {
                    if (con.type == "text" && con.text.toLowerCase().search(sb.value) >= 0) visible = true
                    if (con.type == "img" && con.alt.toLowerCase().search(sb.value) >= 0) visible = true
                    if (con.type == "a" && con.text.toLowerCase().search(sb.value) >= 0) visible = true
                    if (con.type == "actionRow") { con.content.forEach( element => { if (element.text.toLowerCase().search(sb.value) >= 0) visible = true }) }
                })
            }
        }
        if ( mode==3 || mode==4 ) if (el.labels.join(" ").toLowerCase().search(sb.value.toLowerCase()) >= 0) visible = true
        if ( mode==4 ) if (el.id == sb.value) visible = true
        if (visible && elements.length<3) elements.push(el)
    });
    if (elements.length>0) {
        rd.innerHTML = ""
        for (let i=0;i<elements.length;i++) {
            buildSearchCard(elements[i], rd)
        }
    } else {
        rd.innerHTML += `<p>No hay resultados para "${sb.value}"</p>`
    }
}

async function loadHome() {

    const saved = await indexedDB.displayData("saved")
    const content = await require("./json/posts.json", true)
    var filtered = []

    var sv = document.getElementById("saved")
    sv.innerHTML = ""
    if (saved.length>0) {
        saved.forEach(i => {
            let item = content.help.filter(e=>e.id==i.id)[0]
            buildCard(item.id, item.title, item.description, item.updates[item.updates.length - 1].unix, sv)
        })
    } else {
        sv.innerHTML = "<p>¡No hay nada por aquí!</p>"
    }

    dv = document.getElementById("developers")
    dv.innerHTML = ""
    filtered = content.help.filter(e=>e.labels.includes("devSelection"))
    if (filtered.length>0) {
        filtered.forEach(item => {
            buildCard(item.id, item.title, item.description, item.updates[item.updates.length - 1].unix, dv)
        })
    } else {
        dv.innerHTML = "<p>¡No hay nada por aquí!</p>"
    }

    ds = document.getElementById("destacados")
    ds.innerHTML = ""
    filtered = content.help.filter(e=>e.labels.includes("destacado"))
    if (filtered.length>0) {
        filtered.forEach(item => {
            buildCard(item.id, item.title, item.description, item.updates[item.updates.length - 1].unix, ds)
        })
    } else {
        ds.innerHTML = "<p>¡No hay nada por aquí!</p>"
    }

    var nv = document.getElementById("nuevo")
    nv.innerHTML = ""
    filtered = content.help.filter(e=>e.updates[e.updates.length-1].unix > Math.floor((Date.now()/1000) - (3600*24*7)))
    if (filtered.length>0) {
        filtered.forEach(item => {
            buildCard(item.id, item.title, item.description, item.updates[item.updates.length - 1].unix, nv)
        })
    } else {
        nv.innerHTML = "<p>¡No hay nada por aquí!</p>"
    }
}

function buildCard(id, title, description, timestamp, parent) {
    let text = card2Format
    const date = new Date(timestamp * 1000)
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    text = text.replace(/%%DATE%%+/g, `${date.getDate()} ${meses[date.getMonth()]}, ${date.getFullYear()}`)
    text = text.replace(/%%TITLE%%+/g, title)
    text = text.replace(/%%DESCRIPTION%%+/g, `${description.length>170?`${description.substring(0,167)}...`:description}`)
    text = text.replace(/%%ID%%+/g, id)
    parent.innerHTML += text
}

function buildSearchCard(object, parent) {
    let text = cardFormat
    const date = new Date(object.updates[object.updates.length - 1].unix * 1000)
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    text = text.replace(/%%DATE%%+/g, `${date.getDate()} ${meses[date.getMonth()]}, ${date.getFullYear()}`)
    text = text.replace(/%%TITLE%%+/g, object.title)
    text = text.replace(/%%DESCRIPTION%%+/g, `${object.description.length>170?`${object.description.substring(0,167)}...`:object.description}`)
    text = text.replace(/%%ID%%+/g, object.id)
    parent.innerHTML += text
}