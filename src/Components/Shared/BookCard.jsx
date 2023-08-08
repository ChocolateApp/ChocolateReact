import { Link } from "react-router-dom"

export default function BookCard({ id, title, url, type, lib }) {

    return (
        <Link className="book-card" to={type === "folder" ? `/books/${lib}-${title}` : `/book/${id}`} data-aos="fade-up">
            <img src={url} alt={title} className="bookCover" loading="lazy" />
            <p>{title}</p>
        </Link>
    )
}