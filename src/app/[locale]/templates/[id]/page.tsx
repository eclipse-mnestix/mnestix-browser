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
import { TemplateEditTree } from '../_components/template-edit/TemplateEditTree';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { messages } from 'lib/i18n/localization';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
    updateNodeIds,
    getParentOfElement,
    splitIdIntoArray,
    rewriteNodeIds,
    generateSubmodelViewObjectFromSubmodelElement,
} from 'lib/util/SubmodelViewObjectUtil';
import { TemplateEditFields, TemplateEditFieldsProps } from '../_components/template-edit/TemplateEditFields';
import { useAuth } from 'lib/hooks/UseAuth';
import cloneDeep from 'lodash/cloneDeep';
import { Qualifier, Submodel } from '@aas-core-works/aas-core3.0-typescript/types';
import { useAsyncEffect } from 'lib/hooks/UseAsyncEffect';
import { useEnv } from 'app/env/provider';
import { useParams, useRouter } from 'next/navigation';
import { SubmodelViewObject } from 'lib/types/SubmodelViewObject';
import { updateCustomSubmodelTemplate } from 'lib/services/templateApiWithAuthActions';
import { deleteCustomTemplateById, getCustomTemplateById, getDefaultTemplates } from 'lib/services/templatesApiActions';
import { TemplateDeleteDialog } from 'app/[locale]/templates/_components/TemplateDeleteDialog';
import { ISubmodelElement, SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/dist/types/types';
import { clone } from 'lodash';
import { useShowError } from 'lib/hooks/UseShowError';

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const [localFrontendTemplate, setLocalFrontendTemplate] = useState<SubmodelViewObject | undefined>();
    const [templateDisplayName, setTemplateDisplayName] = useState<string | null>();
    const notificationSpawner = useNotificationSpawner();
    const intl = useIntl();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [wasRecentlySaved, setWasRecentlySaved] = useState(false);
    const [changesMade, setChangesMade] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editFieldsProps, setEditFieldsProps] = useState<TemplateEditFieldsProps>();
    const navigate = useRouter();
    const auth = useAuth();
    const bearerToken = auth.getBearerToken();
    const [deletedItems, setDeletedItems] = useState<string[]>([]);
    const [defaultTemplates, setDefaultTemplates] = useState<Submodel[]>();
    const env = useEnv();
    const { showError } = useShowError();

    const fetchCustom = async () => {
        if (!id) return;
        const custom = await getCustomTemplateById(id);
        setLocalFrontendTemplate(generateSubmodelViewObject(custom));
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
                frontend.children?.push(generateSubmodelViewObjectFromSubmodelElement(el, '0-' + i)),
            );
            localSm.submodelElements = [];
        }
        frontend.data = localSm;

        return frontend;
    }

    const fetchDefaultTemplates = async () => {
        const defaultTemplates = await getDefaultTemplates();
        setDefaultTemplates(defaultTemplates);
    };

    useAsyncEffect(async () => {
        const _fetchCustom = async () => {
            try {
                setIsLoading(true);
                if (bearerToken || !env.AUTHENTICATION_FEATURE_FLAG) {
                    await fetchDefaultTemplates();
                    await fetchCustom();
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
        setTemplateDisplayName(
            localFrontendTemplate?.data?.qualifiers?.find((q: Qualifier) => {
                return q.type === 'displayName';
            })?.value || localFrontendTemplate?.data?.idShort,
        );
    }, [localFrontendTemplate]);

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
            await fetchCustom();
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
    const deleteTemplate = async () => {
        if (!id) return;
        try {
            await deleteCustomTemplateById(id);
            notificationSpawner.spawn({
                message: intl.formatMessage(messages.mnestix.templateDeletedSuccessfully),
                severity: 'success',
            });
            navigate.push('/templates');
        } catch (e) {
            showError(e);
        }
    };

    const onSelectionChange = (treePart: SubmodelViewObject, onTreePartChange: (tree: SubmodelViewObject) => void) => {
        if (editFieldsProps?.templatePart?.id !== treePart.id) {
            setEditFieldsProps({ templatePart: treePart, onTemplatePartChange: onTreePartChange, updateTemplatePart });
        }
    };

    const onTemplateChange = (template: SubmodelViewObject, deletedItemIds?: string[]) => {
        setChangesMade(true);
        setLocalFrontendTemplate(template);
        if (deletedItemIds) {
            setDeletedItems(deletedItemIds);
        }
        //Update about to be deleted here
        if (editFieldsProps?.templatePart?.id) {
            if (deletedItemIds?.includes(editFieldsProps?.templatePart?.id)) {
                const newTemplatePart = cloneDeep(editFieldsProps.templatePart);
                newTemplatePart.isAboutToBeDeleted = true;
                setEditFieldsProps({ ...editFieldsProps, templatePart: newTemplatePart });
            } else if (editFieldsProps.templatePart.isAboutToBeDeleted) {
                const newTemplatePart = cloneDeep(editFieldsProps.templatePart);
                newTemplatePart.isAboutToBeDeleted = false;
                setEditFieldsProps({ ...editFieldsProps, templatePart: newTemplatePart });
            }
        }
    };

    const updateTemplatePart = (templatePart: SubmodelViewObject, onChange: (obj: SubmodelViewObject) => void) => {
        setEditFieldsProps({ ...editFieldsProps, templatePart, onTemplatePartChange: onChange, updateTemplatePart });
    };

    const onSaveChanges = async () => {
        let updatedTemplate;
        if (deletedItems) {
            updatedTemplate = await deleteElements();
            setDeletedItems([]);
        } else {
            updatedTemplate = localFrontendTemplate;
        }
        if (updatedTemplate) {
            try {
                setIsSaving(true);
                const submodel = generateSubmodel(updatedTemplate);
                await updateCustomSubmodelTemplate(submodel, submodel.id);
                handleSuccessfulSave();
                setLocalFrontendTemplate(updatedTemplate);
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
                submodel.submodelElements?.push(child.data as ISubmodelElement);
            });
        }
        return submodel;
    }

    function generateSubmodelElements(viewObjects: SubmodelViewObject[]): ISubmodelElement[] {
        return viewObjects.map((vo) => {
            if (vo.children.length) {
                const collection = vo.data as SubmodelElementCollection;
                collection.value = generateSubmodelElements(vo.children);
                vo.data = collection;
            }
            return vo.data as ISubmodelElement;
        });
    }

    async function deleteElements() {
        if (localFrontendTemplate) {
            let newLocalFrontendTemplate = cloneDeep(localFrontendTemplate);
            for (const nodeId of deletedItems) {
                newLocalFrontendTemplate = deleteItem(nodeId, newLocalFrontendTemplate);
            }
            await rewriteNodeIds(newLocalFrontendTemplate, '0');
            return newLocalFrontendTemplate;
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
            message: intl.formatMessage(messages.mnestix.changesSavedSuccessfully),
        });
        setChangesMade(false);
        setWasRecentlySaved(true);
        setTimeout(() => {
            setWasRecentlySaved(false);
        }, 3000);
    };

    function isCustomTemplate(template: SubmodelViewObject | undefined): boolean | undefined {
        let returnValue: boolean | undefined;
        if (template) {
            const id = template.data?.semanticId?.keys?.[0]?.value;
            if (id && defaultTemplates) {
                returnValue = true;
                for (const d of defaultTemplates) {
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
                            label: intl.formatMessage(messages.mnestix.templates),
                            path: '/templates',
                        },
                    ]}
                />
                <Box sx={{ display: 'flex', mb: 3 }}>
                    <Box sx={{ minWidth: '50%' }}>
                        <Typography variant="h2" color="primary" sx={{ my: 1 }}>
                            {/* TODO: Make this editable as an input field */}
                            {isLoading ? <Skeleton width="40%" /> : templateDisplayName || ''}
                        </Typography>
                        <Typography color="text.secondary">
                            {isLoading ? (
                                <Skeleton width="60%" />
                            ) : (
                                !!localFrontendTemplate?.data?.semanticId?.keys?.[0]?.value &&
                                localFrontendTemplate.data?.semanticId.keys[0].value
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
                                    navigator.clipboard.writeText(
                                        id || '',
                                    );
                                    notificationSpawner.spawn({
                                        message: intl.formatMessage(messages.mnestix.templateIdCopied, { id }),
                                        severity: 'success',
                                    });
                                }}
                                style={{ marginRight: '1rem' }}
                            >
                                {intl.formatMessage(messages.mnestix.copyTemplateId)}
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<CloudUploadOutlined />}
                                disabled={!changesMade}
                                loading={isSaving}
                                onClick={onSaveChanges}
                            >
                                <FormattedMessage {...messages.mnestix.saveChanges} />
                            </Button>
                            <IconButton sx={{ ml: 1 }} onClick={handleMenuClick} className="more-button">
                                <MoreVert />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
                                <MenuItem onClick={handleRevertClick} disabled={!changesMade}>
                                    <ListItemIcon>
                                        <Restore fontSize="small" />
                                    </ListItemIcon>
                                    <FormattedMessage {...messages.mnestix.revertChanges} />
                                </MenuItem>
                                <MenuItem onClick={handleDeleteClick}>
                                    <ListItemIcon>
                                        <Delete fontSize="small" />
                                    </ListItemIcon>
                                    <FormattedMessage {...messages.mnestix.delete} />
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
                            <TemplateEditTree
                                rootTree={localFrontendTemplate}
                                onTreeChange={onTemplateChange}
                                onSelectionChange={onSelectionChange}
                            />
                        )}
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                        <TemplateEditFields
                            {...editFieldsProps}
                            isCustomTemplate={isCustomTemplate(localFrontendTemplate)}
                        />
                    </Box>
                </Paper>
                <TemplateDeleteDialog
                    open={deleteDialogOpen}
                    onClose={closeDialog}
                    onDelete={() => deleteTemplate()}
                    itemName={templateDisplayName ?? null}
                />
            </Box>
        </PrivateRoute>
    );
}
