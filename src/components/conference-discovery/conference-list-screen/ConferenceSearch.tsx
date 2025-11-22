import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import {
    Chip,
    Searchbar,
    Menu,
    Icon,
    Button
} from 'react-native-paper';
import Slider from '@react-native-community/slider';

interface ConferenceSearchProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    totalCount: number;
    sortBy: string;
    setSortBy: (value: string) => void;
    selectedStatus: string;
    setSelectedStatus: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedCity: string;  // THÊM
    setSelectedCity: (value: string) => void;  // THÊM
    bannerFilter: 'technical' | 'research' | 'all';
    setBannerFilter: (value: 'technical' | 'research' | 'all') => void;
    startDateFilter: Date | null;
    setStartDateFilter: (value: Date | null) => void;
    endDateFilter: Date | null;
    setEndDateFilter: (value: Date | null) => void;
    priceRange: [number, number];  // THÊM
    setPriceRange: (range: [number, number]) => void;  // THÊM
    absoluteMaxPrice: number;  // THÊM
    allPrices: number[];  // THÊM
    sortMenuVisible: boolean;
    setSortMenuVisible: (value: boolean) => void;
    statusMenuVisible: boolean;
    setStatusMenuVisible: (value: boolean) => void;
    categoryMenuVisible: boolean;
    setCategoryMenuVisible: (value: boolean) => void;
    bannerMenuVisible: boolean;
    setBannerMenuVisible: (value: boolean) => void;
    cityMenuVisible: boolean;  // THÊM
    setCityMenuVisible: (value: boolean) => void;  // THÊM
    priceMenuVisible: boolean;  // THÊM
    setPriceMenuVisible: (value: boolean) => void;  // THÊM
    dateMenuVisible: boolean;
    setDateMenuVisible: (value: boolean) => void;
    setDatePickerVisible: (value: boolean) => void;
    categoriesData: any[] | undefined;
    citiesData: any[] | undefined;  // THÊM
    getSortLabel: () => string;
    getStatusLabel: () => string;
    getCategoryLabel: () => string;
    getBannerLabel: () => string;
    getCityLabel: () => string;  // THÊM
}

