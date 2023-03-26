import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
//import { IoArrowBack } from "react-icons/io5";

function Consoles() {

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

 
function getAllConsoles() {
  var url = window.location.href
  var library = url.split("/")[4]
  let chocolateServerAdress = getCookie("serverAdress")
  fetch(`${chocolateServerAdress}getAllConsoles/${library}`).then(function(response) {
      return response.json();
  }).then(function(json) {
      var systems = json;
      systems = systems.sort()
      var systemList = document.getElementById("systemList");
      for (let system of systems) {
          fetch(chocolateServerAdress+"getConsoleData/" + system).then(function(response) {
              return response.json();
          }).then(function(json) {
              var system = json;
              var systemDiv = document.createElement("div");
              systemDiv.className = "systemDiv";
              systemDiv.id = system.name;
              var systemNameDiv = document.createElement("div");
              systemNameDiv.className = "systemNameDiv";
              var systemImageDiv = document.createElement("div");
              systemImageDiv.className = "systemImageDiv";
              var systemImage = document.createElement("img");
              systemImage.className = "systemImage";
              systemImage.src = `${chocolateServerAdress}${system.image}`;
              var systemName = document.createElement("p");
              systemName.className = "systemName";
              systemName.innerHTML = system.name;
              systemImageDiv.appendChild(systemImage);
              systemNameDiv.appendChild(systemName);
              systemDiv.appendChild(systemImageDiv);
              systemDiv.appendChild(systemNameDiv);
              systemDiv.addEventListener("click", function() {
                  window.location.href = `/console/${library}/${system.name}`;
              });
              let div = document.querySelector(`.systemDiv[id="${system.name}"]`);
              if (div == null) {
                  systemList.appendChild(systemDiv);
              }
          })
        }
    })
  }

  useEffect(() => {

    /*let backButton = document.getElementById("backButton")
    backButton.addEventListener("click", function() {
        window.history.back();
    });*/

    getAllConsoles();
  }, []);

  const language = JSON.parse(localStorage.getItem("languageFile"));

  return (
    <div className="App">
      <Header />
      <div class="consoleList" id="systemList"></div>
    </div>
  );
  
}

export default Consoles;