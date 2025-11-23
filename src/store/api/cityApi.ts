import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/api.type";
import { City } from "@/types/city.type";
import { baseQueryWithReauth } from "./baseApi";
import { ENDPOINTS } from "@/constants/endpoints";

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["City"],
  endpoints: (builder) => ({
    getAllCities: builder.query<ApiResponse<City[]>, void>({
      query: () => ({
        url: ENDPOINTS.CITY.LIST,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ cityId }) => ({
              type: "City" as const,
              id: cityId,
            })),
            { type: "City", id: "LIST" },
          ]
          : [{ type: "City", id: "LIST" }],
    }),
  }),
});

export const { useGetAllCitiesQuery, useLazyGetAllCitiesQuery } = cityApi;
