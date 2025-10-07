'use client';

import { PrivateRoute } from 'components/authentication/PrivateRoute';
import { CheckCircle, CloudUploadOutlined, ContentCopy, Delete, MoreVert, Restore } from '@mui/icons-material';
import {
    Box,
    Button,
    Divider,
    Fade,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import { Breadcrumbs } from 'components/basics/Breadcrumbs';
import { BlueprintEditTree } from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditTree';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import React, { useEffect, useState } from 'react';
import {
    generateSubmodelViewObjectFromSubmodelElement,
    getParentOfElement,
    rewriteNodeIds,
    splitIdIntoArray,
    updateNodeIds,
} from 'lib/util/submodelHelpers/SubmodelViewObjectUtil';
import {
    BlueprintEditFields,
    BlueprintEditFieldsProps,
} from 'app/[locale]/templates/_components/blueprint-edit/BlueprintEditFields';
import { useAuth } from 'lib/hooks/UseAuth';
import cloneDeep from 'lodash/cloneDeep';
import { Qualifier, Submodel, SubmodelElementChoice, SubmodelElementCollection } from 'lib/api/aas/models';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useEnv } from 'app/EnvProvider';
import { useParams, useRouter } from 'next/navigation';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { updateBlueprint } from 'lib/services/templateApiWithAuthActions';
import { deleteBlueprintById, getBlueprintById, getTemplates } from 'lib/services/templatesApiActions';
import { BlueprintDeleteDialog } from 'app/[locale]/templates/_components/BlueprintDeleteDialog';
import { clone } from 'lodash';
import { useShowError } from 'lib/hooks/UseShowError';
import { useLocale, useTranslations } from 'next-intl';

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const [localFrontendBlueprint, setLocalFrontendBlueprint] = useState<SubmodelViewObject | undefined>();
    const [blueprintDisplayName, setBlueprintDisplayName] = useState<string>();
    const notificationSpawner = useNotificationSpawner();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [wasRecentlySaved, setWasRecentlySaved] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editFieldsProps, setEditFieldsProps] = useState<BlueprintEditFieldsProps>();
    const navigate = useRouter();
    const auth = useAuth();
    const bearerToken = auth.getBearerToken();
    const [deletedItems, setDeletedItems] = useState<string[]>([]);
    const [templates, setTemplates] = useState<Submodel[]>();
    const env = useEnv();
    const { showError } = useShowError();
    const t = useTranslations('pages.templates');
    const locale = useLocale();

    const fetchBlueprint = async () => {
        if (!id) return;
        const custom = await getBlueprintById(id);
        if (custom.isSuccess) {
            setLocalFrontendBlueprint(generateSubmodelViewObject(custom.result));
        } else showError(custom.message);
    };

    function generateSubmodelViewObject(sm: Submodel): SubmodelViewObject {
        const localSm = cloneDeep(sm);
        // Ids are unique for the tree, start with 0, children have 0-0, 0-1, and so on
        const frontend: SubmodelViewObject = {
            id: '0',
            name: localSm.idShort!,
            children: [],
            isAboutToBeDeleted: false,
        };

        if (localSm.submodelElements) {
            const arr = localSm.submodelElements;
            arr.forEach((el, i) =>
                frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(el, '0-' + i, locale)),
            );
            localSm.submodelElements = [];
        }
        frontend.data = localSm;

        return frontend;
    }

    const fetchTemplates = async () => {
        const templates = await getTemplates();
        if (templates.isSuccess) {
            setTemplates(templates.result);
        } else {
            showError(templates.message);
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

    useEffect(() => {
        // get displayName out of Qualifiers or use idShort of Submodel
        setBlueprintDisplayName(
            localFrontendBlueprint?.data?.qualifiers?.find((q: Qualifier) => {
                return q.type === 'displayName';
            })?.value || localFrontendBlueprint?.data?.idShort,
        );
    }, [localFrontendBlueprint]);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        handleMenuClose();
        openDialog();
    };

    const handleRevertClick = async () => {
        try {
            setIsLoading(true);
            await fetchBlueprint();
            setChangesMade(false);
            handleMenuClose();
        } catch (e) {
            showError(e);
        } finally {
            setIsLoading(false);
        }
    };
    const openDialog = () => {
        setDeleteDialogOpen(true);
    };

    const closeDialog = () => {
        setDeleteDialogOpen(false);
    };

    // TODO: reuse method from TemplateView
    const deleteBlueprint = async () => {
        if (!id) return;
        try {
            await deleteBlueprintById(id);
            notificationSpawner.spawn({
                message: t('blueprintDeletedSuccessfully'),
                severity: 'success',
            });
            navigate.push('/templates');
        } catch (e) {
            showError(e);
        }
    };

    const onSelectionChange = (treePart: SubmodelViewObject, onTreePartChange: (tree: SubmodelViewObject) => void) => {
        if (editFieldsProps?.blueprintPart?.id !== treePart.id) {
            setEditFieldsProps({
                blueprintPart: treePart,
                onBlueprintPartChange: onTreePartChange,
                updateBlueprintPart: updateBlueprintPart,
            });
        }
    };

    const onTemplateChange = (template: SubmodelViewObject, deletedItemIds?: string[]) => {
        setChangesMade(true);
        setLocalFrontendBlueprint(template);
        if (deletedItemIds) {
            setDeletedItems(deletedItemIds);
        }
        //Update about to be deleted here
        if (editFieldsProps?.blueprintPart?.id) {
            if (deletedItemIds?.includes(editFieldsProps?.blueprintPart?.id)) {
                const newTemplatePart = cloneDeep(editFieldsProps.blueprintPart);
                newTemplatePart.isAboutToBeDeleted = true;
                setEditFieldsProps({ ...editFieldsProps, blueprintPart: newTemplatePart });
            } else if (editFieldsProps.blueprintPart.isAboutToBeDeleted) {
                const newTemplatePart = cloneDeep(editFieldsProps.blueprintPart);
                newTemplatePart.isAboutToBeDeleted = false;
                setEditFieldsProps({ ...editFieldsProps, blueprintPart: newTemplatePart });
            }
        }
    };

    const updateBlueprintPart = (blueprintPart: SubmodelViewObject, onChange: (obj: SubmodelViewObject) => void) => {
        setEditFieldsProps({
            ...editFieldsProps,
            blueprintPart: blueprintPart,
            onBlueprintPartChange: onChange,
            updateBlueprintPart: updateBlueprintPart,
        });
    };

    const onSaveChanges = async () => {
        let updatedBlueprint;
        if (deletedItems) {
            updatedBlueprint = await deleteElements();
            setDeletedItems([]);
        } else {
            updatedBlueprint = localFrontendBlueprint;
        }
        if (updatedBlueprint) {
            try {
                setIsSaving(true);
                const submodel = generateSubmodel(updatedBlueprint);
                await updateBlueprint(submodel, submodel.id);
                handleSuccessfulSave();
                setLocalFrontendBlueprint(updatedBlueprint);
            } catch (e) {
                showError(e);
            } finally {
                setIsSaving(false);
            }
        }
    };

    function generateSubmodel(viewObject: SubmodelViewObject): Submodel {
        const submodel = viewObject.data as Submodel;
        if (viewObject.children.length) {
            submodel.submodelElements = [];
            viewObject.children.forEach((child) => {
                if (child.children.length) {
                    const collection = child.data as SubmodelElementCollection;
                    collection.value = generateSubmodelElements(child.children);
                    child.data = collection;
                }
                submodel.submodelElements?.push(child.data as SubmodelElementChoice);
            });
        }
        return submodel;
    }

    function generateSubmodelElements(viewObjects: SubmodelViewObject[]): SubmodelElementChoice[] {
        return viewObjects.map((vo) => {
            if (vo.children.length) {
                const collection = vo.data as SubmodelElementCollection;
                collection.value = generateSubmodelElements(vo.children);
                vo.data = collection;
            }
            return vo.data as SubmodelElementChoice;
        });
    }

    async function deleteElements() {
        if (localFrontendBlueprint) {
            let newLocalFrontendBlueprint = cloneDeep(localFrontendBlueprint);
            for (const nodeId of deletedItems) {
                newLocalFrontendBlueprint = deleteItem(nodeId, newLocalFrontendBlueprint);
            }
            await rewriteNodeIds(newLocalFrontendBlueprint, '0');
            return newLocalFrontendBlueprint;
        }
        return undefined;
    }

    function deleteItem(elementToDeleteId: string, submodel: SubmodelViewObject): SubmodelViewObject {
        const idArray = splitIdIntoArray(elementToDeleteId);
        const parentElement = getParentOfElement(elementToDeleteId, submodel);
        if (parentElement) {
            //search for the current index of the element to delete because through deleting, the arrays shift
            let childIndex = -1;
            parentElement.children.filter((el, index) => {
                if ((el as SubmodelViewObject).id == idArray.join('-')) {
                    childIndex = index;
                }
            });
            if (childIndex >= 0) {
                parentElement.children.splice(childIndex, 1);
            }
            //update all element ids after the deleted one
            for (let i = idArray[idArray.length - 1]; i < parentElement.children.length; i++) {
                const oldId = clone(idArray);
                oldId[oldId.length - 1] = i + 1;
                const newId = clone(idArray);
                newId[newId.length - 1] = i;
                updateNodeIds(oldId.join('-'), newId.join('-'), parentElement.children[i]);
            }
        }
        return submodel;
    }

    const handleSuccessfulSave = () => {
        notificationSpawner.spawn({
            severity: 'success',
            message: t('messages.changesSavedSuccessfully'),
        });
        setChangesMade(false);
        setWasRecentlySaved(true);
        setTimeout(() => {
            setWasRecentlySaved(false);
        }, 3000);
    };

    function isBasedOnCustomTemplate(template: SubmodelViewObject | undefined): boolean | undefined {
        let returnValue: boolean | undefined;
        if (template) {
            const id = template.data?.semanticId?.keys?.[0]?.value;
            if (id && templates) {
                returnValue = true;
                for (const d of templates) {
                    if (id == d.semanticId?.keys?.[0]?.value) {
                        returnValue = false;
                    }
                }
            }
        }
        return returnValue;
    }

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
                            {isLoading ? (
                                <Skeleton width="60%" />
                            ) : (
                                !!localFrontendBlueprint?.data?.semanticId?.keys?.[0]?.value &&
                                localFrontendBlueprint.data?.semanticId.keys[0].value
                            )}
                        </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Fade in={wasRecentlySaved} timeout={500}>
                                <CheckCircle color="success" sx={{ mr: 1 }} />
                            </Fade>
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
                            <BlueprintEditTree
                                rootTree={localFrontendBlueprint}
                                onTreeChange={onTemplateChange}
                                onSelectionChange={onSelectionChange}
                            />
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
                            <BlueprintEditFields
                                {...editFieldsProps}
                                isBasedOnCustomTemplate={isBasedOnCustomTemplate(localFrontendBlueprint)}
                            />
                        )}
                    </Box>
                </Paper>
                <BlueprintDeleteDialog
                    open={deleteDialogOpen}
                    onClose={closeDialog}
                    onDelete={() => deleteBlueprint()}
                    itemName={blueprintDisplayName}
                />
            </Box>
        </PrivateRoute>
    );
}
