import { useParams } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import { useCurrentPhoto } from '../hooks/useCurrentPhoto';

export const PhotoDetails = () => {
    const { id = '' } = useParams();
    const { photo, error, isLoading } = useCurrentPhoto({ id: +id });

    if (isLoading) {
        return <Spinner size="lg" className="h-full" />;
    }

    if (!photo || error) {
        return (
            <div className="flex align-center justify-center text-7xl opacity-80">
                Photo not found :(
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <img src={photo.url} alt={photo.title} />
            <dl className="grid grid-cols-[max-content, 1fr] gap-1">
                <dt className="capitalize opacity-80">Title</dt>
                <dd>{photo.title}</dd>

                <dt className="capitalize opacity-80">Album</dt>
                <dd>{photo.album.title}</dd>

                <dt className="capitalize opacity-80">Name</dt>
                <dd>{photo.album.user.name}</dd>

                <dt className="capitalize opacity-80">User</dt>
                <dd>{photo.album.user.username}</dd>

                <dt className="capitalize opacity-80">Email</dt>
                <dd>{photo.album.user.email}</dd>

                <dt className="capitalize opacity-80">Phone</dt>
                <dd>{photo.album.user.phone}</dd>

                <dt className="capitalize opacity-80">Website</dt>
                <dd>{photo.album.user.website}</dd>

                <dt className="capitalize opacity-80">Address</dt>
                <dd>
                    {photo.album.user.address.street}
                    {photo.album.user.address.suite}
                    {`${photo.album.user.address.city}, ${photo.album.user.address.zipcode}`}
                </dd>

                <dt className="capitalize opacity-80">Company</dt>
                <dd>{photo.album.user.company.name}</dd>
            </dl>
        </div>
    );
};
