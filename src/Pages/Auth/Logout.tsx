import useLogin from '@/Hooks/useLogin';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const { logout } = useLogin();

    useEffect(() => {
        logout();
        navigate('/login');
    }, []);

    return <div>Logging out...</div>;
};

export default Logout;