import { useEffect } from 'react';
import { usePhotosStore } from '../store/photos';

export const useCurrentPhoto = ({ id }: { id: number }) => {
    useEffect(() => {
        if (id) {
            fetchPhotoById(id);
        }
    }, []);

    const {
        currentPhoto: photo,
        isLoading,
        error,
        fetchPhotoById,
    } = usePhotosStore((state) => ({
        currentPhoto: state.currentPhoto,
        fetchPhotoById: state.fetchPhotoById,
        isLoading: state.isLoading,
        error: state.error,
    }));

    return {
        photo,
        isLoading,
        error,
    };
};
