import { useGet } from "@/Hooks/useFetch";
import useLogin from "@/Hooks/useLogin";
import { User } from "@/Types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserComponent: React.FC<{ user: User, onClick: () => void }> = ({ user, onClick }) => {
    return (
        <article className="flex flex-col items-center justify-center gap-2 cursor-pointer" onClick={onClick}>
            <img className="w-32 h-32 rounded-lg" src={`${user.profile_picture}`} alt={user.name} />
            <h2 className="text-2xl max-w-32 text-neutral-200 overflow-hidden text-ellipsis">{user.name}</h2>
        </article>
    );
}

type LoginPopupProps = {
    selectedUser: User | null,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (username: string, password: string) => void
}

const LoginPopup: React.FC<LoginPopupProps> = ({ selectedUser, isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState<string>("");

    return (
        <>
            <section className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-0 z-50 ${isOpen ? "pointer-events-auto" : "bg-opacity-0 pointer-events-none"} transition-opacity duration-300`} onClick={onClose}></section> {/* Background overlay */}
            <section className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-900 rounded-lg p-8 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-300`}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                    onClick={() => onSubmit(selectedUser?.name || "", password)}
                    className="w-full px-4 py-2 text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    Login
                </button>
            </section>
        </>
    );
}


const Login = () => {
    const [popupOpenend, setPopupOpened] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { data: accounts, error } = useGet("/api/auth/accounts") as { data: { data: User[] }, error: any };

    const { login } = useLogin();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    })

    const handleCardClick = (user: User) => {
        if (user.password_empty) {
            handleLogin(user.name, "");
        } else {
            setSelectedUser(user);
            setPopupOpened(true);
        }
    }

    const handleLogin = async (username: string, password: string) => {
        try {
            await login({ username, password })
            navigate("/home");
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <section className="flex flex-wrap items-center justify-center content-center gap-x-16 gap-y-8 px-80 py-32 max-h-screen h-screen max-w-screen">
                {accounts && accounts.data.map((user: User) => <UserComponent user={user} onClick={() => handleCardClick(user)} key={user.id} />)}
            </section>
            <LoginPopup selectedUser={selectedUser} isOpen={popupOpenend} onClose={() => { setPopupOpened(false); setSelectedUser(null) }} onSubmit={handleLogin} />
        </>
    );
};

export default Login;