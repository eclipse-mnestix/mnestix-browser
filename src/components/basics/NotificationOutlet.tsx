import { Alert, AlertTitle, Snackbar, SnackbarCloseReason } from '@mui/material';
import { useNotificationContext } from 'components/contexts/NotificationContext';
import { SyntheticEvent, useEffect, useState } from 'react';

export function NotificationOutlet() {
    const { notification } = useNotificationContext();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (notification) {
            setOpen(true);
        }
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
            // to force rerender when contents change
            key={Date.now()}
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
