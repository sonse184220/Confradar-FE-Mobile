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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-big-calendar';
import CalendarKit, { CalendarBody, CalendarContainer, CalendarHeader, OnEventResponse } from '@howljs/calendar-kit';
import { useConference } from '../hooks/useConference';
import {
  ConferenceDetailForScheduleResponse,
  SessionDetailForScheduleResponse,
  PresenterAuthor,
  PaperAuthor,
} from '../types/conference.type';

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

interface CustomCalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onShowMonthPicker: () => void;
}

const CustomCalendarHeader: React.FC<CustomCalendarHeaderProps> = ({
  currentDate,
  onDateChange,
  onShowMonthPicker,
}) => {
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <View className="bg-white border-b border-gray-300">
      <View className="flex-row justify-between items-center px-4 py-3">
        {/* Left: Menu Icon */}
        <TouchableOpacity className="p-2">
          <View className="space-y-1">
            <View className="w-6 h-0.5 bg-gray-700" />
            <View className="w-6 h-0.5 bg-gray-700" />
            <View className="w-6 h-0.5 bg-gray-700" />
          </View>
        </TouchableOpacity>

        {/* Center: Navigation + Month/Year */}
        <View className="flex-row items-center space-x-4">
          {/* Previous Button */}
          <TouchableOpacity onPress={handlePrevious} className="p-2">
            <Text className="text-gray-700 text-xl font-bold">‹</Text>
          </TouchableOpacity>

          {/* Month/Year Display */}
          <TouchableOpacity onPress={onShowMonthPicker}>
            <Text className="text-gray-900 text-lg font-normal">
              {formatMonthYear(currentDate)}
            </Text>
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity onPress={handleNext} className="p-2">
            <Text className="text-gray-700 text-xl font-bold">›</Text>
          </TouchableOpacity>
        </View>

        {/* Right: Calendar Icon (Today button) */}
        <TouchableOpacity onPress={handleToday} className="p-2">
          <View className="w-6 h-6 border-2 border-gray-700 rounded">
            <View className="absolute top-0.5 left-0 right-0 h-1 bg-gray-700 rounded-t" />
            <View className="flex-1 items-center justify-center mt-1">
              <Text className="text-gray-700 text-xs font-bold">
                {new Date().getDate()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// const CustomCalendarHeader: React.FC<CustomCalendarHeaderProps> = ({
//   currentDate,
//   onDateChange,
//   onShowMonthPicker,
// }) => {
//   const formatMonthYear = (date: Date) => {
//     return date.toLocaleDateString('vi-VN', {
//       month: 'long',
//       year: 'numeric',
//     });
//   };

//   const handlePrevious = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(currentDate.getDate() - 7); // Lùi 1 tuần
//     onDateChange(newDate);
//   };

//   const handleNext = () => {
//     const newDate = new Date(currentDate);
//     newDate.setDate(currentDate.getDate() + 7); // Tiến 1 tuần
//     onDateChange(newDate);
//   };

//   const handleToday = () => {
//     onDateChange(new Date());
//   };

//   return (
//     <View className="bg-gray-800 border-b border-gray-700">
//       <View className="flex-row justify-between items-center px-4 py-3">
//         {/* Month/Year Display */}
//         <TouchableOpacity
//           onPress={onShowMonthPicker}
//           className="flex-row items-center"
//         >
//           <Text className="text-white text-lg font-semibold mr-2">
//             {formatMonthYear(currentDate)}
//           </Text>
//           <Text className="text-gray-400">▼</Text>
//         </TouchableOpacity>

//         {/* Navigation Controls */}
//         <View className="flex-row items-center space-x-2">
//           <TouchableOpacity
//             onPress={handlePrevious}
//             className="p-2 bg-gray-700 rounded"
//           >
//             <Text className="text-white">←</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleToday}
//             className="px-3 py-2 bg-blue-600 rounded"
//           >
//             <Text className="text-white text-xs font-semibold">Hôm nay</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             onPress={handleNext}
//             className="p-2 bg-gray-700 rounded"
//           >
//             <Text className="text-white">→</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// Month/Year Picker Modal Component
interface MonthYearPickerProps {
  visible: boolean;
  currentDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  visible,
  currentDate,
  onClose,
  onSelectDate,
}) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onSelectDate(newDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-gray-800 rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-semibold">Chọn tháng/năm</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-400 text-base">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Year Picker */}
          <Text className="text-gray-400 text-sm mb-2">Năm</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row space-x-2">
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  onPress={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg ${selectedYear === year ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                >
                  <Text className={`${selectedYear === year ? 'text-white' : 'text-gray-400'}`}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Month Picker */}
          <Text className="text-gray-400 text-sm mb-2">Tháng</Text>
          <View className="flex-row flex-wrap mb-4">
            {months.map((month, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedMonth(index)}
                className={`w-1/4 p-3 mb-2 ${selectedMonth === index ? 'bg-blue-600' : 'bg-gray-700'
                  } rounded-lg mr-2`}
              >
                <Text className={`text-center ${selectedMonth === index ? 'text-white' : 'text-gray-400'
                  }`}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Conference Calendar Screen Component
const ConferenceCalendarScreen: React.FC = () => {
  const [selectedConference, setSelectedConference] = useState<string | null>(null);
  const [conferences, setConferences] = useState<ConferenceDetailForScheduleResponse[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

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

  type Event = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
  };

  // type CalendarEvent = {
  //   id: string;
  //   title: string;
  //   // start: Date | string;
  //   // end: Date | string;
  //   start: { dateTime: string };
  //   end: { dateTime: string };
  //   color?: string;
  // };


  const calendarEvents = useMemo(() => {
    const events: Event[] = [];

    conferences.forEach((conf) => {
      conf.sessions.forEach((session) => {
        if (session.startTime && session.endTime) {
          events.push({
            id: session.conferenceSessionId,
            title: session.title || 'Session',
            start: new Date(session.startTime),
            end: new Date(session.endTime),
            color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
          });
        }
      });
    });

    return events;
  }, [conferences, selectedConference]);

  // const calendarEvents = useMemo(() => {
  //   const events: CalendarEvent[] = [];

  //   conferences.forEach((conf) => {
  //     conf.sessions.forEach((session) => {
  //       if (session.startTime && session.endTime) {
  //         events.push({
  //           id: session.conferenceSessionId, // Thêm id bắt buộc
  //           title: session.title || 'Session',
  //           start: { dateTime: new Date(session.startTime).toISOString() },
  //           end: { dateTime: new Date(session.endTime).toISOString() },
  //           color: selectedConference === conf.conferenceId ? '#3b82f6' : '#6b7280',
  //         });
  //       }
  //     });
  //   });

  //   return events;
  // }, [conferences, selectedConference]);

  const calendarHeight = useMemo(() => height * 0.4, []);

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

  const handleEventPress = (event: Event) => {
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

        <CustomCalendarHeader
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onShowMonthPicker={() => setShowMonthPicker(true)}
        />

        {/* Content */}
        <View className="flex-1">
          {/* Calendar Section */}
          {/* <View style={{ height: calendarHeight }} className="border-b border-gray-700"> */}
          <View className="border-b border-gray-700 flex-1">
            <Calendar
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
            />
            {/* <CalendarContainer
              key={selectedDate.toISOString()}
              events={calendarEvents}
              initialDate={selectedDate.toISOString()}
              onPressEvent={(event) => handleEventPress(event)}
              // calendarType="week"
              numberOfDays={7}
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
            // firstDay={1}
            // eventTitleStyle={{
            //   color: '#ffffff',
            //   fontSize: 12,
            // }}
            >
              <CalendarHeader />
              <CalendarBody />
            </CalendarContainer> */}
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
      </View>
    </SafeAreaView>
  );
};

export default ConferenceCalendarScreen;