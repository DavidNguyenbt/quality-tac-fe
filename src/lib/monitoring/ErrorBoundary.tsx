import React from 'react';
import {logger} from './logger';
import {ErrorFallback} from './ErrorFallback';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = {hasError: false, error: null};

    static getDerivedStateFromError(error: Error): State {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        logger.error('react', 'Unhandled React rendering error', {
            componentStack: errorInfo.componentStack ?? undefined,
        }, error);
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? <ErrorFallback error={this.state.error}/>;
        }
        return this.props.children;
    }
}
