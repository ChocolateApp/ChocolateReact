import "./App.css";
import Header from "./Header";
//import Loading from "./Loading";
import { IoChevronForwardOutline, IoChevronBackOutline, IoExpandOutline } from "react-icons/io5";
import { useEffect } from "react";

function Book() {
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
    
    let currentPage = 0;
    let maxPages;
    let bookDiv = document.getElementById("bookDiv");
    let url = window.location.href;
    let zoomed = false;
    let bookId = url.substring(url.lastIndexOf("/") + 1);
    let chocolateServerAdress = getCookie("serverAdress");

    fetch(`${chocolateServerAdress}bookData/${bookId}`).then(function(response) {
        return response.json();
    }).then(function(json) {
        maxPages = json.nbPages;
        console.log("maxPages: " + maxPages);
    });
    
    let previousPageVar = 0;
    
    // Function to load an image from the server
    function loadImage(pageNumber) {
        let server = getCookie("serverAdress");
        fetch(`${server}bookUrl/${bookId}/${pageNumber}`)
            .then(response => response.text()).then(response => {
            let img = document.getElementById("bookImage");
            img.src = "data:image/png;base64," + response;
        });    
    }
    
    // Function to go to the next page
    function nextPage(previousPageVar) {
        console.log("previousPageVar: " + previousPageVar);
        previousPageVar = currentPage;
        currentPage++;
        loadImage(currentPage);
    }
    
    // Function to go to the previous page
    function previousPage(previousPageVar) {
        console.log("previousPageVar: " + previousPageVar);
        previousPageVar = currentPage;
        currentPage--;
        loadImage(currentPage);
    }

    const clickLeft = (e) => {
      e.preventDefault();
        previousPage(previousPageVar);
    }

    const clickRight = (e) => {
        e.preventDefault();
        nextPage(previousPageVar);
    }

    const clickZoom = (e) => {
        e.preventDefault();
        zoomBook();
    }

    useEffect(() => {
        loadImage(0);
    }, []);

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

    

    return (
        <div className="App"> 
            <Header />
            <div id="bookDiv">
                <button id="previous-page" className="arrowButtonBook" onClick={clickLeft}>
                    <IoChevronBackOutline />
                </button>
                <IoExpandOutline className="expandBook" id="expandBook" onClick={clickZoom} />
                <img id="bookImage" className="bookImage" alt="" />
                <button id="next-page" className="arrowButtonBook" onClick={clickRight}>
                    <IoChevronForwardOutline />
                </button>
            </div>
        </div>
    );
}

export default Book;
