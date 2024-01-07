import { Photo } from '../@types/Photo';

type CardProps = {
    photo: Photo;
};

export const Card = ({ photo }: CardProps) => {
    return (
        <figure
            className="border border-solid border-slate-400 rounded-lg overflow-hidden shadow"
            title={photo.title}
        >
            <img
                className="w-full h-auto object-cover"
                src={photo.thumbnailUrl}
                alt="Elephant at sunset"
            />
            <figcaption className="h-12">
                <h2 className="p-2 m-0 text-md  font-bold truncate">
                    {photo.title}
                </h2>
            </figcaption>
        </figure>
    );
};
