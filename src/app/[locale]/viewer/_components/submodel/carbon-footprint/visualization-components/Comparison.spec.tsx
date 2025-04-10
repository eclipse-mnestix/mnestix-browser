import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';
import { Comparison } from './Comparison';

describe('CarbonFootprint - CO2 Comparison', () => {
    it('should use correct style', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toBeDefined();
        expect(component).toBeInTheDocument();
        expect(component).toHaveStyle('color: rgb(25, 118, 210)');
        expect(component).toHaveStyle('fontSize: 36');
        expect(component).toHaveStyle('font-weight: 700');
    });

    it('should show years to one decimal', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={16} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1.3 years');
    });

    it('should show months to one decimal', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={1.75} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1.7 months');
    });

    it('should show months below 12 months', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={12.49} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('12 months');
    });

    it('should switch to years above 12 months', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={12.51} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1 year');
    });

    it('should show singular on exactly one', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={1} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('1 month');
    });

    it('should show less than a month', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={0.01} />);
        const component = screen.getByTestId('co2-comparison-value');
        expect(component).toHaveTextContent('less than a month');
    });

    it('should display the tree', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-tree');
        expect(component).toBeInTheDocument();
    });

    it('should show the assumption text', async () => {
        CustomRenderNextIntl(<Comparison co2Equivalents={25} />);
        const component = screen.getByTestId('co2-comparison-assumption');
        expect(component).toBeInTheDocument();
    });
});
