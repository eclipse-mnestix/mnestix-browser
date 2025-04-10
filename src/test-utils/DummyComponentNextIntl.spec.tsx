import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';
import { DummyComponentNextIntl } from 'test-utils/DummyComponentNextIntl';

describe('DummyComponent', () => {
    it('renders the DummyComponent Next Intl', async () => {
        CustomRenderNextIntl(<DummyComponentNextIntl />);
        const text = screen.getByTestId('test-text');
        expect(text).toBeDefined();
        expect(text).toBeInTheDocument();
    });
});
