import { Alert, AlertTitle, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNotificationContext } from 'components/contexts/NotificationContext';
import { SyntheticEvent, useState } from 'react';

/**
 * Renders snackbar notifications sourced from the notification context.
 */
export function NotificationOutlet() {
    const { notification } = useNotificationContext();
    const [dismissedNotification, setDismissedNotification] = useState<typeof notification>(null);

    const notificationKey =
        notification ? `${notification.severity}-${notification.message}` : 'empty';
    const isOpen = notification !== null && notification !== dismissedNotification;

    function handleClose(event: Event | SyntheticEvent, reason: SnackbarCloseReason) {
        if (reason === 'clickaway') {
            return;
        }
        setDismissedNotification(notification);
    }

    function handleAlertClose() {
        setDismissedNotification(notification);
    }

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={4000}
            key={notificationKey}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={handleClose}
        >
            <Alert
                onClose={handleAlertClose}
                severity={notification?.severity || 'info'}
                variant='filled'
                sx={{ boxShadow: 7 }}
            >
                {notification?.title && <AlertTitle>{notification.title}</AlertTitle>}
                {notification?.message}
            </Alert>
        </Snackbar>
    );
}
