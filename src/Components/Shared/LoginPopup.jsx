import { useRef } from "react"
import { usePost } from "../../Utils/Fetch"
import { IoCloseOutline } from "react-icons/io5"

export default function LoginPopup({ username, onClose, onDone }) {

    const passwordInput = useRef(null)
    const { handleSubmit, resMsg } = usePost();


    function Login() {
        if (passwordInput.current.value === "") {
            onClose()
            return
        }
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/login`,
            body: {
                name: username,
                password: passwordInput.current.value
            }
        })
    }

    if (resMsg) {
        const token = resMsg.token

        localStorage.setItem('token', token)
        onDone()
    }

    return (
        <div className="loginPopup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={onClose} />
            <input type="password" placeholder="Password" ref={passwordInput} className="input" />
            <button className="button" onClick={Login}>Login</button>
        </div>
    )
}