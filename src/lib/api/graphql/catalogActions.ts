'use server';

import { gql } from '@apollo/client';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { client } from 'lib/api/graphql/apolloClient';
import { GET_PRODUCTS, searchQuery, SearchResponse, SearchResponseEntry } from 'lib/api/graphql/catalogQueries';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

function buildFilterInput(filters?: FilterQuery[]): string {
    if(!filters || filters.length === 0) {
        return '';
    }
    const eclassFilter = filters.filter(filter => filter.key === 'ECLASS');
    const vecFilter = filters.filter(filter => filter.key === 'VEC');
    const productClassificationFilters: string[] = [];
    const filterArray = [];

    // ECLASS Filters
    if (eclassFilter.length > 0) {
        productClassificationFilters.push(`{
            system: { eq: "ECLASS" }
            productId: { in: [${eclassFilter.map(filter => `"${filter.value.trim()}"`).join(',')}] }
        }`);
    }

    // VEC Filters
    if (vecFilter.length > 0) {
        productClassificationFilters.push(`{
            system: { eq: "VEC" }
            productId: { in: [${vecFilter.map(filter => `"${filter.value.trim()}"`).join(',')}] }
        }`);
    }

    if (productClassificationFilters.length !== 0) {
        const productClassificationFilterString = ` productClassifications: { some: { or: [${productClassificationFilters.join(',')}] } } `;
        filterArray.push(productClassificationFilterString);
    }

    // ProductClassification filters:
    // TODO apply multiple filters by { in: [value1, value2] } instead of { eq: value }
    // TODO apply filters for PRODUCT_FAMILY and PRODUCT_DESIGNATION
    const productRootFilter = filters.find(filter => filter.key === 'PRODUCT_ROOT');
    if (productRootFilter) {
        filterArray.push(`
            productRoot: { value: {eq : "${productRootFilter.value}" }}
        `);
    }

    console.log(filterArray)

    if(filterArray.length === 0) {
        return ''
    }
    return filterArray.length > 1 ? `(where: {${filterArray.join(' OR: ')}})` : `(where: { ${filterArray} })`;
}

export async function searchProducts(filters?: FilterQuery[]):Promise<ApiResponseWrapper<SearchResponseEntry[]>> {
    const queryString = searchQuery(buildFilterInput(filters));
    console.log(queryString)

    const query = gql(queryString);
    try {
        const { data } = await client.query<SearchResponse>({
            query,
        });
        return wrapSuccess(data.entries);
    }
    catch (error) {
        console.error('Error searching products:', JSON.stringify(error.result));
        return wrapErrorCode('UNKNOWN_ERROR', error);
    }
}

export async function getProducts() {
    const { data } = await client.query<SearchResponse>({
        query: GET_PRODUCTS,
    });
    return data.entries;
}