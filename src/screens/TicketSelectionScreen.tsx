import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  RadioButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface TicketSelectionScreenProps {
  navigation?: any;
  route?: {
    params?: {
      conferenceData?: any;
    };
  };
}

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: string;
  priceRange?: string;
  benefits: string[];
}

// Reusable Components
const ConferenceHeader: React.FC<{
  title: string;
  image: string;
  date: string;
  venue: string;
  time: string;
}> = ({ title, image, date, venue, time }) => {
  const imageMap: Record<string, any> = {
    conf1: require('../assets/conf1.jpg'),
    conf2: require('../assets/conf2.jpg'),
    taylorswift: require('../assets/taylorswift.jpg'),
  };

  return (
    <View className="px-4 pb-6 mt-5">
      <View className="bg-white rounded-3xl p-6 shadow-sm">
        {/* Conference Logo/Icon */}
        <View
          className="items-center mb-4"
        // style={{ transform: [{ translateY: -50 }] }}
        >
          {/* <View className="items-center mb-4"> */}
          <View className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              source={imageMap[image]}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          {/* </View> */}
        </View>

        {/* Conference Title */}
        <Text className="text-xl font-bold text-gray-900 text-center mb-4">
          {title}
        </Text>

        {/* Date and Time */}
        <View className="flex-row items-center justify-center mb-2">
          <View className="w-2 h-2 rounded-full bg-gray-400 mr-3" />
          <Text className="text-base text-gray-700 font-medium">{date}</Text>
        </View>

        {/* Venue */}
        <Text className="text-sm text-blue-600 text-center mb-2">
          {venue}
        </Text>

        {/* Time */}
        <View className="flex-row items-center justify-center">
          <Icon name="access-time" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">{time}</Text>
        </View>
      </View>
    </View>
  );
};

const TicketTypeCard: React.FC<{
  ticket: TicketType;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ ticket, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`mb-4 rounded-2xl border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        }`}
    >
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              {ticket.name}
            </Text>
            <Text className="text-sm text-gray-600">
              {ticket.description}
            </Text>
          </View>

          <View className="ml-4 items-end">
            <Text className="text-lg font-bold text-gray-900">
              {ticket.priceRange || ticket.price}
            </Text>
            {ticket.priceRange && (
              <Text className="text-sm text-gray-500">each</Text>
            )}
          </View>
        </View>

        {/* Benefits */}
        {ticket.benefits.length > 0 && (
          <View className="mb-3">
            {ticket.benefits.map((benefit, index) => (
              <View key={index} className="flex-row items-center mb-1">
                <Icon name="check-circle" size={16} color="#10B981" />
                <Text className="text-sm text-gray-600 ml-2">{benefit}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Radio Button */}
        <View className="flex-row items-center justify-end">
          <RadioButton
            value={ticket.id}
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
}> = ({ onPress, disabled = false }) => {
  return (
    <View className="px-4 pb-6">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`rounded-2xl overflow-hidden ${disabled ? 'opacity-50' : ''}`}
      >
        <LinearGradient
          colors={['#8B5CF6', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="py-4 px-6"
        >
          <View className="flex-row items-center justify-center">
            <Text className="text-white text-lg font-semibold mr-2">
              Buy tickets
            </Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
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
  const [selectedTicketId, setSelectedTicketId] = useState<string>('standard');

  const conferenceData = route?.params?.conferenceData || {
    title: 'Hội thảo Khoa học Quốc tế về Trí tuệ Nhân tạo và Ứng dụng',
    shortTitle: 'AI & Applications Conference',
    date: '23. Nov. 2024',
    venue: 'Đại học FPT, TP. HCM',
    time: '8:00 - 17:30',
    image: 'conf1',
  };

  const ticketTypes: TicketType[] = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Quyền truy cập cơ bản vào hội thảo',
      price: '500.000₫',
      priceRange: '500.000₫-800.000₫',
      benefits: [
        'Tham dự tất cả các phiên chính',
        'Tài liệu hội thảo',
        'Coffee break',
        'Certificate tham dự'
      ],
    },
    {
      id: 'vip',
      name: 'VIP Access',
      description: 'Quyền truy cập cao cấp với nhiều ưu đãi',
      price: '1.200.000₫',
      benefits: [
        'Tất cả quyền lợi Standard',
        'Chỗ ngồi ưu tiên',
        'Networking lunch với speakers',
        'Túi quà cao cấp',
        'Q&A riêng với chuyên gia'
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Trải nghiệm hoàn hảo nhất',
      price: '2.000.000₫',
      priceRange: '2.000.000₫-2.500.000₫',
      benefits: [
        'Tất cả quyền lợi VIP',
        'Workshop riêng',
        'Meet & greet với speakers',
        'Dinner gala',
        'Chứng chỉ đặc biệt',
        'Hỗ trợ 1-1 consulting'
      ],
    },
  ];

  const handleBuyTickets = () => {
    const selectedTicket = ticketTypes.find(ticket => ticket.id === selectedTicketId);
    console.log('Selected ticket:', selectedTicket);

    // navigation?.navigate('PaymentScreen', { 
    //   ticket: selectedTicket, 
    //   conference: conferenceData 
    // });

    // For now, just show alert
    // alert(`Đã chọn vé: ${selectedTicket?.name} - ${selectedTicket?.price}`);
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
          <ConferenceHeader
            title={conferenceData.shortTitle}
            image={conferenceData.image}
            date={conferenceData.date}
            venue={conferenceData.venue}
            time={conferenceData.time}
          />

          {/* Ticket Selection Section */}
          <View className="px-4 pb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Select ticket
            </Text>

            {/* Ticket Types */}
            {ticketTypes.map((ticket) => (
              <TicketTypeCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onSelect={() => setSelectedTicketId(ticket.id)}
              />
            ))}
          </View>

          <View className="flex-1" />

          {/* Buy Tickets Button */}
          <BuyTicketsButton
            onPress={handleBuyTickets}
            disabled={!selectedTicketId}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default TicketSelectionScreen;