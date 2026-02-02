'use client';

import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { notificationService } from 'lib/services/NotificationService';

export type Notification = {
    title?: React.ReactNode;
    message?: React.ReactNode;
    severity?: 'error' | 'info' | 'success' | 'warning';
};

interface NotificationContextType {
    notification: Notification | null;
    setNotification: (notification: Notification | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Hook to access the notification context
 * @returns Notification context with current notification and setter function
 */
export function useNotificationContext(): NotificationContextType {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within a NotificationContextProvider');
    }
    return context;
}

/**
 * Provider component for notification context
 * Uses the notification service to prevent unwanted re-renders
 */
export function NotificationContextProvider(props: PropsWithChildren) {
    // Track notification state locally but source it from the service
    const [notification, setNotificationState] = useState<Notification | null>(
        notificationService.getCurrentNotification(),
    );

    // Subscribe to notification changes from the service
    useEffect(() => {
        const unsubscribe = notificationService.subscribe((newNotification) => {
            setNotificationState(newNotification);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    // Create a stable setter function
    const setNotification = useCallback((newNotification: Notification | null) => {
        if (newNotification === null) {
            notificationService.clear();
        } else {
            notificationService.show(newNotification);
        }
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
            notification,
            setNotification,
        }),
        [notification, setNotification],
    );

    return <NotificationContext.Provider value={contextValue}>{props.children}</NotificationContext.Provider>;
}
