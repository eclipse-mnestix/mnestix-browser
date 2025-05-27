'use server';

import { gql } from '@apollo/client';
import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { client } from 'lib/api/graphql/apolloClient';
import { GET_PRODUCTS, searchQuery, SearchResponse } from 'lib/api/graphql/catalogQueries';

function buildFilterInput(filters: FilterQuery[]): string {
    const eclassFilter = filters.find(filter => filter.key === 'ECLASS');
    let filterString = ''
    if (eclassFilter) {
        filterString = `{productClassifications: {
            some: {
                system: {
                    eq: "ECLASS"
                }
                productId: {
                   in: [${eclassFilter.value.split(',').map((val) => `"${val.trim()}"`).join(',')}]
                }
            }}
        }`
    }
    return filterString ? `(where: ${filterString})` : '';
}

export async function searchProducts(filters?: FilterQuery[]) {
    if (!filters || filters.length === 0) {
        return getProducts();
    }
    const queryString = searchQuery(buildFilterInput(filters));
    console.log(queryString)

    const query = gql(queryString);
    try {
        const { data } = await client.query<SearchResponse>({
            query,
        });
        return data.entries;
    }
    catch (error) {
        console.error('Error searching products:', JSON.stringify(error.result));
        throw error;
    }
}

export async function getProducts() {
    const { data } = await client.query<SearchResponse>({
        query: GET_PRODUCTS,
    });
    return data.entries;
}