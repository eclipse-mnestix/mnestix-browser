import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import { useState } from 'react';
import { CO2EBarchart } from './CO2EDistributionDiagrams/CO2EDistributionBarchart';
import { CO2EList } from './CO2EDistributionDiagrams/CO2EDistributionList';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';
import { cutDecimalPlaces } from 'lib/util/NumberUtil';
import { useTranslations } from 'next-intl';

enum chartVariants {
    barchart,
    list,
}

const unit = 'kg';

export function CO2EquivalentsDistribution(props: {
    co2EquivalentsPerLifecycleStage: Partial<Record<ProductLifecycleStage, number>>;
    totalCO2Equivalents: number;
}) {
    const [chartVariant, setChartVariant] = useState(chartVariants.barchart);
    const t = useTranslations('components.carbonFootprint');

    const handleVariantChange = (_event: React.MouseEvent<HTMLElement>, variant: number | null) => {
        if (variant !== null) setChartVariant(variant);
    };

    const renderSwitch = (variant: chartVariants) => {
        switch (variant) {
            case chartVariants.barchart:
                return <CO2EBarchart co2EquivalentsPerLifecycleStage={props.co2EquivalentsPerLifecycleStage} />;
            case chartVariants.list:
                return <CO2EList co2EquivalentsPerLifecycleStage={props.co2EquivalentsPerLifecycleStage} />;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} data-testid="co2-equivalents-distribution-box">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box
                    sx={{ color: 'primary.main', fontSize: 24 }}
                    data-testid="co2-equivalents-totalEquivalents-typography"
                >
                    <Typography sx={{ color: 'inherit', fontSize: 'inherit', fontWeight: 600 }} component="span">
                        {`${cutDecimalPlaces(props.totalCO2Equivalents, 3)} ${unit} `}
                    </Typography>
                    <Typography sx={{ color: 'inherit', fontSize: 'inherit' }} component="span">
                        {t('inTotal')}
                    </Typography>
                </Box>
                <ToggleButtonGroup
                    value={chartVariant}
                    onChange={handleVariantChange}
                    aria-label="outlined primary button group"
                    exclusive
                >
                    <ToggleButton value={chartVariants.barchart}>
                        <BarChartIcon />
                    </ToggleButton>
                    <ToggleButton value={chartVariants.list} data-testid="list-toggle-button">
                        <ListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box sx={{ marginTop: 2 }}>{renderSwitch(chartVariant)}</Box>
        </Box>
    );
}
