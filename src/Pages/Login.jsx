import { useGet } from "../Utils/Fetch"
import LoginPopup from "../Components/Shared/LoginPopup"
import { useState } from "react"
import { usePost } from "../Utils/Fetch"

export default function Login() {

    const [showPopup, setShowPopup] = useState(false)
    const [username, setUsername] = useState(null)
    
    const { data: users } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`)
    const { handleSubmit, resMsg } = usePost();

    function login(username, password_empty, account_type) {
        console.log(username, password_empty, account_type)
        if (password_empty || account_type === "Kid") {
            handleSubmit({
                url: `${process.env.REACT_APP_DEV_URL}/login`,
                body: {
                    name: username,
                    password: ""
                }
            })
        } else {
            setShowPopup(true)
            setUsername(username)
        }
    }

    if (resMsg) {
        const token = resMsg.token

        localStorage.setItem('token', token)
        window.location.reload()
    }

    return (
        <>
            {showPopup ? <LoginPopup username={username} onDone={() => window.location.reload()} onClose={() => setShowPopup(false)} /> : null}
            <div className="accounts">
                {Array.isArray(users) ? users.map(user => (
                    <div className="account" onClick={() => login(user.name, user.password_empty, user.account_type)}>
                        <img src={`${process.env.REACT_APP_DEV_URL}/${user.profil_picture}`} alt="avatar" />
                        <p>{user.name}</p>
                    </div>
                )) : null}
            </div>
        </>
    )
}