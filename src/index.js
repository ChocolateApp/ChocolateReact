import React from "react";
import ReactDOM from "react-dom/client";

import "./App.css";

import App from "./App";

import Login from "./Login";
import Logout from "./Logout";
import Profil from "./Profil";

import Settings from "./Settings";

import Movies from "./Movies";
import Series from "./Series";
import Books from "./Books";
import Season from "./Season";
import Other from "./Other";
import Consoles from "./Consoles";
import Games from "./Games";
import TvChannels from "./TvChannels";

import Movie from "./Movie";
import Episode from "./Episode";
import Book from "./Book";
import OtherVideo from "./OtherVideo";
import Game from "./Game";
import Tv from "./Tv";

import Actor from "./Actor";

import EditMovie from "./EditMovie";

import SetServerAdress from "./SetServerAdress";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/setServerAdress",
    element: <SetServerAdress />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/profil",
    element: <Profil />,
  },
  {
    path: "/movies/:libName",
    element: <Movies />,
  },
  {
    path: "/movie/:id",
    element: <Movie />,
  },
  {
    path: "/series/:libName",
    element: <Series />,
  },
  {
    path: "/season/:id",
    element: <Season />,
  },
  {
    path: "/episode/:id",
    element: <Episode />,
  },
  {
    path: "/actor/:id",
    element: <Actor />,
  },
  {
    path: "/books/:libName",
    element: <Books />,
  },
  {
    path: "/book/:id",
    element: <Book />,
  },
  {
    path: "/other/:libName",
    element: <Other />,
  },
  {
    path: "/otherVideo/:id",
    element: <OtherVideo />,
  },
  {
    path: "/games/:libName",
    element: <Consoles />,
  },
  {
    path: "/console/:lib/:console",
    element: <Games />,
  },
  {
    path: "/game/:console/:id",
    element: <Game />,
  },
  {
    path: "/tv/:libName",
    element: <TvChannels />,
  },
  {
    path: "/tv/:lib/:id",
    element: <Tv />,
  },
  {
    path: "/editMovie/:name/:lib",
    element: <EditMovie />,
  },
  {
    path: "/settings",
    element: <Settings />,
  }
]);

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

function getStart(serverAdress) {
    var xhr = new XMLHttpRequest();
    try {
        let tempAdress = "https://" + serverAdress;
        xhr.open("GET", tempAdress, false);
        xhr.send();
        if (xhr.status === 200) {
            return tempAdress;
        } else {
            return "http://" + serverAdress;
        }
    } catch (error) {
        return "http://" + serverAdress;
    }
}

function hadIp(href) {
  if (href.includes("localhost")) {
    return "localhost"
  }

  let regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
  const ipMatch = href.match(regex);

  if (ipMatch) {
    return ipMatch[0];
  } else {
    return false;
  }
}

function setCookie(name, value, days) {
    const maxAges = days * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; max-age=${maxAges}; path=/`;
}

function setAdress(ip) {
  let port = "8888"
  ip = getStart(ip) + ":" + port + "/"
  setCookie("serverAdress", ip, 5)
  window.location.reload();
}

let serverCookie = getCookie("serverAdress")
if (serverCookie === null) {

  let actualHref = window.location.href
  
  if (hadIp(actualHref) === false) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
        <React.StrictMode>
          <SetServerAdress />
          <script src="static/js/main.js"></script>
        </React.StrictMode>
    );
  } else {
    setAdress(hadIp(actualHref))
  }

} else {
  let languageCookie = getCookie("language")

  if (languageCookie === null) {
    fetch(getCookie("serverAdress")+"/languageFile", {
      credentials: "same-origin"
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("languageFile", JSON.stringify(data));
    });
  }

  let cookie = getCookie("loggedIn")
  let token = getCookie("token")
  console.log(cookie)
  fetch(getCookie("serverAdress")+"/checkLogin", {
    credentials: "same-origin",
    method: "POST",
    body: JSON.stringify({
      loggedIn: cookie,
      token: token,
    }),
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if (data === false) {
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <Login />
          <script src="static/js/main.js"></script>
        </React.StrictMode>
      );
    } else if (cookie === "false" || cookie === null) {
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <Login />
          <script src="static/js/main.js"></script>
        </React.StrictMode>
      );
    } else {
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
            <RouterProvider router={BrowserRouter} />
            <script src="./static/js/main.js"></script>
        </React.StrictMode>
      );
    }
  })
  .catch((error) => {
    //remove serverAdress cookie and reload
    setCookie("serverAdress", "", -1)
    window.location.reload()
  });
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
