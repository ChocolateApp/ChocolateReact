import { useState, useEffect } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

import { Dropdown, DropdownMultiple } from './Dropdown';
import Buttons from './Buttons';

import { usePost } from "../../Utils/Fetch";
import { useLangage } from '../../Utils/useLangage';

export default function LibraryCard({ library, refreshAllLibraries, users }) {

    const [newName, setNewName] = useState("");
    const [newPath, setNewPath] = useState("");
    const [newType, setNewType] = useState("");
    const [newMergeParent, setNewMergeParent] = useState("");
    const [selectedUsers, setSelectedUsers] = useState(library?.available_for?.toString().split(',') || []);

    const { handleSubmit } = usePost();

    const { getLang } = useLangage();

    const librariesTypes = [
        { value: "movies", text: "movies" },
        { value: "series", text: "series" },
        { value: "books", text: "books" },
        { value: "others", text: "others" },
        { value: "tv", text: "tv" },
        { value: "consoles", text: "consoles" },
    ];

    useEffect(() => {
        setNewName(library.lib_name);
        setNewPath(library.lib_folder);
        setNewType(library.lib_type);
        setNewMergeParent(library.merge_parent);
        console.log(library);
    }, [library]);

    const deleteLibrary = (libName) => {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/delete_library`,
            body: {
                name: libName
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        refreshAllLibraries();
    };

    const setAllUsers = (users) => {
        setSelectedUsers(users);
    };

    const saveLibrary = async (actualPath) => {
        console.log(selectedUsers);
        let users = selectedUsers;
        for (let i = 0; i < users.length; i++) users[i] = parseInt(users[i]);
        users = selectedUsers.length > 0 ? selectedUsers.join(',') : null;

        const body = {
            default_path: actualPath,
            name: newName,
            path: newPath,
            type: newType,
            merge_parent: newMergeParent || null,
            users: users,
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
            <h3>{library.lib_name}</h3>
            <input type="text" value={newName} className="input" onChange={(e) => setNewName(e.target.value)} />
            <input type="text" value={newPath} className="input" onChange={(e) => setNewPath(e.target.value)} />
            <Dropdown name="type" placeholder="Type" elements={librariesTypes} setValue={setNewType} defaultValue={library.lib_type} title={"Type"} />
            {library.possible_merge_parent && <Dropdown name="merge" placeholder="Merge" elements={[{ value: null, text: "No merge" }, ...library.possible_merge_parent]} setValue={setNewMergeParent} defaultValue={library.merge_parent} dropdownText={"Select lib to merge with"} title={"Merge width"} />}
            {users && <DropdownMultiple name="users" placeholder="Users" elements={users} setValue={setAllUsers} dropdownText={"Select allowed users"} defaultValue={library.available_for !== null ? library.available_for.toString().split(',') : []} />}
            <div className="buttons">
                <Buttons text={getLang("save")} type="button-small" onClick={() => saveLibrary(library.lib_folder)} />
                <Buttons icon={<IoTrashOutline />} text={getLang("delete")} type="button-delete button-small" onClick={() => deleteLibrary(library.lib_name)} />
            </div>
        </div>
    );
}
