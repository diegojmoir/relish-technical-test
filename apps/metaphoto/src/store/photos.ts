import { create } from 'zustand';
import { Photo, PhotoParams } from '../@types/Photo';
import { devtools, persist } from 'zustand/middleware';
import { PaginatedList } from '../@types/PaginatedList';

interface State {
    totalItems: number;
    currentPage: number;
    photos: Photo[];
    currentPhoto: Photo | null;
    fetchPhotos: (params: PhotoParams) => Promise<void>;
}

const API_URL = import.meta.env.PROD ? 'my prod url' : 'http://localhost:5000';

export const usePhotosStore = create<State>()(
    devtools(
        persist(
            (set, get) => {
                return {
                    photos: [],
                    currentPhoto: null,
                    totalItems: 0,
                    currentPage: 0,
                    fetchPhotos: async (params: PhotoParams) => {
                        const q = new URLSearchParams(params);
                        const res = await fetch(`${API_URL}/photos?${q}`);
                        const json = (await res.json()) as PaginatedList<Photo>;
                        const { data: photos, totalItems, currentPage } = json;

                        console.log(get);
                        set(
                            { photos, totalItems, currentPage },
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
