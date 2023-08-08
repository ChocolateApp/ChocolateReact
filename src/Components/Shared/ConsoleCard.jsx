export default function ConsoleCard({ short_name, name, image, onClick }) {
    
    return (
        <div className="consoles-card" onClick={onClick} data-aos="fade-up">
            <img src={image} alt={name} loading="lazy"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`
                }}
            />
            <p>{name}</p>
        </div>
    );
}