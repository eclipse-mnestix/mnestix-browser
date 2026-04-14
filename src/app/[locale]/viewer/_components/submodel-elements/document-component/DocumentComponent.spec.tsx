import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { Submodel } from 'lib/api/aas/models';
import { GenericSubmodelDetailComponent } from 'app/[locale]/viewer/_components/submodel/generic-submodel/GenericSubmodelDetailComponent';
import handoverDocV3 from './test-data/handoverDocumentationV3.json';

jest.mock('next-auth/react', () => ({
    useSession: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../../../../components/contexts/CurrentAasContext', () => ({
    useCurrentAasContext: jest.fn().mockReturnValue({
        aas: undefined,
        submodels: [],
        registryAasData: undefined,
        aasOriginUrl: 'https://example.com',
        isLoadingAas: false,
        isLoadingSubmodels: false,
        infrastructureName: undefined,
    }),
}));

describe('DocumentComponent - V3 Handover Documentation', () => {
    it('should render documents from V3 SubmodelElementList structure', () => {
        CustomRender(
            <GenericSubmodelDetailComponent
                submodel={handoverDocV3 as unknown as Submodel}
                repositoryUrl="https://example.com"
            />,
        );

        const documentTitles = screen.getAllByTestId('document-title');
        expect(documentTitles.length).toBe(2);
        expect(documentTitles[0]).toHaveTextContent('Refrigerator User Manual');
    });

    it('should render document without title gracefully', () => {
        CustomRender(
            <GenericSubmodelDetailComponent
                submodel={handoverDocV3 as unknown as Submodel}
                repositoryUrl="https://example.com"
            />,
        );

        const documentTitles = screen.getAllByTestId('document-title');
        // Second document has no title, should render empty or with fallback
        expect(documentTitles[1]).toBeInTheDocument();
    });

    it('should render open button for documents with valid file URLs', () => {
        CustomRender(
            <GenericSubmodelDetailComponent
                submodel={handoverDocV3 as unknown as Submodel}
                repositoryUrl="https://example.com"
            />,
        );

        const openButtons = screen.getAllByTestId('document-open-button');
        expect(openButtons.length).toBe(2);
    });

    it('should fall back to classId when className is missing in V3 classification', () => {
        CustomRender(
            <GenericSubmodelDetailComponent
                submodel={handoverDocV3 as unknown as Submodel}
                repositoryUrl="https://example.com"
            />,
        );

        // First document has classification with only ClassId "CLS_MANUAL" (no ClassName, no ClassificationSystem)
        // Should fall back to showing classId as the display text
        expect(screen.getByText('CLS_MANUAL')).toBeInTheDocument();
    });

    it('should render info button for each document', () => {
        CustomRender(
            <GenericSubmodelDetailComponent
                submodel={handoverDocV3 as unknown as Submodel}
                repositoryUrl="https://example.com"
            />,
        );

        const infoButtons = screen.getAllByTestId('document-info-button');
        expect(infoButtons.length).toBe(2);
    });
});
