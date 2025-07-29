import {
    Box,
    Dialog,
    DialogContent,
    DialogProps,
    Divider,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
    TargetRepositories,
    TargetRepositoryFormData,
} from 'app/[locale]/viewer/_components/transfer/TargetRepositories';
import { useState } from 'react';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { transferAasWithSubmodels } from 'lib/services/transfer-service/transferActions';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { TransferAas, TransferDto, TransferResult, TransferSubmodel } from 'lib/types/TransferServiceData';
import { useEnv } from 'app/EnvProvider';
import { Reference } from 'lib/api/aas/models';
import { useTranslations } from 'next-intl';

export type TransferFormModel = {
    targetAasRepositoryFormModel: TargetRepositoryFormData;
};

// TODO pull aas and origin URLs into props
export function TransferDialog(props: DialogProps) {
    const [transferDto, setTransferDto] = useState<TransferFormModel>();
    const { aas, submodels, aasOriginUrl } = useCurrentAasContext();
    const notificationSpawner = useNotificationSpawner();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const theme = useTheme();
    const t = useTranslations('pages.transfer');
    const env = useEnv();

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    function buildTransferDto(values: TargetRepositoryFormData) {
        if (!values.repository || !aas || !aasOriginUrl) {
            return;
        }

        // As long as we cannot adjust the IDs in the UI, we append '_copy' to every ID
        const submodelsToTransfer = structuredClone(submodels)
            .filter((sub) => sub.submodel)
            .map((sub) => sub.submodel!)
            .map((sub) => {
                const submodelToTransfer: TransferSubmodel = { submodel: sub, originalSubmodelId: sub.id };
                submodelToTransfer.submodel.id = `${sub.id}_copy`;
                return submodelToTransfer;
            });
        const aasToTransfer: TransferAas = {
            aas: structuredClone(aas),
            originalAasId: aas.id,
        };

        aasToTransfer.aas.id = `${aas.id}_copy`;

        // Adapt Submodel References of the AAS
        const submodelReferencesToTransfer: Reference[] = [];
        aas.submodels?.forEach((sourceSubmodel) => {
            const matchingSubmodel = submodelsToTransfer.find(
                (submodelToTransfer) => submodelToTransfer.originalSubmodelId === sourceSubmodel.keys[0].value,
            );
            if (matchingSubmodel) {
                const newSubmodelReference = sourceSubmodel;
                newSubmodelReference.keys[0].value = matchingSubmodel?.submodel.id;
                submodelReferencesToTransfer.push(newSubmodelReference);
            }
        });
        aasToTransfer.aas.submodels = submodelReferencesToTransfer;

        // TODO use separate submodel URLs
        const dtoToSubmit: TransferDto = {
            aas: aasToTransfer,
            submodels: submodelsToTransfer,
            targetAasRepositoryBaseUrl: values.repository,
            sourceAasRepositoryBaseUrl: aasOriginUrl,
            targetSubmodelRepositoryBaseUrl:
                values.submodelRepository && values.submodelRepository !== '0'
                    ? values.submodelRepository
                    : values.repository,
            sourceSubmodelRepositoryBaseUrl: aasOriginUrl,
            apikey: values.repositoryApiKey,
            targetDiscoveryBaseUrl: env.DISCOVERY_API_URL,
        };
        return dtoToSubmit;
    }

    const handleSubmitRepositoryStep = async (values: TargetRepositoryFormData) => {
        // This state can be used later to hold the data of multiple steps
        setTransferDto({ ...transferDto, targetAasRepositoryFormModel: values });

        const dtoToSubmit = buildTransferDto(values);
        if (!dtoToSubmit) return;

        try {
            setIsSubmitting(true);
            const response = await transferAasWithSubmodels(dtoToSubmit);
            processResult(response);
        } catch {
            notificationSpawner.spawn({
                message: t('errorToast'),
                severity: 'error',
            });
        } finally {
            props.onClose?.({}, 'escapeKeyDown');
            setIsSubmitting(false);
        }
    };

    /**
     * Shows success if all elements got transferred correctly.
     * Shows error if no element got transferred correctly.
     * If only parts of the AAS got transferred,
     * shows an error for each failed element and a warning in the end.
     * @param result List of all transfer Results.
     */
    const processResult = (result: TransferResult[]) => {
        if (result.every((result) => result.success)) {
            notificationSpawner.spawn({
                message: t('successfulToast'),
                severity: 'success',
            });
        } else if (result.every((result) => !result.success)) {
            notificationSpawner.spawn({
                message: t('errorToast'),
                severity: 'error',
            });
        } else {
            result.map((result) => {
                if (!result.success) {
                    notificationSpawner.spawn({
                        message: `${t('partiallyFailedToast')}: ${result.error}`,
                        severity: 'error',
                    });
                }
                notificationSpawner.spawn({
                    message: t('warningToast'),
                    severity: 'warning',
                });
            });
        }
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            maxWidth="md"
            fullWidth
            fullScreen={fullScreen}
            closeAfterTransition={false}
        >
            <Box sx={{ m: 4 }}>
                <Typography variant="h2" color="primary">
                    {t('title')}
                </Typography>
                <Typography>{t('subtitle')}</Typography>
            </Box>
            <IconButton
                aria-label="close"
                onClick={(e) => props.onClose && props.onClose(e, 'escapeKeyDown')}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                    zIndex: 1,
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ mr: 1, ml: 1 }}>
                <TargetRepositories
                    onSubmitStep={(values) => handleSubmitRepositoryStep(values)}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
            <Divider />
        </Dialog>
    );
}
