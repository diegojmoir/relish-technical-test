import { Card } from '../components/Card';
import { Spinner } from '../components/Spinner';
import { Pagination } from '../components/Pagination';
import { PhotoFilters } from '../@types/Photo';
import { usePhotoList } from '../hooks/usePhotoList';
import { useState } from 'react';

export const PhotoList = () => {
    const [filters, setFilters] = useState<PhotoFilters>({
        title: '',
        email: '',
        albumTitle: '',
    });
    const {
        photos,
        isLoading,
        error,
        fetchPhotos,
        totalItems,
        currentPage,
        pageSize,
    } = usePhotoList({ filters });

    if (isLoading) {
        return <Spinner size="lg" className="h-full" />;
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
            {error && (
                <div className="flex align-center justify-center text-7xl opacity-80">
                    {error}
                </div>
            )}
            {!error && photos.length === 0 && (
                <div className="flex align-center justify-center text-4xl opacity-80">
                    No photos were found, please try again with different
                    filters.
                </div>
            )}

            {!error && photos.length > 0 && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                            <Card photo={photo} key={photo.id} />
                        ))}
                    </div>
                    <Pagination
                        refreshList={({ limit, offset }) => {
                            const { title, email, albumTitle } = filters;
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
                </>
            )}
        </div>
    );
};