const ConferenceSearch: React.FC<ConferenceSearchProps> = ({
    searchInput,
    setSearchInput,
    totalCount,
    sortBy,
    setSortBy,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    selectedCity,  // THÊM
    setSelectedCity,  // THÊM
    bannerFilter,
    setBannerFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    priceRange,  // THÊM
    setPriceRange,  // THÊM
    absoluteMaxPrice,  // THÊM
    allPrices,  // THÊM
    sortMenuVisible,
    setSortMenuVisible,
    statusMenuVisible,
    setStatusMenuVisible,
    categoryMenuVisible,
    setCategoryMenuVisible,
    bannerMenuVisible,
    setBannerMenuVisible,
    cityMenuVisible,  // THÊM
    setCityMenuVisible,  // THÊM
    priceMenuVisible,  // THÊM
    setPriceMenuVisible,  // THÊM
    dateMenuVisible,
    setDateMenuVisible,
    setDatePickerVisible,
    categoriesData,
    citiesData,  // THÊM
    getSortLabel,
    getStatusLabel,
    getCategoryLabel,
    getBannerLabel,
    getCityLabel  // THÊM
}) => {
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

    return (
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
                    key={`menu-sort-${sortMenuVisible}`}
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
                {/* <Menu
                    key={`menu-status-${statusMenuVisible}`}
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
                </Menu> */}

                {/* Category Menu */}
                <Menu
                    key={`menu-category-${categoryMenuVisible}`}
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
                            key={category.conferenceCategoryId}
                            onPress={() => {
                                setSelectedCategory(category.conferenceCategoryId);
                                setCategoryMenuVisible(false);
                            }}
                            title={category.categoryName}
                            titleStyle={{ color: '#F6F1F1' }}
                        />
                    ))}
                </Menu>

                {/* Banner Type Menu */}
                <Menu
                    key={`menu-banner-${bannerMenuVisible}`}
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

                {/* Start Date Filter */}
                <Menu
                    key={`menu-date-${dateMenuVisible}`}
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
                            setDatePickerVisible(true);
                        }}
                        title="Chọn khoảng thời gian"
                        titleStyle={{ color: '#F6F1F1' }}
                    />
                </Menu>

                <Menu
                    key={`menu-city-${cityMenuVisible}`}
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
                            <Icon source="map-marker" size={16} color="#19A7CE" />
                            <Text style={{ color: '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                {getCityLabel()}
                            </Text>
                            <Icon source="chevron-down" size={16} color="#19A7CE" />
                        </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)' }}
                >
                    <Menu.Item
                        onPress={() => {
                            setSelectedCity('all');
                            setCityMenuVisible(false);
                        }}
                        title="Tất cả thành phố"
                        titleStyle={{ color: '#F6F1F1' }}
                    />
                    {citiesData?.map((city) => (
                        <Menu.Item
                            key={city.cityId}
                            onPress={() => {
                                setSelectedCity(city.cityId);
                                setCityMenuVisible(false);
                            }}
                            title={city.cityName ?? 'Không xác định'}
                            titleStyle={{ color: '#F6F1F1' }}
                        />
                    ))}
                </Menu>

                {/* Price Menu - THÊM */}
                <Menu
                    key={`menu-price-${priceMenuVisible}`}
                    visible={priceMenuVisible}
                    onDismiss={() => setPriceMenuVisible(false)}
                    anchor={
                        <TouchableOpacity
                            onPress={() => setPriceMenuVisible(true)}
                            disabled={!allPrices.length}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: !allPrices.length ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                paddingHorizontal: 12,
                                paddingVertical: 8,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.2)',
                                marginRight: 8
                            }}
                        >
                            <Icon source="currency-usd" size={16} color={!allPrices.length ? 'rgba(25, 167, 206, 0.5)' : "#19A7CE"} />
                            <Text style={{ color: !allPrices.length ? 'rgba(246, 241, 241, 0.5)' : '#F6F1F1', marginLeft: 8, marginRight: 4, fontSize: 14 }}>
                                Giá
                            </Text>
                            <Icon source="chevron-down" size={16} color={!allPrices.length ? 'rgba(25, 167, 206, 0.5)' : "#19A7CE"} />
                        </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.95)', width: 300 }}
                >
                    <View style={{ padding: 16 }}>
                        {allPrices.length > 0 ? (
                            <>
                                <Text style={{ color: '#F6F1F1', marginBottom: 12, fontWeight: '600' }}>
                                    Khoảng giá (VND)
                                </Text>

                                <Text style={{ color: 'rgba(246, 241, 241, 0.7)', fontSize: 12, marginBottom: 8 }}>
                                    Từ: {priceRange[0].toLocaleString()}đ
                                </Text>

                                {/* Note: Bạn cần cài @react-native-community/slider */}
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={absoluteMaxPrice}
                                    step={50000}
                                    value={priceRange[0]}
                                    onValueChange={(value) => setPriceRange([value, priceRange[1]])}
                                    minimumTrackTintColor="#19A7CE"
                                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                                    thumbTintColor="#19A7CE"
                                />

                                <Text style={{ color: 'rgba(246, 241, 241, 0.7)', fontSize: 12, marginBottom: 8, marginTop: 16 }}>
                                    Đến: {priceRange[1].toLocaleString()}đ
                                </Text>

                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={absoluteMaxPrice}
                                    step={50000}
                                    value={priceRange[1]}
                                    onValueChange={(value) => setPriceRange([priceRange[0], value])}
                                    minimumTrackTintColor="#19A7CE"
                                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                                    thumbTintColor="#19A7CE"
                                />

                                <Button
                                    mode="contained"
                                    onPress={() => setPriceMenuVisible(false)}
                                    style={{ marginTop: 16 }}
                                    buttonColor="#19A7CE"
                                    textColor="#000000"
                                >
                                    Áp dụng
                                </Button>

                                <Button
                                    mode="text"
                                    onPress={() => {
                                        setPriceRange([0, absoluteMaxPrice]);
                                        setPriceMenuVisible(false);
                                    }}
                                    style={{ marginTop: 8 }}
                                    textColor="#F6F1F1"
                                >
                                    Đặt lại
                                </Button>
                            </>
                        ) : (
                            <Text style={{ color: '#EF4444', fontSize: 12, fontStyle: 'italic' }}>
                                Bộ lọc giá hiện không khả dụng
                            </Text>
                        )}
                    </View>
                </Menu>
            </ScrollView>

            {/* Quick Filter Chips */}
            {/* <ScrollView
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
            </ScrollView> */}

            <View style={{ marginTop: 12 }}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        setSearchInput('');
                        setSelectedCategory('all');
                        setSelectedCity('all');
                        setSelectedStatus('all');
                        setBannerFilter('all');
                        setStartDateFilter(null);
                        setEndDateFilter(null);
                        setPriceRange([0, absoluteMaxPrice]);
                        setSortBy('date');
                    }}
                    style={{
                        borderColor: '#EF4444',
                        borderWidth: 1
                    }}
                    textColor="#EF4444"
                    icon="close-circle"
                >
                    Xóa tất cả bộ lọc
                </Button>
            </View>
        </View>
    );
};

export default ConferenceSearch;