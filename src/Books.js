import "./App.css";
import Header from "./Header";
import Loading from "./Loading";
import { useEffect } from "react";

function Books() {

    function hideLoader() {
        let spinner = document.getElementById("spinner")
        let backgroundSpinner = document.getElementById("loaderBackground")
        spinner.style.visibility = "hidden"
        backgroundSpinner.style.display = "none"
    }
    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + "=")) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    
    function getAllBooks(searchTerm="") {
        let url = window.location.href
        let library = url.split("/")[4]
        let chocolateServerAdress = getCookie("serverAdress")
        let username = getCookie("username")
        let bookUrlRoute = ""
        if (searchTerm === "") {
            bookUrlRoute = `${chocolateServerAdress}getAllBooks/${library}`
        } else {
            bookUrlRoute = `${chocolateServerAdress}searchBooks/${library}/${username}/${searchTerm}`
        }
        fetch(bookUrlRoute).then(function(response) {
            return response.json();
        }).then(function(json) {
            let books = document.getElementsByClassName("bookDiv")
            if (books.length > 0) {
                hideLoader()
                return
            }
            let lengthToSlice = 15
            if (lengthToSlice < 15) {
                lengthToSlice = json.length
            }
            books = json
            let bookList = document.getElementById("bookList");
            for (let book of books) {
                const bookID = book.id
                let bookDiv = document.createElement("div");
                bookDiv.className = "bookDiv";
                bookDiv.setAttribute("data-name", book.title);
                bookDiv.setAttribute("data-type", book.bookType);
                let bookNameDiv = document.createElement("div");
                bookNameDiv.className = "bookNameDiv";
                let bookImageDiv = document.createElement("div");
                bookImageDiv.className = "bookImageDiv";
                let bookImage = document.createElement("img");
                bookImage.src = `${chocolateServerAdress}${book.cover.replace("\\", "/")}`;
                bookImage.className = "bookImage";
                bookImage.loading = "lazy";
                let bookName = document.createElement("p");
                bookName.className = "bookName";
                bookName.innerHTML = book.title;
                bookImageDiv.appendChild(bookImage);
                bookNameDiv.appendChild(bookName);
                bookDiv.appendChild(bookImageDiv);
                bookDiv.appendChild(bookNameDiv);
                console.log(book)
                if (book.bookType !== "folder") {
                    bookImageDiv.addEventListener("click", function() {
                        window.location.href = `/book/${bookID}`;
                    });
                    bookNameDiv.addEventListener("click", function() {
                        window.location.href = `/book/${bookID}`;
                    });
                } else {
                    bookImageDiv.addEventListener("click", function() {
                        window.location.href = `/books/${book.libraryName}-${book.title}`;
                    });
                    bookNameDiv.addEventListener("click", function() {
                        window.location.href = `/books/${book.libraryName}-${book.title}`;
                    });
                }
                bookList.appendChild(bookDiv);
            }
        })
    }    

    function removeAllBooks() {
        let movies = document.getElementById("bookList")
        movies.innerHTML = ""
    }

    function search() {
        let searchBar = document.getElementById("search")
        let searchValue = searchBar.value
        removeAllBooks()
        getAllBooks(searchValue)
    }

    function setSearchBar() {
        let searchButton = document.getElementById("buttonSearch")
        searchButton.addEventListener("click", function() {
            search()
        })
        let searchBar = document.getElementById("search")
        searchBar.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                search()
            }
        })
    }
    
    useEffect(() => {
        setSearchBar()
        getAllBooks()
        hideLoader()
    }, []);

    return (
        <div className="App"> 
        <Header />
        <Loading />
        <div class="books" id="bookList"></div>
        <div class="booksRoute"></div>
        </div>
    );
}

export default Books;
