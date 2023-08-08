export default function Buttons({ icon, text, onClick, type="", style={} }) {
    return (
        <button className={`button ${type}`} onClick={onClick} style={style}>
            {icon}
            <p>{text}</p>
        </button>
    )
}
