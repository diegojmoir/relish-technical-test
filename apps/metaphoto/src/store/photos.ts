import { create } from 'zustand';
import { Photo, PhotoParams } from '../@types/Photo';
import { devtools, persist } from 'zustand/middleware';

interface State {
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
                    fetchPhotos: async (params: PhotoParams) => {
                        const q = new URLSearchParams(params);
                        const res = await fetch(`${API_URL}/photos?${q}`);
                        const photos = await res.json();
                        console.log(get);
                        set({ photos }, false, 'FETCH_PHOTOS');
                    },
                };
            },
            {
                name: 'photos',
            }
        )
    )
);
