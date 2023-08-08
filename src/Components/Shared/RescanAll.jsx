import Buttons from './Buttons';
import { IoRefreshOutline  } from 'react-icons/io5';
import { usePost } from "../../Utils/Fetch";

export default function AllLibraries() {

    const { handleSubmit } = usePost();

    function handleRescan() {
        handleSubmit({
            url: `${process.env.REACT_APP_DEV_URL}/rescan_all`,
            body: {},
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return (
        <>
            <h1>Rescan</h1>
            <Buttons text="Rescan all library" icon={<IoRefreshOutline  />} onClick={handleRescan} />
        </>
    );
}
