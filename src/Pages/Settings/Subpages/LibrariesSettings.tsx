import React, { useEffect, useState } from 'react';
import { useDelete, useGet, usePost, usePut } from "@/Hooks/useFetch";
import Button from "@/Components/Button";
import Loading from "@/Components/Loading";

interface Library {
    id: number;
    name: string;
    path: string;
    type: 'movies' | 'series' | 'tv' | 'books' | 'music' | 'other';
}

const NEW_LIBRARY_ID = -162;

const LibrariesSettings: React.FC = () => {
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { data: librariesData, loading: librariesLoading, fetchData } = useGet('/api/settings/libraries');
    const { handleSubmit } = usePost();
    const { handleSubmit: handleScan } = usePost();
    const { handleSubmit: handleDelete } = useDelete();
    const { handleSubmit: handleCreate } = usePut();

    useEffect(() => {
        if (librariesData && librariesData.data) {
            setLibraries(librariesData.data);
        }
        setLoading(librariesLoading);
    }, [librariesData, librariesLoading]);

    useEffect(() => {
        let exists = libraries.find((library) => library.id === NEW_LIBRARY_ID);
        if (!exists) {
            setLibraries((prevLibraries) => [
                ...prevLibraries,
                {
                    id: NEW_LIBRARY_ID,
                    name: '',
                    path: '',
                    type: 'movies',
                },
            ]);
        }
    }, [librariesData, libraries]);

    const handleInputChange = (id: number, field: keyof Library, value: string) => {
        setLibraries((prevLibraries) =>
            prevLibraries.map((library) =>
                library.id === id ? { ...library, [field]: value } : library
            )
        );
    };

    const onSubmit = async (library: Library) => {
        await handleSubmit({
            url: `/api/settings/libraries`,
            body: library,
        });
        fetchData();
    };

    const onScan = async (library: Library) => {
        await handleScan({
            url: `/api/libraries/refresh/${library.id}`,
        });
    };

    const onDelete = async (library: Library) => {
        await handleDelete({
            url: `/api/settings/libraries`,
            body: library,
        });
        fetchData();
    };

    const handleCreateLibrary = async () => {
        const newLibrary = libraries.find((library) => library.id === NEW_LIBRARY_ID);
        if (newLibrary) {
            await handleCreate({
                url: `/api/settings/libraries`,
                body: {
                    ...newLibrary,
                },
            });
        }
        fetchData();
        handleInputChange(NEW_LIBRARY_ID, 'name', '');
        handleInputChange(NEW_LIBRARY_ID, 'path', '');
        handleInputChange(NEW_LIBRARY_ID, 'type', 'movies');
    }

    return (
        <>
            <Loading className={"w-3/4 h-screen top-0 fixed bg-[--black] transition-all duration-300 pointer-events-none z-50 " + (loading ? "opacity-100" : "opacity-0")} />
            <h2 className={`text-xl font-bold mb-4 ${loading ? 'hidden' : ''}`}>Libraries Settings</h2>
            <div className={`grid grid-cols-4 items-start gap-6 w-full ${loading ? 'hidden' : ''}`}>
                {libraries.map((library) => (
                    library.id !== NEW_LIBRARY_ID && (
                        <div key={library.id} className="max-w-md p-4 mb-4 rounded-lg bg-neutral-900 flex flex-col gap-2">
                            <h3 className="text-lg font-bold">Library ID: {library.id}</h3>
                            <input
                                type="text"
                                value={library.name}
                                onChange={(e) => handleInputChange(library.id, 'name', e.target.value)}
                                className="p-2 rounded bg-neutral-800 text-white"
                            />
                            <input
                                type="text"
                                value={library.path}
                                onChange={(e) => handleInputChange(library.id, 'path', e.target.value)}
                                className="p-2 rounded bg-neutral-800 text-white"
                            />
                            <select
                                value={library.type}
                                onChange={(e) => handleInputChange(library.id, 'type', e.target.value)}
                                className="p-2 rounded bg-neutral-800 text-white"
                            >
                                <option value="movies">Movies</option>
                                <option value="series">Series</option>
                                <option value="tv">TV</option>
                                <option value="books">Books</option>
                                <option value="music">Music</option>
                                <option value="other">Other</option>
                            </select>
                            <Button state="primary" onClick={() => onSubmit(library)}>
                                Save Library
                            </Button>
                            <Button state="secondary" className='border border-zinc-700' onClick={() => onScan(library)}>
                                Scan Library
                            </Button>
                            <Button state="danger" onClick={() => onDelete(library)}>
                                Delete Library
                            </Button>
                        </div>
                    )
                ))}
                <div className="max-w-md p-4 mb-4 rounded-lg bg-neutral-900 flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Create New Library</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={libraries.find((library) => library.id === NEW_LIBRARY_ID)?.name}
                        onChange={(e) => handleInputChange(NEW_LIBRARY_ID, 'name', e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Path"
                        value={libraries.find((library) => library.id === NEW_LIBRARY_ID)?.path}
                        onChange={(e) => handleInputChange(NEW_LIBRARY_ID, 'path', e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white"
                    />
                    <select
                        value={libraries.find((library) => library.id === NEW_LIBRARY_ID)?.type}
                        onChange={(e) => handleInputChange(NEW_LIBRARY_ID, 'type', e.target.value)}
                        className="p-2 rounded bg-neutral-800 text-white"
                    >
                        <option value="movies">Movies</option>
                        <option value="series">Series</option>
                        <option value="tv">TV</option>
                        <option value="books">Books</option>
                        <option value="music">Music</option>
                        <option value="other">Other</option>
                    </select>
                    <Button state="primary" onClick={handleCreateLibrary}>
                        Create Library
                    </Button>
                </div>
            </div>
        </>
    );
};

export default LibrariesSettings;