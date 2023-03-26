var currentPage = 0;
var maxPages;
var bookDiv = document.getElementById("bookDiv");
url = window.location.href;
let zoomed = false;
bookId = url.substring(url.lastIndexOf('/') + 1);

fetch(`/bookData/${bookId}`).then(function(response) {
    return response.json();
}).then(function(json) {
    maxPages = json.nbPages;
});

let nextImage;
let previousImage;
let previsousPage = 0;

// Function to load an image from the server
function loadImage(pageNumber) {
    fetch(`/bookUrl/${bookId}/${pageNumber}`)
        .then(response => response.text()).then(response => {
        var img = document.getElementById("bookImage");
        img.src = "data:image/png;base64," + response;
    });    
}

// Function to go to the next page
function nextPage() {
    previousPage = currentPage;
    currentPage++;
    loadImage(currentPage);
}

// Function to go to the previous page
function previousPage() {
    previousPage = currentPage;
    currentPage--;
    loadImage(currentPage);
}

// Function to zoom the book
function zoomBook() {
    bookDiv.classList.toggle("bigBookDiv");
    document.getElementById("expandBook").classList.toggle("buttonFullScreenClicked");
    document.getElementById("previous-page").classList.toggle("bigArrowPrev");
    document.getElementById("next-page").classList.toggle("bigArrowNext");
    
    if (!zoomed) {
        if (bookDiv.requestFullscreen) {
            bookDiv.requestFullscreen();
            zoomed = true;
        } else if (bookDiv.mozRequestFullScreen) { /* Firefox */
            bookDiv.mozRequestFullScreen();
            zoomed = true;
        } else if (bookDiv.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            bookDiv.webkitRequestFullscreen();
            zoomed = true;
        } else if (bookDiv.msRequestFullscreen) { /* IE/Edge */
            bookDiv.msRequestFullscreen();
            zoomed = true;
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            zoomed = false;
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
            zoomed = false;
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
            zoomed = false;
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
            zoomed = false;
        }
    }
}
// Add event listeners to the buttons
document.getElementById("next-page").addEventListener("click", nextPage);
document.getElementById("previous-page").addEventListener("click", previousPage)

document.getElementById("expandBook").addEventListener("click", zoomBook);
// Load the first page
window.onload = loadImage(currentPage);