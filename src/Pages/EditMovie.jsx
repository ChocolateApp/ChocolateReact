import { useIsAdmin } from '../Utils/useIsAdmin';
import { useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom"
import { useGet, usePost } from "../Utils/Fetch"

export default function EditMovie() {

    useIsAdmin()

    const { id, lib } = useParams()
    const inputRef = useRef()
    const navigate = useNavigate()

    const { data: movies } = useGet(`${process.env.REACT_APP_DEV_URL}/edit_movie/${id}/${lib}`)
    
    const { handleSubmit } = usePost()

    const handleEdit = (newId, lib) => {
        let url = `${process.env.REACT_APP_DEV_URL}/edit_movie/${id}/${lib}`
        console.log(url)
        handleSubmit({url, body: {new_id: newId}})
        navigate(`/movies/${lib}`)
    }

    return (
        <>
            <h1>Edit Movie {movies?.file_title || id} from {lib}</h1>

            <div className="movies edit-movies">
                {movies && movies.movies.length > 0 && (
                    movies.movies.map((movie, index) => (
                        <div className="edit-movie" key={index} onClick={() => handleEdit(movie.id, lib)}>
                            <img src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
                            <h3>{movie.title} {movie.release_date && `(${movie.release_date.slice(0, 4)})`}</h3>
                        </div>
                    ))
                )}
                <div class="edit-movie edit-movie-custom">
                    <h3>Custom ID</h3>
                    <input type="text" placeholder="New ID" ref={inputRef} className='input' />
                    <button onClick={() => handleEdit(inputRef.current.value, lib)} className='button small'>Submit</button>
                </div>
            </div>
        </>
    )
}
