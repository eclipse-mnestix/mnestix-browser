import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { ContentCopy, Delete, MoreVert, Restore } from '@mui/icons-material';
import * as React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BlueprintEditTreeItemMenuProps {
    elementMultiplicity: MultiplicityEnum | undefined;
    numberOfThisElement: number;
    onDuplicate: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onRestore: (nodeId: string) => void;
    nodeId: string;
    isElementAboutToBeDeleted: boolean | undefined;
    isParentAboutToBeDeleted: boolean | undefined;
}

export const BlueprintEditTreeItemMenu = (props: BlueprintEditTreeItemMenuProps) => {
    const isElementAboutToBeDeleted = props.isElementAboutToBeDeleted;
    const menuElements = generateMenuElementsBasedOnMultiplicity(props.elementMultiplicity, props.numberOfThisElement);
    const [editMenuOpen, setEditMenuOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const t = useTranslations('pages.templates');

    function generateMenuElementsBasedOnMultiplicity(
        elementMultiplicity: MultiplicityEnum | string | undefined,
        numberOfThisElement: number,
    ) {
        if (props.isParentAboutToBeDeleted) {
            return undefined;
        } else if (isElementAboutToBeDeleted) {
            return [<RevertButton key={'revert-' + props.nodeId} />];
        } else {
            switch (elementMultiplicity) {
                case MultiplicityEnum.OneToMany: // Can be duplicated, Can be deleted if number > 1
                    if (numberOfThisElement > 1) {
                        return [
                            <DuplicateButton key={'duplicate-' + props.nodeId} />,
                            <DeleteButton key={'delete-' + props.nodeId} />,
                        ];
                    } else {
                        return [<DuplicateButton key={'duplicate-' + props.nodeId} />];
                    }
                case MultiplicityEnum.ZeroToOne: // Can be deleted
                    return [<DeleteButton key={'delete-' + props.nodeId} />];
                case MultiplicityEnum.ZeroToMany: //Can be deleted & duplicated
                    return [
                        <DuplicateButton key={'duplicate-' + props.nodeId} />,
                        <DeleteButton key={'delete-' + props.nodeId} />,
                    ];
                case MultiplicityEnum.One:
                default:
                    return undefined;
            }
        }
    }

    //Menu
    const handleMoreMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setEditMenuOpen(true);
        setMenuAnchor(event.currentTarget);
    };

    const handleMoreMenuClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEditMenuOpen(false);
        setMenuAnchor(null);
    };

    const handleDuplicateClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        handleMoreMenuClose(event);
        props.onDuplicate(props.nodeId);
    };

    const handleDeleteClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        handleMoreMenuClose(event);
        props.onDelete(props.nodeId);
    };

    const handleRestoreClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        handleMoreMenuClose(event);
        props.onRestore(props.nodeId);
    };

    //components
    function DuplicateButton() {
        return (
            <MenuItem onClick={(e) => handleDuplicateClick(e)}>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
                {t('actions.duplicate')}
            </MenuItem>
        );
    }

    function DeleteButton() {
        return (
            <MenuItem onClick={(e) => handleDeleteClick(e)}>
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                {t('actions.delete')}
            </MenuItem>
        );
    }

    function RevertButton() {
        return (
            <MenuItem onClick={(e) => handleRestoreClick(e)}>
                <ListItemIcon>
                    <Restore fontSize="small" />
                </ListItemIcon>
                {t('actions.restore')}
            </MenuItem>
        );
    }

    if (menuElements) {
        return (
            <>
                <IconButton sx={{ ml: 1 }} onClick={(e) => handleMoreMenuClick(e)} className="more-button" size="small">
                    <MoreVert />
                </IconButton>
                <Menu
                    open={editMenuOpen}
                    anchorEl={menuAnchor}
                    onClose={handleMoreMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                >
                    {menuElements}
                </Menu>
            </>
        );
    } else {
        return <></>;
    }
};
