import { useNavigate } from 'react-router-dom';
import { Photo } from '../@types/Photo';
type CardProps = {
    photo: Photo;
};

export const Card = ({ photo }: CardProps) => {
    const navigate = useNavigate();

    const goToPhoto = (id: number) => {
        navigate(`/${id}`);
    };

    return (
        <figure
            className="group border border-solid border-slate-400 rounded-lg overflow-hidden shadow cursor-pointer"
            title={photo.title}
            onClick={() => goToPhoto(photo.id)}
        >
            <img
                className="relative animate-fade-in h-auto w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                src={photo.thumbnailUrl}
                alt={photo.title}
            />
            <figcaption className="absolute w-full bottom-0 bg-slate-900 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                <h2 className="p-2 m-0 text-md font-bold truncate text-white">
                    {photo.title}
                </h2>
            </figcaption>
        </figure>
    );
};
