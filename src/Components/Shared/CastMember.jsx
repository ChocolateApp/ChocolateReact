export default function CastMember({ data }) {
    return (
        <div className="castMember">
            <img className="castImage" src={`${process.env.REACT_APP_DEV_URL}/${data[2]}`} alt={data[3]} title={data[0]} />
            <p className="castName">{data[0]}</p>
            <p className="castCharacter">{data[1]}</p>
        </div>
    )
}