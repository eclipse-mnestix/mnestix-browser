'use client';

import { CloudUploadOutlined, ContentCopy, Delete, MoreVert, Restore } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Box,
    Button,
    Divider,
    IconButton,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import {
    BlueprintProvider,
    generateSubmodelViewObject,
    useBlueprintContext,
} from 'app/[locale]/templates/_components/blueprint-edit/BlueprintContext';
import { BlueprintEditFields } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditFields';
import { BlueprintEditTree } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditTree';
import { BlueprintDeleteDialog } from 'app/[locale]/templates/_components/BlueprintDeleteDialog';
import { useEnv } from 'app/EnvProvider';
import { PrivateRoute } from 'components/authentication/PrivateRoute';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { HealthCheckIndicator } from 'components/basics/HealthCheckIndicator';
import { useHealthCheckContext } from 'components/contexts/HealthCheckContext';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useAuth } from 'lib/hooks/UseAuth';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useShowError } from 'lib/hooks/UseShowError';
import { AasGeneratorApiVersion } from 'lib/services/aas-generator/aasGeneratorVersioning';
import {
    deleteBlueprintById,
    getBlueprintById,
    updateBlueprint,
} from 'lib/services/aas-generator/blueprintsApiActions';
import { getTemplates } from 'lib/services/aas-generator/templatesApiActions';
import { useLocale, useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
    return (
        <BlueprintProvider>
            <TemplateBuilderContent />
        </BlueprintProvider>
    );
}

