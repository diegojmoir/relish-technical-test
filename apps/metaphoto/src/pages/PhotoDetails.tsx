import { useParams } from 'react-router-dom';
import { usePhotosStore } from '../store/photos';

export const PhotoDetails = () => {
    const { id = -1 } = useParams();
    const { photo } = usePhotosStore((state) => ({
        photo: state.photos.find((x) => x.id === +id),
    }));

    if (!photo) {
        return <div>Photo not found</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <img src={photo.url} />
            <dl className="gap-1">
                <dt className="capitalize opacity-80">Title</dt>
                <dd>{photo.title}</dd>

                <dt className="capitalize opacity-80">Album</dt>
                <dd>{photo.album.title}</dd>

                <dt className="capitalize opacity-80">User</dt>
                <dd>{photo.album.user.name}</dd>

                <dt className="capitalize opacity-80">Username</dt>
                <dd>{photo.album.user.username}</dd>

                <dt className="capitalize opacity-80">Email</dt>
                <dd>{photo.album.user.email}</dd>

                <dt className="capitalize opacity-80">Phone</dt>
                <dd>{photo.album.user.phone}</dd>

                <dt className="capitalize opacity-80">Website</dt>
                <dd>{photo.album.user.website}</dd>

                <dt className="capitalize opacity-80">Address</dt>
                <dd>{photo.album.user.address.street}</dd>
                <dd>{photo.album.user.address.suite}</dd>
                <dd>{`${photo.album.user.address.city}, ${photo.album.user.address.zipcode}`}</dd>

                <dt className="capitalize opacity-80">Company</dt>
                <dd>{photo.album.user.company.name}</dd>
                <dd>{photo.album.user.company.catchPhrase}</dd>
                <dd>{photo.album.user.company.bs}</dd>
            </dl>
        </div>
    );
};
