import { BASE_SERVER_URL } from './../consts';
import {
  AddCommentsParams,
  Comment,
  GetTracksParams,
  Track,
} from '../types/track';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const tracksApi = createApi({
  reducerPath: 'tracks',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_SERVER_URL }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['trackList', 'track'],
  endpoints: (builder) => ({
    getAllTracks: builder.query<Track[], GetTracksParams>({
      query: ({ count = '25', offset = '0' }) => ({
        url: '/tracks',
        params: {
          count,
          offset,
        },
      }),
      providesTags: ['trackList'],
    }),
    getTrackById: builder.query<Track, string>({
      query: (id) => ({
        url: `/tracks/${id}`,
      }),
      providesTags: ['track'],
    }),
    searchTrack: builder.query<Track[], string>({
      query: (searchQuery) => ({
        url: `/tracks/search`,
        params: {
          query: searchQuery,
        },
      }),
      providesTags: ['track'],
    }),
    createComment: builder.mutation<Comment, AddCommentsParams>({
      query: ({ comment, trackId }) => ({
        url: `/tracks/comment`,
        method: 'POST',
        body: {
          ...comment,
          trackId,
        },
      }),
      invalidatesTags: ['track'],
    }),
    createTrack: builder.mutation<Track, FormData>({
      query: (body: FormData) => ({
        url: '/tracks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['trackList'],
    }),
    deleteTrack: builder.mutation<string, string>({
      query: (id: string) => ({
        url: `/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['trackList'],
    }),
    incrementListens: builder.mutation<Track, string>({
      query: (id: string) => ({
        url: `/tracks/listen/${id}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAllTracksQuery,
  useCreateTrackMutation,
  useDeleteTrackMutation,
  useGetTrackByIdQuery,
  useCreateCommentMutation,
  useSearchTrackQuery,
  useIncrementListensMutation,
  util: { getRunningQueriesThunk },
} = tracksApi;

export const { getAllTracks, createTrack, getTrackById } = tracksApi.endpoints;
