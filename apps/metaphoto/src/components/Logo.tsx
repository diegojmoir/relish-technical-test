import { CameraIcon } from '@radix-ui/react-icons';

export const Logo = () => {
    return (
        <div className="flex flex-col items-center justify-center text-sky-400 text-lg p-2">
            <CameraIcon />
            <h1>MetaPhoto</h1>
        </div>
    );
};
