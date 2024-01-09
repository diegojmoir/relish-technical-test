import { create } from 'zustand';
import { Photo, PhotoParams } from '../@types/Photo';
import { devtools } from 'zustand/middleware';
import { PaginatedList } from '../@types/PaginatedList';
import { DEFAULT_PAGE_SIZE, ERROR_MESSAGE } from '../lib/constants';

interface State {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    photos: Photo[];
    isLoading: boolean;
    error: string;
    fetchPhotos: (params: PhotoParams) => Promise<void>;
}

const API_URL = import.meta.env.API_URL
    ? import.meta.env.API_URL
    : 'http://localhost:3000';

export const usePhotosStore = create<State>()(
    devtools((set) => {
        return {
            photos: [],
            totalItems: 0,
            currentPage: 0,
            isLoading: false,
            error: '',
            pageSize: DEFAULT_PAGE_SIZE,
            fetchPhotos: async (params: PhotoParams) => {
                try {
                    set({ isLoading: true }, false, 'FETCH_PHOTOS_LOADING');
                    const q = new URLSearchParams(params);
                    const res = await fetch(`${API_URL}/photos?${q}`);

                    if (!res.ok) {
                        throw new Error();
                    }
                    const json = (await res.json()) as PaginatedList<Photo>;
                    const {
                        data: photos,
                        totalItems,
                        currentPage,
                        pageSize,
                    } = json;
                    set(
                        {
                            photos,
                            totalItems,
                            currentPage,
                            pageSize,
                            isLoading: false,
                        },
                        false,
                        'FETCH_PHOTOS'
                    );
                } catch (err) {
                    set({
                        isLoading: false,
                        error: ERROR_MESSAGE,
                    });
                }
            },
        };
    })
);