function TemplateBuilderContent() {
    const { id } = useParams<{ id: string }>();
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useRouter();
    const auth = useAuth();
    const bearerToken = auth.getBearerToken();
    const env = useEnv();
    const { healthStatus } = useHealthCheckContext();
    const apiVersion = (healthStatus?.entries?.application_info?.data?.apiVersion ??
        AasGeneratorApiVersion.V1) as AasGeneratorApiVersion;
    const { showError } = useShowError();
    const t = useTranslations('pages.templates');
    const locale = useLocale();
    const { fetchHealthCheck } = useHealthCheckContext();

    const {
        setBlueprint,
        setTemplates,
        resetChanged,
        toSubmodel,
        changesMade,
        blueprintDisplayName,
        templateSemanticId,
    } = useBlueprintContext();

    const fetchBlueprint = async () => {
        if (!id) return;
        const custom = await getBlueprintById(id, apiVersion);
        if (custom.isSuccess) {
            setBlueprint(generateSubmodelViewObject(custom.result, locale));
        } else showError(custom.message);
    };

    const fetchTemplates = async () => {
        const result = await getTemplates(apiVersion);
        if (result.isSuccess) {
            setTemplates(result.result);
        } else {
            showError(result.message);
        }
    };

    useAsyncEffect(async () => {
        const _fetchCustom = async () => {
            try {
                setIsLoading(true);
                if (bearerToken || !env.AUTHENTICATION_FEATURE_FLAG) {
                    await fetchTemplates();
                    await fetchBlueprint();
                }
            } catch (e) {
                showError(e);
            } finally {
                setIsLoading(false);
            }
        };

        await _fetchCustom();
    }, [id, bearerToken]);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };

    const handleRevertClick = async () => {
        try {
            setIsLoading(true);
            await fetchBlueprint();
            resetChanged();
            handleMenuClose();
        } catch (e) {
            showError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBlueprint = async () => {
        if (!id) return;
        try {
            await deleteBlueprintById(id, apiVersion);
            notificationSpawner.spawn({
                message: t('blueprintDeletedSuccessfully'),
                severity: 'success',
            });
            navigate.push('/templates');
        } catch (e) {
            showError(e);
        }
    };

    const onSaveChanges = async () => {
        const submodel = toSubmodel();
        if (!submodel) return;

        setIsSaving(true);
        const updateResponse = await updateBlueprint(submodel, submodel.id, apiVersion);
        if (!updateResponse.isSuccess) {
            showError(updateResponse.message);
        } else {
            handleSuccessfulSave();
        }
        setIsSaving(false);
    };

    const handleSuccessfulSave = () => {
        notificationSpawner.spawn({
            severity: 'success',
            message: t('messages.changesSavedSuccessfully'),
        });
        resetChanged();
    };

    return (
        <PrivateRoute currentRoute={'/templates'}>
            <Box sx={{ p: 3, maxWidth: '1125px', width: '100%', margin: '0 auto' }}>
                <Breadcrumbs
                    links={[
                        {
                            label: t('title'),
                            path: '/templates',
                        },
                    ]}
                />
                <Box sx={{ display: 'flex', mb: 3 }}>
                    <Box sx={{ minWidth: '50%' }}>
                        <Typography variant="h2" color="primary" sx={{ my: 1 }}>
                            {/* TODO: Make this editable as an input field */}
                            {isLoading ? <Skeleton width="40%" /> : blueprintDisplayName || ''}
                        </Typography>
                        <Typography color="text.secondary">
                            {isLoading ? <Skeleton width="60%" /> : templateSemanticId}
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="outlined"
                                startIcon={<ContentCopy />}
                                onClick={() => {
                                    navigator.clipboard.writeText(id || '');
                                    notificationSpawner.spawn({
                                        message: t('blueprintIdCopied', { id }),
                                        severity: 'success',
                                    });
                                }}
                                style={{ marginRight: '1rem' }}
                            >
                                {t('copyBlueprintId')}
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<CloudUploadOutlined />}
                                disabled={!changesMade}
                                loading={isSaving}
                                onClick={onSaveChanges}
                                data-testid="save-changes-button"
                            >
                                {t('actions.saveChanges')}
                            </Button>
                            <IconButton
                                sx={{ ml: 1 }}
                                onClick={handleMenuClick}
                                className="more-button"
                                data-testid="more-options-button"
                            >
                                <MoreVert />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleMenuClose}
                                data-testid="more-options-menu"
                            >
                                <MenuItem onClick={handleRevertClick} disabled={!changesMade}>
                                    <ListItemIcon>
                                        <Restore fontSize="small" />
                                    </ListItemIcon>
                                    {t('actions.revertChanges').toUpperCase()}
                                </MenuItem>
                                <MenuItem onClick={handleDeleteClick} data-testid="delete-template-button">
                                    <ListItemIcon>
                                        <Delete fontSize="small" />
                                    </ListItemIcon>
                                    {t('actions.delete').toUpperCase()}
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Box>
                <Box mb={3}>
                    <Divider />
                    <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                        <Typography variant="h6">{t('healthCheck.label')}</Typography>
                        <HealthCheckIndicator />
                        <IconButton
                            onClick={fetchHealthCheck}
                            size="small"
                            sx={{ ml: 0 }}
                            title={t('healthCheck.refresh')}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Link
                        href="https://github.com/eclipse-mnestix/mnestix-browser/wiki/Mnestix-AAS-Generator-Dataingest-and-Blueprints"
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        {t('docsLink')}
                    </Link>
                </Box>
                <Paper sx={{ display: 'flex', maxHeight: 'calc(100vh - 220px)', overflow: 'hidden' }}>
                    <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width="50%" />
                                {[0, 1, 2].map((i) => (
                                    <Skeleton key={i} variant="text" width="70%" sx={{ ml: 4, my: 2 }} />
                                ))}
                            </>
                        ) : (
                            <BlueprintEditTree />
                        )}
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                        {isLoading ? (
                            <>
                                <Skeleton variant="text" width="80%" sx={{ my: 2 }} />
                                <Skeleton variant="text" width="50%" />
                            </>
                        ) : (
                            <BlueprintEditFields />
                        )}
                    </Box>
                </Paper>
                <BlueprintDeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onDelete={() => deleteBlueprint()}
                    itemName={blueprintDisplayName}
                />
            </Box>
        </PrivateRoute>
    );
}
