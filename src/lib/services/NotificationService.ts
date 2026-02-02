import { Notification } from 'components/contexts/NotificationContext';

/**
 * A standalone notification service that manages notifications outside of React's render cycle
 * to prevent unwanted re-renders in components
 */
class NotificationService {
    private listeners: ((notification: Notification | null) => void)[] = [];
    private currentNotification: Notification | null = null;

    /**
     * Show a notification
     * @param notification The notification to display
     */
    public show(notification: Notification): void {
        this.currentNotification = notification;
        this.notifyListeners();
    }

    /**
     * Clear the current notification
     */
    public clear(): void {
        this.currentNotification = null;
        this.notifyListeners();
    }

    /**
     * Get the current notification
     * @returns The current notification or null if none exists
     */
    public getCurrentNotification(): Notification | null {
        return this.currentNotification;
    }

    /**
     * Subscribe to notification changes
     * @param listener Callback function that will be called when notifications change
     * @returns Unsubscribe function
     */
    public subscribe(listener: (notification: Notification | null) => void): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all listeners about the current notification
     */
    private notifyListeners(): void {
        this.listeners.forEach((listener) => {
            listener(this.currentNotification);
        });
    }
}

// Export as singleton to use across the application
export const notificationService = new NotificationService();
