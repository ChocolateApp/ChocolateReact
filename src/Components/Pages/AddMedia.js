import Header from "./../Shared/Header";
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

  function addQualities() {
    let chocolateServerAdress = getCookie("serverAdress");
    let mediaType = document.querySelector(`#mediaType option[value="${document.getElementById("mediaTypeInput").value}"]`).getAttribute("data-value")
    console.log(mediaType)
    fetch(`${chocolateServerAdress}listQualities/${mediaType}`).then(response => response.json()).then(data => {
        let select = document.getElementById("allQualities");
        select.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                let option = document.createElement("option");
                option.value = data[i]["name"];
                option.setAttribute("data-value", data[i]["id"]);
                document.getElementById("allQualities").appendChild(option);
            }
        })
        .catch(error => console.error(error));
        if (mediaType === "serie") {
            fetch(`${chocolateServerAdress}listLanguageProfiles/${mediaType}`, {
                method: 'GET'
            })
            .then(response => response.json())
            .then(data => {
                let select = document.getElementById("allLanguages");
                let languagePart = document.getElementsByClassName("languagePart")[0];
                languagePart.style.display = "block";
                select.innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    let option = document.createElement("option");
                    option.value = data[i]["name"];
                    option.setAttribute("data-value", data[i]["id"]);
                    document.getElementById("allLanguages").appendChild(option);
                }
            })
        }
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


    function searchForMedia() {
        let mediaType = document.querySelector(`#mediaType option[value="${document.getElementById("mediaTypeInput").value}"]`)
        if (mediaType === null) {
            showErrorMessage("Please select a media type", "alert")
            return;
        } else {
            mediaType = mediaType.getAttribute("data-value")
        }
        let title = document.getElementById("title").value
        let chocolateServerAdress = getCookie("serverAdress");
        let results = document.getElementById("results");
        if (results.childElementCount > 0) {
            results.innerHTML = "";
        }
        fetch(chocolateServerAdress+'lookup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            mediaType: mediaType,
            query: title
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let results = document.getElementById("results");
            results.innerHTML = "";
            if (data.length === 0) {
                showErrorMessage("No results found", "alert")
                return;
            }
            for (let i = 0; i < data.length; i++) {
                let file = data[i];
                let type = undefined
                let poster = file["remotePoster"];
                let title = file["title"];
                const uniqueID = i;
                
                if (mediaType === "book") {
                    poster = file["remoteCover"];
                } else if (mediaType === "music") {
                    console.log(file);
                    //ID = file["foreignId"];
                    if (file["artist"] !== undefined) {
                        file = file["artist"];
                        poster = file["remotePoster"];
                        title = file["artistName"];
                        //ID = title
                        type = "artist";
                    } else if (file["album"] !== undefined) {
                        file = file["album"];
                        poster = file["remoteCover"];
                        title = file["title"];
                        //ID = title
                        type = "album";
                    }
                }
                if (poster === undefined) {
                    continue;
                }
                if (poster.includes("thetvdb.com")) {
                    let chocolateServerAdress = getCookie("serverAdress");
                    fetch(chocolateServerAdress+'getIMDBPoster', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            imdbId: file["imdbId"]
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        poster = data["url"];
                        if (poster !== "/static/img/broken.webp" && poster !== " ") {
                            setCard(poster, i, title, type, uniqueID);
                        }
                    })
                } else {
                    setCard(poster, i, title, type, uniqueID);
                }                    
            }
        })
    }

    function setCard(url, ID, title=undefined, type=undefined, uniqueID) {
        //check if the card already exists
        let card = document.querySelector(`.coverAddMedia[data-id="${ID}"]`);
        if (card !== null) {
            return;
        }
        card = document.createElement("div");
        card.classList.add("coverAddMedia");
        card.setAttribute("data-id", ID);
        card.setAttribute("data-type", type);
        card.setAttribute("data-uniqueID", uniqueID);

        // Create the image
        let image = document.createElement("img");
        image.classList.add("cover-image");
        image.setAttribute("src", url);

        card.appendChild(image);

        // Create the title if it exists
        if (title !== undefined) {
            let titleBlock = document.createElement("p");
            titleBlock.classList.add("cover-title");
            titleBlock.innerHTML = title;
            card.appendChild(titleBlock);
        }


        card.addEventListener("click", function() {
            setMovie(uniqueID);
        });

        let results = document.getElementById("results");
        results.appendChild(card);
        }


    function addMedia(qualityID) {
        let mediaType = document.querySelector(`#mediaType option[value="${document.getElementById("mediaTypeInput").value}"]`).getAttribute("data-value")
        let type = "";
        try {
            type = document.querySelector(".coverAddMedia").getAttribute("data-type");
        } catch {
            showErrorMessage("Please select a media", "alert");
            return;
        }
        let ID = document.querySelector(".coverAddMedia").getAttribute("data-id");
        let chocolateServerAdress = getCookie("serverAdress");
        let body = {}
        try {
            body ={
            mediaType: mediaType,
            ID: ID,
            qualityID: qualityID,
            type: type,
            term: document.getElementById("title").value,
            languageId: document.querySelector(`#allLanguages option[value="${document.getElementById("languagesInput").value}"]`).getAttribute("data-value")
        }
        } catch {
            body ={
            mediaType: mediaType,
            ID: ID,
            qualityID: qualityID,
            type: type,
            term: document.getElementById("title").value,
        } }

        fetch(chocolateServerAdress+'/addMedia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data["status"] === "ok") {
                showErrorMessage("Media added successfully", "success");
                setTimeout(function() {
                    window.location.reload();
                }, 9000);
            } else {
                showErrorMessage("Error adding media", "alert");
            }
        })
    }


    function showButton(qualityID) {
        if (document.getElementsByClassName("addMovieButton").length > 0) {
            return;
        }
        let addButton = document.createElement("button");
        addButton.classList.add("addMovieButton");

        addButton.innerHTML = "Add";
        addButton.addEventListener("click", function() {
            addMedia(qualityID);
        });
        let fakeForm = document.getElementById("fakeForm");
        fakeForm.appendChild(addButton);
    }      

    function setMovie(ID) {
        // remove all the other cards
        let cards = document.getElementsByClassName("coverAddMedia");
        while (cards.length > 1) {
            for (let i = 0; i < cards.length; i++) {
                if (cards[i].getAttribute("data-uniqueID").toString() !== ID.toString()) {
                    cards[i].remove();
                }
            }
        }
    }
   
  useEffect(() => {
    let mediaTypeInput = document.getElementById("mediaTypeInput");
    mediaTypeInput.removeEventListener('change', console.log("removed"), true);
    mediaTypeInput.addEventListener('change', function() {
        addQualities();
    });
    
    document.getElementById("qualityInput").removeEventListener('change', console.log("removed"), true);
    document.getElementById("qualityInput").addEventListener("change", function() {
        var selectedOption = this.value;
        let qualityID = document.querySelector('#allQualities option[value="' + selectedOption + '"]').getAttribute("data-value");
        showButton(qualityID)
    });

    let timeoutId = null;

    const input = document.querySelector('#title');
    input.removeEventListener('input', console.log("removed"), true);
    input.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            console.log('No change for 2 seconds');
            searchForMedia()
        }, 2000);
    });
  }, []);

  return (
    <div className="App">
        <Header />
        <div id="fakeForm">
            <div className="leftPart">
                <h3>Set the media type (ex: Films, TV Show, Books)</h3>
                <input list="mediaType" name="mediaTypeInput" id="mediaTypeInput" className="mediaTypeInput form_field" />
                <datalist id="mediaType">
                <option value={language['movies']} data-value="movie"/>
                <option value={language['series']} data-value="serie"/>
                <option value={language['books']} data-value="book"/>
                <option value={language['musics']} data-value="music"/>
                </datalist>
                </div>
            <div className="centerPart">
                <div className="centerPartText">
                <h3>Set the title</h3>
                <input type="text" name="title" id="title" className="titleInput form_field" /></div>
                <div id="results"></div>
            </div>
            <div className="rightPart">
                <h3>Set the quality</h3>
                <input list="allQualities" name="qualityInput" id="qualityInput" className="quality form_field" />
                <datalist id="allQualities">
                </datalist>
                <div className="languagePart" style={{ display: "none" }}>
                    <h3>Set the language</h3>
                    <input list="allLanguages" name="languagesInput" id="languagesInput" className="quality form_field" />
                    <datalist id="allLanguages">
                    </datalist>
                </div>
            </div>
        </div>
    </div>
  );
  
}

export default Actor;