import { Link } from "react-router-dom";
import { IoCogOutline } from "react-icons/io5";

export default function HeaderCog() {
    return (
        <Link to="/settings" className="settings" id="settings">
            <IoCogOutline className="cog" />
        </Link>
    )
}