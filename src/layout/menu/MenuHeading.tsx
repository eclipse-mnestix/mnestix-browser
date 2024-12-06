import { ListItem, ListItemProps, Typography } from '@mui/material';

export interface MenuHeadingProps extends ListItemProps {
    marginTop?: string | number;
}

export function MenuHeading({ children, marginTop = 2 }: MenuHeadingProps) {
    return (
        <ListItem sx={{ mt: marginTop }}>
            <Typography color="primary.contrastText" variant="body2" sx={{ opacity: 0.8 }}>
                {children}
            </Typography>
        </ListItem>
    );
}
