import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { SelectRepository } from 'app/[locale]/list/_components/filter/SelectRepository';
import * as connectionServerActions from 'lib/services/database/infrastructureDatabaseActions';

jest.mock('./../../../../../lib/services/database/infrastructureDatabaseActions');

describe('SelectRepository', () => {
    it('Fires repository changed event when changing the select value', async () => {
        const mockDB = jest.fn(() => {
            return [
                {
                    url: 'https://test-repository.de/repo',
                    infrastructureName: 'Test',
                    id: 'test-repo-id',
                },
            ];
        });
        const repositoryChanged = jest.fn();
        (connectionServerActions.getAasRepositoriesIncludingDefault as jest.Mock).mockImplementation(mockDB);
        CustomRender(
            <SelectRepository
                onSelectedRepositoryChanged={() => {
                    repositoryChanged();
                }}
            />,
        );

        await waitFor(() => screen.getByTestId('repository-select'));
        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);

        const firstElement = screen.getAllByRole('option')[0];
        fireEvent.click(firstElement);

        expect(repositoryChanged).toHaveBeenCalled();
    });
});
