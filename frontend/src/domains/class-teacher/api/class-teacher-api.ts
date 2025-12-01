import { api, Tag } from '@/api';
import {
  ClassTeacherData,
  ClassTeacherProps,
  ClassTeacherPropsWithId,
  TeachersData
} from '../../class/types';

export const classTeacherApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClassTeachers: builder.query<ClassTeacherData, void>({
      query: () => `/markets`,
      providesTags: (result) =>
        result?.classTeachers?.map(({ id }) => {
          return { type: Tag.CLASS_TEACHERS, id };
        }) || [{ type: Tag.CLASS_TEACHERS }]
    }),
    getClassTeacherDetail: builder.query<ClassTeacherPropsWithId, string | undefined>({
      query: (id) => `/markets/${id}`,
      providesTags: (result) => (result ? [{ type: Tag.CLASS_TEACHERS, id: result.id }] : [])
    }),
    getTeachers: builder.query<TeachersData, void>({
      query: () => `/teachers`
    }),
    addClassTeacher: builder.mutation<{ message: string }, ClassTeacherProps>({
      query: (payload) => ({
        url: `/markets`,
        method: 'POST',
        body: payload
      }),
      invalidatesTags: [Tag.CLASS_TEACHERS]
    }),
    updateClassTeacher: builder.mutation<{ message: string }, ClassTeacherPropsWithId>({
      query: ({ id, ...payload }) => ({
        url: `/markets/${id}`,
        method: 'PUT',
        body: payload
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: Tag.CLASS_TEACHERS, id }]
    })
  })
});

export const {
  useGetClassTeachersQuery,
  useLazyGetClassTeachersQuery,
  useGetClassTeacherDetailQuery,
  useLazyGetTeachersQuery,
  useAddClassTeacherMutation,
  useUpdateClassTeacherMutation
} = classTeacherApi;
