import React, { useEffect } from "react";
import Header from "./../Shared/Header";
//import { IoArrowBack } from "react-icons/io5";

function Game() {

  useEffect(() => {

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

    let realConsoleName = {
        "GB": "Gameboy", "GBA": "Gameboy Advance", "GBC": "Gameboy Color", "N64": "Nintendo 64", "NES": "Nintendo Entertainment System", "NDS": "Nintendo DS", "SNES": "Super Nintendo Entertainment System", "Sega Master System": "Sega Master System", "Sega Mega Drive": "Sega Mega Drive", "PS1": "PS1"
    }
    
    let scripts = {
      "Gameboy": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gb";',
      "Gameboy Advance": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gba";', 
      "Gameboy Color": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "gb";', 
      "Nintendo 64": 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "n64";', 
      "Nintendo Entertainment System": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "nes";\nEJS_lightgun = false;',
      "Nintendo DS": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "nds";',
      "Super Nintendo Entertainment System": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "snes";\nEJS_mouse = false;\nEJS_multitap = false;',
      "Sega Mega Drive": 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaMD";',
      "Sega Master System": 'let EJS_player = "#game";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaMS";',
      "Sega Saturn": 'let EJS_player = "#game";\nlet EJS_biosUrl = "";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "segaSaturn";',
      "PS1": 'let EJS_player = "#game";\nlet EJS_biosUrl = "{bios}";\nlet EJS_gameUrl = "{slug}";\nlet EJS_core = "psx";',
    }

    let chocolateServerAdress = getCookie("serverAdress")

    let actualUrl = window.location.href;
    let id = actualUrl.split("/")[5]
    let url = `${chocolateServerAdress}gameData/${id}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let theConsole = realConsoleName[data.console]
        console.log(data.console)
        console.log(theConsole)
        let script = scripts[theConsole]
        script = script.replace("{slug}", `${chocolateServerAdress}gameFile/${id}`)
        console.log(script)
        let theScript = document.createElement("script")
        theScript.innerHTML = script
        theScript.defer = true
        theScript.id = "gameScript"
        theScript.type = "text/javascript"
        let app = document.getElementsByClassName("App")[0]
        let gameScript = document.querySelector("#gameScript")
        let emulatorJSScript = document.createElement("script")
        emulatorJSScript.src = "https://www.emulatorjs.com/loader.js"
        emulatorJSScript.defer = true
        if (gameScript == null) {
          app.appendChild(theScript)
          app.appendChild(emulatorJSScript)
        }
      })
  }, []);

  const language = JSON.parse(localStorage.getItem("languageFile"));

  return (
    <div className="App">
      <Header />
      <div class="gameScreen">
          <div id="game"></div>
      </div>
    </div>
  );
  
}

export default Game;