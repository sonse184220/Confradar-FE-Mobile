import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {
  Appbar,
  Card,
  Chip,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePaperCustomer } from '../hooks/usePaperCustomer';
import { PaperDetailResponse, PaperPhase } from '../types/paper.type';
import StepIndicator from 'react-native-step-indicator';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

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
  type: 'global' | 'review' | 'overall';
}> = ({ status, type }) => {
  const getStatusColor = (status?: string | null) => {
    if (!status) return '#9CA3AF';

    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('approve') || lowerStatus.includes('accept')) {
      return '#10B981';
    }
    if (lowerStatus.includes('reject') || lowerStatus.includes('decline')) {
      return '#EF4444';
    }
    if (lowerStatus.includes('pending') || lowerStatus.includes('review')) {
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

// Abstract Tab Component
const AbstractTab: React.FC<{ abstract?: any }> = ({ abstract }) => (
  <View className="p-4">
    <Text className="text-lg font-semibold text-gray-900 mb-4">
      Abstract
    </Text>

    {abstract ? (
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </Text>
          <StatusChip status={abstract.globalStatusId} type="global" />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            File Abstract
          </Text>
          <FileLink
            fileUrl={abstract.fileUrl}
            fileName="Abstract.pdf"
          />
        </View>
      </View>
    ) : (
      <View className="items-center py-8">
        <Icon name="description" size={48} color="#E5E7EB" />
        <Text className="text-gray-500 mt-2">
          Abstract chưa được nộp
        </Text>
      </View>
    )}
  </View>
);

// Full Paper Tab Component
const FullPaperTab: React.FC<{ fullPaper?: any }> = ({ fullPaper }) => (
  <View className="p-4">
    <Text className="text-lg font-semibold text-gray-900 mb-4">
      Full Paper
    </Text>

    {fullPaper ? (
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái Review
          </Text>
          <StatusChip status={fullPaper.reviewStatusId} type="review" />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            File Full Paper
          </Text>
          <FileLink
            fileUrl={fullPaper.fileUrl}
            fileName="FullPaper.pdf"
          />
        </View>
      </View>
    ) : (
      <View className="items-center py-8">
        <Icon name="article" size={48} color="#E5E7EB" />
        <Text className="text-gray-500 mt-2">
          Full Paper chưa được nộp
        </Text>
      </View>
    )}
  </View>
);

// Revision Paper Tab Component
const RevisionPaperTab: React.FC<{ revisionPaper?: any }> = ({ revisionPaper }) => (
  <View className="p-4">
    <Text className="text-lg font-semibold text-gray-900 mb-4">
      Paper Revision
    </Text>

    {revisionPaper ? (
      <View className="space-y-4">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Vòng Revision
            </Text>
            <Text className="text-2xl font-bold text-blue-600">
              {revisionPaper.revisionRound || 0}
            </Text>
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Trạng thái Tổng
            </Text>
            <StatusChip status={revisionPaper.overallStatus} type="overall" />
          </View>
        </View>

        {revisionPaper.submissions && revisionPaper.submissions.length > 0 && (
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Submissions
            </Text>
            {revisionPaper.submissions.map((submission: any, index: number) => (
              <Card key={submission.submissionId} style={{ marginBottom: 12 }}>
                <Card.Content>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium">
                      Submission {index + 1}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Deadline: Round {submission.revisionDeadline?.roundNumher || 'N/A'}
                    </Text>
                  </View>

                  <FileLink
                    fileUrl={submission.fileUrl}
                    fileName={`Revision_${index + 1}.pdf`}
                  />

                  {submission.feedbacks && submission.feedbacks.length > 0 && (
                    <View className="mt-3">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Feedbacks ({submission.feedbacks.length})
                      </Text>
                      {submission.feedbacks.map((feedback: any) => (
                        <View key={feedback.feedbackId} className="bg-gray-50 p-3 rounded-lg mb-2">
                          <Text className="text-sm text-gray-700 mb-1">
                            {feedback.feedBack}
                          </Text>
                          {feedback.response && (
                            <View className="mt-2 pt-2 border-t border-gray-200">
                              <Text className="text-xs text-gray-500 mb-1">
                                Phản hồi:
                              </Text>
                              <Text className="text-sm text-blue-600">
                                {feedback.response}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </View>
    ) : (
      <View className="items-center py-8">
        <Icon name="rate-review" size={48} color="#E5E7EB" />
        <Text className="text-gray-500 mt-2">
          Paper Revision chưa có
        </Text>
      </View>
    )}
  </View>
);

// Camera Ready Tab Component
const CameraReadyTab: React.FC<{ cameraReady?: any }> = ({ cameraReady }) => (
  <View className="p-4">
    <Text className="text-lg font-semibold text-gray-900 mb-4">
      Camera Ready
    </Text>

    {cameraReady ? (
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </Text>
          <StatusChip status={cameraReady.globalStatusId} type="global" />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            File Camera Ready
          </Text>
          <FileLink
            fileUrl={cameraReady.fileUrl}
            fileName="CameraReady.pdf"
          />
        </View>
      </View>
    ) : (
      <View className="items-center py-8">
        <Icon name="camera" size={48} color="#E5E7EB" />
        <Text className="text-gray-500 mt-2">
          Camera Ready chưa được nộp
        </Text>
      </View>
    )}
  </View>
);

const PaperDetailScreen: React.FC<PaperDetailScreenProps> = ({
  navigation,
  route
}) => {
  const { paperId } = route.params;
  const [activeStep, setActiveStep] = useState(0);

  const {
    paperDetail,
    paperPhases,
    fetchPaperDetail,
    loading,
    paperDetailError,
  } = usePaperCustomer();

  useEffect(() => {
    if (paperId) {
      fetchPaperDetail(paperId);
    }
  }, [paperId, fetchPaperDetail]);

  // Calculate current step based on current phase
  const currentStepIndex = useMemo(() => {
    if (!paperDetail?.currentPhase?.paperPhaseId || !paperPhases.length) return 0;

    const currentPhaseIndex = paperPhases.findIndex(
      phase => phase.paperPhaseId === paperDetail.currentPhase.paperPhaseId
    );

    return currentPhaseIndex >= 0 ? currentPhaseIndex : 0;
  }, [paperDetail?.currentPhase, paperPhases]);

  useEffect(() => {
    setActiveStep(currentStepIndex);
  }, [currentStepIndex]);

  if (loading) {
    return (
      <View className="flex-1 bg-white">
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
      <View className="flex-1 bg-white">
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
        return <AbstractTab abstract={paperDetail.abstract} />;
      case 1:
        return <FullPaperTab fullPaper={paperDetail.fullPaper} />;
      case 2:
        return <RevisionPaperTab revisionPaper={paperDetail.revisionPaper} />;
      case 3:
        return <CameraReadyTab cameraReady={paperDetail.cameraReady} />;
      default:
        return <AbstractTab abstract={paperDetail.abstract} />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Paper #${paperId.slice(-6)}`} />
      </Appbar.Header>

      {/* Notice Banner */}
      <View className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-r-lg">
        <View className="flex-row items-start">
          <Icon name="info" size={20} color="#3B82F6" />
          <View className="ml-3 flex-1">
            <Text className="text-blue-800 font-medium text-sm">
              Thông báo
            </Text>
            <Text className="text-blue-700 text-sm mt-1">
              Bạn chỉ có thể theo dõi trạng thái paper tại đây. Để thao tác cập nhật, tạo hoặc nộp paper, vui lòng lên web.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Progress Steps */}
        <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Tiến trình Paper
          </Text>

          <StepIndicator
            stepCount={paperPhases.length}
            currentPosition={activeStep}
            labels={paperPhases.map((p) => p.phaseName || 'Unnamed Phase')}
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
            renderStepIndicator={(params) => {
              const scale = useSharedValue(params.position === activeStep ? 1.2 : 1);

              useEffect(() => {
                scale.value = withSpring(params.position === activeStep ? 1.2 : 1);
              }, [params.position, activeStep]);

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
                        params.stepStatus === 'current'
                          ? '#3B82F6'
                          : params.stepStatus === 'finished'
                            ? '#10B981'
                            : '#E5E7EB',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    animatedStyle
                  ]}
                >
                  <Text
                    style={{
                      color:
                        params.stepStatus === 'current' || params.stepStatus === 'finished'
                          ? '#fff'
                          : '#9CA3AF',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                  >
                    {params.position + 1}
                  </Text>
                </Animated.View>
              );
            }}
          // renderStepIndicator={(params) => (
          //   // <MotiView
          //   //   from={{ scale: 0.8 }}
          //   //   animate={{ scale: params.position === activeStep ? 1.2 : 1 }}
          //   //   transition={{ type: 'timing', duration: 300 }}
          //   //   style={{
          //   //     width: 30,
          //   //     height: 30,
          //   //     borderRadius: 30 / 2,
          //   //     backgroundColor:
          //   //       params.stepStatus === 'current'
          //   //         ? '#3B82F6'
          //   //         : params.stepStatus === 'finished'
          //   //           ? '#10B981'
          //   //           : '#E5E7EB',
          //   //     justifyContent: 'center',
          //   //     alignItems: 'center',
          //   //   }}
          //   // >
          //   <Text
          //     style={{
          //       color:
          //         params.stepStatus === 'current' || params.stepStatus === 'finished'
          //           ? '#fff'
          //           : '#9CA3AF',
          //       fontWeight: 'bold',
          //       fontSize: 12,
          //     }}
          //   >
          //     {params.position + 1}
          //   </Text>
          //   //</MotiView>
          // )}
          />
        </View>
        {/* <View className="px-4 py-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Tiến trình Paper
          </Text>

          <ProgressSteps
            {...progressStepsStyle}
            activeStep={activeStep}
            isComplete={false}
          >
            {paperPhases.map((phase, index) => (
              <ProgressStep
                key={phase.paperPhaseId}
                label={phase.phaseName || `Phase ${index + 1}`}
                onNext={() => { }}
                onPrevious={() => { }}
                removeBtnRow={true}
              // nextBtnDisabled={true}
              // previousBtnDisabled={true}
              // nextBtnStyle={{ display: 'none' }}
              // previousBtnStyle={{ display: 'none' }}
              >
                <View />
              </ProgressStep>
            ))}
          </ProgressSteps>
        </View> */}

        <Divider />

        {/* Current Phase Content */}
        <View className="pb-8">
          {renderStepContent(activeStep)}
        </View>
      </ScrollView>
    </View>
  );
};

export default PaperDetailScreen;