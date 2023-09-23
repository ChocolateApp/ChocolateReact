import { useParams } from "react-router-dom"
import { useGet } from "../Utils/Fetch";
import { useEffect, useState } from "react";

import SearchAndCog from "../Components/Shared/SearchAndCog";
import BookCard from "../Components/Shared/BookCard";
import Loading from "../Components/Shared/Loading";

export default function Books() {  
    const { lib } = useParams();

    const [url, setUrl] = useState(`${process.env.REACT_APP_DEV_URL}/get_all_books/${lib}`)
    const [notFound, setNotFound] = useState(<Loading />)

    const { data: books } = useGet(url)

    useEffect(() => {
        setUrl(`${process.env.REACT_APP_DEV_URL}/get_all_books/${lib}`)
    }, [lib])

    return (
        <>  
        <SearchAndCog setUrl={setUrl} setNotFound={setNotFound} />
        <div className="books">
            {Array.isArray(books) ? books.map(book => (
                <BookCard id={book.id} title={book.title} url={`${process.env.REACT_APP_DEV_URL}/${book.cover}`} type={book.book_type} lib={lib} />
            )) : notFound }
        </div>
        </>
    )
}
