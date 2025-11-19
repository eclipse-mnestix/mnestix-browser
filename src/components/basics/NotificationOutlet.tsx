import { Alert, AlertTitle, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNotificationContext } from 'components/contexts/NotificationContext';
import { SyntheticEvent, useState } from 'react';

export function NotificationOutlet() {
    const { notification, clearNotification } = useNotificationContext();
    const [manuallyClosing, setManuallyClosing] = useState(false);

    // Derive open state from notification presence
    const isOpen = notification !== null && !manuallyClosing;

    function handleClose(event: Event | SyntheticEvent, reason: SnackbarCloseReason) {
        if (reason === 'clickaway') {
            return;
        }
        setManuallyClosing(true);
        setTimeout(() => {
            clearNotification();
            setManuallyClosing(false);
        }, 300);
    }

    function handleAlertClose() {
        setManuallyClosing(true);
        setTimeout(() => {
            clearNotification();
            setManuallyClosing(false);
        }, 300);
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
