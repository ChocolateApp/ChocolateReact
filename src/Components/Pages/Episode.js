import React from "react";
import Header from "./../Shared/Header";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "./../Shared/VideoJS";
import { useEffect } from "react";
//import "./static/js/videoJS/videojs.hotkeys.js";
//import "./static/js/videoJS/videojs-mobile-ui.js";

function Serie() {
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

  function episodeData() {
    const serverAdress = getCookie("serverAdress")
    const episodeID = window.location.href.split("/")[4];
    const sourceURL = `${serverAdress}getEpisodeData/${episodeID}`;
    let buttons = document.getElementsByClassName("buttonsShow")[0];
    if (buttons !== undefined) {
      return
    }
    try {
      fetch(sourceURL)
      .then(response => response.json())
      .then(data => {
        const nextEpisode = data.nextEpisode;
        const previousEpisode = data.previousEpisode;

        if (nextEpisode !== null || previousEpisode !== null) {
          //create the div .buttonsShow
          const buttonsShow = document.createElement("div");
          buttonsShow.className = "buttonsShow";

          //create the a .previousEpisode
          if (previousEpisode !== null) {
            const previousEpisodeLink = document.createElement("a");
            previousEpisodeLink.className = "buttonPrevious";
            previousEpisodeLink.href = `/episode/${previousEpisode}`;
            previousEpisodeLink.innerHTML = "Previous Episode";
            buttonsShow.appendChild(previousEpisodeLink);
          } else {
            const previousEpisodeLink = document.createElement("a");
            previousEpisodeLink.style.opacity = "0";
            previousEpisodeLink.style.cursor = "default";
            buttonsShow.appendChild(previousEpisodeLink);
          }

          //create the a .nextEpisode
          if (nextEpisode !== null) {
            const nextEpisodeLink = document.createElement("a");
            nextEpisodeLink.className = "buttonNext";
            nextEpisodeLink.href = `/episode/${nextEpisode}`;
            nextEpisodeLink.innerHTML = "Next Episode";
            buttonsShow.appendChild(nextEpisodeLink);
          } else {
            const nextEpisodeLink = document.createElement("a");
            nextEpisodeLink.style.opacity = "0";
            nextEpisodeLink.style.cursor = "default";
            buttonsShow.appendChild(nextEpisodeLink);
          }
          let buttonsShowAlreadyExist = document.getElementsByClassName("buttonsShow")[0];
          if (buttonsShowAlreadyExist === undefined) {
            let app = document.getElementsByClassName("App")
            app[0].appendChild(buttonsShow);
          }
        }
      })
      .catch(error => {
        const meta = document.createElement("meta");
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "upgrade-insecure-requests";
        document.getElementsByTagName("head")[0].appendChild(meta);
        episodeData()
      });
    } catch (error) {
        const meta = document.createElement("meta");
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "upgrade-insecure-requests";
        document.getElementsByTagName("head")[0].appendChild(meta);
        episodeData()
    }
  }
  

  const serieID = window.location.href.split("/")[4];
  const sourceURL = `${getCookie("serverAdress")}mainSerie/${serieID}`;

  const playerRef = React.useRef(null);

  const options = {
    autoplay: true,
    controls: true,
    sources: [{
      src: sourceURL,
      type: "application/x-mpegURL"
    }]
  };
  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
    
    player.maxQualitySelector({
      "defaultQuality": 2,
      "displayMode": 0
    })

    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false
    })

    player.mobileUi()

  };
    
  useEffect(() => {
    episodeData()
  }, []);

  return (
    <div className="App">
      <Header />
      <VideoJS options={options} onReady={handlePlayerReady} />
    </div>
  );
  
}

export default Serie;