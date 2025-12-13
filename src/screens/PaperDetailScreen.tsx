import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import {
  Appbar,
  Card,
  Chip,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePaperCustomer } from '../hooks/usePaperCustomer';
import { PaperDetailResponse, PaperPhase, RevisionDeadlineDetail, RevisionPaper, RevisionSubmission, RevisionSubmissionFeedback } from '../types/paper.type';
import StepIndicator from 'react-native-step-indicator';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import { Abstract, ResearchPhaseDtoDetail, ResearchConferenceInfo, FullPaper, CameraReady } from '@/types/paper.type';
import { parseEndOfDay, parseStartOfDay, PhaseValidationResult, validatePhaseTime } from '@/utils/timeValidation';
import { useGlobalTime } from '@/utils/TimeContext';
import { ConferencePriceResponse, ResearchConferenceDetailResponse, ResearchConferencePhaseResponse } from '@/types/conference.type';
import { useConference } from '@/hooks/useConference';
// import StatusChip from './StatusChip';
// import FileLink from './FileLink';

interface PaperDetailScreenProps {
  navigation: any;
  route: {
    params: {
      paperId: string;
    };
  };
}

// Progress Step Styles
const progressStepsStyle = {
  activeStepIconBorderColor: '#3B82F6',
  activeLabelColor: '#3B82F6',
  activeStepNumColor: '#FFFFFF',
  activeStepIconColor: '#3B82F6',
  completedStepIconColor: '#10B981',
  completedProgressBarColor: '#10B981',
  completedCheckColor: '#FFFFFF',
  disabledStepIconColor: '#E5E7EB',
  disabledStepNumColor: '#9CA3AF',
  labelColor: '#6B7280',
  progressBarColor: '#E5E7EB',
};

// File Link Component
const FileLink: React.FC<{
  fileUrl?: string | null;
  fileName: string;
}> = ({ fileUrl, fileName }) => {
  const handlePress = async () => {
    if (!fileUrl) {
      Alert.alert('Thông báo', 'File chưa được upload');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(fileUrl);
      if (canOpen) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Lỗi', 'Không thể mở file');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở file');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!fileUrl}
      className={`flex-row items-center p-3 rounded-lg border ${fileUrl
        ? 'border-blue-200 bg-blue-50'
        : 'border-gray-200 bg-gray-50'
        }`}
    >
      <Icon
        name="insert-drive-file"
        size={24}
        color={fileUrl ? '#3B82F6' : '#9CA3AF'}
      />
      <Text
        className={`ml-3 flex-1 ${fileUrl ? 'text-blue-600' : 'text-gray-500'
          }`}
      >
        {fileName}
      </Text>
      {fileUrl && (
        <Icon name="open-in-new" size={20} color="#3B82F6" />
      )}
    </TouchableOpacity>
  );
};

// Status Chip Component
const StatusChip: React.FC<{
  status?: string | null;
  // type: '' | 'review' | 'overall';
}> = ({ status }) => {
  const getStatusColor = (status?: string | null) => {
    if (!status) return '#9CA3AF';

    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('accepted')) {
      return '#10B981';
    }
    if (lowerStatus.includes('rejected')) {
      return '#EF4444';
    }
    if (lowerStatus.includes('pending')) {
      return '#F59E0B';
    }
    return '#6B7280';
  };

  const color = getStatusColor(status);

  return (
    <Chip
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
      }}
      textStyle={{ color, fontSize: 12 }}
    >
      {status || 'Chưa có trạng thái'}
    </Chip>
  );
};

interface AbstractTabProps {
  abstract?: Abstract | null;
  researchPhase?: ResearchPhaseDtoDetail;
  researchConferenceInfo?: ResearchConferenceInfo | null;
}

