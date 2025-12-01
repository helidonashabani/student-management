import { api, Tag } from '@/api';

import { paymentData, paymentForm, paymentFormWithId } from '../types';

const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getpayments: builder.query<paymentData, void>({
      query: () => `/payments`,
      providesTags: (result) =>
        result?.payments?.map(({ id }) => {
          return { type: Tag.paymentS, id };
        }) || [{ type: Tag.paymentS }]
    }),
    addNewpayment: builder.mutation<{ message: string }, paymentForm>({
      query: ({ name }) => ({
        url: `/payments`,
        method: 'POST',
        body: { name }
      }),
      invalidatesTags: (result) => (result ? [Tag.paymentS] : [])
    }),
    getpayment: builder.query<paymentFormWithId, number>({
      query: (id) => `payments/${id}`,
      providesTags: (result) => (result ? [{ type: Tag.paymentS, id: result.id }] : [])
    }),
    updatepayment: builder.mutation<{ message: string }, paymentFormWithId>({
      query: ({ id, name }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: { name }
      }),
      invalidatesTags: (result, _error, { id }) => (result ? [{ type: Tag.paymentS, id }] : [])
    }),
    deletepayment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result) => (result ? [Tag.paymentS] : [])
    })
  })
});

export const {
  useGetpaymentsQuery,
  useGetpaymentQuery,
  useUpdatepaymentMutation,
  useDeletepaymentMutation,
  useAddNewpaymentMutation
} = paymentApi;
