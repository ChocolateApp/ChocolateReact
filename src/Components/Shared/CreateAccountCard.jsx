import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dropdown } from '../Shared/Dropdown';
import { Error, Success } from '../Shared/Notifications';

import { usePost } from '../../Utils/Fetch';
import { useLangage } from '../../Utils/useLangage';

export default function CreateAccountCard({ default_type=null }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit } = usePost();
    const { getLang } = useLangage();
    const navigate = useNavigate();

    function convertImageToBase64(file) {
        if (!(file instanceof Blob)) {
            return null;
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        if (default_type) {
            setType(default_type);
        }

        try {
            const imageBase64 = await convertImageToBase64(profilePicture);
            
            if (username === "") {
                Error({ message: "You must enter a username" });
                return;
            } else if (type === "" && default_type !== null) {
                setType(default_type);
            } else if (type === "") {
                Error({ message: "You must select a type" });
                return;
            }

            if (type === "admin" && password === "") {
                return;
            }

            const data = {
                username: username,
                password: password,
                type: type,
                profilePicture: imageBase64 ? imageBase64 : null,
            };
    
            await handleSubmit({
                url: `${process.env.REACT_APP_DEV_URL}/create_account`,
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Réinitialiser les valeurs après l'envoi de la requête
            setUsername("");
            setPassword("");
            setType("");
            Success({ message: "Account created successfully" });


            if (default_type !== null) {
                navigate('/');
            }
            //envoyer une update pour refresh la liste des comptes
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const accountsTypes = [
        { value: "admin", text: "Admin" },
        { value: "adult", text: "Adult" },
        { value: "teen", text: "Teen" },
        { value: "kid", text: "Kid" }
    ];

    return (
        <div className="create-account-card" >
            <h1>{getLang("create_account")}</h1>
            <div className="formUsername">
                <label htmlFor="username">{getLang("username")}: </label>
                <input type="text" name="username" placeholder={getLang("username")} className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            { type !== "kid" ? (
            <div className="formPassword">
                <label htmlFor="password">{getLang("password")}: </label>
                <input type="password" name="password" placeholder={getLang("password")} className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            ) : null }
            { !default_type ? (
            <div className="formType">
                <label htmlFor="type">{getLang("account_type")}: </label>
                <Dropdown name="type" elements={accountsTypes} setValue={setType} />
            </div> ) : null }
            <div className="formProfilePicture">
                <label htmlFor="profilePicture">{getLang("profile_pic")}: </label>
                <input type="file" name="profilePicture" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </div>
            <input type="submit" value={getLang("create_account")} className="button" disabled={isLoading} onClick={handleFormSubmit} />
        </div>
    );
}
