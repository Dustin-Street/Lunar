import * as React from 'react';
import ErrorPage from './ErrorPage.jsx';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {

        this.setState({ error });
        console.log(error)

    }

    render() {
        if (this.state.hasError) {
            <ErrorPage error={this.state.error} />;
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;