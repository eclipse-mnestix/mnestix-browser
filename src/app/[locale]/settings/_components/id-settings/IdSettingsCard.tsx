import { InfoOutlined } from '@mui/icons-material';
import { alpha, Box, Divider, Skeleton, styled, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { IdGenerationSettingFrontend } from 'lib/types/IdGenerationSettingFrontend';
import { IdSettingEntry } from './IdSettingEntry';
import { AssetIdRedirectDocumentationDialog } from './AssetIdRedirectDocumentationDialog';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';

import {
    ISubmodelElement,
    Property,
    Qualifier,
    SubmodelElementCollection,
} from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { getArrayFromString } from 'lib/util/SubmodelResolverUtil';
import { useAuth } from 'lib/hooks/UseAuth';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { SettingsCardHeader } from 'app/[locale]/settings/_components/SettingsCardHeader';
import { getIdGenerationSettings, putSingleIdGenerationSetting } from 'lib/services/configurationApiActions';
import { useShowError } from 'lib/hooks/UseShowError';
import { useTranslations } from 'next-intl';

const StyledDocumentationButton = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'all .3s',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),

    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
}));

export type IdSettingsFormData = {
    idSettings: IdGenerationSettingFrontend[];
};

export function IdSettingsCard() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [documentationModalOpen, setDocumentationModalOpen] = useState(false);
    const auth = useAuth();
    const bearerToken = auth.getBearerToken();
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<IdGenerationSettingFrontend[]>([]);
    const { showError } = useShowError();
    const t = useTranslations();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IdSettingsFormData>({ defaultValues: { idSettings: settings } });

    const { fields } = useFieldArray<IdSettingsFormData>({
        control,
        name: 'idSettings',
    });

    // Fetch id settings initially
    useAsyncEffect(async () => {
        await fetchIdSettings();
    }, [bearerToken]);

    const fetchIdSettings = async () => {
        setIsLoading(true);
        const response = await getIdGenerationSettings();
        if (!response.isSuccess) {
            showError(response);
            setIsLoading(false);
            return;
        }
        const settings: IdGenerationSettingFrontend[] = [];
        response.result.submodelElements?.forEach((el) => {
            const element = el as ISubmodelElement;
            const collection = el as SubmodelElementCollection;
            const _settingsList = collection.value;
            const name = el.idShort;

            // IdType (to apply correct validation)
            const idTypeQualifier = element.qualifiers?.find((q: Qualifier) => {
                return q.type === 'SMT/IdType';
            });
            const idType = idTypeQualifier?.value;

            const prefix = _settingsList?.find((e) => e.idShort === 'Prefix') as Property;
            const dynamicPart = _settingsList?.find((e) => e.idShort === 'DynamicPart') as Property;

            const dynamicPartAllowedQualifier = dynamicPart?.qualifiers?.find((q: Qualifier) => {
                return q.type === 'SMT/AllowedValue';
            });
            const allowedDynamicPartValues = getArrayFromString(dynamicPartAllowedQualifier?.value || '');

            const prefixExampleValueQualifier = prefix?.qualifiers?.find((q: Qualifier) => {
                return q.type === 'ExampleValue';
            });
            const prefixExampleValue = prefixExampleValueQualifier?.value;

            settings.push({
                name: name || '',
                idType,
                prefix: {
                    value: prefix?.value,
                    exampleValue: prefixExampleValue,
                },
                dynamicPart: {
                    value: dynamicPart?.value,
                    allowedValues: allowedDynamicPartValues,
                    // (we do not fill example value from api currently)
                },
            });
        });
        setSettings(settings);
        // set form state
        reset({ idSettings: settings });
        setIsLoading(false);
    };

    async function saveIdSettings(data: IdSettingsFormData) {
        try {
            setIsLoading(true);
            const updatePromises = data.idSettings.map(async(setting) => {
                if (setting.prefix.value && setting.dynamicPart.value) {
                    const response = await putSingleIdGenerationSetting(setting.name, {
                        prefix: setting.prefix.value,
                        dynamicPart: setting.dynamicPart.value,
                    });
                    if (!response.isSuccess) {
                        return Promise.reject(new Error(`Saving error for ${setting.name}: "${response.message}"`));
                    }
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);

            await fetchIdSettings();
            notificationSpawner.spawn({
                message: t('common.messages.successfullyUpdated'),
                severity: 'success',
            });
            setIsEditMode(false);
        } catch (e) {
            showError(e);
        } finally {
            setIsLoading(false);
        }
    }

    const cancelEdit = () => {
        reset();
        setIsEditMode(false);
    };

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <SettingsCardHeader
                title={t('pages.settings.idStructure')}
                subtitle={t('pages.settings.idStructureExplanation')}
                onCancel={() => cancelEdit()}
                onEdit={() => setIsEditMode(true)}
                onSubmit={handleSubmit((data) => saveIdSettings(data))}
                isEditMode={isEditMode}
            />
            <Box sx={{ my: 2 }}>
                <Divider />
                {isLoading &&
                    !settings.length &&
                    [0, 1, 2, 3, 4].map((i) => {
                        return (
                            <Fragment key={i}>
                                <Skeleton variant="text" width="50%" height={26} sx={{ m: 2 }} />
                            </Fragment>
                        );
                    })}
                {fields.map((field, index) => {
                    return (
                        <IdSettingEntry
                            key={index}
                            index={index}
                            field={field}
                            editMode={isEditMode}
                            isLoading={isLoading}
                            control={control}
                            errors={errors}
                            register={register}
                        />
                    );
                })}
            </Box>
            <Box sx={{ display: 'flex' }}>
                <StyledDocumentationButton onClick={() => setDocumentationModalOpen(true)}>
                    <InfoOutlined sx={{ mr: 1 }} />
                    <Typography>
                        {t('pages.assetIdDocumentation.title')}
                    </Typography>
                </StyledDocumentationButton>
            </Box>
            <AssetIdRedirectDocumentationDialog
                open={documentationModalOpen}
                onClose={() => setDocumentationModalOpen(false)}
            />
        </Box>
    );
}
