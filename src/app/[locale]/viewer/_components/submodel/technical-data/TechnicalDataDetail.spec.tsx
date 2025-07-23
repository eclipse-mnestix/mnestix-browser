import React from 'react';
import { render, screen } from '@testing-library/react';

import { expect } from '@jest/globals';
import { TechnicalDataDetail } from './TechnicalDataDetail';
import { Submodel } from 'lib/api/aas/models';

// Import test data for technical data submodels
import technicalDataTestSubmodels from './test-submodel/technical-data-test.json';

// Mock the dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
}));

// Mock the TechnicalDataElement component
jest.mock('./TechnicalDataElement', () => ({
    TechnicalDataElement: ({
        label,
        header,
        isExpanded
    }: {
        label: string;
        header: string;
        isExpanded: boolean;
    }) => (
        <div data-testid={`technical-data-element-${label}`}>
            <div data-testid={`header-${label}`}>{header}</div>
            <div data-testid={`expanded-${label}`}>
                {isExpanded ? 'Expanded' : 'Collapsed'}
            </div>
        </div>
    )
}));

// Mock the GenericSubmodelDetailComponent
jest.mock('../generic-submodel/GenericSubmodelDetailComponent', () => ({
    GenericSubmodelDetailComponent: ({ submodel }: { submodel: Submodel }) => (
        <div data-testid="generic-submodel-detail">
            Generic View for ID: {submodel.id}
        </div>
    )
}));

describe('TechnicalDataDetail', () => {

    it('should render all technical data elements when present', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.completeTechnicalData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('technical-data-element-technicalProperties')).toBeInTheDocument();
        expect(screen.getByTestId('technical-data-element-generalInformation')).toBeInTheDocument();
        expect(screen.getByTestId('technical-data-element-productClassifications')).toBeInTheDocument();
        expect(screen.getByTestId('technical-data-element-furtherInformation')).toBeInTheDocument();
    }); it('should expand only technicalProperties element by default', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.completeTechnicalData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('expanded-technicalProperties')).toHaveTextContent('Expanded');
        expect(screen.getByTestId('expanded-generalInformation')).toHaveTextContent('Collapsed');
        expect(screen.getByTestId('expanded-productClassifications')).toHaveTextContent('Collapsed');
        expect(screen.getByTestId('expanded-furtherInformation')).toHaveTextContent('Collapsed');
    });

    it('should handle missing technical data elements gracefully', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.emptyTechnicalData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('generic-submodel-detail')).toBeInTheDocument();
    });

    it('should handle partial technical data elements', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.partialTechnicalData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('technical-data-element-technicalProperties')).toBeInTheDocument();
        expect(screen.getByTestId('technical-data-element-generalInformation')).toBeInTheDocument();
        expect(screen.queryByTestId('technical-data-element-productClassifications')).not.toBeInTheDocument();
        expect(screen.queryByTestId('technical-data-element-furtherInformation')).not.toBeInTheDocument();
        expect(screen.queryByTestId('generic-submodel-detail')).not.toBeInTheDocument();
    });

    it('should identify submodel elements using idShort when semantic IDs are not present', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.idShortTechnicalData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('technical-data-element-generalInformation')).toBeInTheDocument();
    });

    it('should use generic component when no recognized technical data elements are found', () => {
        // Arrange
        const submodel = technicalDataTestSubmodels.unrecognizedData as unknown as Submodel;

        // Act
        render(<TechnicalDataDetail submodel={submodel} />);

        // Assert
        expect(screen.getByTestId('generic-submodel-detail')).toBeInTheDocument();
    });
});
