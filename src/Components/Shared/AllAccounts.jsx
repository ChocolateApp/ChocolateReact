import { IoAddOutline } from "react-icons/io5";

import AccountCard from "./AccountCard";
import Buttons from "./Buttons";

import { useGet } from "../../Utils/Fetch";
import { useLangage } from "../../Utils/useLangage";

export default function AllAccounts({ fetchData }) {
    const { data: accounts, fetchData : refreshAllAccounts} = useGet(`${process.env.REACT_APP_DEV_URL}/get_all_users`);

    const { getLang } = useLangage();

    return (
        <>
        <h1>{getLang("users")}</h1>
        <div className="all-accounts">
            {accounts && accounts.map((account) => {
                return <AccountCard account={account} refreshAllAccounts={refreshAllAccounts} key={account.id} />
            })}
            <div className="account-setting invite-account" style={{ rowGap: "8vh" }}>
                <h3>{getLang("invite")}</h3>
                <Buttons text={"Invite"} icon={<IoAddOutline />} type="button-small" />
            </div>
        </div>
        </>
    );
}
