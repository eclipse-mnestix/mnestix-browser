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
                value
            }
            productDesignation {
                value
            }
            productClassifications {
                key
                value {
                    productId
                    version
                }
            }
        }
    }
`;

export const GET_PRODUCTS = gql`
query {
  entries {
    id
    createdTime
    productRoot {
      semanticId
      idShortPath
      value
      mlValues {
        language
        text
      }
    }
    saveData
  }
}
`;

export interface SearchResponse {
    entries: Array<{
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
        };
        productDesignation: {
            value: string | null;
        };
        productClassifications: Array<{
            key: string;
            value: {
                productId: string;
                version: string;
            };
        }>;
    }>;
}