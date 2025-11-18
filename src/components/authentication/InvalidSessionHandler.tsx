import { useTranslations } from 'use-intl';
import { useEffect, useRef } from 'react';
import { Session } from 'next-auth';
import { useNotificationSpawner } from 'lib/hooks/UseNotificationSpawner';
import { useSession } from 'next-auth/react';

/**
 * Registers a handler for invalid sessions.
 *
 * When logout is triggered by an invalid session, this handler will show a notification.
 */
export function InvalidSessionHandler() {
    const prefSessionRef = useRef<Session | null>(null);
    const { data: session } = useSession();
    const t = useTranslations('components.authentication');

    const notificationSpawner = useNotificationSpawner();

    function showSessionExpired() {
        notificationSpawner.spawn({
            message: t('sessionExpired'),
            severity: 'warning',
        });
    }

    useEffect(() => {
        if (prefSessionRef.current && !session) {
            showSessionExpired();
        }
        prefSessionRef.current = session;
    }, [session]);

    return <></>;
}
