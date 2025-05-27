// src/lib/services/catalog/catalogActions.ts
'use server';

import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { client } from 'lib/api/graphql/apolloClient';
import { GET_PRODUCTS, SEARCH_PRODUCTS, SearchResponse } from 'lib/api/graphql/catalogQueries';

interface FilterInput {
    productClassifications?: {
        some: {
            system: {
                eq: string;
            };
        };
    };
}

function buildFilterInput(filters: FilterQuery[]): FilterInput {
    const filterInput: FilterInput = {};

    const eclassFilters = filters.filter(f => f.key === 'ECLASS');
    if (eclassFilters.length > 0) {
        filterInput.productClassifications = {
            some: {
                system: { eq: 'ECLASS' }
            }
        };
    }

    return filterInput;
}
export async function searchProducts(filters: FilterQuery[]) {
    try {
        console.log(JSON.stringify(buildFilterInput(filters)))
        const { data } = await client.query<SearchResponse>({
            query: SEARCH_PRODUCTS,
            variables: {
                where: buildFilterInput(filters)
            }
        });
        return data.entries;
    }
    catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
}

export async function getProducts(): Promise<SearchResponse> {
    const { data } = await client.query<SearchResponse>({
        query: GET_PRODUCTS,
    });
    return data;
}