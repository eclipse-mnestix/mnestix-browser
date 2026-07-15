import { expect } from '@jest/globals';
import { ConceptDescription } from 'lib/api/aas/models';
import { getUnitFromConceptDescription } from './ConceptDescriptionHelper';

function buildConceptDescription(content: { unit?: string; symbol?: string }): ConceptDescription {
    return {
        modelType: 'ConceptDescription',
        id: 'test-id',
        embeddedDataSpecifications: [
            {
                dataSpecification: { keys: [], type: 'ExternalReference' },
                dataSpecificationContent: {
                    modelType: 'DataSpecificationIec61360',
                    preferredName: [{ language: 'en', text: 'Voltage' }],
                    ...content,
                },
            },
        ],
    } as unknown as ConceptDescription;
}

describe('getUnitFromConceptDescription', () => {
    it('should prefer the unit over the symbol', () => {
        const conceptDescription = buildConceptDescription({ unit: 'V', symbol: 'U' });

        expect(getUnitFromConceptDescription(conceptDescription)).toBe('V');
    });

    it('should fall back to the symbol when no unit is defined', () => {
        const conceptDescription = buildConceptDescription({ symbol: 'U' });

        expect(getUnitFromConceptDescription(conceptDescription)).toBe('U');
    });

    it('should return the unit when only the unit is defined', () => {
        const conceptDescription = buildConceptDescription({ unit: 'V' });

        expect(getUnitFromConceptDescription(conceptDescription)).toBe('V');
    });

    it('should return an empty string when neither unit nor symbol is defined', () => {
        const conceptDescription = buildConceptDescription({});

        expect(getUnitFromConceptDescription(conceptDescription)).toBe('');
    });
});
