import Loading from "@/Components/Loading"
import MainMedia from "@/Components/Medias/MainMedia"
import MediaCarousel from "@/Components/Medias/MediaCarousel"
import NotFound from "@/Components/NotFound"
import { SearchContext } from "@/Contexts/SearchContext"
import { useGet } from "@/Hooks/useFetch"
import { useContext, useEffect, useState } from "react"

function Home() {
  const [url, setUrl] = useState<string>("")
  const [baseLoading, setBaseLoading] = useState<boolean>(true)
  const [searchLoading, setSearchLoading] = useState<boolean>(true)

  const { searchTerm } = useContext(SearchContext)
  const { data: searchData, loading: tempSearchLoading } = useGet(url) as { data: any, loading: boolean }
  const { data: homeData, loading: reqLoading, interupt } = useGet("/api/medias/home") as { data: any, loading: boolean, interupt: () => void }

  useEffect(() => {
    if (!reqLoading) {
      setTimeout(() => {
        setBaseLoading(false)
      }, 500)
    }
  }, [reqLoading])

  useEffect(() => {
    if (tempSearchLoading) {
      setSearchLoading(true)
    } else {
      setTimeout(() => {
        setSearchLoading(false)
      }, 500)
    }
  }, [tempSearchLoading])

  useEffect(() => {
    if (searchTerm === "" || searchTerm.length < 3) {
      setUrl("")
      return
    }
    setUrl(`/api/medias/search/home?search=${searchTerm}`)
  }, [searchTerm])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('query')
    if (query) {
      interupt()
      setUrl(`/api/medias/search/home?search=${query}`)
    }
  }, [])

  const keys = ["continue_watching", "latest", "recently_added", "top_rated", "best_of_year", "family", "comedy", "animated", "action", "thriller", "horror", "drama", "western"] as const

  //TODO:Replace that with a real language system
  const title = {
    continue_watching: "Continue Watching",
    latest: "Latest",
    recently_added: "Recently Added",
    top_rated: "Top Rated",
    best_of_year: "Best of the Year",
    family: "Family",
    comedy: "Comedy",
    animated: "Animated",
    action: "Action",
    thriller: "Thriller",
    horror: "Horror",
    drama: "Drama",
    western: "Western"
  }

  return (
    <>
      {<Loading className={"h-screen top-0 fixed bg-[--black] w-screen transition-all duration-300 pointer-events-none z-50 " + (baseLoading || searchLoading ? "opacity-100" : "opacity-0")} />}
      {!searchData && homeData && homeData.code === 201 && (
        <section className={`flex flex-col gap-8 pb-8 ${baseLoading || searchLoading ? "overflow-hidden" : ""}`}>
          <MainMedia media={homeData.data.main_media} />
          <section className="flex flex-col gap-8 pl-4 overflow-hidden">
            {keys.map((key, index) => (
              homeData.data[key]?.length > 0 && (
                <section key={key} className="flex flex-col gap-4 " style={{ zIndex: keys.length - index }}>
                  <h3 className="text-3xl font-bold">{title[key]}</h3>
                  <MediaCarousel medias={homeData.data[key]} index={keys.length - index} />
                </section>
              )
            ))}
          </section>
        </section>
      )}
      {searchData && searchData.data.main_media && searchData.code === 201 && (
        <section className={`flex flex-col gap-8 pb-8 ${baseLoading || searchLoading ? "overflow-hidden" : ""}`}>
          <MainMedia media={searchData.data.main_media} />
          <section className="flex flex-col gap-8 pl-4 overflow-hidden">
            <section className="flex flex-col gap-4">
              <h3 className="text-3xl font-bold">Results</h3>
              <MediaCarousel medias={searchData.data.medias} index={0} />
            </section>
          </section>
        </section>
      )}
      {((searchData && searchData.code !== 201) || (homeData && homeData.code !== 201)) && (
        <section className="h-screen flex justify-center items-center">
          <h1 className="text-4xl font-bold">No data found</h1>
          <p className="text-lg">Please try again later</p>
          <p className="text-lg">If you're the admin, ensure you have a library, and that you've scanned it.</p>
        </section>
      )}
    </>
  )
}

export default Home
