import { Link } from "react-router-dom"

export default function BookCard({ id, title, type, lib }) {

    return (
        <Link className="book-card" to={type === "folder" ? `/books/${lib}-${title}` : `/book/${id}`} data-aos="fade-up">
            <img src={`${process.env.REACT_APP_DEV_URL}/book_cover/${id}`} alt={title} className="bookCover" loading="lazy" />
            <p>{title}</p>
        </Link>
    )
}
