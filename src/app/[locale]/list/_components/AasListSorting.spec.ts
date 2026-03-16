import { sortAasList, SortableAasListEntity } from 'app/[locale]/list/_components/AasListSorting';

const entries: SortableAasListEntity[] = [
    {
        aasId: 'aas-3',
        assetId: 'asset-3',
        manufacturerName: 'Zulu',
        productDesignation: 'Gamma',
    },
    {
        aasId: 'aas-1',
        assetId: 'asset-1',
        manufacturerName: 'Alpha',
        productDesignation: 'Beta',
    },
    {
        aasId: 'aas-2',
        assetId: 'asset-2',
        manufacturerName: undefined,
        productDesignation: 'Alpha',
    },
];

describe('sortAasList', () => {
    it('returns the original order when no sort column is active', () => {
        expect(sortAasList(entries, null, 'asc')).toEqual(entries);
    });

    it('sorts by manufacturer ascending and handles missing values as empty strings', () => {
        const result = sortAasList(entries, 'manufacturer', 'asc');

        expect(result.map((entry) => entry.aasId)).toEqual(['aas-2', 'aas-1', 'aas-3']);
    });

    it('sorts by manufacturer descending', () => {
        const result = sortAasList(entries, 'manufacturer', 'desc');

        expect(result.map((entry) => entry.aasId)).toEqual(['aas-3', 'aas-1', 'aas-2']);
    });

    it('sorts by product designation ascending', () => {
        const result = sortAasList(entries, 'productDesignation', 'asc');

        expect(result.map((entry) => entry.aasId)).toEqual(['aas-2', 'aas-1', 'aas-3']);
    });
});
