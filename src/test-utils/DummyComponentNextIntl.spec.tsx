import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { DummyComponentNextIntl } from 'test-utils/DummyComponentNextIntl';

describe('DummyComponent', () => {
    it('renders the DummyComponent Next Intl', async () => {
        CustomRender(<DummyComponentNextIntl />);
        const text = screen.getByTestId('test-text');
        expect(text).toBeDefined();
        expect(text).toBeInTheDocument();
    });
});
