import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Card,
    Button,
    Chip,
    IconButton,
    Searchbar,
    Surface,
    Menu,
    Portal,
    ActivityIndicator,
    PaperProvider,
    Divider,
    Icon
} from 'react-native-paper';
import { useConference } from '../hooks/useConference';
import { useConferenceCategory } from '../hooks/useConferenceCategory';
import { ConferenceResponse } from '../types/conference.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ConferenceListScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [bannerFilter, setBannerFilter] = useState<'technical' | 'research' | 'all'>('all');
    const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
    const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [statusMenuVisible, setStatusMenuVisible] = useState(false);
    const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
    const [bannerMenuVisible, setBannerMenuVisible] = useState(false);
    const [cityMenuVisible, setCityMenuVisible] = useState(false);
    const [priceMenuVisible, setPriceMenuVisible] = useState(false);
    const [dateMenuVisible, setDateMenuVisible] = useState(false);

    const itemsPerPage = 12;

    const {
        lazyConferencesWithPrices,
        statusConferences,
        fetchConferencesWithPrices,
        fetchConferencesByStatus,
        lazyWithPricesLoading,
        statusConferencesLoading,
        lazyWithPricesError,
        statusConferencesError
    } = useConference({ page: currentPage, pageSize: itemsPerPage });

    const {
        categories: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
        fetchCategories,
    } = useConferenceCategory();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                await fetchCategories();
            } catch (error) {
                console.log('Error loading categories:', error);
            }
        };
        loadCategories();
    }, [fetchCategories]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCity, selectedStatus, selectedCategory, sortBy, bannerFilter, startDateFilter, endDateFilter]);

    // useEffect(() => {
    //     setCurrentPage(1);
    // }, [searchQuery, selectedCity, selectedStatus, selectedCategory, sortBy, bannerFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (selectedStatus !== 'all') {
            const params = {
                page: currentPage,
                pageSize: itemsPerPage,
                ...(searchQuery && { searchKeyword: searchQuery }),
                ...(selectedCity !== 'all' && { cityId: selectedCity }),
                ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
                ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] })
            };
            fetchConferencesByStatus(selectedStatus, params);
        } else {
            const params = {
                page: currentPage,
                pageSize: itemsPerPage,
                ...(searchQuery && { searchKeyword: searchQuery }),
                ...(selectedCity !== 'all' && { cityId: selectedCity }),
                ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
                ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] })
            };
            fetchConferencesWithPrices(params);
        }
    }, [currentPage, searchQuery, selectedCity, selectedStatus, startDateFilter, endDateFilter, fetchConferencesWithPrices, fetchConferencesByStatus]);

    const getCurrentConferences = (): ConferenceResponse[] => {
        if (selectedStatus !== 'all') {
            return statusConferences?.items || [];
        } else {
            return lazyConferencesWithPrices?.items || [];
        }
    };

    const currentConferences = getCurrentConferences();

    const getMinPrice = (conf: ConferenceResponse) => {
        if (!conf.conferencePrices || conf.conferencePrices.length === 0) return null;
        return Math.min(...conf.conferencePrices.map(p => p.ticketPrice || 0));
    };

    const getMaxPrice = (conf: ConferenceResponse) => {
        if (!conf.conferencePrices || conf.conferencePrices.length === 0) return null;
        return Math.max(...conf.conferencePrices.map(p => p.ticketPrice || 0));
    };

    const filteredConferences = currentConferences.filter((conf: ConferenceResponse) => {
        const confType = conf.isResearchConference ? 'research' : 'technical';
        const matchesBannerFilter = bannerFilter === 'all' || confType === bannerFilter;
        const matchesCategory = selectedCategory === 'all' || conf.conferenceCategoryId === selectedCategory;

        return matchesBannerFilter && matchesCategory;
    });

    const sortedConferences = [...filteredConferences].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': {
                const aMin = getMinPrice(a) ?? Infinity;
                const bMin = getMinPrice(b) ?? Infinity;
                return aMin - bMin;
            }
            case 'price-high': {
                const aMax = getMaxPrice(a) ?? 0;
                const bMax = getMaxPrice(b) ?? 0;
                return bMax - aMax;
            }
            case 'attendees-low':
                return (a.totalSlot ?? 0) - (b.totalSlot ?? 0);
            case 'attendees-high':
                return (b.totalSlot ?? 0) - (a.totalSlot ?? 0);
            case 'date':
            default:
                return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
        }
    });

    const getPaginationData = () => {
        const filteredCount = sortedConferences.length;

        if (selectedStatus !== 'all') {
            const apiResponse = statusConferences;
            if (apiResponse) {
                return {
                    totalPages: apiResponse.totalPages,
                    totalCount: filteredCount,
                    currentPage: currentPage,
                    pageSize: itemsPerPage,
                    paginatedConferences: sortedConferences
                };
            }
        } else {
            const apiResponse = lazyConferencesWithPrices;
            if (apiResponse) {
                return {
                    totalPages: apiResponse.totalPages,
                    totalCount: filteredCount,
                    currentPage: currentPage,
                    pageSize: itemsPerPage,
                    paginatedConferences: sortedConferences
                };
            }
        }

        return {
            totalPages: 0,
            totalCount: filteredCount,
            currentPage: currentPage,
            pageSize: itemsPerPage,
            paginatedConferences: sortedConferences
        };
    };

    const { totalPages, totalCount, paginatedConferences } = getPaginationData();

    const isLoading = lazyWithPricesLoading || statusConferencesLoading || categoriesLoading;
    const hasError = lazyWithPricesError || statusConferencesError || categoriesError;

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
                <ActivityIndicator size="large" color="#19A7CE" />
                <Text style={{ color: '#F6F1F1', marginTop: 16 }}>Đang tải danh sách hội nghị...</Text>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', padding: 16 }}>
                <Icon source="alert-circle" size={64} color="rgba(246, 241, 241, 0.5)" />
                <Text style={{ color: '#EF4444', marginBottom: 16, textAlign: 'center' }}>Có lỗi xảy ra khi tải dữ liệu</Text>
                <Button
                    mode="contained"
                    buttonColor="#19A7CE"
                    textColor="#000000"
                    style={{ borderRadius: 12 }}
                    onPress={() => {
                        if (selectedStatus !== 'all') {
                            const params = {
                                page: currentPage,
                                pageSize: itemsPerPage,
                                ...(searchQuery && { searchKeyword: searchQuery }),
                                ...(selectedCity !== 'all' && { cityId: selectedCity }),
                            };
                            fetchConferencesByStatus(selectedStatus, params);
                        } else {
                            const params = {
                                page: currentPage,
                                pageSize: itemsPerPage,
                                ...(searchQuery && { searchKeyword: searchQuery }),
                                ...(selectedCity !== 'all' && { cityId: selectedCity }),
                            };
                            fetchConferencesWithPrices(params);
                        }
                    }}
                >
                    Thử lại
                </Button>
            </View>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Chưa xác định';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getCategoryName = (conference: ConferenceResponse) => {
        if (!categoriesData || !conference.conferenceCategoryId) return 'General';
        const category = categoriesData.find(cat => cat.categoryId === conference.conferenceCategoryId);
        return category?.categoryName || 'General';
    };

    const renderConferenceCard = ({ item: conference }: { item: ConferenceResponse }) => {
        const minPrice = getMinPrice(conference);
        const maxPrice = getMaxPrice(conference);
        const priceText = minPrice !== null ?
            (minPrice === maxPrice ? `${minPrice.toLocaleString()}₫` : `${minPrice.toLocaleString()}₫ - ${maxPrice?.toLocaleString()}₫`) :
            'Miễn phí';

        const categoryName = getCategoryName(conference);

        return (
            <View style={{ marginBottom: 16, marginHorizontal: 16 }}>
                <Card
                    style={{
                        backgroundColor: 'rgba(246, 241, 241, 0.1)',
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: 'rgba(246, 241, 241, 0.2)',
                        overflow: 'hidden',
                    }}
                    elevation={0}
                >
                    <LinearGradient
                        colors={['#146C94', '#19A7CE', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: 16 }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Chip
                                    mode="outlined"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', marginBottom: 8 }}
                                    textStyle={{ color: '#F6F1F1', fontSize: 12 }}
                                >
                                    {categoryName}
                                </Chip>
                                <Text
                                    style={{ color: '#F6F1F1', fontWeight: 'bold', fontSize: 18, lineHeight: 24 }}
                                    numberOfLines={2}
                                >
                                    {conference.conferenceName}
                                </Text>
                            </View>
                            <IconButton
                                icon="heart-outline"
                                iconColor="#F6F1F1"
                                size={20}
                                onPress={() => { }}
                            />
                        </View>
                    </LinearGradient>

                    <Card.Content style={{ padding: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Icon source="calendar" size={16} color="#19A7CE" />
                                    <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                        {formatDate(conference.startDate)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Icon source="map-marker" size={16} color="#19A7CE" />
                                    <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                        {conference.address || 'Địa điểm chưa xác định'}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon source="account-group" size={16} color="#19A7CE" />
                                    <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                        {conference.totalSlot || 0} người tham gia
                                    </Text>
                                </View>
                            </View>

                            <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Icon source="clock" size={16} color="#FFD700" />
                                    <Chip
                                        mode="flat"
                                        style={{
                                            backgroundColor: conference.isResearchConference ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                            height: 24,
                                            marginLeft: 4
                                        }}
                                        textStyle={{ color: '#F6F1F1', fontSize: 10 }}
                                    >
                                        {conference.isResearchConference ? 'Research' : 'Technical'}
                                    </Chip>
                                </View>
                                <Text style={{ color: '#F6F1F1', fontWeight: 'bold', fontSize: 18 }}>
                                    {priceText}
                                </Text>
                            </View>
                        </View>

                        <Divider style={{ marginVertical: 12, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                {conference.description && (
                                    <Text style={{ color: 'rgba(246, 241, 241, 0.6)', fontSize: 12 }} numberOfLines={2}>
                                        {conference.description}
                                    </Text>
                                )}
                            </View>
                            <Button
                                mode="contained"
                                buttonColor="#19A7CE"
                                textColor="#000000"
                                style={{ borderRadius: 12 }}
                                compact
                                onPress={() => navigation.navigate('ConferenceDetails', {
                                    conferenceId: conference.conferenceId,
                                    type: conference.isResearchConference ? 'research' : 'technical'
                                })}
                            >
                                Chi tiết
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );
    };

    const FilterChip = ({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) => (
        <Chip
            mode={isSelected ? 'flat' : 'outlined'}
            selected={isSelected}
            onPress={onPress}
            style={{
                marginRight: 8,
                backgroundColor: isSelected
                    ? 'rgba(25, 167, 206, 0.2)'
                    : 'rgba(246, 241, 241, 0.1)',
                borderColor: isSelected
                    ? '#19A7CE'
                    : 'rgba(246, 241, 241, 0.3)',
            }}
            textStyle={{
                color: isSelected ? '#F6F1F1' : 'rgba(246, 241, 241, 0.7)',
                fontSize: 12
            }}
        >
            {label}
        </Chip>
    );

    const quickStatusFilters = [
        { key: 'all', label: 'Tất cả', value: 'all' },
        { key: 'upcoming', label: 'Sắp diễn ra', value: 'upcoming' },
        { key: 'current', label: 'Đang diễn ra', value: 'current' },
        { key: 'past', label: 'Đã kết thúc', value: 'past' },
    ];

    const getSortLabel = () => {
        switch (sortBy) {
            case 'date': return 'Ngày diễn ra';
            case 'price-low': return 'Giá thấp → cao';
            case 'price-high': return 'Giá cao → thấp';
            case 'attendees-high': return 'Nhiều người';
            case 'attendees-low': return 'Ít người';
            default: return 'Sắp xếp';
        }
    };

    const getStatusLabel = () => {
        switch (selectedStatus) {
            case 'all': return 'Tất cả';
            case 'upcoming': return 'Sắp diễn ra';
            case 'current': return 'Đang diễn ra';
            case 'past': return 'Đã kết thúc';
            default: return 'Trạng thái';
        }
    };

    const getCategoryLabel = () => {
        if (selectedCategory === 'all') return 'Tất cả';
        const category = categoriesData?.find(c => c.categoryId === selectedCategory);
        return category?.categoryName || 'Danh mục';
    };

    const getBannerLabel = () => {
        switch (bannerFilter) {
            case 'all': return 'Tất cả';
            case 'technical': return 'Technical';
            case 'research': return 'Research';
            default: return 'Loại';
        }
    };

    return (
        <PaperProvider>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                {/* Header - Fixed */}
                <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ color: '#F6F1F1', fontSize: 24, fontWeight: 'bold', flex: 1 }}>
                            Danh sách hội nghị
                        </Text>
                        <Text style={{ color: 'rgba(246, 241, 241, 0.7)', fontSize: 14 }}>
                            {totalCount} sự kiện
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <Searchbar
                        placeholder="Tìm kiếm hội nghị, địa điểm, danh mục..."
                        onChangeText={setSearchInput}
                        value={searchInput}
                        style={{
                            backgroundColor: 'rgba(246, 241, 241, 0.1)',
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: 'rgba(246, 241, 241, 0.2)',
                            marginBottom: 12,
                        }}
                        inputStyle={{ color: '#F6F1F1', fontSize: 14 }}
                        placeholderTextColor="rgba(246, 241, 241, 0.6)"
                        iconColor="#19A7CE"
                    />

                    {/* Controls Row */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: 12 }}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {/* Sort Menu */}
                        <Menu
                            key="menu-sort"
                            visible={sortMenuVisible}
                            onDismiss={() => setSortMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setSortMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        marginRight: 8
                                    }}
                                >
                                    <Icon source="sort" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                        {getSortLabel()}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            <Menu.Item onPress={() => { setSortBy('date'); setSortMenuVisible(false); }} title="Ngày diễn ra" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSortBy('price-low'); setSortMenuVisible(false); }} title="Giá thấp đến cao" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSortBy('price-high'); setSortMenuVisible(false); }} title="Giá cao đến thấp" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSortBy('attendees-high'); setSortMenuVisible(false); }} title="Nhiều người tham gia" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSortBy('attendees-low'); setSortMenuVisible(false); }} title="Ít người tham gia" titleStyle={{ color: '#F6F1F1' }} />
                        </Menu>

                        {/* Status Menu */}
                        <Menu
                            key="menu-status"
                            visible={statusMenuVisible}
                            onDismiss={() => setStatusMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setStatusMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        marginRight: 8
                                    }}
                                >
                                    <Icon source="clock" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                        {getStatusLabel()}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            <Menu.Item onPress={() => { setSelectedStatus('all'); setStatusMenuVisible(false); }} title="Tất cả" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSelectedStatus('upcoming'); setStatusMenuVisible(false); }} title="Sắp diễn ra" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSelectedStatus('current'); setStatusMenuVisible(false); }} title="Đang diễn ra" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setSelectedStatus('past'); setStatusMenuVisible(false); }} title="Đã kết thúc" titleStyle={{ color: '#F6F1F1' }} />
                        </Menu>

                        {/* Category Menu */}
                        <Menu
                            key="menu-category"
                            visible={categoryMenuVisible}
                            onDismiss={() => setCategoryMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setCategoryMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        marginRight: 8
                                    }}
                                >
                                    <Icon source="tag" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                        {getCategoryLabel()}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            <Menu.Item onPress={() => { setSelectedCategory('all'); setCategoryMenuVisible(false); }} title="Tất cả" titleStyle={{ color: '#F6F1F1' }} />
                            {categoriesData?.map((category) => (
                                <Menu.Item
                                    key={category.categoryId}
                                    onPress={() => {
                                        setSelectedCategory(category.categoryId);
                                        setCategoryMenuVisible(false);
                                    }}
                                    title={category.categoryName}
                                    titleStyle={{ color: '#F6F1F1' }}
                                />
                            ))}
                        </Menu>

                        {/* Banner Type Menu */}
                        <Menu
                            key="menu-banner-type"
                            visible={bannerMenuVisible}
                            onDismiss={() => setBannerMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setBannerMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <Icon source="filter" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                        {getBannerLabel()}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            <Menu.Item onPress={() => { setBannerFilter('all'); setBannerMenuVisible(false); }} title="Tất cả" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setBannerFilter('technical'); setBannerMenuVisible(false); }} title="Technical" titleStyle={{ color: '#F6F1F1' }} />
                            <Menu.Item onPress={() => { setBannerFilter('research'); setBannerMenuVisible(false); }} title="Research" titleStyle={{ color: '#F6F1F1' }} />
                        </Menu>

                        {/* City Filter */}
                        {/* <Menu
                            visible={cityMenuVisible}
                            onDismiss={() => setCityMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setCityMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        marginRight: 8
                                    }}
                                >
                                    <Icon source="city" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, fontSize: 14 }}>
                                        Thành phố
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            {cities.map((city) => (
                                <Menu.Item
                                    key={city.id}
                                    onPress={() => {
                                        setSelectedCity(city.id);
                                        setCityMenuVisible(false);
                                    }}
                                    title={city.name}
                                    titleStyle={{ color: '#F6F1F1' }}
                                />
                            ))}
                        </Menu> */}

                        {/* Start Date Filter */}
                        <Menu
                            visible={dateMenuVisible}
                            onDismiss={() => setDateMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setDateMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        marginRight: 8
                                    }}
                                >
                                    <Icon source="calendar-range" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, fontSize: 14 }}>
                                        {startDateFilter || endDateFilter ? 'Đã chọn ngày' : 'Ngày'}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            <Menu.Item
                                onPress={() => {
                                    setStartDateFilter(null);
                                    setEndDateFilter(null);
                                    setDateMenuVisible(false);
                                }}
                                title="Xóa bộ lọc ngày"
                                titleStyle={{ color: '#F6F1F1' }}
                            />
                            <Menu.Item
                                onPress={() => {
                                    setDateMenuVisible(false);
                                    // TODO: Open date picker modal
                                    console.log('Open date picker');
                                }}
                                title="Chọn khoảng thời gian"
                                titleStyle={{ color: '#F6F1F1' }}
                            />
                        </Menu>

                        {/* Price Range Filter */}
                        {/* <Menu
                            visible={priceMenuVisible}
                            onDismiss={() => setPriceMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setPriceMenuVisible(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 8,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <Icon source="currency-usd" size={16} color="#19A7CE" />
                                    <Text style={{ color: '#F6F1F1', marginLeft: 8, fontSize: 14 }}>
                                        Giá
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                        >
                            {priceRanges.map((range) => (
                                <Menu.Item
                                    key={range.key}
                                    onPress={() => {
                                        setSelectedPriceRange(range.key);
                                        setPriceMenuVisible(false);
                                    }}
                                    title={range.label}
                                    titleStyle={{ color: '#F6F1F1' }}
                                />
                            ))}
                        </Menu> */}
                    </ScrollView>

                    {/* Quick Filter Chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {quickStatusFilters.map((filter) => (
                            <FilterChip
                                key={filter.key}
                                label={filter.label}
                                isSelected={selectedStatus === filter.value}
                                onPress={() => setSelectedStatus(filter.value)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Conference List - Scrollable */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={paginatedConferences}
                        renderItem={renderConferenceCard}
                        keyExtractor={(item) => item.conferenceId}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
                                <Icon source="calendar-search" size={64} color="rgba(246, 241, 241, 0.3)" />
                                <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 16, marginBottom: 8, color: 'rgba(246, 241, 241, 0.7)' }}>
                                    Không tìm thấy hội nghị nào
                                </Text>
                                <Text style={{ textAlign: 'center', fontSize: 14, paddingHorizontal: 32, color: 'rgba(246, 241, 241, 0.5)' }}>
                                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </Text>
                            </View>
                        }
                    />
                </View>

                {/* Pagination - Fixed at bottom */}
                {totalPages > 1 && (
                    <Surface style={{
                        backgroundColor: 'rgba(246, 241, 241, 0.05)',
                        padding: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(246, 241, 241, 0.1)'
                    }}>
                        <Button
                            mode="outlined"
                            disabled={currentPage === 1}
                            onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            style={{ borderColor: 'rgba(246, 241, 241, 0.3)', borderRadius: 8 }}
                            textColor="#F6F1F1"
                        >
                            Trước
                        </Button>

                        <Text style={{ color: '#F6F1F1', fontSize: 14 }}>
                            Trang {currentPage} / {totalPages}
                        </Text>

                        <Button
                            mode="outlined"
                            disabled={currentPage === totalPages}
                            onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            style={{ borderColor: 'rgba(246, 241, 241, 0.3)', borderRadius: 8 }}
                            textColor="#F6F1F1"
                        >
                            Sau
                        </Button>
                    </Surface>
                )}
            </View>
        </PaperProvider>
    );
};

