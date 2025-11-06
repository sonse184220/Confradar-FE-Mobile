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

  const getPhaseText = (phaseId?: string) => {
    switch (phaseId) {
      case '1': return 'Abstract';
      case '2': return 'Full Paper';
      case '3': return 'Revision';
      case '4': return 'Camera Ready';
      default: return 'Unknown';
    }
  };

  return (
    <View 
      className="px-2 py-1 rounded-lg"
      style={{ backgroundColor: '#374151' }}
    >
      <Text 
        className="text-xs font-medium"
        style={{ color: getStatusColor(phaseId) }}
      >
        {getPhaseText(phaseId)}
      </Text>
    </View>
  );
};

// Paper Card Component
const PaperCard: React.FC<{
  paper: PaperCustomer;
  onPress: () => void;
}> = ({ paper, onPress }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarInitials = (paperId: string): string => {
    return paperId.slice(-2).toUpperCase();
  };

  return (
    <View className="px-4 py-2">
      <TouchableOpacity 
        onPress={onPress}
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
                {getAvatarInitials(paper.paperId)}
              </Text>
            </View>

            {/* Paper Info */}
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {paper.title || `Paper #${paper.paperId.slice(-6)}`}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatDate(paper.createdAt)}, {formatTime(paper.createdAt)}
              </Text>
            </View>
          </View>

          {/* Status and Arrow */}
          <View className="flex-row items-center">
            <PaperStatusBadge phaseId={paper.paperPhaseId} />
            <Icon
              name="chevron-right"
              size={20}
              color="#6B7280"
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Empty State Component
const EmptyState: React.FC = () => (
  <View className="flex-1 items-center justify-center px-6 py-20">
    <Icon name="description" size={80} color="#6B7280" />
    <Text className="text-gray-400 text-lg font-medium mt-4 text-center">
      Chưa có paper nào
    </Text>
    <Text className="text-gray-500 text-sm mt-2 text-center">
      Bạn chưa nộp paper nào. Hãy lên web để tạo và nộp paper mới.
    </Text>
  </View>
);

// Error State Component
const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <View className="flex-1 items-center justify-center px-6 py-20">
    <Icon name="error-outline" size={80} color="#EF4444" />
    <Text className="text-white text-lg font-medium mt-4 text-center">
      Có lỗi xảy ra
    </Text>
    <Text className="text-gray-400 text-sm mt-2 mb-6 text-center">
      Không thể tải danh sách paper. Vui lòng thử lại.
    </Text>
    <TouchableOpacity
      onPress={onRetry}
      className="bg-green-400 px-6 py-3 rounded-lg"
    >
      <Text className="text-black font-medium">Thử lại</Text>
    </TouchableOpacity>
  </View>
);

// Loading State Component
const LoadingState: React.FC = () => (
  <View className="flex-1 items-center justify-center py-20">
    <ActivityIndicator size="large" color="#10B981" />
    <Text className="text-gray-400 mt-4">Đang tải danh sách paper...</Text>
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
    <View className="flex-1 bg-gray-600">
      <View className="bg-black">
        {/* Header */}
        <Appbar.Header
          mode="center-aligned"
          style={{ backgroundColor: 'transparent', elevation: 0 }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack()} color="#FFFFFF" />
          <Appbar.Content
            title="Danh sách Paper"
            titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
          />
        </Appbar.Header>

        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center">
            <View className="flex-1 mr-3">
              <Searchbar
                placeholder="Tìm kiếm paper..."
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
      </View>

      {/* Paper List */}
      {filteredPapers.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
            />
          }
        >
          {filteredPapers.map((paper, index) => (
            <View key={paper.paperId}>
              <PaperCard
                paper={paper}
                onPress={() => handlePaperPress(paper)}
              />
              {index < filteredPapers.length - 1 && (
                <View className="px-4">
                  <Divider style={{ backgroundColor: '#374151' }} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default PaperListScreen;