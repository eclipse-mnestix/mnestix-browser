'use server';

import { gql } from '@apollo/client';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { createApolloClient } from 'lib/api/graphql/apolloClient';
import { searchQuery, SearchResponse, SearchResponseEntry } from 'lib/api/graphql/catalogQueries';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

const FilterKey = {
    ECLASS: 'ECLASS',
    PRODUCT_ROOT: 'PRODUCT_ROOT',
    PRODUCT_FAMILY: 'PRODUCT_FAMILY',
    PRODUCT_DESIGNATION: 'PRODUCT_DESIGNATION',
} as const;

function buildFilterInput(filters?: FilterQuery[]): string {
    if (!filters || filters.length === 0) {
        return '';
    }

    const eclassFilter = filters.filter((filter) => filter.key === FilterKey.ECLASS);

    const excludedFromGeneric = Object.keys(FilterKey) as Array<keyof typeof FilterKey>;

    const genericFilterMap = new Map<string, string[]>();
    filters.forEach((filter) => {
        if (!excludedFromGeneric.includes(filter.key as keyof typeof FilterKey)) {
            if (!genericFilterMap.has(filter.key)) {
                genericFilterMap.set(filter.key, []);
            }
            if (typeof filter.value === 'string') {
                genericFilterMap.get(filter.key)?.push(filter.value.trim());
            }
        }
    });

    const genericFilter = Array.from(genericFilterMap.entries()).map(([key, values]) => ({
        key,
        value: values.join(','),
    }));

    const productClassificationFilters: string[] = [];
    const filterArray = [];

    // ECLASS Filters
    if (eclassFilter.length > 0) {
        productClassificationFilters.push(`{
            system: { eq: "ECLASS" }
            productId: { in: [${eclassFilter
                .map((filter) => (typeof filter.value === 'string' ? `"${filter.value.trim()}"` : ''))
                .filter((val) => val !== '')
                .join(',')}] }
        }`);
    }

    // Generic Filters
    if (genericFilter.length > 0) {
        genericFilter.forEach((filter) => {
            productClassificationFilters.push(`{
                system: { eq: "${filter.key}" }
                productId: { in: [${filter.value
                    .split(',')
                    .map((value) => `"${value.trim()}"`)
                    .join(',')}] }
            }`);
        });
    }

    if (productClassificationFilters.length !== 0) {
        const productClassificationFilterString = ` {productClassifications: { some: { or: [${productClassificationFilters.join(',')}] } } }`;
        filterArray.push(productClassificationFilterString);
    }

    // ProductClassification filters:
    const productRootFilter = filters.filter((filter) => filter.key === FilterKey.PRODUCT_ROOT);
    if (productRootFilter) {
        filterArray.push(`
            {productRoot: { mlValues: {some: { text: { in: [${productRootFilter
                .map((filter) => (typeof filter.value === 'string' ? `"${filter.value.trim()}"` : ''))
                .filter((val) => val !== '')
                .join(',')}] }}}}}
        `);
    }
    /*
    const productFamilyFilter = filters.filter((filter) => filter.key === FilterKey.PRODUCT_FAMILY);
    if (productFamilyFilter) {
        filterArray.push(`
            {productFamily: { mlValues: {some: { text: { in: [${productFamilyFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }}}}}
        `);
    }

    const productDesignationFilter = filters.filter((filter) => filter.key === FilterKey.PRODUCT_DESIGNATION);
    if (productDesignationFilter) {
        filterArray.push(`
            {productDesignation: { mlValues: {some: { text: { in: [${productDesignationFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }}}}}
        `);
    }
    */
    if (filterArray.length === 0) {
        return '';
    }
    return filterArray.length > 1 ? `(where: { or: [${filterArray.join(' , ')}]})` : `(where: { ${filterArray} })`;
}

export async function searchProducts(
    aasSearcherUrl?: string,
    filters?: FilterQuery[],
): Promise<ApiResponseWrapper<SearchResponseEntry[]>> {
    if (!aasSearcherUrl) {
        return wrapErrorCode('NOT_FOUND', 'No aasSearcher URL provided');
    }
    const queryString = searchQuery(buildFilterInput(filters));
    console.log('GraphQL Query:', queryString);
    const query = gql(queryString);
    try {
        const client = createApolloClient(aasSearcherUrl);
        const { data } = await client.query<SearchResponse>({
            query,
        });
        return wrapSuccess(data.entries);
    } catch (error) {
        console.error('Error searching products:', JSON.stringify(error.result));
        return wrapErrorCode('UNKNOWN_ERROR', error);
    }
}
