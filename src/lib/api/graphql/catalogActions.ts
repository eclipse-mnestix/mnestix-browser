// src/lib/services/catalog/catalogActions.ts
'use server';

import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { client } from 'lib/api/graphql/apolloClient';
import { GET_PRODUCTS, SEARCH_PRODUCTS, SearchResponse } from 'lib/api/graphql/catalogQueries';

function buildFilterInput(filters: FilterQuery[]) {
    const filterInput: any = {
        or: []
    };

    filters.forEach(filter => {
        if (filter.key.startsWith('27-') || filter.key.startsWith('44-')) {
            filterInput.or.push({
                productClassifications: {
                    some: {
                        key: { eq: 'eclass' },
                        value: { productId: { eq: filter.key } }
                    }
                }
            });
        }
        // Add other filter conditions...
    });
    console.log(filters)
    return filterInput;
}

export async function searchProducts(filters: FilterQuery[]) {
    console.log(filters)
    const { data } = await client.query<SearchResponse>({
        query: SEARCH_PRODUCTS,
        variables: {
            where: buildFilterInput(filters)
        }
    });
    return data.entries;
}

export async function getProducts() {
    const { data } = await client.query<SearchResponse>({
        query: GET_PRODUCTS,
    });
    return data.entries;
}