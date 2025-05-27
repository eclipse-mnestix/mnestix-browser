// src/lib/graphql/schema/catalogQueries.ts
import { gql } from '@apollo/client';

/**
 * A dynamic query doesn't work due to cost of the query, the backend thwows an error.
 * Thats why we use a static query here by preparing it as string.
 */
export function searchQuery(whereString: string) {
  return `query {
        entries${whereString} {
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
    }`
}

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