export default ConferenceListScreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
// import {
//     Card,
//     Button,
//     Chip,
//     IconButton,
//     Searchbar,
//     Surface,
//     Menu,
//     Portal,
//     ActivityIndicator,
//     PaperProvider
// } from 'react-native-paper';
// import { useConference } from '../hooks/useConference';
// import { useConferenceCategory } from '../hooks/useConferenceCategory';
// import { ConferenceResponse } from '../types/conference.type';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { HomeStackParamList } from '../navigation/HomeStack';

// const { width: screenWidth } = Dimensions.get('window');

// type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// interface SearchSortFilterConferenceProps {
//     bannerFilter?: 'technical' | 'research' | 'all';
// }

// const ConferenceListScreen: React.FC<SearchSortFilterConferenceProps> = ({
//     bannerFilter = 'all'
// }) => {
//     const navigation = useNavigation<NavigationProp>();

//     const [searchInput, setSearchInput] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const [selectedCity, setSelectedCity] = useState('all');
//     const [selectedStatus, setSelectedStatus] = useState('all');
//     const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
//     const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
//     const [sortBy, setSortBy] = useState('date');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortMenuVisible, setSortMenuVisible] = useState(false);
//     const [statusMenuVisible, setStatusMenuVisible] = useState(false);
//     const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

