import { PAGE_SIZES } from '../lib/constants';

type PaginationProps = {
    refreshList: (params: Record<string, string>) => void;
    currentPage: number;
    totalItems: number;
    pageSize: number;
};

export const Pagination = ({
    refreshList,
    currentPage,
    totalItems,
    pageSize,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 3);

    const goToPage = (page: number) => {
        refreshList({
            limit: pageSize.toString(),
            offset: page.toString(),
        });
    };

    const goToPreviousPage = () => {
        const previousPage = Math.max(0, currentPage - 1);
        refreshList({
            limit: pageSize.toString(),
            offset: previousPage.toString(),
        });
    };

    const goToNextPage = () => {
        const nextPage = Math.min(totalPages, currentPage + 1);
        refreshList({
            limit: pageSize.toString(),
            offset: nextPage.toString(),
        });
    };

    return (
        <div className="w-full flex justify-center items-center gap-2">
            <label>
                Page Size:
                <select
                    className="ml-1 p-0.5"
                    name="pageSize"
                    value={pageSize}
                    onChange={(e) => {
                        const value = e.target.value;
                        refreshList({ limit: value, offset: '0' });
                    }}
                >
                    {PAGE_SIZES.filter((size) => size < totalItems).map(
                        (size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        )
                    )}
                </select>
            </label>
            {currentPage > 0 && (
                <button
                    className="p-2 rounded h-6 flex items-center hover:bg-blue-500"
                    type="button"
                    title="Go to Previous Page"
                    onClick={goToPreviousPage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M13.939 4.939L6.879 12l7.06 7.061l2.122-2.122L11.121 12l4.94-4.939z"
                        />
                    </svg>
                </button>
            )}
            {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
                const page = startPage + index;
                return (
                    <button
                        key={page}
                        className={`p-2 rounded h-6 flex font-lg items-center hover:bg-blue-500 ${
                            currentPage + 1 === page ? 'bg-blue-500' : ''
                        }`}
                        title={`Go to Page ${page}`}
                        onClick={() => goToPage(page - 1)}
                    >
                        {page}
                    </button>
                );
            })}

            {currentPage < totalPages - 1 && (
                <button
                    className="p-2 rounded h-6 flex items-center hover:bg-blue-500"
                    type="button"
                    title="Go to Next Page"
                    onClick={goToNextPage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M10.061 19.061L17.121 12l-7.06-7.061l-2.122 2.122L12.879 12l-4.94 4.939z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
