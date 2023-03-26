import React from "react";
import "./App.css";
import Header from "./Header";
import { useEffect } from "react";
import brokenBanner from "./images/brokenBanner.webp"


function TvChannels() {

    function encode_utf8(s) {
        try {
            return decodeURIComponent(escape(s));
        } catch (e) {
            return s;
        }
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

    function main() {
        let url = window.location.href
        let library = url.split("/")[4]
        let chocolateServerAdress = getCookie("serverAdress")
        fetch(`${chocolateServerAdress}getChannels/${library}`).then(function(response) {
            return response.json();
        }).then(function(channels) {
            for (let channel of channels) {
                let channelRealName = encode_utf8(channel.name).replace(/\(.*?\)|\[.*?\]/g, "")
                let channelID = channel.channelID
    
                let channelDiv = document.createElement("div")
                channelDiv.className = "channelDiv"
                let channelImage = document.createElement("img")
                channelImage.className = "channelImage"
                if (channel.logo === "") {
                    channelImage.src = brokenBanner
                } else {
                    channelImage.src = channel.logo
                }
                channelImage.setAttribute("loading", "lazy")
                let channelName = document.createElement("p")
                channelName.className = "channelName"
                channelName.innerHTML = channelRealName
                channelDiv.appendChild(channelImage)
                channelDiv.appendChild(channelName)
                channelDiv.addEventListener("click", function() {
                    window.location.href = `/tv/${library}/${channelID}`
                })
                channelDiv.setAttribute("data-channelID", channelID)

                let exist = document.querySelector(`[data-channelID="${channelID}"]`)
                if (exist === null) {
                    document.getElementById("tvChannels").appendChild(channelDiv)
                }
            }
        })
    }

    useEffect(() => {
        main()
    }, [])

    return (
        <div className="App">
        <Header />
            <div id="tvChannels" class="tvChannels">
            </div>
        </div>
    )

}

export default TvChannels;