import React from 'react';
import { screen } from '@testing-library/react';
import { DynamicIcon } from './DynamicIcon';
import { Link } from '@mui/icons-material';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';

describe('DynamicIcon', () => {
    it('should render Material-UI icon by name', () => {
        const { container } = CustomRender(<DynamicIcon iconName="OpenInNew" />);
        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
    });

    it('should render fallback icon when icon name is not found', () => {
        const fallback = <Link data-testid="fallback-icon" />;
        CustomRender(<DynamicIcon iconName="NonExistentIcon" fallback={fallback} />);
        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
    });

    it('should render base64 image when provided', () => {
        const base64Image =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        CustomRender(<DynamicIcon iconName={base64Image} />);
        const imgElement = screen.getByRole('img');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', base64Image);
    });

    it('should render nothing when no icon name is provided and no fallback', () => {
        const { container } = CustomRender(<DynamicIcon />);
        expect(container.firstChild).toBeNull();
    });

    it('should render fallback when no icon name is provided', () => {
        const fallback = <Link data-testid="fallback-icon" />;
        CustomRender(<DynamicIcon fallback={fallback} />);
        expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
    });

    it('should apply correct styling to base64 image', () => {
        const base64Image =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        CustomRender(<DynamicIcon iconName={base64Image} />);
        const imgElement = screen.getByRole('img');
        expect(imgElement).toHaveStyle({
            width: '24px',
            height: '24px',
            objectFit: 'contain',
        });
    });
});
