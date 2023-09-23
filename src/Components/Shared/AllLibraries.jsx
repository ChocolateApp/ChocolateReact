import { useEffect, useState } from "react";
import { IoAddCircleOutline } from 'react-icons/io5';

import Buttons from './Buttons';
import { PopupLibrary } from "./Popup";
import LibraryCard from "./LibraryCard";

import { useGet } from "../../Utils/Fetch";
import { useLangage } from '../../Utils/useLangage';

export default function AllLibraries() {
    const [popupVisible, setPopupVisible] = useState(false);

    const { data: libraries, fetchData : refreshAllLibraries} = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_libraries_created`);
    const { data: users } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`);

    const { getLang } = useLangage();

    useEffect(() => {
        console.log(libraries);
    }, [libraries])

    return (
        <>
        <h1>{getLang("libraries")}</h1>
        <div className="all-libraries">
            {libraries && libraries.map((library) => {
                return (
                    <LibraryCard key={library.id} library={library} refreshAllLibraries={refreshAllLibraries} users={users} />
                )
            })}
            <div className="library-setting" style={{ rowGap: "8vh" }}>
                <h3>{getLang("create_new_lib")}</h3>
                <Buttons icon={<IoAddCircleOutline />} text={getLang("add")} type="button-add button-small" onClick={() => setPopupVisible(true)} />
            </div>
        </div>
        {popupVisible && <PopupLibrary onClose={() => setPopupVisible(false)} refreshAllLibraries={refreshAllLibraries} users={users} />}
        </>
    );
}
