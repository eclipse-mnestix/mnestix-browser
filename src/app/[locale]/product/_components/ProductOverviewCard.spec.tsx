import { expect } from '@jest/globals';
import { screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { CustomRender } from 'test-utils/CustomRender';
import { ProductOverviewCard } from './ProductOverviewCard';
import { useAasStore } from 'stores/AasStore';
import { useCurrentAasContext } from 'components/contexts/CurrentAasContext';

// Mock the next/navigation router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the AAS context
jest.mock('./../../../../stores/AasStore', () => ({
    useAasStore: jest.fn(),
}));

jest.mock('./../../../../lib/hooks/useFindValueByIdShort', () => ({
    useFindValueByIdShort: jest.fn().mockImplementation(() => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        return (idShort: any) => {
            switch (idShort) {
                case 'ManufacturerName':
                    return 'Test Manufacturer';
                case 'ManufacturerProductDesignation':
                    return 'Test Product';
                case 'ManufacturerArticleNumber':
                    return 'ART-123456';
                case 'ManufacturerOrderCode':
                    return 'ORDER-789';
                case 'ManufacturerProductRoot':
                    return 'Root-123';
                case 'ManufacturerProductFamily':
                    return 'Family-XYZ';
                case 'ManufacturerProductType':
                    return 'Type-ABC';
                default:
                    return null;
            }
        };
    }),
}));

// Mock the CurrentAasContext
jest.mock('../../../../components/contexts/CurrentAasContext', () => ({
    useCurrentAasContext: jest.fn(),
}));

// Mock utility functions
jest.mock('./../../../../lib/util/SubmodelResolverUtil', () => ({
    findSubmodelByIdOrSemanticId: jest.fn().mockImplementation((submodels, semanticId, idShort) => {
        if (idShort === 'TechnicalData') {
            return {
                id: 'technical-data-id',
                submodelElements: [],
            };
        } else if (idShort === 'Nameplate') {
            return {
                id: 'nameplate-id',
                submodelElements: [
                    {
                        idShort: 'Markings',
                        modelType: { name: 'SubmodelElementCollection' },
                        value: [
                            {
                                idShort: 'Marking',
                                modelType: { name: 'SubmodelElementCollection' },
                                value: [
                                    {
                                        idShort: 'MarkingName',
                                        modelType: { name: 'Property' },
                                        value: 'CE',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
        }
        return undefined;
    }),
    findSubmodelElementByIdShort: jest.fn().mockImplementation((elements, idShort) => {
        if (idShort === 'Markings') {
            return {
                idShort: 'Markings',
                modelType: { name: 'SubmodelElementCollection' },
                value: [
                    {
                        idShort: 'Marking',
                        modelType: { name: 'SubmodelElementCollection' },
                        value: [
                            {
                                idShort: 'MarkingName',
                                modelType: { name: 'Property' },
                                value: 'CE',
                            },
                        ],
                    },
                ],
            };
        }
        if (idShort === 'CompanyLogo' || idShort === 'ManufacturerLogo') {
            return {
                idShort: idShort,
                modelType: { name: 'File' },
                value: '/logo.png',
            };
        }
        if (idShort === 'ProductClassifications') {
            return {
                idShort: 'ProductClassifications',
                modelType: { name: 'SubmodelElementCollection' },
                value: [
                    {
                        idShort: 'ProductClassification',
                        modelType: { name: 'SubmodelElementCollection' },
                        value: [
                            {
                                idShort: 'ProductClassificationSystem',
                                modelType: { name: 'Property' },
                                value: 'ECLASS',
                            },
                            {
                                idShort: 'ProductClassId',
                                modelType: { name: 'Property' },
                                value: '12345',
                            },
                        ],
                    },
                ],
            };
        }
        return undefined;
    }),
}));

describe('ProductOverviewCard', () => {
    const mockPush = jest.fn();
    const mockAddData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAasStore as jest.Mock).mockReturnValue({ addAasData: mockAddData });
        (useCurrentAasContext as jest.Mock).mockReturnValue({
            infrastructureName: 'TestInfrastructure',
        });
    });

    const mockAas = {
        id: 'test-aas-id',
        assetInformation: {
            globalAssetId: 'global-asset-id',
        },
    };

    const mockSubmodels = [
        {
            id: 'technical-data-id',
            idShort: 'TechnicalData',
            submodelElements: [],
        },
        {
            id: 'nameplate-id',
            idShort: 'Nameplate',
            submodelElements: [],
        },
    ];

    it('renders loading skeleton when isLoading is true', () => {
        CustomRender(
            <ProductOverviewCard
                aas={null}
                submodels={null}
                isLoading={true}
                isAccordion={false}
                displayName={'Test Product'}
            />,
        );

        expect(screen.getByTestId('aas-loading-skeleton')).toBeInTheDocument();
    });

    it('renders product information correctly when data is available', async () => {
        CustomRender(
            /* eslint-disable @typescript-eslint/no-explicit-any */
            <ProductOverviewCard
                aas={mockAas as any}
                submodels={mockSubmodels as any}
                isLoading={false}
                isAccordion={false}
                displayName={'Test Product'}
            />,
        );

        // Check for product information
        expect(screen.getByTestId('datarow-manufacturer-article-number')).toBeInTheDocument();
        expect(screen.getByTestId('datarow-manufacturer-order-code')).toBeInTheDocument();
        expect(screen.getByTestId('datarow-manufacturer-name')).toBeInTheDocument();
        expect(screen.getByTestId('datarow-manufacturer-product-designation')).toBeInTheDocument();

        // Check for markings element in KeyFactsBox
        expect(screen.getByTestId('markings-element')).toBeInTheDocument();
    });

    it('renders in accordion mode correctly', () => {
        CustomRender(
            <ProductOverviewCard
                aas={mockAas as any}
                submodels={mockSubmodels as any}
                isLoading={false}
                isAccordion={true}
                displayName={'Test Product'}
            />,
        );

        // Check that product information is still present
        expect(screen.getByTestId('datarow-manufacturer-product-designation')).toBeInTheDocument();
        expect(screen.getByTestId('datarow-manufacturer-article-number')).toBeInTheDocument();
    });
});
