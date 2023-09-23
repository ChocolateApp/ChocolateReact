import JustCog from "../Components/Shared/JustCog";
import { IoPencilOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Buttons from "../Components/Shared/Buttons";
import { usePost, useGet } from "../Utils/Fetch";
import { useLangage } from "../Utils/useLangage";

export default function Profil() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [image, setImage] = useState("");
    const [isHover, setIsHover] = useState(false);

    const { handleSubmit } = usePost()
    const { data: user } = useGet(`${process.env.REACT_APP_DEV_URL}/get_profil/${id}`)

    const { getLang } = useLangage()

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setImage(reader.result);
        };

        if (selectedImage) {
            reader.readAsDataURL(selectedImage);
        }
    };

    useEffect(() => {
        setName(localStorage.getItem("username"));
        setId(localStorage.getItem("id"));
        setImage(`${process.env.REACT_APP_DEV_URL}/user_image/${id}`);
    }, [id]);

    const saveProfil = () => {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/edit_profil`,
            body: {
                id: id,
                name: name,
                password: password,
                image: image,
            },
        });
    };

    return (
        <>
        {user && (
            <>
                <JustCog />
                <div className="profilDiv">
                    <div className="imageDiv">
                        {isHover && (
                            <div className="profilPictureHover">
                                <IoPencilOutline className="editProfilPicture" />
                            </div>
                        )}
                        <label htmlFor="uploadImage">
                            <img src={image} alt="profil" className="profilPicture" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} />
                        </label>
                        <input
                            id="uploadImage"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="profilInfos">
                        <input
                            type="text"
                            placeholder={getLang("username")}
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        { user?.account_type && user?.account_type !== "Kid" && (
                            <input
                                type="password"
                                placeholder={getLang("password")}
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="one-time-code"
                            />
                        )}
                        <Buttons text={getLang("save")} onClick={saveProfil} />
                    </div>
                </div>
            </>
        )}
        </>
    );
}
