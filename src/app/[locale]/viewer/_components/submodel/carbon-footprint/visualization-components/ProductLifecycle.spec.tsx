import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { ProductLifecycleStage } from 'lib/enums/ProductLifecycleStage.enum';
import {
    ProductLifecycle
} from 'app/[locale]/viewer/_components/submodel/carbon-footprint/visualization-components/ProductLifecycle';
import { CustomRenderNextIntl } from 'test-utils/CustomRenderNextIntl';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));


const completedStages =
    [ProductLifecycleStage.A1RawMaterialSupply,
    ProductLifecycleStage.A2CradleToGate,
    ProductLifecycleStage.A3Production,
    ProductLifecycleStage.A4TransportToFinalDestination
    ] ;

describe('ProductLifecycle', () => {
    it('should render the ProductLifecycle with all steps', async () => {
        CustomRenderNextIntl(<ProductLifecycle completedStages={completedStages} />);
        const stepper = screen.getByTestId('product-lifecycle-stepper');
        expect(stepper).toBeDefined();
        expect(stepper).toBeInTheDocument();

        const completedSteps = screen.getAllByTestId('product-lifecycle-completed-step');
        expect(completedSteps).toBeDefined();
        expect(completedSteps.length).toBe(4);

        completedSteps.forEach((el) => {
            expect(el).toBeInTheDocument();
        });

        const nextSteps = screen.getAllByTestId('product-lifecycle-next-step');
        expect(nextSteps).toBeDefined();
        expect(nextSteps.length).toBe(1);
    });

    it('should render no completed steps if none are completed', async () => {
        CustomRenderNextIntl(<ProductLifecycle completedStages={[]} />);
        const stepper = screen.getByTestId('product-lifecycle-stepper');
        expect(stepper).toBeDefined();
        expect(stepper).toBeInTheDocument();

        const completedSteps= screen.queryByTestId('product-lifecycle-completed-step')
        expect(completedSteps).toBeNull();

        const addressList = screen.getAllByTestId('product-lifecycle-next-step');
        expect(addressList).toBeDefined();
        expect(addressList.length).toBe(1);
    });


});
