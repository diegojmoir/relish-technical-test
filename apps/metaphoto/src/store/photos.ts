import { create } from 'zustand';
import { Photo, PhotoParams } from '../@types/Photo';
import { devtools, persist } from 'zustand/middleware';
import { PaginatedList } from '../@types/PaginatedList';

interface State {
    totalItems: number;
    currentPage: number;
    photos: Photo[];
    isLoading: boolean;
    fetchPhotos: (params: PhotoParams) => Promise<void>;
}

const API_URL = import.meta.env.PROD ? 'my prod url' : 'http://localhost:5000';

export const usePhotosStore = create<State>()(
    devtools(
        persist(
            (set) => {
                return {
                    photos: [],
                    totalItems: 0,
                    currentPage: 0,
                    isLoading: false,
                    fetchPhotos: async (params: PhotoParams) => {
                        set({ isLoading: true }, false, 'FETCH_PHOTOS_LOADING');
                        const q = new URLSearchParams(params);
                        const res = await fetch(`${API_URL}/photos?${q}`);
                        const json = (await res.json()) as PaginatedList<Photo>;
                        const { data: photos, totalItems, currentPage } = json;
                        set(
                            {
                                photos,
                                totalItems,
                                currentPage,
                                isLoading: false,
                            },
                            false,
                            'FETCH_PHOTOS'
                        );
                    },
                };
            },
            {
                name: 'photos',
            }
        )
    )
);
