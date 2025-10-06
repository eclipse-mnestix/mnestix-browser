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
import { createCustomSubmodelTemplate } from 'lib/services/templateApiWithAuthActions';
import { deleteCustomTemplateById, getCustomTemplates, getDefaultTemplates } from 'lib/services/templatesApiActions';
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
    const [defaults, setDefaults] = useState<Submodel[]>();
    const [defaultItems, setDefaultItems] = useState<Array<TabSelectorItem>>([]);
    const [customItems, setCustomItems] = useState<Array<BlueprintItemType>>([]);
    const [filteredCustomItems, setFilteredCustomItems] = useState<Array<BlueprintItemType>>();
    const [selectedEntry, setSelectedEntry] = useState<TabSelectorItem>({
        id: SpecialDefaultTabIds.All,
        label: t('all'),
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
    const [chooseTemplateDialogOpen, setChooseTemplateDialogOpen] = useState(false);

    const auth = useAuth();
    const bearerToken = auth.getBearerToken();

    const { showError } = useShowError();
    const fetchAll = async () => {
        const _defaultItems: TabSelectorItem[] = [];
        // fetching defaults first
        const _defaults = await getDefaultTemplates();
        if (!_defaults.result?.length) {
            notificationSpawner.spawn({
                message: t('fetchDefaultsWarning'),
                severity: 'warning',
            });
        } else {
            _defaults.result?.sort((a: Submodel, b: Submodel) => sortWithNullableValues(a.idShort, b.idShort));
            setDefaults(_defaults.result);
            _defaults.result?.forEach((defaultTemplate) => {
                // In v3 submodel is identified by id, so we assume that it will always have an Id.
                const id =
                    findSemanticIdOfType(['Submodel', 'GlobalReference'], defaultTemplate.semanticId?.keys) ||
                    defaultTemplate.idShort;
                if (id) {
                    _defaultItems.push({
                        id,
                        label: `${defaultTemplate.idShort} V${defaultTemplate.administration?.version ?? '-'}.${defaultTemplate.administration?.revision ?? '-'}`,
                        startIcon: <FolderOutlined fontSize="small" />,
                    });
                }
            });
            _defaultItems.sort((a: TabSelectorItem, b: TabSelectorItem) => a.label.localeCompare(b.label));
        }

        // adding 'all' defaultItem at the beginning of the list
        _defaultItems.unshift({
            id: SpecialDefaultTabIds.All,
            label: t('all'),
        });
        // the 'custom' defaultItem should always the last one in the list
        _defaultItems.push({
            id: SpecialDefaultTabIds.Custom,
            label: t('custom'),
            startIcon: <FolderOutlined fontSize="small" />,
        });
        setDefaultItems(_defaultItems);
        // fetching customs, which need default items to be mapped to their ids
        await fetchCustoms(_defaultItems);
    };

    const fetchCustoms = async (_defaultItems: Array<TabSelectorItem>) => {
        const _customTemplateItems: BlueprintItemType[] = [];
        const customs = (await getCustomTemplates()).result as Submodel[];
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

            _customTemplateItems.push({
                displayName,
                basedOnTemplate,
                basedOnTemplateId,
                id,
            });
        });
        _customTemplateItems.sort((a: BlueprintItemType, b: BlueprintItemType) =>
            sortWithNullableValues(a.displayName, b.displayName),
        );
        setCustomItems(_customTemplateItems);
        if (selectedEntry.id === SpecialDefaultTabIds.All) {
            setFilteredCustomItems(_customTemplateItems);
        }
    };

    async function _fetchAll() {
        try {
            setIsLoading(true);
            await fetchAll();
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
        if (customItems.length) {
            switch (selectedEntry.id) {
                case SpecialDefaultTabIds.All:
                    // show all
                    setFilteredCustomItems(customItems);
                    break;
                case SpecialDefaultTabIds.Custom:
                    // show all not included in defaults
                    setFilteredCustomItems(
                        customItems.filter((item) => {
                            for (const defItem of defaultItems) {
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
                    setFilteredCustomItems(customItems.filter((item) => item.basedOnTemplateId === selectedEntry.id));
            }
        }
    }, [selectedEntry, customItems, defaultItems]);

    const handleCreateTemplateClick = async (template?: Submodel) => {
        setIsCreatingTemplate(true);
        try {
            const newId = await createCustomSubmodelTemplate(template || EmptyDefaultTemplate);
            setIsCreatingTemplate(false);
            navigate.push(`/templates/${encodeURIComponent(newId)}`);
        } catch (e) {
            setIsCreatingTemplate(false);
            showError(e);
        }
    };

    const deleteTemplate = async (item: BlueprintItemType) => {
        if (!item.id) return;
        try {
            await deleteCustomTemplateById(item.id);
            notificationSpawner.spawn({
                message: t('templateDeletedSuccessfully'),
                severity: 'success',
            });
            await fetchCustoms(defaultItems);
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
                        defaultTemplates={defaults}
                        isLoading={isCreatingTemplate}
                        handleTemplateClick={handleCreateTemplateClick}
                    />
                </Box>
                <Paper sx={{ p: 2, width: '100%', display: 'flex' }}>
                    <Box sx={{ minWidth: '340px', flex: '1', mr: 3 }}>
                        {defaultItems.length && !isLoading ? (
                            <VerticalTabSelector
                                items={defaultItems}
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
                        {!!filteredCustomItems?.length &&
                            !isLoading &&
                            filteredCustomItems.map((item, index) => {
                                return (
                                    <BlueprintItem
                                        key={index}
                                        item={item}
                                        hasDivider={index + 1 < filteredCustomItems.length}
                                        onDelete={() => deleteTemplate(item)}
                                    />
                                );
                            })}
                        {filteredCustomItems?.length === 0 && !isLoading && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', m: 2 }}>
                                <Typography align="center" variant="h3" color="text.secondary">
                                    {t('noTemplatesFound')}
                                </Typography>
                                <TemplatesInfoGraphic style={{ display: 'block', maxWidth: '250px' }} />
                                <Typography sx={{ maxWidth: '350px' }} align="center" color="text.secondary">
                                    {t('templatesUseExplanation')}
                                </Typography>
                            </Box>
                        )}
                        {!filteredCustomItems &&
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
