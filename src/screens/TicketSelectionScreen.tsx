import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import {
  Appbar,
  RadioButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
// import { ConferencePriceResponse, ConferenceResponse } from '../store/api/conferenceApi';
import { useTicket } from '../hooks/useTicket';
import { useConference } from '../hooks/useConference';
import { ConferencePriceResponse, ConferenceResponse, TechnicalConferenceDetailResponse } from '../types/conference.type';
import { useTransaction } from '@/hooks/useTransaction';

const { width: screenWidth } = Dimensions.get('window');

interface TicketSelectionScreenProps {
  navigation?: any;
  route?: {
    params?: {
      conferenceId: string;
    };
  };
}

// Reusable Components
const ConferenceHeader: React.FC<{
  conference: TechnicalConferenceDetailResponse;
}> = ({ conference }) => {
  const imageMap: Record<string, any> = {
    conf1: require('../assets/conf1.jpg'),
    conf2: require('../assets/conf2.jpg'),
    taylorswift: require('../assets/taylorswift.jpg'),
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}. ${month}. ${year}`;
  };

  const formatTime = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 'Thời gian không xác định';
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View className="px-4 pb-6 mt-5">
      <View className="bg-white rounded-3xl p-6 shadow-sm">
        {/* Conference Logo/Icon */}
        <View className="items-center mb-4">
          <View className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              source={{ uri: conference.bannerImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Conference Title */}
        <Text className="text-xl font-bold text-gray-900 text-center mb-4">
          {conference.conferenceName || 'N/A'}
        </Text>

        {/* Date and Time */}
        <View className="flex-row items-center justify-center mb-2">
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-3" />
          <Text className="text-base text-gray-700 font-medium">
            {formatDate(conference.startDate)}
          </Text>
        </View>

        {/* Venue */}
        <Text className="text-sm text-blue-600 text-center mb-2">
          {conference.address || 'Địa điểm không xác định'}
        </Text>

        {/* Time */}
        <View className="flex-row items-center justify-center">
          <Icon name="access-time" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {formatTime(conference.startDate, conference.endDate)}
          </Text>
        </View>

        <View className="flex-row items-center justify-center">
          <Icon name="people" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            Tổng số chỗ: {conference.totalSlot}
          </Text>
        </View>

        <View className="flex-row items-center justify-center">
          <Icon name="access-time" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            Số chỗ còn trống để đăng ký : {conference.availableSlot}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const getCurrentPrice = (price: ConferencePriceResponse) => {
  const basePrice = price.ticketPrice ?? 0;

  if (!price.pricePhases || price.pricePhases.length === 0) {
    return basePrice;
  }

  const now = new Date();
  const currentPhase = price.pricePhases.find(phase => {
    const startDate = new Date(phase.startDate || '');
    const endDate = new Date(phase.endDate || '');
    return now >= startDate && now <= endDate;
  });

  if (!currentPhase || !currentPhase.applyPercent) {
    return basePrice;
  }

  const finalPrice = Math.round(basePrice * (currentPhase.applyPercent / 100));
  return finalPrice;
};

const TicketTypeCard: React.FC<{
  ticket: ConferencePriceResponse;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ ticket, isSelected, onSelect }) => {
  const now = new Date();
  const currentPhase = ticket.pricePhases?.find((phase) => {
    const startDate = new Date(phase.startDate || "");
    const endDate = new Date(phase.endDate || "");
    return now >= startDate && now <= endDate;
  });
  const currentPrice = getCurrentPrice(ticket);
  const basePrice = ticket.ticketPrice ?? 0;

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`mb-4 rounded-2xl border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        }`}
    >
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          {/* Thông tin vé */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              {ticket.ticketName || 'Loại vé không xác định'}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              {ticket.ticketDescription || 'Mô tả không có'}
            </Text>
            <Text className="text-xs text-gray-500">
              Tổng số vé: {ticket.totalSlot ?? 'N/A'} | Còn lại: {ticket.availableSlot ?? 'N/A'}
            </Text>
            {ticket.isAuthor && (
              <Text className="text-xs text-emerald-600 mt-1 font-medium">
                Dành cho tác giả
              </Text>
            )}
          </View>

          {/* Phần giá */}
          <View className="ml-4 items-end">
            {/* Giá hiện tại */}
            <Text className="text-lg font-bold text-gray-900">
              {ticket.ticketPrice !== undefined ? `${currentPrice.toLocaleString('vi-VN')}₫` : 'Giá không xác định'}
            </Text>

            {/* Nếu có phase đang áp dụng và khác giá gốc */}
            {currentPhase && currentPrice !== basePrice && ticket.ticketPrice !== undefined && (
              <Text className="text-sm text-gray-500 line-through">
                {basePrice.toLocaleString('vi-VN')}₫
              </Text>
            )}

            {/* Tên phase */}
            {currentPhase ? (
              <Text className="text-xs text-blue-600 font-medium mt-1">
                {currentPhase.phaseName || 'Phase N/A'} ({currentPhase.applyPercent ?? 'N/A'}%)
              </Text>
            ) : (
              <Text className="text-xs text-gray-500 mt-1">Chưa có giai đoạn áp dụng</Text>
            )}
          </View>
        </View>

        {/* Thông tin phase chi tiết */}
        {currentPhase && (
          <View className="mb-3 p-3 bg-blue-50 rounded-lg">
            <Text className="text-sm font-medium text-blue-800 mb-1">
              Giai đoạn hiện tại: {currentPhase.phaseName || 'N/A'}
            </Text>
            {currentPhase.startDate && (
              <Text className="text-xs text-blue-600">
                Bắt đầu: {new Date(currentPhase.startDate).toLocaleDateString('vi-VN')}
              </Text>
            )}
            {currentPhase.endDate && (
              <Text className="text-xs text-blue-600">
                Kết thúc: {new Date(currentPhase.endDate).toLocaleDateString('vi-VN')}
              </Text>
            )}
            {currentPhase.totalSlot !== undefined && (
              <Text className="text-xs text-blue-600">
                Số vé phase: {currentPhase.totalSlot} | Còn lại: {currentPhase.availableSlot ?? 'N/A'}
              </Text>
            )}
          </View>
        )}

        {/* Radio Button */}
        <View className="flex-row items-center justify-end">
          <RadioButton
            value={ticket.conferencePriceId}
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={onSelect}
            color="#3B82F6"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const BuyTicketsButton: React.FC<{
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ onPress, disabled = false, loading = false }) => {
  return (
    <View className="px-4 pb-6">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`rounded-2xl overflow-hidden ${disabled || loading ? 'opacity-50' : ''}`}
      >
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="py-4 px-6"
        >
          <View className="flex-row items-center justify-center">
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white text-lg font-semibold ml-2">
                  Đang xử lý...
                </Text>
              </>
            ) : (
              <>
                <Text className="text-white text-lg font-semibold mr-2">
                  Đăng ký
                </Text>
                <Icon name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const TicketSelectionScreen: React.FC<TicketSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');

  // Get conferenceId from route params
  const conferenceId = route?.params?.conferenceId || '';

  // Get hooks
  const {
    purchaseTechTicket,
    loading: paymentLoading,
    techPaymentError,
    techPaymentResponse,
  } = useTransaction();

  const {
    technicalConference,
    technicalConferenceLoading,
    technicalConferenceError,
  } = useConference({ id: conferenceId });

  const getCurrentPrice = (price: ConferencePriceResponse) => {
    const basePrice = price.ticketPrice ?? 0;

    if (!price.pricePhases || price.pricePhases.length === 0) {
      return basePrice;
    }

    const now = new Date();
    const currentPhase = price.pricePhases.find(phase => {
      const startDate = new Date(phase.startDate || '');
      const endDate = new Date(phase.endDate || '');
      return now >= startDate && now <= endDate;
    });

    if (!currentPhase || !currentPhase.applyPercent) {
      return basePrice;
    }

    const finalPrice = Math.round(basePrice * (currentPhase.applyPercent / 100));
    return finalPrice;
  };

  // Use conference prices directly from TechnicalConferenceDetailResponse
  const ticketTypes: ConferencePriceResponse[] = technicalConference?.conferencePrices || [];

  // Set first ticket as default selection
  useEffect(() => {
    if (ticketTypes.length > 0 && !selectedTicketId) {
      setSelectedTicketId(ticketTypes[0].conferencePriceId);
    }
  }, [ticketTypes, selectedTicketId]);

  const handleBuyTickets = async () => {
    const selectedTicket = ticketTypes.find(ticket => ticket.conferencePriceId === selectedTicketId);

    if (!selectedTicket) {
      Alert.alert('Lỗi', 'Vui lòng chọn một loại vé');
      return;
    }

    try {
      const paymentRequest = {
        conferencePriceId: selectedTicket.conferencePriceId
      };

      const response = await purchaseTechTicket(paymentRequest);
      console.log(response);

      // Check if response contains payment URL
      if (response?.data && typeof response.data === 'string') {
        const paymentUrl = response.data;
        // const text = response.data;
        // const urlMatch = text.match(/https?:\/\/[^\s]+/);

        // if (!urlMatch) {
        //   Alert.alert('Lỗi', 'Không tìm thấy liên kết thanh toán trong dữ liệu');
        //   return;
        // }

        // const paymentUrl = urlMatch[0];

        console.log('url ne: ', paymentUrl);

        // Check if URL is valid
        const isValidUrl = paymentUrl.startsWith('http://') || paymentUrl.startsWith('https://');

        if (isValidUrl) {
          // Try to open payment URL
          const supported = await Linking.canOpenURL(paymentUrl);

          await openUrlDirectly(paymentUrl);

          // if (supported) {
          //   await Linking.openURL(paymentUrl);
          // } else {
          //   Alert.alert(
          //     'Lỗi',
          //     'Không thể mở liên kết thanh toán. Vui lòng sao chép liên kết và mở trong trình duyệt.',
          //     [
          //       { text: 'OK', style: 'default' },
          //       {
          //         text: 'Sao chép',
          //         onPress: () => {
          //           // Note: Would need to import Clipboard from @react-native-clipboard/clipboard
          //           Alert.alert('URL thanh toán', paymentUrl);
          //         }
          //       }
          //     ]
          //   );
          // }
        } else {
          Alert.alert('Lỗi', 'Liên kết thanh toán không hợp lệ');
        }
      } else {
        Alert.alert('Lỗi', 'Không nhận được liên kết thanh toán từ máy chủ');
      }

    } catch (error: any) {
      console.error('Purchase ticket error:', error);

      // Show retry option
      Alert.alert(
        'Lỗi thanh toán',
        techPaymentError?.data?.Message || 'Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Thử lại', onPress: handleBuyTickets }
        ]
      );
    }
  };

  const openUrlDirectly = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể mở liên kết thanh toán. Vui lòng sao chép và mở trong trình duyệt.',
        [
          { text: 'OK', style: 'default' },
          {
            text: 'Sao chép',
            onPress: () => Alert.alert('URL thanh toán', url),
          },
        ]
      );
    }
  };

  const handleRetryConference = () => {
    // Retry is handled automatically by the hook when component re-renders
    console.log('Retrying conference data fetch...');
  };

  return (
    // <View className="flex-1 bg-gray-50">
    <View className="flex-1 bg-black">
      {/* Header */}
      <Appbar.Header
        mode="center-aligned"
        style={{ backgroundColor: 'black', elevation: 0 }}
      >
        <Appbar.BackAction
          onPress={() => navigation?.goBack()}
          color="white"
        />
        <Appbar.Content
          title="Select ticket"
          titleStyle={{
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Appbar.Header>

      {/* <View
        style={{
          flex: 1,
          backgroundColor: '#F9FAFB',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          overflow: 'hidden', 
        }}
      > */}
      <View className="flex-1 rounded-t-3xl overflow-hidden">
        <LinearGradient
          // colors={['#FFFFFF', '#F3F4F6']} 
          colors={[
            // '#F9FAFB',
            '#D1D5DB',
            '#6B7280',
            '#111827',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // className="rounded-3xl p-6 shadow-sm"
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Conference Information Header */}
          {technicalConference && (
            <ConferenceHeader
              conference={technicalConference}
            />
          )}

          {/* Ticket Selection Section */}
          <View className="px-4 pb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Select ticket
            </Text>

            {/* Loading state for conference data */}
            {technicalConferenceLoading && !technicalConference ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#6B7280" />
                <Text className="text-gray-600 mt-2">Đang tải thông tin vé...</Text>
              </View>
            ) : technicalConferenceError && !technicalConference ? (
              <View className="items-center py-8">
                <Icon name="error-outline" size={48} color="#EF4444" />
                <Text className="text-gray-900 text-lg font-semibold mt-2">Có lỗi xảy ra</Text>
                <Text className="text-gray-600 text-center mt-1 mb-4">
                  {technicalConferenceError.data?.Message || 'Không thể tải thông tin hội nghị'}
                </Text>
                <TouchableOpacity
                  onPress={handleRetryConference}
                  className="bg-blue-500 rounded-xl px-6 py-3"
                >
                  <Text className="text-white font-semibold">Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : ticketTypes.length === 0 ? (
              <View className="items-center py-8">
                <Icon name="confirmation-number" size={48} color="#9CA3AF" />
                <Text className="text-gray-600 text-center mt-2">
                  Chưa có thông tin vé cho hội nghị này
                </Text>
              </View>
            ) : (
              /* Ticket Types */
              ticketTypes.map((ticket) => (
                <TicketTypeCard
                  key={ticket.conferencePriceId}
                  ticket={ticket}
                  isSelected={selectedTicketId === ticket.conferencePriceId}
                  onSelect={() => setSelectedTicketId(ticket.conferencePriceId)}
                />
              ))
            )}
          </View>

          <View className="flex-1" />

          {/* Buy Tickets Button */}
          {ticketTypes.length > 0 && (
            <BuyTicketsButton
              onPress={handleBuyTickets}
              disabled={!selectedTicketId || technicalConferenceLoading}
              loading={paymentLoading}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default TicketSelectionScreen;