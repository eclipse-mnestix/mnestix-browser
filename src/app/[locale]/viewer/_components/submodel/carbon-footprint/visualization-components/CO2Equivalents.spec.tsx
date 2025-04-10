import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';
import { CO2Equivalents } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/CO2Equivalents';

describe('CarbonFootprint - CO2 Equivalents', () => {
    it('should use correct style', async () => {
        CustomRenderNextIntl(<CO2Equivalents totalCO2Equivalents={7.125} />);
        const component = screen.getByTestId('co2-equivalents');
        expect(component).toBeDefined();
        expect(component).toBeInTheDocument();
        expect(component).toHaveStyle('color: rgb(25, 118, 210)');
        expect(component).toHaveStyle('fontSize: [72, 96]');
        expect(component).toHaveStyle('font-weight: 700');
        expect(component).toHaveStyle('lineHeight: 1');
    });

    it('should display three digit number', async () => {
        CustomRenderNextIntl(<CO2Equivalents totalCO2Equivalents={7.125} />);
        const component = screen.getByTestId('co2-equivalents');
        expect(component).toHaveTextContent('7.125 kg');
    });

    it('should round to three digits', async () => {
        CustomRenderNextIntl(<CO2Equivalents totalCO2Equivalents={7.125857} />);
        const component = screen.getByTestId('co2-equivalents');
        expect(component).toHaveTextContent('7.126 kg');
    });

    it('should not fill to three digits', async () => {
        CustomRenderNextIntl(<CO2Equivalents totalCO2Equivalents={7.1} />);
        const component = screen.getByTestId('co2-equivalents');
        expect(component).toHaveTextContent('7.1 kg');
    });
});
