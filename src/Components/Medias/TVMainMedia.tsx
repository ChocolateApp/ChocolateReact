
import { HomeMedias } from "@/Types"
import Button from "@/Components/Button"
import { GoPlay } from "react-icons/go"

const TVMainMedia = ({ media }: { media: HomeMedias["main_media"] }) => {
    console.log(media)
    return (
        <section className="h-[85dvh] bg-cover bg-center flex items-end" style={{ backgroundImage: `linear-gradient(var(--black), transparent, var(--black)), linear-gradient(90deg, var(--black) 5%, transparent), url(${import.meta.env.VITE_API_URL}/api/medias/images/banner/${media.type}/${media.banner_id})` }}>
            <section className="px-4 flex flex-col gap-4 w-3/4">
                {media.have_logo ? (<img src={media.images.logo} alt={media.title} className="h-48 object-contain rounded-md w-fit" />) : <h1 className="text-5xl font-bold">{media.serie_title ?? media.title}</h1>}
                <p>{media.description}</p>
                <section className="flex gap-4">
                    <Button to={`/watch/${media.type}/${media.id}`} iconBefore={<GoPlay />} state="primary">Watch Now</Button>
                </section>
            </section>
        </section>
    )
}

export default TVMainMedia