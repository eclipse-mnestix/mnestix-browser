import { Alert, AlertTitle, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNotificationContext } from 'components/contexts/NotificationContext';
import { SyntheticEvent, useMemo, useState } from 'react';

export function NotificationOutlet() {
    const { notification } = useNotificationContext();
    const [open, setOpen] = useState(false);
    const [lastNotification, setLastNotification] = useState<typeof notification>(null);

    // Adjust state during render when notification changes
    if (notification !== lastNotification) {
        setOpen(!!notification);
        setLastNotification(notification);
    }

    // Generate key for remounting when notification changes
    const notificationKey = useMemo(() => {
        return notification?.id ?? Date.now();
    }, [notification]);

    const handleClose = (event: Event | SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleAlertClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            key={notificationKey}
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
