import { IoCloseOutline, IoPlayOutline, IoDownloadOutline } from "react-icons/io5";
import { useNavigate, Link  } from "react-router-dom";
import { useState } from "react";

import { useGet, usePost } from "../../Utils/Fetch";

import { librariesIcons } from "./LibrariesIcons";
import Loading from "./Loading";
import Buttons from "./Buttons";
import CastMember from "./CastMember";
import { Success } from './Notifications';
import { useLangage } from "../../Utils/useLangage";

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
            {data ? (
                <div className="popupContent">
                    <div className="popup-left">
                        <img src={`${process.env.REACT_APP_DEV_URL}/movie_cover/${data.id}`} alt={data.real_title} className="coverPopup" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                    </div>
                    <div className="popup-right">
                        <p className="titlePopup">{data.real_title}</p>
                        <p className="descriptionPopup">{data.description}</p>
                        <div className="containerPopup">
                            <p className="notePopup">Note: {data.note}</p>
                            <p className="yearPopup">Date: {data.date}</p>
                            <p className="genrePopup">Genres: {data.genre}</p>
                            <p className="durationPopup">Durée: {data.duration}</p>
                        </div>
                        <div className="containerCast">
                            <div className="castPopup" id="castPopup">
                            {(data.cast.split(",")).map((id, index) => (
                                <CastMember id={id} key={index} />
                            ))}
                            </div>
                        </div>
                        <div className="containerSeasons"></div>
                        <div className="containerSimilar">
                            {data.similar && (data.similar.map((movie, index) => (
                                <img className="similarPopup" src={`${process.env.REACT_APP_DEV_URL}/${movie.cover}`} alt={movie.title} title={movie.title} key={index} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                            )))}
                        </div>
                        {data.bande_annonce_url && (
                            <div className="containerTrailer">
                                <iframe className="trailerPopup" src={data.bande_annonce_url} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        )}
                        <div className="popupButtons">
                            <Buttons icon={<IoPlayOutline />} text="Watch now" onClick={playMovie} />
                            <Buttons icon={<IoDownloadOutline />} text="Download" onClick={downloadMovie} />
                        </div>
                    </div>
                </div>
            ) : <Loading />}
        </div>
    );
}

export function PopupSerie({ onClose, id }) {

    const { data } = useGet(`${process.env.REACT_APP_DEV_URL}/get_serie_data/${id}`);

    const navigate = useNavigate();

    return (
        <div id="popup" className="popup">
            <IoCloseOutline className="crossPopup" id="crossPopup" onClick={onClose} />
            {data ? (
                <div className="popupContent">
                    <div className="popup-left">
                        <img src={`${process.env.REACT_APP_DEV_URL}/serie_cover/${id}`} alt={data.title} className="coverPopup" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                    </div>
                    <div className={`popup-right ${data.latest_id ? "popup-serie-right" : ""}`}>
                        <p className="titlePopup">{data.name}</p>
                        <p className="descriptionPopup">{data.description}</p>
                        <div className="containerPopup">
                            <p className="notePopup">Note: {data.note}</p>
                            <p className="yearPopup">Date: {data.date}</p>
                            <p className="genrePopup">Genres: {data.genre}</p>
                        </div>
                        <div className="containerCast">
                            <div className="castPopup" id="castPopup">
                            {(data.cast.split(",")).map((id, index) => (
                                <CastMember id={id} key={index} />
                            ))}
                            </div>
                        </div>
                        <div className="containerSeasons" style={{ marginBottom: data.bande_annonce_url ? "auto" : "100px" }}>
                            {data.seasons && Object.keys(data.seasons).map((season, index) => (
                                <Link to={"/season/"+data.seasons[season].season_id} key={index}>
                                    <img className="seasonPopup" src={`${process.env.REACT_APP_DEV_URL}/season_cover/${data.seasons[season].season_id}`} alt={data.seasons[season].season_name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
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
            ) : <Loading />}
        </div>
    );
}


export function PopupLibrary({ onClose, refreshAllLibraries }) {

    const { getLang } = useLangage();

    const [libraryType, setLibraryType] = useState("movies");
    const [libraryName, setLibraryName] = useState("");
    const [libraryFolder, setLibraryFolder] = useState("");
    const [allowedUsers, setAllowedUsers] = useState([]);

    const { handleSubmit } = usePost();
    
    const librariesTypes = [
        { value: "movies", text: getLang("movies") },
        { value: "series", text: getLang("series") },
        { value: "books", text: getLang("books") },
        { value: "others", text: getLang("other") },
        { value: "tv", text: getLang("tv_channels") },
        { value: "consoles", text: getLang("consoles") },
        { value: "musics", text: getLang("musics") },
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
            lib_name: libraryName,
            lib_path: libraryFolder,
            lib_type: libraryType,
            lib_users: allowedUsers.join(","),
        };
        await handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/create_library`,
            body: JSON.stringify(data),
        });
        Success({ message: `Library ${libraryName} created` });
        onClose();
        refreshAllLibraries();
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
