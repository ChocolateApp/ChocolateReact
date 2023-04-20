import React, { useEffect } from "react";
import Header from "./../Shared/Header";


function EditSerie() {
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

  function getSeries() {
    let chocolateServerAdress = getCookie("serverAdress");

    const currentHref = unescape(window.location.href)
    const serieName = decodeURIComponent(escape(currentHref.split("/")[4]))
    const libraryName = decodeURIComponent(escape(currentHref.split("/")[5]))

    let url = `${chocolateServerAdress}editSerie/${serieName}/${libraryName}`;

    //for all serie finded
    let destinationDIV = document.getElementsByClassName("editSerieDiv")[0];
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
        for (let i = 0; i < data.length; i++) {
          let serie = data[i];
          console.log(serie)
          console.log(typeof serie)

          let serieFindedDiv = document.createElement("div");
          serieFindedDiv.className = "serieFinded";
          serieFindedDiv.id = serie["id"];

          //for the image
          let serieFindedImg = document.createElement("img");
          serieFindedImg.src = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${serie["poster_path"]}`;
          serieFindedImg.alt = serie["name"];

          //for the title
          let serieFindedTitle = document.createElement("h1");
          serieFindedTitle.innerHTML = serie["name"];

          //add the image and the title to the div
          serieFindedDiv.appendChild(serieFindedImg);
          serieFindedDiv.appendChild(serieFindedTitle);

          //add the div to the series div if the serie is not already in the library
          //get a div with the id of the serie
          let serieAlreadyInLibrary = document.querySelector(`.serieFinded[id="${serie["id"]}"]`);
          
          serieFindedDiv.addEventListener("click", function() {
            let serieID = serieFindedDiv.id
            let chocolateServerAdress = getCookie("serverAdress");

            let url = `${chocolateServerAdress}editSerie/${serieName}/${libraryName}`;

            let body = {
              "newSerieID": serieID
            }

            fetch(url, {
              credentials: "same-origin",
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(data => {
              if (data.status === "success") {
                window.location.href = `/series/${libraryName}`;
              }
            })

        })
        
          if (serieAlreadyInLibrary == null) {
            document.getElementsByClassName("editSerieDiv")[0].appendChild(serieFindedDiv);
          }
        }
      }
    )
    .then(() => {
      

    //the add customSerieDIV
    let exist = document.getElementsByClassName("customSerieDIV")[0];
    if (exist == null) {
      let customSerieDIV = document.createElement("div");
      customSerieDIV.className = "customSerieDIV";

      //the label
      let label = document.createElement("label");
      label.setAttribute("for", "serieID");
      label.innerHTML = language["customSerieId"];

      //the explication
      let explication = document.createElement("p");
      explication.className = "customeIDExplication";
      explication.innerHTML = language["customIdExplication"];

      //the input
      let input = document.createElement("input");
      input.type = "text";
      input.id = "serieID";
      input.name = "serieID";

      //the button
      let button = document.createElement("button");
      button.id = "customSerieButton";
      button.innerHTML = language["addThisSerie"];
      //add the customSerieDIV to the series div
      button.addEventListener("click", function() {
          let serieID = document.getElementById("serieID").value
          let chocolateServerAdress = getCookie("serverAdress");
          let method = "POST";
          let url = `${chocolateServerAdress}/editSerie/${serieName}/${libraryName}`;
          let body = {
            "newSerieID": serieID
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
              window.location.href = `/series/${libraryName}`;
            }
          })
      })

      //add the label, the explication, the input and the button to the customSerieDIV
      customSerieDIV.appendChild(label);
      customSerieDIV.appendChild(explication);
      customSerieDIV.appendChild(input);
      customSerieDIV.appendChild(button);

      document.getElementsByClassName("editSerieDiv")[0].appendChild(customSerieDIV);
    }
    })
  }
    

  const language = JSON.parse(localStorage.getItem("languageFile"));

  useEffect(() => {
    getSeries();
  }, []);

  const currentHref = unescape(window.location.href)
  const serieName = decodeURIComponent(escape(currentHref.split("/")[4]))
  const libraryName = decodeURIComponent(escape(currentHref.split("/")[5]))

  return (
    <div className="App">
      <Header />
      <h1 className="selectMovieText">{language["selectMovieText1"]}<span id="realName">{serieName}</span>{language["selectMovieText2"]}<span id="library">{libraryName}</span></h1>
      <h2 className="selectMovieSecondText">{language["selectMovieSecondText"]}</h2>

      <div className="editSerieDiv">
      </div>
    </div>
  );
}

export default EditSerie;