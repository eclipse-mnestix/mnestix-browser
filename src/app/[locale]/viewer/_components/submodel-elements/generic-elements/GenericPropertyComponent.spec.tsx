import React from 'react';
import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { GenericPropertyComponent } from './GenericPropertyComponent';
import { CustomRender } from 'test-utils/CustomRender';
import { ConceptDescription, MultiLanguageProperty, Property } from 'lib/api/aas/models';

// Setup mock for the notification spawner module
const mockSpawn = jest.fn();
jest.mock('./../../../../../../lib/hooks/UseNotificationSpawner', () => ({
    useNotificationSpawner: () => ({
        spawn: mockSpawn,
    }),
}));

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});

describe('GenericPropertyComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders a normal Property value correctly', () => {
        const property: Property = {
            value: 'Test Value',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} />);

        expect(screen.getByTestId('property-content')).toHaveTextContent('Test Value');
    });

    test('renders a MultiLanguageProperty value correctly', () => {
        const mLangProp: MultiLanguageProperty = {
            value: [
                { language: 'en', text: 'English Text' },
                { language: 'de', text: 'German Text' },
            ],
        } as MultiLanguageProperty;

        CustomRender(<GenericPropertyComponent mLangProp={mLangProp} />);

        // In our test environment, locale would typically be 'en'
        expect(screen.getByTestId('property-content')).toHaveTextContent('English Text');
    });

    test('handles boolean values correctly', () => {
        const property: Property = {
            value: 'true',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} />);

        // Should display translated boolean value
        expect(screen.getByTestId('property-content')).toBeInTheDocument();
    });

    test('handles URL values correctly', () => {
        const property: Property = {
            value: 'https://example.com',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveAttribute('target', '_blank');
    });

    test('copies value to clipboard when copy button is clicked', () => {
        const property: Property = {
            value: 'Copy Me',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} />);

        // Click the copy button
        screen.getByTestId('copy-property-value').click();

        // Verify clipboard API was called with correct value
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy Me');

        // Verify notification was shown
        expect(mockSpawn).toHaveBeenCalledWith({
            message: expect.any(String),
            severity: 'success',
        });
    });

    test('handles empty values correctly', () => {
        const property: Property = {
            value: undefined,
            modelType: 'Property',
            valueType: 'xs:anyURI',
        };

        CustomRender(<GenericPropertyComponent property={property} />);

        expect(screen.getByTestId('property-content')).toBeInTheDocument();
    });

    test('does not show copy button when withCopyButton is false', () => {
        const property: Property = {
            value: 'Test Value',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} withCopyButton={false} />);

        expect(screen.queryByTestId('copy-property-value')).not.toBeInTheDocument();
    });

    test('displays unit from concept description', () => {
        const property: Property = {
            value: '42',
        } as Property;

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const conceptDescription = {
            embeddedDataSpecifications: [
                {
                    dataSpecificationContent: {
                        unit: 'kg',
                        symbol: 'kg',
                    },
                },
            ],
        } as any as ConceptDescription;

        CustomRender(<GenericPropertyComponent property={property} conceptDescription={conceptDescription} />);

        expect(screen.getByTestId('property-unit')).toHaveTextContent('kg');
    });

    test('displays loading skeleton for unit when conceptDescriptionLoading is true', () => {
        const property: Property = {
            value: '42',
        } as Property;

        CustomRender(<GenericPropertyComponent property={property} conceptDescriptionLoading={true} />);

        expect(
            screen.getByTestId('property-content').parentElement?.querySelector('.MuiSkeleton-root'),
        ).toBeInTheDocument();
    });
});
