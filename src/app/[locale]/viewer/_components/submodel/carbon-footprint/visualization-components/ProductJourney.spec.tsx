import { CustomRender } from 'test-utils/CustomRender';
import { screen, waitFor } from '@testing-library/react';
import { expect } from '@jest/globals';
import { AddressPerLifeCyclePhase, ProductJourney } from './ProductJourney';
import { ProductLifecycleStage } from 'app/[locale]/viewer/_components/submodel/carbon-footprint/ProductLifecycleStage.enum';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockGeocodeResponse = {
    ok: true,
    json: async () => [
        {
            lat: '50',
            lon: '10',
        },
    ],
};

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

const addressWithoutCoordinates: AddressPerLifeCyclePhase = {
    address: {
        street: 'teststreet',
        cityTown: 'testtowm',
        houseNumber: '4',
        country: 'testcountry',
        zipCode: 'testzipcode',
    },
    lifeCyclePhase: ProductLifecycleStage.A1RawMaterialSupply,
};

describe('ProductJourney', () => {
    beforeEach(() => {
        mockFetch.mockClear();
        mockFetch.mockResolvedValue(mockGeocodeResponse);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the ProductJourney with existing coordinates', async () => {
        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[firstAddress, secondAddress]} />);
        
        await waitFor(() => {
            const map = screen.getByTestId('product-journey-box');
            const addressList = screen.getAllByTestId('test-address-list');
            
            expect(map).toBeDefined();
            expect(map).toBeInTheDocument();
            expect(addressList).toBeDefined();
            expect(addressList.length).toBe(2);
            expect(addressList[0]).toBeInTheDocument();
            expect(addressList[1]).toBeInTheDocument();
            expect(mockFetch).not.toHaveBeenCalled();
        }, { timeout: 3000 });
    });

    it('shows positions on the map', async () => {
        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[firstAddress, secondAddress]} />);

        await waitFor(() => {
            const map = screen.getByTestId('product-journey-box');
            expect(map).toBeDefined();
            expect(map).toBeInTheDocument();
            expect(map.firstChild).toHaveClass('ol-viewport');
        }, { timeout: 3000 });
    });

    it('geocodes addresses without coordinates using mocked fetch', async () => {
        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[addressWithoutCoordinates]} />);

        await waitFor(() => {
            const map = screen.getByTestId('product-journey-box');
            const addressList = screen.getAllByTestId('test-address-list');
            
            expect(map).toBeInTheDocument();
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('https://nominatim.openstreetmap.org/search?format=json&q=')
            );
            expect(addressList).toBeDefined();
            expect(addressList.length).toBe(1);
        }, { timeout: 3000 });
    });

    it('handles geocoding failure gracefully', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[addressWithoutCoordinates]} />);

        await waitFor(() => {
            const addressList = screen.getAllByTestId('test-address-list');
            expect(addressList).toBeDefined();
            expect(addressList.length).toBe(1);
        }, { timeout: 3000 });
    });

    it('renders address list when no coordinates are available', () => {
        const addressWithoutAnyInfo: AddressPerLifeCyclePhase = {
            address: {},
            lifeCyclePhase: ProductLifecycleStage.A1RawMaterialSupply,
        };

        CustomRender(<ProductJourney addressesPerLifeCyclePhase={[addressWithoutAnyInfo]} />);

        const addressList = screen.getAllByTestId('test-address-list');
        const map = screen.queryByTestId('product-journey-box');
        
        expect(addressList).toBeDefined();
        expect(addressList.length).toBe(1);
        expect(map).not.toBeInTheDocument();
    });
});