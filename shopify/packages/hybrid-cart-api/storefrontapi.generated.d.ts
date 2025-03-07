/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@solidifront/codegen/storefront-api-types';

export type UpdateCartDiscountsMutationVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
  discountCodes?: StorefrontAPI.InputMaybe<Array<StorefrontAPI.Scalars['String']['input']> | StorefrontAPI.Scalars['String']['input']>;
}>;


export type UpdateCartDiscountsMutation = { cartDiscountCodesUpdate?: StorefrontAPI.Maybe<{ userErrors: Array<Pick<StorefrontAPI.CartUserError, 'field' | 'message'>> }> };

interface GeneratedQueryTypes {
}

interface GeneratedMutationTypes {
  "#graphql\n  mutation updateCartDiscounts($id: ID!, $discountCodes: [String!]) {\n    cartDiscountCodesUpdate(cartId: $id, discountCodes: $discountCodes) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": {return: UpdateCartDiscountsMutation, variables: UpdateCartDiscountsMutationVariables},
}

declare module '@solidifront/storefront-client/effect' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
