import { librariesIcons } from "./LibrariesIcons";

import { Link } from "react-router-dom";

export function HomeCard({ name, type }) {
    return (
        <Link to={`/${type}/${name}`} className="card">
            {librariesIcons[type]}
            <p>{name}</p>
        </Link>
    )
}