//     const itemsPerPage = 12;

//     // Use the same logic as web ConferenceBrowser
//     const {
//         lazyConferencesWithPrices,
//         statusConferences,
//         fetchConferencesWithPrices,
//         fetchConferencesByStatus,
//         lazyWithPricesLoading,
//         statusConferencesLoading,
//         lazyWithPricesError,
//         statusConferencesError
//     } = useConference({ page: currentPage, pageSize: itemsPerPage });

//     const {
//         categories: categoriesData,
//         loading: categoriesLoading,
//         error: categoriesError,
//         fetchCategories,
//     } = useConferenceCategory();

//     // Load categories on component mount
//     useEffect(() => {
//         const loadCategories = async () => {
//             try {
//                 await fetchCategories();
//             } catch (error) {
//                 console.log('Error loading categories:', error);
//             }
//         };
//         loadCategories();
//     }, [fetchCategories]);

//     // Reset page when filters change (like web)
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchQuery, selectedCity, selectedStatus, selectedCategory, sortBy]);

//     // Handle search with debounce
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setSearchQuery(searchInput);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [searchInput]);

//     // Main API fetch logic (like web ConferenceBrowser)
//     useEffect(() => {
//         if (selectedStatus !== 'all') {
//             const params = {
//                 page: currentPage,
//                 pageSize: itemsPerPage,
//                 ...(searchQuery && { searchKeyword: searchQuery }),
//                 ...(selectedCity !== 'all' && { cityId: selectedCity }),
//                 ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
//                 ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] })
//             };
//             fetchConferencesByStatus(selectedStatus, params);
//         } else {
//             const params = {
//                 page: currentPage,
//                 pageSize: itemsPerPage,
//                 ...(searchQuery && { searchKeyword: searchQuery }),
//                 ...(selectedCity !== 'all' && { cityId: selectedCity }),
//                 ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
//                 ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] })
//             };
//             fetchConferencesWithPrices(params);
//         }
//     }, [currentPage, searchQuery, selectedCity, selectedStatus, startDateFilter, endDateFilter, fetchConferencesWithPrices, fetchConferencesByStatus]);

