import { CustomRender } from 'test-utils/CustomRender';
import { expect } from '@jest/globals';
import { RelationShipDetailsDialog } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/RelationShipDetailsDialog';
import * as React from 'react';
import { KeyTypes, RelationshipElement } from '@aas-core-works/aas-core3.0-typescript/types';
import { RelationShipTypes } from 'lib/enums/RelationShipTypes.enum';

const handleClose = jest.fn();
let completeMockRelationship: RelationshipElement;
const mockRelationship = (relationshipType: RelationShipTypes) => ({
    idShort: 'Test Relationship',
    semanticId: {
        keys: [{ type: KeyTypes.GlobalReference, value: relationshipType }],
    },
    first: {
        keys: [{ type: KeyTypes.Submodel, value: 'Entity1' }],
    },
    second: {
        keys: [{ type: KeyTypes.Submodel, value: 'Entity2' }],
    },
});

describe('Relationship Details Dialog', () => {
    beforeEach(() => {
        completeMockRelationship = mockRelationship(RelationShipTypes.HasPart) as RelationshipElement;
    });
    it('renders dialog when open', () => {
        const { getByTestId } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        expect(getByTestId('bom-info-popup')).toBeInTheDocument();
    });

    it('renders dialog with correct title', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        expect(getByText('Test Relationship')).toBeInTheDocument();
    });

    it('displays the correct first entity', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        expect(getByText('Entity1')).toBeInTheDocument();
    });

    it('displays the correct second entity', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        expect(getByText('Entity2')).toBeInTheDocument();
    });

    it('displays the correct relationship type', () => {
        const relationshipTypes = [
            { type: RelationShipTypes.HasPart, text: 'has part' },
            { type: RelationShipTypes.IsPartOf, text: 'is part of' },
            { type: RelationShipTypes.SameAs, text: 'same as' },
        ];

        relationshipTypes.forEach(({ type, text }) => {
            const relationship = mockRelationship(type) as RelationshipElement;
            const { getByText } = CustomRender(
                <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={relationship} />,
            );
            expect(getByText(text)).toBeInTheDocument();
        });
    });

    it('displays the correct tooltip for semanticId', () => {
        const { getByTestId } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        const tooltip = getByTestId('relShip-dialog-tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveAttribute(
            'aria-label',
            `Semantic ID: ${completeMockRelationship.semanticId?.keys[0].value}`,
        );
    });

    it('calls handleClose when close button is clicked', () => {
        const { getByRole } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={completeMockRelationship} />,
        );
        getByRole('button', { name: /close/i }).click();
        expect(handleClose).toHaveBeenCalled();
    });
});
