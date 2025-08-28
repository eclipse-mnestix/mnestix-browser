import * as React from 'react';
import { ArrowForward, InfoOutlined } from '@mui/icons-material';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import { Box, Button, IconButton, styled } from '@mui/material';
import { Entity, KeyTypes } from 'lib/api/aas/models';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { encodeBase64 } from 'lib/util/Base64Util';
import { EntityDetailsDialog } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/EntityDetailsDialog';
import { useTranslations } from 'next-intl';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';
import { useTreeItem, UseTreeItemParameters } from '@mui/x-tree-view/useTreeItem';
import {
    TreeItemCheckbox,
    TreeItemContent,
    TreeItemGroupTransition,
    TreeItemIconContainer,
    TreeItemRoot,
} from '@mui/x-tree-view/TreeItem';
import { TreeItemIcon } from '@mui/x-tree-view/TreeItemIcon';
import { TreeItemProvider } from '@mui/x-tree-view/TreeItemProvider';
import { ExpandableTreeitem } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/TreeItem';

const CustomTreeItemContent = styled(TreeItemContent)(({ theme }) => ({
    padding: theme.spacing(0.5, 1),
    borderBottom: `1px solid ${theme.palette.divider}`, // Add a bottom border
}));

interface ApplicationTreeItemProps
    extends Omit<UseTreeItemParameters, 'rootRef'>,
        Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {
    hasChildEntities: boolean;
    applicationUrl?: string;
    data?: Entity;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: ApplicationTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
) {
    const { id, itemId, label, disabled, children, hasChildEntities, applicationUrl, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,

        getGroupTransitionProps,
        status,
    } = useTreeItem({ id, itemId, children, label, disabled, rootRef: ref });

    const { aas } = useCurrentAasContext();
    const assetId = aas?.assetInformation.globalAssetId;
    const t = useTranslations('pages.aasViewer');
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

    const handleAssetNavigateClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        const win = window.open(applicationUrl + '?AssetId=' + (assetId ? encodeBase64(assetId) : ''), '_blank');
        if (win != null) {
            win.focus();
        }
    };

    const handleDetailsClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        setDetailsModalOpen(true);
    };

    const handleDetailsModalClose = () => {
        setDetailsModalOpen(false);
    };

    const dataIcon = hasChildEntities ? (
        <AssetIcon fontSize="small" color="primary" />
    ) : (
        <AppShortcutIcon fontSize="small" color="primary" />
    );

    return (
        <TreeItemProvider itemId={itemId} id={id}>
            <TreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent {...getContentProps()}>
                    <TreeItemIconContainer {...getIconContainerProps()}>
                        <TreeItemIcon status={status} />
                    </TreeItemIconContainer>
                    <TreeItemCheckbox {...getCheckboxProps()} />
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                        <ExpandableTreeitem dataIcon={dataIcon} itemId={itemId} label={label} {...other} />
                        <Box sx={{ ml: 'auto', pl: 1, display: 'flex' }}>
                            {!hasChildEntities && (
                                <>
                                    <IconButton sx={{ mr: 1 }} onClick={handleDetailsClick}>
                                        <InfoOutlined data-testid="entity-info-icon" sx={{ color: 'text.secondary' }} />
                                    </IconButton>
                                    <Button
                                        endIcon={<ArrowForward />}
                                        size="small"
                                        onClick={handleAssetNavigateClick}
                                        data-testid="view-asset-button"
                                    >
                                        {t('submodels.actions.open')}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </CustomTreeItemContent>
                {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
            </TreeItemRoot>
            {props.data && props.data.modelType === KeyTypes.Entity && (
                <EntityDetailsDialog
                    open={detailsModalOpen}
                    handleClose={handleDetailsModalClose}
                    entity={props.data as Entity}
                />
            )}
        </TreeItemProvider>
    );
});

export const ApplicationTreeItem = (props: ApplicationTreeItemProps) => {
    return <CustomTreeItem {...props} />;
};
