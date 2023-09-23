import { useIsAdmin } from '../Utils/useIsAdmin';
import { useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { useGet, usePost } from "../Utils/Fetch"

export default function EditSerie() {

    useIsAdmin()

    const { id, lib } = useParams()
    const inputRef = useRef()
    const navigate = useNavigate()

    const { data: series } = useGet(`${process.env.REACT_APP_DEV_URL}/edit_serie/${id}/${lib}`)
    
    const { handleSubmit } = usePost()

    const handleEdit = (newId, lib) => {
        let url = `${process.env.REACT_APP_DEV_URL}/edit_serie/${id}/${lib}`
        console.log(url)
        handleSubmit({url, body: {new_id: newId}})
        navigate(`/series/${lib}`)
    }

    return (
        <>
            <h1>Edit Serie {series?.folder_title || id} from {lib}</h1>

            <div className="series edit-series">
                {series && series.series.length > 0 && (
                    series.series.map((serie, index) => (
                        <div className="edit-serie" key={index} onClick={() => handleEdit(serie.id, lib)}>
                            <img src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${serie.poster_path}`} alt={serie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                            <h3>{serie.name} {serie.first_air_date && `(${serie.first_air_date.slice(0, 4)})`}</h3>
                        </div>
                    ))
                )}
                <div class="edit-serie edit-serie-custom">
                    <h3>Custom ID</h3>
                    <input type="text" placeholder="New ID" ref={inputRef} className='input' />
                    <button onClick={() => handleEdit(inputRef.current.value, lib)} className='button small'>Submit</button>
                </div>
            </div>
        </>
    )
}
