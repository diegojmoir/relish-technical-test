import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { usePhotosStore } from '../store/photos';
import { useDebounce } from '../hooks/useDebounce';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../lib/constants';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export const PhotoList = () => {
    const { fetchPhotos, photos, currentPage, totalItems } = usePhotosStore(
        (state) => ({
            fetchPhotos: state.fetchPhotos,
            photos: state.photos,
            currentPage: state.currentPage + 1,
            totalItems: state.totalItems,
        })
    );

    const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
    const [filterTitle, setFilterTitle] = useState<string>('');
    const [filterAlbum, setFilterAlbum] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');
    const debouncedTitle = useDebounce<string>(filterTitle, 500);
    const debouncedAlbum = useDebounce<string>(filterAlbum, 500);
    const debouncedEmail = useDebounce<string>(filterEmail, 500);

    const totalPages = Math.ceil(totalItems / pageSize);
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    useEffect(() => {
        fetchPhotos({
            title: debouncedTitle ?? '',
            albumTitle: debouncedAlbum ?? '',
            email: debouncedEmail ?? '',
            limit: pageSize.toString(),
            offset: '0',
        });
    }, [debouncedTitle, debouncedAlbum, debouncedEmail, pageSize, fetchPhotos]);

    const goToPage = (page: number) => {
        fetchPhotos({ limit: pageSize.toString(), offset: page.toString() });
    };

    const goToPreviousPage = () => {
        const previousPage = Math.max(0, currentPage - 2);
        fetchPhotos({
            limit: pageSize.toString(),
            offset: previousPage.toString(),
        });
    };

    const goToNextPage = () => {
        fetchPhotos({
            limit: pageSize.toString(),
            offset: currentPage.toString(),
        });
    };

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

            <div className="w-full flex justify-center items-center gap-2">
                <label>
                    Page Size:
                    <select
                        className="ml-1 p-0.5"
                        name="pageSize"
                        onChange={(e) => {
                            setPageSize(+e.target.value);
                        }}
                    >
                        {PAGE_SIZES.filter((size) => size < totalItems).map(
                            (size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            )
                        )}
                    </select>
                </label>
                {currentPage > 1 && (
                    <button
                        className="p-2 rounded h-6 w-6 flex items-center hover:bg-blue-500"
                        type="button"
                        title="Go to Previous Page"
                        onClick={goToPreviousPage}
                    >
                        <ChevronLeftIcon width="18" height="18" />
                    </button>
                )}
                {Array.from({ length: endPage - startPage + 1 }).map(
                    (_, index) => {
                        const page = startPage + index;
                        return (
                            <button
                                key={page}
                                className={`p-2 rounded h-6 w-6 flex font-lg items-center hover:bg-blue-500 ${
                                    currentPage === page ? 'bg-blue-500' : ''
                                }`}
                                onClick={() => goToPage(page - 1)}
                            >
                                {page}
                            </button>
                        );
                    }
                )}

                {currentPage < totalPages && (
                    <button
                        className="p-2 rounded h-6 w-6 flex items-center hover:bg-blue-500"
                        onClick={goToNextPage}
                    >
                        <ChevronRightIcon width="18" height="18" />
                    </button>
                )}
            </div>
        </div>
    );
};
