import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('account_type');

        navigate('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
