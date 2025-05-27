// src/lib/services/catalog/catalogActions.ts
'use server';

import { FilterQuery } from 'app/[locale]/marketplace/catalog/_components/FilterContainer';
import { client } from 'lib/api/graphql/apolloClient';
import { GET_PRODUCTS, SEARCH_PRODUCTS, SearchResponse } from 'lib/api/graphql/catalogQueries';

interface StringOperationFilterInput {
    eq?: string;
}

interface ProductClassificationValuesFilterInput {
    system?: StringOperationFilterInput;
}

interface ListFilterInputTypeOfProductClassificationValuesFilterInput {
    some?: ProductClassificationValuesFilterInput;
}

interface AasSearchEntryFilterInput {
    productClassifications?: ListFilterInputTypeOfProductClassificationValuesFilterInput;
}

function buildFilterInput(filters: FilterQuery[]): AasSearchEntryFilterInput {
    return {
        productClassifications: {
            some: {
                system: {
                    eq: 'ECLASS'
                }
            }
        }
    };
}

export async function searchProducts(filters: FilterQuery[]) {
    const where = buildFilterInput(filters);

    try {
        console.log(JSON.stringify(where))
        const { data } = await client.query<SearchResponse>({
            query: SEARCH_PRODUCTS,
            variables: {
                where: where
            },
             fetchPolicy: 'no-cache'
        });
        return data.entries;
    }
    catch (error) {
        console.error('Error searching products:', JSON.stringify(error.result));
        throw error;
    }
}

export async function getProducts(): Promise<SearchResponse> {
    const { data } = await client.query<SearchResponse>({
        query: GET_PRODUCTS,
    });
    return data;
}