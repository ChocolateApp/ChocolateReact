import HeaderCog from "./HeaderCog";
import Search from "./Search";

export default function SearchAndCog({ setUrl, setNotFound, keys=[] }) {
    return (

        <div className="search_and_div">
            <Search setUrl={setUrl} setNotFound={setNotFound} keys={keys} />
            {localStorage.getItem('account_type')?.toLowerCase() === "admin" ? <HeaderCog /> : null}
        </div>
    )
}
