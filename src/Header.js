import logo from "./images/logo.png";
import "./App.css";
import { IoSearchOutline, IoCogOutline, IoHomeOutline, IoAddOutline, IoLogOutOutline, IoPersonOutline, IoFilmOutline, IoVideocamOutline, IoBookOutline, IoGameControllerOutline, IoHeadsetOutline, IoTvOutline, IoDesktopOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
    const [allLibrary, setAllLibrary] = useState([]);
      
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

    function checkAccType() {
        const cookie = getCookie("token");
        let chocolateServerAdress = getCookie("serverAdress");
        fetch(`${chocolateServerAdress}checkAccType`, {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify({token: cookie}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data !== "Admin") {
                let settings = document.getElementById("settings");
                settings.remove();
            }
        })
    }


    useEffect(() => {
        let username = getCookie("username");
        let chocolateServerAdress = getCookie("serverAdress");
        if (chocolateServerAdress !== "") {
            fetch(`${chocolateServerAdress}getAllLibraries/${username}`, {
                credentials: "same-origin"
              })
            .then(response => response.json())
            .then(data => {
                setAllLibrary(data);
            }
            )
            .catch((error) => {
                console.error("Error:", error);
            });
        }
        checkAccType();
    }, []);

    const language = JSON.parse(localStorage.getItem("languageFile"))

    const librariesIcons = {
        "movies": <IoFilmOutline className="icon" />,
        "series": <IoVideocamOutline className="icon" />,
        "books": <IoBookOutline className="icon" />,
        "games": <IoGameControllerOutline className="icon" />,
        "music": <IoHeadsetOutline className="icon" />,
        "tv": <IoTvOutline className="icon" />,
        "other": <IoDesktopOutline className="icon" />
    }

    return (
        <>
            <div className="rightEffect" />
            <div id="searchForm">
                <input
                placeholder={language.searchText}
                type="input"
                id="search"
                className="form_field_search"
                />
                <button type="submit" className="buttonSearch" id="buttonSearch">
                <IoSearchOutline className="search_icon" />
                </button>
            </div>
            <Link to="/settings" className="settings" id="settings">
                <IoCogOutline className="cog" />
            </Link>
            <header>
                <div id="goHome" className="logo_svg">
                    <Link to="/">
                        <img
                            className="logo"
                            id="logo"
                            src={logo}
                            alt="ChocolateLogo"
                        />
                    </Link>
                </div>
                <div className="headerIcons">
                <Link to="/">
                    <IoHomeOutline className="icon" />
                </Link>
                {allLibrary.map((library) => (
                    <Link to={`/${library.libType}/${library.libName}`} key={`${library.libType}_${library.libName}`}>
                        {librariesIcons[library.libType]}
                    </Link>
                ))}
                </div>
                <div className="headerBottomIcons">
                <a href="/addMedia">
                    <IoAddOutline className="addIcon" />
                </a>
                <a href="/logout">
                    <IoLogOutOutline className="logoutIcon" />
                </a>
                <a href="/profil">
                    <IoPersonOutline className="personIcon" />
                </a>
                </div>
            </header>
        </>
  );
}

export default Header;
