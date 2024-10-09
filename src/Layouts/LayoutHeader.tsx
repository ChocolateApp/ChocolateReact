import React from 'react';
import Header from '@/Components/Header/Header';
import { usePost } from '@/Hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';

const LayoutHeader = ({ children }: { children?: React.ReactNode }) => {

    const { handleSubmit } = usePost();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        handleSubmit({
            url: '/api/auth/check',
            dispatcher: (data: any) => {
                if (data.code === 243) {
                    navigate('/login');
                }
            }
        });
    }, [location.pathname]);

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default LayoutHeader;