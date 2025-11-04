import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Appbar,
  Avatar,
  IconButton,
  Searchbar,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from '@react-native-community/blur';
import { useTicket } from '../hooks/useTicket';
import { CustomerPaidTicketResponse, CustomerTransactionDetailResponse, CustomerCheckInDetailResponse } from '../types/ticket.type';

const { width: screenWidth } = Dimensions.get('window');

interface TicketConferenceScreenProps {
  navigation?: any;
}

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) {
    return 'Today';
  } else if (date >= yesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

const formatTime = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price?: number): string => {
  if (!price) return 'Miễn phí';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'Chưa xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const getTicketInitials = (ticketId: string): string => {
  return ticketId.slice(-2).toUpperCase();
};

const filterTabs = ['All', 'Confirmed', 'Refunded', 'Recent'];

// Filter Tabs Component
const FilterTabsSection = ({
  activeFilter,
  onFilterChange
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) => (
  <View className="px-4 mb-4">
    <View className="bg-gray-800 rounded-2xl p-1">
      <View className="flex-row">
        {filterTabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onFilterChange(tab)}
            className={`flex-1 py-3 px-4 rounded-xl ${activeFilter === tab
              ? 'bg-white'
              : 'bg-transparent'
              }`}
          >
            <Text
              className={`text-center font-medium ${activeFilter === tab
                ? 'text-gray-900'
                : 'text-gray-400'
                }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

// Transaction Detail Modal Component
const TransactionDetailModal = ({
  transaction,
  visible,
  onClose
}: {
  transaction: CustomerTransactionDetailResponse | null;
  visible: boolean;
  onClose: () => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={props.onPress}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.3)"
        />
      </TouchableOpacity>
    ),
    []
  );

  if (!transaction) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: 'rgba(31, 41, 55, 0.98)',
      }}
      handleIndicatorStyle={{
        backgroundColor: '#6B7280',
        width: 40,
        height: 4,
      }}
      onClose={onClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Text className="text-white text-lg font-semibold">
            Transaction Details
          </Text>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
            }}
            className="w-8 h-8 items-center justify-center"
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Transaction Info */}
          <View className="flex-row items-center mb-6 bg-gray-800/50 rounded-2xl p-4">
            <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center">
              <Icon
                name="payment"
                size={24}
                color="#10B981"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-semibold">
                {transaction.paymentMethodName || 'Payment'}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatDateTime(transaction.createdAt)}
              </Text>
            </View>
            <Text className="font-bold text-2xl text-white">
              {formatPrice(transaction.amount)}
            </Text>
          </View>

          {/* Transaction Details */}
          <View className="pb-6">
            {/* Transaction ID */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Transaction ID</Text>
              <Text className="text-white font-medium text-base">
                {transaction.transactionId}
              </Text>
            </View>

            {/* Transaction Code */}
            {transaction.transactionCode && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Transaction Code</Text>
                <Text className="text-white font-medium text-base">
                  {transaction.transactionCode}
                </Text>
              </View>
            )}

            {/* Payment Method */}
            {transaction.paymentMethodName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Payment Method</Text>
                <Text className="text-white font-medium text-base">
                  {transaction.paymentMethodName}
                </Text>
              </View>
            )}

            {/* Currency */}
            {transaction.currency && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Currency</Text>
                <Text className="text-white font-medium text-base">
                  {transaction.currency}
                </Text>
              </View>
            )}

            {/* Status */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Status</Text>
              <View className="flex-row items-center">
                <View className={`px-3 py-1 rounded-full ${transaction.isRefunded ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  <Text className={`text-sm font-medium ${transaction.isRefunded ? 'text-red-400' : 'text-green-400'}`}>
                    {transaction.isRefunded ? 'Refunded' : 'Completed'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

// Check-in Detail Modal Component
const CheckInDetailModal = ({
  checkIn,
  visible,
  onClose
}: {
  checkIn: CustomerCheckInDetailResponse | null;
  visible: boolean;
  onClose: () => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={props.onPress}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.3)"
        />
      </TouchableOpacity>
    ),
    []
  );

  if (!checkIn) return null;

  return (
    <BottomSheet
      ref={sheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: 'rgba(31, 41, 55, 0.98)',
      }}
      handleIndicatorStyle={{
        backgroundColor: '#6B7280',
        width: 40,
        height: 4,
      }}
      onClose={onClose}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Text className="text-white text-lg font-semibold">
            Check-in Details
          </Text>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close();
            }}
            className="w-8 h-8 items-center justify-center"
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Check-in Info */}
          <View className="mb-6 bg-gray-800/50 rounded-2xl p-4">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <Text className="text-white text-xl font-semibold mb-2">
                  {checkIn.conferenceSessionDetail?.title || 'Session'}
                </Text>
                {checkIn.conferenceSessionDetail?.description && (
                  <Text className="text-gray-400 text-sm mb-2">
                    {checkIn.conferenceSessionDetail.description}
                  </Text>
                )}
              </View>
              <View className="ml-3">
                <View className={`px-3 py-1 rounded-full bg-green-500/20`}>
                  <Text className="text-green-400 text-sm font-medium">
                    {checkIn.checkinStatusName || 'Checked In'}
                  </Text>
                </View>
                {checkIn.isPresenter && (
                  <View className="px-3 py-1 rounded-full bg-purple-500/20 mt-2">
                    <Text className="text-purple-400 text-sm font-medium">
                      Presenter
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Check-in Details */}
          <View className="pb-6">
            {/* Check-in Time */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Check-in Time</Text>
              <Text className="text-white font-medium text-base">
                {formatDateTime(checkIn.checkInTime)}
              </Text>
            </View>

            {/* Session Date */}
            {checkIn.conferenceSessionDetail?.sessionDate && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Session Date</Text>
                <Text className="text-white font-medium text-base">
                  {formatDate(checkIn.conferenceSessionDetail.sessionDate)}
                </Text>
              </View>
            )}

            {/* Conference */}
            {checkIn.conferenceSessionDetail?.conferenceName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Conference</Text>
                <Text className="text-white font-medium text-base">
                  {checkIn.conferenceSessionDetail.conferenceName}
                </Text>
              </View>
            )}

            {/* Room */}
            {checkIn.conferenceSessionDetail?.roomDisplayName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Room</Text>
                <Text className="text-white font-medium text-base">
                  {checkIn.conferenceSessionDetail.roomDisplayName}
                </Text>
              </View>
            )}

            {/* Location */}
            {checkIn.conferenceSessionDetail?.destinationName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Location</Text>
                <Text className="text-white font-medium text-base">
                  {checkIn.conferenceSessionDetail.destinationName}
                  {checkIn.conferenceSessionDetail.cityName && `, ${checkIn.conferenceSessionDetail.cityName}`}
                </Text>
                {(checkIn.conferenceSessionDetail.street || checkIn.conferenceSessionDetail.district) && (
                  <Text className="text-gray-400 text-sm mt-1">
                    {[checkIn.conferenceSessionDetail.street, checkIn.conferenceSessionDetail.district].filter(Boolean).join(', ')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

// Main TicketConferenceScreen Component
const TicketConferenceScreen: React.FC<TicketConferenceScreenProps> = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<CustomerTransactionDetailResponse | null>(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState<CustomerCheckInDetailResponse | null>(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);

  const { tickets, loading, ticketsError, refetchTickets } = useTicket();

  useEffect(() => {
    refetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    switch (activeFilter) {
      case 'Confirmed':
        filtered = filtered.filter(ticket => !ticket.isRefunded);
        break;
      case 'Refunded':
        filtered = filtered.filter(ticket => ticket.isRefunded);
        break;
      case 'Recent':
        filtered = filtered.sort((a, b) =>
          new Date(b.registeredDate || 0).getTime() - new Date(a.registeredDate || 0).getTime()
        );
        break;
    }

    return filtered;
  }, [tickets, searchQuery, activeFilter]);

  const toggleExpand = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  const handleTransactionPress = (transaction: CustomerTransactionDetailResponse) => {
    setSelectedTransaction(transaction);
    setTransactionModalVisible(true);
  };

  const handleCheckInPress = (checkIn: CustomerCheckInDetailResponse) => {
    setSelectedCheckIn(checkIn);
    setCheckInModalVisible(true);
  };

  const renderTransactionItem = ({ item }: { item: CustomerTransactionDetailResponse }) => (
    <TouchableOpacity
      onPress={() => handleTransactionPress(item)}
      className="bg-gray-800 rounded-2xl p-4 mr-3 border border-gray-600"
      style={{ 
        width: 250,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-400 text-sm">
          {item.transactionCode || 'N/A'}
        </Text>
        <Text className="text-green-400 font-semibold">
          {formatPrice(item.amount)}
        </Text>
      </View>
      <Text className="text-gray-500 text-xs mb-1">
        {formatDateTime(item.createdAt)}
      </Text>
      <Text className="text-gray-400 text-xs">
        {item.paymentMethodName || 'Unknown method'}
      </Text>
      <View className={`mt-2 px-2 py-1 rounded-full self-start ${item.isRefunded ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
        <Text className={`text-xs ${item.isRefunded ? 'text-red-400' : 'text-green-400'}`}>
          {item.isRefunded ? 'Refunded' : 'Completed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCheckInItem = ({ item }: { item: CustomerCheckInDetailResponse }) => (
    <TouchableOpacity
      onPress={() => handleCheckInPress(item)}
      className="bg-gray-800 rounded-2xl p-4 mr-3 border border-gray-600"
      style={{ 
        width: 280,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Text className="text-white font-medium mb-1" numberOfLines={2}>
        {item.conferenceSessionDetail?.title || 'Session'}
      </Text>
      <Text className="text-gray-400 text-xs mb-2">
        {formatDateTime(item.checkInTime)}
      </Text>
      {item.conferenceSessionDetail?.conferenceName && (
        <Text className="text-gray-500 text-xs mb-2" numberOfLines={1}>
          {item.conferenceSessionDetail.conferenceName}
        </Text>
      )}
      <View className="flex-row items-center justify-between">
        <View className="px-2 py-1 rounded-full bg-green-500/20">
          <Text className="text-green-400 text-xs">
            {item.checkinStatusName || 'Checked In'}
          </Text>
        </View>
        {item.isPresenter && (
          <View className="px-2 py-1 rounded-full bg-purple-500/20">
            <Text className="text-purple-400 text-xs">Presenter</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTicketItem = ({ item: ticket }: { item: CustomerPaidTicketResponse }) => (
    <View className="bg-gray-800 rounded-2xl mb-4 mx-4 overflow-hidden">
      {/* Main ticket info */}
      <View className="p-4">
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mr-3">
            <Text className="text-white font-bold">
              {getTicketInitials(ticket.ticketId)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              Ticket #{ticket.ticketId.slice(-8)}
            </Text>
            <Text className="text-gray-400 text-sm">
              {formatDate(ticket.registeredDate)} • {formatPrice(ticket.actualPrice)}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${ticket.isRefunded ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            <Text className={`text-sm font-medium ${ticket.isRefunded ? 'text-red-400' : 'text-green-400'}`}>
              {ticket.isRefunded ? 'Refunded' : 'Confirmed'}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row">
            <TouchableOpacity className="bg-gray-700 rounded-xl px-4 py-2 mr-2">
              <Text className="text-white text-sm font-medium">QR Code</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-700 rounded-xl px-4 py-2">
              <Text className="text-white text-sm font-medium">Download</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => toggleExpand(ticket.ticketId)}
            className="bg-gray-700 rounded-xl px-4 py-2"
          >
            <Text className="text-white text-sm font-medium">
              {expandedTicketId === ticket.ticketId ? 'Collapse' : 'Details'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded details */}
      {expandedTicketId === ticket.ticketId && (
        <View className="border-t border-gray-700 p-4">
          {/* Transactions section */}
          {ticket.transactions && ticket.transactions.length > 0 && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-semibold">
                  Transactions ({ticket.transactions.length})
                </Text>
                <Icon name="payment" size={20} color="#10B981" />
              </View>
              <FlatList
                horizontal
                data={ticket.transactions}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.transactionId}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
          )}

          {/* Check-ins section */}
          {ticket.userCheckIns && ticket.userCheckIns.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-semibold">
                  Check-ins ({ticket.userCheckIns.length})
                </Text>
                <Icon name="check-circle" size={20} color="#10B981" />
              </View>
              <FlatList
                horizontal
                data={ticket.userCheckIns}
                renderItem={renderCheckInItem}
                keyExtractor={(item) => item.userCheckinId}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4">Loading tickets...</Text>
      </View>
    );
  }

  if (ticketsError) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center px-4">
        <Icon name="error" size={48} color="#EF4444" />
        <Text className="text-white text-lg font-semibold mt-4 text-center">
          Error loading tickets
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          {ticketsError.data?.Message}
        </Text>
        <TouchableOpacity
          onPress={refetchTickets}
          className="bg-white rounded-xl px-6 py-3 mt-6"
        >
          <Text className="text-gray-900 font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <Appbar.Header mode='center-aligned' className="bg-gray-900 elevation-0" style={{ backgroundColor: '#111827', elevation: 0 }}>
          <Appbar.BackAction onPress={() => navigation?.goBack()} iconColor="#FFFFFF" />
          <Appbar.Content title="My Tickets" titleStyle={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }} />
        </Appbar.Header>

        {/* Search */}
        <View className="px-4 m-4">
          <Searchbar
            placeholder="Search tickets..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ backgroundColor: '#374151' }}
            inputStyle={{ color: '#FFFFFF' }}
            iconColor="#9CA3AF"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Filter Tabs */}
        <FilterTabsSection
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <Icon name="confirmation-number" size={64} color="#6B7280" />
            <Text className="text-gray-400 text-lg font-semibold mt-4">
              No tickets found
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              {searchQuery ? 'Try adjusting your search' : 'Purchase tickets to see them here'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTickets}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item.ticketId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          visible={transactionModalVisible}
          onClose={() => {
            setTransactionModalVisible(false);
            setSelectedTransaction(null);
          }}
        />

        {/* Check-in Detail Modal */}
        <CheckInDetailModal
          checkIn={selectedCheckIn}
          visible={checkInModalVisible}
          onClose={() => {
            setCheckInModalVisible(false);
            setSelectedCheckIn(null);
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TicketConferenceScreen;