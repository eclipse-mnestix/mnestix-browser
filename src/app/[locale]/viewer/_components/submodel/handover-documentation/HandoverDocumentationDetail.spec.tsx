import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { HandoverDocumentationDetail } from './HandoverDocumentationDetail';
import { Submodel } from 'lib/api/aas/models';
import handoverTestSubmodels from './test-submodel/handover-documentation-test.json';

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

jest.mock('../../submodel-elements/document-component/DocumentComponent', () => ({
    DocumentComponent: ({ submodelElement }: { submodelElement: { idShort?: string } }) => (
        <div data-testid={`document-component-${submodelElement.idShort}`} />
    ),
}));

jest.mock('../generic-submodel/GenericSubmodelDetailComponent', () => ({
    GenericSubmodelDetailComponent: ({ submodel }: { submodel: Submodel }) => (
        <div data-testid="generic-submodel-detail">Generic View for ID: {submodel.id}</div>
    ),
}));

describe('HandoverDocumentationDetail', () => {
    it('should render a DocumentComponent for each document nested in the 2.0 Documents list', () => {
        // Arrange
        const submodel = handoverTestSubmodels.handoverV20 as unknown as Submodel;

        // Act
        render(<HandoverDocumentationDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('document-component-Document01')).toBeInTheDocument();
        expect(screen.getByTestId('document-component-Document02')).toBeInTheDocument();
        expect(screen.queryByTestId('generic-submodel-detail')).not.toBeInTheDocument();
    });

    it('should render a DocumentComponent for documents placed directly on the submodel', () => {
        // Arrange
        const submodel = handoverTestSubmodels.handoverFlat as unknown as Submodel;

        // Act
        render(<HandoverDocumentationDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('document-component-Document01')).toBeInTheDocument();
        expect(screen.queryByTestId('generic-submodel-detail')).not.toBeInTheDocument();
    });

    it('should fall back to the generic component when no documents are found', () => {
        // Arrange
        const submodel = handoverTestSubmodels.handoverWithoutDocuments as unknown as Submodel;

        // Act
        render(<HandoverDocumentationDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('generic-submodel-detail')).toBeInTheDocument();
    });
});
