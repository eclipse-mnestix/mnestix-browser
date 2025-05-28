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
    const eclassFilter = filters.find(filter => filter.key === 'ECLASS');
    const vecFilter = filters.find(filter => filter.key === 'VEC');
    const productClassificationFilters: string[] = [];

    if (eclassFilter) {
        productClassificationFilters.push(`{
            system: { eq: "ECLASS" }
            productId: { in: [${eclassFilter.value.split(',').map(val => `"${val.trim()}"`).join(',')}] }
        }`);
    }
    if (vecFilter) {
        productClassificationFilters.push(`{
            system: { eq: "VEC" }
            productId: { in: [${vecFilter.value.split(',').map(val => `"${val.trim()}"`).join(',')}] }
        }`);
    }

    if (productClassificationFilters.length === 0) {
        return '';
    }

    const filterString = `{ productClassifications: { some: { or: [${productClassificationFilters.join(',')}] } } }`;
    return `(where: ${filterString})`;
}

export async function searchProducts(filters?: FilterQuery[]):Promise<ApiResponseWrapper<SearchResponseEntry[]>> {
  /*  if (!filters || filters.length === 0) {
        return wrapSuccess(getProducts());
    } */
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