//     // Get current conferences (like web)
//     const getCurrentConferences = (): ConferenceResponse[] => {
//         if (selectedStatus !== 'all') {
//             return statusConferences?.items || [];
//         } else {
//             return lazyConferencesWithPrices?.items || [];
//         }
//     };

//     const currentConferences = getCurrentConferences();

//     // Get min/max price for a conference (like web)
//     const getMinPrice = (conf: ConferenceResponse) => {
//         if (!conf.conferencePrices || conf.conferencePrices.length === 0) return null;
//         return Math.min(...conf.conferencePrices.map(p => p.ticketPrice || 0));
//     };

//     const getMaxPrice = (conf: ConferenceResponse) => {
//         if (!conf.conferencePrices || conf.conferencePrices.length === 0) return null;
//         return Math.max(...conf.conferencePrices.map(p => p.ticketPrice || 0));
//     };

//     // Filter conferences by banner type and category (like web)
//     const filteredConferences = currentConferences.filter((conf: ConferenceResponse) => {
//         const confType = conf.isResearchConference ? 'research' : 'technical';
//         const matchesBannerFilter = bannerFilter === 'all' || confType === bannerFilter;
//         const matchesCategory = selectedCategory === 'all' || conf.conferenceCategoryId === selectedCategory;

//         return matchesBannerFilter && matchesCategory;
//     });

