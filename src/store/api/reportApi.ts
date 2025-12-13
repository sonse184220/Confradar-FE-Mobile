import { createApi } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/types/api.type";
import type { OwnReportResponse, ReportFeedbackResponse, ReportRequest, ReportResponseRequest, UnresolvedReportResponse } from "@/types/report.type";
import { baseQueryWithReauth } from "./baseApi";
import { ENDPOINTS } from "@/constants/endpoints";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Report"],
    endpoints: (builder) => ({
        submitReport: builder.mutation<ApiResponse<string>, ReportRequest>({
            query: (data) => ({
                url: ENDPOINTS.REPORT.CREATE,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Report"],
        }),

        getUnresolvedReports: builder.query<ApiResponse<UnresolvedReportResponse[]>, void>({
            query: () => ({
                url: ENDPOINTS.REPORT.GET_UNRESOLVED,
                method: "GET",
            }),
            providesTags: ["Report"],
        }),

        respondToReport: builder.mutation<
            ApiResponse<string>,
            { reportId: string; data: ReportResponseRequest }
        >({
            query: ({ reportId, data }) => ({
                url: ENDPOINTS.REPORT.RESPONSE(reportId),
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Report"],
        }),

        getReportResponses: builder.query<
            ApiResponse<ReportFeedbackResponse>,
            string
        >({
            query: (reportId) => ({
                url: ENDPOINTS.REPORT.GET_RESPONSE(reportId),
                method: "GET",
            }),
            providesTags: ["Report"],
        }),

        getOwnReports: builder.query<
            ApiResponse<OwnReportResponse[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.REPORT.GET_OWN_REPORTS,
                method: "GET",
            }),
            providesTags: ["Report"],
        }),
    }),
});

export const {
    useSubmitReportMutation,
    useGetUnresolvedReportsQuery,
    useLazyGetUnresolvedReportsQuery,
    useRespondToReportMutation,
    useGetReportResponsesQuery,
    useLazyGetReportResponsesQuery,

    useGetOwnReportsQuery,
    useLazyGetOwnReportsQuery,
} = reportApi;
