import React, { useEffect, useState } from 'react';
import { useDelete, useGet, usePost, usePut } from "@/Hooks/useFetch";
import Button from "@/Components/Button";
import Loading from "@/Components/Loading";

interface Account {
    id: number;
    name: string;
    password?: string;
    account_type: 'Admin' | 'Adult' | 'Teen' | 'Kid';
}

const NEW_ACCOUNT_ID = -161

const AccountsSettings: React.FC = () => {

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: accountsData, loading: accountsLoading, fetchData } = useGet('/api/settings/accounts');
    const { handleSubmit } = usePost();
    const { handleSubmit: handleDelete } = useDelete();
    const { handleSubmit: handleCreate } = usePut();

    useEffect(() => {
        if (accountsData && accountsData.data) {
            setAccounts(accountsData.data);
        }
        setLoading(accountsLoading);
    }, [accountsData, accountsLoading]);

    useEffect(() => {
        let exists = accounts.find((account) => account.id === NEW_ACCOUNT_ID);
        if (!exists) {
            setAccounts((prevAccounts) => [
                ...prevAccounts,
                {
                    id: NEW_ACCOUNT_ID,
                    name: '',
                    account_type: 'Admin',
                },
            ]);
        }
    }, [accountsData, accounts]);

    const handleInputChange = (id: number, field: keyof Account, value: string) => {
        setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
                account.id === id ? { ...account, [field]: value } : account
            )
        );
    };

    const onSubmit = async (account: Account) => {
        await handleSubmit({
            url: `/api/settings/accounts`,
            body: account,
        });
        fetchData();
    };

    const onDelete = async (account: Account) => {
        await handleDelete({
            url: `/api/settings/accounts`,
            body: account,
        });
        fetchData();
    };

    const handleCreateAccount = async () => {
        const newAccount = accounts.find((account) => account.id === NEW_ACCOUNT_ID);
        if (newAccount) {
            await handleCreate({
                url: `/api/settings/accounts`,
                body: {
                    ...newAccount,
                },
            });
        }
        fetchData();
        handleInputChange(NEW_ACCOUNT_ID, 'name', '');
        handleInputChange(NEW_ACCOUNT_ID, 'password', '');
        handleInputChange(NEW_ACCOUNT_ID, 'account_type', 'Admin');
    }

    return (
        <>
            <Loading className={"w-3/4 h-screen top-0 fixed bg-[--black] transition-all duration-300 pointer-events-none z-50 " + (loading ? "opacity-100" : "opacity-0")} />
            <h2 className={`text-xl font-bold mb-4 ${loading ? 'hidden' : ''}`}>Accounts Settings</h2>
            <div className={`grid grid-cols-4 items-start gap-6 w-full ${loading ? 'hidden' : ''}`}>
                {accounts.map((account) => (
                    account.id !== NEW_ACCOUNT_ID && (
                        <div key={account.id} className="max-w-md p-4 mb-4 rounded-lg bg-neutral-900 flex flex-col gap-2">
                            <h3 className="text-lg font-bold">Account ID: {account.id}</h3>
                            <input
                                type="text"
                                value={account.name}
                                onChange={(e) => handleInputChange(account.id, 'name', e.target.value)}
                                className="p-2 rounded bg-neutral-800 text-white"
                            />
                            <select
                                value={account.account_type}
                                onChange={(e) => handleInputChange(account.id, 'account_type', e.target.value)}
                                className="p-2 rounded bg-neutral-800 text-white"
                            >
                                <option value="Admin">Admin</option>
                                <option value="Adult">Adult</option>
                                <option value="Teen">Teen</option>
                                <option value="Kid">Kid</option>
                            </select>
                            <Button state="primary" onClick={() => onSubmit(account)}>
                                Save Account
                            </Button>
                            <Button state="danger" onClick={() => onDelete(account)}>
                                Delete Account
                            </Button>
                        </div>
                    )
                ))}
                <div className="max-w-md p-4 mb-4 rounded-lg bg-neutral-900 flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Create New Account</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        autoComplete="new-password"
                        value={accounts.find((account) => account.id === NEW_ACCOUNT_ID)?.name}
                        onChange={(e) => handleInputChange(NEW_ACCOUNT_ID, 'name', e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white"
                    />
                    <select
                        value={accounts.find((account) => account.id === NEW_ACCOUNT_ID)?.account_type}
                        onChange={(e) => handleInputChange(NEW_ACCOUNT_ID, 'account_type', e.target.value)}
                        className=" p-2 rounded bg-neutral-800 text-white"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Adult">Adult</option>
                        <option value="Teen">Teen</option>
                        <option value="Kid">Kid</option>
                    </select>
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={accounts.find((account) => account.id === NEW_ACCOUNT_ID)?.password}
                        onChange={(e) => handleInputChange(NEW_ACCOUNT_ID, 'password', e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white"
                    />
                    <Button state="primary" onClick={handleCreateAccount}>
                        Create Account
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AccountsSettings;