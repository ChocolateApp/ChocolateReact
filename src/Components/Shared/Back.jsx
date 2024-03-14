import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function Back({ path = -1 }) {

    let navigate = useNavigate();

    return (
        <div className="go-back" onClick={() => navigate(path)}>
            <IoArrowBack />
        </div>
    );
}
