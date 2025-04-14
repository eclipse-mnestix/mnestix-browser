import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRender } from 'test-utils/CustomRender';import {
    CalculationMethod,
    LinkGHG,
} from 'app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/CalculationMethod';

describe('Calculation Method', () => {
    it('should use correct style', async () => {
        CustomRender(<CalculationMethod calculationMethod="Artificial Goon" />);
        const component = screen.getByTestId('co2-calculation-method-text');
        expect(component).toBeDefined();
        expect(component).toBeInTheDocument();
        expect(component).toHaveStyle('color: rgb(25, 118, 210)');
        expect(component).toHaveStyle('fontSize: [72, 96]');
        expect(component).toHaveStyle('font-weight: 700');
    });

    it('should display the method', async () => {
        CustomRender(<CalculationMethod calculationMethod="Artificial Goon" />);
        const component = screen.getByTestId('co2-calculation-method-text');
        expect(component).toHaveTextContent('Artificial Goon');
    });

    it('should link to GHG website', async () => {
        CustomRender(<CalculationMethod calculationMethod="GHG Protocol" />);
        const component = screen.getByTestId('co2-calculation-method-link');
        expect(component).toBeDefined();
        expect(component).toBeInTheDocument();
        expect(component).toHaveAttribute('href', LinkGHG);
    });
});