//     // Sort conferences (like web)
//     const sortedConferences = [...filteredConferences].sort((a, b) => {
//         switch (sortBy) {
//             case 'price-low': {
//                 const aMin = getMinPrice(a) ?? Infinity;
//                 const bMin = getMinPrice(b) ?? Infinity;
//                 return aMin - bMin;
//             }
//             case 'price-high': {
//                 const aMax = getMaxPrice(a) ?? 0;
//                 const bMax = getMaxPrice(b) ?? 0;
//                 return bMax - aMax;
//             }
//             case 'attendees-low':
//                 return (a.totalSlot ?? 0) - (b.totalSlot ?? 0);
//             case 'attendees-high':
//                 return (b.totalSlot ?? 0) - (a.totalSlot ?? 0);
//             case 'date':
//             default:
//                 return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
//         }
//     });

//     // Get pagination data (like web)
//     const getPaginationData = () => {
//         const filteredCount = sortedConferences.length;

//         if (selectedStatus !== 'all') {
//             const apiResponse = statusConferences;
//             if (apiResponse) {
//                 return {
//                     totalPages: apiResponse.totalPages,
//                     totalCount: filteredCount,
//                     currentPage: currentPage,
//                     pageSize: itemsPerPage,
//                     paginatedConferences: sortedConferences
//                 };
//             }
//         } else {
//             const apiResponse = lazyConferencesWithPrices;
//             if (apiResponse) {
//                 return {
//                     totalPages: apiResponse.totalPages,
//                     totalCount: filteredCount,
//                     currentPage: currentPage,
//                     pageSize: itemsPerPage,
//                     paginatedConferences: sortedConferences
//                 };
//             }
//         }

