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
  Alert,
  Image,
} from 'react-native';
import {
  Appbar,
  Avatar,
  IconButton,
  Searchbar,
  Divider,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from '@react-native-community/blur';
import { useConference } from '../hooks/useConference';
import { FavouriteConferenceDetailResponse } from '../types/conference.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface FavoriteConferencesScreenProps {
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
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

const formatTime = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getAvatarInitials = (conferenceName?: string): string => {
  if (conferenceName) {
    const words = conferenceName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return conferenceName.slice(0, 2).toUpperCase();
  }
  return 'CF';
};

const filterTabs = ['Date', 'Name', 'Type', 'Status'];

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

const ConferenceItem = ({
  conference,
  onPress,
  onRemoveFavorite
}: {
  conference: FavouriteConferenceDetailResponse;
  onPress: () => void;
  onRemoveFavorite: () => void;
}) => {
  const conferenceName = conference.conferenceName || 'Unknown Conference';
  const avatarInitials = getAvatarInitials(conference.conferenceName);
  const formattedStartDate = formatDate(conference.conferenceStartDate);
  const formattedEndDate = formatDate(conference.conferenceEndDate);
  const isResearch = conference.isResearchConference;

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
            {/* Conference Image or Avatar */}
            {conference.bannerImageUrl ? (
              <Image
                source={{ uri: conference.bannerImageUrl }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 12,
                }}
                resizeMode="cover"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-600 items-center justify-center mr-3">
                <Text className="text-white font-semibold text-sm">
                  {avatarInitials}
                </Text>
              </View>
            )}

            {/* Conference Info */}
            <View className="flex-1">
              <Text className="text-white font-medium text-base" numberOfLines={2}>
                {conferenceName}
              </Text>
              <View className="flex-row items-center mt-1 mb-2">
                <Icon name="event" size={14} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-1">
                  {formattedStartDate} - {formattedEndDate}
                </Text>
              </View>
              <Chip
                mode="flat"
                style={{ 
                  backgroundColor: isResearch ? '#EF4444' : '#3B82F6', 
                  alignSelf: 'flex-start',
                  height: 24,
                }}
                textStyle={{ color: 'white', fontSize: 10 }}
              >
                {isResearch ? 'Research' : 'Technical'}
              </Chip>
            </View>
          </View>

          {/* Remove Favorite Button */}
          <TouchableOpacity 
            onPress={onRemoveFavorite}
            className="ml-2 p-2"
          >
            <Icon
              name="favorite"
              size={24}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>

        {/* Available Slots */}
        {conference.availableSlot !== undefined && (
          <View className="mt-3 pt-3 border-t border-gray-600">
            <View className="flex-row items-center">
              <Icon name="people" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-1">
                {conference.availableSlot} slots available
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ConferenceDetailModal = ({ 
  visible, 
  conference, 
  onClose,
  onNavigateToDetail
}: { 
  visible: boolean; 
  conference: FavouriteConferenceDetailResponse | null; 
  onClose: () => void;
  onNavigateToDetail: () => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [visible, conference]);

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

  if (!conference) return null;

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
            Conference Details
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
          {/* Main Conference Info */}
          <View className="flex-row items-center mb-6 bg-gray-800/50 rounded-2xl p-4">
            {conference.bannerImageUrl ? (
              <Image
                source={{ uri: conference.bannerImageUrl }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  marginRight: 16,
                }}
                resizeMode="cover"
              />
            ) : (
              <View className="w-15 h-15 rounded-full bg-gray-700 items-center justify-center mr-4">
                <Icon
                  name="event"
                  size={30}
                  color="#10B981"
                />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-white text-xl font-semibold" numberOfLines={2}>
                {conference.conferenceName}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Added to favorites: {formatDate(conference.favouriteCreatedAt)}
              </Text>
            </View>
          </View>

          {/* View Full Details Button */}
          <TouchableOpacity 
            onPress={onNavigateToDetail}
            className="bg-blue-600 rounded-2xl p-4 mb-6 flex-row items-center justify-center"
          >
            <Icon name="visibility" size={20} color="#FFFFFF" />
            <Text className="text-white font-medium ml-2">
              View Full Conference Details
            </Text>
          </TouchableOpacity>

          {/* Conference Details */}
          <View className="pb-6">
            {/* Conference ID */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Conference ID</Text>
              <Text className="text-white font-medium text-base">
                {conference.conferenceId}
              </Text>
            </View>

            {/* Description */}
            {conference.conferenceDescription && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Description</Text>
                <Text className="text-white font-medium text-base">
                  {conference.conferenceDescription}
                </Text>
              </View>
            )}

            {/* Conference Dates */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Conference Dates</Text>
              <Text className="text-white font-medium text-base">
                {formatDate(conference.conferenceStartDate)} - {formatDate(conference.conferenceEndDate)}
              </Text>
            </View>

            {/* Ticket Sale Period */}
            {conference.ticketSaleStart && conference.ticketSaleEnd && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Ticket Sale Period</Text>
                <Text className="text-white font-medium text-base">
                  {formatDate(conference.ticketSaleStart)} - {formatDate(conference.ticketSaleEnd)}
                </Text>
              </View>
            )}

            {/* Conference Type */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Conference Type</Text>
              <Text className="text-white font-medium text-base">
                {conference.isResearchConference ? 'Research Conference' : 'Technical Conference'}
              </Text>
            </View>

            {/* Hosting Type */}
            <View className="mb-5">
              <Text className="text-gray-500 text-xs mb-1.5">Hosting Type</Text>
              <Text className="text-white font-medium text-base">
                {conference.isInternalHosted ? 'Internal Hosted' : 'External Hosted'}
              </Text>
            </View>

            {/* Available Slots */}
            {conference.availableSlot !== undefined && (
              <View className="mb-5">
                <Text className="text-gray-500 text-xs mb-1.5">Available Slots</Text>
                <Text className="text-white font-medium text-base">
                  {conference.availableSlot} slots remaining
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
const FavoriteConferencesScreen: React.FC<FavoriteConferencesScreenProps> = ({
  navigation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Date');
  const [selectedConference, setSelectedConference] = useState<FavouriteConferenceDetailResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigationTo = useNavigation<NavigationProp>();

  // Use conference hook to get favorite conferences
  const { 
    favouriteConferencesData, 
    favouriteConferencesLoading, 
    favouriteConferencesError,
    refetchFavouriteConferences,
    removeFavourite,
    deletingFromFavourite,
    deleteFromFavouriteError
  } = useConference();

  const favoriteConferences = favouriteConferencesData?.data || [];

  // Filter and sort conferences
  const filteredAndSortedConferences = useMemo(() => {
    let filtered = favoriteConferences.filter(conference => {
      const conferenceName = conference.conferenceName || '';
      const conferenceDescription = conference.conferenceDescription || '';
      
      return conferenceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conferenceDescription.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Sort based on active filter
    switch (activeFilter) {
      case 'Date':
        return filtered.sort((a, b) => {
          const dateA = new Date(a.conferenceStartDate || 0).getTime();
          const dateB = new Date(b.conferenceStartDate || 0).getTime();
          return dateB - dateA; // Latest first
        });
      case 'Name':
        return filtered.sort((a, b) => {
          const nameA = a.conferenceName || '';
          const nameB = b.conferenceName || '';
          return nameA.localeCompare(nameB);
        });
      case 'Type':
        return filtered.sort((a, b) => {
          const typeA = a.isResearchConference ? 'Research' : 'Technical';
          const typeB = b.isResearchConference ? 'Research' : 'Technical';
          return typeA.localeCompare(typeB);
        });
      case 'Status':
        return filtered.sort((a, b) => {
          const statusA = a.isInternalHosted ? 'Internal' : 'External';
          const statusB = b.isInternalHosted ? 'Internal' : 'External';
          return statusA.localeCompare(statusB);
        });
      default:
        return filtered;
    }
  }, [favoriteConferences, searchQuery, activeFilter]);

  const handleConferencePress = (conference: FavouriteConferenceDetailResponse) => {
    console.log('Conference clicked:', conference);
    setSelectedConference(conference);
    setModalVisible(true);
  };

  const handleRemoveFavorite = async (conference: FavouriteConferenceDetailResponse) => {
    try {
      Alert.alert(
        'Xác nhận',
        `Bạn có chắc muốn xóa "${conference.conferenceName}" khỏi danh sách yêu thích?`,
        [
          { text: 'Hủy', style: 'cancel' },
          { 
            text: 'Xóa', 
            style: 'destructive',
            onPress: async () => {
              try {
                await removeFavourite(conference.conferenceId);
                refetchFavouriteConferences();
                Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích');
              } catch (error) {
                console.error('Remove favorite error:', error);
                Alert.alert('Lỗi', deleteFromFavouriteError?.data?.Message || 'Có lỗi xảy ra khi xóa khỏi danh sách yêu thích');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Remove favorite error:', error);
    }
  };

  const handleNavigateToDetail = () => {
    if (selectedConference) {
      setModalVisible(false);
      setSelectedConference(null);
      navigationTo.navigate('ConferenceDetail', {
        conferenceId: selectedConference.conferenceId,
        type: selectedConference.isResearchConference ? 'research' : 'technical'
      });
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setModalVisible(false);
    setSelectedConference(null);
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
              title="Favorite Conferences"
              titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
            />
            <Appbar.Action
              icon="refresh"
              iconColor="#FFFFFF"
              onPress={refetchFavouriteConferences}
              disabled={favouriteConferencesLoading}
            />
          </Appbar.Header>

          {/* Search Bar with Filter Icon */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center">
              <View className="flex-1 mr-3">
                <Searchbar
                  placeholder="Search conferences..."
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

        {/* Conferences List */}
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 8 }}
          showsVerticalScrollIndicator={true}
        >
          {favouriteConferencesLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-white text-base mt-4">Loading favorite conferences...</Text>
            </View>
          ) : favouriteConferencesError ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-red-400 text-base text-center px-4 mb-4">
                {favouriteConferencesError.data?.Message || 'Có lỗi xảy ra khi tải danh sách yêu thích'}
              </Text>
              <TouchableOpacity
                onPress={refetchFavouriteConferences}
                className="bg-blue-600 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-medium">Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : filteredAndSortedConferences.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Icon name="favorite-border" size={64} color="#6B7280" />
              <Text className="text-gray-400 text-base mt-4">No favorite conferences found</Text>
              <Text className="text-gray-500 text-sm mt-2 text-center px-8">
                Add conferences to your favorites to see them here
              </Text>
            </View>
          ) : (
            filteredAndSortedConferences.map((conference, index) => (
              <View key={conference.conferenceId}>
                <ConferenceItem
                  conference={conference}
                  onPress={() => handleConferencePress(conference)}
                  onRemoveFavorite={() => handleRemoveFavorite(conference)}
                />
                {index < filteredAndSortedConferences.length - 1 && (
                  <View className="px-4">
                    <Divider style={{ backgroundColor: '#374151' }} />
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Conference Detail Modal */}
        <ConferenceDetailModal
          visible={modalVisible}
          conference={selectedConference}
          onClose={handleCloseModal}
          onNavigateToDetail={handleNavigateToDetail}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default FavoriteConferencesScreen;