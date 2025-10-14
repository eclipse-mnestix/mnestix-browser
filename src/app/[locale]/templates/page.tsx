'use client';

import { PrivateRoute } from 'components/authentication/PrivateRoute';
import { Add, FolderOutlined } from '@mui/icons-material';
import { Box, Button, Divider, Paper, Skeleton, Typography } from '@mui/material';
import { TabSelectorItem, VerticalTabSelector } from 'components/basics/VerticalTabSelector';
import { ViewHeading } from 'components/basics/ViewHeading';
import { ChooseTemplateDialog } from './_components/ChooseTemplateDialog';
import { BlueprintItem, BlueprintItemType } from 'app/[locale]/templates/_components/BlueprintItem';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useState } from 'react';
import { useShowError } from 'lib/hooks/UseShowError';
import TemplatesInfoGraphic from 'assets/templates_infographic.svg';
import EmptyDefaultTemplate from 'assets/submodels/defaultEmptySubmodel.json';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useAuth } from 'lib/hooks/UseAuth';
import { Qualifier, Submodel } from 'lib/api/aas/models';
import { sortWithNullableValues } from 'lib/util/SortingUtil';
import { useEnv } from 'app/EnvProvider';
import { useRouter } from 'next/navigation';
import { createBlueprint } from 'lib/services/aas-generator/blueprintsApiActions';
import { getTemplates } from 'lib/services/aas-generator/templatesApiActions';
import { deleteBlueprintById, getBlueprints } from 'lib/services/aas-generator/blueprintsApiActions';
import { useTranslations } from 'next-intl';
import { findSemanticIdOfType } from 'lib/util/SubmodelResolverUtil';

enum SpecialDefaultTabIds {
    All = 'all',
    Custom = 'custom',
}

