import React, { useState, useEffect, useMemo } from 'react';
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
} from 'react-native';
import dayjs, { Dayjs } from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-big-calendar';
import CalendarKit, { CalendarBody, CalendarContainer, CalendarHeader, OnEventResponse, useMethods } from '@howljs/calendar-kit';
import useCalendarController from '@howljs/calendar-kit';
import { useConference } from '../hooks/useConference';
import {
  ConferenceDetailForScheduleResponse,
  SessionDetailForScheduleResponse,
  PresenterAuthor,
  PaperAuthor,
} from '../types/conference.type';
import DatePicker from 'react-native-date-picker';

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
  const [sessionsListOpen, setSessionsListOpen] = useState(false);
  const [sessionDetailOpen, setSessionDetailOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDetailForScheduleResponse | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleViewSessions = () => {
    setSessionsListOpen(true);
  };

  const handleSessionSelect = (session: SessionDetailForScheduleResponse) => {
    setSelectedSession(session);
    setSessionDetailOpen(true);
    setSessionsListOpen(false);
    if (onSessionNavigate) {
      onSessionNavigate(session);
    }
  };

  const handleBackToList = () => {
    setSessionDetailOpen(false);
    setSelectedSession(null);
    setTimeout(() => {
      setSessionsListOpen(true);
    }, 200);
  };

  const handleCloseAll = () => {
    setSessionDetailOpen(false);
    setSessionsListOpen(false);
    setSelectedSession(null);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => onConferenceClick(conference)}
        className={`bg-gray-800 rounded-lg p-4 mb-3 ${selectedConference === conference.conferenceId
          ? 'border-2 border-blue-500'
          : 'border border-gray-600'
          }`}
      >
        {conference.bannerImageUrl && (
          <Image
            source={{ uri: conference.bannerImageUrl }}
            className="w-full h-32 rounded-md mb-3"
            resizeMode="cover"
          />
        )}

        <Text className="font-semibold text-white text-base mb-2" numberOfLines={2}>
          {conference.conferenceName || 'Untitled Conference'}
        </Text>

        {conference.description && (
          <Text className="text-sm text-gray-400 mb-3" numberOfLines={2}>
            {conference.description}
          </Text>
        )}

        <View className="space-y-2">
          <Text className="text-sm text-gray-300">
            📅 {formatDate(conference.startDate)} - {formatDate(conference.endDate)}
          </Text>

          {conference.address && (
            <Text className="text-sm text-gray-300" numberOfLines={1}>
              📍 {conference.address}
            </Text>
          )}

          {conference.cityName && (
            <Text className="text-sm text-gray-300">
              🏙️ {conference.cityName}
            </Text>
          )}

          {conference.totalSlot !== undefined && (
            <Text className="text-sm text-gray-300">
              👥 {conference.availableSlot}/{conference.totalSlot} slots
            </Text>
          )}

          <View className="flex-row flex-wrap mt-2">
            {conference.conferenceCategoryName && (
              <Text className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white mr-2 mb-1">
                {conference.conferenceCategoryName}
              </Text>
            )}
            {conference.conferenceStatusName && (
              <Text className="text-xs px-2 py-1 rounded-full bg-green-600 text-white mr-2 mb-1">
                {conference.conferenceStatusName}
              </Text>
            )}
            {conference.isResearchConference && (
              <Text className="text-xs px-2 py-1 rounded-full bg-purple-600 text-white mb-1">
                Research
              </Text>
            )}
          </View>

          {conference.sessions.length > 0 && (
            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-600">
              <Text className="text-xs text-gray-400">
                {conference.sessions.length} phiên họp
              </Text>
              <TouchableOpacity
                onPress={handleViewSessions}
                className="px-3 py-1.5 bg-blue-600 rounded"
              >
                <Text className="text-white text-xs">👁 Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Sessions List Modal */}
      <SessionsListDialog
        open={sessionsListOpen}
        conference={conference}
        onClose={handleCloseAll}
        onSessionSelect={handleSessionSelect}
      />

      {/* Session Detail Modal */}
      <SessionDetailDialog
        open={sessionDetailOpen}
        session={selectedSession}
        onClose={handleCloseAll}
        onBack={handleBackToList}
      />
    </>
  );
};

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
}

