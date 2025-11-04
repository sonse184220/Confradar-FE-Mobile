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
import { useTransaction } from '../hooks/useTransaction';

const { width: screenWidth } = Dimensions.get('window');

// Types - Updated to match API response
interface Transaction {
  transactionId: string;
  userId?: string;
  currency?: string;
  amount?: number;
  transactionCode?: string;
  createdAt?: string;
  transactionStatusId?: string;
  transactionTypeId?: string;
  paymentMethodId?: string;
  PaymentStatusName?: string;
  PaymentMethodName?: string;
}

interface TransactionHistoryScreenProps {
  navigation?: any;
}

// Helper functions for API data
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

const getAvatarInitials = (transactionCode?: string, paymentMethod?: string): string => {
  if (transactionCode) {
    return transactionCode.slice(0, 2).toUpperCase();
  }
  if (paymentMethod) {
    return paymentMethod.slice(0, 2).toUpperCase();
  }
  return 'TX';
};

const getTransactionName = (transaction: Transaction): string => {
  return transaction.PaymentMethodName || transaction.transactionCode || 'Transaction';
};

const filterTabs = ['Period', 'Amount', 'Type', 'Product'];

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
            className={`flex-1 py-3 px-2 rounded-xl ${activeFilter === tab ? 'bg-green-400' : ''
              }`}
          >
            <Text
              className={`text-center text-sm font-medium ${activeFilter === tab ? 'text-black' : 'text-white'
                }`}
              numberOfLines={1}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  </View>
);

