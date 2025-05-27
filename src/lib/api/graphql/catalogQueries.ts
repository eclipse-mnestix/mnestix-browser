// src/lib/graphql/schema/catalogQueries.ts
import { gql } from '@apollo/client';

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($where: AasSearchEntryFilterInput!) {
        entries(where: $where) {
            id

        }
    }
`;

export const GET_PRODUCTS = gql`
    query {
        entries(where: { productClassifications: { some: { system: { eq: "ECLASS" } } } }) {
            id
            productRoot {
                value
                mlValues {
                    text
                    language
                }
            }
            productFamily {
                mlValues {
                    language
                    text
                }
            }
            productDesignation {
                mlValues {
                    language
                    text
                }
            }
            productClassifications {
                system
                productId
                version
            }
            manufacturerName {
              mlValues {
                language
                text
              }
            }
            thumbnailUrl
        }
    }
    
`;

export interface SearchResponse {
    entries: Array<SearchResponseEntry>;
}

export interface SearchResponseEntry {
    id: string;
    productRoot: {
        value: string | null;
        mlValues: Array<{
            text: string;
            language: string;
        }>;
    };
    productFamily: {
        value: string | null;
        mlValues: Array<{
            text: string;
            language: string;
        }>;
    };
    productDesignation: {
        value: string | null;
        mlValues: Array<{
            text: string;
            language: string;
        }>;
    };
    productClassifications: Array<{
        system: string;
        productId: string;
        version: string;
    }>;
    manufacturerName: {
        value: string | null;
        mlValues: Array<{
            text: string;
            language: string;
        }>;
    };
    thumbnailUrl: string;
}
