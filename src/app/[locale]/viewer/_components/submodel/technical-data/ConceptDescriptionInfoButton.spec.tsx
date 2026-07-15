import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from '@jest/globals';
import { ConceptDescription } from 'lib/api/aas/models';
import { ConceptDescriptionInfoButton } from './ConceptDescriptionInfoButton';

jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en',
}));

// Mock CopyButton to expose the value it would copy without needing notification/clipboard providers.
jest.mock('../../../../../../components/basics/CopyButton', () => ({
    CopyButton: ({ value, dataTestId }: { value?: string | null; dataTestId?: string }) => (
        <button data-testid={dataTestId}>{value}</button>
    ),
}));

jest.mock('../../../../../../components/basics/DialogCloseButton', () => ({
    DialogCloseButton: ({ handleClose }: { handleClose: () => void }) => (
        <button data-testid="concept-description-dialog-close" onClick={handleClose}>
            close
        </button>
    ),
}));

const conceptDescription: ConceptDescription = {
    modelType: 'ConceptDescription',
    id: '0173-1#02-BAE001#008',
    idShort: 'Voltage',
    description: [{ language: 'en', text: 'Electrical voltage of the device' }],
    embeddedDataSpecifications: [
        {
            dataSpecification: { keys: [], type: 'ExternalReference' },
            dataSpecificationContent: {
                modelType: 'DataSpecificationIec61360',
                preferredName: [{ language: 'en', text: 'Voltage' }],
                shortName: [{ language: 'en', text: 'U' }],
                definition: [{ language: 'en', text: 'Electrical voltage at which the device is operated' }],
                unit: 'V',
                symbol: 'U',
                dataType: 'REAL_MEASURE',
                sourceOfDefinition: 'IEC',
            },
        },
    ],
} as unknown as ConceptDescription;

describe('ConceptDescriptionInfoButton', () => {
    it('should render the info button', () => {
        render(<ConceptDescriptionInfoButton conceptDescription={conceptDescription} />);

        expect(screen.getByTestId('concept-description-info-button')).toBeInTheDocument();
    });

    it('should not show the dialog before the info button is clicked', () => {
        render(<ConceptDescriptionInfoButton conceptDescription={conceptDescription} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should open a dialog with the concept description details when clicked', async () => {
        render(<ConceptDescriptionInfoButton conceptDescription={conceptDescription} />);

        await userEvent.click(screen.getByTestId('concept-description-info-button'));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Electrical voltage at which the device is operated')).toBeInTheDocument();
        expect(screen.getByText('Electrical voltage of the device')).toBeInTheDocument();
        expect(screen.getByText('V')).toBeInTheDocument();
        expect(screen.getByText('REAL_MEASURE')).toBeInTheDocument();
    });

    it('should provide a copy button holding the semantic id', async () => {
        render(<ConceptDescriptionInfoButton conceptDescription={conceptDescription} />);

        await userEvent.click(screen.getByTestId('concept-description-info-button'));

        expect(screen.getByTestId('concept-description-semantic-id-copy')).toHaveTextContent('0173-1#02-BAE001#008');
    });

    it('should close the dialog when the close button is clicked', async () => {
        render(<ConceptDescriptionInfoButton conceptDescription={conceptDescription} />);

        await userEvent.click(screen.getByTestId('concept-description-info-button'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await userEvent.click(screen.getByTestId('concept-description-dialog-close'));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });
});
