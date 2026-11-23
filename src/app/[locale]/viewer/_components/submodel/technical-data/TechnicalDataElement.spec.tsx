import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { SimpleTreeView } from '@mui/x-tree-view';
import { SubmodelElementChoice } from 'lib/api/aas/models';
import { CustomRender } from 'test-utils/CustomRender';
import { TechnicalDataElement } from './TechnicalDataElement';

jest.mock('../../../../../../components/contexts/CurrentAasContext', () => ({
    useCurrentAasContext: () => ({ infrastructureName: 'Default Infrastructure' }),
}));

jest.mock('../../../../../../lib/services/concept-description-service/conceptDescriptionRepositoryActions', () => ({
    getConceptDescriptionById: jest.fn(),
}));

function collection(idShort: string, displayName?: { language: string; text: string }[]): SubmodelElementChoice {
    return { modelType: 'SubmodelElementCollection', idShort, displayName, value: [] } as SubmodelElementChoice;
}

function renderElements(elements: SubmodelElementChoice[], locale: 'en' | 'de' = 'en') {
    return CustomRender(
        <SimpleTreeView defaultExpandedItems={['technicalProperties']}>
            <TechnicalDataElement
                elements={elements}
                submodelId="urn:example:submodel"
                label="technicalProperties"
                header="Technical properties"
                isExpanded={false}
            />
        </SimpleTreeView>,
        { locale },
    );
}

describe('TechnicalDataElement container labels', () => {
    it('shows the displayName of a group instead of its idShort', () => {
        renderElements([collection('ADN228', [{ language: 'en', text: 'Identification' }])]);

        expect(screen.getByText('Identification')).toBeInTheDocument();
        expect(screen.queryByText('ADN228')).not.toBeInTheDocument();
    });

    it('prefers the displayName of the current locale', () => {
        renderElements(
            [
                collection('ADN228', [
                    { language: 'en', text: 'Identification' },
                    { language: 'de', text: 'Identifikation' },
                ]),
            ],
            'de',
        );

        expect(screen.getByText('Identifikation')).toBeInTheDocument();
    });

    it('falls back to the idShort when a group has no displayName', () => {
        renderElements([collection('ADN228')]);

        expect(screen.getByText('ADN228')).toBeInTheDocument();
    });

    it('shows no "Not available" label when a group has neither displayName nor idShort', () => {
        renderElements([collection('')]);

        expect(screen.queryByText('Not available')).not.toBeInTheDocument();
    });
});
