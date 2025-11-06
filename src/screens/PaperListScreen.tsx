import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Appbar,
  Avatar,
  IconButton,
  Searchbar,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePaperCustomer } from '../hooks/usePaperCustomer';
import { PaperCustomer } from '../types/paper.type';

const { width } = Dimensions.get('window');

interface PaperListScreenProps {
  navigation: any;
}

// Paper Status Badge Component
const PaperStatusBadge: React.FC<{ phaseId?: string; phaseName?: string }> = ({ 
  phaseId, 
  phaseName 
}) => {
  const getStatusColor = (phaseId?: string) => {
    switch (phaseId) {
      case '1': return '#10B981'; // Abstract - green
      case '2': return '#F59E0B'; // Full Paper - yellow
      case '3': return '#EF4444'; // Revision - red
      case '4': return '#8B5CF6'; // Camera Ready - purple
      default: return '#6B7280'; // Default - gray
    }
  };

  return (
    <View 
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: `${getStatusColor(phaseId)}20` }}
    >
      <Text 
        className="text-xs font-medium"
        style={{ color: getStatusColor(phaseId) }}
      >
        {phaseName || 'Chưa xác định'}
      </Text>
    </View>
  );
};

// Paper Card Component
const PaperCard: React.FC<{
  paper: PaperCustomer;
  onPress: () => void;
}> = ({ paper, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-3 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <View className="p-4">
        {/* Header with Paper ID and Status */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Avatar.Icon 
              size={40} 
              icon="file-document-outline" 
              style={{ backgroundColor: '#F3F4F6' }}
              color="#6B7280"
            />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-900 text-base">
                Paper #{paper.paperId.slice(-6)}
              </Text>
              <Text className="text-gray-500 text-sm">
                {paper.createdAt ? new Date(paper.createdAt).toLocaleDateString('vi-VN') : ''}
              </Text>
            </View>
          </View>
          <PaperStatusBadge phaseId={paper.paperPhaseId} />
        </View>

        {/* Paper Title */}
        {paper.title && (
          <View className="mb-2">
            <Text className="font-medium text-gray-900 text-sm">
              {paper.title}
            </Text>
          </View>
        )}

        {/* Paper Description */}
        {paper.description && (
          <View className="mb-3">
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {paper.description}
            </Text>
          </View>
        )}

        {/* Footer with Conference Info */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <Text className="text-gray-500 text-xs">
            Conference ID: {paper.conferenceId || 'N/A'}
          </Text>
          <Icon name="chevron-right" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <View className="flex-1 items-center justify-center px-6">
    <Icon name="description" size={80} color="#E5E7EB" />
    <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
      Chưa có paper nào
    </Text>
    <Text className="text-gray-400 text-sm mt-2 text-center">
      Bạn chưa nộp paper nào. Hãy lên web để tạo và nộp paper mới.
    </Text>
  </View>
);

// Error State Component
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <View className="flex-1 items-center justify-center px-6">
    <Icon name="error-outline" size={80} color="#EF4444" />
    <Text className="text-gray-900 text-lg font-medium mt-4 text-center">
      Có lỗi xảy ra
    </Text>
    <Text className="text-gray-500 text-sm mt-2 mb-6 text-center">
      Không thể tải danh sách paper. Vui lòng thử lại.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      className="bg-blue-500 px-6 py-3 rounded-lg"
    >
      <Text className="text-white font-medium">Thử lại</Text>
    </TouchableOpacity>
  </View>
);

// Loading State Component
const LoadingState: React.FC = () => (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text className="text-gray-500 mt-4">Đang tải danh sách paper...</Text>
  </View>
);

const PaperListScreen: React.FC<PaperListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    submittedPapers,
    loading,
    submittedPapersError,
  } = usePaperCustomer();

  // Filter papers based on search query
  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return submittedPapers;

    return submittedPapers.filter((paper) => 
      paper.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.paperId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submittedPapers, searchQuery]);

  const handlePaperPress = useCallback((paper: PaperCustomer) => {
    navigation.navigate('PaperDetail', { paperId: paper.paperId });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // The query will automatically refetch when the component mounts
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleRetry = useCallback(() => {
    // Force refetch by navigating back and forth or using refetch if available
    handleRefresh();
  }, [handleRefresh]);

  const renderPaper = useCallback(({ item }: { item: PaperCustomer }) => (
    <PaperCard
      paper={item}
      onPress={() => handlePaperPress(item)}
    />
  ), [handlePaperPress]);

  const keyExtractor = useCallback((item: PaperCustomer) => item.paperId, []);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50">
        <Appbar.Header style={{ backgroundColor: '#FFFFFF' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Danh sách Paper" />
        </Appbar.Header>
        <LoadingState />
      </View>
    );
  }

  if (submittedPapersError && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50">
        <Appbar.Header style={{ backgroundColor: '#FFFFFF' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Danh sách Paper" />
        </Appbar.Header>
        <ErrorState onRetry={handleRetry} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Appbar.Header style={{ backgroundColor: '#FFFFFF' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Danh sách Paper" />
      </Appbar.Header>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white">
        <Searchbar
          placeholder="Tìm kiếm paper..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ backgroundColor: '#F9FAFB' }}
          inputStyle={{ fontSize: 14 }}
        />
      </View>

      <Divider />

      {/* Paper List */}
      {filteredPapers.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredPapers}
          renderItem={renderPaper}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
            />
          }
        />
      )}
    </View>
  );
};

export default PaperListScreen;