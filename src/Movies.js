import "./App.css";
import Header from "./Header";
import Popup from "./Popup";
import { IoRefreshOutline, IoFunnelOutline, IoPlayOutline, IoDownloadOutline, IoPencilOutline } from "react-icons/io5";
import { useEffect } from "react";
import Loading from "./Loading";

function Movies() {
    
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

    

    function editMovie(title, library) {
        window.location.href = `/editMovie/${title}/${library}`
    }

    function setPopup() {
        let contents = document.getElementsByClassName("content")
        Array.from(contents).forEach(function(content) {
            let image = content.children[2]
            let movieId = image.getAttribute("data-id")
            content.addEventListener("click", function() {
                let popup = document.getElementById("popup")
                popup.style.display = "block"
                document.body.style.overflow = "hidden !important"
                let chocolateServerAdress = getCookie("serverAdress")
                fetch(chocolateServerAdress+"getMovieData/" + movieId, {
                    credentials: "same-origin"
                  }).then(function(response) {
                    return response.json()
                }).then(function(data) {
                    let movieTitle = data.realTitle
                    let movieCast = JSON.parse(data.cast)
                    let movieDescription = data.description
                    let movieDuration = data.duration
                    let movieGenre = JSON.parse(data.genre)
                    let movieNote = data.note
                    let moviePoster = data.cover
                    let movieUrl = data.slug
                    let movieID = data.id
                    movieUrl = "/movie/" + movieID
                    let movieDownloadURL = chocolateServerAdress+"download/" + movieID
                    let movieYear = data.date
                    let movieTrailer = data.bandeAnnonceUrl
                    let movieSimilar = data.similarMovies
                    let containerSimilar = document.getElementsByClassName("containerSimilar")[0]

                    if (movieSimilar.length === 0) {
                        containerSimilar.style.display = "none"

                    } else {
                        containerSimilar.style.display = "inline-grid"
                    }

                    for (let i = 0; i < movieSimilar.length; i++) {
                        if (i < 4) {
                            let movie = movieSimilar[i]
                            let imageUrl = movie.cover
                            let movieName = movie.realTitle
                            let similar = document.getElementsByClassName("containerSimilar")[0]
                            movie = document.createElement("div")
                            movie.setAttribute("class", "movie")
                            let image = document.createElement("img")
                            image.setAttribute("class", "movieImage")
                            image.setAttribute("src", chocolateServerAdress+""+imageUrl)
                            image.setAttribute("alt", movieName)
                            image.setAttribute("title", movieName)
                            let title = document.createElement("p")
                            title.setAttribute("class", "movieTitle")
                            title.innerHTML = movieName

                            movie.appendChild(image)
                            movie.appendChild(title)
                            similar.appendChild(movie)
                        }
                    }

                    let childs = document.getElementsByClassName("movie")
                    let childsLength = childs.length
                    let similar = document.getElementsByClassName("containerSimilar")[0]
                    similar.style.gridTemplateColumns = "repeat(" + childsLength + ", 1fr)"


                    let imagePopup = document.getElementsByClassName("coverPopup")[0]
                    imagePopup.setAttribute("src", chocolateServerAdress+""+moviePoster);
                    imagePopup.setAttribute("alt", movieTitle);
                    imagePopup.setAttribute("title", movieTitle);

                    let titlePopup = document.getElementsByClassName("titlePopup")[0]
                    titlePopup.innerHTML = movieTitle;

                    let descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
                    descriptionPopup.innerHTML = movieDescription;

                    let notePopup = document.getElementsByClassName("notePopup")[0]
                    notePopup.innerHTML = `Note : ${movieNote}/10`;

                    let yearPopup = document.getElementsByClassName("yearPopup")[0]
                    yearPopup.innerHTML = `Date : ${movieYear}`;

                    let genrePopup = document.getElementsByClassName("genrePopup")[0]
                    let genreList = movieGenre
                    let genreString = ""
                    for (let i = 0; i < genreList.length; i++) {
                        genreString += genreList[i]
                        if (i !== genreList.length - 1) {
                            genreString += ", "
                        }
                    }
                    genrePopup.innerHTML = `Genre : ${genreString}`;

                    let durationPopup = document.getElementsByClassName("durationPopup")[0]
                    durationPopup.innerHTML = `Durée : ${movieDuration}`;
                    for (let i = 0; i < movieCast.length; i++) {
                        let castMember = document.createElement("div")
                        castMember.className = "castMember"
                        let castImage = document.createElement("img")
                        castImage.className = "castImage"
                        let castImageUrl = movieCast[i][2]
                        let castRealName = movieCast[i][0]
                        let castId = movieCast[i][3]
                        let castCharacterName = movieCast[i][1]
                        castImage.setAttribute("src", chocolateServerAdress+""+castImageUrl)
                        castImage.setAttribute("alt", castId)
                        castImage.setAttribute("title", castRealName)
                        castMember.appendChild(castImage)
                        let castName = document.createElement("p")
                        castName.className = "castName"
                        castName.innerHTML = castRealName
                        castMember.appendChild(castName)
                        let castCharacter = document.createElement("p")
                        castCharacter.className = "castCharacter"
                        castCharacter.innerHTML = castCharacterName
                        castMember.appendChild(castCharacter)
                        let castPopup = document.getElementById("castPopup")
                        castPopup.appendChild(castMember)
                    }

                    let castMembers = document.getElementsByClassName("castMember")
                    for (let i = 0; i < castMembers.length; i++) {
                        castMembers[i].addEventListener("click", function() {
                            let castImage = this.children[0]
                            let castId = castImage.getAttribute("alt")
                            let castUrl = "/actor/" + castId
                            window.location.href = castUrl
                        })
                    }

                    let trailer = document.getElementsByClassName("containerTrailer")[0]
                    if (movieTrailer === "") {
                        trailer.style.display = "none"
                    } else {
                        trailer.style.display = "block"
                        let trailerVideo = document.createElement("iframe")
                        let regex = /^(http|https):\/\//g
                        if (regex.test(movieTrailer)) {
                            movieTrailer.replace(regex, "")
                        }
                        trailerVideo.setAttribute("src", movieTrailer)
                        trailerVideo.setAttribute("class", "trailerVideo")
                        trailerVideo.setAttribute("id", "trailerVideo")
                        trailer.appendChild(trailerVideo)
                    }

                    let playButton = document.getElementsByClassName("playPopup")[0]
                    playButton.setAttribute("href", movieUrl);
                    
                    let downloadButton = document.getElementsByClassName("downloadPopup")[0]
                    downloadButton.setAttribute("href", movieDownloadURL);
                    
                })
            })
        })
    }

    const createObjectFromString = (str) => {
        return eval(`(function () { return ${str}; })()`);
    }
    

    let genreChecked = {}

    function setGenreCheckboxes() {
        const allCheckboxes = document.getElementsByClassName("checkboxGenre")
        for (const checkbox of allCheckboxes) {
            checkbox.addEventListener("click", function() {
                if (checkbox.checked === true) {
                    genreChecked[checkbox.name] = true
                } else {
                    genreChecked[checkbox.name] = false
                }

                filterMovies()
            })
        }
    }

    function filterMovies() {
        const allMovies = document.getElementsByClassName("cover")
        //allGenreCheckeds c"est tous les clés de genreChecked qui sont à true
        const allGenreCheckeds = Object.keys(genreChecked).filter(key => genreChecked[key] === true)
        for (const movie of allMovies) {
            let work = true
            for (const genre of allGenreCheckeds) {
                let allGenresOfMovie = movie.getAttribute("data-genre")
                if (allGenresOfMovie.includes(genre) === false) {
                    work = false
                }
            }
            if (work === true) {
                movie.style.display = "block"
            } else {
                movie.style.display = "none"
            }
        }
    }

    function getFirstMovies(searchTerm="") {
        let accountType = ""
        let url = window.location.href
        let library = url.split("/")[4]
        let chocolateServerAdress = getCookie("serverAdress")
        let username = getCookie("username")
        let routeToUse = ""
        if (searchTerm === "") {
            routeToUse = `${chocolateServerAdress}getAllMovies/${library}/${username}`
        } else {
            routeToUse = `${chocolateServerAdress}searchMovies/${library}/${username}/${searchTerm}`
        }
        let allGenres = []
        console.log(routeToUse)
        fetch(routeToUse, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function(response) {
            return response.json()
        }).then(function(data) {
            let movies = document.getElementsByClassName("movies")[0]
            let covers = document.getElementsByClassName("cover")
            if (covers.length > 0) {
                let containerSeasons = document.getElementsByClassName("containerSeasons")[0]
                containerSeasons.style.display = "none"
                hideLoader()
                return
            }
            let lengthToSlice = 15
            if (lengthToSlice < 15) {
                lengthToSlice = data.length
            }
            for (let i = 0; i < data.length; i++) {
                if (i > 0) {
                    let movie = data[i]
                    let movieID = movie.id
                    let cover = document.createElement("div")
                    cover.className = "cover"
                    cover.setAttribute("data-id", movieID)
                    cover.setAttribute("data-title", movie.title)
                    cover.setAttribute("data-rating", movie.note)
                    let genres = movie.genre
                    genres = createObjectFromString(genres)
                    for (let genre of genres) {
                        if (cover.getAttribute("data-genre") !== null) {
                            cover.setAttribute("data-genre", `${cover.getAttribute("data-genre")} ${genre}`)

                        } else {
                            cover.setAttribute("data-genre", `${genre}`)
                        }

                        if (allGenres.includes(genre) === false) {
                            allGenres.push(genre)
                        }
                    }
                    let dateString = movie.date
                    const dateParts = dateString.split("/");
                    const day = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10);
                    const year = parseInt(dateParts[2], 10);
                    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    let daysSinceStartOfYear = 0;
                    
                    for (let i = 0; i < month - 1; i++) {
                    daysSinceStartOfYear += daysInMonth[i];
                    }
                    
                    daysSinceStartOfYear += day;
                    const daysSinceStartOfTime = (year * 365) + daysSinceStartOfYear;

                    cover.setAttribute("data-date", daysSinceStartOfTime)

                    cover.style.marginBottom = "2vh"
                    let content = document.createElement("div")
                    content.className = "content"
                    let image = document.createElement("img")
                    image.className = "cover_movie"
                    image.src =  chocolateServerAdress+""+movie.cover
                    image.setAttribute("loading", "lazy");
                    if (image.src === "https://image.tmdb.org/t/p/originalNone") {
                        image.src = "/images/broken.webp"
                    }

                    image.addEventListener("load", function() {
                        if (i === lengthToSlice) {
                            //hideLoader()
                        }
                    })

                    image.title = movie.title
                    image.alt = movie.realTitle
                    image.setAttribute("data-id", movieID)
                    let vues = movie.vues
                    let note = Math.round(movie.note * 10)
                    //create a circle to display the note
                    let noteCircleFront = document.createElement("div")
                    noteCircleFront.className = "noteCircleFront"
                    noteCircleFront.innerHTML = ` ${note}%`
                    
                    
                    //if note is 0, noteColor is red, if note is 100, noteColor is green
                    let hue;
                    if (note < 50) {
                        hue = note * 1.2; // Teinte allant de 0 à 60
                    } else {
                        hue = (note - 50) * 1.2 + 60; // Teinte allant de 60 à 120
                    }

                    let noteColor = `hsl(${hue}deg, 100%, 50%)`
                                        
                    let noteSVG = document.createElement("svg")
                    noteSVG.setAttribute("viewBox", "0 0 110 110")
                    noteSVG.style.setProperty("--dash", 1-note/100)
                    noteSVG.style.setProperty("--color", noteColor)
                    noteSVG.style.setProperty("--note", note)
                    noteSVG.style.setProperty("--content", `"${note}%"`)
                    noteSVG.className = "noteSVG pie"
                    noteSVG.innerHTML = `${note}%`

                    let textSVG = document.createElement("text")
                    textSVG.setAttribute("x", "55")
                    textSVG.setAttribute("y", "57")
                    textSVG.setAttribute("dominant-baseline", "middle")
                    textSVG.setAttribute("text-anchor", "middle")
                    noteSVG.appendChild(textSVG)
                    content.appendChild(noteSVG)

                    vues = createObjectFromString(vues)
                    let timeLineBackground = document.createElement("div")
                    timeLineBackground.className = "timeLineBackground"
                    let timeLine = document.createElement("div")
                    timeLine.className = "timeLine"
                    let watchedTime = vues[username]
                    let movieDuration = movie.duration
                    //it"s a timecode, convert it to seconds
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
                
                    
                    content.appendChild(image)
                    cover.appendChild(content)
                    accountType = "Admin"
                    if (accountType === "Admin") {
                        let modelIcon = document.getElementById("editButtonSVG")

                        let pencilIcon = modelIcon.cloneNode(true)
                        //remove class hidden
                        pencilIcon.classList.remove("hidden")
                        pencilIcon.setAttribute("class", "pencilIcon")
                        pencilIcon.setAttribute("title", "Edit metadata")
                        pencilIcon.setAttribute("alt", "Edit metadata")
                        pencilIcon.setAttribute("id", movie.realTitle)

                        let theMovieName = movie.title
                        let library = movie.libraryName
                        pencilIcon.addEventListener("click", function() {
                            editMovie(theMovieName, library)
                        })
                        cover.appendChild(pencilIcon)
                    }
                    movies.appendChild(cover)

                } else {
                    let imageBanner = document.getElementsByClassName("bannerCover")[0]
                    let genreBanner = document.getElementsByClassName("bannerGenre")[0]
                    let titleBanner = document.getElementsByClassName("bannerTitle")[0]
                    let descriptionBanner = document.getElementsByClassName("bannerDescription")[0]
                    let watchNow = document.getElementsByClassName("watchNowA")[0]
                    let movie = data[i]
                    let id = movie.id
                    let slug = "/movie/" + id
                    let bannerImage = movie.banner
                    let cssBigBanner = `background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(24, 24, 24, 0.85) 77.08%, #1D1D1D 100%), linear-gradient(95.97deg, #000000 0%, rgba(0, 0, 0, 0.25) 100%, #000000 100%), url("${chocolateServerAdress}${bannerImage}")`
                    imageBanner.setAttribute("style", cssBigBanner)

                    titleBanner.innerHTML = movie.realTitle
                    let description = movie.description
                    descriptionBanner.innerHTML = description
                    descriptionBanner.innerHTML = descriptionBanner.innerHTML.substring(0, 200) + "..."
                    descriptionBanner.innerHTML += " <a id='lireLaSuite' href='#'>Lire la suite</a>"

                    let lireLaSuite = document.getElementById("lireLaSuite")
                    lireLaSuite.addEventListener("click", function() {
                        descriptionBanner.innerHTML = description
                    })

                    genreBanner.innerHTML = JSON.parse(movie.genre).join(", ")
                    let movieUrl = slug
                    watchNow.setAttribute("href", movieUrl)
                }
            }

            if (data.length === 1) {
                let bigBackground = document.getElementsByClassName("bannerCover")[0]
                bigBackground.style.height = "100vh"

                let bannerGenre = document.getElementsByClassName("bannerGenre")[0]
                let bannerTitle = document.getElementsByClassName("bannerTitle")[0]
                let bannerDescription = document.getElementsByClassName("bannerDescription")[0]
                let watchNow = document.getElementsByClassName("watchNowA")[0]
                let downloadA = document.getElementById("downloadNowA")
                let rescanButton = document.getElementById("rescanButton")

                let selectA = document.getElementsByClassName("selectA")[0]
                let sortA = document.getElementsByClassName("sortA")[0]

                bannerGenre.style.top = "46vh"
                bannerTitle.style.top = "47.5vh"
                bannerDescription.style.top = "55vh"
                watchNow.style.top = "65vh"
                downloadA.style.top = "65vh"
                rescanButton.style.marginTop = "65vh"

                selectA.style.display = "none"
                sortA.style.display = "none"
            }
            
            //order allGenres by alphabetical order
            allGenres.sort()
            for (const genre of allGenres) {
                let checkboxes = document.getElementById("checkboxes")
                let checkbox = document.createElement("input")
                checkbox.setAttribute("type", "checkbox")

                checkbox.setAttribute("id", genre)
                checkbox.setAttribute("name", genre)
                checkbox.setAttribute("value", genre)
                checkbox.setAttribute("class", "checkboxGenre")
                
                let label = document.createElement("label")
                label.setAttribute("for", genre)
                label.appendChild(checkbox)

                label.innerHTML += `${genre}`
                checkboxes.appendChild(label)
            }
            setPopup()
            setGenreCheckboxes()
        })
        .catch(function(error) {
            console.log(error)
        })
    }

    function hideLoader() {
        let loader = document.getElementById("loaderBackground")
        let spinner = document.getElementById("spinner")
        spinner.style.display = "none"
        loader.style.display = "none"
    }

    let expanded = false;

    function showCheckboxes() {
    let checkboxes = document.getElementById("checkboxes");
    let select = document.querySelector(".selectBox select")
    let selectA = document.getElementsByClassName("selectA")[0]
    if (!expanded) {
        checkboxes.style.display = "block";
        selectA.style.background = "white"
        select.style.color = "black"
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        selectA.style.background = "none"
        select.style.color = "white"
        expanded = false;
    }
    }

    let oldSelectValue = "title"

    function sortFilms() {
        let select = document.getElementById("sortSelect")
        let selectValue = select.value
        if (selectValue === "title") {
            orderByAlphabetical()
        } else if (selectValue === "date") {
            orderByDate()
        } else if (selectValue === "rating") {
            orderByRating()
        }
        select.options[0].innerText = select.options[select.selectedIndex].label;
        select.selectedIndex = 0;
    }

    function orderByAlphabetical() {
        let allMovies = document.getElementById("movies")
        let movies = allMovies.children
        let moviesArray = []
        for (let i = 0; i < movies.length; i++) {
            moviesArray.push(movies[i])
        }
        moviesArray.sort(function(a, b) {
            let titleA = a.getAttribute("data-title")
            let titleB = b.getAttribute("data-title")
            if (titleA < titleB) {
                return -1
            } else if (titleA > titleB) {
                return 1
            }
            return 0
        })
        allMovies.innerHTML = ""
        if (oldSelectValue === "title") {
            moviesArray.reverse()
            oldSelectValue = "titleReverse"
        } else {
            oldSelectValue = "title"
        }

        for (let i = 0; i < moviesArray.length; i++) {
            allMovies.appendChild(moviesArray[i])
        }
        
    }

    function orderByRating() {
        let allMovies = document.getElementById("movies")
        let movies = allMovies.children
        let moviesArray = []
        for (let i = 0; i < movies.length; i++) {
            moviesArray.push(movies[i])
        }
        moviesArray.sort(function(a, b) {
            let ratingA = a.getAttribute("data-rating")
            let ratingB = b.getAttribute("data-rating")
            if (ratingA < ratingB) {
                return 1
            } else if (ratingA > ratingB) {
                return -1
            } else {
                return 0
            }
        })
        if (oldSelectValue === "rating") {
            moviesArray.reverse()
            oldSelectValue = "ratingReverse"
        } else {
            oldSelectValue = "rating"
        }


        allMovies.innerHTML = ""
        for (let i = 0; i < moviesArray.length; i++) {
            allMovies.appendChild(moviesArray[i])
        }
    }

    function orderByDate() {
        let allMovies = document.getElementById("movies")
        let movies = allMovies.children
        let moviesArray = []
        for (let i = 0; i < movies.length; i++) {
            moviesArray.push(movies[i])
        }
        moviesArray.sort(function(a, b) {
            let dateA = a.getAttribute("data-date")
            let dateB = b.getAttribute("data-date")
            if (dateA < dateB) {
                return 1
            } else if (dateA > dateB) {
                return -1
            } else {
                return 0
            }
        })

        if (oldSelectValue === "date") {
            moviesArray.reverse()
            oldSelectValue = "dateReverse"
        } else {
            oldSelectValue = "date"
        }



        allMovies.innerHTML = ""
        for (let i = 0; i < moviesArray.length; i++) {
            allMovies.appendChild(moviesArray[i])
        }
    }

    function removeAllMovies() {
        let movies = document.getElementById("movies")
        movies.innerHTML = ""
    }

    function search() {
        let searchBar = document.getElementById("search")
        let searchValue = searchBar.value
        removeAllMovies()
        getFirstMovies(searchValue)
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
        console.log("Movies")
        getFirstMovies()
        console.log("Genres")
    }, []);
    const language = JSON.parse(localStorage.getItem("languageFile"));

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

    return (
        <div className="App"> 
        <Header />
        <Loading />
        <>
  <button
    className="rescanButton"
    id="rescanButton"
    onClick={rescanLib}
  >
    <IoRefreshOutline />
    Rescan
  </button>
  <button className="selectA">
    <div className="multiselect">
      <div className="selectBox" onClick={showCheckboxes}>
        <select>
          <option>Select an option</option>
        </select>
        <div className="overSelect" />
      </div>
      <div id="checkboxes"></div>
    </div>
  </button>
  <button className="sortA">
    <IoFunnelOutline />
    <select className="sortSelect" id="sortSelect" onChange={sortFilms}>
      <option value="" disabled="" style={{ display: "none" }} >Alphabetic</option>
      <option value="title" defaultValue>
        Alphabetic
      </option>
      <option value="rating">Rating</option>
      <option value="date">Date</option>
    </select>
  </button>
  <Popup />
  <div className="bigBanner">
    <div className="bannerCover" />
    <p className="bannerGenre"></p>
    <h1 className="bannerTitle">.</h1>
    <p className="bannerDescription"></p>
    <a className="watchNowA" href="/">
      <IoPlayOutline className="watchNow" />
      {language["watchNow"]}
    </a>
    <a className="downloadNowA" id="downloadNowA" href="/">
      <IoDownloadOutline className="downloadNow"/>
      {language["downloadButton"]}
    </a>
  </div>
  <div className="movies" id="movies"></div>
</>
    <IoPencilOutline id="editButtonSVG" className="hidden" />
    </div>
    );
}

export default Movies;
