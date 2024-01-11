import { User } from './User';

export type Photo = {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
};

export type Album = {
    userId: number;
    id: number;
    title: string;
};

export type AlbumWithUser = Omit<Album, 'userId'> & { user?: User };
export type PhotoWithAlbum = Omit<Photo, 'albumId'> & { album: AlbumWithUser };

export type GetPhotosParams = {
    title?: string;
    email?: string;
    albumTitle?: string;
    limit?: number;
    offset?: number;
};
