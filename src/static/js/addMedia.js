// fetch à /listQualities, et ajoute les options dans le select
function addQualities() {
    let mediaType = document.querySelector(`#mediaType option[value="${document.getElementById("mediaTypeInput").value}"]`).getAttribute("data-value")
    console.log(mediaType)
    fetch('/listQualities/'+mediaType).then(response => response.json()).then(data => {
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
}

function showErrorMessage(message, type) {
    let classes = {
        "alert": "solid red",
        "info": "solid yellow",
        "success": "solid green",
    }
    let errorBlock = document.createElement("div");
    errorBlock.classList.add("alert");
    errorBlock.classList.add("alert-danger");
    errorBlock.setAttribute("role", "alert");
    let messageBlock = document.createElement("p");
    messageBlock.innerHTML = message;
    messageBlock.classList.add("alert-message");
    messageBlock.style.borderTop = classes[type];
    errorBlock.appendChild(messageBlock);
    document.body.appendChild(errorBlock);
    //sleep 1 second
    setTimeout(function() {
        errorBlock.style.opacity = "1";
    }, 1000);
    
    // Remove error message after 5 seconds
    
    setTimeout(function() {
        errorBlock.style.opacity = "0";
        setTimeout(function() {
            errorBlock.remove();
        }, 1000);
    }, 5000);
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
    fetch('/lookup', {
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
        let results = document.getElementById("results");
        results.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let file = data[i];
            let type = undefined
            let ID = file["tmdbId"]
            if (mediaType === "serie") {
                ID = file["tvdbId"];
            }
            let poster = file["remotePoster"];
            let title = file["title"];
            
            if (mediaType === "music") {
                console.log(file);
                ID = file["foreignId"];
                if (file["artist"] !== undefined) {
                    file = file["artist"];
                    poster = file["remotePoster"];
                    title = file["artistName"];
                    ID = title
                    type = "artist";
                } else if (file["album"] !== undefined) {
                    file = file["album"];
                    poster = file["remoteCover"];
                    title = file["title"];
                    ID = title
                    type = "album";
                }
            }
            if (poster === undefined) {
                poster = "/static/img/broken.webp";
            }
            if (poster.includes("thetvdb.com")) {
                fetch('/getIMDBPoster', {
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
                    console.log(data);
                    poster = data["url"];
                    setCard(poster, file["tvdbId"], title, type, i);
                })
            } else {
                setCard(poster, ID, title, type, i);
            }                    
        }
      })
}

function setCard(url, ID, title=undefined, type=undefined, uniqueID) {
    let card = document.createElement("div");
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
    let type;
    try {
        type = document.querySelector(".coverAddMedia").getAttribute("data-type");
    } catch {
        showErrorMessage("Please select a media", "alert");
        return;
    }
    let ID = document.querySelector(".coverAddMedia").getAttribute("data-id");
    fetch('/addMedia', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mediaType: mediaType,
            ID: ID,
            qualityID: qualityID,
            type: type
        })
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
    let addButton = document.createElement("button");
    addButton.classList.add("addMovieButton");

    addButton.innerHTML = "Add";
    addButton.addEventListener("click", function() {
        addMedia(qualityID);
    });
    document.body.appendChild(addButton);
}      

function setMovie(ID) {
    // remove all the other cards
    let cards = document.getElementsByClassName("coverAddMedia");
    while (cards.length > 1) {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].getAttribute("data-uniqueID") !== ID) {
                console.log(`Removing ${cards[i].getAttribute("data-uniqueID")}, cause it's not ${ID}`)
                cards[i].remove();
            }
        }
    }
}

window.addEventListener('load', function() {
    let mediaTypeInput = document.getElementById("mediaTypeInput");
    mediaTypeInput.addEventListener('change', function() {
        addQualities();
    });
    document.getElementById("qualityInput").addEventListener("change", function() {
        var selectedOption = this.value;
        let qualityID = document.querySelector('#allQualities option[value="' + selectedOption + '"]').getAttribute("data-value");
        showButton(qualityID)
    });

    let timeoutId = null;

    const input = document.querySelector('#title');
    input.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            console.log('No change for 2 seconds');
            searchForMedia()
        }, 1500);
    });
});