import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import {
    Property,
    Submodel,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/types';
import {
    findSubmodelElementByIdShort,
    findSubmodelElementBySemanticIdsOrIdShort,
    findValueByIdShort,
} from 'lib/util/SubmodelResolverUtil';
import { SubmodelElementList } from 'lib/api/aas/models';

export const CommercialDataBox = (props: {
    commercialDataUrl?: string;
    productURI?: string;
    assetId?: string;
    onProductUriRedirect: () => void;
}) => {
    const t = useTranslations('pages.productViewer');
    const [priceInfo, setPriceInfo] = useState<{ grossPrice?: string; productPrice?: string; priceType?: string, currency?: string }>({});
    const [error, setError] = useState<string | null>(null);
    const locale = useLocale();

    useAsyncEffect(async () => {
        if (props.commercialDataUrl) {
            /**
             * Fetching the commercial data directly from the provided URL.
             * This could be moved to our backend if any security or CORS issues arise.
             * The AAS Standard does not have a GetByUrl method.
             */
            const response = await fetch(props.commercialDataUrl);
            if (response.ok) {
                const data: Submodel = await response.json();
                console.log(data)
                prepareCommercialData(data);
            } else {
                setError(`Failed to fetch commercial data: ${response.statusText}`);
                console.error('Failed to fetch commercial data:', response.statusText);
            }
        }
    }, []);

    const prepareCommercialData = (data: Submodel) => {
        const currency = findValueByIdShort(data.submodelElements, 'Currency', null, locale) || undefined;

        const itemList: SubmodelElementList | null = findSubmodelElementByIdShort(data.submodelElements, 'ItemList', null) as SubmodelElementList | null;
        const item: SubmodelElementCollection | undefined | null = itemList?.value?.find(element => {
            // @ts-expect-error value is there
            const itemId: Property | null =  element?.value ? findSubmodelElementByIdShort(element.value, 'ItemID', null) as Property | null : null;
            return itemId?.valueId?.keys[0].value === props.assetId;
        }) as SubmodelElementCollection | undefined;

        if(item) {
            const grossPrice = findValueByIdShort(item?.value, 'GrossPrice', null, locale) || undefined;
            const productPriceCollection =
                (findSubmodelElementBySemanticIdsOrIdShort(item?.value, 'ProductPrice', null) as SubmodelElementCollection)?.value || null;
            const priceType =
                findValueByIdShort(productPriceCollection, 'Price', null, locale) || undefined;
            const productPrice =
                findValueByIdShort(productPriceCollection, 'PriceType', null, locale) || undefined;
            setPriceInfo({ grossPrice, productPrice, priceType, currency });
            console.log('Prepared commercial data:', { grossPrice, productPrice, priceType, currency });
        } else {
            setError('No item found in commercial data.')
        }
    };

    return (
        <>
            <Box margin={3} borderLeft="1px solid #e0e0e0" paddingLeft={3}>
                {(priceInfo.grossPrice || priceInfo.productPrice) && priceInfo.currency && priceInfo.priceType !== 'on_request' ? (
                    <Box>
                        <Typography variant="h3" mb={3}>{priceInfo.grossPrice || priceInfo.productPrice} {priceInfo.currency}</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => props.onProductUriRedirect()}
                            disabled={!props.productURI}
                            title={!props.productURI ? t('commercialData.noProductUriAvailable') : ''}
                        >
                            {t('commercialData.orderButton')}
                        </Button>
                    </Box>
                ) : (
                    <Button
                        variant="outlined"
                        onClick={() => props.onProductUriRedirect()}
                        disabled={!props.productURI}
                        title={!props.productURI ? t('commercialData.noProductUriAvailable') : ''}
                    >
                        {t('commercialData.requestPrice')}
                    </Button>
                )}
                {(!props.productURI && error) && <Typography color="warning">{error}</Typography>}
            </Box>
        </>
    );
};
