import { Box } from '@mui/material';
import { Address, AddressPerLifeCyclePhase, ProductJourney } from './visualization-components/ProductJourney';
import { CalculationMethod } from './visualization-components/CalculationMethod';
import { CO2Equivalents } from './visualization-components/CO2Equivalents';
import { CO2EquivalentsDistribution } from './visualization-components/CO2EquivalentsDistribution';
import { Comparison } from './visualization-components/Comparison';
import { ProductLifecycle } from './visualization-components/ProductLifecycle';
import { findValueByIdShort, hasSemanticId, findSubmodelElementBySemanticIdsOrIdShort, findAllSubmodelElementsBySemanticIdsOrIdShort } from 'lib/util/SubmodelResolverUtil';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import { StyledDataRow } from 'components/basics/StyledDataRow';
import { Property, Submodel, SubmodelElementCollection, SubmodelElementList } from 'lib/api/aas/models';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { useLocale, useTranslations } from 'next-intl';
import { PcfSubmodelElementSemanticIdEnum } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/PcfSubmodelElementSemanticId.enum';
import { SubmodelElementSemanticIdEnum } from 'lib/enums/SubmodelElementSemanticId.enum';

export function CarbonFootprintVisualizations({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.carbonFootprint');
    const locale = useLocale();

    const pcfSubmodelElements = getPcfSubmodelElements(submodel);

    if (!pcfSubmodelElements || !pcfSubmodelElements.length) return <></>;

    // Sort elements by lifecycle phase
    pcfSubmodelElements.sort((a, b) => {
        const firstPhase = extractLifeCyclePhaseValue(a);
        const secondPhase = extractLifeCyclePhaseValue(b);
        return (firstPhase || '').localeCompare(secondPhase || '');
    });

    const totalCO2Equivalents = extractTotalCO2Equivalents(pcfSubmodelElements);
    const co2EquivalentsPerLifecycleStage = extractCO2EquivalentsPerLifeCycleStage(pcfSubmodelElements);
    const completedStages = extractCompletedStages(pcfSubmodelElements);
    const addressesPerLifeCyclePhase = pcfSubmodelElements.map((el) => 
        extractAddressPerLifeCyclePhase(el, locale)
    );
    const calculationMethod = extractCalculationMethod(pcfSubmodelElements);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid="carbonFootprintVisualizations">
            <StyledDataRow title={t('totalCO2Equivalents')}>
                <CO2Equivalents totalCO2Equivalents={totalCO2Equivalents} />
            </StyledDataRow>
            <StyledDataRow title={t('completedStages')}>
                <ProductLifecycle completedStages={completedStages} />
            </StyledDataRow>
            <StyledDataRow title={t('co2EDistribution')}>
                <CO2EquivalentsDistribution
                    co2EquivalentsPerLifecycleStage={co2EquivalentsPerLifecycleStage}
                    totalCO2Equivalents={totalCO2Equivalents}
                />
            </StyledDataRow>
            <StyledDataRow title={t('co2EComparison')}>
                <Comparison co2Equivalents={totalCO2Equivalents} />
            </StyledDataRow>
            <StyledDataRow title={t('productJourney')}>
                <ProductJourney addressesPerLifeCyclePhase={addressesPerLifeCyclePhase} />
            </StyledDataRow>
            <StyledDataRow title={t('calculationMethod')}>
                <CalculationMethod calculationMethod={calculationMethod} />
            </StyledDataRow>
        </Box>
    );
}

function getPcfSubmodelElements(submodel: Submodel): SubmodelElementCollection[] {
    // Check for PCF Version 0.9
    const directPcfElements = findAllSubmodelElementsBySemanticIdsOrIdShort(
        submodel.submodelElements,
        null,
        [
            PcfSubmodelElementSemanticIdEnum.ProductCarbonFootprint,
            PcfSubmodelElementSemanticIdEnum.ProductCarbonFootprintIrdi,
        ]
    ) as SubmodelElementCollection[] | null;

    if (directPcfElements?.length) {
        return directPcfElements;
    }

    // Check for PCF Version 1.0 (due to having a intermediate submodel element list in between submodel and submodel element collection)
    const pcfSubmodelList = findSubmodelElementBySemanticIdsOrIdShort(
        submodel.submodelElements,
        null,
        [PcfSubmodelElementSemanticIdEnum.ProductCarbonFootprintsSMLV1]
    ) as SubmodelElementList | null;

    return (pcfSubmodelList?.value as SubmodelElementCollection[]) || [];
}

function extractLifeCyclePhaseValue(element: SubmodelElementCollection): string | null {
    const lifeCycleElement = findSubmodelElementBySemanticIdsOrIdShort(
        element.value,
        null,
        [
            PcfSubmodelElementSemanticIdEnum.PCFLiveCyclePhase,
            PcfSubmodelElementSemanticIdEnum.LiveCyclePhase,
            PcfSubmodelElementSemanticIdEnum.PCFLiveCyclePhaseV1,
        ]
    );

    if (!lifeCycleElement) return null;

    // Handle PCFLiveCyclePhaseV1 (SubmodelElementList)
    if (hasSemanticId(lifeCycleElement, PcfSubmodelElementSemanticIdEnum.PCFLiveCyclePhaseV1)) {
        const submodelList = lifeCycleElement as SubmodelElementList;
        return (submodelList.value?.[0] as Property)?.value || null;
    }

    return (lifeCycleElement as Property)?.value || null;
}

