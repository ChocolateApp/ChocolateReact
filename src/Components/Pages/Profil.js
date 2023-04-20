import React, { useState, useEffect } from "react";
import Header from "./../Shared/Header";
import { IoPencilOutline } from "react-icons/io5";

function Profil() {
  const language = JSON.parse(localStorage.getItem("languageFile"));
    
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

  function editProfile() {
    let chocolateServerAdress = getCookie("serverAdress");
    let url = `${chocolateServerAdress}editProfil`;

    let form = new FormData();
    let file = document.getElementById("profilePicture").files[0];
    form.append("profilePicture", file);
    form.append("name", document.getElementById("name").value);
    form.append("currentUser", getCookie("username"));
    form.append("password", document.getElementById("password").value);

    fetch(url, {
      method: "POST",
      body: form,
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      window.location.reload();
    });
  }

  function setEvents() {
    let profilePictureImg = document.getElementById("profilePictureImg")
    let editProfilePicture = document.getElementsByClassName("editProfilePicture")[0]
    let profilePictureInput = document.getElementById("profilePicture")
    profilePictureImg.removeEventListener("mouseover", showEditProfilePicture)
    profilePictureImg.addEventListener("mouseover", showEditProfilePicture)

    editProfilePicture.removeEventListener("mouseover", showEditProfilePicture)        
    editProfilePicture.addEventListener("mouseover", showEditProfilePicture)

    editProfilePicture.removeEventListener("mouseout", hideEditProfilePicture)
    editProfilePicture.addEventListener("mouseout", hideEditProfilePicture)

    profilePictureImg.removeEventListener("mouseout", hideEditProfilePicture)
    profilePictureImg.addEventListener("mouseout", hideEditProfilePicture)
    
    editProfilePicture.removeEventListener("click", clickInput)
    editProfilePicture.addEventListener("click", clickInput)
    
    profilePictureInput.removeEventListener("change", getFile)
    profilePictureInput.addEventListener("change", getFile)
  }

  function clickInput() {
    document.getElementById("profilePicture").click();
  }

  function getFile() {
    var file = document.getElementById("profilePicture").files[0];
    getBase64(file)
  }

  function hideEditProfilePicture() {
    let editProfilePicture = document.getElementsByClassName("editProfilePicture")[0]
    editProfilePicture.style.display = "none"
  }

  function showEditProfilePicture() {
    let editProfilePicture = document.getElementsByClassName("editProfilePicture")[0]
    editProfilePicture.style.display = "block"
  }
    
    
  function getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
          let resultat = reader.result;
          let profilePictureImg = document.getElementById("profilePictureImg")
          profilePictureImg.setAttribute('src', resultat)
      };
      reader.onerror = function(error) {
          console.log('Error: ', error);
      };
  }

  useEffect(() => {
    let username = getCookie("username");
    let chocolateServerAdress = getCookie("serverAdress");

    fetch(`${chocolateServerAdress}getProfile/${username}`).then(function(response) {
      return response.json();
    }).then(function(profile) {
      let profilePicture = document.getElementById("profilePicture");
      profilePicture = `${chocolateServerAdress}${profile.profilePicture}`;
      document.getElementById("profilePictureImg").src = profilePicture;
    });
    setEvents();
  }, []);
  return (
    <div className="App">
      <Header />
      <div className="profileDiv">
        <IoPencilOutline className="editProfilePicture" />
        <img className="profilePictureImg" src="/static/img/defaultUserProfilePic.png" alt="profilePicture" id="profilePictureImg"/>
        <input type="file" name="profilePicture" id="profilePicture" accept="image/*" style={{display: "none"}} />
        <input type="text" name="name" id="name" placeholder={language["username"]} defaultValue={getCookie("username")} className="name form_field_create_account profileUsername" />
        <input type="password" name="password" id="password" placeholder={language["password"]} className="name form_field_create_account profilePassword" />
        <input type="submit" defaultValue={language["editProfile"]} className="profileSubmitChanges" onClick={editProfile} />
      </div>
    </div>
  );
}

export default Profil;
