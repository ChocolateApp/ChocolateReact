import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";


function EditMovie() {
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

  function repairJSON(json) {
    
    json = json.replace(/", "/g, "", "");
    json = json.replace(/\\\\/g, "\\");
    json = json.replace(/, "/g, ', "');
    json = json.replace(/: "/g, ': "');
    json = json.replace(/": /g, '": ');
    json = json.replace(/"}]/g, '"}]');
    json = json.replace(/{"/g, '{"');
    json = json.replace(/False/g, "false");
    json = json.replace(/True/g, "true");
    json = json.replace(/None/g, "null");
    json = json.replace(/\\/g, "")

    return json
  }


  function getMovies() {
    let chocolateServerAdress = getCookie("serverAdress");

    const currentHref = window.location.href;
    const movieName = currentHref.split("/")[4];
    const library = currentHref.split("/")[5];

    let url = `${chocolateServerAdress}/editMovie/${movieName}/${library}`;

    //for all movie finded
    let destinationDIV = document.getElementsByClassName("editMovieDiv")[0];
    let moreThan0Child = destinationDIV.childElementCount > 0;
    console.log(moreThan0Child)
    if (moreThan0Child) {
      return
    }

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        data = data.movies
        for (let i = 0; i < data.length; i++) {
          let film = data[i];
          film = repairJSON(film)
          console.log(JSON.stringify(film))
          film = JSON.parse(film)
          console.log(film)
          console.log(typeof film)

          let movieFindedDiv = document.createElement("div");
          movieFindedDiv.className = "movieFinded";
          movieFindedDiv.id = film["id"];

          //for the image
          let movieFindedImg = document.createElement("img");
          movieFindedImg.src = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${film["poster_path"]}`;
          movieFindedImg.alt = film["original_title"];

          //for the title
          let movieFindedTitle = document.createElement("h1");
          movieFindedTitle.innerHTML = film["original_title"];

          //add the image and the title to the div
          movieFindedDiv.appendChild(movieFindedImg);
          movieFindedDiv.appendChild(movieFindedTitle);

          //add the div to the movies div if the movie is not already in the library
          //get a div with the id of the movie
          let movieAlreadyInLibrary = document.querySelector(`.movieFinded[id="${film["id"]}"]`);
          
          movieFindedDiv.addEventListener("click", function() {
            let movieID = movieFindedDiv.id
            let chocolateServerAdress = getCookie("serverAdress");
            let method = "POST";
            let url = `${chocolateServerAdress}/editMovie/${movieName}/${libraryName}`;
            let body = {
              "newMovieID": movieID
            }
            fetch(url, {
              credentials: "same-origin",
              method: method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(data => {
              if (data.status === "success") {
                window.location.href = `/movies/${libraryName}`;
              }
            })

        })
        
          if (movieAlreadyInLibrary == null) {
            document.getElementsByClassName("editMovieDiv")[0].appendChild(movieFindedDiv);
          }
        }
      }
    )
    .then(() => {
      

    //the add customMovieDIV
    let customMovieDIV = document.createElement("div");
    customMovieDIV.className = "customMovieDIV";

    //the label
    let label = document.createElement("label");
    label.setAttribute("for", "movieID");
    label.innerHTML = language["customMovieId"];

    //the explication
    let explication = document.createElement("p");
    explication.className = "customeIDExplication";
    explication.innerHTML = language["customIdExplication"];

    //the input
    let input = document.createElement("input");
    input.type = "text";
    input.id = "movieID";
    input.name = "movieID";

    //the button
    let button = document.createElement("button");
    button.id = "customMovieButton";
    button.innerHTML = language["addThisMovie"];

    //add the label, the explication, the input and the button to the customMovieDIV
    customMovieDIV.appendChild(label);
    customMovieDIV.appendChild(explication);
    customMovieDIV.appendChild(input);
    customMovieDIV.appendChild(button);

    //add the customMovieDIV to the movies div
    let customIDButton = document.getElementById("customMovieButton")
    customIDButton.addEventListener("click", function() {
        let movieID = document.getElementById("movieID").value
        let chocolateServerAdress = getCookie("serverAdress");
        let method = "POST";
        let url = `${chocolateServerAdress}/editMovie/${movieName}/${libraryName}`;
        let body = {
          "newMovieID": movieID
        }
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body), 
          credentials: "same-origin"
          
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === "success") {
            window.location.href = `/movies/${libraryName}`;
          }
        })
    })
    document.getElementsByClassName("editMovieDiv")[0].appendChild(customMovieDIV);
    })
  }
    

  const language = JSON.parse(localStorage.getItem("languageFile"));

  useEffect(() => {
    getMovies();
  }, []);

  const currentHref = window.location.href;
  const movieName = currentHref.split("/")[4];
  const libraryName = currentHref.split("/")[5];

  return (
    <div className="App">
      <Header />
      <h1 className="selectMovieText">{language["selectMovieText1"]}<span id="realName">{movieName}</span>{language["selectMovieText2"]}<span id="library">{libraryName}</span></h1>
      <h2 className="selectMovieSecondText">{language["selectMovieSecondText"]}</h2>

      <div className="editMovieDiv">
      </div>
    </div>
  );
}

export default EditMovie;