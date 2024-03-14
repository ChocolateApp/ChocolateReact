import { useRef, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useParams, useLocation } from 'react-router-dom';

import { useLangage } from '../../Utils/useLangage';

export default function Search({ setUrl, setNotFound, keys=[] }) {
    const [searchClass, setSearchClass] = useState('text_input')

    const input = useRef(null)

    const { lib } = useParams()
    const libType = useLocation().pathname.split('/')[1]

    const { getLang } = useLangage()

    function search(e) {
        e.preventDefault()
        if (input.current.value === '') return
        setNotFound("Nous n'avons pas trouvé de résultat correspondant à votre recherche.")

        if (keys.length > 0) {
            const data = {}
            for (let key of keys) {
                data[key] = `${process.env.REACT_APP_DEV_URL}/search_${key}/${lib}/${input.current.value}`
            }
            setUrl(data)
        } else {
            setUrl(`${process.env.REACT_APP_DEV_URL}/search_${libType}/${lib}/${input.current.value}`)
        }
    }

    return (
        <form id="search_form" onSubmit={search}>
            <input
                placeholder={getLang("search_text")}
                type="input"
                id="search"
                className={searchClass}
                ref={input}
                onChange={(e) => {
                    if (e.target.value) {
                        setSearchClass('text_input text_input_active')
                    } else {
                        setSearchClass('text_input')
                    }
                }}
                />
            <button type="submit" className="button_search" id="button_search" onClick={search}>
                <IoSearchOutline className="search_icon" />
            </button>
        </form>
    )
}
