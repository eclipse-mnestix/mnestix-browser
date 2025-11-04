import { alpha, Step, StepLabel, Stepper, Typography, useTheme, TextField, Box } from '@mui/material';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslations } from 'next-intl';

function findNextStage(stage?: string) {
    const lifecycleStages = Object.values(ProductLifecycleStage);

    const indexOfCurrentStage = lifecycleStages.findIndex((s) => s === stage);
    if (indexOfCurrentStage === undefined || indexOfCurrentStage === lifecycleStages.length - 1) return undefined;
    return lifecycleStages[indexOfCurrentStage + 1];
}

export function ProductLifecycle(props: {
    completedStages: ProductLifecycleStage[];
    unit: string;
    co2EquivalentsPerLifecycleStage: Record<string, number>;
    onValueChange?: (stage: ProductLifecycleStage, newValue: number) => void;
    editable?: boolean;
}) {
    const t = useTranslations('components.carbonFootprint');
    const theme = useTheme();
    const nextStage = findNextStage(props.completedStages.at(-1));

    const colorOfNextStep = alpha(theme.palette.primary.main, 0.2);

    function CustomCircle() {
        return <CircleIcon htmlColor={colorOfNextStep} />;
    }

    function handleValueChange(stage: ProductLifecycleStage, value: string) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
            props.onValueChange?.(stage, numericValue);
        }
    }

    return (
        <Stepper
            activeStep={props.completedStages.length}
            orientation="vertical"
            sx={{ '& .Muistel-root': { color: 'blue' } }}
            data-testid="product-lifecycle-stepper"
        >
            {props.completedStages.map((step, index) => (
                <Step key={index} data-testid="product-lifecycle-completed-step">
                    <StepLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontSize={20} data-testid="product-lifecycle-step-text">
                                {!!step && `${t(`stages.${step}`)} - `}
                            </Typography>
                            {props.editable ? (
                                <TextField
                                    type="number"
                                    value={props.co2EquivalentsPerLifecycleStage[step] ?? 0}
                                    onChange={(e) => handleValueChange(step, e.target.value)}
                                    size="small"
                                    inputProps={{
                                        min: 0,
                                        step: 0.01,
                                        style: { fontSize: 20, padding: '4px 8px' },
                                    }}
                                    sx={{
                                        width: '120px',
                                        '& .MuiInputBase-root': {
                                            height: '32px',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            padding: '4px 8px',
                                        },
                                    }}
                                    data-testid={`product-lifecycle-input-${step}`}
                                />
                            ) : (
                                <Typography fontSize={20} data-testid="product-lifecycle-step-text">
                                    {props.co2EquivalentsPerLifecycleStage[step]}
                                </Typography>
                            )}
                            <Typography fontSize={20}>{props.unit}</Typography>
                        </Box>
                    </StepLabel>
                </Step>
            ))}
            {nextStage && (
                <Step key="20" active={false} data-testid="product-lifecycle-next-step">
                    <StepLabel StepIconComponent={CustomCircle} data-testid="product-lifecycle-step-label">
                        <Typography fontSize={24} color={colorOfNextStep}>
                            {t(`stages.${nextStage}`)} ({t('notIncludedHint')})
                        </Typography>
                    </StepLabel>
                </Step>
            )}
        </Stepper>
    );
}
