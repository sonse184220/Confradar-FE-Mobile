import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, } from 'react-native';
import {
    Chip,
    Searchbar,
    Menu,
    Icon
} from 'react-native-paper';

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
    bannerFilter: 'technical' | 'research' | 'all';
    setBannerFilter: (value: 'technical' | 'research' | 'all') => void;
    startDateFilter: Date | null;
    setStartDateFilter: (value: Date | null) => void;
    endDateFilter: Date | null;
    setEndDateFilter: (value: Date | null) => void;
    sortMenuVisible: boolean;
    setSortMenuVisible: (value: boolean) => void;
    statusMenuVisible: boolean;
    setStatusMenuVisible: (value: boolean) => void;
    categoryMenuVisible: boolean;
    setCategoryMenuVisible: (value: boolean) => void;
    bannerMenuVisible: boolean;
    setBannerMenuVisible: (value: boolean) => void;
    dateMenuVisible: boolean;
    setDateMenuVisible: (value: boolean) => void;
    categoriesData: any[] | undefined;
    getSortLabel: () => string;
    getStatusLabel: () => string;
    getCategoryLabel: () => string;
    getBannerLabel: () => string;
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
    bannerFilter,
    setBannerFilter,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,
    sortMenuVisible,
    setSortMenuVisible,
    statusMenuVisible,
    setStatusMenuVisible,
    categoryMenuVisible,
    setCategoryMenuVisible,
    bannerMenuVisible,
    setBannerMenuVisible,
    dateMenuVisible,
    setDateMenuVisible,
    categoriesData,
    getSortLabel,
    getStatusLabel,
    getCategoryLabel,
    getBannerLabel
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
                <Menu
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
                </Menu>

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
                            // TODO: Open date picker modal
                            console.log('Open date picker');
                        }}
                        title="Chọn khoảng thời gian"
                        titleStyle={{ color: '#F6F1F1' }}
                    />
                </Menu>
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
    );
};

export default ConferenceSearch;