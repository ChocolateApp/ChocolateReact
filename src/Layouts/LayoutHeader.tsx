import React, { useEffect } from 'react';
import Header from '@/Components/Header/Header';
import { useGet } from '@/Hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const LayoutHeader = ({ children }: { children?: React.ReactNode }) => {

    const { data: librariesData } = useGet('/api/settings/libraries');

    const navigate = useNavigate();

    useEffect(() => {
        if (librariesData && librariesData.data.length == 0) {
            navigate('/settings#libraries');
        }
    }, [librariesData]);

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default LayoutHeader;