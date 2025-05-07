import { Notification } from 'components/contexts/NotificationContext';
import { notificationService } from 'lib/services/NotificationService';
import { useCallback } from 'react';

/**
 * Hook that provides a simplified interface for spawning notifications
 * Uses the standalone notification service to prevent unwanted re-renders
 * @returns NotificationSpawner object with spawn method
 */
export function useNotificationSpawner(): NotificationSpawner {
    const spawn = useCallback((notification: Notification): void => {
        // Use the standalone notification service instead of the React context
        notificationService.show(notification);
    }, []);
    
    return { spawn };
}

export interface NotificationSpawner {
    spawn: (notification: Notification) => void;
}
