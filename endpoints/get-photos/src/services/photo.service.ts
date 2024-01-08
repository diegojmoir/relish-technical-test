import { PaginatedList } from '../@types/PaginatedList';
import { Album, GetPhotosParams, Photo, PhotoWithAlbum } from '../@types/Photo';
import { User } from '../@types/User';
import { BASE_URL } from '../env';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_SIZE } from '../utils/constants';

export const getPhotos = async ({
    title = '',
    albumTitle = '',
    email = '',
    limit = DEFAULT_PAGE_SIZE,
    offset = DEFAULT_PAGE_OFFSET,
}: GetPhotosParams) => {
    const allPhotos: Photo[] = await fetch(`${BASE_URL}/photos`).then((res) =>
        res.json()
    );
    const filteredPhotos = allPhotos.filter(
        (p) => !title || p.title.includes(title)
    );

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const photos: Photo[] = filteredPhotos.slice(startIndex, endIndex);

    if (Array.isArray(photos)) {
        const albumIds: number[] = [...new Set(photos.map((p) => p.albumId))];
        const allAlbums: Album[] = await Promise.all(
            albumIds.map((id) => {
                return fetch(`${BASE_URL}/albums/${id}`).then((res) =>
                    res.json()
                );
            })
        );

        const albums: Album[] = allAlbums.filter(
            (a) => !albumTitle || a.title.includes(albumTitle)
        );
        const userIds: number[] = [...new Set(albums.map((a) => a.userId))];
        const allUsers: User[] = await Promise.all(
            userIds.map((id) => {
                return fetch(`${BASE_URL}/users/${id}`).then((res) =>
                    res.json()
                );
            })
        );

        const users: User[] = allUsers.filter(
            (u) => !email || u.email.includes(email)
        );

        const enrichedData: PhotoWithAlbum[] = photos.map((photo) => {
            const { id, title, url, thumbnailUrl, albumId } = photo;
            const album = albums.find((a) => a.id === albumId);
            const user = users.find((u) => u.id === album?.userId);

            const albumWithUser = {
                id: albumId,
                title: album?.title ?? '',
                user,
            };

            return {
                id,
                title,
                url,
                thumbnailUrl,
                album: albumWithUser,
            };
        });

        const response: PaginatedList<PhotoWithAlbum> = {
            data: enrichedData,
            totalItems: filteredPhotos.length,
            currentPage: offset,
            pageSize: limit,
        };

        return response;
    }
};
