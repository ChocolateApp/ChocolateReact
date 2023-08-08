import { useRef, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useParams, useLocation } from 'react-router-dom';

export default function Search({ setUrl, setNotFound, keys=[] }) {

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const [searchClass, setSearchClass] = useState('text_input')

    const { lib } = useParams()

    const libType = capitalizeFirstLetter(useLocation().pathname.split('/')[1])

    const input = useRef(null)

    function search(e) {
        e.preventDefault()
        if (input.current.value === '') return
        setNotFound("Nous n'avons pas trouvé de résultat correspondant à votre recherche.")

        if (keys.length > 0) {
            const data = {}
            for (let key of keys) {
                data[key] = `${process.env.REACT_APP_DEV_URL}/search${capitalizeFirstLetter(key)}/${lib}/${input.current.value}`
            }
            setUrl(data)
        } else {
            setUrl(`${process.env.REACT_APP_DEV_URL}/search${libType}/${lib}/${input.current.value}`)
        }
    }

    return (
        <form id="search_form" onSubmit={search}>
            <input
                placeholder="Search"
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