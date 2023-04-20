import React, { useState, useEffect } from "react";
import Header from "./../Shared/Header";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import VideoJS from "./../Shared/VideoJS";
import Loading from "./../Shared/Loading";

function Tv() {
  const [isLoading, setIsLoading] = useState(true);
  const [sourceURL, setSourceURL] = useState("");

  useEffect(() => {
    async function fetchData() {
      const chocolateServerAdress = getCookie("serverAdress");
      const library = window.location.href.split("/")[4];
      const id = window.location.href.split("/")[5];
      if (id === undefined || library === undefined) {
        return;
      }
      const response = await fetch(`${chocolateServerAdress}getTv/${library}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });
      const data = await response.json();
      const source = data["channelURL"];
      setSourceURL(source);
      setIsLoading(false);
      console.log("source", source);
    }
    fetchData();
  }, []);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const playerRef = React.useRef(null);

  const options = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: sourceURL,
        type: "application/x-mpegURL",
      },
    ],
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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Header />
      <VideoJS options={options} onReady={handlePlayerReady} />
    </div>
  );
}

export default Tv;
