import { AssetAdministrationShell } from 'lib/api/aas/models';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { mapFileDtoToBlob } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useState } from 'react';
import { isValidUrl } from 'lib/util/UrlUtil';
import { getThumbnailFromShell } from 'lib/services/aas-repository-service/aasRepositoryActions';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

export const useProductImageUrl = (
    aas: AssetAdministrationShell | null,
    repositoryURL?: string,
    productImage?: string,
) => {
    const [productImageUrl, setProductImageUrl] = useState<string>('');
    const currentAASContext = useCurrentAasContext();

    useAsyncEffect(async () => {
        if (!aas || !repositoryURL || !productImage) {
            setProductImageUrl('');
            return;
        }

        if (isValidUrl(productImage!)) {
            setProductImageUrl(productImage!);
            return;
        }

        const response = await getThumbnailFromShell(aas.id, {
            infrastructureName: currentAASContext.infrastructureName || '',
            url: repositoryURL,
        });
        if (!response.isSuccess) {
            console.error('Image not found');
            return;
        }
        const blob = mapFileDtoToBlob(response.result);
        setProductImageUrl(URL.createObjectURL(blob));
    }, [aas, repositoryURL]);

    return productImageUrl;
};
