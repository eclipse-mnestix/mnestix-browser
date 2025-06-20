'use server';

import { gql } from '@apollo/client';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { createApolloClient } from 'lib/api/graphql/apolloClient';
import { searchQuery, SearchResponse, SearchResponseEntry } from 'lib/api/graphql/catalogQueries';
import { ApiResponseWrapper, wrapErrorCode, wrapSuccess } from 'lib/util/apiResponseWrapper/apiResponseWrapper';

function buildFilterInput(filters?: FilterQuery[]): string {
    if (!filters || filters.length === 0) {
        return '';
    }
    const eclassFilter = filters.filter((filter) => filter.key === 'ECLASS');
    const vecFilter = filters.filter((filter) => filter.key === 'VEC');
    const productClassificationFilters: string[] = [];
    const filterArray = [];

    // ECLASS Filters
    if (eclassFilter.length > 0) {
        productClassificationFilters.push(`{
            system: { eq: "ECLASS" }
            productId: { in: [${eclassFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }
        }`);
    }

    // VEC Filters
    if (vecFilter.length > 0) {
        productClassificationFilters.push(`{
            system: { eq: "VEC" }
            productId: { in: [${vecFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }
        }`);
    }

    if (productClassificationFilters.length !== 0) {
        const productClassificationFilterString = ` {productClassifications: { some: { or: [${productClassificationFilters.join(',')}] } } }`;
        filterArray.push(productClassificationFilterString);
    }

    // ProductClassification filters:
    const productRootFilter = filters.filter((filter) => filter.key === 'PRODUCT_ROOT');
    if (productRootFilter) {
        filterArray.push(`
            {productRoot: { mlValues: {some: { text: { in: [${productRootFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }}}}}
        `);
    }

    const productFamilyFilter = filters.filter((filter) => filter.key === 'PRODUCT_FAMILY');
    if (productFamilyFilter) {
        filterArray.push(`
            {productFamily: { mlValues: {some: { text: { in: [${productFamilyFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }}}}}
        `);
    }

    const productDesignationFilter = filters.filter((filter) => filter.key === 'PRODUCT_DESIGNATION');
    if (productDesignationFilter) {
        filterArray.push(`
            {productDesignation: { mlValues: {some: { text: { in: [${productDesignationFilter.map((filter) => `"${filter.value.trim()}"`).join(',')}] }}}}}
        `);
    }

    if (filterArray.length === 0) {
        return '';
    }
    return filterArray.length > 1 ? `(where: { or: [${filterArray.join(' , ')}]})` : `(where: { ${filterArray} })`;
}

export async function searchProducts(
    filters?: FilterQuery[],
    aasSearcherUrl?: string,
): Promise<ApiResponseWrapper<SearchResponseEntry[]>> {
    if (!aasSearcherUrl) {
        return wrapErrorCode('NOT_FOUND', 'No aasSearcher URL provided');
    }
    const queryString = searchQuery(buildFilterInput(filters));
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
