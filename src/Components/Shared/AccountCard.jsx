import { useState } from 'react';
import { Dropdown } from './Dropdown';
import Buttons from './Buttons';
import { usePost } from "../../Utils/Fetch";
import { IoTrashOutline } from 'react-icons/io5';
import { useEffect } from 'react';

export default function AccountCard({ account, refreshAllAccounts }) {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("");

    const accountsTypes = [
        { value: "admin", text: "Admin" },
        { value: "adult", text: "Adult" },
        { value: "teen", text: "Teen" },
        { value: "kid", text: "Kid" }
    ];

    const typeToName = {
        "Admin": "admin",
        "Adult": "adult",
        "Teen": "teen",
        "Kid": "kid"
    };

    const { handleSubmit } = usePost();

    useEffect(() => {
        setName(account.name);
        setType(account.account_type);
    }, [account]);
    
    const deleteAccount = async (id) => {
        await handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/delete_account`,
            body: {
                id: id
            }
        });
        refreshAllAccounts();
    };

   
    const saveAccount = async (id) => {
        const body = {
            id: id,
            username: name,
            password: password,
            type: type
        };

        await handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/edit_profil`,
            body: body
        });
        refreshAllAccounts();
    };

    return (
        <div className="account-setting" key={account.id}>
            <h3>{account.name}</h3>
            <input type="text" value={name} className="input" onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="New password" className="input" onChange={(e) => setPassword(e.target.value)} />
            <Dropdown name="type" placeholder="Type" elements={accountsTypes} setValue={setType} defaultValue={typeToName[type]} defaultText={type} />
            <div className="buttons">
                <Buttons text="Save" type="button-small" onClick={() => saveAccount(account.id)} />
                <Buttons icon={<IoTrashOutline />} text="Delete" type="button-delete button-small" onClick={() => deleteAccount(account.id)} />
            </div>
        </div>
    );
}