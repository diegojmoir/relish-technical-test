export const Logo = () => {
    return (
        <div className="flex flex-col items-center justify-center text-sky-400 text-lg p-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
            >
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="13" r="3" />
                    <path
                        strokeLinecap="round"
                        d="M2 13.364c0-3.065 0-4.597.749-5.697a4.38 4.38 0 0 1 1.226-1.204c.72-.473 1.622-.642 3.003-.702c.659 0 1.226-.49 1.355-1.125A2.064 2.064 0 0 1 10.366 3h3.268c.988 0 1.839.685 2.033 1.636c.129.635.696 1.125 1.355 1.125c1.38.06 2.282.23 3.003.702c.485.318.902.727 1.226 1.204c.749 1.1.749 2.632.749 5.697c0 3.064 0 4.596-.749 5.697a4.408 4.408 0 0 1-1.226 1.204C18.904 21 17.343 21 14.222 21H9.778c-3.121 0-4.682 0-5.803-.735A4.406 4.406 0 0 1 2.75 19.06A3.43 3.43 0 0 1 2.277 18M19 10h-1"
                    />
                </g>
            </svg>
            <h1>MetaPhoto</h1>
        </div>
    );
};
