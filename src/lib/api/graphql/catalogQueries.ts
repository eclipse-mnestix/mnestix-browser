// src/lib/graphql/schema/catalogQueries.ts
import { gql } from '@apollo/client';

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($where: AasSearchEntryFilterInput) {
        entries(where: $where) {
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
        }
    }
`;

export const GET_PRODUCTS = gql`
    query {
        entries {
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
    thumbnail?: string; // Optional field for thumbnail URL
}
