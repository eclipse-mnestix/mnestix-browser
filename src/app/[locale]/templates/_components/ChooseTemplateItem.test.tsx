import { fireEvent, screen } from '@testing-library/react';
import { expect, jest } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';
import { ChooseTemplateItem } from './ChooseTemplateItem';

describe('ChooseTemplateItem', () => {
    it('calls onClick exactly once when clicked', () => {
        const handleClick = jest.fn();

        CustomRender(<ChooseTemplateItem label="Test label" onClick={handleClick} />);

        const item = screen.getByText('Test label');
        fireEvent.click(item);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