//         return {
//             totalPages: 0,
//             totalCount: filteredCount,
//             currentPage: currentPage,
//             pageSize: itemsPerPage,
//             paginatedConferences: sortedConferences
//         };
//     };

//     const { totalPages, totalCount, paginatedConferences } = getPaginationData();

//     // Loading state
//     const isLoading = lazyWithPricesLoading || statusConferencesLoading || categoriesLoading;

//     // Error state
//     const hasError = lazyWithPricesError || statusConferencesError || categoriesError;

//     if (isLoading) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
//                 <ActivityIndicator size="large" color="#3B82F6" />
//                 <Text style={{ color: 'white', marginTop: 16 }}>Đang tải danh sách hội nghị...</Text>
//             </View>
//         );
//     }

//     if (hasError) {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e', padding: 16 }}>
//                 <Text style={{ color: '#EF4444', marginBottom: 16, textAlign: 'center' }}>Có lỗi xảy ra khi tải dữ liệu</Text>
//                 {/* <Text style={{ color: 'white', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>
//                     {lazyWithPricesError?.data?.Message || statusConferencesError?.data?.Message || categoriesError?.data?.Message}
//                 </Text> */}
//                 <Button mode="contained" onPress={() => {
//                     if (selectedStatus !== 'all') {
//                         const params = {
//                             page: currentPage,
//                             pageSize: itemsPerPage,
//                             ...(searchQuery && { searchKeyword: searchQuery }),
//                             ...(selectedCity !== 'all' && { cityId: selectedCity }),
//                         };
//                         fetchConferencesByStatus(selectedStatus, params);
//                     } else {
//                         const params = {
//                             page: currentPage,
//                             pageSize: itemsPerPage,
//                             ...(searchQuery && { searchKeyword: searchQuery }),
//                             ...(selectedCity !== 'all' && { cityId: selectedCity }),
//                         };
//                         fetchConferencesWithPrices(params);
//                     }
//                 }}>
//                     Thử lại
//                 </Button>
//             </View>
//         );
//     }

