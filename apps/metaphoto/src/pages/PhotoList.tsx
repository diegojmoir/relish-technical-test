import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { usePhotosStore } from '../store/photos';
import { useDebounce } from '../hooks/useDebounce';
import { DEBOUNCE_TIME_MS } from '../lib/constants';
import { Spinner } from '../components/Spinner';
import { Pagination } from '../components/Pagination';

export const PhotoList = () => {
    const {
        fetchPhotos,
        photos,
        isLoading,
        currentPage,
        totalItems,
        pageSize,
    } = usePhotosStore((state) => ({
        fetchPhotos: state.fetchPhotos,
        photos: state.photos,
        currentPage: state.currentPage,
        totalItems: state.totalItems,
        isLoading: state.isLoading,
        pageSize: state.pageSize,
    }));

    const [filterTitle, setFilterTitle] = useState<string>('');
    const [filterAlbum, setFilterAlbum] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');
    const debouncedTitle = useDebounce<string>(filterTitle, DEBOUNCE_TIME_MS);
    const debouncedAlbum = useDebounce<string>(filterAlbum, DEBOUNCE_TIME_MS);
    const debouncedEmail = useDebounce<string>(filterEmail, DEBOUNCE_TIME_MS);

    useEffect(() => {
        fetchPhotos({
            title: debouncedTitle ?? '',
            albumTitle: debouncedAlbum ?? '',
            email: debouncedEmail ?? '',
            limit: pageSize.toString(),
            offset: currentPage.toString(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedTitle, debouncedAlbum, debouncedEmail, fetchPhotos]);

    if (isLoading) {
        return <Spinner size="lg" className="h-full" />;
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <label>
                    Title:
                    <input
                        className="ml-1 p-0.5"
                        type="text"
                        placeholder="Filter by photo title"
                        name="title"
                        value={filterTitle}
                        onChange={(e) => {
                            setFilterTitle(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Album:
                    <input
                        className="ml-1 p-0.5"
                        type="text"
                        placeholder="Filter by album"
                        name="album"
                        value={filterAlbum}
                        onChange={(e) => {
                            setFilterAlbum(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Email:
                    <input
                        className="ml-1 p-0.5"
                        type="text"
                        placeholder="Filter by email"
                        name="email"
                        value={filterEmail}
                        onChange={(e) => {
                            setFilterEmail(e.target.value);
                        }}
                    />
                </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <Card photo={photo} key={photo.id} />
                ))}
            </div>

            <Pagination
                refreshList={({ limit, offset }) => {
                    return fetchPhotos({
                        title: debouncedTitle ?? '',
                        albumTitle: debouncedAlbum ?? '',
                        email: debouncedEmail ?? '',
                        limit,
                        offset,
                    });
                }}
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
            />
        </div>
    );
};
