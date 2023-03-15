const loader = '<div class="progress-loader"><div class="progress"></div></div>'

function showLoader(elementQuery) {
    elementQuery = elementQuery||"body"
    document.querySelector(elementQuery).innerHTML += `<div class="loader-background${elementQuery=="body"?"":" sticky"}">${loader}</div>`
}

function destroyLoader() {
    try {
        let node = document.querySelector(".loader-background");
        node.parentNode.removeChild(node);
    } catch {}
}