//     const formatDate = (dateString?: string) => {
//         if (!dateString) return 'Chưa xác định';
//         return new Date(dateString).toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         });
//     };

//     const renderConferenceCard = ({ item: conference }: { item: ConferenceResponse }) => {
//         const minPrice = getMinPrice(conference);
//         const maxPrice = getMaxPrice(conference);
//         const priceText = minPrice !== null ?
//             (minPrice === maxPrice ? `${minPrice.toLocaleString()}₫` : `${minPrice.toLocaleString()}₫ - ${maxPrice?.toLocaleString()}₫`) :
//             'Miễn phí';

//         return (
//             <TouchableOpacity
//                 onPress={() => navigation.navigate('ConferenceDetails', {
//                     conferenceId: conference.conferenceId,
//                     type: conference.isResearchConference ? 'research' : 'technical'
//                 })}
//             >
//                 <Card style={{
//                     margin: 8,
//                     backgroundColor: '#16213e',
//                     borderRadius: 12,
//                     overflow: 'hidden'
//                 }}>
//                     <Image
//                         source={{ uri: conference.bannerImageUrl || 'https://via.placeholder.com/400x200' }}
//                         style={{ width: '100%', height: 150 }}
//                         resizeMode="cover"
//                     />

//                     <View style={{ padding: 16 }}>
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
//                             <Text style={{
//                                 color: 'white',
//                                 fontSize: 16,
//                                 fontWeight: 'bold',
//                                 flex: 1,
//                                 marginRight: 8
//                             }} numberOfLines={2}>
//                                 {conference.conferenceName}
//                             </Text>
//                             <Chip
//                                 mode="flat"
//                                 style={{
//                                     backgroundColor: conference.isResearchConference ? '#EF4444' : '#3B82F6',
//                                     height: 24
//                                 }}
//                                 textStyle={{ color: 'white', fontSize: 10 }}
//                             >
//                                 {conference.isResearchConference ? 'Research' : 'Technical'}
//                             </Chip>
//                         </View>

//                         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
//                             <IconButton icon="calendar" iconColor="white" size={16} style={{ margin: 0 }} />
//                             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
//                                 {formatDate(conference.startDate)}
//                             </Text>
//                         </View>

//                         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
//                             <IconButton icon="map-marker" iconColor="white" size={16} style={{ margin: 0 }} />
//                             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, flex: 1 }} numberOfLines={1}>
//                                 {conference.address || 'Địa điểm chưa xác định'}
//                             </Text>
//                         </View>

//                         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//                             <IconButton icon="account-group" iconColor="white" size={16} style={{ margin: 0 }} />
//                             <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
//                                 {conference.totalSlot || 0} người tham gia
//                             </Text>
//                         </View>

//                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: 'bold' }}>
//                                 {priceText}
//                             </Text>
//                             <Button
//                                 mode="contained"
//                                 compact
//                                 style={{ backgroundColor: '#EF4444' }}
//                                 onPress={() => navigation.navigate('ConferenceDetails', {
//                                     conferenceId: conference.conferenceId,
//                                     type: conference.isResearchConference ? 'research' : 'technical'
//                                 })}
//                             >
//                                 Chi tiết
//                             </Button>
//                         </View>
//                     </View>
//                 </Card>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <PaperProvider>
//             <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
//                 {/* Header */}
//                 <Surface style={{
//                     backgroundColor: '#16213e',
//                     paddingTop: 40,
//                     paddingHorizontal: 16,
//                     paddingBottom: 16
//                 }}>
//                     <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
//                         Danh sách hội nghị
//                     </Text>

//                     {/* Search Bar */}
//                     <Searchbar
//                         placeholder="Tìm kiếm hội nghị..."
//                         onChangeText={setSearchInput}
//                         value={searchInput}
//                         style={{ backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 16 }}
//                         inputStyle={{ color: 'white' }}
//                         placeholderTextColor="rgba(255,255,255,0.6)"
//                         iconColor="white"
//                     />