const CustomCalendarHeader: React.FC<CustomCalendarHeaderProps> = ({ currentDate, onShowDatePicker }) => {
  const methods = useMethods();
  const month = dayjs(currentDate).format('MMMM');
  const year = dayjs(currentDate).format('YYYY');

  const handleToday = () => {
    const today = new Date();
    methods.goToDate({ date: today.toISOString(), animatedDate: true });
  };


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

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // const methods = useMethods();

  const {
    lazyOwnConferencesForSchedule,
    fetchOwnConferencesForSchedule,
    ownConferencesForScheduleLoading,
    ownConferencesForScheduleError,
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

  // type Event = {
  //   id: string;
  //   title: string;
  //   start: Date;
  //   end: Date;
  //   color?: string;
  // };

  type CalendarEvent = {
    id: string;
    title: string;
    // start: Date | string;
    // end: Date | string;
    start: { dateTime: string };
    end: { dateTime: string };
    color?: string;
  };


  // const calendarEvents = useMemo(() => {
  //   const events: Event[] = [];

  //   conferences.forEach((conf) => {
  //     conf.sessions.forEach((session) => {
  //       if (session.startTime && session.endTime) {
  //         events.push({
  //           id: session.conferenceSessionId,
  //           title: session.title || 'Session',
  //           start: new Date(session.startTime),
  //           end: new Date(session.endTime),
  //           color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
  //         });
  //       }
  //     });
  //   });

  //   return events;
  // }, [conferences, selectedConference]);

  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    conferences.forEach((conf) => {
      conf.sessions.forEach((session) => {
        if (session.startTime && session.endTime) {
          events.push({
            id: session.conferenceSessionId, // Thêm id bắt buộc
            title: session.title || 'Session',
            start: { dateTime: new Date(session.startTime).toISOString() },
            end: { dateTime: new Date(session.endTime).toISOString() },
            color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
          });
        }
      });
    });

    return events;
  }, [conferences, selectedConference]);


  // const handlePrevPress = () => {
  //   methods.goToPrevPage();
  //   const newDate = new Date(selectedDate);
  //   newDate.setDate(selectedDate.getDate() - 7);
  //   setSelectedDate(newDate);
  // };

  // const handleNextPress = () => {
  //   methods.goToNextPage();
  //   const newDate = new Date(selectedDate);
  //   newDate.setDate(selectedDate.getDate() + 7);
  //   setSelectedDate(newDate);
  // };

  // const handleTodayPress = () => {
  //   const today = new Date();
  //   methods.goToDate({ date: today.toISOString(), animatedDate: true });
  //   setSelectedDate(today);
  // };


  const calendarHeight = useMemo(() => height * 0.4, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Nếu muốn navigate calendar đến ngày đó
    // methods.goToDate({ date: date.toISOString(), animatedDate: true });
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  const handleMonthYearSelect = (date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
  };

  const handleConferenceClick = (conference: ConferenceDetailForScheduleResponse) => {
    setSelectedConference(conference.conferenceId);
    // Scroll to first session of this conference
    if (conference.sessions.length > 0 && conference.sessions[0].startTime) {
      setSelectedDate(new Date(conference.sessions[0].startTime));
    }
  };

  const handleSessionNavigate = (session: SessionDetailForScheduleResponse) => {
    if (session.startTime) {
      setSelectedDate(new Date(session.startTime));
    }
  };

  const handleEventPress = (event: OnEventResponse) => {
    // Find and show session details
    const allSessions = conferences.flatMap(conf => conf.sessions);
    const session = allSessions.find(s => s.conferenceSessionId === event.id);
    if (session) {
      Alert.alert(
        session.title || 'Session',
        [
          session.description,
          session.roomDisplayName && `📍 ${session.roomDisplayName}`,
          session.destinationName && `🏢 ${session.destinationName}`,
        ].filter(Boolean).join('\n\n') || 'Không có thông tin chi tiết'
      );
    }
  };

  // const handleEventPress = (event: Event) => {
  //   // Find and show session details
  //   const allSessions = conferences.flatMap(conf => conf.sessions);
  //   const session = allSessions.find(s => s.title === event.title);
  //   if (session) {
  //     Alert.alert(
  //       session.title || 'Session',
  //       [
  //         session.description,
  //         session.roomDisplayName && `📍 ${session.roomDisplayName}`,
  //         session.destinationName && `🏢 ${session.destinationName}`,
  //       ].filter(Boolean).join('\n\n') || 'Không có thông tin chi tiết'
  //     );
  //   }
  // };

  const renderConferenceItem = ({ item }: { item: ConferenceDetailForScheduleResponse }) => (
    <ConferenceCard
      conference={item}
      selectedConference={selectedConference}
      onConferenceClick={handleConferenceClick}
      onSessionNavigate={handleSessionNavigate}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <View className="p-4 border-b border-gray-700">
          <Text className="text-white text-xl font-bold">Lịch Hội Nghị</Text>
          <Text className="text-gray-400 text-sm">
            {conferences.length} hội nghị • {calendarEvents.length} phiên họp
          </Text>
        </View>

        {/* <CustomCalendarHeader
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onShowMonthPicker={() => setShowMonthPicker(true)}
        /> */}

        {/* Content */}
        <View className="flex-1">
          {/* Calendar Section */}
          {/* <View style={{ height: calendarHeight }} className="border-b border-gray-700"> */}
          <View className="border-b border-gray-700 flex-1">
            {/* <Calendar
              events={calendarEvents}
              height={calendarHeight}
              mode="month"
              date={selectedDate}
              onPressEvent={handleEventPress}
              theme={{
                palette: {
                  primary: {
                    main: '#3b82f6',
                    contrastText: '#fff',
                  },
                  gray: {
                    100: '#1f2937',
                    200: '#374151',
                    300: '#4b5563',
                    500: '#6b7280',
                    800: '#1f2937',
                  },
                },
              }}
              headerContainerStyle={{ height: 50 }}
              eventCellStyle={{
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                padding: 2,
              }}
            /> */}
            <CalendarContainer
              // key={selectedDate.toISOString()}
              // controller={calendarController}
              events={calendarEvents}
              initialDate={selectedDate.toISOString()}
              onPressEvent={(event) => handleEventPress(event)}
              // calendarType="week"
              numberOfDays={7}
              onDateChanged={(date) => setSelectedDate(new Date(date))}
              theme={{
                colors: {
                  primary: '#3b82f6',
                  onPrimary: '#ffffff',
                  background: '#1f2937',
                  onBackground: '#ffffff',
                  border: '#374151',
                  text: '#ffffff',
                },
                eventTitleStyle: {
                  color: '#ffffff',
                  fontSize: 12,
                },
              }}
              start={6}
              end={23}
            // renderHeader={(props) => <CustomCalendarHeader {...props} />}
            // HeaderComponent={CalendarHeader}
            // BodyComponent={CalendarBody}
            // firstDay={1}
            // eventTitleStyle={{
            //   color: '#ffffff',
            //   fontSize: 12,
            // }}
            >
              <CustomCalendarHeader
                currentDate={selectedDate}
                onShowDatePicker={() => setShowDatePicker(true)}
              />
              <CalendarHeader />
              <CalendarBody />
            </CalendarContainer>
          </View>

          {/* Conference List Section */}
          <View className="flex-1">
            <View className="p-4 border-b border-gray-700">
              <Text className="text-white font-semibold">Danh sách Hội nghị</Text>
            </View>

            <FlatList
              data={conferences}
              renderItem={renderConferenceItem}
              keyExtractor={(item) => item.conferenceId}
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
              refreshing={ownConferencesForScheduleLoading}
              onRefresh={loadConferences}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-8">
                  <Text className="text-gray-400 text-center">
                    {ownConferencesForScheduleError
                      ? `Lỗi: ${ownConferencesForScheduleError}`
                      : 'Chưa có hội nghị nào trong lịch'
                    }
                  </Text>
                </View>
              }
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
    </SafeAreaView>
  );
};

export default ConferenceCalendarScreen;