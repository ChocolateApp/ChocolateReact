import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
//import { IoArrowBack } from "react-icons/io5";

function Games() {

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

  function getAllGames() {
    var url = window.location.href
    var console = url.split("/")[5]
    let chocolateServerAdress = getCookie("serverAdress")
    fetch(`${chocolateServerAdress}getGames/${console}`).then(function(response) {
        return response.json();
    }).then(function(json) {
        var games = json;
        for (let game of games) {
            var gameDiv = document.createElement("div");
            gameDiv.className = "gameDiv";
            gameDiv.id = game.id;
            var gameImageDiv = document.createElement("div");
            gameImageDiv.className = "gameImageDiv";
            var gameImage = document.createElement("img");
            gameImage.className = "gameImage";
            gameImage.src = game.cover;
            var gameName = document.createElement("p");
            gameName.className = "gameName";
            gameName.innerHTML = game.title;
            gameImageDiv.appendChild(gameImage);
            gameDiv.appendChild(gameImageDiv);
            gameDiv.appendChild(gameName);
            gameDiv.addEventListener("click", function() {
                window.location.href = `/game/${console}/${game.id}`;
            });
            var gameList = document.getElementById("gameList");
            
            let div = document.querySelector(`.gameImageDiv[id="${game.id}"]`);
            if (div == null) {
              gameList.appendChild(gameDiv);
            }
        };
    });
}

  useEffect(() => {

    /*let backButton = document.getElementById("backButton")
    backButton.addEventListener("click", function() {
        window.history.back();
    });*/

    getAllGames();
  }, []);

  const language = JSON.parse(localStorage.getItem("languageFile"));

  return (
    <div className="App">
      <Header />
<div id="gameList"></div>
    </div>
  );
  
}

export default Games;