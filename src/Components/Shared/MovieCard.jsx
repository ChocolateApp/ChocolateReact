import { IoPencilOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function MovieCard({ name, library, onClick, note, vues, duration, id, isAdmin }) {

    const navigate = useNavigate();
    
    const username = localStorage.getItem('username')

    function toFixedIfNecessary( value, dp ){
        return +parseFloat(value).toFixed( dp );
    }

    let percent = toFixedIfNecessary(note, 1)*10

    let hue;
        if (percent < 50) {
            hue = percent * 1.2; // Teinte allant de 0 à 60
        } else {
            hue = (percent - 50) * 1.2 + 60; // Teinte allant de 60 à 120
    }

    let noteColor = `hsl(${hue}deg, 100%, 50%)`

    vues = [username]

    let hours = duration.split(':')[0]
    let minutes = duration.split(':')[1]
    let seconds = duration.split(':')[2]

    let durationInSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)
    let timeline = 0
    if (vues) {
        timeline = Math.round((vues / durationInSeconds)*100)
    }

    return (
        <div className="movie-card" onClick={onClick} data-aos="fade-up">
            <CircularProgressbar value={percent} text={`${percent/10}/10`}
                styles={buildStyles({
                pathColor: noteColor,
                textColor: '#fff',
                trailColor: 'transparent'
            })} />
            { isAdmin && (
                <IoPencilOutline className="edit-icon" onClick={() => navigate(`/edit_movie/${id}/${library}`)} />
            )}
            <img src={`${process.env.REACT_APP_DEV_URL}/movie_cover/${id}`} alt={name} loading="lazy" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
            { timeline > 0 && (
                <div className="timeLineBackground">
                    <div className="timeLine" style={{width: `${timeline}%`}}></div>
                </div>
            )}
        </div>
    );
}
