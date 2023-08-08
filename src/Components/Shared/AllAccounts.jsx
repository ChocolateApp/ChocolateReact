import { useGet } from "../../Utils/Fetch";
import AccountCard from "./AccountCard";

export default function AllAccounts({ fetchData }) {


    const { data: accounts, fetchData : refreshAllAccounts} = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`);

    return (
        <>
        <h1>Accounts</h1>
        <div className="all-accounts">
            {accounts && accounts.map((account) => {
                return <AccountCard account={account} refreshAllAccounts={refreshAllAccounts} key={account.id} />
            })}
        </div>
        </>
    );
}
