export interface ConferenceResponse {
  conferenceId: string;
  conferenceName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalSlot?: number;
  availableSlot?: number;
  address?: string;
  bannerImageUrl?: string;
  createdAt?: string;
  ticketSaleStart?: string;
  ticketSaleEnd?: string;
  isInternalHosted?: boolean;
  isResearchConference?: boolean;
  cityId?: string;
  conferenceCategoryId?: string;
  conferenceStatusId?: string;
  // policies?: ConferencePolicyResponse[];
  // media?: ConferenceMediaResponse[];
  // sponsors?: SponsorResponse[];
  conferencePrices?: ConferencePriceResponse[];
  // sessions?: ConferenceSessionResponse[];
}

export interface TechnicalConferenceDetailResponse {
  conferenceId?: string;
  conferenceName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalSlot?: number;
  availableSlot?: number;
  address?: string;
  bannerImageUrl?: string;
  createdAt?: string;
  ticketSaleStart?: string;
  ticketSaleEnd?: string;
  isInternalHosted?: boolean;
  isResearchConference?: boolean;
  cityId?: string;
  conferenceCategoryId?: string;
  conferenceStatusId?: string;
  targetAudience?: string;
  refundPolicies?: RefundPolicyResponse[];
  conferenceMedia?: ConferenceMediaResponse[];
  policies?: ConferencePolicyResponse[];
  sponsors?: SponsorResponse[];
  sessions?: TechnicalConferenceSessionResponse[];
  conferencePrices?: ConferencePriceResponse[]; // 
}

export interface ResearchConferenceDetailResponse {
  conferenceId: string;
  conferenceName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  totalSlot?: number;
  availableSlot?: number;
  address?: string;
  bannerImageUrl?: string;
  createdAt?: string;
  ticketSaleStart?: string;
  ticketSaleEnd?: string;
  isInternalHosted?: boolean;
  isResearchConference?: boolean;
  cityId?: string;
  conferenceCategoryId?: string;
  conferenceStatusId?: string;

  // Research Conference specific fields
  name?: string;
  paperFormat?: string;
  numberPaperAccept?: number;
  revisionAttemptAllowed?: number;
  rankingDescription?: string;
  allowListener?: boolean;
  rankValue?: string;
  rankYear?: number;
  reviewFee?: number;
  rankingCategoryId?: string;
  rankingCategoryName?: string;

  // Research Conference related data
  rankingFileUrls?: RankingFileUrlResponse[];
  materialDownloads?: MaterialDownloadResponse[];
  rankingReferenceUrls?: RankingReferenceUrlResponse[];
  researchPhase?: ResearchConferencePhaseResponse;
  researchSessions?: ResearchConferenceSessionResponse[];

  // Shared data (same as technical conference)
  policies?: ConferencePolicyResponse[];
  sponsors?: SponsorResponse[];
  refundPolicies?: RefundPolicyResponse[];
  conferenceMedia?: ConferenceMediaResponse[];
  conferencePrices?: ConferencePriceResponse[];
}

export interface ConferencePolicyResponse {
  policyId: string;
  policyName?: string;
  description?: string;
}

export interface ConferenceMediaResponse {
  mediaId: string;
  mediaUrl?: string;
}

export interface SponsorResponse {
  sponsorId: string;
  name?: string;
  imageUrl?: string;
}

export interface ConferencePriceResponse {
  conferencePriceId: string;
  ticketPrice?: number;
  ticketName?: string;
  ticketDescription?: string;
  isAuthor?: boolean;
  totalSlot?: number;
  availableSlot?: number;
  pricePhases?: ConferencePricePhaseResponse[];
}

export interface ConferencePricePhaseResponse {
  pricePhaseId: string;
  phaseName?: string;
  startDate?: string;
  endDate?: string;
  applyPercent?: number;
  totalSlot?: number;
  availableSlot?: number;
}

export interface TechnicalConferenceSessionResponse {
  conferenceSessionId: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  sessionDate?: string;
  conferenceId?: string;
  statusId?: string;
  roomId?: string;
  room?: RoomInfoResponse;
  speakers?: SpeakerResponse[];
  sessionMedia?: ConferenceSessionMediaResponse[];
}

export interface RoomInfoResponse {
  roomId: string;
  number?: string;
  displayName?: string;
  destinationId?: string;
}

export interface SpeakerResponse {
  speakerId: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ConferenceSessionMediaResponse {
  conferenceSessionMediaId: string;
  conferenceSessionMediaUrl?: string;
}

export interface RankingFileUrlResponse {
  rankingFileUrlId: string;
  fileUrl?: string;
}

export interface MaterialDownloadResponse {
  materialDownloadId: string;
  fileName?: string;
  fileDescription?: string;
  fileUrl?: string;
}

export interface RankingReferenceUrlResponse {
  referenceUrlId: string;
  referenceUrl?: string;
}

export interface ResearchConferencePhaseResponse {
  researchConferencePhaseId?: string;
  conferenceId?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  fullPaperStartDate?: string;
  fullPaperEndDate?: string;
  reviewStartDate?: string;
  reviewEndDate?: string;
  reviseStartDate?: string;
  reviseEndDate?: string;
  cameraReadyStartDate?: string;
  cameraReadyEndDate?: string;
  isWaitlist?: boolean;
  isActive?: boolean;
  revisionRoundDeadlines?: RevisionRoundDeadlineResponse[];
}

export interface RevisionRoundDeadlineResponse {
  revisionRoundDeadlineId?: string;
  endDate?: string;
  roundNumber?: number;
  researchConferencePhaseId?: string;
}

export interface ResearchConferenceSessionResponse {
  conferenceSessionId: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  conferenceId?: string;
  roomId?: string;
  room?: RoomInfoResponse;
  sessionMedia?: ConferenceSessionMediaResponse[];
}

export interface RefundPolicyResponse {
  refundPolicyId?: string;
  percentRefund?: number;
  refundDeadline?: string;
  refundOrder?: number;
}

export interface FavouriteConferenceDetailResponse {
  conferenceId: string;
  favouriteCreatedAt?: string;
  conferenceName?: string;
  conferenceDescription?: string;
  bannerImageUrl?: string;
  conferenceStartDate?: string;
  conferenceEndDate?: string;
  ticketSaleStart?: string;
  ticketSaleEnd?: string;
  isInternalHosted?: boolean;
  isResearchConference?: boolean;
  availableSlot?: number;
}

export interface DeletedFavouriteConferenceResponse {
  conferenceId: string;
  isDeleted: boolean;
}

export interface AddedFavouriteConferenceResponse {
  conferenceId: string;
  isAdded: boolean;
}

export interface FavouriteConferenceRequest {
  conferenceId: string;
}