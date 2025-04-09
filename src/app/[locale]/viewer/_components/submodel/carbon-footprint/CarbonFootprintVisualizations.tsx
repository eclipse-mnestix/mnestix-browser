import { Box } from '@mui/material';
import { Address, AddressPerLifeCyclePhase, ProductJourney } from './visualization-components/ProductJourney';
import { CalculationMethod } from './visualization-components/CalculationMethod';
import { CO2Equivalents } from './visualization-components/CO2Equivalents';
import { CO2EquivalentsDistribution } from './visualization-components/CO2EquivalentsDistribution';
import { Comparison } from './visualization-components/Comparison';
import { ProductLifecycle } from './visualization-components/ProductLifecycle';
import { hasSemanticId } from 'lib/util/SubmodelResolverUtil';
import { ProductLifecycleStage } from 'lib/enums/ProductLifecycleStage.enum';
import { StyledDataRow } from 'components/basics/StyledDataRow';
import { ISubmodelElement, Property, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { SubmodelVisualizationProps } from 'app/[locale]/viewer/_components/submodel/SubmodelVisualizationProps';
import { useTranslations } from 'next-intl';
import { PcfSubmodelElement } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/PcfSubmodelElement';
import { SubmodelElementSemanticId } from 'lib/enums/SubmodelElementSemanticId.enum';

export function CarbonFootprintVisualizations({ submodel }: SubmodelVisualizationProps) {
    const t = useTranslations('components.carbonFootprint');

    const pcfSubmodelElements = submodel.submodelElements?.filter((el) =>
        hasSemanticId(
            el,
            PcfSubmodelElement.ProductCarbonFootprint,
            PcfSubmodelElement.ProductCarbonFootprintIrdi,
            PcfSubmodelElement.ProductCarbonFootprintV1,
        ),
    ) as Array<SubmodelElementCollection> | undefined;

    if (pcfSubmodelElements === undefined || !pcfSubmodelElements.length) return <></>;

    pcfSubmodelElements.sort((a, b) => {
        const firstPCFLiveCyclePhase = (
            a.value?.find((v) =>
                hasSemanticId(v, PcfSubmodelElement.PCFLiveCyclePhase, PcfSubmodelElement.LiveCyclePhase),
            ) as Property
        )?.value;
        const secondPCFLiveCyclePhase = (
            b.value?.find((v) =>
                hasSemanticId(v, PcfSubmodelElement.PCFLiveCyclePhase, PcfSubmodelElement.LiveCyclePhase),
            ) as Property
        )?.value;

        if (firstPCFLiveCyclePhase === null || secondPCFLiveCyclePhase === null) {
            return 0;
        }

        return firstPCFLiveCyclePhase > secondPCFLiveCyclePhase ? 1 : -1;
    });

    const totalCO2Equivalents = extractTotalCO2Equivalents(pcfSubmodelElements);
    const co2EquivalentsPerLifecycleStage = ExtractCO2EquivalentsPerLifeCycleStage(pcfSubmodelElements);
    const completedStages = extractCompletedStages(pcfSubmodelElements);
    const addressesPerLifeCyclePhase: AddressPerLifeCyclePhase[] = pcfSubmodelElements.map(
        extractAddressPerLifeCyclePhaseFromPCFSubmodel,
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

function extractCalculationMethod(pcfSubmodelElements: SubmodelElementCollection[]): string {
    return (
        pcfSubmodelElements
            .map(
                (el) =>
                    (
                        el.value?.find((v) =>
                            hasSemanticId(
                                v,
                                PcfSubmodelElement.PCFCalculationMethod,
                                PcfSubmodelElement.PCFCalculationMethodV1,
                            ),
                        ) as Property
                    )?.value,
            )
            .at(0) ?? ''
    );
}

function extractCompletedStages(pcfSubmodelElements: SubmodelElementCollection[]): Array<ProductLifecycleStage> {
    return pcfSubmodelElements.map(
        (el) =>
            ((
                el.value?.find((v) =>
                    hasSemanticId(v, PcfSubmodelElement.PCFLiveCyclePhase, PcfSubmodelElement.LiveCyclePhase),
                ) as Property
            )?.value
                ?.split(' ')[0]
                .trim() as ProductLifecycleStage) ?? [],
    );
}

function ExtractCO2EquivalentsPerLifeCycleStage(
    pcfSubmodelElements: SubmodelElementCollection[],
): Partial<Record<ProductLifecycleStage, number>> {
    return pcfSubmodelElements.reduce(
        (o, key) => ({
            ...o,
            [((
                key.value?.find((v) =>
                    hasSemanticId(v, PcfSubmodelElement.PCFLiveCyclePhase, PcfSubmodelElement.LiveCyclePhase),
                ) as Property
            )?.value
                ?.split(' ')[0]
                .trim() as ProductLifecycleStage) ?? ProductLifecycleStage.A3Production]: Number.parseFloat(
                (
                    key.value?.find((v) =>
                        hasSemanticId(v, PcfSubmodelElement.PCFCO2eq, PcfSubmodelElement.PCFCO2eqV1),
                    ) as Property
                )?.value ?? '',
            ),
        }),
        {},
    );
}

function extractTotalCO2Equivalents(pcfSubmodelElements: SubmodelElementCollection[]): number {
    return pcfSubmodelElements.reduce(
        (prev, curr) =>
            prev +
            (Number.parseFloat(
                (
                    curr.value?.find((v) =>
                        hasSemanticId(v, PcfSubmodelElement.PCFCO2eq, PcfSubmodelElement.PCFCO2eqV1),
                    ) as Property
                )?.value ?? '',
            ) ?? 0),
        0,
    );
}

function extractAddressPerLifeCyclePhaseFromPCFSubmodel(el: SubmodelElementCollection): AddressPerLifeCyclePhase {
    const lifeCyclePhase = (
        el.value?.find((v) =>
            hasSemanticId(v, PcfSubmodelElement.PCFLiveCyclePhase, PcfSubmodelElement.PCFCO2eqV1),
        ) as Property
    )?.value
        ?.split(' ')[0]
        .trim() as ProductLifecycleStage;

    const pcfGoodsAddressHandover = (
        el.value?.find((v) =>
            hasSemanticId(v, PcfSubmodelElement.PCFGoodsAddressHandover, SubmodelElementSemanticId.NameplateAddressV3),
        ) as SubmodelElementCollection
    )?.value;

    const latitude = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressLatitude),
        ) as Property
    )?.value;

    const longitude = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressLongitude),
        ) as Property
    )?.value;

    const street = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressStreet),
        ) as Property
    )?.value;

    const houseNumber = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressHouseNumber),
        ) as Property
    )?.value;

    const zipCode = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressZipCode),
        ) as Property
    )?.value;

    const cityTown = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressCityTown),
        ) as Property
    )?.value;

    const country = (
        pcfGoodsAddressHandover?.find((v: ISubmodelElement) =>
            hasSemanticId(v, PcfSubmodelElement.PCFAddressCountry),
        ) as Property
    )?.value;

    const address: Address = {
        latitude: latitude ? Number.parseFloat(latitude) : undefined,
        longitude: longitude ? Number.parseFloat(longitude) : undefined,
        street: street ?? undefined,
        houseNumber: houseNumber ?? undefined,
        zipCode: zipCode ?? undefined,
        cityTown: cityTown ?? undefined,
        country: country ?? undefined,
    };

    return {
        lifeCyclePhase: lifeCyclePhase,
        address,
    };
}
