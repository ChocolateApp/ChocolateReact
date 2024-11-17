import React, { useState, useEffect } from 'react';
import GeneralSettings from './Subpages/GeneralSettings';
import AccountsSettings from './Subpages/AccountsSettings';
import LibrariesSettings from './Subpages/LibrariesSettings';
import { useGet } from '@/Hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const [currentSection, setCurrentSection] = useState<string>(window.location.hash || '#general');

    const { data: authData } = useGet('/api/auth/check');

    const navigate = useNavigate();

    useEffect(() => {
        if (!authData) return;
        if (!authData.data || authData.data.account_type !== 'Admin') {
            navigate('/');
        }
    }, [authData]);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentSection(window.location.hash || '#general');
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div className="flex h-screen">
            <div className="w-1/6 border-r-2 border-zinc-800 text-white p-4">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                <ul>
                    <li className="mb-2">
                        <a href="#general" className={`hover:underline ${currentSection === '#general' ? 'font-bold' : ''}`}>General</a>
                    </li>
                    <li className="mb-2">
                        <a href="#accounts" className={`hover:underline ${currentSection === '#accounts' ? 'font-bold' : ''}`}>Accounts</a>
                    </li>
                    <li className="mb-2">
                        <a href="#libraries" className={`hover:underline ${currentSection === '#libraries' ? 'font-bold' : ''}`}>Libraries</a>
                    </li>
                </ul>
            </div>
            <div className="w-5/6 p-4 overflow-y-scroll">
                {currentSection === '#general' && (
                    <GeneralSettings />
                )}
                {currentSection === '#accounts' && (
                    <AccountsSettings />
                )}
                {currentSection === '#libraries' && (
                    <LibrariesSettings />
                )}
            </div>
        </div>
    );
};

export default Settings;