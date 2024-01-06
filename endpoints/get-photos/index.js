const BASE_URL = 'https://jsonplaceholder.typicode.com';
const getPhotos = async () => {
    const allPhotos = await fetch(`${BASE_URL}/photos`).then((res) =>
        res.json()
    );
    const photos = allPhotos.slice(0, 5);
    if (Array.isArray(photos)) {
        const fetchedAlbums = {};
        const fetchedUsers = {};
        const promises = photos.map(async (photo) => {
            if (!Reflect.has(fetchedAlbums, photo.albumId)) {
                const album = await fetch(
                    `${BASE_URL}/albums/${photo.albumId}`
                ).then((res) => res.json());
                Reflect.set(fetchedAlbums, photo.albumId, album);
            }

            const album = Reflect.get(fetchedAlbums, photo.albumId);
            if (album && !Reflect.has(fetchedUsers, album.userId)) {
                const user = await fetch(
                    `${BASE_URL}/users/${album.userId}`
                ).then((res) => res.json());
                Reflect.set(fetchedUsers, album.id, user);
            }

            const user = Reflect.get(fetchedUsers, album.userId);
            const { id, title } = album;
            const albumWithUser = {
                id,
                title,
                user,
            };
            return Object.assign(Object.assign({}, photo), {
                album: albumWithUser,
            });
        });
        return await Promise.all(promises);
    }
};
getPhotos();
