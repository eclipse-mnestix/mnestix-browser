import { Typography } from '@mui/material';
import { NotificationSpawner, useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { NotFoundError } from 'lib/errors/NotFoundError';
import { LocalizedError } from 'lib/util/LocalizedError';
import { ApiResponseWrapperError } from 'lib/util/apiResponseWrapper/apiResponseWrapper';
import { useTranslations } from 'next-intl';

export function useShowError() {
    const t = useTranslations();
    const notificationSpawner = useNotificationSpawner();

    function showNotFoundError(notificationSpawner: NotificationSpawner) {
        notificationSpawner.spawn({
            message: t('navigation.errors.notFound'),
            severity: 'error',
        });
    }

    function showUnauthorizedError(notificationSpawner: NotificationSpawner) {
        notificationSpawner.spawn({
            title: t('navigation.errors.unauthorizedError.title'),
            message: t('navigation.errors.unauthorizedError.content'),
            severity: 'error',
        });
    }

    return {
        showError: (e: unknown) => {
            console.error('Error:', e);

            if (e instanceof LocalizedError) {
                notificationSpawner.spawn({
                    message: t(e.descriptor, e.params),
                    severity: 'error',
                });
                return;
            }

            if (e instanceof NotFoundError) {
                showNotFoundError(notificationSpawner);
                return;
            }

            if (e instanceof Error && e.message) {
                notificationSpawner.spawn({
                    message: e.message,
                    severity: 'error',
                });
                return;
            }

            if (isApiResponseWrapperError(e)) {
                switch (e.errorCode) {
                    case 'UNAUTHORIZED':
                        showUnauthorizedError(notificationSpawner);
                        return;
                    default:
                        notificationSpawner.spawn({
                            title: t('navigation.errors.unexpectedError'),
                            message: `${e.errorCode}: ${e.message}`,
                            severity: 'error',
                        });
                        return;
                }
            }

            // TODO remove: there should not be any Response on the client side
            // use API wrapper instead
            if (e instanceof Response) {
                switch (e.status) {
                    case 401:
                        showUnauthorizedError(notificationSpawner);
                        return;
                    case 404:
                        showNotFoundError(notificationSpawner);
                        return;
                    default:
                        notificationSpawner.spawn({
                            message: (
                                <>
                                    {t('navigation.errors.unexpectedError')}
                                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                                        {e.status}: &quot;{e.statusText}&quot;
                                    </Typography>
                                </>
                            ),
                            severity: 'error',
                        });
                        return;
                }
            }

            notificationSpawner.spawn({
                message: t('navigation.errors.unexpectedError'),
                severity: 'error',
            });
        },
    };
}

function isApiResponseWrapperError<T>(obj: unknown): obj is ApiResponseWrapperError<T> {
    return typeof obj === 'object' && obj !== null && !(obj as ApiResponseWrapperError<T>).isSuccess;
}
