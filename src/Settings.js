import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import { IoTrashOutline, IoPersonOutline, IoMoveOutline, IoAddCircleOutline, IoCloseOutline, IoFilmOutline, IoVideocamOutline, IoBookOutline, IoGameControllerOutline, IoTvOutline, IoDesktopOutline, IoRefreshOutline } from "react-icons/io5";


function Settings() {

  useEffect(() => {
    let allLabels = document.querySelectorAll("label");
    for (let i = 0; i < allLabels.length; i++) {
      allLabels[i].onclick = function() {
        let id = this.getAttribute("for");
        let theIonIcon = this.querySelector('svg');
        theIonIcon.classList.add('selected');
        let otherRadios = document.getElementsByClassName("input-hidden")
        for (let j = 0; j < otherRadios.length; j++) {
          let otherId = otherRadios[j].id;
          console.log(`The otherId is ${otherId} and the id is ${id}`)
          if (otherId !== id) {
            let otherLabel = document.querySelector('label[for="' + otherId + '"]');
            let otherIonIcon = otherLabel.querySelector('svg');
            otherIonIcon.classList.remove('selected');
          } else {
            let otherLabel = document.querySelector('label[for="' + otherId + '"]');
            let otherIonIcon = otherLabel.querySelector('svg');
            otherIonIcon.classList.add('selected');
          }
        } 
          
          if (id === "tv") {
              let pathLabel = document.querySelector('#popupLibrary > div.settingsLibrary > div.libraryPath > label')
              pathLabel.innerHTML = "M3U Path:"

              let libraryPathInput = document.querySelector('#popupLibrary > div.settingsLibrary > div.libraryPath > input')
              libraryPathInput.placeholder = "M3U Path"
          } else {
              let pathLabel = document.querySelector('#popupLibrary > div.settingsLibrary > div.libraryPath > label')
              pathLabel.innerHTML = language["path"]+":"

              let libraryPathInput = document.querySelector('#popupLibrary > div.settingsLibrary > div.libraryPath > input')
              libraryPathInput.placeholder = language["libraryPath"]
        }
      }
    }

    let chocolateServerAdress = getCookie("serverAdress");
    let personIcon = document.querySelector("#root > div > header > div.headerBottomIcons > a:nth-child(3) > svg").innerHTML;
    fetch(`${chocolateServerAdress}getAllUsers`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        let users = data.users;
        for (let user of users) {
          let exist = document.querySelector(`input[username="${user.name}"]`);
          if (exist) {
            continue;
          }
          let userDiv = document.createElement("div");
          userDiv.classList.add("user");

          let svg = document.createElement("svg");
          svg.classList.add("userIcon");
          svg.innerHTML = personIcon;

          let name = document.createElement("span");
          name.textContent = user.name;

          let checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("id", "settingsCheckbox")
          checkbox.setAttribute("username", user.name);
          checkbox.classList.add("settingsCheckbox");

          userDiv.appendChild(svg);
          userDiv.appendChild(name);
          userDiv.appendChild(checkbox);

          let usersDiv = document.querySelector(".libraryUsers");
          usersDiv.appendChild(userDiv);
        }
      });

  }, [])

  function addLibrary() {
    const popupLibrary = document.getElementById("popupLibrary")
    popupLibrary.style.display = "block"
  }

  function hidePopup() {
    const popupLibrary = document.getElementById("popupLibrary")
    popupLibrary.style.display = "none"
  }

  function createAccount() {
    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let profilePictureFile = document.getElementById("profilePicture").files[0];
    let accountType = document.getElementById("type").value;

    let dataAccountType = document.querySelector(`option[data-name="${accountType}"]`).getAttribute("data-langcode");
    
    let data = new FormData()
    data.append("name", name)
    data.append("password", password)
    data.append("profilePicture", profilePictureFile)
    data.append("type", dataAccountType)

    let chocolateServerAdress = getCookie("serverAdress");

    let url = `${chocolateServerAdress}createAccount`;
    
    fetch(url, {
      method: "POST",
      credentials: "same-origin",
      body: data
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        window.location.reload()
      });
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

  function getSettings() {
    let chocolateServerAdress = getCookie("serverAdress");

    let url = `${chocolateServerAdress}/getSettings`;

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        let users = data.users;
        let libraries = data.libraries;        // Récupération de l"élément parent pour toutes les bibliothèques
        const allLibrariesDiv = document.querySelector(".allLibraries");

        // Boucle à travers toutes les bibliothèques
        libraries.forEach(theLibrary => {
          let exist = document.getElementById(theLibrary.libName);
          if (exist) {
            return;
          }
          // Création de la div pour chaque bibliothèque
          const libraryDiv = document.createElement("div");
          libraryDiv.classList.add("librarySetting");
          libraryDiv.setAttribute("id", theLibrary.libName);

          // Ajout du titre
          const title = document.createElement("h1");
          title.textContent = theLibrary.libName;
          libraryDiv.appendChild(title);

          // Ajout de l"icône de déplacement
          const moveIcon = document.getElementById("moveSVG");
          const newMoveIcon = moveIcon.cloneNode(true);
          newMoveIcon.classList.add("moveLibrary");
          newMoveIcon.style.display = "block";
          libraryDiv.appendChild(newMoveIcon);

          // Ajout de la liste déroulante pour le type de bibliothèque
          const libtypeInput = document.createElement("input");
          libtypeInput.setAttribute("list", "libTypesList");
          libtypeInput.setAttribute("name", "libtype");
          libtypeInput.setAttribute("id", "libtype");
          libtypeInput.setAttribute("class", "libtype form_field");
          libtypeInput.setAttribute("value", theLibrary.libType);
          libraryDiv.appendChild(libtypeInput);

          const libtypeDatalist = document.createElement("datalist");
          libtypeDatalist.setAttribute("id", "libTypesList");

          // Ajout des options à la liste déroulante
          const moviesOption = document.createElement("option");
          moviesOption.setAttribute("value", "movies");
          moviesOption.textContent = language["movies"];
          libtypeDatalist.appendChild(moviesOption);

          const seriesOption = document.createElement("option");
          seriesOption.setAttribute("value", "series");
          seriesOption.textContent = language["series"];
          libtypeDatalist.appendChild(seriesOption);

          const gamesOption = document.createElement("option");
          gamesOption.setAttribute("value", "games");
          gamesOption.textContent = language["consoles"];
          libtypeDatalist.appendChild(gamesOption);

          const tvOption = document.createElement("option");
          tvOption.setAttribute("value", "tv");
          tvOption.textContent = language["tvChannels"];
          libtypeDatalist.appendChild(tvOption);

          const otherOption = document.createElement("option");
          otherOption.setAttribute("value", "other");
          otherOption.textContent = language["other"];
          libtypeDatalist.appendChild(otherOption);

          libraryDiv.appendChild(libtypeDatalist);

          // Ajout du champ de saisie pour le chemin de la bibliothèque
          const libPathInput = document.createElement("input");
          libPathInput.setAttribute("type", "text");
          libPathInput.setAttribute("value", theLibrary.libFolder);
          libPathInput.setAttribute("id", "libPath");
          libPathInput.setAttribute("class", "form_field_create_account");
          libraryDiv.appendChild(libPathInput);

          // Ajout de la div pour les utilisateurs
          const usersDiv = document.createElement("div");
          usersDiv.setAttribute("id", "users");
          usersDiv.classList.add("users");

          // Boucle à travers tous les utilisateurs
          users.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.setAttribute("id", user.id);

            const userIcon = document.getElementById("personSVG").cloneNode(true);
            userIcon.style.display = "initial";
            userDiv.appendChild(userIcon);

            const userName = document.createElement("span");
            userName.textContent = user.name;
            userDiv.appendChild(userName);

            const usersDiv = document.createElement("div");
            usersDiv.setAttribute("id", "users");
            usersDiv.classList.add("users");
        
            const userCheckbox = document.createElement("input");
            userCheckbox.setAttribute("type", "checkbox");
            userCheckbox.setAttribute("id", user.id);
            if (theLibrary.availableFor === null) {
              userCheckbox.checked = false;
            } else {
              userCheckbox.checked = theLibrary.availableFor.includes(user.id);
            }
            userDiv.appendChild(userCheckbox);
        
            usersDiv.appendChild(userDiv);

            libraryDiv.appendChild(usersDiv);
          });
          
          // Ajout des boutons pour supprimer et enregistrer les changements
          const deleteButton = document.createElement("button");
          const trashIcon = document.getElementById("trashSVG").cloneNode(true);
          trashIcon.style.display = "block";
          deleteButton.appendChild(trashIcon);
          deleteButton.innerHTML += "Delete";
          deleteButton.classList.add("deleteLibButton");
          deleteButton.addEventListener("click", () => {
            deleteLib(theLibrary.libName);
          });
        
          const saveButton = document.createElement("button");
          saveButton.textContent = "Save changes"
          saveButton.classList.add("editLibButton");
        
          // Ajout de la div à la page
          let buttonsEditDelete = document.createElement("div");
          buttonsEditDelete.classList.add("buttonsEditDelete");
          buttonsEditDelete.id = "buttonsEditDelete";

          buttonsEditDelete.appendChild(saveButton);
          buttonsEditDelete.appendChild(deleteButton);
          
          libraryDiv.appendChild(buttonsEditDelete);

          allLibrariesDiv.appendChild(libraryDiv);
        });

        /* ChocolateSettings */
        let ChocolateSettings = data.ChocolateSettings

        let languageCode = ChocolateSettings.language;
        let allowDownload = ChocolateSettings.allowdownload;
        let stringBool = {
          "true": true,
          "false": false
        }
        let languageOption = document.querySelector(`option[data-langcode="${languageCode}"]`);
        let languageName = languageOption.textContent;
        let languageInput = document.getElementById("language");
        languageInput.value = languageName;
        let allowDownloadInput = document.getElementById("allowDownloadsCheckbox");
        allowDownloadInput.checked = stringBool[allowDownload];

        /* APIKeys */
        let APIKeys = data.APIKeys;

        let tmdbKey = APIKeys.tmdb;
        let igdbID = APIKeys.igdbid;
        let igdbSecret = APIKeys.igdbsecret;

        let tmdbKeyInput = document.getElementById("tmdbKey");
        let igdbIDInput = document.getElementById("igdbID");
        let igdbKeyInput = document.getElementById("igdbSecret");

        tmdbKeyInput.value = tmdbKey;
        igdbIDInput.value = igdbID;
        igdbKeyInput.value = igdbSecret;

        /* ARRSettings */
        let ARRSettings = data.ARRSettings;

        let radarrFolder = ARRSettings.radarrfolder;
        let radarrURL = ARRSettings.radarrurl;
        let radarrAPI = APIKeys.radarr;

        let sonarrFolder = ARRSettings.sonarrfolder;
        let sonarrURL = ARRSettings.sonarrurl;
        let sonarrAPI = APIKeys.sonarr;

        let lidarrFolder = ARRSettings.lidarrfolder;
        let lidarrURL = ARRSettings.lidarrurl;
        let lidarrAPI = APIKeys.lidarr;

        let readarrFolder = ARRSettings.readarrfolder;
        let readarrURL = ARRSettings.readarrurl;
        let readarrAPI = APIKeys.readarr;

        let radarrAdressInput = document.getElementById("radarrAdress");
        let radarrFolderInput = document.getElementById("radarrFolder");
        let radarrAPIInput = document.getElementById("radarrApiKey");

        let sonarrAdressInput = document.getElementById("sonarrAdress");
        let sonarrFolderInput = document.getElementById("sonarrFolder");
        let sonarrAPIInput = document.getElementById("sonarrApiKey");

        let lidarrAdressInput = document.getElementById("lidarrAdress");
        let lidarrFolderInput = document.getElementById("lidarrFolder");
        let lidarrAPIInput = document.getElementById("lidarrApiKey");

        let readarrAdressInput = document.getElementById("readarrAdress");
        let readarrFolderInput = document.getElementById("readarrFolder");
        let readarrAPIInput = document.getElementById("readarrApiKey");

        radarrAdressInput.value = radarrURL;
        radarrFolderInput.value = radarrFolder;
        radarrAPIInput.value = radarrAPI;

        sonarrAdressInput.value = sonarrURL;
        sonarrFolderInput.value = sonarrFolder;
        sonarrAPIInput.value = sonarrAPI;

        lidarrAdressInput.value = lidarrURL;
        lidarrFolderInput.value = lidarrFolder;
        lidarrAPIInput.value = lidarrAPI;

        readarrAdressInput.value = readarrURL;
        readarrFolderInput.value = readarrFolder;
        readarrAPIInput.value = readarrAPI;
      })
      .then(() => {
        let allLibrariesDiv = document.getElementsByClassName("allLibraries")[0];
        //check if the div already exists
        let divExist = document.querySelector(".librariesDiv[data-customID='true']");
        if (divExist) {
          return;
        }
        let div = document.createElement("div");
        div.setAttribute("class", "librariesDiv");
        div.setAttribute("data-customID", "true");

        let label = document.createElement("label");
        label.setAttribute("for", "addLibraryButton");
        label.textContent = language["createNewLib"] + " : ";
        
        let button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("id", "addLibraryButton");
        button.addEventListener("click", addLibrary);

        let icon = document.getElementById("addSVG").cloneNode(true);
        icon.style.display = "block";
        icon.setAttribute("name", "Create a new library");

        button.appendChild(icon);
        div.appendChild(label);
        div.appendChild(button);
        allLibrariesDiv.appendChild(div);
      })
    }
    function showErrorMessage(message, type) {
      //if there's already an alert, return
      if (document.getElementsByClassName("alert").length > 0) {
          return;
      }
      let alert = document.createElement("div");
      alert.className = "alert";
      alert.setAttribute("role", "alert");
      alert.innerHTML = message;
      document.body.appendChild(alert);
      setTimeout(function() {
      alert.className = "alert alert-fade-in alert-" + type;
      }, 100);
      
      setTimeout(function() {
          alert.classList.add("alert-fade-out");
          setTimeout(function() {
              alert.remove();
          }, 500);
      }, 4000);
  }
    function newLib(){
      let libType = document.getElementsByClassName("selected")[0]
      let libTypeParent = libType.parentElement
      libType = libTypeParent.getAttribute("for")
      const libName = document.getElementById("libraryName").value
      const libPath = document.getElementById("libraryPath").value
      const libUsers = document.getElementsByClassName("settingsCheckbox")
      let defaultUsers = ""
      for (let i = 0; i < libUsers.length; i++) {
          if (libUsers[i].checked) {
              defaultUsers += ","+libUsers[i].getAttribute("username")
          }
      }
  
      if (defaultUsers.startsWith(",")) {
          defaultUsers = defaultUsers.substring(1)
      }
  
      if (libName === "") {
          showErrorMessage("Please enter a library name !", "alert")
      }
      if (libPath === "") {
          showErrorMessage("Please enter a library path !", "alert")
      }
      
      let chocolateServerAdress = getCookie("serverAdress")
  
      if (libName !== "" && libPath !== "") {
          fetch(chocolateServerAdress+"createLib", {
              method: "POST",
              headers: {'Content-Type': 'application/json'}, 
              body: JSON.stringify({
                  libName: libName,
                  libPath: libPath,
                  libType: libType,
                  libUsers: defaultUsers
              })
            }).then(res => {
              return res.json()
            }).then(data => {
              let error = data.error
              if (error === "worked") {
                showErrorMessage("The library has been created !", "success")
                setTimeout(function() {
                  window.location.reload()
                }, 5000);
              } else {
                  showErrorMessage("The library already exists !\nPlease choose another name.", "alert")
              }
            })
      }
  }

  function saveSettings() {
    let languageInp = document.getElementById("language").value;
    let languageVal = "";
    let options = document.querySelector(`option`)
    for (let i = 0; i < options.length; i++) {
      if (options[i].textContent === languageInp) {
        languageVal = options[i].dataset.langcode;
      }
    }
    let tmdbKey = document.getElementById("tmdbKey").value;
    let igdbID = document.getElementById("igdbID").value;
    let igdbSecret = document.getElementById("igdbSecret").value;

    let radarrAdress = document.getElementById("radarrAdress").value;
    let radarrFolder = document.getElementById("radarrFolder").value;
    let radarrAPI = document.getElementById("radarrApiKey").value;

    let sonarrAdress = document.getElementById("sonarrAdress").value;
    let sonarrFolder = document.getElementById("sonarrFolder").value;
    let sonarrAPI = document.getElementById("sonarrApiKey").value;

    let lidarrAdress = document.getElementById("lidarrAdress").value;
    let lidarrFolder = document.getElementById("lidarrFolder").value;
    let lidarrAPI = document.getElementById("lidarrApiKey").value;

    let readarrAdress = document.getElementById("readarrAdress").value;
    let readarrFolder = document.getElementById("readarrFolder").value;
    let readarrAPI = document.getElementById("readarrApiKey").value;

    let allowDownload = document.getElementById("allowDownloadsCheckbox").checked.toString();

    let settings = {
      language: languageVal,
      tmdbKey: tmdbKey,
      igdbID: igdbID,
      igdbSecret: igdbSecret,
      radarrAdress: radarrAdress,
      radarrFolder: radarrFolder,
      radarrAPI: radarrAPI,
      sonarrAdress: sonarrAdress,
      sonarrFolder: sonarrFolder,
      sonarrAPI: sonarrAPI,
      lidarrAdress: lidarrAdress,
      lidarrFolder: lidarrFolder,
      lidarrAPI: lidarrAPI,
      readarrAdress: readarrAdress,
      readarrFolder: readarrFolder,
      readarrAPI: readarrAPI,
      allowDownload: allowDownload
    }

    let settingsJSON = JSON.stringify(settings);

    let serverAdress = getCookie("serverAdress");

    fetch(serverAdress + "/saveSettings", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: settingsJSON
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.status === "success") {
        window.location.reload();
      }
    })
  }
    
  function deleteLib(libName) {
    //create a popup to confirm the deletion
    const popupLibrary = document.createElement("div")
    document.body.appendChild(popupLibrary)
    let chocolateServerAdress = getCookie("serverAdress")
    fetch(`${chocolateServerAdress}deleteLib/${libName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //set the form
        body: JSON.stringify({
            libName: libName
        })
    })
}

function rescanAll() {
  let chocolateServerAdress = getCookie("serverAdress")
  let url = `${chocolateServerAdress}rescanAll`
  let button = document.getElementById("rescanAllButton")
  let texts = ["Scanning", "Scanning.", "Scanning..", "Scanning..."]
  let svg = button.innerHTML.split("</svg>")[0] + "</svg>"
  button.disabled = true

  //setInterval
  var i = 0
  var interval = setInterval(function() {
      i++
      if (i === 4) {
          i = 0
      }
      button.innerHTML = `${svg}${texts[i]}`
  }, 500)

  //fetch with get
  fetch(url, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }}).then(function(response) {
          return response.json()
      }).then(function(data) {
          console.log(data)
          if (data === true) {
              clearInterval(interval)
              button.innerHTML = '<ion-icon name="refresh-outline"></ion-icon>Done'
          } else {
              clearInterval(interval)
              button.innerHTML = '<ion-icon name="refresh-outline"></ion-icon>Error'
              button.classList.add("error")
          }
      })
}

  const language = JSON.parse(localStorage.getItem("languageFile"));

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="App">
      <Header />
      <div id="popupLibrary" className="popupLibrary popup">
        <IoCloseOutline className="crossPopup" id="crossPopup" onClick={hidePopup} />
        <div className="settingsLibrary">
            <div className="libTypeSelect">
                <input type="radio" name="libtype" id="movies" className="input-hidden" libtype="movies" defaultChecked />
                <label htmlFor="movies" id="movieLabel">
                    <IoFilmOutline className="selected" />
                    <br />
                    <span>{language["movies"]}</span>
                </label>
                <input type="radio" name="libtype" id="series" className="input-hidden" libtype="series" />
                <label htmlFor="series" id="seriesLabel">
                    <IoVideocamOutline />
                    <br />
                    <span>{language["series"]}</span>
                </label>
                <input type="radio" name="libtype" id="games" className="input-hidden" libtype="games" />
                <label htmlFor="games" id="gamesLabel">
                    <IoGameControllerOutline />
                    <br />
                    <span>{language["consoles"]}</span>
                </label>
                <input type="radio" name="libtype" id="tv" className="input-hidden" libtype="tv" />
                <label htmlFor="tv" id="tvLabel">
                    <IoTvOutline />
                    <br />
                    <span>{language["tvChannels"]}</span>
                </label>
                <input type="radio" name="libtype" id="other" className="input-hidden" libtype="other" />
                <label htmlFor="other" id="tvLabel">
                    <IoDesktopOutline />
                    <br />
                    <span>{language["other"]}</span>
                </label>
                <input type="radio" name="libtype" id="books" className="input-hidden" libtype="books" />
                <label htmlFor="books" id="booksLabel">
                    <IoBookOutline />
                    <br />
                    <span>{language["books"]}</span>
                </label>
            </div>
            <div className="libraryName">
                <label htmlFor="libraryName">{language["name"]}:</label>
                <input type="text" id="libraryName" placeholder={language["libraryName"]} />
            </div>
            <div className="libraryPath">
                <label htmlFor="libraryPath">{language["path"]}:</label>
                <input type="text" id="libraryPath" placeholder={language["libraryPath"]} />
            </div>
            <div className="libraryUsers">
                <h1>{language["users"]}:</h1>
            </div>
        </div>
        <div className="bottomPart">
            <button className="submitNewLib" onClick={() => {newLib()}}>{language["createNewLib"]}</button>
        </div>
      </div>
    <div className="createAccount" id="createAccount">
        <div className="accountCreateFields">
            <div className="nameAccountCreator">
                <label htmlFor="name">{language["name"]} : </label>
                <input type="text" name="name" id="name" className="name form_field_create_account" />
            </div>
            <div className="passwordAccountCreator">
                <label htmlFor="password">{language["password"]} : </label>
                <input type="password" name="password" id="password" className="password form_field_create_account" />
            </div>
            <div className="profileAccountCreator">
                <label htmlFor="profilePicture">{language["profilePic"]} : </label>
                <input type="file" name="profilePicture" id="profilePicture" accept="image/*" />
            </div>
            <div className="typeAccountCreator">
                <label htmlFor="type">{language["accountType"]} : </label>
                <input list="accountType" name="type" id="type" className="type form_field_create_account" />
                <datalist id="accountType">
                    <option data-name={language["admin"]} data-langcode="Admin">{language["admin"]}</option>
                    <option data-name={language["adult"]} data-langcode="Adult">{language["adult"]}</option>
                    <option data-name={language["teen"]} data-langcode="Teen">{language["teen"]}</option>
                    <option data-name={language["kid"]} data-langcode="Kid">{language["kid"]}</option>
                </datalist>
            </div>
        </div>
        <input id="createAccountButton" type="submit" defaultValue={language["createAccount"]} className="createAccountButton" onClick={createAccount} />
    </div>

    <div className="allLibraries">
    </div>

    <div className="saveSettingsForm" id="saveSettingsForm">
        <div className="settingsDiv">
            <div className="rescanAllDiv">
                <label htmlFor="rescanAllButton">Rescan all libraries : </label>
                <button type="button" id="rescanAllButton" onClick={() => {rescanAll()}} className="rescanAllButton">
                <IoRefreshOutline className="rescanAllIcon" name="Rescan all libraries" />Rescan all libraries
            </button>
            </div>
            <div className="languageDiv">
                <label htmlFor="language">{language["languages"]} : </label>
                <input type="search" name="language" id="language" list="languages" className="language form_field" />
                <datalist id="languages">
                  <option data-langcode="AF">Afrikaans</option>
                  <option data-langcode="SQ">Albanian</option>
                  <option data-langcode="AM">Amharic</option>
                  <option data-langcode="AR">Arabic</option>
                  <option data-langcode="HY">Armenian</option>
                  <option data-langcode="AZ">Azerbaijani</option>
                  <option data-langcode="EU">Basque</option>
                  <option data-langcode="BE">Belarusian</option>
                  <option data-langcode="BN">Bengali</option>
                  <option data-langcode="BS">Bosnian</option>
                  <option data-langcode="BG">Bulgarian</option>
                  <option data-langcode="CA">Catalan</option>
                  <option data-langcode="NY">Chichewa</option>
                  <option data-langcode="CO">Corsican</option>
                  <option data-langcode="HR">Croatian</option>
                  <option data-langcode="CS">Czech</option>
                  <option data-langcode="DA">Danish</option>
                  <option data-langcode="NL">Dutch</option>
                  <option data-langcode="EN">English</option>
                  <option data-langcode="EO">Esperanto</option>
                  <option data-langcode="ET">Estonian</option>
                  <option data-langcode="FI">Finnish</option>
                  <option data-langcode="FR">French</option>
                  <option data-langcode="FY">Frisian</option>
                  <option data-langcode="GL">Galician</option>
                  <option data-langcode="KA">Georgian</option>
                  <option data-langcode="DE">German</option>
                  <option data-langcode="EL">Greek</option>
                  <option data-langcode="GU">Gujarati</option>
                  <option data-langcode="HT">Haitian Creole</option>
                  <option data-langcode="HA">Hausa</option>
                  <option data-langcode="HE">Hebrew</option>
                  <option data-langcode="HI">Hindi</option>
                  <option data-langcode="HU">Hungarian</option>
                  <option data-langcode="IS">Icelandic</option>
                  <option data-langcode="IG">Igbo</option>
                  <option data-langcode="ID">Indonesian</option>
                  <option data-langcode="GA">Irish</option>
                  <option data-langcode="IT">Italian</option>
                  <option data-langcode="JA">Japanese</option>
                  <option data-langcode="JV">Javanese</option>
                  <option data-langcode="KN">Kannada</option>
                  <option data-langcode="KK">Kazakh</option>
                  <option data-langcode="KM">Khmer</option>
                  <option data-langcode="KO">Korean</option>
                  <option data-langcode="KU">Kurdish (Kurmanji)</option>
                  <option data-langcode="LO">Lao</option>
                  <option data-langcode="LA">Latin</option>
                  <option data-langcode="LV">Latvian</option>
                  <option data-langcode="LT">Lithuanian</option>
                  <option data-langcode="LB">Luxembourgish</option>
                  <option data-langcode="MK">Macedonian</option>
                  <option data-langcode="MG">Malagasy</option>
                  <option data-langcode="MS">Malay</option>
                  <option data-langcode="ML">Malayalam</option>
                  <option data-langcode="MT">Maltese</option>
                  <option data-langcode="ZH">Mandarin</option>
                  <option data-langcode="MI">Maori</option>
                  <option data-langcode="MR">Marathi</option>
                  <option data-langcode="MN">Mongolian</option>
                  <option data-langcode="NE">Nepali</option>
                  <option data-langcode="NO">Norwegian</option>
                  <option data-langcode="PS">Pashto</option>
                  <option data-langcode="FA">Persian</option>
                  <option data-langcode="PL">Polish</option>
                  <option data-langcode="PT">Portuguese</option>
                  <option data-langcode="PA">Punjabi</option>
                  <option data-langcode="RO">Romanian</option>
                  <option data-langcode="RU">Russian</option>
                  <option data-langcode="SM">Samoan</option>
                  <option data-langcode="GD">Scots Gaelic</option>
                  <option data-langcode="SR">Serbian</option>
                  <option data-langcode="SN">Shona</option>
                  <option data-langcode="SD">Sindhi</option>
                  <option data-langcode="SK">Slovak</option>
                  <option data-langcode="SL">Slovenian</option>
                  <option data-langcode="SO">Somali</option>
                  <option data-langcode="ES">Spanish</option>
                  <option data-langcode="SU">Sundanese</option>
                  <option data-langcode="SW">Swahili</option>
                  <option data-langcode="SV">Swedish</option>
                  <option data-langcode="TG">Tajik</option>
                  <option data-langcode="TA">Tamil</option>
                  <option data-langcode="TT">Tatar</option>
                  <option data-langcode="TE">Telugu</option>
                  <option data-langcode="TH">Thai</option>
                  <option data-langcode="TR">Turkish</option>
                  <option data-langcode="TK">Turkmen</option>
                  <option data-langcode="UK">Ukrainian</option>
                  <option data-langcode="UR">Urdu</option>
                  <option data-langcode="UZ">Uzbek</option>
                  <option data-langcode="VI">Vietnamese</option>
                  <option data-langcode="CY">Welsh</option>
                  <option data-langcode="XH">Xhosa</option>
                  <option data-langcode="YI">Yiddish</option>
                  <option data-langcode="YO">Yoruba</option>
                  <option data-langcode="ZU">Zulu</option>
              </datalist>
            </div>
            <div className="tmdbKeyDiv">
                <label htmlFor="tmdbKey">{language["tmdbApiKey"]} : </label>
                <input type="text" name="tmdbKey" id="tmdbKey" className="tmdbKey form_field" />
            </div>
            <div className="igdbIDDiv">
                <label htmlFor="igdbKey">{language["igdbIdKey"]} : </label>
                <input type="text" name="igdbID" id="igdbID" className="igdbKey form_field" />
            </div>
            <div className="igdbSecretDiv">
                <label htmlFor="igdbSecret">{language["igdbSecretKey"]} : </label>
                <input type="text" name="igdbSecret" id="igdbSecret" className="igdbSecret form_field" />
            </div>
        </div>
        <div className="allowDownloadsDiv" id="allowDownloadsDiv" data-value="{{ data['allowDownloads'] }}">
            <label htmlFor="allowDownloadsLabel">{language["allowDownloads"]} : </label>
            <label className="allowDownloads" name="allowDownloadsLabel">
                <input type="checkbox" name="allowDownloadsCheckbox" id="allowDownloadsCheckbox" className="allowDownloadsCheckbox" />
                <span className="allowDownloadsSlider"></span>
            </label>
        </div>
        <div className="arrsPart">
            <div className="radarrPart">
                <div className="radarrAdress">
                    <label htmlFor="radarrAdress">{language["radarrAdress"]} : </label>
                    <input type="text" name="radarrAdress" id="radarrAdress" className="radarrAdress form_field" placeholder="192.168.0.5:7878" />
                </div>
                <div className="radarrFolder">
                    <label htmlFor="radarrFolder">{language["radarrFolder"]} : </label>
                    <input type="text" name="radarrFolder" id="radarrFolder" className="radarrFolder form_field" placeholder="H:\Movies" />
                </div>
                <div className="radarrApiKey">
                    <label htmlFor="radarrApiKey">{language["radarrApiKey"]} : </label>
                    <input type="text" name="radarrApiKey" id="radarrApiKey" className="radarrApiKey form_field" placeholder="API Key" />
                </div>
            </div>
            <div className="sonarrPart">
                <div className="sonarrAdress">
                    <label htmlFor="sonarrAdress">{language["sonarrAdress"]} : </label>
                    <input type="text" name="sonarrAdress" id="sonarrAdress" className="sonarrAdress form_field" placeholder="192.168.0.5:8989" />
                </div>
                <div className="sonarrFolder">
                    <label htmlFor="sonarrFolder">{language["sonarrFolder"]} : </label>
                    <input type="text" name="sonarrFolder" id="sonarrFolder" className="sonarrFolder form_field" placeholder="H:\TV Shows" />
                </div>
                <div className="sonarrApiKey">
                    <label htmlFor="sonarrApiKey">{language["sonarrApiKey"]} : </label>
                    <input type="text" name="sonarrApiKey" id="sonarrApiKey" className="sonarrApiKey form_field" placeholder="API Key" />
                </div>
            </div>
            <div className="readarrPart">
                <div className="readarrAdress">
                    <label htmlFor="readarrAdress">{language["readarrAdress"]} : </label>
                    <input type="text" name="readarrAdress" id="readarrAdress" className="readarrAdress form_field" placeholder="192.168.0.5:8787" />
                </div>
                <div className="readarrFolder">
                    <label htmlFor="readarrFolder">{language["readarrFolder"]} : </label>
                    <input type="text" name="readarrFolder" id="readarrFolder" className="readarrFolder form_field" placeholder="H:\Comics" />
                </div>
                <div className="readarrApiKey">
                    <label htmlFor="readarrApiKey">{language["readarrApiKey"]} : </label>
                    <input type="text" name="readarrApiKey" id="readarrApiKey" className="readarrApiKey form_field" placeholder="API Key" />
                </div>
            </div>
            <div className="lidarrPart">
                <div className="lidarrAdress">
                    <label htmlFor="lidarrAdress">{language["lidarrAdress"]} : </label>
                    <input type="text" name="lidarrAdress" id="lidarrAdress" className="lidarrAdress form_field" placeholder="192.168.0.5:8686" />
                </div>
                <div className="lidarrFolder">
                    <label htmlFor="lidarrFolder">{language["lidarrFolder"]} : </label>
                    <input type="text" name="lidarrFolder" id="lidarrFolder" className="lidarrFolder form_field" placeholder="H:\Music" />
                </div>
                <div className="lidarrApiKey">
                    <label htmlFor="lidarrApiKey">{language["lidarrApiKey"]} : </label>
                    <input type="text" name="lidarrApiKey" id="lidarrApiKey" className="lidarrApiKey form_field" placeholder="API Key" />
                </div>
            </div>
        </div>
        <input id="register" type="submit" defaultValue={language["saveSettings"]} className="saveSettings" onClick={saveSettings} />
    </div>
    <IoTrashOutline id="trashSVG" style={{ display: "none" }} />
    <IoPersonOutline id="personSVG" style={{ display: "none" }} />
    <IoMoveOutline id="moveSVG" style={{ display: "none" }} />
    <IoAddCircleOutline id="addSVG" style={{ display: "none" }} />
    </div>
  );
}

export default Settings;