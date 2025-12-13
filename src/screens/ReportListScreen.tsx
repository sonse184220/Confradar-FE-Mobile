import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    Appbar,
    Searchbar,
    Divider,
    FAB,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from '@react-native-community/blur';
import { useReport } from '../hooks/useReport';
import type { OwnReportResponse } from '../types/report.type';

// Types
interface ReportListScreenProps {
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

const getAvatarInitials = (subject?: string): string => {
    if (subject) {
        return subject.slice(0, 2).toUpperCase();
    }
    return 'RP';
};

const getStatusColor = (hasResolve: boolean): string => {
    return hasResolve ? '#10B981' : '#F59E0B';
};

const getStatusText = (hasResolve: boolean): string => {
    return hasResolve ? 'Đã giải quyết' : 'Chờ xử lý';
};

const filterTabs = ['Thời gian', 'Trạng thái', 'Tiêu đề'];

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

const ReportItem = ({
    report,
    onPress
}: {
    report: OwnReportResponse;
    onPress: () => void;
}) => {
    const avatarInitials = getAvatarInitials(report.reportSubject);
    const formattedDate = formatDate(report.createdAt);
    const formattedTime = formatTime(report.createdAt);
    const statusColor = getStatusColor(report.hasResolve);
    const statusText = getStatusText(report.hasResolve);

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
                                {avatarInitials}
                            </Text>
                        </View>

                        {/* Report Info */}
                        <View className="flex-1">
                            <Text className="text-white font-medium text-base" numberOfLines={1}>
                                {report.reportSubject}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                {formattedDate}, {formattedTime}
                            </Text>
                        </View>
                    </View>

                    {/* Status and Arrow */}
                    <View className="flex-row items-center">
                        <View
                            className="px-3 py-1 rounded-full mr-2"
                            style={{ backgroundColor: `${statusColor}20` }}
                        >
                            <Text
                                className="font-semibold text-xs"
                                style={{ color: statusColor }}
                            >
                                {statusText}
                            </Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#6B7280" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const ReportDetailModal = ({
    visible,
    report,
    onClose
}: {
    visible: boolean;
    report: OwnReportResponse | null;
    onClose: () => void;
}) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['80%'], []);

    useEffect(() => {
        if (visible) {
            sheetRef.current?.expand();
        } else {
            sheetRef.current?.close();
        }
    }, [visible, report]);

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

    if (!report) return null;

    const statusColor = getStatusColor(report.hasResolve);
    const statusText = getStatusText(report.hasResolve);

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
                        Chi tiết báo cáo
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
                    {/* Main Report Info */}
                    <View className="flex-row items-center mb-6 bg-gray-800/50 rounded-2xl p-4">
                        <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center">
                            <Icon
                                name="flag"
                                size={24}
                                color={statusColor}
                            />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-white text-xl font-semibold">
                                {report.reportSubject}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                {formatDate(report.createdAt)}, {formatTime(report.createdAt)}
                            </Text>
                        </View>
                        <View
                            className="px-3 py-2 rounded-full"
                            style={{ backgroundColor: `${statusColor}20` }}
                        >
                            <Text
                                className="font-semibold text-sm"
                                style={{ color: statusColor }}
                            >
                                {statusText}
                            </Text>
                        </View>
                    </View>

                    {/* Report Details */}
                    <View className="pb-6">
                        {/* Report ID */}
                        <View className="mb-5">
                            <Text className="text-gray-500 text-xs mb-1.5">Report ID</Text>
                            <Text className="text-white font-medium text-base">
                                {report.reportId}
                            </Text>
                        </View>

                        {/* Reason */}
                        <View className="mb-5">
                            <Text className="text-gray-500 text-xs mb-1.5">Lý do</Text>
                            <Text className="text-white font-medium text-base">
                                {report.reason}
                            </Text>
                        </View>

                        {/* Description */}
                        <View className="mb-5">
                            <Text className="text-gray-500 text-xs mb-1.5">Mô tả chi tiết</Text>
                            <Text className="text-white font-medium text-base">
                                {report.description}
                            </Text>
                        </View>

                        {/* Admin Feedback */}
                        {report.reportFeedback && (
                            <View className="mt-4 bg-gray-800/70 rounded-2xl p-4">
                                <View className="flex-row items-center mb-3">
                                    <Icon name="admin-panel-settings" size={20} color="#10B981" />
                                    <Text className="text-white font-semibold text-base ml-2">
                                        Phản hồi từ Admin
                                    </Text>
                                </View>

                                <View className="mb-3">
                                    <Text className="text-gray-500 text-xs mb-1.5">Tiêu đề phản hồi</Text>
                                    <Text className="text-white font-medium text-base">
                                        {report.reportFeedback.reportSubject}
                                    </Text>
                                </View>

                                <View>
                                    <Text className="text-gray-500 text-xs mb-1.5">Nội dung phản hồi</Text>
                                    <Text className="text-white font-medium text-base">
                                        {report.reportFeedback.reason}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </BottomSheetView>
        </BottomSheet>
    );
};

