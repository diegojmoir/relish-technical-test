const BASE_URL = 'https://jsonplaceholder.typicode.com';

const getPhotos = async ({ title = '', albumTitle = '', email = '' }) => {
    const allPhotos = await fetch(`${BASE_URL}/photos`).then((res) =>
        res.json()
    );
    const photos = allPhotos
        .filter((p) => !title || p.title.includes(title))
        .slice(0, 10);

    if (Array.isArray(photos)) {
        const albumIds = [...new Set(photos.map((p) => p.albumId))];
        const allAlbums = await Promise.all(
            albumIds.map((id) => {
                return fetch(`${BASE_URL}/albums/${id}`).then((res) =>
                    res.json()
                );
            })
        );

        const albums = allAlbums.filter(
            (a) => !albumTitle || a.title.includes(albumTitle)
        );
        const userIds = [...new Set(albums.map((a) => a.userId))];
        const allUsers = await Promise.all(
            userIds.map((id) => {
                return fetch(`${BASE_URL}/users/${id}`).then((res) =>
                    res.json()
                );
            })
        );

        const users = allUsers.filter((u) => !email || u.email.includes(email));

        const response = photos.map((photo) => {
            const { id, title, url, albumId } = photo;
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
                album: albumWithUser,
            };
        });

        return response;
    }
};

getPhotos({ title: '' });
