import { CustomRender } from 'test-utils/CustomRender';
import { expect } from '@jest/globals';
import { RelationShipDetailsDialog } from 'app/[locale]/viewer/_components/submodel-elements/generic-elements/entity-components/RelationShipDetailsDialog';
import * as React from 'react';
import { KeyTypes, RelationshipElement } from 'lib/api/aas/models';
import { RelationShipTypes } from 'lib/enums/RelationShipTypes.enum';

const handleClose = jest.fn();
let mockRelationship: RelationshipElement;
const mockRelationshipType = (relationshipType: RelationShipTypes) => ({
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
        mockRelationship = mockRelationshipType(RelationShipTypes.HasPart) as RelationshipElement;
    });
    it('renders dialog when open', () => {
        const { getByTestId } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
        );
        expect(getByTestId('bom-info-popup')).toBeInTheDocument();
    });

    it('renders dialog with correct title', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
        );
        expect(getByText('Test Relationship')).toBeInTheDocument();
    });

    it('displays the correct first entity', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
        );
        expect(getByText('Entity1')).toBeInTheDocument();
    });

    it('displays the correct second entity', () => {
        const { getByText } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
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
            const relationship = mockRelationshipType(type) as RelationshipElement;
            const { getByText } = CustomRender(
                <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={relationship} />,
            );
            expect(getByText(text)).toBeInTheDocument();
        });
    });

    it('displays the correct tooltip for semanticId', () => {
        const { getByTestId } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
        );
        const tooltip = getByTestId('relShip-dialog-tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveAttribute('aria-label', `Semantic ID: ${mockRelationship.semanticId?.keys[0].value}`);
    });

    it('calls handleClose when close button is clicked', () => {
        const { getByRole } = CustomRender(
            <RelationShipDetailsDialog open={true} handleClose={handleClose} relationship={mockRelationship} />,
        );
        getByRole('button', { name: /close/i }).click();
        expect(handleClose).toHaveBeenCalled();
    });
});
