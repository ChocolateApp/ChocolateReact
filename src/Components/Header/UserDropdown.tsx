import useLogin from '@/Hooks/useLogin';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const UserDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { profileData } = useLogin();

    return (
        <section className="relative flex items-center gap-4">
            <img src={profileData?.profile_picture} alt={profileData?.name} className='w-8 h-8 rounded-md' />
            <FaChevronDown onClick={() => setIsOpen(!isOpen)} className={`cursor-pointer ${isOpen ? "transform -rotate-180" : ""} transition-transform duration-300`} />
            <ul className={`absolute top-[100%] right-0 bg-neutral-900 rounded-lg px-4 overflow-hidden ${isOpen ? "h-auto p-4" : "h-0 p-0"} transition-all duration-300`}>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li>
                    <Link to="/logout">Logout</Link>
                </li>
            </ul>
        </section>
    );
};

export default UserDropdown;