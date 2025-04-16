import { AssetAdministrationShell } from '@aas-core-works/aas-core3.0-typescript/types';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { getThumbnailFromShell } from 'lib/services/repository-access/repositorySearchActions';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useState } from 'react';

export const useProductImageUrl = (aas: AssetAdministrationShell | null, repositoryURL: string | null) => {
    const [productImageUrl, setProductImageUrl] = useState<string>('');

    useAsyncEffect(async () => {
        if (!aas || !repositoryURL) {
            setProductImageUrl('');
            return;
        }

        const response = await getThumbnailFromShell(aas.id, repositoryURL);
        if (!response.isSuccess) {
            console.error('Image not found');
            return;
        }
        const blob = mapFileDtoToBlob(response.result);
        setProductImageUrl(URL.createObjectURL(blob));
    }, [aas, repositoryURL]);

    return productImageUrl;
};