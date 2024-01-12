export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
};

export type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geolocation;
};

export type Geolocation = {
    lat: string;
    lng: string;
};

export type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
};
