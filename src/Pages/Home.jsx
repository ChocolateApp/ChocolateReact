import { HomeCard } from "../Components/Shared/HomeCard";
import JustCog from '../Components/Shared/JustCog';
import Loading from '../Components/Shared/Loading';
import { useGet } from "../Utils/Fetch";

export default function Home() {
    const { data: allLibraries } = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_libraries`)

    return (
        <>
            <JustCog />
            <div className='cards'>

                {Array.isArray(allLibraries) ? allLibraries.map((library) =>

                    <HomeCard name={library.lib_name} 
                              type={library.lib_type}
                               key={`${library.lib_type}-${library.lib_name}`}
                      />

                ) : <Loading />}

            </div>
        </>
    );
}
