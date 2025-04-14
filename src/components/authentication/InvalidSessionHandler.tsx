import { useTranslations } from 'use-intl';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useSession } from 'next-auth/react';

/**
 * Registers a handler for invalid sessions.
 *
 * When logout is triggered by an invalid session, this handler will show a notification.
 */
export function InvalidSessionHandler() {
    const [prefSession, setPrefSession] = useState<Session | null>(null);
    const { data: session } = useSession();
    const t = useTranslations('components.authentication');

    const notificationSpawner = useNotificationSpawner();

    useEffect(() => {
        if (prefSession && !session) {
            showSessionExpired();
        }
        setPrefSession(session);
    }, [session]);

    function showSessionExpired() {
        notificationSpawner.spawn({
            message: t('sessionExpired'),
            severity: 'warning',
        });
    }
    return <></>;
}
