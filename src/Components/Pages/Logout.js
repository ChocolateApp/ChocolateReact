
function Logout() {
    function delete_cookie(name) {
        document.cookie = name +"=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    //remove cookie with username and loggedIn name
    delete_cookie("username");
    delete_cookie("loggedIn");
    delete_cookie("token")
    //redirect to login page
    window.location.href = "/login";
}

export default Logout;
