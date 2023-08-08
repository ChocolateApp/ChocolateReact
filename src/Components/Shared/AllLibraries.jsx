import { useEffect, useState } from "react";
import Buttons from './Buttons';
import { useGet } from "../../Utils/Fetch";
import { PopupLibrary } from "./Popup";
import LibraryCard from "./LibraryCard";
import { IoAddCircleOutline } from 'react-icons/io5';

export default function AllLibraries() {
    
    const [popupVisible, setPopupVisible] = useState(false);

    const { data: libraries, fetchData : refreshAllLibraries} = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_libraries`);

    useEffect(() => {
        console.log(libraries);
    }, []);

    return (
        <>
        <h1>Libraries</h1>
        <div className="all-libraries">
            {Array.isArray(libraries) && libraries.map((library) => {
                return <LibraryCard library={library} refreshAllLibraries={refreshAllLibraries} />
            })}
            <div className="library-setting" style={{ rowGap: "8vh" }}>
                <h3>Add a library</h3>
                <Buttons icon={<IoAddCircleOutline />} text="Add" type="button-add button-small" onClick={() => setPopupVisible(true)} />
            </div>
        </div>
        {popupVisible && <PopupLibrary onClose={() => setPopupVisible(false)} />}
        </>
    );
}
