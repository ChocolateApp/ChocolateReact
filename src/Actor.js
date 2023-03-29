import "./App.css";
import Header from "./Header";
import Popup from "./Popup";
import { useEffect } from "react";

function Actor() {
  
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
  const language = JSON.parse(localStorage.getItem("languageFile"));

  
  function goToSeason(id) {
    let href = "/season/" + id
    window.location.href = href
  }

  function setPopup() {
    let contents = document.getElementsByClassName("content")
    let chocolateServerAdress = getCookie("serverAdress")
    Array.from(contents).forEach(function(content) {
        content.addEventListener("click", function() {
            let mediaType = content.getAttribute("mediaType")
            let popup = document.getElementById("popup")
            popup.style.display = "block"
            document.body.style.overflow = "hidden"
            let image = content.children[0].children[0]
            let movieId = image.getAttribute("data-id")
            if (mediaType === "movie") {
                fetch(chocolateServerAdress+"getMovieData/" + movieId).then(function(response) {
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
                    let movieYear = data.date
                    let movieTrailer = data.bandeAnnonce
                    let movieSimilar = data.similarMovies
                    let containerSimilar = document.getElementsByClassName("containerSimilar")[0]

                    if (movieSimilar.length === 0) {
                        containerSimilar.style.display = "none"

                    } else {
                        containerSimilar.style.display = "inline-grid"
                    }

                    for (let i = 0; i < movieSimilar.length; i++) {
                        let movie = movieSimilar[i]
                        let imageUrl = movie.cover
                        let movieName = movie.realTitle
                        movieId = movie.id
                        let similar = document.getElementsByClassName("containerSimilar")[0]
                        movie = document.createElement("div")
                        movie.setAttribute("class", "movie")
                        let image = document.createElement("img")
                        image.setAttribute("class", "movieImage")
                        image.setAttribute("src", chocolateServerAdress+imageUrl)
                        image.setAttribute("alt", movieName)
                        image.setAttribute("title", movieName)
                        let title = document.createElement("p")
                        title.setAttribute("class", "movieTitle")
                        title.innerHTML = movieName

                        movie.appendChild(image)
                        movie.appendChild(title)
                        similar.appendChild(movie)
                    }

                    let childs = document.getElementsByClassName("movie")
                    let childsLength = childs.length
                    let similar = document.getElementsByClassName("containerSimilar")[0]
                    similar.style.gridTemplateColumns = "repeat(" + childsLength + ", 1fr)"


                    let imagePopup = document.getElementsByClassName("coverPopup")[0]
                    imagePopup.setAttribute("src", chocolateServerAdress+moviePoster);
                    if (imagePopup.src === "https://image.tmdb.org/t/p/originalNone") {
                        imagePopup.src = "/images/broken.webp"
                    }
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
                        castImage.setAttribute("src", chocolateServerAdress+castImageUrl)
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
                        if (movieTrailer !== undefined) {
                          trailerVideo.setAttribute("src", movieTrailer)
                          trailerVideo.setAttribute("class", "trailerVideo")
                          trailerVideo.setAttribute("id", "trailerVideo")
                          trailer.appendChild(trailerVideo)
                        } else {
                          trailer.style.display = "none"
                        }
                    }

                    let playButton = document.getElementsByClassName("playPopup")[0]
                    playButton.setAttribute("href", movieUrl);
                    playButton.style.display = "flex"
                    
                    let downloadButton = document.getElementsByClassName("downloadPopup")[0]
                    downloadButton.style.display = "flex"

                    let popupContent = document.getElementsByClassName("popupContent")[0]
                    popupContent.style.height = "78vh"
                })
            } else {
                fetch(chocolateServerAdress+"getSerieData/" + movieId).then(function(response) {
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
                        if (serieTrailer !== undefined) {
                          trailerVideo.setAttribute("src", serieTrailer)
                          trailerVideo.setAttribute("class", "trailerVideo")
                          trailerVideo.setAttribute("id", "trailerVideo")
                          trailer.appendChild(trailerVideo)
                        } else {
                          trailer.style.display = "none"
                        }
                    }
                    
                    let playButton = document.getElementsByClassName("playPopup")[0]
                    playButton.style.display = "none"
                    
                    let downloadButton = document.getElementsByClassName("downloadPopup")[0]
                    downloadButton.style.display = "none"

                    let popupContent = document.getElementsByClassName("popupContent")[0]
                    popupContent.style.height = "86vh"
                })
            }
        })
    })
    let moviesTitleH2 = document.getElementsByClassName("moviesTitle")[0]
    let seriesTitleH2 = document.getElementsByClassName("seriesTitle")[0]
    let actorMovieDiv = document.getElementsByClassName("actorMoviesList")[0]
    let actorSerieDiv = document.getElementsByClassName("actorSeriesList")[0]

    let numberOfMovies = actorMovieDiv.children.length
    let numberOfSeries = actorSerieDiv.children.length

    if (numberOfSeries === 0) {
        seriesTitleH2.style.display = "none"
        actorSerieDiv.style.display = "none"
    } else if (numberOfSeries <= 3) {
        seriesTitleH2.style.display = "block"
        actorSerieDiv.style.gridTemplateColumns = "repeat(" + numberOfSeries + ", 1fr)"
        actorSerieDiv.style.display = "grid"
    } else {
        seriesTitleH2.style.display = "block"
        actorSerieDiv.style.gridTemplateColumns = "repeat(3, 1fr)"
        actorSerieDiv.style.display = "grid"
    }
    
    if (numberOfMovies === 0) {
        moviesTitleH2.style.display = "none"
        actorMovieDiv.style.display = "none"
    } else if (numberOfMovies <= 3) {
        moviesTitleH2.style.display = "block"
        actorMovieDiv.style.gridTemplateColumns = "repeat(" + numberOfMovies + ", 1fr)"
        actorMovieDiv.style.display = "grid"
    } else {
        moviesTitleH2.style.display = "block"
        actorMovieDiv.style.gridTemplateColumns = "repeat(3, 1fr)"
        actorMovieDiv.style.display = "grid"
    }
  }

  function getActorMovies() {
    let href = window.location.href
    let actorId = href.split("/")
    actorId = actorId[actorId.length - 1]
    if (actorId === undefined) {
      return
    }
    let chocolateServerAdress = getCookie("serverAdress")
    let url = `${chocolateServerAdress}/getActorData/${actorId}`
    fetch(url).then(function(response) {
        return response.json()
    }).then(function(data) {

        let actorName = data.actorName
        let actorImageLink = data.actorImage
        let actorDescriptionText = data.actorDescription
        let actorMovies = data.actorMovies
        let actorSeries = data.actorSeries

        let actorNameTitle = document.getElementsByClassName("actorName")[0]
        actorNameTitle.innerHTML = actorName

        let actorMovieDiv = document.getElementsByClassName("actorMoviesList")[0]
        let actorSerieDiv = document.getElementsByClassName("actorSeriesList")[0]

        let actorImage = document.getElementsByClassName("actorPicture")[0]
        actorImage.setAttribute("src", chocolateServerAdress+actorImageLink)
        actorImage.setAttribute("alt", actorName)
        actorImage.setAttribute("title", actorName)

        let actorDescription = document.getElementsByClassName("actorBiography")[0]
        actorDescription.innerHTML = actorDescriptionText
        if (actorDescription.length > 1100) {
            actorDescription.innerHTML = actorDescription.innerHTML.substring(0, 1100) + "..."
            actorDescription.innerHTML += " <a id='lireLaSuite' href='#'>Lire la suite</a>"
            let lireLaSuite = document.getElementById("lireLaSuite")
            lireLaSuite.addEventListener("click", function() {
                actorDescription.innerHTML = actorDescriptionText
                let actorInformation = document.getElementById("actorInformations")
                actorInformation.style.overflow = "scroll"
            })
        }

        let actorMoviesList = document.getElementsByClassName("actorMoviesList")[0]
        if (actorMoviesList.children.length > 0) {
            return
        }


        for (let i = 0; i < actorMovies.length; i++) {
            let realTitle = actorMovies[i].realTitle
            let cover = actorMovies[i].cover
            let actorMovie = document.createElement("div")
            actorMovie.setAttribute("class", "actorMovie cover")
            actorMovie.setAttribute("id", "cover")

            let actorMovieContent = document.createElement("div")
            actorMovieContent.setAttribute("class", "actorMovieContent content")
            actorMovieContent.setAttribute("mediaType", "movie")

            let actorMoviePicture = document.createElement("img")
            actorMoviePicture.setAttribute("class", "actorMoviePicture cover_movie")
            actorMoviePicture.setAttribute("src", chocolateServerAdress+cover)
            actorMoviePicture.setAttribute("alt", realTitle)
            actorMoviePicture.setAttribute("title", realTitle)
            actorMoviePicture.setAttribute("data-id", actorMovies[i].id)
            let actorMovieTitle = document.createElement("p")
            actorMovieTitle.setAttribute("class", "actorMovieTitle")
            actorMovieTitle.innerHTML = realTitle

            actorMovie.appendChild(actorMoviePicture)
            actorMovie.appendChild(actorMovieTitle)
            actorMovieContent.appendChild(actorMovie)
            actorMovieDiv.appendChild(actorMovieContent)
        }

        for (let i = 0; i < actorSeries.length; i++) {
            let realTitle = actorSeries[i].name
            let cover = actorSeries[i].serieCoverPath
            let actorSerie = document.createElement("div")
            actorSerie.setAttribute("class", "actorSerie cover")
            actorSerie.setAttribute("id", "cover")

            let actorSerieContent = document.createElement("div")
            actorSerieContent.setAttribute("class", "actorSerieContent content")
            actorSerieContent.setAttribute("mediaType", "serie")

            let actorSeriePicture = document.createElement("img")
            actorSeriePicture.setAttribute("class", "actorSeriePicture cover_movie")
            actorSeriePicture.setAttribute("src", chocolateServerAdress+cover)
            actorSeriePicture.setAttribute("alt", realTitle)
            actorSeriePicture.setAttribute("title", realTitle)
            actorSeriePicture.setAttribute("data-id", actorSeries[i].id)
            let actorSerieTitle = document.createElement("p")
            actorSerieTitle.setAttribute("class", "actorSerieTitle")
            actorSerieTitle.innerHTML = realTitle

            actorSerie.appendChild(actorSeriePicture)
            actorSerie.appendChild(actorSerieTitle)
            actorSerieContent.appendChild(actorSerie)
            actorSerieDiv.appendChild(actorSerieContent)
        }

        setPopup()
    })
  }

  
  useEffect(() => {
    getActorMovies()
  }, []);

  return (
    <div className="App">
      <Header />
      <Popup />
      <div className="actorInfo">
        <div className="actorInformations" id="actorInformations">
            <h1 className="actorName">.</h1>
            <img className="actorPicture" src="" alt=""></img>
            <p className="actorBiography"></p>
        </div>
        <div className="actorMovies">
            <h2 className="moviesTitle">{language["movies"] }</h2>
            <div className="actorMoviesList">
            </div>
        </div>
        <div className="actorSeries">
            <h2 className="seriesTitle">{language["series"] }</h2>
            <div className="actorSeriesList">
            </div>
        </div>
      </div>
    </div>
  );
  
}

export default Actor;