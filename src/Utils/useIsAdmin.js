
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGet } from './Fetch';

export function useIsAdmin() {
    const navigate = useNavigate();

    const { data: isAdmin } = useGet(`${process.env.REACT_APP_DEV_URL}/is_admin`);

    useEffect(() => {
        if (isAdmin !== null && !isAdmin) {
            navigate('/');
        }
    }, [navigate, isAdmin]);
}
