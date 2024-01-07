import { create } from 'zustand';
import { Photo } from '../@types/Photo';
import { devtools, persist } from 'zustand/middleware';

interface State {
    photos: Photo[];
    currentPhoto: Photo | null;
    fetchPhotos: () => Promise<void>;
}

const API_URL = import.meta.env.PROD ? 'my prod url' : 'http://localhost:5000';

export const usePhotosStore = create<State>()(
    devtools(
        persist(
            (set, get) => {
                return {
                    photos: [],
                    currentPhoto: null,
                    fetchPhotos: async () => {
                        const res = await fetch(`${API_URL}/photos`);
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
