import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { usePhotosStore } from '../store/photos';
import { useDebounce } from '../hooks/useDebounce';

export const PhotoList = () => {
    const { fetchPhotos, photos } = usePhotosStore((state) => state);
    const [filterTitle, setFilterTitle] = useState<string>('');
    const [filterAlbum, setFilterAlbum] = useState<string>('');
    const [filterEmail, setFilterEmail] = useState<string>('');
    const debouncedTitle = useDebounce<string>(filterTitle, 500);
    const debouncedAlbum = useDebounce<string>(filterAlbum, 500);
    const debouncedEmail = useDebounce<string>(filterEmail, 500);

    useEffect(() => {
        fetchPhotos({
            title: debouncedTitle ?? '',
            albumTitle: debouncedAlbum ?? '',
            email: debouncedEmail ?? '',
        });
    }, [debouncedTitle, debouncedAlbum, debouncedEmail, fetchPhotos]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <label>
                    Title:
                    <input
                        className="ml-1 p-0.5"
                        type="text"
                        placeholder="Filter by photo title"
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
        </div>
    );
};
