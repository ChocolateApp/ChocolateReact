import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchTerm);
        navigate(`?query=${searchTerm}`);
    };

    //si quand ca charge la page, il y a un query dans l'url, on le met dans le search bar
    useEffect(() => {
        const query = new URLSearchParams(window.location.search).get('query');
        if (query) {
            setSearchTerm(query);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className={`flex gap-2 ${isMobile ? 'items-center' : ''}`}>
            <input
                className='w-48 sm:w-auto px-4 py-2 rounded-lg bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500'
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <button type="submit">
                <FaSearch />
            </button>
        </form>
    );
};

export default SearchBar;