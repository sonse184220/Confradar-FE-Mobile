import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";
import { ApiResponse } from "@/types/api.type";
import { AvailableCustomerResponse, CreateAbstractRequest, CreateCameraReadyRequest, CreateFullPaperRequest, CreateRevisionPaperSubmissionRequest, CreateRevisionPaperSubmissionResponse, PaperCustomer, PaperDetailResponse, PaperPhase } from "@/types/paper.type";
import { ENDPOINTS } from "@/constants/endpoints";
import { CustomerWaitListResponse, LeaveWaitListRequest } from "@/types/waitlist.type";

export const paperApi = createApi({
    reducerPath: "paperApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Paper"],
    endpoints: (builder) => ({

        // listAllPapers: builder.query<ApiResponse<ListPaper[]>, void>({
        //   query: () => ({
        //     url: endpoint.PAPER.LIST_ALL_PAPERS,
        //     method: "GET",
        //   }),
        //   providesTags: ["Paper"],
        // }),

        listSubmittedPapersForCustomer: builder.query<
            ApiResponse<PaperCustomer[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.PAPER.LIST_SUBMITTED_PAPERS_CUSTOMER,
                method: "GET",
            }),
            providesTags: ["Paper"],
        }),

        getPaperDetailCustomer: builder.query<
            ApiResponse<PaperDetailResponse>,
            string
        >({
            query: (paperId) => ({
                url: `${ENDPOINTS.PAPER.GET_PAPER_DETAIL_CUSTOMER}?paperId=${paperId}`,
                method: "GET",
            }),
            providesTags: ["Paper"],
        }),

        listPaperPhases: builder.query<ApiResponse<PaperPhase[]>, void>({
            query: () => ({
                url: ENDPOINTS.PAPER.LIST_PAPER_PHASES,
                method: "GET",
            }),
            providesTags: ["Paper"],
        }),

        submitAbstract: builder.mutation<ApiResponse<number>, CreateAbstractRequest>({
            query: (body) => {
                const formData = new FormData();
                formData.append("abstractFile", body.abstractFile);
                formData.append("paperId", body.paperId);
                formData.append("title", body.title);
                formData.append("description", body.description);
                body.coAuthorId.forEach((id) => {
                    formData.append("coAuthorId", id);
                });

                return {
                    url: ENDPOINTS.PAPER.SUBMIT_ABSTRACT,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Paper"],
        }),

        listAvailableCustomers: builder.query<
            ApiResponse<AvailableCustomerResponse[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.PAPER.LIST_AVAILABLE_CUSTOMERS,
                method: "GET",
            }),
        }),

        submitFullPaper: builder.mutation<ApiResponse<number>, CreateFullPaperRequest>({
            query: (body) => {
                const formData = new FormData();
                formData.append("fullPaperFile", body.fullPaperFile);
                formData.append("paperId", body.paperId);
                formData.append("title", body.title);
                formData.append("description", body.description);

                return {
                    url: ENDPOINTS.PAPER.SUBMIT_FULLPAPER,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Paper"],
        }),

        submitPaperRevision: builder.mutation<
            ApiResponse<number>,
            CreateRevisionPaperSubmissionRequest
        >({
            query: (body) => {
                const formData = new FormData();
                formData.append("revisionPaperFile", body.revisionPaperFile);
                formData.append("paperId", body.paperId);
                formData.append("title", body.title);
                formData.append("description", body.description);

                return {
                    url: ENDPOINTS.PAPER.SUBMIT_PAPER_REVISION,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Paper"],
        }),

        submitPaperRevisionResponse: builder.mutation<
            ApiResponse<number>,
            CreateRevisionPaperSubmissionResponse
        >({
            query: (body) => ({
                url: ENDPOINTS.PAPER.SUBMIT_PAPER_REVISION_RESPONSE,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Paper"],
        }),

        submitCameraReady: builder.mutation<ApiResponse<string>, CreateCameraReadyRequest>({
            query: (body) => {
                const formData = new FormData();
                formData.append("cameraReadyFile", body.cameraReadyFile);
                formData.append("paperId", body.paperId);
                formData.append("title", body.title);
                formData.append("description", body.description);

                return {
                    url: ENDPOINTS.PAPER.SUBMIT_CAMERA_READY,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Paper"],
        }),

        listCustomerWaitList: builder.query<
            ApiResponse<CustomerWaitListResponse[]>,
            void
        >({
            query: () => ({
                url: ENDPOINTS.PAPER.LIST_CUSTOMER_WAITLIST,
                method: "GET",
            }),
            providesTags: ["Paper"],
        }),

        leaveWaitList: builder.mutation<
            ApiResponse<boolean>,
            LeaveWaitListRequest
        >({
            query: (body) => ({
                url: ENDPOINTS.PAPER.LEAVE_WAITLIST,
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Paper"],
        }),

    }),
});

export const {
    //SON
    useListSubmittedPapersForCustomerQuery,
    useGetPaperDetailCustomerQuery,
    useLazyGetPaperDetailCustomerQuery,
    useListPaperPhasesQuery,
    useSubmitAbstractMutation,
    useListAvailableCustomersQuery,
    useLazyListAvailableCustomersQuery,
    useSubmitFullPaperMutation,
    useSubmitPaperRevisionMutation,
    useSubmitPaperRevisionResponseMutation,
    useSubmitCameraReadyMutation,
    useListCustomerWaitListQuery,
    useLeaveWaitListMutation,
} = paperApi;