import { useEffect } from 'react';
import { PhotoFilters } from '../@types/Photo';
import { usePhotosStore } from '../store/photos';
import { useDebounce } from './useDebounce';
import { DEBOUNCE_TIME_MS } from '../lib/constants';

export const usePhotoList = ({ filters }: { filters: PhotoFilters }) => {
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

    return {
        photos,
        isLoading,
        totalItems,
        error,
        currentPage,
        fetchPhotos,
        pageSize,
    };
};
