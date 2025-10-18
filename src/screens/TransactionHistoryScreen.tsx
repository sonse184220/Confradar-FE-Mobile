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

const { width: screenWidth } = Dimensions.get('window');

// Types
interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  time: string;
  avatar: string;
  transactionId: string;
  cardDetails: string;
  location: string;
  category: string;
}

interface TransactionHistoryScreenProps {
  navigation?: any;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Mickey Obama Jr.',
    amount: -450.00,
    type: 'expense',
    date: 'Today',
    time: '8:19 am',
    avatar: 'MO',
    transactionId: 'ABX049123182',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'Krupnicza 10, 31-123 Kraków',
    category: 'Conference'
  },
  {
    id: '2',
    name: 'X-treme Fitness',
    amount: -25.99,
    type: 'expense',
    date: 'Yesterday',
    time: '1:23 pm',
    avatar: 'XF',
    transactionId: 'ABX049123183',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'Fitness Center Downtown',
    category: 'Fitness'
  },
  {
    id: '3',
    name: 'Abysso Co.',
    amount: 7500.00,
    type: 'income',
    date: 'Monday',
    time: '9:28 am',
    avatar: 'AC',
    transactionId: 'ABX049123184',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'Business District',
    category: 'Income'
  },
  {
    id: '4',
    name: 'KFC',
    amount: -25.99,
    type: 'expense',
    date: 'Monday',
    time: '4:09 am',
    avatar: 'KF',
    transactionId: 'ABX049123185',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'KFC Restaurant',
    category: 'Food'
  },
  {
    id: '5',
    name: 'KFC',
    amount: -25.99,
    type: 'expense',
    date: 'Monday',
    time: '4:09 am',
    avatar: 'KF',
    transactionId: 'ABX049123186',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'KFC Restaurant',
    category: 'Food'
  },
  {
    id: '6',
    name: 'KFC',
    amount: -25.99,
    type: 'expense',
    date: 'Monday',
    time: '4:09 am',
    avatar: 'KF',
    transactionId: 'ABX049123187',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'KFC Restaurant',
    category: 'Food'
  },
  {
    id: '7',
    name: 'KFC',
    amount: -25.99,
    type: 'expense',
    date: 'Monday',
    time: '4:09 am',
    avatar: 'KF',
    transactionId: 'ABX049123188',
    cardDetails: 'Visa (Ending in 3920)',
    location: 'KFC Restaurant',
    category: 'Food'
  },
];

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
}) => (
  <View className="px-4 py-2">
    <TouchableOpacity onPress={onPress}
      // className="px-4 py-3"
      // className="bg-gray-50 rounded-2xl p-4"
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
    // className="bg-gray-100 rounded-2xl p-4 border border-gray-200"
    // style={{
    //   shadowColor: "#000",
    //   shadowOffset: { width: 0, height: 1 },
    //   shadowOpacity: 0.05,
    //   shadowRadius: 2,
    //   elevation: 1,
    // }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {/* Avatar */}
          <View className="w-12 h-12 rounded-full bg-gray-600 items-center justify-center mr-3">
            <Text className="text-white font-semibold text-sm">
              {transaction.avatar}
            </Text>
          </View>

          {/* Transaction Info */}
          <View className="flex-1">
            <Text className="text-white font-medium text-base">
              {transaction.name}
            </Text>
            <Text className="text-gray-400 text-sm">
              {transaction.date}, {transaction.time}
            </Text>
          </View>
        </View>

        {/* Amount and Arrow */}
        <View className="flex-row items-center">
          <Text
            className={`font-semibold text-base mr-2 ${transaction.type === 'income' ? 'text-green-400' : 'text-white'
              }`}
          >
            {transaction.type === 'income' ? '+' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
          </Text>
          <Icon
            name={transaction.type === 'income' ? 'trending-up' : 'trending-down'}
            size={20}
            color="#6B7280"
          />
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

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
                name={transaction.type === 'income' ? 'trending-up' : 'trending-down'}
                size={24}
                color="#10B981"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-white text-xl font-semibold">
                {transaction.name}
              </Text>
              <Text className="text-gray-400 text-sm">
                {transaction.date}, {transaction.time}
              </Text>
            </View>
            <Text className="font-bold text-2xl text-white">
              {transaction.type === 'income' ? '' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
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

            {/* Card Details */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Card Details</Text>
              <Text className="text-white font-medium text-base">
                {transaction.cardDetails}
              </Text>
            </View>

            {/* Place */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Place</Text>
              <Text className="text-white font-medium text-base">
                {transaction.location}
              </Text>
            </View>
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

  const filteredTransactions = mockTransactions.filter(transaction =>
    transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          // className="flex-1 bg-white"
          style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 8 }}
          showsVerticalScrollIndicator={true}
        >
          {filteredTransactions.map((transaction, index) => (
            <View key={transaction.id}>
              <TransactionItem
                transaction={transaction}
                onPress={() => handleTransactionPress(transaction)}
              />
              {index < filteredTransactions.length - 1 && (
                <View className="px-4">
                  <Divider style={{ backgroundColor: '#374151' }} />
                </View>
              )}
            </View>
          ))}
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