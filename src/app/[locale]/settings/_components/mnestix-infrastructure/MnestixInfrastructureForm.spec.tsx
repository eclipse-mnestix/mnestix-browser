import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import MnestixInfrastructureForm from './MnestixInfrastructureForm';
import { MappedInfrastructure } from './InfrastructureTypes';
import { emptyMappedInfrastructure, mockMappedInfrastructures } from './test-data/infrastructures';

jest.mock('next-intl', () => ({
    useTranslations: (scope?: string) => (key: string) => (scope ? `${scope}.${key}` : key),
}));


const onSave = jest.fn();
const onCancel = jest.fn();

async function renderMnestixInfrastructureForm(infrastructure: MappedInfrastructure, existingNames: string[] = []) {
    await act(async () => {
        const renderResult = render(
            <MnestixInfrastructureForm onSave={onSave} onCancel={onCancel} infrastructure={infrastructure} existingNames={existingNames} />
        );

        return {
            ...renderResult,
            onSave,
            onCancel,
        };
    });
}

describe('MnestixInfrastructureForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with empty infrastructure', async () => {
        await renderMnestixInfrastructureForm(emptyMappedInfrastructure);
    });

    it.each(mockMappedInfrastructures)('renders correctly with mapped infrastructure', async (infrastructure) => {
        await renderMnestixInfrastructureForm(infrastructure);
        
        await waitFor(() => {
            expect(screen.getByText('pages.settings.infrastructure.form.save')).toBeInTheDocument();
            fireEvent.click(screen.getByText('pages.settings.infrastructure.form.save'));
        });

        await waitFor(() => {
            expect(onSave).toHaveBeenCalled();
        });

        const callArg = onSave.mock.calls[0][0] as MappedInfrastructure;

        expect(callArg).toEqual(infrastructure);
        onSave.mockClear();
    });

    it('checks if name is unique', async () => {
        const infrastructure1 = mockMappedInfrastructures[0];
        const infrastructure2 = mockMappedInfrastructures[1];

        const existingNames = mockMappedInfrastructures.map((infra) => infra.name);
        await renderMnestixInfrastructureForm(infrastructure1, existingNames);


        const nameInput = screen.getByLabelText('pages.settings.infrastructure.form.name');
        fireEvent.change(nameInput, { target: { value: infrastructure2.name } });

        await waitFor(() => {
            expect(screen.getByText('pages.settings.infrastructure.form.nameAlreadyExists')).toBeInTheDocument();
        });

        fireEvent.change(nameInput, { target: { value: 'New Unique Name' } });

        await waitFor(() => {
            expect(screen.queryByText('pages.settings.infrastructure.form.nameAlreadyExists')).not.toBeInTheDocument();
        });
    });

    it('calls onCancel when cancel button is clicked', async () => {
        await renderMnestixInfrastructureForm(emptyMappedInfrastructure);

        const cancelButton = screen.getByText('pages.settings.infrastructure.form.cancel');
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(onCancel).toHaveBeenCalled();
        });
    });

    it('shows different security types options', async () => {
        await renderMnestixInfrastructureForm(emptyMappedInfrastructure);

        const securityTypeSelect = screen.getByLabelText('pages.settings.infrastructure.form.securityType');
        expect(securityTypeSelect).toBeInTheDocument();

        // Default Security Type
        expect(screen.getByText('pages.settings.infrastructure.form.securityTypeNone')).toBeInTheDocument();

        // Check if all security types are present
        const securityTypes = ['NONE', 'HEADER', 'PROXY'];
        for (const type of securityTypes) {
            const securityTypeSwitch = screen.getAllByLabelText('pages.settings.infrastructure.form.securityType')[0];
            fireEvent.mouseDown(securityTypeSwitch);

            const optionTextMap: { [key: string]: string } = {
                NONE: 'pages.settings.infrastructure.form.securityTypeNone',
                HEADER: 'pages.settings.infrastructure.form.securityTypeHeaderSecurity',
                PROXY: 'pages.settings.infrastructure.form.securityTypeMnestixProxy',
            };

            const option = await screen.getByRole('option', { name: optionTextMap[type] });
            fireEvent.click(option);

            await waitFor(() => {
                switch (type) {
                    case 'NONE':
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.proxyHeaderValue')).not.toBeInTheDocument();
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.headerName')).not.toBeInTheDocument();
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.headerValue')).not.toBeInTheDocument();
                        break;
                    case 'HEADER':
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.proxyHeaderValue')).not.toBeInTheDocument();
                        expect(screen.getByLabelText('pages.settings.infrastructure.form.headerName')).toBeInTheDocument();
                        expect(screen.getByLabelText('pages.settings.infrastructure.form.headerValue')).toBeInTheDocument();
                        break;
                    case 'PROXY':
                        expect(screen.getByLabelText('pages.settings.infrastructure.form.proxyHeaderValue')).toBeInTheDocument();
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.headerName')).not.toBeInTheDocument();
                        expect(screen.queryByLabelText('pages.settings.infrastructure.form.headerValue')).not.toBeInTheDocument();
                        break;
                }
            });
        }
    });
});
