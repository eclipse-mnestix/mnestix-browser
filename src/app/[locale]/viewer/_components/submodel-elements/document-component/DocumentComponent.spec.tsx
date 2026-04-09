import { SubmodelElementCollection } from '@aas-core-works/aas-core3.0-typescript/types';
import { screen } from '@testing-library/react';
import { CustomRender } from 'test-utils/CustomRender';
import { DocumentComponent } from './DocumentComponent';
import { useFileViewObject } from './useDocumentVersionData';

jest.mock('./useDocumentVersionData', () => ({
    useFileViewObject: jest.fn(),
}));

function createDocumentElement(): SubmodelElementCollection {
    return {
        idShort: 'Document',
        modelType: { name: 'SubmodelElementCollection' },
        value: [],
    } as unknown as SubmodelElementCollection;
}

describe('DocumentComponent', function () {
    it('renders fallback title and disabled open button when no digital file URL exists', function () {
        (useFileViewObject as jest.Mock).mockReturnValue({
            mimeType: '',
            title: '',
            digitalFileUrl: '',
            previewImgUrl: '',
            organizationName: '',
        });

        CustomRender(
            <DocumentComponent submodelElement={createDocumentElement()} hasDivider={false} submodelId="submodel-id" />,
        );

        expect(screen.getByTestId('document-title').textContent).toBe('-');
        expect(screen.getByTestId('document-open-button').getAttribute('disabled')).toBe('');
    });

    it('renders active open button when digital file URL exists', function () {
        (useFileViewObject as jest.Mock).mockReturnValue({
            mimeType: 'application/pdf',
            title: 'Handover document',
            digitalFileUrl: 'https://example.com/doc.pdf',
            previewImgUrl: '',
            organizationName: 'XITASO',
        });

        CustomRender(
            <DocumentComponent submodelElement={createDocumentElement()} hasDivider={false} submodelId="submodel-id" />,
        );

        expect(screen.getByTestId('document-title').textContent).toBe('Handover document');
        expect(screen.getByTestId('document-open-button').getAttribute('disabled')).toBeNull();
    });
});
