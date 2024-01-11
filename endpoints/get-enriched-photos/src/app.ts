import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_OFFSET } from './constants';
import { Album, Photo, PhotoWithAlbum } from './@types/Photo';
import { User } from './@types/User';
import { PaginatedList } from './@types/PaginatedList';
import { get } from './utils';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const queryParameters = event.queryStringParameters ?? {
            title: '',
            albumTitle: '',
            email: '',
            limit: '',
            offset: '',
        };
        const { title = '', albumTitle = '', email = '', limit = '', offset = '' } = queryParameters;

        const formattedLimit = +limit || DEFAULT_PAGE_SIZE;
        const formattedOffset = +offset || DEFAULT_PAGE_OFFSET;

        const allPhotos: Photo[] = await get(`/photos`);

        const filteredPhotos = allPhotos.filter((p) => !title || p.title.includes(title));

        const startIndex = formattedOffset * formattedLimit;
        const endIndex = startIndex + formattedLimit;
        const photos: Photo[] = filteredPhotos.slice(startIndex, endIndex);

        const albumIds: number[] = [...new Set(photos.map((p) => p.albumId))];
        const allAlbums: Album[] = await Promise.all(albumIds.map((id) => get(`/albums/${id}`)));
        const albums: Album[] = allAlbums.filter((a) => !albumTitle || a.title.includes(albumTitle));

        const userIds: number[] = [...new Set(albums.map((a) => a.userId))];
        const allUsers: User[] = await Promise.all(userIds.map((id) => get(`/users/${id}`)));
        const users: User[] = allUsers.filter((u) => !email || u.email.includes(email));

        const enrichedData: PhotoWithAlbum[] = [];
        photos.forEach((photo) => {
            const { id, title, url, thumbnailUrl, albumId } = photo;
            const album = albums.find((a) => a.id === albumId);
            const user = users.find((u) => u.id === album?.userId);

            if (!album || !user) {
                return;
            }

            const albumWithUser = {
                id: albumId,
                title: album?.title ?? '',
                user,
            };

            const enrichedPhoto = {
                id,
                title,
                url,
                thumbnailUrl,
                album: albumWithUser,
            };

            enrichedData.push(enrichedPhoto);
        });

        const response: PaginatedList<PhotoWithAlbum> = {
            data: enrichedData,
            totalItems: filteredPhotos.length,
            currentPage: formattedOffset,
            pageSize: formattedLimit,
        };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
            },
            body: JSON.stringify(response),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Something went wrong while retrieving the data',
            }),
        };
    }
};