function extractCalculationMethod(pcfSubmodelElements: SubmodelElementCollection[]): string {
    for (const element of pcfSubmodelElements) {
        const methodElement = findSubmodelElementBySemanticIdsOrIdShort(
            element.value,
            null,
            [
                PcfSubmodelElementSemanticIdEnum.PCFCalculationMethod,
                PcfSubmodelElementSemanticIdEnum.PCFCalculationMethodV1,
            ]
        );
        
        if (methodElement) {
            if (hasSemanticId(methodElement, PcfSubmodelElementSemanticIdEnum.PCFCalculationMethodV1)) {
                const submodelList = methodElement as SubmodelElementList;
                const firstElement = submodelList.value?.[0] as Property;
                if (firstElement?.value) return firstElement.value;
            }
            
            const propertyValue = (methodElement as Property)?.value;
            if (propertyValue) return propertyValue;
        }
    }
    return '';
}

function extractCompletedStages(pcfSubmodelElements: SubmodelElementCollection[]): ProductLifecycleStage[] {
    return pcfSubmodelElements
        .map((el) => {
            const lifeCyclePhaseValue = extractLifeCyclePhaseValue(el);
            return lifeCyclePhaseValue?.split(' ')[0].trim() as ProductLifecycleStage;
        })
        .filter(Boolean);
}

function extractCO2EquivalentsPerLifeCycleStage(
    pcfSubmodelElements: SubmodelElementCollection[],
): Partial<Record<ProductLifecycleStage, number>> {
    const result: Partial<Record<ProductLifecycleStage, number>> = {};
    
    pcfSubmodelElements.forEach((element) => {
        const lifeCyclePhaseValue = extractLifeCyclePhaseValue(element);
        const stage = (lifeCyclePhaseValue?.split(' ')[0].trim() as ProductLifecycleStage) ?? ProductLifecycleStage.A3Production;
        
        const co2Value = findSubmodelElementBySemanticIdsOrIdShort(
            element.value,
            null,
            [PcfSubmodelElementSemanticIdEnum.PCFCO2eq, PcfSubmodelElementSemanticIdEnum.PCFCO2eqV1]
        ) as Property;
        
        const co2Equivalent = Number.parseFloat(co2Value?.value ?? '0');
        
        result[stage] = (result[stage] || 0) + co2Equivalent;
    });
    
    return result;
}

function extractTotalCO2Equivalents(pcfSubmodelElements: SubmodelElementCollection[]): number {
    return pcfSubmodelElements.reduce((total, element) => {
        const co2Element = findSubmodelElementBySemanticIdsOrIdShort(
            element.value,
            null,
            [PcfSubmodelElementSemanticIdEnum.PCFCO2eq, PcfSubmodelElementSemanticIdEnum.PCFCO2eqV1]
        ) as Property;
        
        const co2Value = Number.parseFloat(co2Element?.value ?? '0') || 0;
        return total + co2Value;
    }, 0);
}

function extractAddressPerLifeCyclePhase(
    element: SubmodelElementCollection, 
    locale: string
): AddressPerLifeCyclePhase {
    const lifeCyclePhaseValue = extractLifeCyclePhaseValue(element);
    const lifeCyclePhase = (lifeCyclePhaseValue?.split(' ')[0].trim() as ProductLifecycleStage);

    const addressHandover = findSubmodelElementBySemanticIdsOrIdShort(
        element.value,
        null,
        [
            PcfSubmodelElementSemanticIdEnum.PCFGoodsAddressHandover,
            SubmodelElementSemanticIdEnum.NameplateAddressV3,
        ]
    ) as SubmodelElementCollection;

    const addressElements = addressHandover?.value;

    const addressData = {
        latitude: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressLatitude, locale),
        longitude: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressLongitude, locale),
        rawStreet: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressStreet, locale) ||
                  findValueByIdShort(addressElements, null, SubmodelElementSemanticIdEnum.ContactInformationStreet, locale),
        rawHouseNumber: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressHouseNumber, locale),
        zipCode: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressZipCode, locale) ||
                findValueByIdShort(addressElements, null, SubmodelElementSemanticIdEnum.ContactInformationZipCode, locale),
        cityTown: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressCityTown, locale) ||
                 findValueByIdShort(addressElements, null, SubmodelElementSemanticIdEnum.ContactInformationCityTown, locale),
        country: findValueByIdShort(addressElements, null, PcfSubmodelElementSemanticIdEnum.PCFAddressCountry, locale) ||
                findValueByIdShort(addressElements, null, SubmodelElementSemanticIdEnum.ContactInformationNationalCode, locale),
    };

    const { street, houseNumber } = extractStreetAndHouseNumber(addressData.rawStreet, addressData.rawHouseNumber);

    const address: Address = {
        latitude: addressData.latitude ? Number.parseFloat(addressData.latitude) : undefined,
        longitude: addressData.longitude ? Number.parseFloat(addressData.longitude) : undefined,
        street: street ?? undefined,
        houseNumber: houseNumber ?? undefined,
        zipCode: addressData.zipCode ?? undefined,
        cityTown: addressData.cityTown ?? undefined,
        country: addressData.country ?? undefined,
    };

    return {
        lifeCyclePhase,
        address,
    };
}

function extractStreetAndHouseNumber(rawStreet: string | null, rawHouseNumber: string | null): {
    street: string | null;
    houseNumber: string | null;
} {
    let street = rawStreet;
    let houseNumber = rawHouseNumber;

    if ((!houseNumber || houseNumber.trim() === '') && rawStreet) {
        const streetWithHouseNumberMatch = rawStreet.match(/^(.+?)\s+(\d+[a-zA-Z]?(?:-\d+[a-zA-Z]?)?)$/);
        
        if (streetWithHouseNumberMatch) {
            street = streetWithHouseNumberMatch[1].trim();
            houseNumber = streetWithHouseNumberMatch[2].trim();
        }
    }

    return { street, houseNumber };
}