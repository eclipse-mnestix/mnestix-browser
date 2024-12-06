import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderReactIntl } from 'test-utils/CustomRenderReactIntl';
import { Comparison } from './Comparison';

describe('CarbonFootprint - CO2 Comparison', () => {
    it('should use correct style', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toBeDefined();
        expect(component).toBeInTheDocument();
        expect(component).toHaveStyle('color: rgb(25, 118, 210)');
        expect(component).toHaveStyle('fontSize: 36');
        expect(component).toHaveStyle('font-weight: 700');
    });

    it('should show years to one decimal', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={16} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1.3 Years');
    });

    it('should show months to one decimal', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={1.75} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1.7 Months');
    });

    it('should show months below 12 months', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={12.49} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('12 Months');
    });

    it('should switch to years above 12 months', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={12.51} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1 Years');
    });

    it('should display the tree', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-tree');
        expect(component).toBeInTheDocument();
    });

    it('should show the assumption text', async () => {
        CustomRenderReactIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-assumption');
        expect(component).toBeInTheDocument();
    });
});