export default function Page() {
    const t = useTranslations('pages.templates');
    const env = useEnv();
    const navigate = useRouter();
    const notificationSpawner = useNotificationSpawner();
    const [templates, setTemplates] = useState<Submodel[]>();
    const [templateItems, setTemplateItems] = useState<Array<TabSelectorItem>>([]);
    const [blueprintItems, setBlueprintItems] = useState<Array<BlueprintItemType>>([]);
    const [filteredBlueprintItems, setFilteredBlueprintItems] = useState<Array<BlueprintItemType>>();
    const [selectedEntry, setSelectedEntry] = useState<TabSelectorItem>({
        id: SpecialDefaultTabIds.All,
        label: t('all'),
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingBlueprint, setIsCreatingBlueprint] = useState(false);
    const [chooseTemplateDialogOpen, setChooseTemplateDialogOpen] = useState(false);

    const auth = useAuth();
    const bearerToken = auth.getBearerToken();

    const { showError } = useShowError();
    const templateApiVersion = 'v1'; // TODO get from Context

    const fetchTemplatesAndBlueprints = async () => {
        const _templateItems: TabSelectorItem[] = [];
        // fetching defaults first
        const _templates = await getTemplates(templateApiVersion);
        if (!_templates.result?.length) {
            notificationSpawner.spawn({
                message: t('noTemplatesWarning'),
                severity: 'warning',
            });
        } else {
            _templates.result?.sort((a: Submodel, b: Submodel) => sortWithNullableValues(a.idShort, b.idShort));
            setTemplates(_templates.result);
            _templates.result?.forEach((template) => {
                // In v3 submodel is identified by id, so we assume that it will always have an Id.
                const id =
                    findSemanticIdOfType(['Submodel', 'GlobalReference'], template.semanticId?.keys) ||
                    template.idShort;
                if (id) {
                    _templateItems.push({
                        id,
                        label: `${template.idShort} V${template.administration?.version ?? '-'}.${template.administration?.revision ?? '-'}`,
                        startIcon: <FolderOutlined fontSize="small" />,
                    });
                }
            });
            _templateItems.sort((a: TabSelectorItem, b: TabSelectorItem) => a.label.localeCompare(b.label));
        }

        // adding 'all' defaultItem at the beginning of the list
        _templateItems.unshift({
            id: SpecialDefaultTabIds.All,
            label: t('all'),
        });
        // the 'custom' defaultItem should always the last one in the list
        _templateItems.push({
            id: SpecialDefaultTabIds.Custom,
            label: t('custom'),
            startIcon: <FolderOutlined fontSize="small" />,
        });
        setTemplateItems(_templateItems);
        // fetching blueprints, which need template items to be mapped to their ids
        await fetchBlueprints(_templateItems);
    };

    const fetchBlueprints = async (_defaultItems: Array<TabSelectorItem>) => {
        const _blueprintItems: BlueprintItemType[] = [];
    const customs = (await getBlueprints(templateApiVersion)).result as Submodel[];
        if (!customs?.length) {
            notificationSpawner.spawn({
                message: t('noBlueprintsWarning'),
                severity: 'warning',
            });
        }
        customs?.forEach((customSubmodel: Submodel) => {
            // get displayName out of Qualifiers or use idShort of Submodel
            const displayName =
                customSubmodel.qualifiers?.find((q: Qualifier) => {
                    return q.type === 'displayName';
                })?.value || customSubmodel.idShort;
            // get identifier for link to edit page
            const id = customSubmodel.id;
            // match semanticIds with defaults to get basedOnTemplate label
            let basedOnTemplate = t('custom');
            let basedOnTemplateId = '';
            let templateMatched = false;
            for (const semId of customSubmodel.semanticId?.keys || []) {
                if (templateMatched) {
                    break;
                }
                for (const i of _defaultItems) {
                    if (semId.value === i.id && i.label) {
                        basedOnTemplate = i.label;
                        basedOnTemplateId = i.id;
                        templateMatched = true;
                        break;
                    }
                }
            }

            _blueprintItems.push({
                displayName,
                basedOnTemplate,
                basedOnTemplateId,
                id,
            });
        });
        _blueprintItems.sort((a: BlueprintItemType, b: BlueprintItemType) =>
            sortWithNullableValues(a.displayName, b.displayName),
        );
        setBlueprintItems(_blueprintItems);
        if (selectedEntry.id === SpecialDefaultTabIds.All) {
            setFilteredBlueprintItems(_blueprintItems);
        }
    };

    async function _fetchAll() {
        try {
            setIsLoading(true);
            await fetchTemplatesAndBlueprints();
        } catch (e) {
            showError(e);
        } finally {
            setIsLoading(false);
        }
    }

    // Fetch initially
    useAsyncEffect(async () => {
        if (bearerToken || !env.AUTHENTICATION_FEATURE_FLAG) {
            await _fetchAll();
        }
    }, [bearerToken]);

    // Filtering items
    useAsyncEffect(async () => {
        // TODO: This shouldn't happen in the frontend later on, should happen via API calls
        if (blueprintItems.length) {
            switch (selectedEntry.id) {
                case SpecialDefaultTabIds.All:
                    // show all
                    setFilteredBlueprintItems(blueprintItems);
                    break;
                case SpecialDefaultTabIds.Custom:
                    // show all not included in defaults
                    setFilteredBlueprintItems(
                        blueprintItems.filter((item) => {
                            for (const defItem of templateItems) {
                                if (item.basedOnTemplateId === defItem.id) {
                                    return false;
                                }
                            }
                            return true;
                        }),
                    );
                    break;
                default:
                    // show all matching with id
                    setFilteredBlueprintItems(
                        blueprintItems.filter((item) => item.basedOnTemplateId === selectedEntry.id),
                    );
            }
        }
    }, [selectedEntry, blueprintItems, templateItems]);

    const handleCreateTemplateClick = async (template?: Submodel) => {
        setIsCreatingBlueprint(true);
        try {
            const newId = await createBlueprint(template || EmptyDefaultTemplate, templateApiVersion);
            setIsCreatingBlueprint(false);
            navigate.push(`/templates/${encodeURIComponent(newId)}`);
        } catch (e) {
            setIsCreatingBlueprint(false);
            showError(e);
        }
    };

    const deleteTemplate = async (item: BlueprintItemType) => {
        if (!item.id) return;
        try {
            await deleteBlueprintById(item.id, templateApiVersion);
            notificationSpawner.spawn({
                message: t('blueprintDeletedSuccessfully'),
                severity: 'success',
            });
            await fetchBlueprints(templateItems);
        } catch (e) {
            showError(e);
        }
    };

    return (
        <PrivateRoute currentRoute={'/templates'}>
            <Box sx={{ p: 3, maxWidth: '1125px', width: '100%', margin: '0 auto' }} data-testid="templates-route-page">
                <Box
                    sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    data-testid="templates-header"
                >
                    <ViewHeading title={t('title')} />
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        sx={{ mb: 1 }}
                        onClick={() => setChooseTemplateDialogOpen(true)}
                        data-testid="create-new-template-button"
                    >
                        {t('createNew')}
                    </Button>
                    <ChooseTemplateDialog
                        open={chooseTemplateDialogOpen}
                        onClose={() => setChooseTemplateDialogOpen(false)}
                        templates={templates}
                        isLoading={isCreatingBlueprint}
                        handleTemplateClick={handleCreateTemplateClick}
                    />
                </Box>
                <Paper sx={{ p: 2, width: '100%', display: 'flex' }}>
                    <Box sx={{ minWidth: '340px', flex: '1', mr: 3 }}>
                        {templateItems.length && !isLoading ? (
                            <VerticalTabSelector
                                items={templateItems}
                                selected={selectedEntry}
                                setSelected={setSelectedEntry}
                            />
                        ) : (
                            [0, 1, 2].map((i) => {
                                return <Skeleton variant="rectangular" key={i} height={50} sx={{ mb: 2 }} />;
                            })
                        )}
                    </Box>
                    <Box sx={{ ml: 3, width: '100%' }}>
                        {!!filteredBlueprintItems?.length &&
                            !isLoading &&
                            filteredBlueprintItems.map((item, index) => {
                                return (
                                    <BlueprintItem
                                        key={index}
                                        item={item}
                                        hasDivider={index + 1 < filteredBlueprintItems.length}
                                        onDelete={() => deleteTemplate(item)}
                                    />
                                );
                            })}
                        {filteredBlueprintItems?.length === 0 && !isLoading && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
                                <Typography align="center" variant="h3" color="text.secondary">
                                    {t('noBlueprintsFound')}
                                </Typography>
                                <TemplatesInfoGraphic style={{ display: 'block', maxWidth: '250px' }} />
                                <Typography sx={{ maxWidth: '350px' }} align="center" color="text.secondary">
                                    {t('blueprintUseExplanation')}
                                </Typography>
                            </Box>
                        )}
                        {!filteredBlueprintItems &&
                            [0, 1, 2].map((i) => {
                                return (
                                    <Box sx={{ my: 2 }} key={i}>
                                        <Skeleton variant="text" width="50%" />
                                        <Skeleton variant="text" width="30%" />
                                        {i < 2 && <Divider sx={{ mt: 2 }} />}
                                    </Box>
                                );
                            })}
                    </Box>
                </Paper>
            </Box>
        </PrivateRoute>
    );
}
