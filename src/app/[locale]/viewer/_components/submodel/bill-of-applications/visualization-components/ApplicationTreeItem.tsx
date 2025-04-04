import * as React from 'react';
import { ArrowForward, InfoOutlined } from '@mui/icons-material';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import { TreeItem, useTreeItemState } from '@mui/x-tree-view';
import { Box, Button, IconButton, styled } from '@mui/material';
import clsx from 'clsx';
import { Entity, KeyTypes } from '@aas-core-works/aas-core3.0-typescript/types';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { useAasState } from 'components/contexts/CurrentAasContext';
import { encodeBase64 } from 'lib/util/Base64Util';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import { EntityDetailsDialog } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/EntityDetailsDialog';
import {
    CustomTreeItemContentProps,
    CustomTreeItemProps,
    ExpandableTreeitem,
    getTreeItemStyle,
} from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/TreeItem';
import { useTranslations } from 'next-intl';

interface ApplicationTreeItemProps extends CustomTreeItemProps {
    hasChildEntities: boolean;
    applicationUrl?: string;
}

interface ApplicationTreeItemContentProps extends CustomTreeItemContentProps {
    hasChildEntities: boolean;
    applicationUrl?: string;
}

const StyledTreeItem = styled(TreeItem)(({ theme }) => getTreeItemStyle(theme));

const CustomContent = React.forwardRef(function CustomContent(props: ApplicationTreeItemContentProps, ref) {
    const {
        classes,
        className,
        label,
        itemId,
        icon: iconProp,
        data,
        hasChildEntities,
        applicationUrl,
        ...other
    } = props;
    const { disabled, expanded, selected, focused, handleExpansion } = useTreeItemState(itemId);
    const isEntity = data && getKeyType(data) === KeyTypes.Entity;
    const [aas] = useAasState();
    const assetId = aas?.assetInformation.globalAssetId;
    const t = useTranslations('common');

    const dataIcon = hasChildEntities ? (
        <AssetIcon fontSize="small" color="primary" />
    ) : (
        <AppShortcutIcon fontSize="small" color="primary" />
    );
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleExpansion(event);
    };

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

    return (
        <>
            <Box
                className={clsx(className, classes.root, {
                    [classes.expanded]: expanded,
                    [classes.selected]: selected,
                    [classes.focused]: focused,
                    [classes.disabled]: disabled,
                })}
                onClick={handleExpansionClick}
                ref={ref as React.Ref<HTMLDivElement>}
                data-testid="boa-entity"
            >
                <ExpandableTreeitem
                    icon={iconProp}
                    dataIcon={dataIcon}
                    classes={classes}
                    itemId={itemId}
                    label={label}
                    {...other}
                />
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
                                {t('actions.open')}
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
            {isEntity && (
                <EntityDetailsDialog
                    open={detailsModalOpen}
                    handleClose={handleDetailsModalClose}
                    entity={props.data as Entity}
                />
            )}
        </>
    );
});

export const ApplicationTreeItem = (props: ApplicationTreeItemProps) => {
    const { data, hasChildEntities, applicationUrl, ...other } = props;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
        <StyledTreeItem
            ContentComponent={CustomContent}
            ContentProps={{ data, hasChildEntities, applicationUrl } as any}
            {...other}
        />
    );
};
