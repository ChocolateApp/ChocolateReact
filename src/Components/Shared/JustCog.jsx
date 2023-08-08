import HeaderCog from "./HeaderCog";

export default function JustCog() {
    return (

        <div className="search_and_div">
            {localStorage.getItem('account_type').toLowerCase() === "admin" ? <HeaderCog /> : null}
        </div>
    )
}