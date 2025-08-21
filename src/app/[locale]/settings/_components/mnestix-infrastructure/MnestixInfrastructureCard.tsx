import React, { useEffect, useState } from 'react';
import { alpha, Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { CardHeading } from 'components/basics/CardHeading';
import { useTranslations } from 'next-intl';
import Divider from '@mui/material/Divider';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import {
    createInfrastructureAction,
    deleteInfrastructureAction,
    getInfrastructuresAction,
    updateInfrastructureAction,
} from 'lib/services/database/connectionServerActions';
import MnestixInfrastructureForm from './MnestixInfrastructureForm';
import { InfrastructureDeleteDialog } from './InfrastructureDeleteDialog';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import type { InfrastructureWithRelations, MappedInfrastructure } from './InfrastructureTypes';
import { CenteredLoadingSpinner } from 'components/basics/CenteredLoadingSpinner';
import { DefaultInfrastructure } from 'app/[locale]/settings/_components/mnestix-infrastructure/DefaultInfrastructure';

function MnestixInfrastructureCard() {
    const t = useTranslations('pages.settings.infrastructure');
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [infrastructures, setInfrastructures] = useState<MappedInfrastructure[]>([]);
    const [editingInfrastructure, setEditingInfrastructure] = useState<string | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [infrastructureToDelete, setInfrastructureToDelete] = useState<{ id: string; name: string } | null>(null);
    const notificationSpawner = useNotificationSpawner();

    function mapInfrastructureData(infrastructures: InfrastructureWithRelations[]): MappedInfrastructure[] {
        return infrastructures.map((infrastructure) => ({
            id: infrastructure.id,
            name: infrastructure.name,
            logo: infrastructure.logo || undefined,
            securityType: infrastructure.securityType.typeName,
            connections: infrastructure.connections.map((connection) => ({
                id: connection.id,
                url: connection.url,
                types: connection.types.map((typeRelation) => typeRelation.type.typeName),
            })),
            securityHeader: infrastructure.securitySettingsHeaders[0]
                ? {
                      name: infrastructure.securitySettingsHeaders[0].headerName,
                      value: infrastructure.securitySettingsHeaders[0].headerValue,
                  }
                : undefined,
            securityProxy: infrastructure.securitySettingsProxies[0]
                ? {
                      value: infrastructure.securitySettingsProxies[0].headerValue,
                  }
                : undefined,
        }));
    }

    async function getInfrastructureData() {
        try {
            setIsLoading(true);
            const rawData = await getInfrastructuresAction();
            if (rawData) {
                const mappedData = mapInfrastructureData(rawData);
                setInfrastructures(mappedData);
                return mappedData;
            }
        } catch (error) {
            notificationSpawner.spawn({
                message: String(error),
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
        return [];
    }

    function handleEdit(infrastructureId: string) {
        setEditingInfrastructure(infrastructureId);
        setIsCreatingNew(false);
    }

    function handleCancelEdit() {
        setEditingInfrastructure(null);
        setIsCreatingNew(false);
    }

    function handleCreateNew() {
        setIsCreatingNew(true);
        setEditingInfrastructure(null);
    }

    async function handleSaveEdit(infrastructureData: MappedInfrastructure) {
        try {
            setIsLoading(true);
            if (infrastructureData.id) {
                await updateInfrastructureAction(infrastructureData);
            } else {
                await createInfrastructureAction(infrastructureData);
            }

            notificationSpawner.spawn({
                message: t('form.saveSuccess'),
                severity: 'success',
            });

            setEditingInfrastructure(null);
            setIsCreatingNew(false);

            await getInfrastructureData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            notificationSpawner.spawn({
                message: `${t('form.saveError')}: ${errorMessage}`,
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }

    function handleDeleteClick(infrastructureId: string, infrastructureName: string) {
        setInfrastructureToDelete({ id: infrastructureId, name: infrastructureName });
        setDeleteDialogOpen(true);
    }

    function handleCloseDeleteDialog() {
        setDeleteDialogOpen(false);
        setInfrastructureToDelete(null);
    }

    async function handleDeleteConfirm() {
        if (!infrastructureToDelete) return;

        try {
            setIsLoading(true);
            await deleteInfrastructureAction(infrastructureToDelete.id);

            notificationSpawner.spawn({
                message: t('form.deleteSuccess', { name: infrastructureToDelete.name }),
                severity: 'success',
            });

            await getInfrastructureData();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            notificationSpawner.spawn({
                message: `${t('form.deleteError')}: ${errorMessage}`,
                severity: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    }

    function createEmptyInfrastructure(): MappedInfrastructure {
        return {
            id: '',
            name: '',
            logo: undefined,
            securityType: 'NONE',
            connections: [
                {
                    id: '',
                    url: '',
                    types: [],
                },
            ],
        };
    }

    function renderInfrastructureList() {
        if (isLoading) {
            return <CenteredLoadingSpinner />;
        }

        if (infrastructures.length === 0 && !isCreatingNew) {
            return <Typography sx={{ mt: 2 }}>{t('noInfrastructuresFound')}</Typography>;
        }

        return infrastructures.map((infrastructure) => (
            <Box
                key={infrastructure.id}
                sx={{ mb: 1, border: `1px solid ${theme.palette.grey['300']}`, borderRadius: 1 }}
            >
                <Box
                    sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 1,
                        p: 2,
                        '&:hover': {
                            backgroundColor: theme.palette.grey['100'],
                        },
                        cursor: 'default',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                        {infrastructure.logo && (
                            <Image
                                src={infrastructure.logo}
                                alt={`${infrastructure.name} logo`}
                                width={32}
                                height={32}
                                style={{
                                    objectFit: 'contain',
                                }}
                            />
                        )}
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {infrastructure.name}
                        </Typography>
                        <IconButton
                            onClick={() => handleEdit(infrastructure.id)}
                            size="small"
                            aria-label={`Edit ${infrastructure.name}`}
                            disabled={isCreatingNew}
                            sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                },
                            }}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteClick(infrastructure.id, infrastructure.name)}
                            size="small"
                            aria-label={`Delete ${infrastructure.name}`}
                            disabled={isCreatingNew || editingInfrastructure !== null}
                            sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                },
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>

                <Collapse in={editingInfrastructure === infrastructure.id} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 1 }}>
                        <MnestixInfrastructureForm
                            infrastructure={infrastructure}
                            onCancel={handleCancelEdit}
                            onSave={handleSaveEdit}
                            existingNames={infrastructures.map((infra) => infra.name)}
                        />
                    </Box>
                </Collapse>
            </Box>
        ));
    }

    useEffect(() => {
        getInfrastructureData();
    }, []);

    return (
        <Box sx={{ p: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <CardHeading title={t('title')} subtitle={t('subtitle')} />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateNew}
                    aria-label="Create new infrastructure"
                    disabled={isCreatingNew || editingInfrastructure !== null}
                >
                    {t('form.createNew')}
                </Button>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Collapse in={isCreatingNew} timeout="auto" unmountOnExit>
                <Box sx={{ mb: 2, pt: 2, border: `1px solid ${theme.palette.grey['300']}`, borderRadius: 1 }}>
                    <MnestixInfrastructureForm
                        infrastructure={createEmptyInfrastructure()}
                        onCancel={handleCancelEdit}
                        onSave={handleSaveEdit}
                        existingNames={infrastructures.map((infra) => infra.name)}
                    />
                </Box>
            </Collapse>

            <DefaultInfrastructure />

            {renderInfrastructureList()}

            <InfrastructureDeleteDialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                onDelete={handleDeleteConfirm}
            />
        </Box>
    );
}

export default MnestixInfrastructureCard;
