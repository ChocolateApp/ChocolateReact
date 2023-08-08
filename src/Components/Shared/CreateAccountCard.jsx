import { usePost } from '../../Utils/Fetch';
import { useState } from 'react';
import { Dropdown } from '../Shared/Dropdown';
import { Error, Success } from '../Shared/Notifications';

export default function CreateAccountCard() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit } = usePost();

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

        try {
            const imageBase64 = await convertImageToBase64(profilePicture);
            
            if (username === "") {
                Error({ message: "You must enter a username" });
                return;
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
            <h1>Create Account</h1>
            <div className="formUsername">
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" placeholder="Username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="formPassword">
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="formType">
                <label htmlFor="type">Type: </label>
                <Dropdown name="type" placeholder="Type" elements={accountsTypes} setValue={setType} />
            </div>
            <div className="formProfilePicture">
                <label htmlFor="profilePicture">Profile Picture: </label>
                <input type="file" name="profilePicture" placeholder="Profile Picture" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </div>
            <input type="submit" value="Create Account" className="button" disabled={isLoading} onClick={handleFormSubmit} />
        </div>
    );
}
