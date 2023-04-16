import "./App.css";
import { useEffect } from "react";

function CreateAccount() {
  
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
  const language = JSON.parse(localStorage.getItem("languageFile"));

  function createAccount() {
    let name = document.getElementsByClassName("name")[0].value
    let password = document.getElementsByClassName("password")[0].value
    let profilePicture = document.getElementById("profilePicture").files[0]
    let type = "Admin"
    let formData = new FormData()
    formData.append("name", name)
    formData.append("password", password)
    formData.append("profilePicture", profilePicture)
    formData.append("type", type)

    let chocolateServerAdress = getCookie("serverAdress");

    fetch(`${chocolateServerAdress}createAccount`, {
      method: "POST",
      body: formData,
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      //go to /
      console.log(data)
      window.location.href = "/"
    });
  }

  let chocolateServerAdress = getCookie("serverAdress");

  fetch(chocolateServerAdress+"getAllUsers", {
    credentials: "same-origin"
  })
.then(response => response.json())
.then(data => {
    if (data.users.length > 0 && data.status === "ok") {
        window.location.href = "/"
    }
})

  return (
    <div className="App">
      <div className="createAccount" id="createAccount">
        <div className="accountCreateFields">
            <div className="nameAccountCreator">
                <label htmlFor="name">{language["name"]} : </label>
                <input type="text" name="name" id="name" className="name form_field_create_account" />
            </div>
            <div className="passwordAccountCreator">
                <label htmlFor="password">{language["password"]} : </label>
                <input type="password" name="password" id="password" className="password form_field_create_account" />
            </div>
            <div className="profileAccountCreator">
                <label htmlFor="profilePicture">{language["profilePic"]} : </label>
                <input type="file" name="profilePicture" id="profilePicture" accept="image/*" />
            </div>
        </div>
        <input id="createAccountButton" type="submit" value={language["createAccount"]} className="createAccountButton" onClick={createAccount} />
      </div>
    </div>
  );
  
}

export default CreateAccount;