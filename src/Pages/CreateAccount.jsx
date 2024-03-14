import { useEffect, useState } from 'react';
import { useGet } from '../Utils/Fetch';
import { useParams, useNavigate } from 'react-router-dom';
import CreateAccountCard from '../Components/Shared/CreateAccountCard';

export default function CreateAccount({ admin_only=false, shared=true }) {
    const { key } = useParams();
    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/invite_exist/${key}`)

    const { data: invite_exist } = useGet(url)

    const navigate = useNavigate();

    useEffect(() => {
        if (shared && key !== undefined){
            setUrl(`${process.env.REACT_APP_DEV_URL}/invite_exist/${key}`)
        } else if (!key) {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [shared, key])

    useEffect(() => {
        if (invite_exist === false) {
            navigate('/login')
        }
    }, [invite_exist, navigate])

    console.log(admin_only, invite_exist, shared, key)

    return (
        <>
            <div className="create-account">
                <CreateAccountCard default_type={admin_only ? 'admin' : 'adult'} />
            </div>
        </>
    )
}
