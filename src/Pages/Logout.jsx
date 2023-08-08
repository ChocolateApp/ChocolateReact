import { useEffect } from "react";

export default function Logout() {

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('account_type');

        window.location.href = "/";
    }, []);

    return null;
}