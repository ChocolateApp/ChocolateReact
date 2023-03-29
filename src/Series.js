import "./App.css";
import Header from "./Header";
import Popup from "./Popup";
import { IoRefreshOutline, IoFunnelOutline, IoPlayOutline, IoPencilOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import Loading from "./Loading";

function Series() {
    const { libName } = useParams();
    const [currentLibName, setCurrentLibName] = useState(libName);
  
    useEffect(() => {
      if (libName !== currentLibName) {
        // Mettre à jour l'état du composant en conséquence
        let covers = document.querySelectorAll(`.cover`)
        for (let i = 0; i < covers.length; i++) {
            if (covers[i].getAttribute("data-lib") !== libName) {
                covers[i].remove()
            }
        }
        getFirstSeries()
        setCurrentLibName(libName);
      }
    }, [libName]);
    
    const language = JSON.parse(localStorage.getItem("languageFile"));
    
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
    
   

    
    function goToSeason(id) {
        let href = "/season/" + id
        window.location.href = href
    }

    function setPopup() {
        let covers = document.getElementsByClassName("cover")
        for (let i = 0; i < covers.length; i++) {
            covers[i].addEventListener("click", () => {
                let popup = document.getElementById("popup")
                popup.style.display = "block"
                document.body.style.overflow = "hidden !important"
                let image = covers[i].children[0].children[0]
                let serieId = image.getAttribute("serieid")
                let chocolateServerAdress = getCookie("serverAdress")
                fetch(chocolateServerAdress+"getSerieData/" + serieId, {
                    credentials: "same-origin"
                  }).then(function(response) {
                    return response.json()
                }).then(function(data) {
                    let serieTitle = data.originalName
                    let serieCast = data.cast
                    let serieDescription = data.description
                    let serieDuration = data.duration
                    let serieGenre = data.genre
                    let serieNote = data.note
                    let seriePoster = data.serieCoverPath
                    let serieYear = data.date
                    let serieTrailer = data.bandeAnnonceUrl
                    let serieSimilar = data.similarSeries
                    let serieSeasons = data.seasons
                    let containerSimilar = document.getElementsByClassName("containerSimilar")[0]
                    let containerSeasons = document.getElementsByClassName("containerSeasons")[0]

                    if (serieSimilar === undefined || serieSimilar.length === 0) {
                        containerSimilar.style.display = "none"

                    } else {
                        containerSimilar.style.display = "inline-grid"


                        for (let i = 0; i < serieSimilar.length; i++) {
                            if (i < 4) {
                                let serie = serieSimilar[i]
                                let imageUrl = serie.cover
                                let serieName = serie.realTitle
                                let similar = document.getElementsByClassName("containerSimilar")[0]
                                serie = document.createElement("div")
                                serie.setAttribute("class", "serie")
                                let image = document.createElement("img")
                                image.setAttribute("class", "serieImage")
                                image.setAttribute("src", chocolateServerAdress+imageUrl)
                                image.setAttribute("alt", serieName)
                                image.setAttribute("title", serieName)
                                let title = document.createElement("p")
                                title.setAttribute("class", "serieTitle")
                                title.innerHTML = serieName

                                serie.appendChild(image)
                                serie.appendChild(title)
                                similar.appendChild(serie)
                            }
                        }
                    }
                    serieSeasons = Object.values(serieSeasons)
                    for (let season of serieSeasons) {
                        let seasonCover = season.seasonCoverPath
                        let seasonName = season.seasonName
                        let seasonNumber = season.seasonNumber
                        let seasonId = season.seasonId
                        let seasonDiv = document.createElement("div")
                        seasonDiv.className = "season"
                        seasonDiv.setAttribute("id", seasonNumber)
                        seasonDiv.addEventListener("click", () => {
                            goToSeason(seasonId)
                        })

                        let seasonCoverImage = document.createElement("img")
                        seasonCoverImage.className = "seasonCoverImage"
                        seasonCoverImage.setAttribute("src", chocolateServerAdress+seasonCover)
                        seasonCoverImage.setAttribute("alt", seasonName)
                        seasonCoverImage.setAttribute("title", seasonName)
                        seasonCoverImage.addEventListener("click", () => {
                            goToSeason(seasonId)
                        })

                        let seasonNameP = document.createElement("p")
                        seasonNameP.className = "seasonTitle"
                        seasonNameP.innerHTML = seasonName
                        seasonNameP.addEventListener("click", () => {
                            goToSeason(seasonId)
                        })

                        seasonDiv.appendChild(seasonCoverImage)
                        seasonDiv.appendChild(seasonNameP)
                        containerSeasons.appendChild(seasonDiv)
                    }

                    let childs = document.getElementsByClassName("serie")
                    let childsLength = childs.length
                    let similar = document.getElementsByClassName("containerSimilar")[0]
                    similar.style.gridTemplateColumns = "repeat(" + childsLength + ", 1fr)"


                    let imagePopup = document.getElementsByClassName("coverPopup")[0]
                    imagePopup.setAttribute("src", chocolateServerAdress+seriePoster);
                    if (imagePopup.src === "https://image.tmdb.org/t/p/originalNone") {
                        imagePopup.src = "/images/broken.webp"
                    }
                    imagePopup.setAttribute("alt", serieTitle);
                    imagePopup.setAttribute("title", serieTitle);

                    let titlePopup = document.getElementsByClassName("titlePopup")[0]
                    titlePopup.innerHTML = serieTitle;

                    let descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
                    descriptionPopup.innerHTML = serieDescription;

                    let notePopup = document.getElementsByClassName("notePopup")[0]
                    notePopup.innerHTML = `Note : ${serieNote}/10`;

                    let yearPopup = document.getElementsByClassName("yearPopup")[0]
                    yearPopup.innerHTML = `Date : ${serieYear}`;

                    let genrePopup = document.getElementsByClassName("genrePopup")[0]
                    let genreList = JSON.parse(serieGenre)
                    let genreString = genreList.join(", ")
                    genrePopup.innerHTML = `Genre : ${genreString}`;

                    let durationPopup = document.getElementsByClassName("durationPopup")[0]
                    durationPopup.innerHTML = `Durée : ${serieDuration}`;

                    serieCast = JSON.parse(serieCast)
                    for (let i = 0; i < serieCast.length; i++) {
                        let cast = serieCast[i]
                        
                        let castMember = document.createElement("div")
                        castMember.className = "castMember"
                        let castImage = document.createElement("img")
                        castImage.className = "castImage"
                        let castImageUrl = cast[2]
                        if (castImageUrl === "None") {
                            castImage.src = "/images/broken.webp"
                        }
                        let castRealName = cast[0]
                        let castCharacterName = cast[1]
                        castImage.setAttribute("src", chocolateServerAdress+castImageUrl)
                        castImage.setAttribute("alt", cast[3])
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
                    if (serieTrailer === "") {
                        trailer.style.display = "none"
                    } else {
                        trailer.style.display = "block"
                        let trailerVideo = document.createElement("iframe")
                        let regex = /^(http|https):\/\//g
                        if (regex.test(serieTrailer)) {
                            serieTrailer.replace(regex, "")
                        }
                        trailerVideo.setAttribute("src", serieTrailer)
                        trailerVideo.setAttribute("class", "trailerVideo")
                        trailerVideo.setAttribute("id", "trailerVideo")
                        trailer.appendChild(trailerVideo)
                    }

                    let playButton = document.getElementsByClassName("playPopup")[0]
                    playButton.style.display = "none"
                    
                    let downloadButton = document.getElementsByClassName("downloadPopup")[0]
                    downloadButton.style.display = "none"

                    let popupContent = document.getElementsByClassName("popupContent")[0]
                    popupContent.style.height = "86vh"
                })
            })
        }
        const watchNowA = document.getElementsByClassName("watchNowA")[0]
        watchNowA.addEventListener("click", function() {

            let popup = document.getElementById("popup")
            popup.style.display = "block"

            let playButton = document.getElementsByClassName("playPopup")[0]
            playButton.style.display = "none"
            
            let downloadButton = document.getElementsByClassName("downloadPopup")[0]
            downloadButton.style.display = "none"

            let popupContent = document.getElementsByClassName("popupContent")[0]
            popupContent.style.height = "86vh"

            document.body.style.overflow = "hidden !important"

            let imageBanner = document.getElementsByClassName("bannerCover")[0]
            let serieId = imageBanner.getAttribute("serieId")
            let chocolateServerAdress = getCookie("serverAdress")
            fetch(chocolateServerAdress+"getSerieData/" + serieId, {
                credentials: "same-origin"
              }).then(function(response) {
                return response.json()
            }).then(function(data) {
                let serieTitle = data.originalName

                let serieCast = data.cast
                let serieDescription = data.description
                let serieDuration = data.duration
                let serieGenre = data.genre
                let serieNote = data.note
                let seriePoster = data.serieCoverPath
                let serieYear = data.date
                let serieTrailer = data.bandeAnnonce
                let serieSimilar = data.similarSeries

                let serieSeasons = data.seasons
                let containerSimilar = document.getElementsByClassName("containerSimilar")[0]
                let containerSeasons = document.getElementsByClassName("containerSeasons")[0]

                if (serieSimilar === undefined || serieSimilar.length === 0) {
                    containerSimilar.style.display = "none"

                } else {
                    containerSimilar.style.display = "inline-grid"


                    for (let i = 0; i < serieSimilar.length; i++) {
                        if (i < 4) {
                            let serie = serieSimilar[i]
                            let imageUrl = serie.serieCoverPath
                            let serieName = serie.originalName
                            let similar = document.getElementsByClassName("containerSimilar")[0]
                            serie = document.createElement("div")
                            serie.setAttribute("class", "serie")
                            let image = document.createElement("img")
                            image.setAttribute("class", "serieImage")
                            image.setAttribute("src", chocolateServerAdress+imageUrl)
                            image.setAttribute("alt", serieName)
                            image.setAttribute("title", serieName)
                            let title = document.createElement("p")
                            title.setAttribute("class", "serieTitle")
                            title.innerHTML = serieName

                            serie.appendChild(image)
                            serie.appendChild(title)
                            similar.appendChild(serie)
                        }
                    }
                }
                let serieSeasonsKeys = Object.keys(serieSeasons)
                for (let keys of serieSeasonsKeys) {
                    let season = serieSeasons[keys]
                    let seasonCover = season.seasonCoverPath
                    let seasonName = season.seasonName
                    let seasonNumber = season.seasonNumber
                    let seasonId = season.seasonId

                    let seasonDiv = document.createElement("div")
                    seasonDiv.className = "season"
                    seasonDiv.setAttribute("id", seasonNumber)
                    seasonDiv.addEventListener("click", function() {
                        goToSeason(seasonId)
                    })

                    let seasonCoverImage = document.createElement("img")
                    seasonCoverImage.className = "seasonCoverImage"
                    seasonCoverImage.setAttribute("src", chocolateServerAdress+seasonCover)
                    seasonCoverImage.setAttribute("alt", seasonName)
                    seasonCoverImage.setAttribute("title", seasonName)
                    seasonCoverImage.addEventListener("click", function() {
                        goToSeason(seasonId)
                    })

                    let seasonNameP = document.createElement("p")
                    seasonNameP.className = "seasonTitle"
                    seasonNameP.innerHTML = seasonName
                    seasonNameP.addEventListener("click", function() {
                        goToSeason(seasonId)
                    })

                    seasonDiv.appendChild(seasonCoverImage)
                    seasonDiv.appendChild(seasonNameP)
                    containerSeasons.appendChild(seasonDiv)
                }

                let serieSeasonsLength = serieSeasons.length
                containerSeasons = document.getElementsByClassName("containerSeasons")[0]
                if (serieSeasonsLength >= 4) {
                    containerSeasons.style.gridTemplateColumns = "repeat(4, 1fr)"
                } else if (serieSeasonsLength === 0) {
                    containerSeasons.style.display = "none"
                } else {
                    containerSeasons.style.gridTemplateColumns = "repeat(" + serieSeasonsLength + ", 1fr)"
                }

                let childs = document.getElementsByClassName("serie")
                let childsLength = childs.length
                let similar = document.getElementsByClassName("containerSimilar")[0]
                similar.style.gridTemplateColumns = "repeat(" + childsLength + ", 1fr)"


                let imagePopup = document.getElementsByClassName("coverPopup")[0]
                imagePopup.setAttribute("src", chocolateServerAdress+seriePoster);
                if (imagePopup.src === "https://image.tmdb.org/t/p/originalNone") {
                    imagePopup.src = "/images/broken.webp"
                }
                imagePopup.setAttribute("alt", serieTitle);
                imagePopup.setAttribute("title", serieTitle);

                let titlePopup = document.getElementsByClassName("titlePopup")[0]
                titlePopup.innerHTML = serieTitle;

                let descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
                descriptionPopup.innerHTML = serieDescription;

                let notePopup = document.getElementsByClassName("notePopup")[0]
                notePopup.innerHTML = `Note : ${serieNote}/10`;

                let yearPopup = document.getElementsByClassName("yearPopup")[0]
                yearPopup.innerHTML = `Date : ${serieYear}`;

                let genrePopup = document.getElementsByClassName("genrePopup")[0]
                let genreList = JSON.parse(serieGenre)
                let genreString = genreList.join(", ")

                genrePopup.innerHTML = `Genre : ${genreString}`;

                let durationPopup = document.getElementsByClassName("durationPopup")[0]
                durationPopup.innerHTML = `Durée : ${serieDuration}`;
                serieCast = JSON.parse(serieCast)
                for (let i = 0; i < serieCast.length; i++) {
                    let cast = serieCast[i]
                    let castMember = document.createElement("div")
                    castMember.className = "castMember"
                    let castImage = document.createElement("img")
                    castImage.className = "castImage"
                    let castImageUrl = cast[2]
                    if (castImageUrl === "None") {
                        castImage.src = "/images/broken.webp"
                    }
                    let castRealName = cast[0]
                    let castCharacterName = cast[1]
                    let castId = cast[3]
                    castImage.setAttribute("src", chocolateServerAdress+castImageUrl)
                    castImage.setAttribute("alt", cast[4])
                    castImage.setAttribute("title", castId)
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
                        let castId = castImage.getAttribute("title")
                        let castUrl = "/actor/" + castId
                        window.location.href = castUrl
                    })
                }

                let trailer = document.getElementsByClassName("containerTrailer")[0]
                if (serieTrailer === undefined || serieTrailer === "") {
                    trailer.style.display = "none"
                } else {
                    trailer.style.display = "block"
                    let trailerVideo = document.createElement("iframe")
                    let regex = /^(http|https):\/\//g
                    if (regex.test(serieTrailer)) {
                        serieTrailer.replace(regex, "")
                    }
                    trailerVideo.setAttribute("src", serieTrailer)
                    trailerVideo.setAttribute("class", "trailerVideo")
                    trailerVideo.setAttribute("id", "trailerVideo")
                    trailer.appendChild(trailerVideo)
                }
            })
        })
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

    function editSerie(title, library) {
        window.location.href = `/editSerie/${title}/${library}`
    }

    function closePopup() {
        let popup = document.getElementById("popup")
        popup.style.display = "none"

        document.body.style.overflow = "auto"

        let imagePopup = document.getElementsByClassName("coverPopup")[0]
        imagePopup.setAttribute("src", "");
        imagePopup.setAttribute("alt", "");
        imagePopup.setAttribute("title", "");

        let titlePopup = document.getElementsByClassName("titlePopup")[0]
        titlePopup.innerHTML = "";

        let descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
        descriptionPopup.innerHTML = "";

        let notePopup = document.getElementsByClassName("notePopup")[0]
        notePopup.innerHTML = "";

        let yearPopup = document.getElementsByClassName("yearPopup")[0]
        yearPopup.innerHTML = "";

        let genrePopup = document.getElementsByClassName("genrePopup")[0]
        genrePopup.innerHTML = "";

        let durationPopup = document.getElementsByClassName("durationPopup")[0]
        durationPopup.innerHTML = "";

        let castPopup = document.getElementById("castPopup")
        let castDivs = document.getElementsByClassName("castMember")
        let image = document.getElementsByClassName("castImage")[0]
        while (castDivs.length > 0) {
            image.setAttribute("src", "")
            castPopup.removeChild(castDivs[0])
        }
        let childs = document.getElementsByClassName("serie")
        while (childs.length > 0) {
            childs[0].remove()
        }
        try {
        let similar = document.getElementsByClassName("containerSimilar")[0]
        similar.style.gridTemplateColumns = "repeat(0, 1fr)"
        } catch (error) {
            //pass
        }

        try {
            const seasons = document.getElementsByClassName("containerSeasons")[0]
            seasons.innerHTML = ""
        } catch (error) {
            //pass
        }
        try {
            let downloadSerie = document.getElementById("downloadSerieButton")
            downloadSerie.setAttribute("href", "")
        } catch (error) {
            //pass
        }
        
        let trailerVideo = document.getElementsByClassName("trailerVideo")
        for (let i = 0; i < trailerVideo.length; i++) {
            let trailer = trailerVideo[i]
            trailer.setAttribute("src", "")
            trailer.remove()
        }
    }

    function hideLoader() {
        let loader = document.getElementById("loaderBackground")
        let spinner = document.getElementById("spinner")
        try {
            spinner.style.display = "none"
            loader.style.display = "none"
        } catch {
            //do nothing
        }
    }

    function getFirstSeries(searchTerm="") {
        let chocolateServerAdress = getCookie("serverAdress")
        let username = getCookie("username")
        let series = document.getElementById("series")
        let url = window.location.href
        let library = url.split("/")[4]

        let routeToUse = ""
        if (searchTerm === "") {
            routeToUse = `${chocolateServerAdress}getAllSeries/${library}/${username}`
        } else {
            routeToUse = `${chocolateServerAdress}searchSeries/${library}/${username}/${searchTerm}`
        }
        let allGenres = []
        fetch(routeToUse, {
            credentials: "same-origin"
          }).then(function(response) {
            return response.json()
        }).then(function(data) {
            data = Object.entries(data)
            let lengthToSlice = 5
            if (data.length < 5) {
                lengthToSlice = data.length
            }
            hideLoader()
            let startIndex = 0
            for (let serie of data) {
                let index = data.indexOf(serie)
                if (index === 0) {
                    let imageBanner = document.getElementsByClassName("bannerCover")[0]
                    let genreBanner = document.getElementsByClassName("bannerGenre")[0]
                    let titleBanner = document.getElementsByClassName("bannerTitle")[0]
                    let descriptionBanner = document.getElementsByClassName("bannerDescription")[0]

                    let bannerImage = serie[1]["banniere"]
                    let cssBigBanner = `background-image: linear-gradient(to bottom, rgb(255 255 255 / 0%), rgb(29 29 29)), url("${chocolateServerAdress}${bannerImage}");`
                    imageBanner.setAttribute("style", cssBigBanner)
                    imageBanner.setAttribute("serieid", serie[1]["id"])

                    titleBanner.innerHTML = serie[1]["name"]
                    let fullDescription = serie[1]["description"]
                    if (fullDescription.length > 200) {
                        descriptionBanner.innerHTML = fullDescription.substring(0, 200) + "..."
                        descriptionBanner.innerHTML += " <a id='lireLaSuite' href='#'>Lire la suite</a>"

                        let lireLaSuite = document.getElementById("lireLaSuite")
                        lireLaSuite.addEventListener("click", function() {
                            descriptionBanner.innerHTML = fullDescription
                        })
                    } else {
                        descriptionBanner.innerHTML = fullDescription
                    }

                    let genres = serie[1]["genre"]
                    let genre = JSON.parse(genres)
                    genreBanner.innerHTML = ""
                    genres = genre.join(", ")
                    genreBanner.innerHTML += genres
                } else {
                    series = document.getElementsByClassName("series")[0]
                    let cover = document.createElement("div")
                    cover.className = "cover"
                    cover.setAttribute("data-lib", library)

                    let genres = serie[1]["genre"]
                    genres = JSON.parse(genres)
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
                    
                    cover.setAttribute("data-title", serie[1]["name"])
                    cover.setAttribute("data-rating", serie[1]["note"])
                    //get a cover with the same name, check if it exists, if it, return
                    let query = `#series > div.cover[data-title="${serie[1]["name"]}"]`
                    let coverAlreadyExists = document.querySelector(query)
                    if (coverAlreadyExists !== null) {
                        return
                    }

                    let dateString = serie[1]["date"];
                    const dateParts = dateString.split("-");
                    const day = parseInt(dateParts[2], 10);
                    const month = parseInt(dateParts[1], 10);
                    const year = parseInt(dateParts[0], 10);
                    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    let daysSinceStartOfYear = 0;
                    
                    for (let i = 0; i < month - 1; i++) {
                    daysSinceStartOfYear += daysInMonth[i];
                    }
                    
                    daysSinceStartOfYear += day;
                    const daysSinceStartOfTime = (year * 365) + daysSinceStartOfYear;

                    cover.setAttribute("data-date", daysSinceStartOfTime)


                    let content = document.createElement("div")
                    content.className = "content"
                    let image = document.createElement("img")
                    // eslint-disable-next-line no-loop-func
                    image.addEventListener("load", function() {
                        if (startIndex === lengthToSlice) {
                            //hideLoader()
                        }
                        startIndex += 1
                    })
                    image.className = "cover_serie"
                    if (serie[1]["serieCoverPath"] === "https://image.tmdb.org/t/p/originalNone" || serie[1]["serieCoverPath"] === undefined || serie[1]["serieCoverPath"] === "undefined" || serie[1]["serieCoverPath"] === "") {
                        image.src = "/images/broken.webp"
                    } else {
                        image.src = chocolateServerAdress+serie[1]["serieCoverPath"]
                    }
                    image.title = serie[0]
                    image.alt = serie[0]
                    image.setAttribute("serieId", serie[1]["id"].toString())
                    if (index >= 18) { 
                        image.setAttribute("loading", "lazy");
                    }
                    serie = serie[1]
                    content.appendChild(image)
                    cover.appendChild(content)
                    let accType = getCookie("accountType")
                    accType = "Admin"
                    if (accType === "Admin") {
                        console.log(serie)
                        let modelIcon = document.getElementById("editButtonSVG")

                        let pencilIcon = modelIcon.cloneNode(true)
                        //remove class hidden
                        pencilIcon.classList.remove("hidden")
                        pencilIcon.setAttribute("class", "pencilIcon")
                        pencilIcon.setAttribute("title", "Edit metadata")
                        pencilIcon.setAttribute("alt", "Edit metadata")
                        pencilIcon.setAttribute("id", serie.originalName)

                        let theSerieName = serie.originalName
                        let library = serie.libraryName
                        pencilIcon.addEventListener("click", function() {
                            editSerie(theSerieName, library)
                        })
                        cover.appendChild(pencilIcon)
                    }
                    series.appendChild(cover)
                }
            }

        

        if (data.length === 1) {
            let bigBackground = document.getElementsByClassName("bannerCover")[0]
            bigBackground.style.height = "100vh"

            let bannerGenre = document.getElementsByClassName("bannerGenre")[0]
            let bannerTitle = document.getElementsByClassName("bannerTitle")[0]
            let bannerDescription = document.getElementsByClassName("bannerDescription")[0]
            let watchNow = document.getElementsByClassName("watchNowA")[0]
            let rescanButton = document.getElementById("rescanButton")

            let selectA = document.getElementsByClassName("selectA")[0]
            let sortA = document.getElementsByClassName("sortA")[0]

            bannerGenre.style.top = "46vh"
            bannerTitle.style.top = "47.5vh"
            bannerDescription.style.top = "55vh"
            watchNow.style.top = "65vh"
            rescanButton.style.marginTop = "65vh"

            selectA.style.display = "none"
            sortA.style.display = "none"
        }

        
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
        closePopup()
        setGenreCheckboxes()
    })
    }

    function showLoader() {
        let spinner = document.getElementsByClassName("spinner")[0]
        let backgroundSpinner = document.getElementById("loaderBackground")
        spinner.style.opacity = "1"
        spinner.style.display = "block"
        backgroundSpinner.style.display = "block"
    }

    function forceHideLoader() {
        let loaderBackground = document.getElementById("loaderBackground")
        loaderBackground.style.display = "none"
        let spinner = document.getElementsByClassName("spinner")[0]
        spinner.style.display = "none"
        spinner.style.opacity = "0"
    }

    let oldSelectValue = "title"

    function sortSeries() {
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
        showLoader()
        let allSeries = document.getElementById("series")
        let series = allSeries.children
        let seriesArray = []
        for (let i = 0; i < series.length; i++) {
            seriesArray.push(series[i])
        }
        seriesArray.sort(function(a, b) {
            let titleA = a.getAttribute("data-title")
            let titleB = b.getAttribute("data-title")
            if (titleA < titleB) {
                return -1
            } else if (titleA > titleB) {
                return 1
            }
            return 0
        })
        allSeries.innerHTML = ""
        if (oldSelectValue === "title") {
            seriesArray.reverse()
            oldSelectValue = "titleReverse"
        } else {
            oldSelectValue = "title"
        }

        for (let i = 0; i < seriesArray.length; i++) {
            allSeries.appendChild(seriesArray[i])
        }
        
        forceHideLoader()
    }

    function orderByRating() {
        showLoader()
        let allSeries = document.getElementById("series")
        let series = allSeries.children
        let seriesArray = []
        for (let i = 0; i < series.length; i++) {
            seriesArray.push(series[i])
        }
        seriesArray.sort(function(a, b) {
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
            seriesArray.reverse()
            oldSelectValue = "ratingReverse"
        } else {
            oldSelectValue = "rating"
        }


        allSeries.innerHTML = ""
        for (let i = 0; i < seriesArray.length; i++) {
            allSeries.appendChild(seriesArray[i])
        }
        forceHideLoader()
    }

    function orderByDate() {
        showLoader()
        let allSeries = document.getElementById("series")
        let series = allSeries.children
        let seriesArray = []
        for (let i = 0; i < series.length; i++) {
            seriesArray.push(series[i])
        }
        seriesArray.sort(function(a, b) {
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
            seriesArray.reverse()
            oldSelectValue = "dateReverse"
        } else {
            oldSelectValue = "date"
        }



        allSeries.innerHTML = ""
        for (let i = 0; i < seriesArray.length; i++) {
            allSeries.appendChild(seriesArray[i])
        }
        forceHideLoader()
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

                filterSeries()
            })
        }
    }

    function filterSeries() {
        const allSeries = document.getElementsByClassName("cover")
        //allGenreCheckeds c"est tous les clés de genreChecked qui sont à true
        const allGenreCheckeds = Object.keys(genreChecked).filter(key => genreChecked[key] === true)
        for (const serie of allSeries) {
            let work = true
            for (let genre of allGenreCheckeds) {
                let allGenresOfSerie = serie.getAttribute("data-genre")
                if (allGenresOfSerie.includes(genre) === false) {
                    work = false
                }
            }
            if (work === true) {
                serie.style.display = "block"
            } else {
                serie.style.display = "none"
            }
        }
    }

    /*function removeLoader(data){
        if (data.length <= 1) {
            let spinner = document.getElementsByClassName("spinner")[0]
            let backgroundSpinner = document.getElementById("loaderBackground")
            spinner.style.opacity = "0"
            spinner.style.display = "none"
            backgroundSpinner.style.display = "none"
        } else {
            const imgs = document.images
            const imgsArray = Array.prototype.slice.call(document.images)
            imgs.length = 32
            imgsArray.splice(36, imgsArray.length - 1)
            imgsArray.splice(0, 4)
            for (let img of imgsArray) {
                const acutalIndex = imgsArray.indexOf(img)
                img = imgs.item(acutalIndex)
                img.addEventListener("load", function() {
                    const imagesLenght = imgsArray.length - 1
                    if (acutalIndex === (imagesLenght-4)) {
                        let spinner = document.getElementsByClassName("spinner")[0]
                        let backgroundSpinner = document.getElementById("loaderBackground")
                        spinner.style.opacity = "0"
                        spinner.style.display = "none"
                        backgroundSpinner.style.display = "none"
                    }
                })
            }
        }
    }*/



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


    function removeAllSeries() {
        let series = document.getElementById("series")
        series.innerHTML = ""
    }

    function search() {
        let searchBar = document.getElementById("search")
        let searchValue = searchBar.value
        removeAllSeries()
        getFirstSeries(searchValue)
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
        getFirstSeries()
    }, []);
    

    


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
                <select className="sortSelect" id="sortSelect" onChange={sortSeries}>
                <option value="" disabled="" style={{ display: "none" }} >Alphabetic</option>
                <option value="title" selected="">
                    Alphabetic
                </option>
                <option value="rating">Rating</option>
                <option value="date">Date</option>
                </select>
            </button>
            <Popup />
            <div className="bigBanner">
                <div className="bannerCover"></div>
                <p className="bannerGenre">
                </p>
                <h1 className="bannerTitle">.</h1>
                <p className="bannerDescription">
                </p>
                <button className="watchNowA">
                <IoPlayOutline className="watchNow" />
                {language["watchNow"]}
                </button>
            </div>
            </>
            <div className="series" id="series"></div>
            <IoPencilOutline id="editButtonSVG" className="hidden" />
        </div>
    );
}

export default Series;
