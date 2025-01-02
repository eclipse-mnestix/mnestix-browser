// Custom Types to extend AAS Core Works
export type PaginationData<T> = {
    paging_metadata: {
        cursor: string;
    };
    result: T;
};

export type MultiLanguageValueOnly = { [key: string]: string }[];
