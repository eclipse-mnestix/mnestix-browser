import { alpha, Step, StepLabel, Stepper, Typography, useTheme } from '@mui/material';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslations } from 'next-intl';

function findNextStage(stage?: string) {
    const lifecycleStages = Object.values(ProductLifecycleStage);

    const indexOfCurrentStage = lifecycleStages.findIndex((s) => s === stage);
    if (indexOfCurrentStage === undefined || indexOfCurrentStage === lifecycleStages.length - 1) return undefined;
    return lifecycleStages[indexOfCurrentStage + 1];
}

export function ProductLifecycle(props: { completedStages: ProductLifecycleStage[] }) {
    const t = useTranslations('components.carbonFootprint');
    const theme = useTheme();
    const nextStage = findNextStage(props.completedStages.at(-1));

    const colorOfNextStep = alpha(theme.palette.primary.main, 0.2);

    function CustomCircle() {
        return <CircleIcon htmlColor={colorOfNextStep} />;
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
                        <Typography data-testid="product-lifecycle-step-text" sx={{
                            fontSize: 24
                        }}>
                            {!!step && t(`stages.${step}`)}
                        </Typography>
                    </StepLabel>
                </Step>
            ))}
            {nextStage && (
                <Step key="20" active={false} data-testid="product-lifecycle-next-step">
                    <StepLabel slots={{ stepIcon: CustomCircle }} data-testid="product-lifecycle-step-label">
                        <Typography color={colorOfNextStep} sx={{
                            fontSize: 24
                        }}>
                            {t(`stages.${nextStage}`)} ({t('notIncludedHint')})
                        </Typography>
                    </StepLabel>
                </Step>
            )}
        </Stepper>
    );
}
