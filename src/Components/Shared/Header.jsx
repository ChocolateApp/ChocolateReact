import { Link } from "react-router-dom";
import logo from "../../Assets/images/logo.png";

import { librariesIcons } from "./LibrariesIcons";

import { useGet } from "../../Utils/Fetch";

import { IoHomeOutline, IoAddOutline, IoLogOutOutline, IoPersonOutline } from "react-icons/io5";

export default function Header() {
    const { data: allLibraries } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_libraries`)
    
    return (
        <>
            <div className="right_effect"></div>
            <header>
                <div id="goHome" className="logo_svg">
                    <Link to="/">
                        <img
                            className="logo"
                            id="logo"
                            src={logo}
                            alt="ChocolateLogo"
                        />
                    </Link>
                </div>
                <div className="header_icons">
                <Link to="/" className="header_icon">
                    <IoHomeOutline className="icon" />
                </Link>
                {Array.isArray(allLibraries) ? allLibraries.map((library) => (
                    <Link to={`/${library.lib_type}/${library.lib_name}`} key={`${library.lib_type}_${library.lib_name}`} className="header_icon" title={library.lib_name}>
                        {librariesIcons[library.lib_type]}
                    </Link>
                )) : null}
                </div>
                <div className="header_bottom_icons">
                    <Link to="/add_media" className="header_icon">
                        <IoAddOutline className="add_icon" />
                    </Link>
                    <Link to="/logout" className="header_icon">
                        <IoLogOutOutline className="logout_icon" />
                    </Link>
                    <Link to="/profil" className="header_icon">
                        <IoPersonOutline className="person_icon" />
                    </Link>
                </div>
            </header>
        </>
  );
}
