import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { usePhotosStore } from '../store/photos';
import { useDebounce } from '../hooks/useDebounce';
import { DEBOUNCE_TIME_MS } from '../lib/constants';
import { Spinner } from '../components/Spinner';
import { Pagination } from '../components/Pagination';
import { PhotoFilters } from '../@types/Photo';

export const PhotoList = () => {
    const {
        fetchPhotos,
        photos,
        isLoading,
        currentPage,
        totalItems,
        pageSize,
        error,
    } = usePhotosStore((state) => ({
        fetchPhotos: state.fetchPhotos,
        photos: state.photos,
        currentPage: state.currentPage,
        totalItems: state.totalItems,
        isLoading: state.isLoading,
        pageSize: state.pageSize,
        error: state.error,
    }));

    const [filters, setFilters] = useState<PhotoFilters>({
        title: '',
        email: '',
        albumTitle: '',
    });
    const debouncedFilters = useDebounce<PhotoFilters>(
        filters,
        DEBOUNCE_TIME_MS
    );

    useEffect(() => {
        const { title, email, albumTitle } = debouncedFilters;
        fetchPhotos({
            title,
            albumTitle,
            email,
            limit: pageSize.toString(),
            offset: currentPage.toString(),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters, fetchPhotos]);

    if (isLoading) {
        return <Spinner size="lg" className="h-full" />;
    }

    if (error) {
        return (
            <div className="flex align-center justify-center text-7xl opacity-80">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-2">
                <label htmlFor="titleFilter">Title:</label>
                <input
                    id="titleFilter"
                    className="p-0.5"
                    type="text"
                    placeholder="Filter by photo title"
                    name="title"
                    value={filters.title}
                    onChange={(e) => {
                        setFilters({ ...filters, title: e.target.value });
                    }}
                />
                <label htmlFor="albumFilter">Album:</label>
                <input
                    id="albumFilter"
                    className="p-0.5"
                    type="text"
                    placeholder="Filter by album"
                    name="album"
                    value={filters.albumTitle}
                    onChange={(e) => {
                        setFilters({ ...filters, albumTitle: e.target.value });
                    }}
                />
                <label htmlFor="emailFilter">Email:</label>
                <input
                    id="emailFilter"
                    className="p-0.5"
                    type="text"
                    placeholder="Filter by email"
                    name="email"
                    value={filters.email}
                    onChange={(e) => {
                        setFilters({ ...filters, email: e.target.value });
                    }}
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                    <Card photo={photo} key={photo.id} />
                ))}
            </div>

            <Pagination
                refreshList={({ limit, offset }) => {
                    const { title, email, albumTitle } = debouncedFilters;
                    return fetchPhotos({
                        title,
                        albumTitle,
                        email,
                        limit,
                        offset,
                    });
                }}
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                className="p-4"
            />
        </div>
    );
};
