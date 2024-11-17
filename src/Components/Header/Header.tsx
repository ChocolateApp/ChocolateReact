import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { isMobile } from "react-device-detect";
import UserDropdown from './UserDropdown';
import SearchBar from './SearchBar';
import { SearchContext } from '@/Contexts/SearchContext';
import { useContext, useState } from 'react';

const LayoutHeader = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { setSearchTerm } = useContext(SearchContext)

    const navigate = useNavigate();

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    }

    return (
        !isMobile ? (
            <section>
                <header className="flex justify-between items-center py-4 px-16 text-white sticky top-0 left-0 w-full z-[99999]">
                    <section className="flex gap-4 items-center">
                        <img src="/logo.png" alt="Logo" className='w-12 h-12 cursor-pointer' onClick={() => navigate("/home")} />
                        <nav className="flex gap-4">
                            <NavLink to="/home">Home</NavLink>
                            <NavLink to="/movies">Movies</NavLink>
                            <NavLink to="/shows">TV Shows</NavLink>
                            <NavLink to="/live-tv">Live TV</NavLink>
                            <NavLink to="/musics">Musics</NavLink>
                            <NavLink to="/books">Books</NavLink>
                            <NavLink to="/games">Games</NavLink>
                            <NavLink to="/others">Others</NavLink>
                        </nav>
                    </section>
                    <section className="flex gap-8">
                        <SearchBar onSearch={handleSearch} />
                        <UserDropdown />
                    </section>
                </header>

                <Outlet />
            </section>
        ) : (
            <section className={`${isOpen ? "overflow-hidden" : ""}`}>
                <section>
                    <header className="flex justify-between items-center py-4 px-8 text-white">
                        <button onClick={() => setIsOpen(!isOpen)} className="pointer-events-auto">
                            <div className={`hamburger ${isOpen ? "active" : ""}`}>
                                <div className="line"></div>
                                <div className="line"></div>
                                <div className="line"></div>
                            </div>
                        </button>
                        <SearchBar onSearch={handleSearch} />
                        <UserDropdown />
                    </header>
                    <aside className={`fixed pl-8 pt-4 flex flex-col gap-24 top-0 left-0 h-full bg-[--black] z-40 transform transition-transform duration-300 ease-in-out overflow-hidden w-full ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                        <section className="flex justify-between items-center py-4 pr-8">
                            <img src="/logo.png" alt="Logo" className='w-12 h-12' />
                            <button onClick={() => setIsOpen(!isOpen)} className="pointer-events-auto">
                                <div className={`hamburger ${isOpen ? "active" : ""}`}>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                    <div className="line"></div>
                                </div>
                            </button>
                        </section>
                        <nav className="flex flex-col gap-6">
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/home">Home</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/movies">Movies</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/shows">TV Shows</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/live-tv">Live TV</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/musics">Musics</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/books">Books</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/games">Games</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} className="text-2xl" to="/others">Others</NavLink>
                        </nav>
                    </aside>
                </section >
                <Outlet />
            </section >
        )
    );
};

export default LayoutHeader;
