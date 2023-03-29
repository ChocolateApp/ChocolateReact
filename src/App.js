import "./App.css";
import { IoFilmOutline, IoVideocamOutline, IoBookOutline, IoGameControllerOutline, IoHeadsetOutline, IoTvOutline, IoDesktopOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

function App() {
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
      let chocolateServerAdress = getCookie("serverAdress");
      let username = getCookie("username");
      fetch(`${chocolateServerAdress}getAllLibraries/${username}`, {
        credentials: "same-origin"
      })
          .then(response => response.json())
          .then(data => {
            setAllLibrary(data);
          }
          );
  }, []);

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
    <div className="App">  
      <Header />
      <div className="cardsIndex">
          
          {allLibrary.map((library) => (
            <Link to={`/${library.libType}/${library.libName}`} className="card">
                {librariesIcons[library.libType]}
                <p>{library.libName}</p>
            </Link>
          ))}

      </div>
    </div>
  );
}

export default App;
