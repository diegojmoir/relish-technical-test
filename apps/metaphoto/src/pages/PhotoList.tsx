import { useEffect } from 'react';
import { Card } from '../components/Card';
import { usePhotosStore } from '../store/photos';

export const PhotoList = () => {
    const { fetchPhotos, photos } = usePhotosStore((state) => state);

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
                <Card photo={photo} key={photo.id} />
            ))}
        </div>
    );
};
