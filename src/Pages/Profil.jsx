import JustCog from "../Components/Shared/JustCog";
import { IoPencilOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Buttons from "../Components/Shared/Buttons";
import { usePost } from "../Utils/Fetch";

export default function Profil() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [image, setImage] = useState("");
    const [isHover, setIsHover] = useState(false);

    const { handleSubmit } = usePost()

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
        setImage(`${process.env.REACT_APP_DEV_URL}/get_profil_picture/${id}`);
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
                        placeholder="Nom"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    { localStorage.getItem("account_type") && localStorage.getItem("account_type").toLowerCase() !== "kid" && (
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="one-time-code"
                        />
                    )}
                    <Buttons text={"Enregistrer"} onClick={saveProfil} />
                </div>
            </div>
        </>
    );
}
