export default function GameCard({ title, cover, onClick }) {
    
    return (
        <div className="game-card" onClick={onClick} data-aos="fade-up">
            <img src={cover} alt={title} 
                onError={({ currentTarget }) => {
                    currentTarget.onerror=null; // prevents looping
                    currentTarget.src=`${process.env.REACT_APP_DEV_URL}/static/img/broken.webp`
                }}
            />
            <p>{title}</p>
        </div>
    );
}