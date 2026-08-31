'use client';

import { Box } from '@mui/material';
import { useIsMobile } from 'lib/hooks/UseBreakpoints';
import {
    checkIfSubmodelHasIdShortOrSemanticId,
    findSubmodelByIdOrSemanticId,
    findValueByIdShort,
    getTranslationText,
} from 'lib/util/SubmodelResolverUtil';
import { SubmodelsOverviewCard } from 'app/[locale]/viewer/_components/SubmodelsOverviewCard';
import { ProductOverviewCard } from '../_components/product/ProductOverviewCard';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { SubmodelSemanticIdEnum } from 'lib/enums/SubmodelSemanticId.enum';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';
import { ViewerShell } from './ViewerShell';

export function ProductViewer() {
    const isMobile = useIsMobile();
    const locale = useLocale();
    const [breadcrumbLinks] = useState<Array<{ label: string; path: string }>>([]);

    const { aas, aasOriginUrl, isLoadingAas, isLoadingSubmodels, submodels, infrastructureName } =
        useCurrentAasContext();

    const filteredSubmodels = useMemo(() => {
        if (!submodels) return [];
        return submodels.filter(
            (submodel) =>
                !(
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, undefined, 'AasDesignerChangelog') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, SubmodelSemanticIdEnum.NameplateV1, 'Nameplate') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, SubmodelSemanticIdEnum.NameplateV2, 'Nameplate') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, SubmodelSemanticIdEnum.NameplateV3, 'Nameplate') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, SubmodelSemanticIdEnum.NameplateV4, 'Nameplate') ||
                    checkIfSubmodelHasIdShortOrSemanticId(submodel, undefined, 'VEC_SML')
                ),
        );
    }, [submodels]);

    const nameplate = findSubmodelByIdOrSemanticId(submodels, SubmodelSemanticIdEnum.NameplateV2, 'Nameplate');

    if (nameplate) {
        const productBreadcrumbProperties = [
            { idShort: 'ManufacturerProductRoot', semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductRootV3 },
            {
                idShort: 'ManufacturerProductFamily',
                semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductFamilyV3,
            },
            { idShort: 'ManufacturerProductType', semanticId: SubmodelElementSemanticIdEnum.ManufacturerProductTypeV3 },
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

    return (
        <ViewerShell>
            <Box>
                <Breadcrumbs links={breadcrumbLinks} />
            </Box>
            <ProductOverviewCard
                aas={aas ?? null}
                infrastructureName={infrastructureName}
                submodels={submodels}
                productImage={aas?.assetInformation?.defaultThumbnail?.path}
                isLoading={isLoadingAas || isLoadingSubmodels}
                isAccordion={isMobile}
                repositoryURL={aasOriginUrl}
                displayName={aas?.displayName ? getTranslationText(aas.displayName, locale) : null}
            />
            <SubmodelsOverviewCard
                aas={aas}
                submodelIds={filteredSubmodels}
                submodelsLoading={isLoadingSubmodels}
                firstSubmodelIdShort="TechnicalData"
                disableHeadline={true}
            />
        </ViewerShell>
    );
}
