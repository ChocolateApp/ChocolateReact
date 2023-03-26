import { IoPlayOutline, IoDownloadOutline, IoRefreshOutline } from "react-icons/io5";
import { useEffect } from "react";
import Header from "./Header";
import "./App.css";

function Other() {

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

    const createObjectFromString = (str) => {
        return eval(`(function () { return ${str}; })()`);
    }

    function getFirstMovies(searchTerm="") {
        let url = window.location.href
        let library = url.split("/")[4]
        let chocolateServerAdress = getCookie("serverAdress")
        let username = getCookie("username")
        let routeToUse = ""
        if (searchTerm === "") {
            routeToUse = `${chocolateServerAdress}getAllOther/${library}/${username}`
        } else {
            routeToUse = `${chocolateServerAdress}searchMovies/${library}/${username}/${searchTerm}`
        }
        fetch(routeToUse).then(function(response) {
            return response.json()
        }).then(function(data) {
            for (let i = 0; i < data.length; i++) {
                if (i > 0) {
                    let movies = document.getElementsByClassName("movies")[0]
                    let movie = data[i]
                    let movieID = movie.videoHash
                    let cover = document.createElement("div")
                    cover.className = "cover"
                    cover.style.marginBottom = "2vh"
                    let content = document.createElement("div")
                    content.className = "content"
                    let image = document.createElement("img")
                    image.className = "cover_movie"
                    image.src = movie.banner
                    if (image.src === "https://image.tmdb.org/t/p/originalNone") {
                        image.src = "/images/broken.webp"
                    } else {
                        image.src = chocolateServerAdress+""+movie.banner
                    }
                    image.title = movie.title
                    image.alt = movie.title
                    image.setAttribute("data-id", movieID)
                    image.setAttribute("loading", "lazy")

                    let vues = movie.vues
                    

                    vues = createObjectFromString(vues)
                    let timeCode = vues[username]
                    let timeLineBackground = document.createElement("div")
                    timeLineBackground.className = "timeLineBackground"
                    let timeLine = document.createElement("div")
                    timeLine.className = "timeLine"
                    let watchedTime = timeCode
                    let movieDuration = movie.duration
                    //it's a timecode, convert it to seconds
                    movieDuration = movieDuration.split(":")
                    movieDuration = parseInt(movieDuration[0]) * 3600 + parseInt(movieDuration[1]) * 60 + parseInt(movieDuration[2])
                    if ((watchedTime / movieDuration) * 100 <= 100) {
                        timeLine.style.width = `${(watchedTime / movieDuration) * 100}%`
                    } else if ((watchedTime / movieDuration) * 100 > 100) {
                        timeLine.style.width = "100%"
                    } else {
                        timeLine.style.width = "0%"
                    }
                    timeLineBackground.appendChild(timeLine)
                    content.appendChild(timeLineBackground)
                    
                    cover.addEventListener("click", function() {
                        window.location.href = "/otherVideo/" + movieID
                    })
                    
                    content.appendChild(image)
                    cover.appendChild(content)
                    //check if there's an image with the same data-id
                    let theImage = document.querySelector(`img[data-id="${movieID}"]`)
                    if (theImage === null) {
                        movies.appendChild(cover)
                    }
                } else {
                    let imageBanner = document.getElementsByClassName("bannerCover")[0]
                    let titleBanner = document.getElementsByClassName("bannerTitle")[0]
                    let watchNow = document.getElementsByClassName("watchNowA")[0]
                    let movie = data[i]
                    let id = movie.videoHash
                    let slug = "/otherVideo/" + id
                    let bannerImage = chocolateServerAdress + movie.banner
                    let cssBigBanner = `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(24, 24, 24, 0.85) 77.08%, #1D1D1D 100%), linear-gradient(95.97deg, #000000 0%, rgba(0, 0, 0, 0.25) 100%, #000000 100%), url("${bannerImage}")`
                    imageBanner.setAttribute('style', cssBigBanner)
                    
                    titleBanner.innerHTML = movie.title
                    
                    let movieUrl = slug
                    watchNow.setAttribute("href", movieUrl)
                }
            }

            if (data.length === 1) {
                let bigBackground = document.getElementsByClassName("bannerCover")[0]
                bigBackground.style.height = "100vh"

                let bannerTitle = document.getElementsByClassName("bannerTitle")[0]
                let bannerDescription = document.getElementsByClassName("bannerDescription")[0]
                let watchNow = document.getElementsByClassName("watchNowA")[0]

                bannerTitle.style.top = "47.5vh"
                bannerDescription.style.top = "55vh"
                watchNow.style.top = "65vh"
            }
        })
    }

    
    function rescanLib() {
        const button = document.getElementById("rescanButton")
        let svg = button.innerHTML.split("</svg>")[0] + "</svg>"
        let actualHref = window.location.href.split("#")[0]
        let libraryName = actualHref.split("/")[4]
        let chocolateServerAdress = getCookie("serverAdress")
        const url = `${chocolateServerAdress}rescan/${libraryName}`
        const texts = ["Scanning", "Scanning.", "Scanning..", "Scanning..."]
        button.disabled = true
    
        //setInterval
        let i = 0
        let interval = setInterval(function() {
            i++
            if (i === 4) {
                i = 0
            }
            button.innerHTML = svg+texts[i]
        }, 500)
    
        //fetch with get
        fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            }}).then(function(response) {
                return response.json()
            }).then(function(data) {
                console.log(data)
                if (data === true) {
                    clearInterval(interval)
                    button.innerHTML = svg+"Done"
                    //wait 2 seconds and reload the page
                    setTimeout(function() {
                        window.location.reload()
                    }, 2000)
                } else {
                    clearInterval(interval)
                    button.innerHTML = svg+"Error"
                    button.classList.add("error")
                }
            })
    }

    useEffect(() => {
        getFirstMovies();
    }, []);

    const language = JSON.parse(localStorage.getItem("languageFile"));

    return (
        
        <div className="App"> 
        <Header />
            <>
                <button
                    className="rescanButton"
                    id="rescanButton"
                    onClick={rescanLib}
                >
                    <IoRefreshOutline />
                    Rescan
                </button>
                <div className="bigBanner">
                    <div className="bannerCover"></div>
                    <p className="bannerGenre">
                    </p>
                    <h1 className="bannerTitle">.</h1>
                    <p className="bannerDescription">
                    </p>
                    <a className="watchNowA" href="/">
                        <IoPlayOutline className="watchNow" />
                        {language["watchNow"]}
                    </a>
                    <a className="downloadNowA" id="downloadNowA" href="/">
                        <IoDownloadOutline className="downloadNow" />
                        {language["downloadButton"]}
                    </a>
                </div>
                <div className="movies" id="movies"></div>
            </>
        </div>
  );
}

export default Other