import { Alert, AlertTitle, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNotificationContext } from 'components/contexts/NotificationContext';
import { SyntheticEvent, useState } from 'react';

export function NotificationOutlet() {
    const { notification } = useNotificationContext();
    const [open, setOpen] = useState(false);

    // Derive open state from notification presence
    const isOpen = open && notification !== null;

    function handleClose(event: Event | SyntheticEvent, reason: SnackbarCloseReason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    function handleAlertClose() {
        setOpen(false);
    }

    // Open when new notification arrives
    if (notification && !open) {
        setOpen(true);
    }

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={4000}
            // to force rerender when contents change
            key={notification ? `${notification.severity}-${notification.message}` : 'empty'}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={handleClose}
        >
            <Alert
                onClose={handleAlertClose}
                severity={notification?.severity || 'info'}
                variant="filled"
                sx={{ boxShadow: 7 }}
            >
                {notification?.title && <AlertTitle>{notification.title}</AlertTitle>}
                {notification?.message}
            </Alert>
        </Snackbar>
    );
}
