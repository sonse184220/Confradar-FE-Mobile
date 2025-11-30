import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-big-calendar';
import CalendarKit, { CalendarBody, CalendarContainer, CalendarHeader, OnEventResponse, PackedEvent, useMethods } from '@howljs/calendar-kit';
import useCalendarController from '@howljs/calendar-kit';
import { useConference } from '../hooks/useConference';
import {
  ConferenceDetailForScheduleResponse,
  SessionDetailForScheduleResponse,
  PresenterAuthor,
  PaperAuthor,
} from '../types/conference.type';
import DatePicker from 'react-native-date-picker';
import { useTicket } from '@/hooks/useTicket';
import { usePresenter } from '@/hooks/useAssigningPresenterSession';
import { useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/store';
import { User } from '@/types/auth';

const { width, height } = Dimensions.get('window');

// Conference Card Component
interface ConferenceCardProps {
  conference: ConferenceDetailForScheduleResponse;
  selectedConference?: string | null;
  onConferenceClick: (conference: ConferenceDetailForScheduleResponse) => void;
  onSessionNavigate?: (session: SessionDetailForScheduleResponse) => void;
}

const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  selectedConference,
  onConferenceClick,
  onSessionNavigate,
}) => {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDetailForScheduleResponse | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const handleViewSessions = (e: any) => {
    e.stopPropagation();
    setSessionModalOpen(true);
  };

  const handleSessionSelect = (session: SessionDetailForScheduleResponse) => {
    setSelectedSession(session);
    if (onSessionNavigate) {
      onSessionNavigate(session);
    }
  };

  const handleBackToList = () => {
    setSelectedSession(null);
  };

  const handleCloseAll = () => {
    setSessionModalOpen(false);
    setSelectedSession(null);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => onConferenceClick(conference)}
        className={`bg-gray-800 rounded-lg p-3 mb-2 ${selectedConference === conference.conferenceId
          ? 'border-2 border-blue-500'
          : 'border border-gray-600'
          }`}
      >
        {conference.bannerImageUrl && (
          <Image
            source={{ uri: conference.bannerImageUrl }}
            className="w-full h-20 rounded-md mb-2"
            resizeMode="cover"
          />
        )}

        <Text className="font-semibold text-white text-sm mb-1" numberOfLines={1}>
          {conference.conferenceName || 'Untitled Conference'}
        </Text>

        <View className="space-y-1">
          <Text className="text-xs text-gray-300">
            📅 {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
          </Text>

          {conference.cityName && (
            <Text className="text-xs text-gray-300" numberOfLines={1}>
              🏙️ {conference.cityName}
            </Text>
          )}

          <View className="flex-row items-center justify-between mt-2">
            {conference.conferenceCategoryName && (
              <Text className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
                {conference.conferenceCategoryName}
              </Text>
            )}
            {conference.sessions.length > 0 && (
              <TouchableOpacity
                onPress={handleViewSessions}
                className="px-2 py-1 bg-blue-600 rounded"
              >
                <Text className="text-white text-xs">
                  {conference.sessions.length} phiên
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Combined Session Modal */}
      <SessionModal
        open={sessionModalOpen}
        conference={conference}
        selectedSession={selectedSession}
        onClose={handleCloseAll}
        onSessionSelect={handleSessionSelect}
        onBack={handleBackToList}
      />
    </>
  );
};

interface SessionModalProps {
  open: boolean;
  conference: ConferenceDetailForScheduleResponse;
  selectedSession: SessionDetailForScheduleResponse | null;
  onClose: () => void;
  onSessionSelect: (session: SessionDetailForScheduleResponse) => void;
  onBack: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  open,
  conference,
  selectedSession,
  onClose,
  onSessionSelect,
  onBack,
}) => {
  const [sessionReason, setSessionReason] = useState('');
  const [presenterReason, setPresenterReason] = useState('');
  const [selectedNewPresenter, setSelectedNewPresenter] = useState('');
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);
  const [isSubmittingPresenter, setIsSubmittingPresenter] = useState(false);
  const [showPresenterModal, setShowPresenterModal] = useState(false);
  const [validTicket, setValidTicket] = useState<string | null>(null);

  const { fetchTicketsByConference } = useTicket();
  const { changeSession, changePresenter } = usePresenter();

  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const loadTickets = async () => {
      if (open && conference?.conferenceId) {
        try {
          const response = await fetchTicketsByConference(conference.conferenceId);
          const validTicketItem = response?.data?.items?.find(
            (ticket) => ticket.isRefunded === false
          );
          setValidTicket(validTicketItem?.ticketId || null);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
    };
    loadTickets();
  }, [open, conference?.conferenceId]);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const groupSessionsByDate = (sessions: SessionDetailForScheduleResponse[]) => {
    const grouped = sessions.reduce((acc, session) => {
      if (session.startTime) {
        const date = dayjs(session.startTime).format('DD/MM/YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(session);
      }
      return acc;
    }, {} as Record<string, SessionDetailForScheduleResponse[]>);
    return grouped;
  };

  const handleRequestChangeSession = async () => {
    if (!validTicket) {
      Alert.alert('Lỗi', 'Bạn chưa mua vé cho hội nghị này');
      return;
    }
    if (!sessionReason.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lý do yêu cầu đổi lịch');
      return;
    }

    const paperId = getPresenterPaperId();
    if (!paperId) {
      Alert.alert('Lỗi', 'Không tìm thấy bài báo mà bạn là diễn giả');
      return;
    }

    try {
      setIsSubmittingSession(true);
      const response = await changeSession({
        newSessionId: selectedSession?.conferenceSessionId || '',
        ticketId: validTicket,
        paperId: paperId, // Get from session
        reason: sessionReason.trim(),
      });

      if (response.success) {
        Alert.alert('Thành công', 'Gửi yêu cầu đổi lịch thành công');
        setSessionReason('');
        onClose();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu');
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const getPresenterPaperId = (): string | null => {
    if (!user || !conference.sessions) return null;

    for (const sess of conference.sessions) {
      const presenterPaper = sess.presenterAuthor?.find((paper) =>
        paper.paperAuthor?.some((author) =>
          author.userId === user.id && author.isPresenter
        )
      );

      if (presenterPaper) {
        return presenterPaper.paperId;
      }
    }

    return null;
  };

  const checkUserRole = (session: SessionDetailForScheduleResponse, user: User | null) => {
    if (!session || !user) return { isRootAuthor: false, isPresenter: false };

    let isRootAuthor = false;
    let isPresenter = false;

    session.presenterAuthor?.forEach(paper => {
      paper.paperAuthor?.forEach(author => {
        if (author.userId === user.id) {
          if (author.isRootAuthor) isRootAuthor = true;
          if (author.isPresenter) isPresenter = true;
        }
      });
    });

    return { isRootAuthor, isPresenter };
  };

  const renderSessionItem = ({ item }: { item: SessionDetailForScheduleResponse }) => {
    const userRole = checkUserRole(item, user); // Replace with actual user

    return (
      <TouchableOpacity
        onPress={() => onSessionSelect(item)}
        className="bg-gray-700 p-3 mb-2 rounded-lg border border-gray-600"
      >
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-white font-semibold text-sm flex-1" numberOfLines={2}>
            {item.title || 'Untitled Session'}
          </Text>
          <View className="flex-row gap-1 ml-2">
            {userRole.isRootAuthor && (
              <View className="px-1.5 py-0.5 bg-amber-600 rounded">
                <Text className="text-white text-[10px]">👑</Text>
              </View>
            )}
            {userRole.isPresenter && (
              <View className="px-1.5 py-0.5 bg-emerald-600 rounded">
                <Text className="text-white text-[10px]">🎤</Text>
              </View>
            )}
          </View>
        </View>

        {item.description && (
          <Text className="text-gray-400 text-xs mb-2" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View className="space-y-1">
          <Text className="text-gray-300 text-xs">
            🕒 {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
          </Text>

          {item.sessionDate && (
            <Text className="text-gray-300 text-xs">
              📅 {formatDateTime(item.sessionDate)}
            </Text>
          )}

          {item.roomDisplayName && (
            <Text className="text-gray-300 text-xs">
              📍 {item.roomDisplayName} {item.roomNumber && `(${item.roomNumber})`}
            </Text>
          )}

          {item.destinationName && (
            <Text className="text-gray-300 text-xs">
              🏢 {item.destinationName}
            </Text>
          )}

          {item.cityName && (
            <Text className="text-gray-300 text-xs">
              🏙️ {item.cityName}
            </Text>
          )}

          {item.presenterAuthor && item.presenterAuthor.length > 0 && (
            <Text className="text-blue-400 text-xs mt-1">
              📄 {item.presenterAuthor.length} bài báo
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPaperItem = ({ item }: { item: PresenterAuthor }) => (
    <View className="bg-gray-700 p-4 mb-3 rounded-lg border border-gray-600">
      <View className="mb-2">
        <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
          TIÊU ĐỀ BÀI BÁO
        </Text>
        <Text className="text-blue-300 font-semibold text-sm" numberOfLines={2}>
          {item.paperTitle || 'Untitled Paper'}
        </Text>
      </View>

      {item.paperDescription && (
        <View className="mb-2">
          <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            MÔ TẢ BÀI BÁO
          </Text>
          <Text className="text-gray-300 text-xs leading-5" numberOfLines={4}>
            {item.paperDescription}
          </Text>
        </View>
      )}

      {item.paperPhaseName && (
        <View className="mb-3">
          <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            TRẠNG THÁI HIỆN TẠI
          </Text>
          <Text className="text-orange-400 text-xs font-medium">
            {item.paperPhaseName}
          </Text>
        </View>
      )}

      {item.paperAuthor && item.paperAuthor.length > 0 && (
        <View className="mt-2">
          <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
            TÁC GIẢ
          </Text>
          {item.paperAuthor.map((author: PaperAuthor, index: number) => (
            <View
              key={`${author.userId}-${index}`}
              className="flex-row items-center justify-between bg-gray-800/60 px-3 py-2 rounded-lg mb-1"
            >
              <View className="flex-row items-center flex-1">
                {author.avatarUrl ? (
                  <Image
                    source={{ uri: author.avatarUrl }}
                    className="w-7 h-7 rounded-full mr-2"
                  />
                ) : (
                  <View className="w-7 h-7 rounded-full bg-gray-600 mr-2" />
                )}
                <Text className="text-gray-200 text-xs flex-1" numberOfLines={1}>
                  {author.fullName || 'Unknown'}
                </Text>
              </View>

              <View className="flex-row gap-1">
                {author.isRootAuthor && (
                  <View className="px-2 py-0.5 bg-amber-600 rounded">
                    <Text className="text-white text-[10px] font-medium">
                      Tác giả chính
                    </Text>
                  </View>
                )}
                {!author.isRootAuthor && (
                  <View className="px-2 py-0.5 bg-gray-500 rounded">
                    <Text className="text-white text-[10px] font-medium">
                      Đồng tác giả
                    </Text>
                  </View>
                )}
                {author.isPresenter && (
                  <View className="px-2 py-0.5 bg-emerald-600 rounded">
                    <Text className="text-white text-[10px] font-medium">
                      Diễn giả
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  if (!selectedSession) {
    // List View
    return (
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={onClose}
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-gray-900">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
            <Text className="text-white text-lg font-semibold flex-1" numberOfLines={1}>
              {conference.conferenceName}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 ml-2">
              <Text className="text-blue-400 text-base">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {Object.entries(groupSessionsByDate(conference.sessions)).map(([date, sessions]) => (
              <View key={date} className="mb-4">
                <Text className="text-blue-400 font-semibold mb-2">📅 {date}</Text>
                {sessions.map((session) => (
                  <View key={session.conferenceSessionId}>
                    {renderSessionItem({ item: session })}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View >
      </Modal>
    );
  }

  // Detail View
  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-900">
        {/* <View className="flex-row justify-between items-center p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700"> */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-700">

          <TouchableOpacity onPress={onBack} className="p-2">
            <Text className="text-white text-base font-semibold">← Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-white text-base font-semibold">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="mb-3">
            <Text className="text-white text-xl font-bold mb-2">
              {selectedSession.title || 'Untitled Session'}
            </Text>

            {/* User Role Badges */}
            <View className="flex-row gap-2 mb-3">
              {checkUserRole(selectedSession, user).isRootAuthor && (
                <View className="flex-row items-center gap-1 px-2 py-1 bg-amber-500 rounded">
                  <Text className="text-white text-xs">👑</Text>
                  <Text className="text-white text-xs font-semibold">
                    Bạn là Tác giả gốc
                  </Text>
                </View>
              )}
              {checkUserRole(selectedSession, user).isPresenter && (
                <View className="flex-row items-center gap-1 px-2 py-1 bg-emerald-500 rounded">
                  <Text className="text-white text-xs">🎤</Text>
                  <Text className="text-white text-xs font-semibold">
                    Bạn là Diễn giả
                  </Text>
                </View>
              )}
            </View>
          </View>

          {selectedSession.description && (
            <View className="mb-4">
              <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                MÔ TẢ
              </Text>
              <Text className="text-gray-300 text-sm leading-6">
                {selectedSession.description}
              </Text>
            </View>
          )}

          <View className="bg-gray-800 p-4 rounded-lg mb-4">
            <Text className="text-white font-semibold mb-3">Thông tin phiên họp</Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Text className="text-gray-400 text-xs w-24">Thời gian:</Text>
                <Text className="text-gray-300 text-xs flex-1">
                  🕒 {formatDateTime(selectedSession.startTime)}{'\n'}
                  đến {formatDateTime(selectedSession.endTime)}
                </Text>
              </View>

              {selectedSession.sessionDate && (
                <View className="flex-row items-start">
                  <Text className="text-gray-400 text-xs w-24">Ngày:</Text>
                  <Text className="text-gray-300 text-xs flex-1">
                    📅 {formatDateTime(selectedSession.sessionDate)}
                  </Text>
                </View>
              )}

              {selectedSession.roomDisplayName && (
                <View className="flex-row items-start">
                  <Text className="text-gray-400 text-xs w-24">Phòng:</Text>
                  <Text className="text-gray-300 text-xs flex-1">
                    📍 {selectedSession.roomDisplayName} {selectedSession.roomNumber && `(${selectedSession.roomNumber})`}
                  </Text>
                </View>
              )}

              {selectedSession.destinationName && (
                <View className="flex-row items-start">
                  <Text className="text-gray-400 text-xs w-24">Địa điểm:</Text>
                  <View className="flex-1">
                    <Text className="text-gray-300 text-xs">
                      🏢 {selectedSession.destinationName}
                    </Text>
                    {selectedSession.destinationStreet && (
                      <Text className="text-gray-300 text-xs mt-1">
                        📍 {selectedSession.destinationStreet}
                      </Text>
                    )}
                    {selectedSession.destinationDistrict && (
                      <Text className="text-gray-300 text-xs">
                        🏘️ {selectedSession.destinationDistrict}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {selectedSession.cityName && (
                <View className="flex-row items-start">
                  <Text className="text-gray-400 text-xs w-24">Thành phố:</Text>
                  <Text className="text-gray-300 text-xs flex-1">
                    🏙️ {selectedSession.cityName}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {selectedSession.presenterAuthor && selectedSession.presenterAuthor.length > 0 && (
            <View className="mb-4">
              <Text className="text-white font-semibold text-base mb-3">
                Bài báo sẽ trình bày ({selectedSession.presenterAuthor.length})
              </Text>
              <FlatList
                data={selectedSession.presenterAuthor}
                renderItem={renderPaperItem}
                keyExtractor={(item, index) => `${item.paperId}-${index}`}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Change Session Request */}
          <View className="mt-4 mb-4">
            <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
              YÊU CẦU ĐỔI LỊCH TRÌNH BÀY
            </Text>
            <TextInput
              value={sessionReason}
              onChangeText={setSessionReason}
              placeholder="Nhập lý do yêu cầu đổi lịch..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={3}
              className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 text-sm"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Change Presenter Request */}
          {showPresenterModal && (
            <View className="border border-purple-600 rounded-lg p-4 bg-purple-900/20 mb-4">
              <Text className="text-purple-300 font-semibold text-sm mb-3">
                Yêu cầu đổi diễn giả
              </Text>

              <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                CHỌN DIỄN GIẢ MỚI
              </Text>

              {/* Author selection list */}
              <View className="space-y-2 mb-3">
                {/* Add author selection UI here based on getAvailableAuthorsForPresenterChange */}
              </View>

              <Text className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">
                LÝ DO YÊU CẦU ĐỔI DIỄN GIẢ
              </Text>
              <TextInput
                value={presenterReason}
                onChangeText={setPresenterReason}
                placeholder="Nhập lý do yêu cầu đổi diễn giả..."
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={3}
                className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600 text-sm"
                style={{ textAlignVertical: 'top' }}
              />

              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity
                  onPress={() => {/* handleRequestChangePresenter */ }}
                  disabled={isSubmittingPresenter || !presenterReason.trim()}
                  className={`flex-1 py-3 rounded-lg ${isSubmittingPresenter || !presenterReason.trim()
                    ? 'bg-purple-800'
                    : 'bg-purple-600'
                    }`}
                >
                  <Text className="text-white text-center font-semibold text-xs">
                    {isSubmittingPresenter ? 'Đang gửi...' : 'Xác nhận đổi diễn giả'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowPresenterModal(false);
                    setSelectedNewPresenter('');
                    setPresenterReason('');
                  }}
                  disabled={isSubmittingPresenter}
                  className="flex-1 bg-gray-700 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold text-xs">Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-between items-center gap-2 mb-6">
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleRequestChangeSession}
                disabled={isSubmittingSession || !sessionReason.trim()}
                className={`px-4 py-3 rounded-lg flex-row items-center gap-2 ${isSubmittingSession || !sessionReason.trim()
                  ? 'bg-amber-800'
                  : 'bg-amber-600'
                  }`}
              >
                <Text className="text-white text-xs">🕒</Text>
                <Text className="text-white text-xs font-semibold">
                  {isSubmittingSession ? 'Đang gửi...' : 'Đổi lịch'}
                </Text>
              </TouchableOpacity>

              {!showPresenterModal && (
                <TouchableOpacity
                  onPress={() => setShowPresenterModal(true)}
                  disabled={isSubmittingPresenter}
                  className={`px-4 py-3 rounded-lg flex-row items-center gap-2 ${isSubmittingPresenter ? 'bg-purple-800' : 'bg-purple-600'
                    }`}
                >
                  <Text className="text-white text-xs">👥</Text>
                  <Text className="text-white text-xs font-semibold">Đổi diễn giả</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View >
    </Modal>
  );
};


// interface SessionModalProps {
//   open: boolean;
//   conference: ConferenceDetailForScheduleResponse;
//   selectedSession: SessionDetailForScheduleResponse | null;
//   onClose: () => void;
//   onSessionSelect: (session: SessionDetailForScheduleResponse) => void;
//   onBack: () => void;
// }

// const SessionModal: React.FC<SessionModalProps> = ({
//   open,
//   conference,
//   selectedSession,
//   onClose,
//   onSessionSelect,
//   onBack,
// }) => {
//   const [sessionReason, setSessionReason] = useState('');
//   const [presenterReason, setPresenterReason] = useState('');
//   const [selectedNewPresenter, setSelectedNewPresenter] = useState('');
//   const [isSubmittingSession, setIsSubmittingSession] = useState(false);
//   const [isSubmittingPresenter, setIsSubmittingPresenter] = useState(false);
//   const [showPresenterModal, setShowPresenterModal] = useState(false);
//   const [validTicket, setValidTicket] = useState<string | null>(null);

//   const { fetchTicketsByConference } = useTicket();
//   const { changeSession, changePresenter } = usePresenter();

//   useEffect(() => {
//     const loadTickets = async () => {
//       if (open && conference?.conferenceId) {
//         try {
//           const response = await fetchTicketsByConference(conference.conferenceId);
//           const validTicketItem = response?.data?.items?.find(
//             (ticket) => ticket.isRefunded === false
//           );
//           setValidTicket(validTicketItem?.ticketId || null);
//         } catch (error) {
//           console.error('Error fetching tickets:', error);
//         }
//       }
//     };
//     loadTickets();
//   }, [open, conference?.conferenceId]);

//   const formatDateTime = (dateString?: string) => {
//     if (!dateString) return '';
//     return dayjs(dateString).format('DD/MM/YYYY HH:mm');
//   };

//   const groupSessionsByDate = (sessions: SessionDetailForScheduleResponse[]) => {
//     const grouped = sessions.reduce((acc, session) => {
//       if (session.startTime) {
//         const date = dayjs(session.startTime).format('DD/MM/YYYY');
//         if (!acc[date]) {
//           acc[date] = [];
//         }
//         acc[date].push(session);
//       }
//       return acc;
//     }, {} as Record<string, SessionDetailForScheduleResponse[]>);
//     return grouped;
//   };

//   const handleRequestChangeSession = async () => {
//     if (!validTicket) {
//       Alert.alert('Lỗi', 'Bạn chưa mua vé cho hội nghị này');
//       return;
//     }
//     if (!sessionReason.trim()) {
//       Alert.alert('Lỗi', 'Vui lòng nhập lý do yêu cầu đổi lịch');
//       return;
//     }

//     try {
//       setIsSubmittingSession(true);
//       const response = await changeSession({
//         newSessionId: selectedSession?.conferenceSessionId || '',
//         ticketId: validTicket,
//         paperId: '', // Get from session
//         reason: sessionReason.trim(),
//       });

//       if (response.success) {
//         Alert.alert('Thành công', 'Gửi yêu cầu đổi lịch thành công');
//         setSessionReason('');
//         onClose();
//       }
//     } catch (error) {
//       Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu');
//     } finally {
//       setIsSubmittingSession(false);
//     }
//   };

//   const renderSessionItem = ({ item }: { item: SessionDetailForScheduleResponse }) => (
//     <TouchableOpacity
//       onPress={() => onSessionSelect(item)}
//       className="bg-gray-700 p-3 mb-2 rounded-lg border border-gray-600"
//     >
//       <Text className="text-white font-semibold text-sm mb-1" numberOfLines={2}>
//         {item.title || 'Untitled Session'}
//       </Text>

//       <View className="space-y-1">
//         <Text className="text-gray-300 text-xs">
//           🕒 {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
//         </Text>

//         {item.roomDisplayName && (
//           <Text className="text-gray-300 text-xs">
//             📍 {item.roomDisplayName}
//           </Text>
//         )}
//       </View>
//     </TouchableOpacity>
//   );

//   const renderPaperItem = ({ item }: { item: PresenterAuthor }) => (
//     <View className="bg-gray-700 p-3 mb-2 rounded-lg border border-gray-600">
//       <Text className="text-white font-semibold text-sm mb-1" numberOfLines={2}>
//         {item.paperTitle || 'Untitled Paper'}
//       </Text>

//       {item.paperDescription && (
//         <Text className="text-gray-400 text-xs mb-2" numberOfLines={3}>
//           {item.paperDescription}
//         </Text>
//       )}

//       {item.paperAuthor && item.paperAuthor.length > 0 && (
//         <View className="mt-2">
//           <Text className="text-gray-300 text-xs mb-1 font-semibold">Tác giả:</Text>
//           {item.paperAuthor.map((author: PaperAuthor, index: number) => (
//             <View key={`${author.userId}-${index}`} className="flex-row items-center mb-1">
//               {author.avatarUrl && (
//                 <Image
//                   source={{ uri: author.avatarUrl }}
//                   className="w-5 h-5 rounded-full mr-2"
//                 />
//               )}
//               <Text className="text-blue-400 text-xs flex-1">
//                 {author.fullName || 'Unknown'}
//               </Text>
//               {author.isPresenter && (
//                 <Text className="text-xs px-1 py-0.5 bg-blue-600 text-white rounded">
//                   Diễn giả
//                 </Text>
//               )}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   if (!selectedSession) {
//     // List View
//     return (
//       <Modal
//         visible={open}
//         animationType="slide"
//         onRequestClose={onClose}
//         presentationStyle="pageSheet"
//       >
//         <SafeAreaView className="flex-1 bg-gray-900">
//           <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
//             <Text className="text-white text-lg font-semibold flex-1" numberOfLines={1}>
//               {conference.conferenceName}
//             </Text>
//             <TouchableOpacity onPress={onClose} className="p-2 ml-2">
//               <Text className="text-blue-400 text-base">✕</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView className="flex-1 p-4">
//             {Object.entries(groupSessionsByDate(conference.sessions)).map(([date, sessions]) => (
//               <View key={date} className="mb-4">
//                 <Text className="text-blue-400 font-semibold mb-2">📅 {date}</Text>
//                 {sessions.map((session) => (
//                   <View key={session.conferenceSessionId}>
//                     {renderSessionItem({ item: session })}
//                   </View>
//                 ))}
//               </View>
//             ))}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     );
//   }

//   // Detail View
//   return (
//     <Modal
//       visible={open}
//       animationType="slide"
//       onRequestClose={onClose}
//       presentationStyle="pageSheet"
//     >
//       <SafeAreaView className="flex-1 bg-gray-900">
//         <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
//           <TouchableOpacity onPress={onBack} className="p-2">
//             <Text className="text-blue-400 text-base">← Quay lại</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={onClose} className="p-2">
//             <Text className="text-blue-400 text-base">✕</Text>
//           </TouchableOpacity>
//         </View>

//         <ScrollView className="flex-1 p-4">
//           <Text className="text-white text-xl font-bold mb-3">
//             {selectedSession.title || 'Untitled Session'}
//           </Text>

//           {selectedSession.description && (
//             <Text className="text-gray-400 text-sm mb-3">
//               {selectedSession.description}
//             </Text>
//           )}

//           <View className="bg-gray-800 p-3 rounded-lg mb-3">
//             <Text className="text-white font-semibold mb-2">Thông tin phiên họp</Text>
//             <Text className="text-gray-300 text-sm">
//               🕒 {formatDateTime(selectedSession.startTime)} - {formatDateTime(selectedSession.endTime)}
//             </Text>
//             {selectedSession.roomDisplayName && (
//               <Text className="text-gray-300 text-sm">
//                 📍 {selectedSession.roomDisplayName}
//               </Text>
//             )}
//           </View>

//           {selectedSession.presenterAuthor && selectedSession.presenterAuthor.length > 0 && (
//             <View>
//               <Text className="text-white font-semibold mb-2">
//                 Bài báo ({selectedSession.presenterAuthor.length})
//               </Text>
//               <FlatList
//                 data={selectedSession.presenterAuthor}
//                 renderItem={renderPaperItem}
//                 keyExtractor={(item, index) => `${item.paperId}-${index}`}
//                 scrollEnabled={false}
//               />
//             </View>
//           )}

//           {/* Change Session Request */}
//           <View className="mt-4">
//             <Text className="text-gray-400 text-sm mb-2">Yêu cầu đổi lịch</Text>
//             <TextInput
//               value={sessionReason}
//               onChangeText={setSessionReason}
//               placeholder="Nhập lý do yêu cầu đổi lịch..."
//               placeholderTextColor="#6b7280"
//               multiline
//               numberOfLines={3}
//               className="bg-gray-700 text-white p-3 rounded-lg border border-gray-600"
//             />
//             <TouchableOpacity
//               onPress={handleRequestChangeSession}
//               disabled={isSubmittingSession || !sessionReason.trim()}
//               className={`mt-2 py-3 rounded-lg ${isSubmittingSession || !sessionReason.trim()
//                 ? 'bg-gray-600'
//                 : 'bg-amber-600'
//                 }`}
//             >
//               <Text className="text-white text-center font-semibold">
//                 {isSubmittingSession ? 'Đang gửi...' : 'Yêu cầu đổi lịch'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </Modal>
//   );
// };

// const ConferenceCard: React.FC<ConferenceCardProps> = ({
//   conference,
//   selectedConference,
//   onConferenceClick,
//   onSessionNavigate,
// }) => {
//   const [sessionsListOpen, setSessionsListOpen] = useState(false);
//   const [sessionDetailOpen, setSessionDetailOpen] = useState(false);
//   const [selectedSession, setSelectedSession] = useState<SessionDetailForScheduleResponse | null>(null);

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('vi-VN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//   };

//   const handleViewSessions = () => {
//     setSessionsListOpen(true);
//   };

//   const handleSessionSelect = (session: SessionDetailForScheduleResponse) => {
//     setSelectedSession(session);
//     setSessionDetailOpen(true);
//     setSessionsListOpen(false);
//     if (onSessionNavigate) {
//       onSessionNavigate(session);
//     }
//   };

//   const handleBackToList = () => {
//     setSessionDetailOpen(false);
//     setSelectedSession(null);
//     setTimeout(() => {
//       setSessionsListOpen(true);
//     }, 200);
//   };

//   const handleCloseAll = () => {
//     setSessionDetailOpen(false);
//     setSessionsListOpen(false);
//     setSelectedSession(null);
//   };

//   return (
//     <>
//       <TouchableOpacity
//         onPress={() => onConferenceClick(conference)}
//         className={`bg-gray-800 rounded-lg p-4 mb-3 ${selectedConference === conference.conferenceId
//           ? 'border-2 border-blue-500'
//           : 'border border-gray-600'
//           }`}
//       >
//         {conference.bannerImageUrl && (
//           <Image
//             source={{ uri: conference.bannerImageUrl }}
//             className="w-full h-32 rounded-md mb-3"
//             resizeMode="cover"
//           />
//         )}

//         <Text className="font-semibold text-white text-base mb-2" numberOfLines={2}>
//           {conference.conferenceName || 'Untitled Conference'}
//         </Text>

//         {conference.description && (
//           <Text className="text-sm text-gray-400 mb-3" numberOfLines={2}>
//             {conference.description}
//           </Text>
//         )}

//         <View className="space-y-2">
//           <Text className="text-sm text-gray-300">
//             📅 {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
//           </Text>

//           {conference.address && (
//             <Text className="text-sm text-gray-300" numberOfLines={1}>
//               📍 {conference.address}
//             </Text>
//           )}

//           {conference.cityName && (
//             <Text className="text-sm text-gray-300">
//               🏙️ {conference.cityName}
//             </Text>
//           )}

//           {conference.totalSlot !== undefined && (
//             <Text className="text-sm text-gray-300">
//               👥 {conference.availableSlot}/{conference.totalSlot} slots
//             </Text>
//           )}

//           <View className="flex-row flex-wrap mt-2">
//             {conference.conferenceCategoryName && (
//               <Text className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white mr-2 mb-1">
//                 {conference.conferenceCategoryName}
//               </Text>
//             )}
//             {conference.conferenceStatusName && (
//               <Text className="text-xs px-2 py-1 rounded-full bg-green-600 text-white mr-2 mb-1">
//                 {conference.conferenceStatusName}
//               </Text>
//             )}
//             {conference.isResearchConference && (
//               <Text className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white mb-1">
//                 Research
//               </Text>
//             )}
//           </View>

//           {conference.sessions.length > 0 && (
//             <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-600">
//               <Text className="text-xs text-gray-400">
//                 {conference.sessions.length} phiên họp
//               </Text>
//               <TouchableOpacity
//                 onPress={handleViewSessions}
//                 className="px-3 py-1.5 bg-blue-600 rounded"
//               >
//                 <Text className="text-white text-xs">👁 Xem chi tiết</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>

//       {/* Sessions List Modal */}
//       <SessionsListDialog
//         open={sessionsListOpen}
//         conference={conference}
//         onClose={handleCloseAll}
//         onSessionSelect={handleSessionSelect}
//       />

//       {/* Session Detail Modal */}
//       <SessionDetailDialog
//         open={sessionDetailOpen}
//         session={selectedSession}
//         onClose={handleCloseAll}
//         onBack={handleBackToList}
//       />
//     </>
//   );
// };

// Sessions List Dialog Component
interface SessionsListDialogProps {
  open: boolean;
  conference: ConferenceDetailForScheduleResponse;
  onClose: () => void;
  onSessionSelect: (session: SessionDetailForScheduleResponse) => void;
}

const SessionsListDialog: React.FC<SessionsListDialogProps> = ({
  open,
  conference,
  onClose,
  onSessionSelect,
}) => {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSessionItem = ({ item }: { item: SessionDetailForScheduleResponse }) => (
    <TouchableOpacity
      onPress={() => onSessionSelect(item)}
      className="bg-gray-700 p-4 mb-3 rounded-lg border border-gray-600"
    >
      <Text className="text-white font-semibold text-base mb-2" numberOfLines={2}>
        {item.title || 'Untitled Session'}
      </Text>

      {item.description && (
        <Text className="text-gray-400 text-sm mb-2" numberOfLines={3}>
          {item.description}
        </Text>
      )}

      <View className="space-y-1">
        <Text className="text-gray-300 text-xs">
          🕒 {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
        </Text>

        {item.sessionDate && (
          <Text className="text-gray-300 text-xs">
            📅 {formatDateTime(item.sessionDate)}
          </Text>
        )}

        {item.roomDisplayName && (
          <Text className="text-gray-300 text-xs">
            📍 {item.roomDisplayName} {item.roomNumber && `(${item.roomNumber})`}
          </Text>
        )}

        {item.destinationName && (
          <Text className="text-gray-300 text-xs">
            🏢 {item.destinationName}
          </Text>
        )}

        {item.cityName && (
          <Text className="text-gray-300 text-xs">
            🏙️ {item.cityName}
          </Text>
        )}
      </View>

      {item.presenterAuthor && item.presenterAuthor.length > 0 && (
        <Text className="text-xs text-blue-400 mt-2">
          📄 {item.presenterAuthor.length} bài báo
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
          <Text className="text-white text-lg font-semibold flex-1" numberOfLines={1}>
            {conference.conferenceName}
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2 ml-2">
            <Text className="text-blue-400 text-base">✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={conference.sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.conferenceSessionId}
          className="flex-1 p-4"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-gray-400 text-center">
                Chưa có phiên họp nào
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

// Session Detail Dialog Component
interface SessionDetailDialogProps {
  open: boolean;
  session: SessionDetailForScheduleResponse | null;
  onClose: () => void;
  onBack: () => void;
}

const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  open,
  session,
  onClose,
  onBack,
}) => {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPaperItem = ({ item }: { item: PresenterAuthor }) => (
    <View className="bg-gray-700 p-4 mb-3 rounded-lg border border-gray-600">
      <Text className="text-white font-semibold text-base mb-2" numberOfLines={2}>
        {item.paperTitle || 'Untitled Paper'}
      </Text>

      {item.paperDescription && (
        <Text className="text-gray-400 text-sm mb-2" numberOfLines={4}>
          {item.paperDescription}
        </Text>
      )}

      {item.paperPhaseName && (
        <Text className="text-xs px-2 py-1 bg-green-600 text-white rounded self-start mb-2">
          {item.paperPhaseName}
        </Text>
      )}

      {item.paperAuthor && item.paperAuthor.length > 0 && (
        <View className="mt-2">
          <Text className="text-gray-300 text-xs mb-2 font-semibold">Tác giả:</Text>
          {item.paperAuthor.map((author: PaperAuthor, index: number) => (
            <View key={`${author.userId}-${index}`} className="flex-row items-center mb-1">
              {author.avatarUrl && (
                <Image
                  source={{ uri: author.avatarUrl }}
                  className="w-6 h-6 rounded-full mr-2"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1">
                <Text className="text-blue-400 text-xs">
                  {author.fullName || 'Unknown Author'}
                </Text>
                <View className="flex-row">
                  {author.isRootAuthor && (
                    <Text className="text-xs px-1 py-0.5 bg-yellow-600 text-white rounded mr-1">
                      Root Author
                    </Text>
                  )}
                  {author.isPresenter && (
                    <Text className="text-xs px-1 py-0.5 bg-blue-600 text-white rounded">
                      Presenter
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={open}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-900">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
          <TouchableOpacity onPress={onBack} className="p-2">
            <Text className="text-blue-400 text-base">← Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-blue-400 text-base">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {session && (
            <View>
              <Text className="text-white text-xl font-bold mb-4">
                {session.title || 'Untitled Session'}
              </Text>

              {session.description && (
                <View className="mb-4">
                  <Text className="text-gray-400 text-base leading-6">
                    {session.description}
                  </Text>
                </View>
              )}

              <View className="bg-gray-800 p-4 rounded-lg mb-4">
                <Text className="text-white font-semibold mb-2">Thông tin phiên họp</Text>
                <View className="space-y-1">
                  <Text className="text-gray-300 text-sm">
                    🕒 {formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}
                  </Text>
                  {session.sessionDate && (
                    <Text className="text-gray-300 text-sm">
                      📅 {formatDateTime(session.sessionDate)}
                    </Text>
                  )}
                  {session.roomDisplayName && (
                    <Text className="text-gray-300 text-sm">
                      📍 {session.roomDisplayName} {session.roomNumber && `(${session.roomNumber})`}
                    </Text>
                  )}
                  {session.destinationName && (
                    <Text className="text-gray-300 text-sm">
                      🏢 {session.destinationName}
                    </Text>
                  )}
                  {session.destinationStreet && (
                    <Text className="text-gray-300 text-sm">
                      📍 {session.destinationStreet}
                    </Text>
                  )}
                  {session.destinationDistrict && (
                    <Text className="text-gray-300 text-sm">
                      🏘️ {session.destinationDistrict}
                    </Text>
                  )}
                  {session.cityName && (
                    <Text className="text-gray-300 text-sm">
                      🏙️ {session.cityName}
                    </Text>
                  )}
                </View>
              </View>

              {session.presenterAuthor && session.presenterAuthor.length > 0 && (
                <View>
                  <Text className="text-white font-semibold text-lg mb-3">
                    Bài báo ({session.presenterAuthor.length})
                  </Text>
                  <FlatList
                    data={session.presenterAuthor}
                    renderItem={renderPaperItem}
                    keyExtractor={(item, index) => `${item.paperId}-${index}`}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

interface DatePickerModalProps {
  visible: boolean;
  currentDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  currentDate,
  onClose,
  onSelectDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const handleConfirm = () => {
    onSelectDate(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="bg-gray-800 rounded-t-3xl p-6">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-semibold">Chọn ngày</Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-blue-400 text-base">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Selected date display */}
            <View className="items-center mb-4">
              <Text className="text-gray-400 text-sm">Ngày được chọn</Text>
              <Text className="text-white text-xl font-bold mt-1">
                {dayjs(selectedDate).format('DD/MM/YYYY')}
              </Text>
            </View>

            {/* Date Picker */}
            <View className="items-center">
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                mode="date"
                locale="vi"
                theme="dark"
              // textColor="#ffffff"
              // fadeToColor="#1f2937"
              // androidVariant="nativeAndroid"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 bg-gray-700 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="flex-1 bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// const DatePickerModal: React.FC<DatePickerModalProps> = ({
//   visible,
//   currentDate,
//   onClose,
//   onSelectDate,
// }) => {
//   const [selectedDate, setSelectedDate] = useState(currentDate);

//   const handleConfirm = () => {
//     onSelectDate(selectedDate);
//     onClose();
//   };

//   return (
//     <Modal
//       key={`date-picker-${visible}`}
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 justify-end bg-black/50">
//         <View className="bg-gray-800 rounded-t-3xl p-6">
//           <View className="flex-row justify-between items-center mb-4">
//             <Text className="text-white text-lg font-semibold">Chọn ngày</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Text className="text-blue-400 text-base">✕</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Có thể dùng DateTimePicker từ @react-native-community/datetimepicker */}
//           <Text className="text-gray-400 text-sm mb-4">
//             Ngày hiện tại: {dayjs(selectedDate).format('DD/MM/YYYY')}
//           </Text>

//           {/* Quick Date Options */}
//           <View className="space-y-2 mb-4">
//             <TouchableOpacity
//               onPress={() => setSelectedDate(new Date())}
//               className="bg-gray-700 p-3 rounded-lg"
//             >
//               <Text className="text-white">Hôm nay</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 const tomorrow = new Date();
//                 tomorrow.setDate(tomorrow.getDate() + 1);
//                 setSelectedDate(tomorrow);
//               }}
//               className="bg-gray-700 p-3 rounded-lg"
//             >
//               <Text className="text-white">Ngày mai</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 const nextWeek = new Date();
//                 nextWeek.setDate(nextWeek.getDate() + 7);
//                 setSelectedDate(nextWeek);
//               }}
//               className="bg-gray-700 p-3 rounded-lg"
//             >
//               <Text className="text-white">Tuần sau</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             onPress={handleConfirm}
//             className="bg-blue-600 py-3 rounded-lg"
//           >
//             <Text className="text-white text-center font-semibold">Xác nhận</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

interface CustomCalendarHeaderProps {
  currentDate: Date;
  onShowDatePicker: () => void;
  selectedDate: Date;
}

const CustomCalendarHeader: React.FC<CustomCalendarHeaderProps> = ({ currentDate, onShowDatePicker, selectedDate }) => {
  const methods = useMethods();
  const month = dayjs(currentDate).format('MMMM');
  const year = dayjs(currentDate).format('YYYY');

  const handleToday = () => {
    const today = new Date();
    methods.goToDate({ date: today.toISOString(), animatedDate: true });
  };

  useEffect(() => {
    if (selectedDate) {
      methods.goToDate({ date: selectedDate.toISOString(), animatedDate: true });
    }
  }, [selectedDate]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1f2937',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
      }}
    >
      {/* Menu Icon (3 lines) */}
      <TouchableOpacity style={{ padding: 8 }}>
        <View style={{ gap: 4 }}>
          <View style={{ width: 20, height: 2, backgroundColor: '#fff' }} />
          <View style={{ width: 20, height: 2, backgroundColor: '#fff' }} />
          <View style={{ width: 20, height: 2, backgroundColor: '#fff' }} />
        </View>
      </TouchableOpacity>

      {/* Center: Navigation */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => methods.goToPrevPage()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: '300' }}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onShowDatePicker}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '400' }}>
            {month} {year}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => methods.goToNextPage()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 24, color: '#fff', fontWeight: '300' }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Today Button (Calendar Icon) */}
      <TouchableOpacity onPress={handleToday} style={{ padding: 8 }}>
        <View style={{
          width: 24,
          height: 24,
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <View style={{
            height: 6,
            backgroundColor: '#fff',
          }} />
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 10,
              fontWeight: 'bold',
            }}>
              {new Date().getDate()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Main Conference Calendar Screen Component
const ConferenceCalendarScreen: React.FC = () => {
  const [selectedConference, setSelectedConference] = useState<string | null>(null);
  const [conferences, setConferences] = useState<ConferenceDetailForScheduleResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedSessionForModal, setSelectedSessionForModal] = useState<SessionDetailForScheduleResponse | null>(null);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [selectedConferenceForModal, setSelectedConferenceForModal] = useState<ConferenceDetailForScheduleResponse | null>(null);

  const {
    lazyOwnConferencesForSchedule,
    fetchOwnConferencesForSchedule,
    ownConferencesForScheduleLoading,
  } = useConference();

  useEffect(() => {
    loadConferences();
  }, []);

  useEffect(() => {
    if (lazyOwnConferencesForSchedule) {
      setConferences(lazyOwnConferencesForSchedule);
    }
  }, [lazyOwnConferencesForSchedule]);

  const loadConferences = async () => {
    try {
      await fetchOwnConferencesForSchedule();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách hội nghị');
    }
  };

  const calendarEvents: PackedEvent[] = useMemo(() => {
    const events: any[] = [];
    conferences.forEach((conf) => {
      conf.sessions.forEach((session) => {
        if (session.startTime && session.endTime) {
          events.push({
            id: session.conferenceSessionId,
            title: session.title || 'Session',
            start: { dateTime: session.startTime },
            end: { dateTime: session.endTime },
            // start: { dateTime: new Date(session.startTime).toISOString() },
            // end: { dateTime: new Date(session.endTime).toISOString() },
            color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
          });
        }
      });
    });
    return events;
  }, [conferences, selectedConference]);

  const handleConferenceClick = (conference: ConferenceDetailForScheduleResponse) => {
    setSelectedConference(conference.conferenceId);
    if (conference.sessions.length > 0 && conference.sessions[0].startTime) {
      const sessionDate = new Date(conference.sessions[0].startTime);
      setSelectedDate(sessionDate);
    }
  };

  const handleSessionNavigate = (session: SessionDetailForScheduleResponse) => {
    if (session.startTime) {
      setSelectedDate(new Date(session.startTime));
    }
  };

  const handleEventPress = (event: OnEventResponse) => {
    const allSessions = conferences.flatMap(conf => conf.sessions);
    const session = allSessions.find(s => s.conferenceSessionId === event.id);
    const conference = conferences.find(conf =>
      conf.sessions.some(s => s.conferenceSessionId === event.id)
    );

    if (session && conference) {
      setSelectedSessionForModal(session);
      setSelectedConferenceForModal(conference);
      setSessionModalOpen(true);
    }
  };

  // const handleEventPress = (event: OnEventResponse) => {
  //   const allSessions = conferences.flatMap(conf => conf.sessions);
  //   const session = allSessions.find(s => s.conferenceSessionId === event.id);
  //   if (session) {
  //     Alert.alert(
  //       session.title || 'Session',
  //       [
  //         session.description,
  //         session.roomDisplayName && `📍 ${session.roomDisplayName}`,
  //       ].filter(Boolean).join('\n\n') || 'Không có thông tin chi tiết'
  //     );
  //   }
  // };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const renderEvent = (event: PackedEvent) => {
    const startTime = dayjs(event.start.dateTime).format('HH:mm');
    const endTime = dayjs(event.end.dateTime).format('HH:mm');

    return (
      <TouchableOpacity
        onPress={() => handleEventPress(event)}
        style={{
          flex: 1,
          padding: 8,
          borderRadius: 6,
          backgroundColor: event.color || '#3b82f6',
          borderLeftWidth: 3,
          borderLeftColor: 'rgba(255, 255, 255, 0.5)',
        }}>
        <Text
          numberOfLines={1}
          style={{
            color: 'white',
            fontSize: 11,
            fontWeight: '700',
            marginBottom: 2,
          }}>
          {event.title}
        </Text>
        <Text
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 10,
            fontWeight: '500',
          }}>
          🕒 {startTime} - {endTime}
        </Text>
      </TouchableOpacity>
    );
  };

  // const renderEvent = useCallback((event: PackedEvent) => {
  //   const startTime = dayjs(event.start.dateTime).format('HH:mm');
  //   const endTime = dayjs(event.end.dateTime).format('HH:mm');

  //   return (
  //     <TouchableOpacity
  //       onPress={() => handleEventPress(event)}
  //       style={{
  //         flex: 1,
  //         padding: 8,
  //         borderRadius: 6,
  //         backgroundColor: event.color || '#3b82f6',
  //         borderLeftWidth: 3,
  //         borderLeftColor: 'rgba(255, 255, 255, 0.5)',
  //       }}>
  //       <Text
  //         numberOfLines={1}
  //         style={{
  //           color: 'white',
  //           fontSize: 11,
  //           fontWeight: '700',
  //           marginBottom: 2,
  //         }}>
  //         {event.title}
  //       </Text>
  //       <Text
  //         style={{
  //           color: 'rgba(255, 255, 255, 0.9)',
  //           fontSize: 10,
  //           fontWeight: '500',
  //         }}>
  //         🕒 {startTime} - {endTime}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        <View className="p-4 border-b border-gray-700">
          <Text className="text-white text-xl font-bold">Lịch Hội Nghị</Text>
          <Text className="text-gray-400 text-sm">
            {conferences.length} hội nghị • {calendarEvents.length} phiên họp
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-1 border-b border-gray-700">
            <CalendarContainer
              events={calendarEvents}
              // events={[
              //   {
              //     id: '1',
              //     title: 'Meeting with Team',
              //     start: { dateTime: '2024-03-15T10:00:00Z' },
              //     end: { dateTime: '2024-03-15T11:00:00Z' },
              //     color: '#4285F4',
              //   },
              //   // ... more events
              // ]}
              initialDate={selectedDate.toISOString()}
              onPressEvent={handleEventPress}
              numberOfDays={7}
              onDateChanged={(date) => {
                setSelectedDate(new Date(date));
              }}
              theme={{
                colors: {
                  primary: '#3b82f6',
                  onPrimary: '#ffffff',
                  background: '#1f2937',
                  onBackground: '#ffffff',
                  border: '#374151',
                  text: '#ffffff',
                },
              }}
            >
              <CustomCalendarHeader
                currentDate={selectedDate}
                onShowDatePicker={() => setShowDatePicker(true)}
                selectedDate={selectedDate}
              />
              <CalendarHeader />
              <CalendarBody
                renderEvent={renderEvent}
              />
            </CalendarContainer>
          </View>

          <View className="h-64">
            <View className="p-3 border-b border-gray-700">
              <Text className="text-white font-semibold text-sm">Danh sách Hội nghị</Text>
            </View>

            <FlatList
              data={conferences}
              renderItem={({ item }) => (
                <ConferenceCard
                  conference={item}
                  selectedConference={selectedConference}
                  onConferenceClick={handleConferenceClick}
                  onSessionNavigate={handleSessionNavigate}
                />
              )}
              keyExtractor={(item) => item.conferenceId}
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              refreshing={ownConferencesForScheduleLoading}
              onRefresh={loadConferences}
            />
          </View>
        </View>

        <DatePickerModal
          visible={showDatePicker}
          currentDate={selectedDate}
          onClose={() => setShowDatePicker(false)}
          onSelectDate={handleDateSelect}
        />
      </View>

      {selectedConferenceForModal && (
        <SessionModal
          open={sessionModalOpen}
          conference={selectedConferenceForModal}
          selectedSession={selectedSessionForModal}
          onClose={() => {
            setSessionModalOpen(false);
            setSelectedSessionForModal(null);
            setSelectedConferenceForModal(null);
          }}
          onSessionSelect={(session) => {
            setSelectedSessionForModal(session);
          }}
          onBack={() => {
            setSelectedSessionForModal(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ConferenceCalendarScreen;
// const ConferenceCalendarScreen: React.FC = () => {
//   const [selectedConference, setSelectedConference] = useState<string | null>(null);
//   const [conferences, setConferences] = useState<ConferenceDetailForScheduleResponse[]>([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [showMonthPicker, setShowMonthPicker] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   // const methods = useMethods();

//   const {
//     lazyOwnConferencesForSchedule,
//     fetchOwnConferencesForSchedule,
//     ownConferencesForScheduleLoading,
//     ownConferencesForScheduleError,
//   } = useConference();

//   useEffect(() => {
//     loadConferences();
//   }, []);

//   useEffect(() => {
//     if (lazyOwnConferencesForSchedule) {
//       setConferences(lazyOwnConferencesForSchedule);
//     }
//   }, [lazyOwnConferencesForSchedule]);

//   const loadConferences = async () => {
//     try {
//       await fetchOwnConferencesForSchedule();
//     } catch (error) {
//       Alert.alert('Lỗi', 'Không thể tải danh sách hội nghị');
//     }
//   };

//   // type Event = {
//   //   id: string;
//   //   title: string;
//   //   start: Date;
//   //   end: Date;
//   //   color?: string;
//   // };

//   type CalendarEvent = {
//     id: string;
//     title: string;
//     // start: Date | string;
//     // end: Date | string;
//     start: { dateTime: string };
//     end: { dateTime: string };
//     color?: string;
//   };


//   // const calendarEvents = useMemo(() => {
//   //   const events: Event[] = [];

//   //   conferences.forEach((conf) => {
//   //     conf.sessions.forEach((session) => {
//   //       if (session.startTime && session.endTime) {
//   //         events.push({
//   //           id: session.conferenceSessionId,
//   //           title: session.title || 'Session',
//   //           start: new Date(session.startTime),
//   //           end: new Date(session.endTime),
//   //           color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
//   //         });
//   //       }
//   //     });
//   //   });

//   //   return events;
//   // }, [conferences, selectedConference]);

//   const calendarEvents = useMemo(() => {
//     const events: CalendarEvent[] = [];

//     conferences.forEach((conf) => {
//       conf.sessions.forEach((session) => {
//         if (session.startTime && session.endTime) {
//           events.push({
//             id: session.conferenceSessionId, // Thêm id bắt buộc
//             title: session.title || 'Session',
//             start: { dateTime: new Date(session.startTime).toISOString() },
//             end: { dateTime: new Date(session.endTime).toISOString() },
//             color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
//           });
//         }
//       });
//     });

//     return events;
//   }, [conferences, selectedConference]);


//   // const handlePrevPress = () => {
//   //   methods.goToPrevPage();
//   //   const newDate = new Date(selectedDate);
//   //   newDate.setDate(selectedDate.getDate() - 7);
//   //   setSelectedDate(newDate);
//   // };

//   // const handleNextPress = () => {
//   //   methods.goToNextPage();
//   //   const newDate = new Date(selectedDate);
//   //   newDate.setDate(selectedDate.getDate() + 7);
//   //   setSelectedDate(newDate);
//   // };

//   // const handleTodayPress = () => {
//   //   const today = new Date();
//   //   methods.goToDate({ date: today.toISOString(), animatedDate: true });
//   //   setSelectedDate(today);
//   // };


//   const calendarHeight = useMemo(() => height * 0.4, []);

//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//     // Nếu muốn navigate calendar đến ngày đó
//     // methods.goToDate({ date: date.toISOString(), animatedDate: true });
//   };

//   const handleDateChange = (date: Date) => {
//     setCurrentDate(date);
//     setSelectedDate(date);
//   };

//   const handleMonthYearSelect = (date: Date) => {
//     setCurrentDate(date);
//     setSelectedDate(date);
//   };

//   const handleConferenceClick = (conference: ConferenceDetailForScheduleResponse) => {
//     setSelectedConference(conference.conferenceId);
//     // Scroll to first session of this conference
//     if (conference.sessions.length > 0 && conference.sessions[0].startTime) {
//       setSelectedDate(new Date(conference.sessions[0].startTime));
//     }
//   };

//   const handleSessionNavigate = (session: SessionDetailForScheduleResponse) => {
//     if (session.startTime) {
//       setSelectedDate(new Date(session.startTime));
//     }
//   };

//   const handleEventPress = (event: OnEventResponse) => {
//     // Find and show session details
//     const allSessions = conferences.flatMap(conf => conf.sessions);
//     const session = allSessions.find(s => s.conferenceSessionId === event.id);
//     if (session) {
//       Alert.alert(
//         session.title || 'Session',
//         [
//           session.description,
//           session.roomDisplayName && `📍 ${session.roomDisplayName}`,
//           session.destinationName && `🏢 ${session.destinationName}`,
//         ].filter(Boolean).join('\n\n') || 'Không có thông tin chi tiết'
//       );
//     }
//   };

//   // const handleEventPress = (event: Event) => {
//   //   // Find and show session details
//   //   const allSessions = conferences.flatMap(conf => conf.sessions);
//   //   const session = allSessions.find(s => s.title === event.title);
//   //   if (session) {
//   //     Alert.alert(
//   //       session.title || 'Session',
//   //       [
//   //         session.description,
//   //         session.roomDisplayName && `📍 ${session.roomDisplayName}`,
//   //         session.destinationName && `🏢 ${session.destinationName}`,
//   //       ].filter(Boolean).join('\n\n') || 'Không có thông tin chi tiết'
//   //     );
//   //   }
//   // };

//   const renderConferenceItem = ({ item }: { item: ConferenceDetailForScheduleResponse }) => (
//     <ConferenceCard
//       conference={item}
//       selectedConference={selectedConference}
//       onConferenceClick={handleConferenceClick}
//       onSessionNavigate={handleSessionNavigate}
//     />
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-gray-900">
//       <View className="flex-1">
//         {/* Header */}
//         <View className="p-4 border-b border-gray-700">
//           <Text className="text-white text-xl font-bold">Lịch Hội Nghị</Text>
//           <Text className="text-gray-400 text-sm">
//             {conferences.length} hội nghị • {calendarEvents.length} phiên họp
//           </Text>
//         </View>

//         {/* <CustomCalendarHeader
//           currentDate={currentDate}
//           onDateChange={handleDateChange}
//           onShowMonthPicker={() => setShowMonthPicker(true)}
//         /> */}

//         {/* Content */}
//         <View className="flex-1">
//           {/* Calendar Section */}
//           {/* <View style={{ height: calendarHeight }} className="border-b border-gray-700"> */}
//           <View className="border-b border-gray-700 flex-1">
//             {/* <Calendar
//               events={calendarEvents}
//               height={calendarHeight}
//               mode="month"
//               date={selectedDate}
//               onPressEvent={handleEventPress}
//               theme={{
//                 palette: {
//                   primary: {
//                     main: '#3b82f6',
//                     contrastText: '#fff',
//                   },
//                   gray: {
//                     100: '#1f2937',
//                     200: '#374151',
//                     300: '#4b5563',
//                     500: '#6b7280',
//                     800: '#1f2937',
//                   },
//                 },
//               }}
//               headerContainerStyle={{ height: 50 }}
//               eventCellStyle={{
//                 backgroundColor: '#3b82f6',
//                 borderRadius: 4,
//                 padding: 2,
//               }}
//             /> */}
//             <CalendarContainer
//               // key={selectedDate.toISOString()}
//               // controller={calendarController}
//               events={calendarEvents}
//               initialDate={selectedDate.toISOString()}
//               onPressEvent={(event) => handleEventPress(event)}
//               // calendarType="week"
//               numberOfDays={7}
//               onDateChanged={(date) => setSelectedDate(new Date(date))}
//               theme={{
//                 colors: {
//                   primary: '#3b82f6',
//                   onPrimary: '#ffffff',
//                   background: '#1f2937',
//                   onBackground: '#ffffff',
//                   border: '#374151',
//                   text: '#ffffff',
//                 },
//                 eventTitleStyle: {
//                   color: '#ffffff',
//                   fontSize: 12,
//                 },
//               }}
//             // start={6}
//             // end={23}
//             // renderHeader={(props) => <CustomCalendarHeader {...props} />}
//             // HeaderComponent={CalendarHeader}
//             // BodyComponent={CalendarBody}
//             // firstDay={1}
//             // eventTitleStyle={{
//             //   color: '#ffffff',
//             //   fontSize: 12,
//             // }}
//             >
//               <CustomCalendarHeader
//                 currentDate={selectedDate}
//                 onShowDatePicker={() => setShowDatePicker(true)}
//               />
//               <CalendarHeader />
//               <CalendarBody />
//             </CalendarContainer>
//           </View>

//           {/* Conference List Section */}
//           <View className="flex-1">
//             <View className="p-4 border-b border-gray-700">
//               <Text className="text-white font-semibold">Danh sách Hội nghị</Text>
//             </View>

//             <FlatList
//               data={conferences}
//               renderItem={renderConferenceItem}
//               keyExtractor={(item) => item.conferenceId}
//               className="flex-1 px-4"
//               showsVerticalScrollIndicator={false}
//               refreshing={ownConferencesForScheduleLoading}
//               onRefresh={loadConferences}
//               ListEmptyComponent={
//                 <View className="flex-1 justify-center items-center py-8">
//                   <Text className="text-gray-400 text-center">
//                     {ownConferencesForScheduleError
//                       ? `Lỗi: ${ownConferencesForScheduleError}`
//                       : 'Chưa có hội nghị nào trong lịch'
//                     }
//                   </Text>
//                 </View>
//               }
//             />
//           </View>
//         </View>

//         <DatePickerModal
//           visible={showDatePicker}
//           currentDate={selectedDate}
//           onClose={() => setShowDatePicker(false)}
//           onSelectDate={handleDateSelect}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ConferenceCalendarScreen;