import { MultiplicityEnum } from 'lib/enums/Multiplicity.enum';
import { IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { ContentCopy, Delete, MoreVert, Restore } from '@mui/icons-material';
import * as React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface TemplateEditTreeItemMenuProps {
    elementMultiplicity: MultiplicityEnum | undefined;
    numberOfThisElement: number;
    onDuplicate: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onRestore: (nodeId: string) => void;
    nodeId: string;
    isElementAboutToBeDeleted: boolean | undefined;
    isParentAboutToBeDeleted: boolean | undefined;
}

export const TemplateEditTreeItemMenu = (props: TemplateEditTreeItemMenuProps) => {
    const isElementAboutToBeDeleted = props.isElementAboutToBeDeleted;
    const menuElements = generateMenuElementsBasedOnMultiplicity(props.elementMultiplicity, props.numberOfThisElement);
    const [editMenuOpen, setEditMenuOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const t = useTranslations('common.actions');

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
        setEditMenuOpen(true);
        setMenuAnchor(event.currentTarget);
    };

    const handleMoreMenuClose = () => {
        setEditMenuOpen(false);
        setMenuAnchor(null);
    };

    const handleDuplicateClick = () => {
        handleMoreMenuClose();
        props.onDuplicate(props.nodeId);
    };

    const handleDeleteClick = () => {
        handleMoreMenuClose();
        props.onDelete(props.nodeId);
    };

    const handleRestoreClick = () => {
        handleMoreMenuClose();
        props.onRestore(props.nodeId);
    };

    //components
    function DuplicateButton() {
        return (
            <MenuItem onClick={handleDuplicateClick}>
                <ListItemIcon>
                    <ContentCopy fontSize="small" />
                </ListItemIcon>
                {t('duplicate')}
            </MenuItem>
        );
    }

    function DeleteButton() {
        return (
            <MenuItem onClick={handleDeleteClick}>
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                {t('delete')}
            </MenuItem>
        );
    }

    function RevertButton() {
        return (
            <MenuItem onClick={handleRestoreClick}>
                <ListItemIcon>
                    <Restore fontSize="small" />
                </ListItemIcon>
                {t('restore')}
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
