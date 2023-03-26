import { IoCloseOutline, IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useEffect } from "react";
import "./App.css";

function Popup() {

    useEffect(() => {
        setPopup();
    }, []);

    const language = JSON.parse(localStorage.getItem("languageFile"));

    function setPopup() {
        console.log("setPopup")
        let closePopup = document.getElementById("crossPopup")
        closePopup.addEventListener("click", function() {
            let popup = document.getElementById("popup")
            popup.style.display = "none"

            document.body.style.overflow = "auto"

            let imagePopup = document.getElementsByClassName("coverPopup")[0]
            imagePopup.setAttribute("src", "");
            imagePopup.setAttribute("alt", "");
            imagePopup.setAttribute("title", "");

            let titlePopup = document.getElementsByClassName("titlePopup")[0]
            titlePopup.innerHTML = "";

            let descriptionPopup = document.getElementsByClassName("descriptionPopup")[0]
            descriptionPopup.innerHTML = "";

            let notePopup = document.getElementsByClassName("notePopup")[0]
            notePopup.innerHTML = "";

            let yearPopup = document.getElementsByClassName("yearPopup")[0]
            yearPopup.innerHTML = "";

            let genrePopup = document.getElementsByClassName("genrePopup")[0]
            genrePopup.innerHTML = "";

            let durationPopup = document.getElementsByClassName("durationPopup")[0]
            durationPopup.innerHTML = "";

            let castPopup = document.getElementById("castPopup")
            let castDivs = document.getElementsByClassName("castMember")
            let image = document.getElementsByClassName("castImage")[0]
            while (castDivs.length > 0) {
                image.setAttribute("src", "")
                castPopup.removeChild(castDivs[0])
            }
            let childs = document.getElementsByClassName("movie")
            while (childs.length > 0) {
                childs[0].remove()
            }
            try {
            let similar = document.getElementsByClassName("containerSimilar")[0]
            similar.style.gridTemplateColumns = "repeat(0, 1fr)"
            } catch (error) {
                //pass
            }

            try {
                const seasons = document.getElementsByClassName("containerSeasons")[0]
                seasons.innerHTML = ""
            } catch (error) {
                //pass
            }
            try {
                let downloadMovie = document.getElementById("downloadMovieButton")
                downloadMovie.setAttribute("href", "")
            } catch (error) {
                //pass
            }
            
            let trailerVideo = document.getElementsByClassName("trailerVideo")
            for (let i = 0; i < trailerVideo.length; i++) {
                let trailer = trailerVideo[i]
                trailer.setAttribute("src", "")
                trailer.remove()
            }
        })
    }

    return (
        <div id="popup" className="popup" style={{ display: "none" }} onLoad={setPopup} >
            <IoCloseOutline className="crossPopup" id="crossPopup" />
            <img src="#" className="coverPopup" title="" alt="" />
            <div className="popupContent">
                <p className="titlePopup" />
                <p className="descriptionPopup" />
                <div className="containerPopup">
                <p className="notePopup" />
                <p className="yearPopup" />
                <p className="genrePopup" />
                <p className="durationPopup" />
                </div>
                <div className="containerCast">
                <div className="castPopup" id="castPopup"></div>
                </div>
                <div className="containerSeasons" />
                <div className="containerSimilar"></div>
                <div className="containerTrailer"></div>
            </div>
            <div className="popupButtons">
                <a className="playPopup" href="/movie/undefined">
                    <IoPlayOutline className="watchNow" />
                    {language["watchNow"]}
                </a>
                <a className="downloadPopup" id="downloadNowA" href="/download/movieID">
                    <IoDownloadOutline className="downloadNow"/>
                    {language["downloadButton"]}
                </a>
            </div>
        </div>

  );
}

export default Popup