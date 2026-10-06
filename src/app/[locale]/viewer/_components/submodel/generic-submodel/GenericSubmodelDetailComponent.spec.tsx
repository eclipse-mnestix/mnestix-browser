import { screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { KeyTypes, Submodel } from 'lib/api/aas/models';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import { CustomRender } from 'test-utils/CustomRender';

const CUSTOM_ELEMENT_SEMANTIC_ID = 'https://example.com/CustomerElement/1/0';

// Simulates a customization that overrides submodel-element.config.ts: element
// visualizations must be resolved through the factory, not the OSS map literal.
jest.mock('../../submodel-elements/submodel-element.config', () => ({
    getSubmodelElementVisualizationMap: () => ({
        'https://example.com/CustomerElement/1/0': () => <div data-testid="customer-element" />,
    }),
}));

jest.mock('next-auth', jest.fn());

describe('GenericSubmodelDetailComponent with an overridden element registry', () => {
    function submodelWithElementSemanticId(semanticId: string) {
        return {
            id: 'submodel-id',
            idShort: 'HostSubmodel',
            submodelElements: [
                {
                    modelType: KeyTypes.SubmodelElementCollection,
                    idShort: 'SomeCollection',
                    semanticId: { keys: [{ value: semanticId }] },
                    value: [],
                },
            ],
        } as unknown as Submodel;
    }

    it('renders the element visualization registered through the factory', async () => {
        CustomRender(<GenericSubmodelDetailComponent submodel={submodelWithElementSemanticId(CUSTOM_ELEMENT_SEMANTIC_ID)} />);

        expect(screen.getByTestId('customer-element')).toBeInTheDocument();
    });

    it('falls back to the generic element component for unregistered semanticIds', async () => {
        CustomRender(
            <GenericSubmodelDetailComponent submodel={submodelWithElementSemanticId('https://example.com/Unregistered')} />,
        );

        expect(screen.queryByTestId('customer-element')).toBeNull();
        expect(screen.getByText('SomeCollection')).toBeInTheDocument();
    });
});
