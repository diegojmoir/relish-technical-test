import { BASE_URL } from './constants';

export async function get(endpoint: string, params?: Record<string, string>) {
    try {
        const q = new URLSearchParams(params);
        const url = `${BASE_URL}/${endpoint}?${q}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                'Something went wrong while retrieving information'
            );
        }

        const data = await response.json();

        return data;
    } catch (err) {
        throw err;
    }
}
