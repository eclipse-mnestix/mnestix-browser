import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { ReactNode, useState, useEffect } from 'react';
import GenericAasList from 'components/basics/listBasics/GenericAasList';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { AasListConfig, AasListEntry } from 'lib/types/AasListEntry';
import { useShowError } from 'lib/hooks/UseShowError';

export type GenericListDataWrapperProps = {
    loadContent: () => Promise<AasListEntry[]>;
    children: ReactNode;
} & AasListConfig;

/**
 * GenericListDataWrapper is a wrapper component that loads data for a list and handles loading and error states.
 * @param loadContent Async function to load the entire content for the list.
 * @param children The content to be displayed in case of an error.
 * @param config Additional configuration for the list, what should be displayed.
 */
export function GenericListDataWrapper({ loadContent, children, ...config }: GenericListDataWrapperProps) {
    const [listEntries, setListEntries] = useState<AasListEntry[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);
    const { showError } = useShowError();

    useAsyncEffect(async () => {
        setIsLoadingList(true);

        try {
            const newListEntries = await loadContent();
            setListEntries(newListEntries);
        } catch (error) {
            showError(error);
            setIsError(true);
        }

        setIsLoadingList(false);
    }, []);

    // Cleanup blob URLs when component unmounts or list entries change
    useEffect(() => {
        return () => {
            listEntries.forEach((entry) => {
                if (entry.thumbnailUrl?.startsWith('blob:')) {
                    URL.revokeObjectURL(entry.thumbnailUrl);
                }
            });
        };
    }, [listEntries]);

    return (
        <>
            {isLoadingList && <CenteredLoadingSpinner sx={{ mt: 10 }} />}
            {isError ? children : <GenericAasList data={listEntries} {...config} />}
        </>
    );
}
