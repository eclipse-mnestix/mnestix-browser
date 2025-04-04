import { CustomRender } from 'test-utils/CustomRender';
import { screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { AddressPerLifeCyclePhase, ProductJourney } from './ProductJourney';
import { ProductLifecycleStage } from 'lib/enums/ProductLifecycleStage.enum';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));

const firstAddress: AddressPerLifeCyclePhase = {
    address: {
        street: 'teststreet',
        cityTown: 'testtowm',
        houseNumber: '2',
        country: 'testcountry',
        zipCode: 'testzipcode',
        latitude: 52.321705475489594,
        longitude: 9.811600807768746,
    },
    lifeCyclePhase: ProductLifecycleStage.A3Production,
};
const secondAddress: AddressPerLifeCyclePhase = {
    address: {
        street: 'teststreet',
        cityTown: 'testtowm',
        houseNumber: '3',
        country: 'testcountry',
        zipCode: 'testzipcode',
        latitude: 48.36854557956184,
        longitude: 10.93445997546203,
    },
    lifeCyclePhase: ProductLifecycleStage.B6UsageEnergy,
};

describe('ProductJourney', () => {
    it('renders the ProductJourney', async () => {
        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[firstAddress, secondAddress]} />);
        const map = screen.getByTestId('product-journey-box');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();

        const addressList = screen.getAllByTestId('test-address-list');
        expect(addressList).toBeDefined();
        expect(addressList.length).toBe(2);
        expect(addressList[0]).toBeInTheDocument();
        expect(addressList[1]).toBeInTheDocument();
    });

    it('shows positions on the map', async () => {
        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[firstAddress, secondAddress]} />);

        const map = screen.getByTestId('product-journey-box');
        expect(map).toBeDefined();
        expect(map).toBeInTheDocument();

        expect(map.firstChild).toHaveClass('ol-viewport');
    });
});