//                     {/* Filters */}
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
//                         {/* Status Filter */}
//                         <Portal>
//                             <Menu
//                                 visible={statusMenuVisible}
//                                 onDismiss={() => setStatusMenuVisible(false)}
//                                 anchor={
//                                     <Button
//                                         mode="outlined"
//                                         onPress={() => setStatusMenuVisible(true)}
//                                         style={{ marginRight: 8, borderColor: 'rgba(255,255,255,0.3)' }}
//                                         textColor="white"
//                                     >
//                                         Trạng thái: {selectedStatus === 'all' ? 'Tất cả' : selectedStatus}
//                                     </Button>
//                                 }
//                             >
//                                 <Menu.Item onPress={() => { setSelectedStatus('all'); setStatusMenuVisible(false); }} title="Tất cả" />
//                                 <Menu.Item onPress={() => { setSelectedStatus('upcoming'); setStatusMenuVisible(false); }} title="Sắp diễn ra" />
//                                 <Menu.Item onPress={() => { setSelectedStatus('current'); setStatusMenuVisible(false); }} title="Đang diễn ra" />
//                                 <Menu.Item onPress={() => { setSelectedStatus('past'); setStatusMenuVisible(false); }} title="Đã kết thúc" />
//                             </Menu>
//                         </Portal>

//                         {/* Category Filter */}
//                         <Portal>
//                             <Menu
//                                 visible={categoryMenuVisible}
//                                 onDismiss={() => setCategoryMenuVisible(false)}
//                                 anchor={
//                                     <Button
//                                         mode="outlined"
//                                         onPress={() => setCategoryMenuVisible(true)}
//                                         style={{ marginRight: 8, borderColor: 'rgba(255,255,255,0.3)' }}
//                                         textColor="white"
//                                     >
//                                         Danh mục: {selectedCategory === 'all' ? 'Tất cả' :
//                                             categoriesData?.find(c => c.categoryId === selectedCategory)?.categoryName || 'Tất cả'}
//                                     </Button>
//                                 }
//                             >
//                                 <Menu.Item onPress={() => { setSelectedCategory('all'); setCategoryMenuVisible(false); }} title="Tất cả" />
//                                 {categoriesData?.map((category) => (
//                                     <Menu.Item
//                                         key={category.categoryId}
//                                         onPress={() => {
//                                             setSelectedCategory(category.categoryId);
//                                             setCategoryMenuVisible(false);
//                                         }}
//                                         title={category.categoryName}
//                                     />
//                                 ))}
//                             </Menu>
//                         </Portal>

//                         {/* Sort Filter */}
//                         <Portal>
//                             <Menu
//                                 visible={sortMenuVisible}
//                                 onDismiss={() => setSortMenuVisible(false)}
//                                 anchor={
//                                     <Button
//                                         mode="outlined"
//                                         onPress={() => setSortMenuVisible(true)}
//                                         style={{ marginRight: 8, borderColor: 'rgba(255,255,255,0.3)' }}
//                                         textColor="white"
//                                     >
//                                         Sắp xếp
//                                     </Button>
//                                 }
//                             >
//                                 <Menu.Item onPress={() => { setSortBy('date'); setSortMenuVisible(false); }} title="Ngày diễn ra" />
//                                 <Menu.Item onPress={() => { setSortBy('price-low'); setSortMenuVisible(false); }} title="Giá thấp đến cao" />
//                                 <Menu.Item onPress={() => { setSortBy('price-high'); setSortMenuVisible(false); }} title="Giá cao đến thấp" />
//                                 <Menu.Item onPress={() => { setSortBy('attendees-high'); setSortMenuVisible(false); }} title="Nhiều người tham gia" />
//                                 <Menu.Item onPress={() => { setSortBy('attendees-low'); setSortMenuVisible(false); }} title="Ít người tham gia" />
//                             </Menu>
//                         </Portal>
//                     </ScrollView>

//                     {/* Results count */}
//                     <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
//                         Tìm thấy {totalCount} hội nghị
//                     </Text>
//                 </Surface>

//                 {/* Conference List */}
//                 <FlatList
//                     data={paginatedConferences}
//                     renderItem={renderConferenceCard}
//                     keyExtractor={(item) => item.conferenceId}
//                     numColumns={2}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ padding: 8 }}
//                     ListEmptyComponent={
//                         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
//                             <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
//                                 Không tìm thấy hội nghị nào
//                             </Text>
//                         </View>
//                     }
//                 />

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <Surface style={{
//                         backgroundColor: '#16213e',
//                         padding: 16,
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center'
//                     }}>
//                         <Button
//                             mode="outlined"
//                             disabled={currentPage === 1}
//                             onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                             style={{ borderColor: 'rgba(255,255,255,0.3)' }}
//                             textColor="white"
//                         >
//                             Trước
//                         </Button>

//                         <Text style={{ color: 'white' }}>
//                             Trang {currentPage} / {totalPages}
//                         </Text>

//                         <Button
//                             mode="outlined"
//                             disabled={currentPage === totalPages}
//                             onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                             style={{ borderColor: 'rgba(255,255,255,0.3)' }}
//                             textColor="white"
//                         >
//                             Sau
//                         </Button>
//                     </Surface>
//                 )}
//             </View>
//         </PaperProvider>
//     );
// };

// export default ConferenceListScreen;