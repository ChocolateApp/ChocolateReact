import { useRef } from "react"
import { IoCloseOutline } from "react-icons/io5"

import { usePost } from "../../Utils/Fetch"
import { useLangage } from "../../Utils/useLangage"

export default function LoginPopup({ username, onClose, onDone }) {

    const passwordInput = useRef(null)
    const { handleSubmit, resMsg } = usePost();

    const { getLang } = useLangage()

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
            <input type="password" placeholder={getLang("password")} ref={passwordInput} className="input" autoFocus />
            <button className="button" onClick={Login}>{getLang("login")}</button>
        </div>
    )
}
