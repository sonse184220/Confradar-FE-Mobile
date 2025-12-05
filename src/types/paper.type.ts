//CUSTOMER PAPER TYPE
export interface PaperCustomer {
    paperId: string;
    title?: string;
    description?: string;
    paperTitle?: string | null;
    paperDescription?: string | null;
    createdAt?: string | null;

    // presenterId?: string;
    fullPaperId?: string;
    revisionPaperId?: string;
    cameraReadyId?: string;
    abstractId?: string;
    conferenceId?: string;
    paperPhaseId?: string;
    // createdAt?: string;

    phaseName?: string | null;
    researchConferencePhaseId?: string | null;
    ticketId?: string | null;

    conferenceName?: string | null;
    conferenceDescription?: string | null;
    conferenceStartDate?: string | null;
    conferenceEndDate?: string | null;
    conferenceTotalSlot?: number | null;
    conferenceAvailableSlot?: number | null;
    address?: string | null;
    bannerImageUrl?: string | null;
    conferenceCreatedAt?: string | null;
    ticketSaleStart?: string | null;
    ticketSaleEnd?: string | null;
    isInternalHosted?: boolean | null;
    isResearchConference?: boolean | null;
    cityId?: string | null;
    cityName?: string | null;

    conferenceCreatedBy?: string | null;
    conferenceCreatedByEmail?: string | null;
    conferenceCreatedByFullName?: string | null;
    conferenceCreatedByAvatarUrl?: string | null;

    conferenceCategoryId?: string | null;
    conferenceStatusId?: string | null;

    abstract?: AbstractDetailForListType | null;
    fullPaper?: FullPaperDetailForListType | null;
    revisionPaper?: RevisionPaperDetailForListType | null;
    cameraReady?: CameraReadyDetailForListType | null;
}

export interface AbstractDetailForListType {
    abstractId: string;
    abstractUrl: string;
    title: string;
    description: string;
    createdAt: string;
    reviewAt: string | null;
    globalStatusId: string;
    globalStatusName: string;
}

export interface FullPaperDetailForListType {
    fullPaperId: string;
    fullPaperUrl: string;
    title: string;
    description: string;
    reviewStatusId: string;
    reviewStatusName: string;
    createdAt: string;
    reviewAt: string | null;
}

export interface RevisionPaperDetailForListType {
    revisionPaperId: string;
    revisionRound: number;
    globalStatusId: string;
    globalStatusName: string;
    createdAt: string;
    reviewAt: string | null;
    revisionRoundDeadlineId: string;
    revisionRoundDeadlineStartSubmissionDate: string;
    revisionRoundDeadlineEndSubmissionDate: string;
    revisionRoundDeadlineRoundNumber: number;
}

export interface CameraReadyDetailForListType {
    cameraReadyId: string;
    cameraReadyUrl: string;
    title: string;
    description: string;
    createdAt: string;
}

// export interface    PaperCustomer {
//     paperId: string;
//     title?: string;
//     description?: string;

//     // presenterId?: string;
//     fullPaperId?: string;
//     revisionPaperId?: string;
//     cameraReadyId?: string;
//     abstractId?: string;
//     conferenceId?: string;
//     paperPhaseId?: string;
//     createdAt?: string;

//     // cameraReady?: CameraReady | null;
//     // conference?: Conference | null;
//     // paperPhase?: PaperPhase | null;
//     // presenter?: User | null;
// }


export interface PaperDetailResponse {
    paperId: string;
    title?: string;
    description?: string;

    currentPhase: PaperPhase;
    abstract?: Abstract | null;
    fullPaper?: FullPaper | null;
    revisionPaper?: RevisionPaper | null;
    cameraReady?: CameraReady | null;
    created?: string;
}

export interface PaperPhase {
    paperPhaseId: string;
    phaseName?: string | null;
}

export interface Abstract {
    title?: string;
    description?: string;
    abstractId: string;
    globalStatusId?: string | null;
    fileUrl?: string | null;
    created?: string;
    reviewedAt?: string;
}

export interface FullPaper {
    fullPaperId: string;
    title?: string;
    description?: string;
    reviewStatusId?: string | null;
    fileUrl?: string | null;
    created?: string;
    reviewedAt?: string;
}

export interface RevisionPaper {
    revisionPaperId: string;
    title?: string;
    description?: string;
    revisionRound?: number | null;
    overallStatus?: string | null;
    submissions: RevisionSubmission[];
    created?: string;
    reviewedAt?: string;
    // reviews: RevisionReview[];
    // revisionPaperId: string;
    // revisionRound?: number | null;
    // globalStatusId?: string | null;
}

export interface RevisionSubmission {
    submissionId: string;
    title?: string;
    description?: string;
    fileUrl: string;
    revisionDeadline: {
        roundNumher: number;
        deadline: string;
    };
    feedbacks: RevisionSubmissionFeedback[];
    // revisionPaperId: string;
    // revisionRound?: number | null;
    // globalStatusId?: string | null;
}

export interface RevisionSubmissionFeedback {
    feedbackId: string;
    feedBack: string;
    response?: string | null;
    order: number;
    createdAt: string;
    // revisionPaperId: string;
    // revisionRound?: number | null;
    // globalStatusId?: string | null;
}



// export interface RevisionReview {
//     reviewId: string;
//     note?: string;
//     feedBackToAuthor?: string;
//     feedbackMaterialURL?: string;
//     reviewedAt?: string;
// }

export interface CameraReady {
    cameraReadyId: string;
    title?: string;
    description?: string;
    globalStatusId?: string | null;
    fileUrl?: string | null;
    created?: string;
    reviewedAt?: string;
}

export interface CreateAbstractRequest {
    abstractFile: File;
    paperId: string;
    title: string;
    description: string;
    coAuthorId: string[];
}

export interface AvailableCustomerResponse {
    userId: string;
    email?: string;
    fullName?: string;
    avatarUrl?: string;
}

export interface CreateFullPaperRequest {
    fullPaperFile: File;
    paperId: string;
    title: string;
    description: string;
}

export interface CreateRevisionPaperSubmissionRequest {
    revisionPaperFile: File;
    paperId: string;
    title: string;
    description: string;
}

export interface CreateRevisionPaperSubmissionResponse {
    responses: RevisionPaperSubmissionFeedbackResponse[];
    revisionPaperSubmissionId: string;
    paperId: string;
}

export interface RevisionPaperSubmissionFeedbackResponse {
    revisionSubmissionFeedbackId: string;
    response?: string;
}

export interface CreateCameraReadyRequest {
    paperId: string;
    cameraReadyFile: File;
    title: string;
    description: string;
}
