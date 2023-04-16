import "./App.css";

function SetServerAdress() {
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

    function setServerAdress() {

        let serverAdress = document.getElementById("serverAdress").value;
        while ("https://" === serverAdress.substring(0, 8)) {
            serverAdress = serverAdress.substring(8);
        }
        while ("http://" === serverAdress.substring(0, 7)) {
            serverAdress = serverAdress.substring(7);
        }
        serverAdress = getStart(serverAdress)
        if (serverAdress.endsWith("/") === false) {
            serverAdress = serverAdress + "/";
        }
        setCookie("serverAdress", serverAdress, 5);
        window.location.href = "/";
    }

    function setCookie(name, value, days) {
        const maxAges = days * 24 * 60 * 60 * 1000;
        const expires = new Date(Date.now() + 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; max-age=${maxAges}; path=/`;
    }

    function checkEnter(event) {
        if (event.keyCode === 13) {
            setServerAdress();
        }
    }
    return (
        <div className="App">
            <div className="setServerAdress">
                <h1>Set server adress</h1>
                <input type="text" id="serverAdress" placeholder="Server adress" className="form_field" onKeyDown={checkEnter} />
                <input type="submit" value="Set" id="submitServerAdress" onClick={setServerAdress} className="chocolateButton" />
            </div>
        </div>
    );
}

export default SetServerAdress;
