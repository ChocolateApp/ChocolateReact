import logo from "./images/logo.png";
import "./App.css";
import { IoSearchOutline, IoCogOutline, IoHomeOutline, IoAddOutline, IoLogOutOutline, IoPersonOutline, IoFilmOutline, IoVideocamOutline, IoBookOutline, IoGameControllerOutline, IoHeadsetOutline, IoTvOutline, IoDesktopOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

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


    useEffect(() => {
        let username = getCookie("username");
        let chocolateServerAdress = getCookie("serverAdress");
        if (chocolateServerAdress !== "") {
            fetch(`${chocolateServerAdress}getAllLibraries/${username}`, {
                credentials: "same-origin"
              })
            .then(response => response.json())
            .then(data => {
            console.log(data);
            setAllLibrary(data);
            }
            )
            .catch((error) => {
                console.error("Error:", error);
            });
        }
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
            <a className="settings" href="/settings">
                <IoCogOutline className="cog" />
            </a>
            <header>
                <div id="goHome" className="logo_svg">
                <img
                    className="logo"
                    id="logo"
                    src={logo}
                    alt="ChocolateLogo"
                />
                </div>
                <div className="headerIcons">
                <a href="/">
                    <IoHomeOutline className="icon" />
                </a>
                {allLibrary.map((library) => (
                    <a href={`/${library.libType}/${library.libName}`} id={library.libName} key={library.libName}>
                    {librariesIcons[library.libType]}
                    </a>
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
