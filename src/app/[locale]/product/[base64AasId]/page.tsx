'use client';

import { Box } from '@mui/material';
import { safeBase64Decode } from 'lib/util/Base64Util';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import {
    checkIfSubmodelHasIdShortOrSemanticId,
    findSubmodelByIdOrSemanticId,
    findValueByIdShort,
    getTranslationText,
} from 'lib/util/SubmodelResolverUtil';
import { useParams, useSearchParams } from 'next/navigation';
import { SubmodelsOverviewCard } from 'app/[locale]/viewer/_components/SubmodelsOverviewCard';
import { ProductOverviewCard } from '../_components/ProductOverviewCard';
import { NoSearchResult } from 'components/basics/detailViewBasics/NoSearchResult';
import { useAasLoader } from 'lib/hooks/UseAasDataLoader';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { SubmodelOrIdReference } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';

export default function Page() {
    const searchParams = useParams<{ base64AasId: string }>();
    const base64AasId = decodeURIComponent(searchParams.base64AasId).replace(/=+$|[%3D]+$/, '');
    const isMobile = useIsMobile();
    const locale = useLocale();
    const encodedRepoUrl = useSearchParams().get('repoUrl');
    const repoUrl = encodedRepoUrl ? decodeURI(encodedRepoUrl) : undefined;
    const [filteredSubmodels, setFilteredSubmodels] = useState<SubmodelOrIdReference[]>([]);
    const [breadcrumbLinks] = useState<Array<{ label: string; path: string }>>([]);

    const { aasFromContext, isLoadingAas, aasOriginUrl, submodels, isSubmodelsLoading } = useAasLoader(
        base64AasId,
        repoUrl,
    );

    useEffect(() => {
        if (submodels) {
            const filtered = submodels.filter(
                (submodel) =>
                    !(
                        checkIfSubmodelHasIdShortOrSemanticId(submodel, undefined, 'AasDesignerChangelog') ||
                        checkIfSubmodelHasIdShortOrSemanticId(
                            submodel,
                            SubmodelSemanticIdEnum.NameplateV1,
                            'Nameplate',
                        ) ||
                        checkIfSubmodelHasIdShortOrSemanticId(
                            submodel,
                            SubmodelSemanticIdEnum.NameplateV2,
                            'Nameplate',
                        ) ||
                        checkIfSubmodelHasIdShortOrSemanticId(
                            submodel,
                            SubmodelSemanticIdEnum.NameplateV3,
                            'Nameplate',
                        ) ||
                        checkIfSubmodelHasIdShortOrSemanticId(
                            submodel,
                            SubmodelSemanticIdEnum.NameplateV4,
                            'Nameplate',
                        ) ||
                        checkIfSubmodelHasIdShortOrSemanticId(submodel, undefined, 'VEC_SML')
                    ),
            );
            setFilteredSubmodels(filtered);
        }
    }, [submodels]);

    const nameplate = findSubmodelByIdOrSemanticId(submodels, SubmodelSemanticIdEnum.NameplateV2, 'Nameplate');

    if (nameplate) {
        const productBreadcrumbProperties = [
            { idShort: 'ManufacturerProductRoot', semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductRoot },
            {
                idShort: 'ManufacturerProductFamily',
                semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductFamily,
            },
            { idShort: 'ManufacturerProductType', semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductType },
        ];

        productBreadcrumbProperties.forEach((prop) => {
            const value = findValueByIdShort(nameplate.submodelElements, prop.idShort, prop.semanticId, locale);
            if (value && !breadcrumbLinks.some((link) => link.label === value)) {
                breadcrumbLinks.push({
                    label: value,
                    path: '',
                });
            }
        });
    }

    const pageStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        alignItems: 'center',
        marginBottom: '50px',
        marginTop: '20px',
    };

    const viewerStyles = {
        maxWidth: '1125px',
        width: '90%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    return (
        <Box sx={pageStyles}>
            {aasFromContext || isLoadingAas ? (
                <Box sx={viewerStyles}>
                    <Box>
                        <Breadcrumbs links={breadcrumbLinks} />
                    </Box>
                    <ProductOverviewCard
                        aas={aasFromContext}
                        submodels={submodels}
                        productImage={aasFromContext?.assetInformation?.defaultThumbnail?.path}
                        isLoading={isLoadingAas || isSubmodelsLoading}
                        isAccordion={isMobile}
                        repositoryURL={aasOriginUrl}
                        displayName={
                            aasFromContext?.displayName ? getTranslationText(aasFromContext.displayName, locale) : null
                        }
                    />
                    <SubmodelsOverviewCard
                        aas={aasFromContext}
                        submodelIds={filteredSubmodels}
                        submodelsLoading={isSubmodelsLoading}
                        firstSubmodelIdShort="TechnicalData"
                        disableHeadline={true}
                    />
                </Box>
            ) : (
                <NoSearchResult base64AasId={safeBase64Decode(base64AasId)} />
            )}
        </Box>
    );
}
