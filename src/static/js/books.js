function hideLoader() {
    spinner = document.getElementById("spinner")
    backgroundSpinner = document.getElementById("loaderBackground")
    spinner.style.visibility = "hidden"
    backgroundSpinner.style.display = "none"
}

function getAllBooks() {
    var url = window.location.href
    var library = url.split("/")[4]
    let booksRoute = document.getElementsByClassName("booksRoute")[0];
    let bookUrlRoute = booksRoute.id
    fetch(bookUrlRoute).then(function(response) {
        return response.json();
    }).then(function(json) {
        books = json
        var bookList = document.getElementById("bookList");
        for (book of books) {
            const bookID = book.id
            var bookDiv = document.createElement("div");
            bookDiv.className = "bookDiv";
            var bookNameDiv = document.createElement("div");
            bookNameDiv.className = "bookNameDiv";
            var bookImageDiv = document.createElement("div");
            bookImageDiv.className = "bookImageDiv";
            var bookImage = document.createElement("img");
            bookImage.src = book.cover;
            bookImage.className = "bookImage";
            bookImage.loading = "lazy";
            var bookName = document.createElement("p");
            bookName.className = "bookName";
            bookName.innerHTML = book.title;
            bookImageDiv.appendChild(bookImage);
            bookNameDiv.appendChild(bookName);
            bookDiv.appendChild(bookImageDiv);
            bookDiv.appendChild(bookNameDiv);
            bookImageDiv.addEventListener("click", function() {
                window.location.href = `/book/${bookID}`;
            });
            bookNameDiv.addEventListener("click", function() {
                window.location.href = `/book/${bookID}`;
            });
            bookList.appendChild(bookDiv);
        }
    })
}
getAllBooks()
hideLoader()
