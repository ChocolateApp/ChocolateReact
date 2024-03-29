import { IoPencilOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function SerieCard({ name, library, onClick, note, id }) {

    const navigate = useNavigate();
    

    function toFixedIfNecessary( value, dp ){
        console.log(value);
        console.log(+parseFloat(value).toFixed(dp));
        return +parseFloat(value).toFixed(dp);
    }

    let percent = toFixedIfNecessary(note, 1);

    let hue;
        if (percent*10 < 50) {
            hue = percent*10 * 1.2; // Teinte allant de 0 à 60
        } else {
            hue = (percent*10 - 50) * 1.2 + 60; // Teinte allant de 60 à 120
    }

    let noteColor = `hsl(${hue}deg, 100%, 50%)`

    return (
        <div className="serie-card" onClick={onClick} data-aos="fade-up">
            <CircularProgressbar value={percent*10} text={`${percent}/10`}
                styles={buildStyles({
                pathColor: noteColor,
                textColor: '#fff',
                trailColor: 'transparent'
            })} />
            <IoPencilOutline className="edit-icon" onClick={() => navigate(`/edit_serie/${id}/${library}`)} />
            <img src={`${process.env.REACT_APP_DEV_URL}/serie_cover/${id}`} alt={name} loading="lazy" onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`}} />
        </div>
    );
}
