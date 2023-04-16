import "./App.css";
import { IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useEffect } from "react";
import Header from "./Header";

function App() {
  const language = JSON.parse(localStorage.getItem("languageFile"));

  function checkCanDownload() {
    let theResponse = "ratio";
    let chocolateServerAdress = getCookie("serverAdress");
    fetch(`${chocolateServerAdress}checkDownload`, {
        credentials: "same-origin"
        })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        theResponse = data
        return theResponse
    })
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

  function getSeasonData() {
      let url = window.location.href
      let urlArray = url.split("/")
      let id = urlArray[urlArray.length - 1]
      let chocolateServerAdress2 = getCookie("serverAdress")
      id = id.replace("#", "")
      let https = urlArray[0]
      if (https === "https:") {
          document.head.innerHTML += "<meta http-equiv='Content-Security-Policy' content='upgrade-insecure-requests'>"
      }
      let finalURI = `${chocolateServerAdress2}getSeasonData/${id}`
      fetch(finalURI).then(function(response) {
          return response.json()
      }).then(function(data) {
          let episodes = data["episodes"]
          episodes = Object.entries(episodes)
          let watchNowLanguage = document.getElementsByClassName("watchNowA")[0].innerHTML
          while (watchNowLanguage === "") {
            setTimeout(function(){}, 100);
          }
          for (let i = 0; i < episodes.length; i++) {
              if (i !== 0) {
                  let episodesDiv = document.getElementsByClassName("episodes")[0]
                  let episode = episodes[i][1]

                  //get a div with the attribute data-episodeid = episode["episodeId"], if it exists, return the function
                  let episodeDiv = document.querySelector(`[data-episodeid="${episode["episodeId"]}"]`)
                  if (episodeDiv !== null) {
                    return
                  }

                  let cover = document.createElement("div")
                  cover.className = "coverEpisodes"
                  cover.setAttribute("data-episodeid", episode["episodeId"])
                  let content = document.createElement("div")
                  content.className = "contentEpisodes"
                  let image = document.createElement("img")
                  image.className = "cover_episode"
                  let title = document.createElement("div")
                  title.className = "title"
                  title.innerHTML = episode["episodeName"]

                  let episodeTitle = document.createElement("h1")
                  episodeTitle.className = "episodeTitle"
                  const innerHTML = "EP" + episode["episodeNumber"] + " - " + episode["episodeName"]
                  episodeTitle.innerHTML = innerHTML

                  let episodeDescription = document.createElement("p")
                  episodeDescription.className = "episodeDescription"
                  episodeDescription.innerHTML = episode["episodeDescription"]
                  if (episode["episodeCoverPath"].startsWith("http")) {
                      image.src = episode["episodeCoverPath"]
                  } else {
                    let chocolateServerAdress2 = getCookie("serverAdress")
                    image.src = chocolateServerAdress2+episode["episodeCoverPath"];
                  }
                  image.title = episode["episodeName"]
                  image.alt = episode["episodeName"]
                  let episodeId = episode["episodeId"]

                  let cookieValue = getCookie(image.title)
                  if (cookieValue !== undefined) {
                      let timePopup = document.createElement("div")
                      timePopup.className = "timePopupSeason"
                      let timeP = document.createElement("p")
                      timeP.innerHTML = cookieValue
                      timePopup.appendChild(timeP)
                      cover.appendChild(timePopup)
                  }

                  let episodeText = document.createElement("div")
                  episodeText.className = "episodeText"
                  episodeText.appendChild(episodeTitle)
                  episodeText.appendChild(episodeDescription)

                  let watchNowButton = document.createElement("a")
                  watchNowButton.className = "watchNowSeason md hydrated"

                  

                  let serieURL = `/episode/${episodeId}`
                  watchNowButton.href = serieURL
                  watchNowButton.innerHTML += watchNowLanguage
                  let episodeButtons = document.createElement("div")
                  episodeButtons.className = "episodeButtons"
                  episodeButtons.appendChild(watchNowButton)
                  let canDownload = checkCanDownload()
                  if (canDownload) {
                      let downloadNowButton = document.createElement("a")
                      downloadNowButton.className = "downloadNowSeason"
                      downloadNowButton.href = `${chocolateServerAdress2}downloadEpisode/${episodeId}`
                      downloadNowButton.innerHTML += document.getElementsByClassName("downloadNowA")[0].innerHTML
                      episodeButtons.appendChild(downloadNowButton)
                  }
                  episodeText.appendChild(episodeButtons)
                  content.appendChild(image)
                  content.appendChild(episodeText)
                  cover.appendChild(content)
                  episodesDiv.appendChild(cover)
              } else {
                  let episode = episodes[i][1]
                  let episodeId = episode["episodeId"]
                  let imageBanner = document.getElementsByClassName("bannerSeasonCover")[0]
                  let titleBanner = document.getElementsByClassName("bannerTitle")[0]
                  let descriptionBanner = document.getElementsByClassName("bannerDescription")[0]
                  let watchNow = document.getElementsByClassName("watchNowA")[0]

                  let downloadNowA = document.getElementById("downloadNowA")
                  let canDownload = checkCanDownload()
                  console.log(canDownload)
                  if (canDownload) {
                      let chocolateServerAdress2 = getCookie("serverAdress")
                      downloadNowA.setAttribute("href", chocolateServerAdress2+"downloadEpisode/" + episodeId)
                      downloadNowA.style.display = "block"
                  } else {
                      try {
                        downloadNowA.remove()
                      } catch (error) {
                      }
                  }


                  let serieURL = `/episode/${episodeId}`
                  let imageSrc = episode["episodeCoverPath"]
                  let chocolateServerAdress2 = getCookie("serverAdress")
                  if (episode["episodeCoverPath"].startsWith("http")) {
                    imageSrc = episode["episodeCoverPath"]
                  } else {
                    imageSrc = chocolateServerAdress2+episode["episodeCoverPath"]
                  }
                  
                  let cssBigBanner = `background-image: linear-gradient(to bottom, rgb(255 255 255 / 0%), rgb(29 29 29)), url("${imageSrc}")`
                  imageBanner.setAttribute("style", cssBigBanner)

                  titleBanner.innerHTML = `EP${episode["episodeNumber"]} - ${episode["episodeName"]}`
                  let description = episode.episodeDescription
                  descriptionBanner.innerHTML = description
                  descriptionBanner.innerHTML = descriptionBanner.innerHTML.substring(0, 200) + "..."
                  descriptionBanner.innerHTML += " <a id='lireLaSuite' href='#'>Lire la suite</a>"

                  let lireLaSuite = document.getElementById("lireLaSuite")
                  lireLaSuite.addEventListener("click", function() {
                      descriptionBanner.innerHTML = description
                  })

                  watchNow.setAttribute("href", serieURL)
              }
          }
      })
  }
    
  useEffect(() => {
    getSeasonData()
  }, []);


  return (
    <div className="App">  
      <Header />

      <div className="bigBanner">
        <div className="bannerSeasonCover"></div>
        <h1 className="bannerTitle">.</h1>
        <p className="bannerDescription">
        </p>
        <a className="watchNowA" href="/">
          <IoPlayOutline className="watchNow" />
          {language["watchNow"] }
        </a>
        <a className="downloadNowA" id="downloadNowA" href="/" style={{ display: "none" }}>
          <IoDownloadOutline className="downloadNow"/>
          {language["downloadButton"]}
        </a>
      </div>
      <div className="episodes"></div>
    </div>
  );
}

export default App;