// Main Component
const ReportListScreen: React.FC<ReportListScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Thời gian');
    const [selectedReport, setSelectedReport] = useState<OwnReportResponse | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Use report hook with lazy query
    const { getOwnReportsLazy, loading, ownReportsError, ownReports } = useReport();

    // Fetch reports on mount
    useEffect(() => {
        getOwnReportsLazy();
    }, []);

    // Filter and sort reports
    const filteredAndSortedReports = useMemo(() => {
        let filtered = ownReports.filter(report => {
            const subject = report.reportSubject?.toLowerCase() || '';
            const reason = report.reason?.toLowerCase() || '';
            const description = report.description?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();

            return subject.includes(query) ||
                reason.includes(query) ||
                description.includes(query);
        });

        // Sort based on active filter
        switch (activeFilter) {
            case 'Thời gian':
                return filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA; // Latest first
                });
            case 'Trạng thái':
                return filtered.sort((a, b) => {
                    if (a.hasResolve === b.hasResolve) return 0;
                    return a.hasResolve ? 1 : -1; // Unresolved first
                });
            case 'Tiêu đề':
                return filtered.sort((a, b) => {
                    const subjectA = a.reportSubject || '';
                    const subjectB = b.reportSubject || '';
                    return subjectA.localeCompare(subjectB);
                });
            default:
                return filtered;
        }
    }, [ownReports, searchQuery, activeFilter]);

    const handleReportPress = (report: OwnReportResponse) => {
        setSelectedReport(report);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedReport(null);
    };

    const handleAddNewReport = () => {
        // Navigate to ReportIssueScreen
        navigation?.navigate('ReportIssue');
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
                            title="Danh sách báo cáo"
                            titleStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
                        />
                    </Appbar.Header>

                    {/* Search Bar with Filter Icon */}
                    <View className="px-4 mb-4">
                        <View className="flex-row items-center">
                            <View className="flex-1 mr-3">
                                <Searchbar
                                    placeholder="Tìm kiếm báo cáo..."
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

                {/* Reports List */}
                <ScrollView
                    style={{ flex: 1, backgroundColor: 'transparent', paddingVertical: 8 }}
                    showsVerticalScrollIndicator={true}
                >
                    {loading ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <Text className="text-white text-base">Đang tải báo cáo...</Text>
                        </View>
                    ) : ownReportsError ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <Text className="text-red-400 text-base text-center px-4">
                                {ownReportsError.data?.message || 'Có lỗi xảy ra'}
                            </Text>
                        </View>
                    ) : filteredAndSortedReports.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <Icon name="flag-outline" size={48} color="#6B7280" />
                            <Text className="text-gray-400 text-base mt-4">Chưa có báo cáo nào</Text>
                        </View>
                    ) : (
                        filteredAndSortedReports.map((report, index) => (
                            <View key={report.reportId}>
                                <ReportItem
                                    report={report}
                                    onPress={() => handleReportPress(report)}
                                />
                                {index < filteredAndSortedReports.length - 1 && (
                                    <View className="px-4">
                                        <Divider style={{ backgroundColor: '#374151' }} />
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Report Detail Modal */}
                <ReportDetailModal
                    visible={modalVisible}
                    report={selectedReport}
                    onClose={handleCloseModal}
                />

                {/* FAB - Add New Report */}
                <FAB
                    icon="plus"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#10B981',
                    }}
                    color="#FFFFFF"
                    onPress={handleAddNewReport}
                />
            </View>
        </GestureHandlerRootView>
    );
};

export default ReportListScreen;