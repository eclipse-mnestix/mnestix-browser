import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import type { AasViewerAction } from 'components/visualizations/viewer.types';
import { AasViewerActionBar } from './AasViewerActionBar';

describe('AasViewerActionBar', () => {
    it('renders nothing when there are no actions', () => {
        CustomRender(<AasViewerActionBar actions={[]} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders a single action as the primary contained button', () => {
        const actions: AasViewerAction[] = [{ label: 'pages.aasViewer.actions.download', onClick: jest.fn() }];
        CustomRender(<AasViewerActionBar actions={actions} />);
        expect(screen.getByText('Download AAS')).toBeInTheDocument();
    });

    it('renders the first action contained and the second outlined', () => {
        const actions: AasViewerAction[] = [
            { label: 'pages.aasViewer.actions.download', onClick: jest.fn() },
            { label: 'pages.aasViewer.views.product', href: '/viewer/abc/product' },
        ];
        const { container } = CustomRender(<AasViewerActionBar actions={actions} />);

        expect(container.querySelectorAll('.MuiButton-contained')).toHaveLength(1);
        expect(container.querySelectorAll('.MuiButton-outlined')).toHaveLength(1);
    });

    it('renders an href action as a link and an onClick action as a button', () => {
        const actions: AasViewerAction[] = [
            { label: 'link-action', href: '/viewer/abc/default' },
            { label: 'callback-action', onClick: jest.fn() },
        ];
        const { container } = CustomRender(<AasViewerActionBar actions={actions} />);

        expect(screen.getByText('link-action').closest('a')).toHaveAttribute('href', '/viewer/abc/default');
        expect(screen.getByText('callback-action').closest('button')).toBeInTheDocument();
        expect(container.querySelectorAll('a')).toHaveLength(1);
    });

    it('folds actions beyond the second into the overflow menu', () => {
        const actions: AasViewerAction[] = [
            { label: 'a', onClick: jest.fn() },
            { label: 'b', onClick: jest.fn() },
            { label: 'c', onClick: jest.fn() },
            { label: 'd', onClick: jest.fn() },
        ];
        CustomRender(<AasViewerActionBar actions={actions} />);

        expect(screen.getByText('a')).toBeInTheDocument();
        expect(screen.getByText('b')).toBeInTheDocument();
        expect(screen.getByTestId('aas-view-menu-button')).toBeInTheDocument();
    });

    it('resolves an i18n-key label against the message tree instead of showing the key', () => {
        const actions: AasViewerAction[] = [{ label: 'pages.aasViewer.views.product', href: '/viewer/abc/product' }];
        CustomRender(<AasViewerActionBar actions={actions} />);
        expect(screen.getByText('Product view')).toBeInTheDocument();
    });

    it('shows the raw label when it is not an i18n key', () => {
        const actions: AasViewerAction[] = [{ label: 'timeseries', href: '/viewer/abc/timeseries' }];
        CustomRender(<AasViewerActionBar actions={actions} />);
        expect(screen.getByText('timeseries')).toBeInTheDocument();
    });
});