import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Album, Photo, PhotoWithAlbum } from '../@types/Photo';
import { User } from '../@types/User';
import { get } from './fetch-utils';

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
        
        if (!event.pathParameters || !event.pathParameters.id) {
            throw new Error('Id is required');
        }
        
        const { id } = event.pathParameters;
        const photo: Photo = await get(`/photos/${id}`);
        const album: Album = await get(`/albums/${photo.albumId}`);
        const user: User = await get(`/users/${album.userId}`);

        const { title, url, thumbnailUrl, albumId } = photo;
        const albumWithUser = {
            id: albumId,
            title: album?.title ?? '',
            user,
        };

        const enrichedData: PhotoWithAlbum = {
            id: +id,
            title,
            url,
            thumbnailUrl,
            album: albumWithUser,
        };

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
            },
            body: JSON.stringify(enrichedData),
        };
    } catch (err) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: `Photo not found`,
            }),
        };
    }
};