import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_OFFSET, BASE_URL } from './constants';
import { Album, Photo, PhotoWithAlbum } from './@types/Photo';
import { User } from './@types/User';
import { PaginatedList } from './@types/PaginatedList';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent) => {
    try {
        console.log(event);
        const queryParameters = event.queryStringParameters ?? {title: '', albumTitle: '', email: '', limit: '', offset: ''};                    
        const {
            title = '', 
            albumTitle = '', 
            email = '', 
            limit = '', 
            offset = '', 
        } = queryParameters;

        const formattedLimit = +limit || DEFAULT_PAGE_SIZE;
        const formattedOffset = +offset || DEFAULT_PAGE_OFFSET;

        const allPhotos: Photo[] = await fetch(`${BASE_URL}/photos`).then((res) =>
            res.json()
        );

        const filteredPhotos = allPhotos.filter(
            (p) => !title || p.title.includes(title)
        );

        const startIndex = formattedOffset * formattedLimit;
        const endIndex = startIndex + formattedLimit;
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
                currentPage: formattedOffset,
                pageSize: formattedLimit,
            };

            return response;
        }

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
