import { IoCloseOutline, IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useGet, usePost } from "../../Utils/Fetch";
import { useNavigate, Link  } from "react-router-dom";
import { useState } from "react";

import { librariesIcons } from "./LibrariesIcons";
import Buttons from "./Buttons";
import CastMember from "./CastMember";
import { Success } from './Notifications';

export function PopupMovie({ onClose, id }) {

    const navigate = useNavigate();
    
    function playMovie() {
        navigate("/movie/"+id);
    }

    function downloadMovie() {
        window.location.href = `${process.env.REACT_APP_DEV_URL}/download_movie/${id}`
    }

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_movie_data/${id}`);

    return (
        <div id="popup" className="popup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={onClose} />
            {data && (
                <div className="popupContent">
                    <div className="popup-left">
                        <img src={`${process.env.REACT_APP_DEV_URL}/${data.cover}`} alt={data.realTitle} className="coverPopup" />
                    </div>
                    <div className="popup-right">
                        <p className="titlePopup">{data.realTitle}</p>
                        <p className="descriptionPopup">{data.description}</p>
                        <div className="containerPopup">
                            <p className="notePopup">Note: {data.note}</p>
                            <p className="yearPopup">Date: {data.data}</p>
                            <p className="genrePopup">Genres: {JSON.parse(data.genre).join(", ")}</p>
                            <p className="durationPopup">Durée: {data.duration}</p>
                        </div>
                        <div className="containerCast">
                            <div className="castPopup" id="castPopup">
                            {JSON.parse(data.cast).map((actor, index) => (
                                <CastMember data={actor} key={index} />
                            ))}
                            </div>
                        </div>
                        <div className="containerSeasons"></div>
                        <div className="containerSimilar">
                            {data.similar && (data.similar.map((movie, index) => (
                                <img className="similarPopup" src={`${process.env.REACT_APP_DEV_URL}/${movie.cover}`} alt={movie.title} title={movie.title} key={index} />
                            )))}
                        </div>
                        {data.bandeAnnonceUrl && (
                            <div className="containerTrailer">
                                <iframe className="trailerPopup" src={data.bandeAnnonceUrl} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        )}
                        <div className="popupButtons">
                            <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={playMovie} />
                            <Buttons icon={<IoDownloadOutline />} text="Download" onClick={downloadMovie} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function PopupSerie({ onClose, id }) {

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_serie_data/${id}`);

    const navigate = useNavigate();

    return (
        <div id="popup" className="popup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={onClose} />
            {data && (
                <div className="popupContent">
                    <div className="popup-left">
                        <img src={`${process.env.REACT_APP_DEV_URL}/${data.serie_cover_path}`} alt={data.title} className="coverPopup" />
                    </div>
                    <div className={`popup-right ${data.latest_id ? "popup-serie-right" : ""}`}>
                        <p className="titlePopup">{data.name}</p>
                        <p className="descriptionPopup">{data.description}</p>
                        <div className="containerPopup">
                            <p className="notePopup">Note: {data.note}</p>
                            <p className="yearPopup">Date: {data.date}</p>
                            <p className="genrePopup">Genres: {JSON.parse(data.genre).join(", ")}</p>
                        </div>
                        <div className="containerCast">
                            <div className="castPopup" id="castPopup">
                            {JSON.parse(data.cast).map((actor, index) => (
                                <CastMember data={actor} key={index} />
                            ))}
                            </div>
                        </div>
                        <div className="containerSeasons" style={{ marginBottom: data.bande_annonce_url ? "auto" : "100px" }}>
                            {data.seasons && Object.keys(data.seasons).map((season, index) => (
                                <Link to={"/season/"+data.seasons[season].season_id} key={index}>
                                    <img className="seasonPopup" src={`${process.env.REACT_APP_DEV_URL}/${data.seasons[season].season_cover_path}`} alt={data.seasons[season].season_name} />
                                    <p className="seasonNamePopup">{data.seasons[season].season_name}</p>
                                </Link>
                            ))}
                        </div>
                        {data.bandeAnnonceUrl && (
                            <div className="containerTrailer">
                                <iframe className="trailerPopup" src={data.bande_annonce_url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        )}
                        {data.latest_id && (
                            <div className="popupButtons">
                                <Buttons icon={<IoPlayOutline />} text="Resume" onClick={() => navigate("/episode/"+data.latest_id)} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


export function PopupLibrary({ onClose }) {

    const [libraryType, setLibraryType] = useState("movies");
    const [libraryName, setLibraryName] = useState("");
    const [libraryFolder, setLibraryFolder] = useState("");
    const [allowedUsers, setAllowedUsers] = useState([]);

    const { handleSubmit } = usePost();
    
    const librariesTypes = [
        { value: "movies", text: "movies" },
        { value: "series", text: "series" },
        { value: "books", text: "books" },
        { value: "others", text: "others" },
        { value: "tv", text: "tv" },
        { value: "consoles", text: "consoles" },
    ];

    const handleUserToggle = (user) => {
        if (allowedUsers.includes(user)) {
            setAllowedUsers(allowedUsers.filter((u) => u !== user));
        } else {
            setAllowedUsers([...allowedUsers, user]);
        }
    };
    
    const addLibrary = async () => {
        const data = {
            libName: libraryName,
            libPath: libraryFolder,
            libType: libraryType,
            libUsers: allowedUsers,
        };
        await handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/createLib`,
            body: JSON.stringify(data),
        });
        Success({ message: `Library ${libraryName} created` });
        onClose();
    }
    
    const { data: users } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`);


    return (
        <div id="popup" className="popup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={onClose} />
            <div className="popupContent popupContentSettings">
                <div className="libraryTypeCheckbox">
                    {librariesTypes.map((type, index) => (
                        <div key={index} onClick={() => setLibraryType(type.value)} className={"libraryTypeCheckboxContainer" + (libraryType === type.value ? " libraryTypeCheckboxContainerActive" : "")}>
                            <div className="libraryTypeCheckboxIcon">
                                {librariesIcons[type.value]}
                                {type.text}
                            </div>
                        </div>
                    ))}     
                </div>
                <div className="libraryData">
                    <div className="libraryDataContainer">
                        <div className="libraryDataTitle">
                            <label htmlFor="title">Title: </label>
                            <input type="text" name="title" id="title" className="input" placeholder="Title" onChange={(e) => setLibraryName(e.target.value)} />
                        </div>
                        <div className="libraryDataFolder">
                            <label htmlFor="folder">Folder: </label>
                            <input type="text" name="folder" id="folder" className="input" placeholder="C:/..." onChange={(e) => setLibraryFolder(e.target.value)} />
                        </div>
                    </div>
                    <div className="libraryAllowedUsers">
                        <label htmlFor="allowedUsers">Allowed users</label>
                        <div className="libraryAllowedUsersContainer">
                            {users && users.map((user, index) => (
                                <div className="libraryAllowedUsersCheckbox" key={index} >
                                    <input type="checkbox" name="allowedUsers" id={"allowedUsers"+index} value={user.id} onChange={(e) => handleUserToggle(user.id)} />
                                    <label htmlFor={"allowedUsers"+index}>{user.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>                             
            </div>
            <Buttons text="Add" onClick={() => addLibrary()} style={{ position: "absolute", bottom: "20px", right: "20px" }} />
        </div>
    );
}