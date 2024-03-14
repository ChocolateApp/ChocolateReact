import { useGet } from "../../Utils/Fetch";
import { Link } from "react-router-dom";

export default function CastMember({ id }) {

    const { data: actor } = useGet(`${process.env.REACT_APP_DEV_URL}/get_actor_data/${id}`);

    return (
        <Link className="castMember" to={`/actor/${id}`}>
            <img className="castImage" src={`${process.env.REACT_APP_DEV_URL}/actor_image/${id}`} alt={id} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
            <p className="castName">{actor?.actor_name}</p>
        </Link>
    )
}
