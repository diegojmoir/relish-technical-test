export interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    album: Album;
}

export interface Album {
    id: number;
    title: string;
    user: User;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

export interface Geo {
    lat: string;
    lng: string;
}

export interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export type PhotoParams = {
    title?: string;
    albumTitle?: string;
    email?: string;
    limit?: string;
    offset?: string;
};
