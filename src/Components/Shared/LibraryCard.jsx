import { useState } from 'react';
import { Dropdown, DropdownMultiple } from './Dropdown';
import Buttons from './Buttons';
import { usePost, useGet } from "../../Utils/Fetch";
import { IoTrashOutline } from 'react-icons/io5';
import { useEffect } from 'react';

export default function LibraryCard({ library, refreshAllLibraries }) {

    const [newName, setNewName] = useState("");
    const [newPath, setNewPath] = useState("");
    const [newType, setNewType] = useState("");

    const { handleSubmit } = usePost();

    const librariesTypes = [
        { value: "movies", text: "movies" },
        { value: "series", text: "series" },
        { value: "books", text: "books" },
        { value: "others", text: "others" },
        { value: "tv", text: "tv" },
        { value: "consoles", text: "consoles" },
    ];

    const { data: users } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`);

    useEffect(() => {
        setNewName(library.libName);
        setNewPath(library.libFolder);
        setNewType(library.libType);
    }, [library]);

    const deleteLibrary = (libName) => {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/delete_library`,
            body: {
                libName: libName
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        refreshAllLibraries();
    };

    const saveLibrary = async (actualPath) => {
        const body = {
            defaultPath: actualPath,
            name: newName,
            path: newPath,
            type: newType,
        };

        await handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/edit_library`,
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        refreshAllLibraries();
    };

    return (
        <div className="library-setting" key={library.id}>
            <h3>{library.libName}</h3>
            <input type="text" value={newName} className="input" onChange={(e) => setNewName(e.target.value)} />
            <input type="text" value={newPath} className="input" onChange={(e) => setNewPath(e.target.value)} />
            <Dropdown name="type" placeholder="Type" elements={librariesTypes} setValue={setNewType} defaultValue={library.libType} />
            {users && <DropdownMultiple name="users" placeholder="Users" elements={users} />}
            <div className="buttons">
                <Buttons text="Save" type="button-small" onClick={() => saveLibrary(library.libFolder)} />
                <Buttons icon={<IoTrashOutline />} text="Delete" type="button-delete button-small" onClick={() => deleteLibrary(library.libName)} />
            </div>
        </div>
    );
}