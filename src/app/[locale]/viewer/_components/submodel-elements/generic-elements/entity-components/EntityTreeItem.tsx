import * as React from 'react';
import { TreeItem, useTreeItemState } from '@mui/x-tree-view';
import clsx from 'clsx';
import { Box, Button, IconButton, styled } from '@mui/material';
import { Entity, ISubmodelElement, KeyTypes, RelationshipElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { AssetIcon } from 'components/custom-icons/AssetIcon';
import { ArrowForward, ArticleOutlined, InfoOutlined, PinDropOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { GenericSubmodelElementComponent } from '../GenericSubmodelElementComponent';
import { EntityDetailsDialog } from './EntityDetailsDialog';
import { RelationShipDetailsDialog } from './RelationShipDetailsDialog';
import { getKeyType } from 'lib/util/KeyTypeUtil';
import {
    CustomTreeItemContentProps,
    CustomTreeItemProps,
    ExpandableTreeitem,
    getTreeItemStyle,
} from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/TreeItem';
import { performDiscoveryAasSearch } from 'lib/services/search-actions/searchActions';
import { useTranslations } from 'next-intl';

const CustomContent = React.forwardRef(function CustomContent(props: CustomTreeItemContentProps, ref) {
    const t = useTranslations('common');
    const navigate = useRouter();
    const { classes, className, label, itemId, icon: iconProp, data, ...other } = props;
    const { disabled, expanded, selected, focused, handleExpansion } = useTreeItemState(itemId);
    const isEntity = getKeyType(data as ISubmodelElement) === KeyTypes.Entity;
    const dataIcon = isEntity ? (
        <AssetIcon fontSize="small" color="primary" />
    ) : (
        <ArticleOutlined fontSize="small" color="primary" />
    );
    const isRelationShip = getKeyType(data as ISubmodelElement) === KeyTypes.RelationshipElement;
    const assetId = isEntity ? (data as Entity).globalAssetId : undefined;
    const showDataDirectly = [KeyTypes.Property, KeyTypes.MultiLanguageProperty].find(
        (mt) => mt === getKeyType(data as ISubmodelElement),
    );
    const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

    const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        handleExpansion(event);
    };

    const handleAssetNavigateClick = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        if (assetId) {
            // Check if the Asset Id exists in the same repository as the "parent AAS",
            // if so, then navigate to the asset-redirect page of this Mnestix instance,
            // if not, just navigate to the specified URL which might lead anywhere.

            const { isSuccess, result: aasIds } = await performDiscoveryAasSearch(assetId);
            if (!isSuccess || (isSuccess && aasIds.length === 0)) {
                const popup = window.open(''); // Try to open a new tab
                if (popup) { // if not null -> new tab was opened
                    popup.location.href = assetId;    
                } else { // popup was blocked open in same tab
                    navigate.push(assetId);
                }
            } else {
                navigate.push('/asset?assetId=' + encodeURIComponent(assetId));
            }
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
                data-testid="bom-entity"
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
                    {assetId && !showDataDirectly && (
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
                                {t('actions.view')}
                            </Button>
                        </>
                    )}
                    {showDataDirectly && (
                        <GenericSubmodelElementComponent submodelElement={data} wrapInDataRow={false} />
                    )}
                </Box>
                {isRelationShip && (
                    <Box sx={{ ml: '2px', pl: 1, display: 'flex' }}>
                        <>
                            <IconButton sx={{ mr: 1 }} onClick={handleDetailsClick}>
                                <PinDropOutlined data-testid="entity-info-icon" sx={{ color: 'text.secondary' }} />
                            </IconButton>
                        </>
                    </Box>
                )}
            </Box>
            {isEntity && (
                <EntityDetailsDialog
                    open={detailsModalOpen}
                    handleClose={handleDetailsModalClose}
                    entity={props.data as Entity}
                />
            )}
            {isRelationShip && (
                <RelationShipDetailsDialog
                    open={detailsModalOpen}
                    handleClose={handleDetailsModalClose}
                    relationship={props.data as RelationshipElement}
                />
            )}
        </>
    );
});

const StyledTreeItem = styled(TreeItem)(({ theme }) => getTreeItemStyle(theme));

export const EntityTreeItem = (props: CustomTreeItemProps) => {
    const { data, ...other } = props;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return <StyledTreeItem ContentComponent={CustomContent} ContentProps={{ data } as any} {...other} />;
};
