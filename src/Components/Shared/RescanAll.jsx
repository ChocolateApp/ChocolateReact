import Buttons from './Buttons';
import { IoRefreshOutline } from 'react-icons/io5';

import { usePost } from "../../Utils/Fetch";
import { useLangage } from '../../Utils/useLangage';

export default function AllLibraries() {

    const { handleSubmit } = usePost();

    const { getLang } = useLangage();

    function handleRescan() {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/rescan_all`,
            body: {},
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    function handleIntroDetection() {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/start_intro_detection`,
            body: {},
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }


    return (
        <>
            <h1>{getLang("rescan")}</h1>
            <Buttons text={getLang("rescan_all_lib")} icon={<IoRefreshOutline />} onClick={handleRescan} />
            <h1>{getLang("intro_detection")}</h1>
            <Buttons text={getLang("start_intro_detection")} onClick={handleIntroDetection} />
        </>
    );
}
