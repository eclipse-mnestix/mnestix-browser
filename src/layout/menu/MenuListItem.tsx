import { Badge, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Link from 'next/link';

export interface MenuListItemProps {
    icon?: React.ReactElement;
    to?: string;
    external?: boolean;
    label?: React.ReactElement | string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    badgeContent?: number;
}

export function MenuListItem(props: MenuListItemProps) {
    const iconElement = props.icon && (
        <ListItemIcon>
            {props.badgeContent !== undefined && props.badgeContent > 0 ? (
                <Badge badgeContent={props.badgeContent} color="secondary" max={999}>
                    {props.icon}
                </Badge>
            ) : (
                props.icon
            )}
        </ListItemIcon>
    );

    const content = (
        <>
            {iconElement}
            {props.label && <ListItemText data-testid="sidebar-button">{props.label}</ListItemText>}
        </>
    );

    return props.to ? (
        <ListItemButton
            data-testid={props.to}
            component={!props.external ? Link : 'a'}
            href={props.to}
            target={props.target}
            onClick={props.onClick}
        >
            {content}
        </ListItemButton>
    ) : (
        <ListItemButton onClick={props.onClick}>{content}</ListItemButton>
    );
}
