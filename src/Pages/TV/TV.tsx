import Loading from "@/Components/Loading"
import TVMainMedia from "@/Components/Medias/TVMainMedia"
import TVMedia from "@/Components/Medias/TVMedia"
import { SearchContext } from "@/Contexts/SearchContext"
import { useGet } from "@/Hooks/useFetch"
import { useContext, useEffect, useState } from "react"


function TV() {
  const [url, setUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const { searchTerm } = useContext(SearchContext)
  const { data: searchData } = useGet(url) as { data: any }
  const { data: homeData, interupt } = useGet("/api/medias/tv") as { data: any, loading: boolean, interupt: () => void }

  useEffect(() => {
    if (homeData || searchData) {
      setTimeout(() => {
        setLoading(false)
      }, 500
      )
    }
  }, [homeData])

  useEffect(() => {
    if (searchTerm === "" || searchTerm.length < 3) {
      setUrl("")
      return
    }
    setUrl(`/api/medias/search/tv?search=${searchTerm}`)
  }, [searchTerm])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('query')
    if (query) {
      interupt()
      setUrl(`/api/medias/search/movies?search=${query}`)
    }
  }, [])


  return (
    <>
      {<Loading className={"h-screen top-0 fixed bg-[--black] w-screen transition-all duration-300 pointer-events-none z-50 " + (loading ? "opacity-100" : "opacity-0")} />}
      {!searchData && homeData && (
        <section className={`flex flex-col gap-8 pb-8 ${loading ? "overflow-hidden" : ""}`}>
          <TVMainMedia media={homeData.data.medias[0]} />
          <section className="flex flex-col gap-8 pl-4 pr-4 overflow-hidden">
            <section className="flex flex-col gap-4">
              <h3 className="text-3xl font-bold">Results</h3>
              <section className="grid grid-cols-4 gap-4">
                {homeData.data.medias.slice(1).map((media: any, index: number) => (
                  <TVMedia media={media} key={index} />
                ))
                }
              </section>
            </section>
          </section>
        </section>
      )}
    </>
  )
}

export default TV