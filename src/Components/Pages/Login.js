import logo from "./../../images/logo.png";
import { IoCloseOutline } from "react-icons/io5";
import { useState, useRef } from "react";
import { POST } from "./../../static/js/fetch.js";

function Login() {
      
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

    let divRef = useRef(null);

    function login(event, user) {
        console.log(event.currentTarget);
        console.log(user);
        document.getElementsByClassName("nameInputForm")[0].value = event.currentTarget.getAttribute("data-id")
        let loginPopup = document.getElementsByClassName("loginPopup")[0]
        let accountType = event.currentTarget.getAttribute("type")
        let passwordEmpty = event.currentTarget.getAttribute("data-passwordEmpty")
        
        
        if (["Admin", "Adult", "Teen"].includes(accountType) && passwordEmpty === "no") {
            loginPopup.style.display = "block"
        } else {
            loginPopup = document.getElementsByClassName("loginPopup")[0]
            document.getElementById("password").value = ""
            loginUser()
        }
    }
    
    function closePopup() {
        let loginPopup = document.getElementsByClassName("loginPopup")[0]
        loginPopup.style.display = "none"
        document.getElementsByClassName("nameInputForm")[0].value = ""
    }

    

    function checkEnter(event) {
        if (event.keyCode === 13) {
            loginUser()
        }
    }

    function loginUser() {
        let username = document.getElementsByClassName("nameInputForm")[0].value
        let password = document.getElementById("password").value
        
        let chocolateServerAdress = getCookie("serverAdress");
        
        POST(chocolateServerAdress+"login", {
            name: username,
            password: password
        })
        .then(response => {
            console.log(response)
            return response
        })
        .then(data => {
            console.log(data)
            if (data.error === "None") {
                setCookie("loggedIn", "true")
                setCookie("username", username)
                let token = data.token
                setCookie("token", token)
                
                //if /login redirect to /, else reload
                if (window.location.pathname === "/login") {
                    window.location.href = "/"
                } else {
                    window.location.reload();
                }
            } else {
                setCookie("loggedIn", "false")
            }
        })
    }

    function setCookie(name, value="false") {
        var now = new Date();
        var minutes = 120;
        now.setTime(now.getTime() + (minutes * 60 * 1000));
        document.cookie = `${name}=${value}; expires=${now.toUTCString()}; path=/`
    }

    const chocolateServerAdress = getCookie("serverAdress");
    
    const [allUsers, setAllUsers] = useState([])
    useState(() => {
        fetch(chocolateServerAdress+"getAllUsers", {
            credentials: "same-origin"
          })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setAllUsers(data.users)
            console.log(data.users)
            if (data.users.length === 0 && data.status === "ok") {
                console.log("redirecting")
                if (window.location.pathname === "/login" || window.location.pathname === "/") {
                    window.location.href = "/createAccount"
                }
            }
        })
    }, [])
        

    return (
        <div className="App">  
        <div className="rightEffect" />
        
        <header>
            <div id="goHome" className="logo_svg">
            <img
                className="logo"
                id="logo"
                src={logo}
                alt="ChocolateLogo"
            />
            </div>
        </header>
        <div className="allUsers">
            {allUsers.map((user) => (

                <div className="user" data-id={user.name} type={user.accountType} data-passwordEmpty={user.passwordEmpty} onClick={(event) => login(event, user.name)} ref={divRef}>
                    <img src={chocolateServerAdress+user.profilePicture} alt="avatar"/>
                    <h1>{user.name}</h1>
                </div>
            ))}
        </div>
        <div className="loginPopup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={closePopup} />

            <input
            style={{ display: "none" }}
            type="text"
            name="name"
            id="name"
            className="nameInputForm"
            placeholder="Username"
            />
            <input
            type="password"
            name="password"
            id="password"
            className="passwordLogin"
            placeholder="Password"
            onKeyDown={checkEnter}
            />
            <input
            type="submit"
            defaultValue="Login"
            id="submitLogin"
            onClick={loginUser}
            />
        </div>
        </div>
        
    );
}

export default Login;
