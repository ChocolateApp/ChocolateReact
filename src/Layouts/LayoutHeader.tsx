import React from 'react';
import Header from '@/Components/Header/Header';

const LayoutHeader = ({ children }: { children?: React.ReactNode }) => {

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default LayoutHeader;