const TransactionItem = ({
  transaction,
  onPress
}: {
  transaction: Transaction;
  onPress: () => void;
}) => {
  const transactionName = getTransactionName(transaction);
  const avatarInitials = getAvatarInitials(transaction.transactionCode, transaction.PaymentMethodName);
  const formattedDate = formatDate(transaction.createdAt);
  const formattedTime = formatTime(transaction.createdAt);
  const amount = transaction.amount || 0;
  const isPositive = amount > 0;

  return (
    <View className="px-4 py-2">
      <TouchableOpacity onPress={onPress}
        style={{
          backgroundColor: '#1F2937',
          borderColor: '#374151',
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 16,
          marginVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Avatar */}
            <View className="w-12 h-12 rounded-full bg-gray-600 items-center justify-center mr-3">
              <Text className="text-white font-semibold text-sm">
                {avatarInitials}
              </Text>
            </View>

            {/* Transaction Info */}
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {transactionName}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formattedDate}, {formattedTime}
              </Text>
            </View>
          </View>

          {/* Amount and Arrow */}
          <View className="flex-row items-center">
            <Text
              className={`font-semibold text-base mr-2 ${isPositive ? 'text-green-400' : 'text-white'}`}
            >
              {isPositive ? '+' : ''} ${amount.toFixed(2)}
            </Text>
            <Icon
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={20}
              color="#6B7280"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const TransactionDetailModal = ({ visible, transaction, onClose }: { visible: boolean; transaction: Transaction | null; onClose: () => void }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible, transaction]);

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
      // <BottomSheetBackdrop
      //   {...props}
      //   disappearsOnIndex={-1}
      //   appearsOnIndex={0}
      //   opacity={0.5}
      //   pressBehavior="close"
      // />
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
      // backdropComponent={(props) => (
      //   <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      // )}

      backgroundStyle={{
        backgroundColor: 'rgba(31, 41, 55, 0.98)',
      }}
      handleIndicatorStyle={{
        backgroundColor: '#6B7280',
        width: 40,
        height: 4,
      }}
      // backgroundStyle={{ backgroundColor: '#1F2937' }}
      // handleIndicatorStyle={{ backgroundColor: '#6B7280' }}
      onClose={onClose}
    // onChange={(idx) => {
    //   console.log('BottomSheet index:', idx);
    //   if (idx === -1) onClose();
    // }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
          <Text className="text-white text-lg font-semibold">
            Transaction Details
          </Text>
          <TouchableOpacity
            onPress={() => {
              sheetRef.current?.close(); // trigger animation
            }}
            className="w-8 h-8 items-center justify-center"
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 items-center justify-center"
          >
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Transaction Info */}
          <View className="flex-row items-center mb-6 bg-gray-800/50 rounded-2xl p-4">
            <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center">
              <Icon
                name={(transaction.amount || 0) > 0 ? 'trending-up' : 'trending-down'}
                size={24}
                color="#10B981"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-semibold">
                {getTransactionName(transaction)}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatDate(transaction.createdAt)}, {formatTime(transaction.createdAt)}
              </Text>
            </View>
            <Text className="font-bold text-2xl text-white">
              ${(transaction.amount || 0).toFixed(2)}
            </Text>
          </View>

          {/* Download Confirmation Button */}
          <TouchableOpacity className="bg-gray-800/80 rounded-2xl p-4 mb-6 flex-row items-center justify-center">
            <Icon name="file-download" size={20} color="#FFFFFF" />
            <Text className="text-white font-medium ml-2">
              Download Confirmation
            </Text>
          </TouchableOpacity>

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
            {transaction.PaymentMethodName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Payment Method</Text>
                <Text className="text-white font-medium text-base">
                  {transaction.PaymentMethodName}
                </Text>
              </View>
            )}

            {/* Payment Status */}
            {transaction.PaymentStatusName && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Payment Status</Text>
                <Text className="text-white font-medium text-base">
                  {transaction.PaymentStatusName}
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
          </View>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

// Main Component
const TransactionHistoryScreen: React.FC<TransactionHistoryScreenProps> = ({
  navigation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Period');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Use transaction hook
  const { transactions, loading, transactionsError } = useTransaction();

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const transactionName = getTransactionName(transaction);
      const transactionCode = transaction.transactionCode || '';
      const paymentMethod = transaction.PaymentMethodName || '';

      return transactionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transactionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Sort based on active filter
    switch (activeFilter) {
      case 'Period':
        return filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Latest first
        });
      case 'Amount':
        return filtered.sort((a, b) => {
          const amountA = Math.abs(a.amount || 0);
          const amountB = Math.abs(b.amount || 0);
          return amountB - amountA; // Highest amount first
        });
      case 'Type':
        return filtered.sort((a, b) => {
          const statusA = a.PaymentStatusName || '';
          const statusB = b.PaymentStatusName || '';
          return statusA.localeCompare(statusB);
        });
      case 'Product':
        return filtered.sort((a, b) => {
          const methodA = a.PaymentMethodName || '';
          const methodB = b.PaymentMethodName || '';
          return methodA.localeCompare(methodB);
        });
      default:
        return filtered;
    }
  }, [transactions, searchQuery, activeFilter]);

  const handleTransactionPress = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction);
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-600">
        <View className="bg-black">
          {/* Header */}
          <Appbar.Header
            mode="center-aligned"
            style={{ backgroundColor: 'transparent', elevation: 0 }}
          >
            <Appbar.BackAction onPress={() => navigation?.goBack()} color="#FFFFFF" />
            <Appbar.Content
              title="Transaction history"
              titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
          </Appbar.Header>

          {/* Search Bar with Filter Icon */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center">
              <View className="flex-1 mr-3">
                <Searchbar
                  placeholder="Search transactions..."
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={{
                    backgroundColor: '#374151',
                    borderRadius: 16,
                  }}
                  inputStyle={{ color: '#FFFFFF' }}
                  placeholderTextColor="#9CA3AF"
                  iconColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity className="w-12 h-12 bg-green-400 rounded-full items-center justify-center">
                <Icon name="tune" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Tabs */}
          <FilterTabsSection
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </View>

        {/* Transactions List */}
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 8 }}
          showsVerticalScrollIndicator={true}
        >
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-white text-base">Loading transactions...</Text>
            </View>
          ) : transactionsError ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-red-400 text-base text-center px-4">
                {transactionsError.data?.Message}
              </Text>
            </View>
          ) : filteredAndSortedTransactions.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-400 text-base">No transactions found</Text>
            </View>
          ) : (
            filteredAndSortedTransactions.map((transaction, index) => (
              <View key={transaction.transactionId}>
                <TransactionItem
                  transaction={transaction}
                  onPress={() => handleTransactionPress(transaction)}
                />
                {index < filteredAndSortedTransactions.length - 1 && (
                  <View className="px-4">
                    <Divider style={{ backgroundColor: '#374151' }} />
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Transaction Detail Modal */}

        <TransactionDetailModal
          visible={modalVisible}
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TransactionHistoryScreen;