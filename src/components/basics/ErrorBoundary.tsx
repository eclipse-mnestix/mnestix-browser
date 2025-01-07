import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Typography } from '@mui/material';

interface Props {
    children?: ReactNode;
    message?: string;
}

interface State {
    hasError: boolean;
}

/**
 * This ErrorBoundary can be used to wrap error-prone parts of the UI.
 * With this wrapper, an error message is displayed instead of crashing the whole application.
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box>
                    <Alert severity="warning">
                        <Typography>{this.props.message}</Typography>
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
