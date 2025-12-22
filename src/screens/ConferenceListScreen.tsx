import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import {
    Button,
    ActivityIndicator,
    PaperProvider,
    Icon
} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates';
import { useConference } from '@/hooks/useConference';
import { useConferenceCategory } from '@/hooks/useConferenceCategory';
import { ConferencePriceResponse, ConferenceResponse } from '@/types/conference.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/HomeStack';
import ConferenceListWithPagination from '@/components/conference-discovery/conference-list-screen/ConferenceListWithPagination';
import ConferenceSearch from '@/components/conference-discovery/conference-list-screen/ConferenceSearch';
import ConferenceCard from '@/components/conference-discovery/conference-list-screen/ConferenceCard';
import { useGetAllCitiesQuery } from '@/store/api/cityApi';


type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

registerTranslation('en', en);

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
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState(0);
    const [allPrices, setAllPrices] = useState<number[]>([]);

    const [isComplete, setIsComplete] = useState(false);

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

    const {
        data: citiesData,
        isLoading: citiesLoading,
        error: citiesError,
    } = useGetAllCitiesQuery();

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
        // if (selectedStatus !== 'all') {
        //     const params = {
        //         page: currentPage,
        //         pageSize: itemsPerPage,
        //         ...(searchQuery && { searchKeyword: searchQuery }),
        //         ...(selectedCity !== 'all' && { cityId: selectedCity }),
        //         ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
        //         ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] })
        //     };
        //     fetchConferencesByStatus(selectedStatus, params);
        // } else {
        const params = {
            page: currentPage,
            pageSize: itemsPerPage,
            ...(searchQuery && { searchKeyword: searchQuery }),
            ...(selectedCity !== 'all' && { cityId: selectedCity }),
            ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
            ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] }),
            isComplete,
        };
        fetchConferencesWithPrices(params);
        // }
    }, [currentPage, searchQuery, selectedCity, startDateFilter, endDateFilter, isComplete, fetchConferencesWithPrices]);

    const refetchList = () => {
        const params = {
            page: currentPage,
            pageSize: itemsPerPage,
            ...(searchQuery && { searchKeyword: searchQuery }),
            ...(selectedCity !== 'all' && { cityId: selectedCity }),
            ...(startDateFilter && { startDate: startDateFilter.toISOString().split('T')[0] }),
            ...(endDateFilter && { endDate: endDateFilter.toISOString().split('T')[0] }),
            isComplete,
        };

        // if (selectedStatus !== 'all') {
        //     fetchConferencesByStatus(selectedStatus, params);
        // } else {
        fetchConferencesWithPrices(params);
        // }
    };

    const getCurrentConferences = (): ConferenceResponse[] => {
        if (selectedStatus !== 'all') {
            return statusConferences?.items || [];
        } else {
            return lazyConferencesWithPrices?.items || [];
        }
    };

    const getCurrentPrice = (priceObj: ConferencePriceResponse) => {
        return priceObj?.ticketPrice || 0;
    };

    const currentConferences = getCurrentConferences();

    useEffect(() => {
        const prices = currentConferences.flatMap((conf) =>
            (conf?.conferencePrices ?? [])
                .map((p) => getCurrentPrice(p))
                .filter((price) => typeof price === "number" && price > 0)
        );

        setAllPrices(prices);

        const maxPrice = prices.length ? Math.max(...prices) : 0;
        setAbsoluteMaxPrice(maxPrice);

        if (maxPrice > 0) {
            setPriceRange([0, maxPrice]);
        }
    }, [currentConferences]);

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
        // const now = new Date();
        // const start = new Date(conf.startDate || '');
        // const end = new Date(conf.endDate || '');

        // const matchesStatus =
        //     selectedStatus === 'all' ||
        //     (selectedStatus === 'upcoming' && start > now) ||
        //     (selectedStatus === 'current' && start <= now && end >= now) ||
        //     (selectedStatus === 'past' && end < now);

        const matchesCategory = selectedCategory === 'all' || conf.conferenceCategoryId === selectedCategory;

        // Thêm city filter
        const matchesCity = selectedCity === 'all' || conf.cityId === selectedCity;

        // Price filter logic
        const minPrice = getMinPrice(conf);
        const maxPrice = getMaxPrice(conf);

        const priceRangeActive = priceRange[0] > 0 || priceRange[1] < absoluteMaxPrice;
        const matchesPrice = minPrice !== null && maxPrice !== null
            ? minPrice <= priceRange[1] && maxPrice >= priceRange[0]
            : !priceRangeActive;

        return matchesBannerFilter && matchesCategory && matchesCity && matchesPrice;
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

    const cities = [
        { value: 'all', label: 'Tất cả thành phố' },
        ...(citiesData?.data?.map((city) => ({
            value: city.cityId,
            label: city.cityName ?? 'Thành phố không xác định',
        })) || []),
    ];

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

    const getCityLabel = () => {
        if (selectedCity === 'all') return 'Tất cả';
        const city = citiesData?.data?.find(c => c.cityId === selectedCity);
        return city?.cityName || 'Thành phố';
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
        const category = categoriesData.find(cat => cat.conferenceCategoryId === conference.conferenceCategoryId);
        return category?.conferenceCategoryName || 'General';
    };

    const renderConferenceCard = ({ item: conference }: { item: ConferenceResponse }) => {
        return (
            <ConferenceCard
                conference={conference}
                onPress={(conferenceId, type) => navigation.navigate('ConferenceDetails', { conferenceId, type })}
                formatDate={formatDate}
                getCategoryName={getCategoryName}
                getMinPrice={getMinPrice}
                getMaxPrice={getMaxPrice}
            />
        );
    };

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
        const category = categoriesData?.find(c => c.conferenceCategoryId === selectedCategory);
        return category?.conferenceCategoryName || 'Danh mục';
    };

    const getBannerLabel = () => {
        switch (bannerFilter) {
            case 'all': return 'Tất cả';
            case 'technical': return 'Technical';
            case 'research': return 'Research';
            default: return 'Loại';
        }
    };

    const onDateConfirm = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
        setDatePickerVisible(false);
        setStartDateFilter(startDate || null);
        setEndDateFilter(endDate || null);
    };

    const onDateDismiss = () => {
        setDatePickerVisible(false);
    };

    return (
        <PaperProvider>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                {/* Search and Filter Component */}
                <ConferenceSearch
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    totalCount={totalCount}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedCity={selectedCity}  // Thêm
                    setSelectedCity={setSelectedCity}
                    bannerFilter={bannerFilter}
                    setBannerFilter={setBannerFilter}
                    startDateFilter={startDateFilter}
                    setStartDateFilter={setStartDateFilter}
                    endDateFilter={endDateFilter}
                    setEndDateFilter={setEndDateFilter}
                    priceRange={priceRange}  // Thêm
                    setPriceRange={setPriceRange}
                    absoluteMaxPrice={absoluteMaxPrice}  // Thêm
                    allPrices={allPrices}
                    sortMenuVisible={sortMenuVisible}
                    setSortMenuVisible={setSortMenuVisible}
                    statusMenuVisible={statusMenuVisible}
                    setStatusMenuVisible={setStatusMenuVisible}
                    categoryMenuVisible={categoryMenuVisible}
                    setCategoryMenuVisible={setCategoryMenuVisible}
                    bannerMenuVisible={bannerMenuVisible}
                    setBannerMenuVisible={setBannerMenuVisible}
                    cityMenuVisible={cityMenuVisible}  // Thêm
                    setCityMenuVisible={setCityMenuVisible}  // Thêm
                    priceMenuVisible={priceMenuVisible}  // Thêm
                    setPriceMenuVisible={setPriceMenuVisible}
                    dateMenuVisible={dateMenuVisible}
                    setDateMenuVisible={setDateMenuVisible}
                    setDatePickerVisible={setDatePickerVisible}
                    categoriesData={categoriesData}
                    citiesData={citiesData?.data}
                    getSortLabel={getSortLabel}
                    getStatusLabel={getStatusLabel}
                    getCategoryLabel={getCategoryLabel}
                    getBannerLabel={getBannerLabel}
                    getCityLabel={getCityLabel}

                    isComplete={isComplete}
                    setIsComplete={setIsComplete}
                />

                {/* Conference List with Pagination Component */}
                <ConferenceListWithPagination
                    paginatedConferences={paginatedConferences}
                    renderConferenceCard={renderConferenceCard}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    refetchList={refetchList}
                    refetching={lazyWithPricesLoading}
                />

                <DatePickerModal
                    locale="vi"
                    mode="range"
                    visible={datePickerVisible}
                    onDismiss={onDateDismiss}
                    startDate={startDateFilter || undefined}
                    endDate={endDateFilter || undefined}
                    onConfirm={onDateConfirm}
                    saveLabel="Áp dụng"
                    label="Chọn khoảng thời gian"
                    startLabel="Từ ngày"
                    endLabel="Đến ngày"
                />
            </View>
        </PaperProvider>
    );
};

export default ConferenceListScreen;