const AbstractTab: React.FC<AbstractTabProps> = ({
  abstract,
  researchPhase,
  researchConferenceInfo
}) => {
  const { now } = useGlobalTime();

  // Validate phase timing - same logic as web
  const phaseValidation = validatePhaseTime(
    researchPhase?.registrationStartDate,
    researchPhase?.registrationEndDate,
    now
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-white mb-2">
          Giai đoạn Abstract
        </Text>
        <Text className="text-gray-400 text-sm">
          Thông tin abstract và đồng tác giả cho bài báo của bạn.
        </Text>
      </View>

      {/* Phase timing information */}
      {phaseValidation.formattedPeriod && (
        <View
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
        >
          <Text className="text-gray-300 text-sm mb-3">
            <Text className="font-semibold">Thời gian diễn ra:</Text>{' '}
            {phaseValidation.formattedPeriod}
          </Text>

          {/* Time validation message */}
          {!phaseValidation.isAvailable && (
            <View
              className="rounded-lg p-3"
              style={{
                backgroundColor: phaseValidation.isExpired ? '#7F1D1D' : '#78350F',
                borderColor: phaseValidation.isExpired ? '#991B1B' : '#92400E',
                borderWidth: 1
              }}
            >
              <Text
                className="text-sm"
                style={{ color: phaseValidation.isExpired ? '#FCA5A5' : '#FCD34D' }}
              >
                {phaseValidation.message}
              </Text>
            </View>
          )}

          {/* Available deadline countdown */}
          {phaseValidation.isAvailable && phaseValidation.daysRemaining && (
            <View
              className="rounded-lg p-3"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <Text className="text-blue-300 text-sm">
                {phaseValidation.message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Abstract Content */}
      {abstract ? (
        <View
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          {/* Title */}
          {abstract.title && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Tiêu đề
              </Text>
              <Text className="text-white text-base font-semibold">
                {abstract.title}
              </Text>
            </View>
          )}

          {/* Description */}
          {abstract.description && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Mô tả
              </Text>
              <Text className="text-white text-base leading-6">
                {abstract.description}
              </Text>
            </View>
          )}

          {/* Abstract ID */}
          {/* {abstract.abstractId && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Abstract ID
              </Text>
              <Text className="text-gray-300 text-sm font-mono">
                {abstract.abstractId}
              </Text>
            </View>
          )} */}

          {/* Status */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-400 mb-2">
              Trạng thái
            </Text>
            <StatusChip status={abstract.status} />
          </View>

          {/* Created Date */}
          {abstract.created && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Ngày tạo
              </Text>
              <Text className="text-white text-base">
                {new Date(abstract.created).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Updated Date */}
          {abstract.updated && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Cập nhật lần cuối
              </Text>
              <Text className="text-white text-base">
                {new Date(abstract.updated).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Rejection Reason if exists */}
          {abstract.reason && (
            <View
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: '#7F1D1D', borderColor: '#991B1B', borderWidth: 1 }}
            >
              <Text className="text-sm font-medium text-red-300 mb-2">
                Phản hồi từ Reviewer
              </Text>
              <Text className="text-red-200 text-sm leading-5">
                {abstract.reason}
              </Text>
            </View>
          )}

          {/* File Abstract */}
          {abstract.fileUrl && (
            <View>
              <Text className="text-sm font-medium text-gray-400 mb-2">
                File Abstract
              </Text>
              <FileLink
                fileUrl={abstract.fileUrl}
                fileName={`${abstract.title || 'Abstract'}.pdf`}
              />
            </View>
          )}

          {/* Mobile Note - No editing allowed */}
          {phaseValidation.isAvailable && (
            <View
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để chỉnh sửa hoặc nộp abstract mới, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* No Abstract Submitted */
        <View
          className="p-8 rounded-xl items-center"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          <Icon name="description" size={64} color="#4B5563" />
          <Text className="text-gray-400 mt-4 text-center text-base">
            Bạn chưa có submission nào
          </Text>

          {phaseValidation.isAvailable ? (
            <View
              className="mt-4 p-3 rounded-lg w-full"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để nộp abstract, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500 mt-2 text-center text-sm">
              {phaseValidation.isExpired
                ? 'Giai đoạn nộp abstract đã kết thúc'
                : 'Giai đoạn nộp abstract chưa bắt đầu'
              }
            </Text>
          )}
        </View>
      )}

      {/* Conference Info (Optional) */}
      {researchConferenceInfo && (
        <View
          className="mt-4 p-4 rounded-xl"
          style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
        >
          <Text className="text-sm font-medium text-gray-400 mb-2">
            Hội nghị
          </Text>
          <Text className="text-white text-base font-semibold">
            {researchConferenceInfo.conferenceName}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

// export default AbstractTab;
// const AbstractTab: React.FC<{ abstract?: any }> = ({ abstract }) => (
//   <View
//     className="m-4 p-4 rounded-xl"
//     style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
//   >
//     <Text className="text-lg font-semibold text-white mb-4">
//       Abstract
//     </Text>

//     {abstract ? (
//       <View className="space-y-4">
//         {/* Abstract ID */}
//         {abstract.abstractId && (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-400 mb-2">
//               Abstract ID
//             </Text>
//             <Text className="text-white text-base">
//               {abstract.abstractId}
//             </Text>
//           </View>
//         )}

//         {/* Created Date */}
//         {abstract.createdAt && (
//           <View className="mb-4">
//             <Text className="text-sm font-medium text-gray-400 mb-2">
//               Ngày tạo
//             </Text>
//             <Text className="text-white text-base">
//               {new Date(abstract.createdAt).toLocaleDateString('vi-VN')} {new Date(abstract.createdAt).toLocaleTimeString('vi-VN')}
//             </Text>
//           </View>
//         )}

//         {/* Status */}
//         <View className="mb-4">
//           <Text className="text-sm font-medium text-gray-400 mb-2">
//             Trạng thái
//           </Text>
//           <StatusChip status={abstract.globalStatusId} type="global" />
//         </View>

//         {/* File Abstract */}
//         <View>
//           <Text className="text-sm font-medium text-gray-400 mb-2">
//             File Abstract
//           </Text>
//           <FileLink
//             fileUrl={abstract.fileUrl}
//             fileName="Abstract.pdf"
//           />
//         </View>
//       </View>
//     ) : (
//       <View className="items-center py-8">
//         <Icon name="description" size={48} color="#6B7280" />
//         <Text className="text-gray-400 mt-2">
//           Abstract chưa được nộp
//         </Text>
//       </View>
//     )}
//   </View>
// );

// Full Paper Tab Component
interface FullPaperTabProps {
  fullPaper?: FullPaper | null;
  researchPhase?: ResearchPhaseDtoDetail;
}

const FullPaperTab: React.FC<FullPaperTabProps> = ({
  fullPaper,
  researchPhase
}) => {
  const { now } = useGlobalTime();

  // Validate phase timing - same logic as web
  const phaseValidation = validatePhaseTime(
    researchPhase?.fullPaperStartDate,
    researchPhase?.fullPaperEndDate,
    now
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-white mb-2">
          Giai đoạn Full Paper
        </Text>
        <Text className="text-gray-400 text-sm">
          Bản full paper hoàn chỉnh cho bài báo của bạn.
        </Text>
      </View>

      {/* Phase timing information */}
      {phaseValidation.formattedPeriod && (
        <View
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
        >
          <Text className="text-gray-300 text-sm mb-3">
            <Text className="font-semibold">Thời gian diễn ra:</Text>{' '}
            {phaseValidation.formattedPeriod}
          </Text>

          {/* Time validation message */}
          {!phaseValidation.isAvailable && (
            <View
              className="rounded-lg p-3"
              style={{
                backgroundColor: phaseValidation.isExpired ? '#7F1D1D' : '#78350F',
                borderColor: phaseValidation.isExpired ? '#991B1B' : '#92400E',
                borderWidth: 1
              }}
            >
              <Text
                className="text-sm"
                style={{ color: phaseValidation.isExpired ? '#FCA5A5' : '#FCD34D' }}
              >
                {phaseValidation.message}
              </Text>
            </View>
          )}

          {/* Available deadline countdown */}
          {phaseValidation.isAvailable && phaseValidation.daysRemaining && (
            <View
              className="rounded-lg p-3"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <Text className="text-blue-300 text-sm">
                {phaseValidation.message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Full Paper Content */}
      {fullPaper ? (
        <View
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          {/* Title */}
          {fullPaper.title && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Tiêu đề
              </Text>
              <Text className="text-white text-base font-semibold">
                {fullPaper.title}
              </Text>
            </View>
          )}

          {/* Description */}
          {fullPaper.description && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Mô tả
              </Text>
              <Text className="text-white text-base leading-6">
                {fullPaper.description}
              </Text>
            </View>
          )}

          {/* Review Status */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-400 mb-2">
              Trạng thái Review
            </Text>
            <StatusChip status={fullPaper.reviewStatus} />
          </View>

          {/* Created Date */}
          {fullPaper.created && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Ngày tạo
              </Text>
              <Text className="text-white text-base">
                {new Date(fullPaper.created).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Updated Date */}
          {fullPaper.updated && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Cập nhật lần cuối
              </Text>
              <Text className="text-white text-base">
                {new Date(fullPaper.updated).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Rejection Reason if exists */}
          {fullPaper.reason && (
            <View
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: '#7F1D1D', borderColor: '#991B1B', borderWidth: 1 }}
            >
              <Text className="text-sm font-medium text-red-300 mb-2">
                Lý do từ chối
              </Text>
              <Text className="text-red-200 text-sm leading-5">
                {fullPaper.reason}
              </Text>
            </View>
          )}

          {/* File Full Paper */}
          {fullPaper.fileUrl && (
            <View>
              <Text className="text-sm font-medium text-gray-400 mb-2">
                File Full Paper
              </Text>
              <FileLink
                fileUrl={fullPaper.fileUrl}
                fileName={`${fullPaper.title || 'FullPaper'}.pdf`}
              />
            </View>
          )}

          {/* Mobile Note - No editing allowed */}
          {phaseValidation.isAvailable && (
            <View
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để chỉnh sửa hoặc nộp full paper mới, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* No Full Paper Submitted */
        <View
          className="p-8 rounded-xl items-center"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          <Icon name="article" size={64} color="#4B5563" />
          <Text className="text-gray-400 mt-4 text-center text-base">
            Bạn chưa có submission nào
          </Text>

          {phaseValidation.isAvailable ? (
            <View
              className="mt-4 p-3 rounded-lg w-full"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để nộp full paper, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500 mt-2 text-center text-sm">
              {phaseValidation.isExpired
                ? 'Giai đoạn nộp full paper đã kết thúc'
                : 'Giai đoạn nộp full paper chưa bắt đầu'
              }
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

// const FullPaperTab: React.FC<{ fullPaper?: any }> = ({ fullPaper }) => (
//   <View className="p-4">
//     <Text className="text-lg font-semibold text-gray-900 mb-4">
//       Full Paper
//     </Text>

//     {fullPaper ? (
//       <View className="space-y-4">
//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-2">
//             Trạng thái Review
//           </Text>
//           <StatusChip status={fullPaper.reviewStatusId} />
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-2">
//             File Full Paper
//           </Text>
//           <FileLink
//             fileUrl={fullPaper.fileUrl}
//             fileName="FullPaper.pdf"
//           />
//         </View>
//       </View>
//     ) : (
//       <View className="items-center py-8">
//         <Icon name="article" size={48} color="#E5E7EB" />
//         <Text className="text-gray-500 mt-2">
//           Full Paper chưa được nộp
//         </Text>
//       </View>
//     )}
//   </View>
// );

// Revision Paper Tab Component
interface RevisionTabProps {
  paperId: string;
  revisionPaper?: RevisionPaper | null;
  researchPhase?: ResearchPhaseDtoDetail;
  revisionDeadline?: RevisionDeadlineDetail[];
}

const RevisionTab: React.FC<RevisionTabProps> = ({
  paperId,
  revisionPaper,
  researchPhase,
  revisionDeadline
}) => {
  const { now } = useGlobalTime();
  const [selectedSubmission, setSelectedSubmission] = useState<RevisionSubmission | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<RevisionSubmissionFeedback | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const revisionValidation: PhaseValidationResult = useMemo(() => {
    if (!revisionDeadline || revisionDeadline.length === 0) {
      return {
        isAvailable: false,
        isExpired: false,
        isPending: true,
        message: "Thông tin deadline revision chưa được cập nhật"
      };
    }

    const currentSubmissionCount = revisionPaper?.submissions?.length || 0;

    const sortedDeadlines = [...revisionDeadline].sort((a, b) => {
      if (a.roundNumber !== b.roundNumber) {
        return (a.roundNumber || 0) - (b.roundNumber || 0);
      }
      if (a.startSubmissionDate && b.startSubmissionDate) {
        return new Date(a.startSubmissionDate).getTime() - new Date(b.startSubmissionDate).getTime();
      }
      return 0;
    });

    const nextRoundIndex = currentSubmissionCount;
    const nextDeadline = sortedDeadlines[nextRoundIndex];

    if (!nextDeadline) {
      return {
        isAvailable: false,
        isExpired: true,
        isPending: false,
        message: "Đã hết round deadline để nộp revision submission"
      };
    }

    if (nextRoundIndex > 0) {
      const previousSubmission = revisionPaper?.submissions?.[nextRoundIndex - 1];

      if (!previousSubmission) {
        return {
          isAvailable: false,
          isExpired: false,
          isPending: true,
          message: `Cần hoàn thành submission Round ${nextRoundIndex} trước`
        };
      }

      if (!previousSubmission.feedbacks || previousSubmission.feedbacks.length === 0) {
        return {
          isAvailable: false,
          isExpired: false,
          isPending: true,
          message: `Chờ feedback từ reviewer cho Round ${nextRoundIndex}`
        };
      }

      const end = nextDeadline.endSubmissionDate ? parseEndOfDay(nextDeadline.endSubmissionDate) : undefined;

      if (!end) {
        return {
          isAvailable: false,
          isExpired: false,
          isPending: true,
          message: `Deadline cho Round ${nextRoundIndex + 1} chưa được cập nhật`
        };
      }

      if (now > end) {
        return {
          isAvailable: false,
          isExpired: true,
          isPending: false,
          message: "Bạn đã hết hạn thao tác cho round này."
        };
      }

      const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isAvailable: true,
        isExpired: false,
        isPending: false,
        daysRemaining,
        message: `Bạn còn ${daysRemaining} ngày để nộp Round ${nextRoundIndex + 1}.`
      };
    }

    return validatePhaseTime(
      nextDeadline.startSubmissionDate,
      nextDeadline.endSubmissionDate,
      now
    );
  }, [revisionDeadline, revisionPaper?.submissions, now]);

  // All rounds logic - same as web
  const allRounds = useMemo(() => {
    if (!revisionDeadline || revisionDeadline.length === 0) return [];

    const sortedDeadlines = [...revisionDeadline].sort((a, b) => {
      if (a.roundNumber !== b.roundNumber) {
        return (a.roundNumber || 0) - (b.roundNumber || 0);
      }
      if (a.startSubmissionDate && b.startSubmissionDate) {
        return new Date(a.startSubmissionDate).getTime() - new Date(b.startSubmissionDate).getTime();
      }
      return 0;
    });

    return sortedDeadlines.map((deadline, index) => {
      const existingSubmission = revisionPaper?.submissions?.find(
        sub => sub.revisionRoundId === deadline.revisionRoundDeadlineId
      );

      let validation: PhaseValidationResult;

      if (index > 0) {
        const previousSubmission = revisionPaper?.submissions?.[index - 1];

        if (!previousSubmission) {
          validation = {
            isAvailable: false,
            isExpired: false,
            isPending: true,
            message: `Cần hoàn thành submission Round ${index} trước`
          };
        } else if (!previousSubmission.feedbacks || previousSubmission.feedbacks.length === 0) {
          validation = {
            isAvailable: false,
            isExpired: false,
            isPending: true,
            message: `Chờ feedback từ reviewer cho Round ${index}`
          };
        } else {
          const start = deadline.startSubmissionDate ? parseStartOfDay(deadline.startSubmissionDate) : undefined;
          const end = deadline.endSubmissionDate ? parseEndOfDay(deadline.endSubmissionDate) : undefined;

          if (!start || !end) {
            validation = {
              isAvailable: false,
              isExpired: false,
              isPending: true,
              message: "Thông tin ngày submission chưa được cập nhật",
            };
          } else {
            const formattedPeriod = `${start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${end.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

            if (now > end) {
              validation = {
                isAvailable: false,
                isExpired: true,
                isPending: false,
                formattedPeriod,
                message: "Bạn đã hết hạn thao tác cho round này."
              };
            } else {
              const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              validation = {
                isAvailable: true,
                isExpired: false,
                isPending: false,
                daysRemaining,
                formattedPeriod,
                message: `Bạn còn ${daysRemaining} ngày để nộp Round ${index + 1}.`
              };
            }
          }
        }
      } else {
        validation = validatePhaseTime(
          deadline.startSubmissionDate,
          deadline.endSubmissionDate,
          now
        );
      }

      return {
        roundNumber: deadline.roundNumber || 0,
        deadline,
        validation,
        submission: existingSubmission || null,
        hasSubmission: !!existingSubmission
      };
    });
  }, [revisionDeadline, revisionPaper?.submissions, now]);

  const isRevisionCompleted = useMemo(() => {
    return revisionPaper?.revisionRoundDeadlineId != null;
  }, [revisionPaper?.revisionRoundDeadlineId]);

  const getCompletedRoundNumber = useMemo(() => {
    if (!isRevisionCompleted || !revisionPaper?.revisionRoundDeadlineId) return null;

    const completedRound = revisionDeadline?.find(
      d => d.revisionRoundDeadlineId === revisionPaper.revisionRoundDeadlineId
    );

    return completedRound?.roundNumber || null;
  }, [isRevisionCompleted, revisionPaper?.revisionRoundDeadlineId, revisionDeadline]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoundStatusColor = (round: any) => {
    if (isRevisionCompleted && getCompletedRoundNumber === round.roundNumber) {
      return '#10B981'; // green
    }
    if (round.hasSubmission) return '#10B981';
    if (round.validation.isAvailable) return '#3B82F6';
    if (round.validation.isPending) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4">
      {/* Header */}
      <View className="mb-6">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-xl font-bold text-white">
            Giai đoạn Revision
          </Text>
          <TouchableOpacity
            onPress={() => setShowGuide(true)}
            className="flex-row items-center px-3 py-2 rounded-lg"
            style={{ backgroundColor: '#3B82F6' }}
          >
            <Icon name="info" size={16} color="white" />
            <Text className="text-white text-xs ml-1 font-medium">Hướng dẫn</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-sm">
          Chỉnh sửa bài báo dựa trên phản hồi của reviewer.
        </Text>
      </View>

      {/* Revision Paper Info */}
      {revisionPaper ? (
        <View
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          <Text className="text-sm font-medium text-gray-400 mb-3">
            Thông tin Revision Paper
          </Text>

          {/* Overall Status */}
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-2">Trạng thái tổng</Text>
            <StatusChip status={revisionPaper.overallStatus} />
          </View>

          {/* Submission Count */}
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">Số lượng submission</Text>
            <Text className="text-white text-lg font-bold">
              {revisionPaper.submissions?.length || 0}
            </Text>
          </View>

          {/* Dates */}
          {revisionPaper.created && (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">Ngày tạo</Text>
              <Text className="text-white text-sm">{formatDate(revisionPaper.created)}</Text>
            </View>
          )}

          {revisionPaper.updated && (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">Cập nhật lần cuối</Text>
              <Text className="text-white text-sm">{formatDate(revisionPaper.updated)}</Text>
            </View>
          )}

          {/* Reason if exists */}
          {revisionPaper.reason && (
            <View
              className="mt-2 p-3 rounded-lg"
              style={{ backgroundColor: '#7F1D1D', borderColor: '#991B1B', borderWidth: 1 }}
            >
              <Text className="text-sm font-medium text-red-300 mb-1">Ghi chú</Text>
              <Text className="text-red-200 text-sm">{revisionPaper.reason}</Text>
            </View>
          )}
        </View>
      ) : (
        <View
          className="mb-6 p-8 rounded-xl items-center"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          <Icon name="rate-review" size={64} color="#4B5563" />
          <Text className="text-gray-400 mt-4 text-center">
            Chưa có thông tin revision paper
          </Text>
        </View>
      )}

      {/* Completion Message */}
      {isRevisionCompleted && getCompletedRoundNumber !== null && (
        <View
          className="mb-6 p-4 rounded-lg"
          style={{ backgroundColor: '#064E3B', borderColor: '#059669', borderWidth: 1 }}
        >
          <Text className="text-green-300 text-sm leading-5">
            ✓ Bạn đã hoàn tất vòng chỉnh sửa Round {getCompletedRoundNumber}.
            Bạn không cần thực hiện các vòng sau nữa, vui lòng đợi đến giai đoạn quyết định trạng thái của bài báo.
          </Text>
        </View>
      )}

      {/* All Rounds */}
      {allRounds.length > 0 && (
        <View>
          <Text className="text-lg font-bold text-white mb-4">
            Các Round Revision
          </Text>

          {allRounds.map((round, index) => {
            const isCompleted = isRevisionCompleted && getCompletedRoundNumber === round.roundNumber;
            const isDisabled = isRevisionCompleted && getCompletedRoundNumber !== null &&
              round.roundNumber > getCompletedRoundNumber;

            return (
              <View
                key={`round-${round.roundNumber}`}
                className="mb-4 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: '#1F2937',
                  borderColor: isCompleted ? '#059669' : '#374151',
                  borderWidth: 2,
                  opacity: isDisabled ? 0.6 : 1
                }}
              >
                {/* Round Header */}
                <View
                  className="px-4 py-3"
                  style={{
                    backgroundColor: '#374151',
                    borderBottomWidth: 1,
                    borderBottomColor: '#4B5563'
                  }}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <View
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: getRoundStatusColor(round) }}
                      />
                      <Text className="text-white font-bold text-base">
                        Round {round.roundNumber}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      {isCompleted && (
                        <View
                          className="px-2 py-1 rounded-full mr-2"
                          style={{ backgroundColor: '#064E3B' }}
                        >
                          <Text className="text-green-300 text-xs font-medium">Hoàn tất</Text>
                        </View>
                      )}
                      {isDisabled && (
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#374151' }}
                        >
                          <Text className="text-gray-400 text-xs">Không cần</Text>
                        </View>
                      )}
                      {!isCompleted && !isDisabled && (
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: round.hasSubmission ? '#064E3B' :
                              round.validation.isAvailable ? '#1E3A8A' :
                                round.validation.isPending ? '#78350F' : '#374151'
                          }}
                        >
                          <Text
                            className="text-xs font-medium"
                            style={{
                              color: round.hasSubmission ? '#86EFAC' :
                                round.validation.isAvailable ? '#93C5FD' :
                                  round.validation.isPending ? '#FCD34D' : '#9CA3AF'
                            }}
                          >
                            {round.hasSubmission ? 'Đã nộp' :
                              round.validation.isAvailable ? 'Đang mở' :
                                round.validation.isPending ? 'Sắp tới' : 'Đã đóng'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Round Content */}
                <View className="p-4">
                  {/* Deadline Info */}
                  {round.validation.formattedPeriod && (
                    <View className="mb-3">
                      <Text className="text-xs text-gray-500 mb-1">Thời gian nộp</Text>
                      <Text className="text-white text-sm">{round.validation.formattedPeriod}</Text>
                    </View>
                  )}

                  {/* Validation Message */}
                  <View
                    className="mb-3 p-2 rounded-lg"
                    style={{
                      backgroundColor: round.validation.isAvailable ? '#1E3A8A' :
                        round.validation.isExpired ? '#7F1D1D' :
                          round.validation.isPending ? '#78350F' : '#374151'
                    }}
                  >
                    <Text
                      className="text-xs"
                      style={{
                        color: round.validation.isAvailable ? '#93C5FD' :
                          round.validation.isExpired ? '#FCA5A5' :
                            round.validation.isPending ? '#FCD34D' : '#9CA3AF'
                      }}
                    >
                      {round.validation.message}
                    </Text>
                  </View>

                  {/* Submission Info */}
                  {round.hasSubmission && round.submission ? (
                    <View>
                      {/* Title & Description */}
                      {round.submission.title && (
                        <View className="mb-3">
                          <Text className="text-xs text-gray-500 mb-1">Tiêu đề</Text>
                          <Text className="text-white text-sm font-semibold">
                            {round.submission.title}
                          </Text>
                        </View>
                      )}

                      {round.submission.description && (
                        <View className="mb-3">
                          <Text className="text-xs text-gray-500 mb-1">Mô tả</Text>
                          <Text className="text-white text-sm">{round.submission.description}</Text>
                        </View>
                      )}

                      {/* File */}
                      {round.submission.fileUrl && (
                        <View className="mb-3">
                          <Text className="text-xs text-gray-500 mb-2">File submission</Text>
                          <FileLink
                            fileUrl={round.submission.fileUrl}
                            fileName={`Revision_Round_${round.roundNumber}.pdf`}
                          />
                        </View>
                      )}

                      {/* Feedbacks */}
                      {round.submission.feedbacks && round.submission.feedbacks.length > 0 && (
                        <View>
                          <TouchableOpacity
                            onPress={() => setSelectedSubmission(round.submission)}
                            className="flex-row items-center justify-between p-3 rounded-lg"
                            style={{ backgroundColor: '#1E3A8A' }}
                          >
                            <View className="flex-row items-center">
                              <Icon name="message" size={18} color="#93C5FD" />
                              <Text className="text-blue-300 text-sm ml-2 font-medium">
                                {round.submission.feedbacks.length} Feedback(s) từ Reviewer
                              </Text>
                            </View>
                            <Icon name="chevron-right" size={20} color="#93C5FD" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : !isDisabled && (
                    <View
                      className="p-4 rounded-lg items-center"
                      style={{ backgroundColor: '#374151' }}
                    >
                      <Text className="text-gray-400 text-sm text-center mb-2">
                        Chưa có submission
                      </Text>
                      <View
                        className="mt-2 p-2 rounded-lg"
                        style={{ backgroundColor: '#1E3A8A' }}
                      >
                        <Text className="text-blue-300 text-xs text-center">
                          Vui lòng sử dụng phiên bản web để nộp submission
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Mobile Note */}
      <View
        className="mt-4 p-3 rounded-lg"
        style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
      >
        <View className="flex-row items-center">
          <Icon name="info" size={18} color="#93C5FD" />
          <Text className="text-blue-300 text-xs ml-2 flex-1">
            Để nộp submission hoặc trả lời feedback, vui lòng sử dụng phiên bản web.
          </Text>
        </View>
      </View>

      {/* Feedback Modal */}
      {selectedSubmission && (
        <Modal
          visible={!!selectedSubmission}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setSelectedSubmission(null)}
        >
          <View className="flex-1" style={{ backgroundColor: '#111827' }}>
            <View
              className="px-4 py-3 flex-row items-center justify-between"
              style={{ backgroundColor: '#1F2937', borderBottomWidth: 1, borderBottomColor: '#374151' }}
            >
              <Text className="text-white font-bold text-lg">Feedbacks</Text>
              <TouchableOpacity onPress={() => setSelectedSubmission(null)}>
                <Icon name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {selectedSubmission.feedbacks?.map((feedback, index) => (
                <TouchableOpacity
                  key={feedback.feedbackId}
                  onPress={() => setSelectedFeedback(feedback)}
                  className="mb-4 rounded-xl overflow-hidden"
                  style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
                >
                  <View className="p-4">
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-row items-center">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: '#059669' }}
                        >
                          <Text className="text-white font-bold text-sm">{feedback.order}</Text>
                        </View>
                        <Text className="text-white font-semibold">Feedback #{index + 1}</Text>
                      </View>
                      {feedback.response && (
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#1E3A8A' }}
                        >
                          <Text className="text-blue-300 text-xs">Có phản hồi</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-300 text-sm" numberOfLines={3}>
                      {feedback.feedBack?.replace(/<[^>]*>/g, '') || 'Chưa có feedback'}
                    </Text>
                    <View className="flex-row items-center justify-end mt-2">
                      <Text className="text-blue-400 text-xs mr-1">Xem chi tiết</Text>
                      <Icon name="chevron-right" size={16} color="#60A5FA" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <Modal
          visible={!!selectedFeedback}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setSelectedFeedback(null)}
        >
          <View className="flex-1" style={{ backgroundColor: '#111827' }}>
            <View
              className="px-4 py-3 flex-row items-center justify-between"
              style={{ backgroundColor: '#1F2937', borderBottomWidth: 1, borderBottomColor: '#374151' }}
            >
              <TouchableOpacity
                onPress={() => setSelectedFeedback(null)}
                className="flex-row items-center"
              >
                <Icon name="arrow-back" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-2">Chi tiết Feedback</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Feedback Content */}
              <View
                className="mb-4 rounded-xl overflow-hidden"
                style={{ borderColor: '#059669', borderWidth: 2 }}
              >
                <View
                  className="px-4 py-3"
                  style={{ backgroundColor: '#059669' }}
                >
                  <Text className="text-white font-semibold">Feedback từ Reviewer</Text>
                </View>
                <View className="p-4" style={{ backgroundColor: '#1F2937' }}>
                  <Text className="text-white text-sm leading-6">
                    {selectedFeedback.feedBack?.replace(/<[^>]*>/g, '') || 'Chưa có feedback'}
                  </Text>
                </View>
              </View>

              {/* Response Content */}
              {selectedFeedback.response && (
                <View
                  className="mb-4 rounded-xl overflow-hidden"
                  style={{ borderColor: '#3B82F6', borderWidth: 2 }}
                >
                  <View
                    className="px-4 py-3"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    <Text className="text-white font-semibold">Phản hồi của bạn</Text>
                  </View>
                  <View className="p-4" style={{ backgroundColor: '#1F2937' }}>
                    <Text className="text-white text-sm leading-6">
                      {selectedFeedback.response.replace(/<[^>]*>/g, '')}
                    </Text>
                  </View>
                </View>
              )}

              {!selectedFeedback.response && (
                <View
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#1E3A8A' }}
                >
                  <Text className="text-blue-300 text-xs text-center">
                    Vui lòng sử dụng phiên bản web để trả lời feedback
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Guide Modal */}
      {showGuide && (
        <Modal
          visible={showGuide}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowGuide(false)}
        >
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <View
              className="m-4 p-6 rounded-xl"
              style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1, maxWidth: 400 }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white font-bold text-lg">Hướng dẫn Revision</Text>
                <TouchableOpacity onPress={() => setShowGuide(false)}>
                  <Icon name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <Text className="text-gray-400 font-medium mb-2">Quy trình Revision</Text>
                <Text className="text-gray-300 text-sm leading-6">
                  1. Đọc feedback từ reviewer{'\n'}
                  2. Chỉnh sửa bài báo theo feedback{'\n'}
                  3. Nộp submission mới{'\n'}
                  4. Trả lời feedback (nếu có)
                </Text>
              </View>

              <View>
                <Text className="text-gray-400 font-medium mb-2">Lưu ý</Text>
                <Text className="text-gray-300 text-sm leading-6">
                  • Có thể nộp nhiều submission{'\n'}
                  • Chỉ trả lời feedback khi có nội dung{'\n'}
                  • File chấp nhận: PDF, DOC, DOCX{'\n'}
                  • Sử dụng phiên bản web để nộp/trả lời
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowGuide(false)}
                className="mt-4 py-3 rounded-lg"
                style={{ backgroundColor: '#374151' }}
              >
                <Text className="text-white text-center font-medium">Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};
// const RevisionPaperTab: React.FC<{ revisionPaper?: any }> = ({ revisionPaper }) => (
//   <View className="p-4">
//     <Text className="text-lg font-semibold text-gray-900 mb-4">
//       Paper Revision
//     </Text>

//     {revisionPaper ? (
//       <View className="space-y-4">
//         <View className="flex-row justify-between">
//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Vòng Revision
//             </Text>
//             <Text className="text-2xl font-bold text-blue-600">
//               {revisionPaper.revisionRound || 0}
//             </Text>
//           </View>
//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Trạng thái Tổng
//             </Text>
//             <StatusChip status={revisionPaper.overallStatus} />
//           </View>
//         </View>

//         {revisionPaper.submissions && revisionPaper.submissions.length > 0 && (
//           <View>
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Submissions
//             </Text>
//             {revisionPaper.submissions.map((submission: any, index: number) => (
//               <Card key={submission.submissionId} style={{ marginBottom: 12 }}>
//                 <Card.Content>
//                   <View className="flex-row justify-between items-center mb-2">
//                     <Text className="font-medium">
//                       Submission {index + 1}
//                     </Text>
//                     <Text className="text-xs text-gray-500">
//                       Deadline: Round {submission.revisionDeadline?.roundNumher || 'N/A'}
//                     </Text>
//                   </View>

//                   <FileLink
//                     fileUrl={submission.fileUrl}
//                     fileName={`Revision_${index + 1}.pdf`}
//                   />

//                   {submission.feedbacks && submission.feedbacks.length > 0 && (
//                     <View className="mt-3">
//                       <Text className="text-sm font-medium text-gray-700 mb-2">
//                         Feedbacks ({submission.feedbacks.length})
//                       </Text>
//                       {submission.feedbacks.map((feedback: any) => (
//                         <View key={feedback.feedbackId} className="bg-gray-50 p-3 rounded-lg mb-2">
//                           <Text className="text-sm text-gray-700 mb-1">
//                             {feedback.feedBack}
//                           </Text>
//                           {feedback.response && (
//                             <View className="mt-2 pt-2 border-t border-gray-200">
//                               <Text className="text-xs text-gray-500 mb-1">
//                                 Phản hồi:
//                               </Text>
//                               <Text className="text-sm text-blue-600">
//                                 {feedback.response}
//                               </Text>
//                             </View>
//                           )}
//                         </View>
//                       ))}
//                     </View>
//                   )}
//                 </Card.Content>
//               </Card>
//             ))}
//           </View>
//         )}
//       </View>
//     ) : (
//       <View className="items-center py-8">
//         <Icon name="rate-review" size={48} color="#E5E7EB" />
//         <Text className="text-gray-500 mt-2">
//           Paper Revision chưa có
//         </Text>
//       </View>
//     )}
//   </View>
// );

// Camera Ready Tab Component
interface CameraReadyTabProps {
  cameraReady?: CameraReady | null;
  researchPhase?: ResearchPhaseDtoDetail;
}

const CameraReadyTab: React.FC<CameraReadyTabProps> = ({
  cameraReady,
  researchPhase
}) => {
  const { now } = useGlobalTime();

  // Validate phase timing - same logic as web
  const phaseValidation = validatePhaseTime(
    researchPhase?.cameraReadyStartDate,
    researchPhase?.cameraReadyEndDate,
    now
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="p-4"
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-white mb-2">
          Giai đoạn Camera Ready
        </Text>
        <Text className="text-gray-400 text-sm">
          Bản camera-ready cuối cùng cho bài báo của bạn.
        </Text>
      </View>

      {/* Phase timing information */}
      {phaseValidation.formattedPeriod && (
        <View
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
        >
          <Text className="text-gray-300 text-sm mb-3">
            <Text className="font-semibold">Thời gian diễn ra:</Text>{' '}
            {phaseValidation.formattedPeriod}
          </Text>

          {/* Time validation message */}
          {!phaseValidation.isAvailable && (
            <View
              className="rounded-lg p-3"
              style={{
                backgroundColor: phaseValidation.isExpired ? '#7F1D1D' : '#78350F',
                borderColor: phaseValidation.isExpired ? '#991B1B' : '#92400E',
                borderWidth: 1
              }}
            >
              <Text
                className="text-sm"
                style={{ color: phaseValidation.isExpired ? '#FCA5A5' : '#FCD34D' }}
              >
                {phaseValidation.message}
              </Text>
            </View>
          )}

          {/* Available deadline countdown */}
          {phaseValidation.isAvailable && phaseValidation.daysRemaining && (
            <View
              className="rounded-lg p-3"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <Text className="text-blue-300 text-sm">
                {phaseValidation.message}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Camera Ready Content */}
      {cameraReady ? (
        <View
          className="p-4 rounded-xl"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          {/* Title */}
          {cameraReady.title && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Tiêu đề
              </Text>
              <Text className="text-white text-base font-semibold">
                {cameraReady.title}
              </Text>
            </View>
          )}

          {/* Description */}
          {cameraReady.description && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Mô tả
              </Text>
              <Text className="text-white text-base leading-6">
                {cameraReady.description}
              </Text>
            </View>
          )}

          {/* Status */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-400 mb-2">
              Trạng thái
            </Text>
            <StatusChip status={cameraReady.status} />
          </View>

          {/* Created Date */}
          {cameraReady.created && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Ngày tạo
              </Text>
              <Text className="text-white text-base">
                {new Date(cameraReady.created).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Updated Date */}
          {cameraReady.updated && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400 mb-2">
                Cập nhật lần cuối
              </Text>
              <Text className="text-white text-base">
                {new Date(cameraReady.updated).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}

          {/* Rejection Reason if exists */}
          {cameraReady.reason && (
            <View
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: '#7F1D1D', borderColor: '#991B1B', borderWidth: 1 }}
            >
              <Text className="text-sm font-medium text-red-300 mb-2">
                Lý do từ chối
              </Text>
              <Text className="text-red-200 text-sm leading-5">
                {cameraReady.reason}
              </Text>
            </View>
          )}

          {/* File Camera Ready */}
          {cameraReady.fileUrl && (
            <View>
              <Text className="text-sm font-medium text-gray-400 mb-2">
                File Camera Ready
              </Text>
              <FileLink
                fileUrl={cameraReady.fileUrl}
                fileName={`${cameraReady.title || 'CameraReady'}.pdf`}
              />
            </View>
          )}

          {/* Mobile Note - No editing allowed */}
          {phaseValidation.isAvailable && (
            <View
              className="mt-4 p-3 rounded-lg"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để chỉnh sửa hoặc nộp camera-ready mới, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* No Camera Ready Submitted */
        <View
          className="p-8 rounded-xl items-center"
          style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
        >
          <Icon name="camera" size={64} color="#4B5563" />
          <Text className="text-gray-400 mt-4 text-center text-base">
            Bạn chưa có submission nào
          </Text>

          {phaseValidation.isAvailable ? (
            <View
              className="mt-4 p-3 rounded-lg w-full"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={18} color="#93C5FD" />
                <Text className="text-blue-300 text-xs ml-2 flex-1">
                  Để nộp camera-ready, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-500 mt-2 text-center text-sm">
              {phaseValidation.isExpired
                ? 'Giai đoạn nộp camera-ready đã kết thúc'
                : 'Giai đoạn nộp camera-ready chưa bắt đầu'
              }
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};
// const CameraReadyTab: React.FC<{ cameraReady?: any }> = ({ cameraReady }) => (
//   <View className="p-4">
//     <Text className="text-lg font-semibold text-gray-900 mb-4">
//       Camera Ready
//     </Text>

//     {cameraReady ? (
//       <View className="space-y-4">
//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-2">
//             Trạng thái
//           </Text>
//           <StatusChip status={cameraReady.globalStatusId} />
//         </View>

//         <View>
//           <Text className="text-sm font-medium text-gray-700 mb-2">
//             File Camera Ready
//           </Text>
//           <FileLink
//             fileUrl={cameraReady.fileUrl}
//             fileName="CameraReady.pdf"
//           />
//         </View>
//       </View>
//     ) : (
//       <View className="items-center py-8">
//         <Icon name="camera" size={48} color="#E5E7EB" />
//         <Text className="text-gray-500 mt-2">
//           Camera Ready chưa được nộp
//         </Text>
//       </View>
//     )}
//   </View>
// );
interface PaymentTabProps {
  paperId?: string | null;
  conferenceId?: string | null;
  researchPhase?: ResearchPhaseDtoDetail;
  researchConference?: ResearchConferenceDetailResponse;
  researchConferenceInfo?: ResearchConferenceInfo | null;
}

interface NextPhaseInfo {
  phase: ResearchConferencePhaseResponse;
  isAvailable: boolean;
  hasAvailableSlots: boolean;
}

const PaymentTab: React.FC<PaymentTabProps> = ({
  paperId,
  conferenceId,
  researchPhase,
  researchConference,
  researchConferenceInfo,
}) => {
  const { now } = useGlobalTime();

  // Validate phase timing
  const phaseValidation = validatePhaseTime(
    researchPhase?.authorPaymentStart,
    researchPhase?.authorPaymentEnd,
    now
  );

  const pricesResponse = researchConference?.conferencePrices;

  // Filter author prices only
  const authorPrices = useMemo(() => {
    if (!pricesResponse) return [];
    return Array.isArray(pricesResponse)
      ? pricesResponse.filter((price) => price.isAuthor === true)
      : [];
  }, [pricesResponse]);

  const getNextAvailablePhase = (): NextPhaseInfo | null => {
    if (!researchConference?.researchPhase || !researchPhase?.researchConferencePhaseId) {
      return null;
    }

    const allPhases = researchConference.researchPhase;
    const currentPhaseIndex = allPhases.findIndex(
      (p) => p.researchConferencePhaseId === researchPhase.researchConferencePhaseId
    );

    if (currentPhaseIndex === -1) return null;

    const nextPhases = allPhases
      .slice(currentPhaseIndex + 1)
      .sort((a, b) => (a.phaseOrder || 0) - (b.phaseOrder || 0));

    const nextActivePhase = nextPhases.find((phase) => phase.isActive);

    if (!nextActivePhase) return null;

    const hasAvailableSlots = authorPrices.some((price) => {
      return price.pricePhases?.some((pricePhase) => {
        return (pricePhase.availableSlot ?? 0) > 0;
      });
    });

    return {
      phase: nextActivePhase,
      isAvailable: true,
      hasAvailableSlots,
    };
  };

  const nextPhaseInfo = getNextAvailablePhase();

  const getPurchasedTicketInfo = () => {
    if (!researchConference?.purchasedInfo?.conferencePriceId) return null;

    const purchasedTicket = researchConference.conferencePrices?.find(
      (price) => price.conferencePriceId === researchConference.purchasedInfo?.conferencePriceId
    );

    if (!purchasedTicket) return null;

    const purchasedPhase = purchasedTicket.pricePhases?.find(
      (phase) => phase.pricePhaseId === researchConference.purchasedInfo?.pricePhaseId
    );

    return { ticket: purchasedTicket, phase: purchasedPhase };
  };

  const purchasedTicketInfo = getPurchasedTicketInfo();

  const getPricePhaseInfo = (price: ConferencePriceResponse) => {
    if (!price.pricePhases || price.pricePhases.length === 0) {
      return { currentPhase: null, futurePhases: [], hasAvailableSlots: false };
    }

    if (nextPhaseInfo?.isAvailable && nextPhaseInfo?.hasAvailableSlots) {
      const currentPhase = price.pricePhases.find((phase) => {
        return (phase.availableSlot ?? 0) > 0;
      });

      const futurePhases = price.pricePhases
        .filter((phase) => (phase.availableSlot ?? 0) > 0)
        .sort((a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime());

      const hasAvailableSlots =
        (currentPhase?.availableSlot ?? 0) > 0 ||
        futurePhases.some((phase) => (phase.availableSlot ?? 0) > 0);

      return { currentPhase, futurePhases, hasAvailableSlots };
    }

    const currentPhase = price.pricePhases.find((phase) => {
      const start = new Date(phase.startDate || '');
      const end = new Date(phase.endDate || '');
      return now >= start && now <= end && (phase.availableSlot ?? 0) > 0;
    });

    const futurePhases = price.pricePhases
      .filter((phase) => new Date(phase.startDate || '') > now)
      .sort((a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime());

    const hasAvailableSlots =
      (currentPhase?.availableSlot ?? 0) > 0 ||
      futurePhases.some((phase) => (phase.availableSlot ?? 0) > 0);

    return { currentPhase, futurePhases, hasAvailableSlots };
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return '';
    const s = new Date(start).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const e = new Date(end).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${s} → ${e}`;
  };

  const showExpiredWarning =
    !phaseValidation.isAvailable &&
    phaseValidation.isExpired &&
    nextPhaseInfo?.isAvailable &&
    nextPhaseInfo?.hasAvailableSlots;

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-white mb-2">Giai đoạn Thanh toán</Text>
        <Text className="text-gray-400 text-sm">
          Xem thông tin thanh toán và các gói đăng ký hội nghị.
        </Text>
      </View>

      {/* Purchased Ticket Info */}
      {purchasedTicketInfo ? (
        <View
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: '#065F46', borderColor: '#059669', borderWidth: 1 }}
        >
          <View className="flex-row items-start mb-3">
            <Icon name="check-circle" size={24} color="#34D399" />
            <Text className="text-lg font-semibold text-green-100 ml-3">
              Bạn đã thanh toán thành công!
            </Text>
          </View>

          <View className="space-y-2">
            <View className="flex-row justify-between py-2">
              <Text className="text-green-200 text-sm">Gói đăng ký:</Text>
              <Text className="text-white text-sm font-semibold">
                {purchasedTicketInfo.ticket.ticketName}
              </Text>
            </View>

            {purchasedTicketInfo.phase && (
              <View className="flex-row justify-between py-2">
                <Text className="text-green-200 text-sm">Giai đoạn:</Text>
                <Text className="text-white text-sm font-semibold">
                  {purchasedTicketInfo.phase.phaseName}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between py-2">
              <Text className="text-green-200 text-sm">Số tiền đã thanh toán:</Text>
              <Text className="text-white text-lg font-bold">
                {formatCurrency(purchasedTicketInfo.ticket.ticketPrice || 0)}
              </Text>
            </View>
          </View>

          <View
            className="mt-4 p-3 rounded-lg"
            style={{ backgroundColor: '#047857', borderColor: '#059669', borderWidth: 1 }}
          >
            <Text className="text-green-100 text-xs text-center">
              Bạn có thể xem chi tiết giao dịch trong phần &quot;Lịch sử giao dịch&quot;
            </Text>
          </View>
        </View>
      ) : (
        <>
          {/* Phase Timing Information */}
          {phaseValidation.formattedPeriod && (
            <View
              className="mb-6 p-4 rounded-xl"
              style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
            >
              <Text className="text-gray-300 text-sm mb-3">
                <Text className="font-semibold">Thời gian thanh toán:</Text>{' '}
                {phaseValidation.formattedPeriod}
              </Text>

              {/* Time validation message */}
              {!phaseValidation.isAvailable && (
                <View
                  className="rounded-lg p-3"
                  style={{
                    backgroundColor: phaseValidation.isExpired ? '#7F1D1D' : '#78350F',
                    borderColor: phaseValidation.isExpired ? '#991B1B' : '#92400E',
                    borderWidth: 1,
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{ color: phaseValidation.isExpired ? '#FCA5A5' : '#FCD34D' }}
                  >
                    {phaseValidation.message}
                  </Text>
                </View>
              )}

              {/* Available deadline countdown */}
              {phaseValidation.isAvailable && phaseValidation.daysRemaining && (
                <View
                  className="rounded-lg p-3"
                  style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
                >
                  <Text className="text-blue-300 text-sm">{phaseValidation.message}</Text>
                </View>
              )}
            </View>
          )}

          {/* Expired Warning with Next Phase Available */}
          {showExpiredWarning && (
            <>
              <View
                className="mb-4 p-4 rounded-xl"
                style={{ backgroundColor: '#78350F', borderColor: '#92400E', borderWidth: 1 }}
              >
                <View className="flex-row items-start">
                  <Icon name="warning" size={20} color="#FCD34D" />
                  <View className="ml-3 flex-1">
                    <Text className="text-yellow-200 text-sm font-semibold mb-1">
                      Đã hết thời hạn thanh toán cho giai đoạn hiện tại
                    </Text>
                    <Text className="text-yellow-300 text-xs">{phaseValidation.message}</Text>
                  </View>
                </View>
              </View>

              <View
                className="mb-4 p-4 rounded-xl"
                style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
              >
                <View className="flex-row items-start">
                  <Icon name="info" size={20} color="#93C5FD" />
                  <View className="ml-3 flex-1">
                    <Text className="text-blue-200 text-sm font-semibold mb-1">
                      Có giai đoạn tiếp theo đang mở đăng ký
                    </Text>
                    <Text className="text-blue-300 text-xs">
                      Bạn có thể tiếp tục thanh toán cho giai đoạn tiếp theo
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* No Available Prices */}
          {authorPrices.length === 0 && (
            <View
              className="p-8 rounded-xl items-center"
              style={{ backgroundColor: '#1F2937', borderColor: '#374151', borderWidth: 1 }}
            >
              <Icon name="payment" size={64} color="#4B5563" />
              <Text className="text-gray-400 mt-4 text-center text-base">
                Chưa có gói thanh toán nào được mở bán
              </Text>
            </View>
          )}

          {/* Price Packages */}
          {authorPrices.length > 0 && (
            <View className="space-y-4">
              {authorPrices.map((price) => {
                const phaseInfo = getPricePhaseInfo(price);
                const isAvailable =
                  phaseInfo.currentPhase && (phaseInfo.currentPhase.availableSlot ?? 0) > 0;

                return (
                  <View
                    key={price.conferencePriceId}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: isAvailable ? '#1F2937' : '#111827',
                      borderColor: isAvailable ? '#374151' : '#1F2937',
                      borderWidth: 1,
                      opacity: isAvailable ? 1 : 0.6,
                    }}
                  >
                    {/* Package Name */}
                    <Text className="text-white text-lg font-bold mb-2">
                      {price.ticketName || 'Package'}
                    </Text>

                    {/* Package Description */}
                    {price.ticketDescription && (
                      <Text className="text-gray-400 text-sm mb-3">{price.ticketDescription}</Text>
                    )}

                    {/* Publish Status Badge */}
                    <View className="mb-3">
                      {price.isPublish ? (
                        <View
                          className="self-start px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#065F46' }}
                        >
                          <Text className="text-green-300 text-xs font-medium">
                            Bao gồm phí xuất bản bài báo
                          </Text>
                        </View>
                      ) : (
                        <View
                          className="self-start px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#374151' }}
                        >
                          <Text className="text-gray-400 text-xs font-medium">
                            Không bao gồm phí xuất bản bài báo
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Price Information */}
                    {phaseInfo.currentPhase && (
                      <>
                        <View className="flex-row items-center mb-2">
                          <Text className="text-purple-400 text-2xl font-bold">
                            {formatCurrency(
                              Math.round(
                                (price.ticketPrice ?? 0) *
                                ((phaseInfo.currentPhase?.applyPercent ?? 100) / 100)
                              )
                            )}
                          </Text>

                          {(() => {
                            const apply = phaseInfo.currentPhase?.applyPercent ?? 100;
                            const original = price.ticketPrice ?? 0;

                            if (apply === 100) return null;

                            const diff = apply < 100 ? 100 - apply : apply - 100;

                            return (
                              <>
                                <Text className="text-gray-500 text-sm line-through ml-2">
                                  {formatCurrency(original)}
                                </Text>

                                {apply < 100 && (
                                  <View
                                    className="ml-2 px-2 py-0.5 rounded"
                                    style={{ backgroundColor: '#065F46' }}
                                  >
                                    <Text className="text-green-300 text-xs font-semibold">
                                      -{diff}%
                                    </Text>
                                  </View>
                                )}

                                {apply > 100 && (
                                  <View
                                    className="ml-2 px-2 py-0.5 rounded"
                                    style={{ backgroundColor: '#9A3412' }}
                                  >
                                    <Text className="text-orange-300 text-xs font-semibold">
                                      +{diff}%
                                    </Text>
                                  </View>
                                )}
                              </>
                            );
                          })()}
                        </View>

                        {/* Phase Date Range */}
                        {!(nextPhaseInfo?.isAvailable && nextPhaseInfo?.hasAvailableSlots) && (
                          <Text className="text-gray-500 text-xs mb-2">
                            {formatDateRange(
                              phaseInfo.currentPhase.startDate,
                              phaseInfo.currentPhase.endDate
                            )}
                          </Text>
                        )}

                        {/* Available Slots */}
                        <Text className="text-gray-400 text-sm">
                          Còn lại:{' '}
                          <Text
                            style={{
                              color:
                                (phaseInfo.currentPhase.availableSlot ?? 0) < 10
                                  ? '#FCA5A5'
                                  : '#86EFAC',
                            }}
                            className="font-semibold"
                          >
                            {phaseInfo.currentPhase.availableSlot || 0}
                          </Text>
                          /{phaseInfo.currentPhase.totalSlot || 0} slot
                        </Text>
                      </>
                    )}

                    {/* Sold Out Badge */}
                    {!isAvailable && (
                      <View
                        className="mt-2 px-3 py-1 rounded self-start"
                        style={{ backgroundColor: '#7F1D1D' }}
                      >
                        <Text className="text-red-300 text-sm font-semibold">Đã bán hết</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Mobile Note - Payment on Web Only */}
          {phaseValidation.isAvailable && authorPrices.length > 0 && (
            <View
              className="mt-6 p-4 rounded-xl"
              style={{ backgroundColor: '#1E3A8A', borderColor: '#1E40AF', borderWidth: 1 }}
            >
              <View className="flex-row items-center">
                <Icon name="info" size={20} color="#93C5FD" />
                <Text className="text-blue-300 text-sm ml-3 flex-1">
                  Để thực hiện thanh toán, vui lòng sử dụng phiên bản web.
                </Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* Conference Info (Optional) */}
      {researchConferenceInfo && (
        <View
          className="mt-4 p-4 rounded-xl"
          style={{ backgroundColor: '#374151', borderColor: '#4B5563', borderWidth: 1 }}
        >
          <Text className="text-sm font-medium text-gray-400 mb-2">Hội nghị</Text>
          <Text className="text-white text-base font-semibold">
            {researchConferenceInfo.conferenceName}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const PaperDetailScreen: React.FC<PaperDetailScreenProps> = ({
  navigation,
  route
}) => {
  const { paperId } = route.params;
  const [activeStep, setActiveStep] = useState(0);

  const {
    paperDetail,
    // paperPhases,
    fetchPaperDetail,
    loading,
    paperDetailError,
  } = usePaperCustomer();

  const {
    researchConference,
    researchConferenceLoading,
    researchConferenceError,
    refetchResearchConference,
  } = useConference({ id: paperDetail?.researchConferenceInfo?.conferenceId ?? undefined });

  useEffect(() => {
    if (paperId) {
      fetchPaperDetail(paperId);
    }
  }, [paperId, fetchPaperDetail]);


  const steps = [
    { key: "abstractId", label: "Abstract" },
    { key: "fullPaperId", label: "FullPaper" },
    { key: "revisionPaperId", label: "Revise" },
    { key: "cameraReadyId", label: "CameraReady" },
    { key: "paymentId", label: "Payment" },
  ];

  // Calculate current step based on current phase
  const currentStepIndex = useMemo(() => {
    if (!paperDetail) return 0;

    let lastCompletedStep = 0;

    steps.forEach((step, index) => {
      const value = (paperDetail as any)[step.key];

      if (value) {
        lastCompletedStep = index;
      }
    });

    return lastCompletedStep;
  }, [paperDetail]);
  // const currentStepIndex = useMemo(() => {
  //   if (!paperDetail?.currentPhase?.paperPhaseId || !paperPhases.length) return 0;

  //   const currentPhaseIndex = paperPhases.findIndex(
  //     phase => phase.paperPhaseId === paperDetail.currentPhase.paperPhaseId
  //   );

  //   return currentPhaseIndex >= 0 ? currentPhaseIndex : 0;
  // }, [paperDetail?.currentPhase, paperPhases]);

  useEffect(() => {
    setActiveStep(currentStepIndex);
  }, [currentStepIndex]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-600">
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Chi tiết Paper" />
        </Appbar.Header>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Đang tải thông tin paper...</Text>
        </View>
      </View>
    );
  }

  if (paperDetailError || !paperDetail) {
    return (
      <View className="flex-1 bg-gray-600">
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Chi tiết Paper" />
        </Appbar.Header>
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="error-outline" size={80} color="#EF4444" />
          <Text className="text-gray-900 text-lg font-medium mt-4 text-center">
            Có lỗi xảy ra
          </Text>
          <Text className="text-gray-500 text-sm mt-2 mb-6 text-center">
            Không thể tải thông tin paper. Vui lòng thử lại.
          </Text>
          <TouchableOpacity
            onPress={() => fetchPaperDetail(paperId)}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <AbstractTab abstract={paperDetail.abstract} researchPhase={paperDetail.researchPhase} />;
      case 1:
        return <FullPaperTab fullPaper={paperDetail.fullPaper} researchPhase={paperDetail.researchPhase} />;
      case 2:
        return <RevisionTab paperId={paperDetail.paperId} revisionPaper={paperDetail.revisionPaper} researchPhase={paperDetail.researchPhase} revisionDeadline={paperDetail.revisionDeadline} />;
      case 3:
        return <CameraReadyTab cameraReady={paperDetail.cameraReady} researchPhase={paperDetail.researchPhase} />;
      case 4:
        return <PaymentTab paperId={paperDetail.paperId} conferenceId={paperDetail.researchConferenceInfo?.conferenceId} researchConference={researchConference} researchPhase={paperDetail.researchPhase} />;
      default:
        return <AbstractTab abstract={paperDetail.abstract} />;
    }
  };

  return (
    <View className="flex-1 bg-gray-600">
      <View className="bg-black">
        <Appbar.Header
          mode="center-aligned"
          style={{ backgroundColor: 'transparent', elevation: 0 }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
          <Appbar.Content
            title={`Paper #${paperId.slice(-6)}`}
            titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
          />
        </Appbar.Header>
      </View>

      {/* Paper Basic Info */}
      <View className="mx-4 mt-4">
        <View
          style={{
            backgroundColor: '#1F2937',
            borderColor: '#374151',
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
          }}
        >
          {/* Paper Title */}
          <Text className="text-white font-bold text-lg mb-2">
            {paperDetail.title || `Paper #${paperId.slice(-6)}`}
          </Text>

          {/* Paper Description */}
          {paperDetail.description && (
            <Text className="text-gray-300 text-sm mb-4" numberOfLines={3}>
              {paperDetail.description}
            </Text>
          )}

          {/* Paper Info Row */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Created At</Text>
              <Text className="text-white text-sm">
                {paperDetail.created
                  ? new Date(paperDetail.created).toLocaleDateString('vi-VN')
                  : 'N/A'
                }
              </Text>
            </View>

            {/* {paperDetail.reviewedAt && (
              <View className="flex-1 ml-4">
                <Text className="text-gray-500 text-xs mb-1">Reviewed At</Text>
                <Text className="text-white text-sm">
                  {new Date(paperDetail.reviewedAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )} */}
          </View>

          {/* Current Phase */}
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Current Phase</Text>
              <Text className="text-green-400 text-sm font-medium">
                {paperDetail.currentPhase?.phaseName || 'Unknown Phase'}
              </Text>
            </View>

            {/* Conference ID */}
            {/* <View className="flex-1 ml-4">
              <Text className="text-gray-500 text-xs mb-1">Conference ID</Text>
              <Text className="text-white text-sm">
                {paperDetail.conferenceId || 'N/A'}
              </Text>
            </View> */}
          </View>
        </View>
      </View>

      {/* Notice Banner */}
      <View className="bg-gray-800 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg">
        <View className="flex-row items-start">
          <Icon name="info" size={20} color="#10B981" />
          <View className="ml-3 flex-1">
            <Text className="text-green-400 font-medium text-sm">
              Thông báo
            </Text>
            <Text className="text-gray-300 text-sm mt-1">
              Bạn chỉ có thể theo dõi trạng thái paper tại đây. Để thao tác cập nhật, tạo hoặc nộp paper, vui lòng lên web.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} style={{ backgroundColor: 'transparent' }}>
        {/* Progress Steps */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-white mb-4">
            Tiến trình Paper
          </Text>

          <StepIndicator
            stepCount={steps.length}
            currentPosition={activeStep}
            labels={steps.map((p) => p.label || 'Unnamed Phase')}
            onPress={(index) => setActiveStep(index)}
            customStyles={{
              stepIndicatorSize: 30,
              currentStepIndicatorSize: 35,
              separatorStrokeWidth: 2,
              currentStepStrokeWidth: 3,
              stepStrokeCurrentColor: '#3B82F6',
              stepStrokeFinishedColor: '#10B981',
              stepStrokeUnFinishedColor: '#E5E7EB',
              separatorFinishedColor: '#10B981',
              separatorUnFinishedColor: '#E5E7EB',
              stepIndicatorFinishedColor: '#10B981',
              stepIndicatorUnFinishedColor: '#E5E7EB',
              stepIndicatorCurrentColor: '#3B82F6',
              stepIndicatorLabelFontSize: 14,
              currentStepIndicatorLabelFontSize: 16,
              stepIndicatorLabelCurrentColor: '#fff',
              stepIndicatorLabelFinishedColor: '#fff',
              stepIndicatorLabelUnFinishedColor: '#9CA3AF',
              labelColor: '#6B7280',
              labelSize: 12,
              currentStepLabelColor: '#3B82F6',
            }}
            renderStepIndicator={(params) => (
              <StepDot
                position={params.position}
                stepStatus={params.stepStatus as StepStatus}
                activeStep={activeStep}
              />
            )}
          // renderStepIndicator={(params) => {
          //   const scale = useSharedValue(params.position === activeStep ? 1.2 : 1);

          //   useEffect(() => {
          //     scale.value = withSpring(params.position === activeStep ? 1.2 : 1);
          //   }, [params.position, activeStep]);

          //   const animatedStyle = useAnimatedStyle(() => ({
          //     transform: [{ scale: scale.value }],
          //   }));

          //   return (
          //     <Animated.View
          //       style={[
          //         {
          //           width: 30,
          //           height: 30,
          //           borderRadius: 15,
          //           backgroundColor:
          //             params.stepStatus === 'current'
          //               ? '#3B82F6'
          //               : params.stepStatus === 'finished'
          //                 ? '#10B981'
          //                 : '#E5E7EB',
          //           justifyContent: 'center',
          //           alignItems: 'center',
          //         },
          //         animatedStyle
          //       ]}
          //     >
          //       <Text
          //         style={{
          //           color:
          //             params.stepStatus === 'current' || params.stepStatus === 'finished'
          //               ? '#fff'
          //               : '#9CA3AF',
          //           fontWeight: 'bold',
          //           fontSize: 12,
          //         }}
          //       >
          //         {params.position + 1}
          //       </Text>
          //     </Animated.View>
          //   );
          // }}
          />
        </View>

        <Divider />

        {/* Current Phase Content */}
        <View className="pb-8">
          {renderStepContent(activeStep)}
        </View>
      </ScrollView>
    </View>
  );
};

export type StepStatus = "current" | "finished" | "unfinished";

const StepDot = ({
  position,
  stepStatus,
  activeStep,
}: {
  position: number;
  stepStatus: 'current' | 'finished' | 'unfinished';
  activeStep: number;
}) => {
  const scale = useSharedValue(position === activeStep ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(position === activeStep ? 1.2 : 1);
  }, [position, activeStep]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor:
            stepStatus === 'current'
              ? '#3B82F6'
              : stepStatus === 'finished'
                ? '#10B981'
                : '#E5E7EB',
          justifyContent: 'center',
          alignItems: 'center',
        },
        animatedStyle,
      ]}
    >
      <Text
        style={{
          color:
            stepStatus === 'current' || stepStatus === 'finished'
              ? '#fff'
              : '#9CA3AF',
          fontWeight: 'bold',
          fontSize: 12,
        }}
      >
        {position + 1}
      </Text>
    </Animated.View>
  );
};


export default PaperDetailScreen;