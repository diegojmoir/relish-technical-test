import { create } from 'zustand';
import { Photo, PhotoParams } from '../@types/Photo';
import { devtools, persist } from 'zustand/middleware';
import { PaginatedList } from '../@types/PaginatedList';
import { DEFAULT_PAGE_SIZE } from '../lib/constants';

interface State {
    totalItems: number;
    currentPage: number;
    pageSize: number;
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
                    pageSize: DEFAULT_PAGE_SIZE,
                    fetchPhotos: async (params: PhotoParams) => {
                        set({ isLoading: true }, false, 'FETCH_PHOTOS_LOADING');
                        const q = new URLSearchParams(params);
                        const res = await fetch(`${API_URL}/photos?${q}`);
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
                    },
                };
            },
            {
                name: 'photos',
            }
        )
    )
);
