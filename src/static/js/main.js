let homeButton = document.getElementById("goHome")
let logo = document.getElementById("logo")

logo.addEventListener("click", function() {
    window.location.href = "/home"
})

homeButton.addEventListener("click", function() {
    window.location.href = "/home"
})

function search() {
    var search = document.getElementById("search").value
    let actualHref = window.location.href
    let libraryName = actualHref.split("/")[4].replace("#", "")
    if (search !== "" && actualHref.split("/").length >= 5) {
        window.location.href = `/search/${libraryName}/${search}`
    }
}

let searchForm = document.getElementById("searchForm")
searchForm.addEventListener("submit", function(event) {
    event.preventDefault()
    search()
})

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/service-worker.js')
    .then(function(registration) {
        console.log('Service Worker Registered');
        return registration;
    })
    .catch(function(err) {
        console.error('Unable to register service worker.', err);
    });
}

window.addEventListener('online', function(e) {
    console.log("You are online");
}, false);
