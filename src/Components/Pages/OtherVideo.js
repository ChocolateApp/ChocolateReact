import React from "react";
import Header from "./../Shared/Header";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "./../Shared/VideoJS";
//import "./static/js/videoJS/videojs.hotkeys.js";
//import "./static/js/videoJS/videojs-mobile-ui.js";

function OtherVideo() {

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

  let lastPush = 0
  const handleTimeUpdate = () => {
    let cookie = getCookie("serverAdress")
    let username = getCookie("username")
    const setUrl = `${cookie}setVuesOtherTimeCode/`;
    console.log("setUrl",setUrl)
    let currentTime = playerRef.current.currentTime()
    currentTime = parseInt(currentTime)
    if (currentTime === lastPush+1) {
        console.log("pushing new timecode",currentTime+" for movie "+movieID+" to server "+setUrl)
        fetch(setUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            //set the form
            body: JSON.stringify({
                movieHASH: movieID,
                timeCode: currentTime,
                username: username
            })
        })
        lastPush = currentTime
    }
  };

  const movieID = window.location.href.split("/")[4];
  const chocolateServerAdress = getCookie("serverAdress");
  const sourceURL = `${chocolateServerAdress}mainOther/${movieID}`;

  const playerRef = React.useRef(null);

  const options = {
    autoplay: true,
    controls: true,
    sources: [{
      src: sourceURL,
      type: "application/x-mpegURL"
    }]
  };
  
  const handlePlayerReady = (player, setUrl) => {
    playerRef.current = player;
    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
    player.on("timeupdate", () => {
      handleTimeUpdate()
    });
    /*
    player.maxQualitySelector({
      "defaultQuality": 2,
      "displayMode": 0
    })

    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false
    })

    player.mobileUi()*/

  };

  return (
    <div className="App">
      <Header />
      <VideoJS options={options} onReady={handlePlayerReady}/>
    </div>
  );
  
}

export default OtherVideo;