import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Card,
    TextInput,
    Button,
    Chip,
    IconButton,
    Searchbar,
    Surface,
    Divider,
    Icon,
    Menu,
    Portal,
    PaperProvider,
    ActivityIndicator
} from 'react-native-paper';
import { useConference } from '../hooks/useConference';
import { useConferenceCategory } from '../hooks/useConferenceCategory';
import type { ConferenceResponse } from '../store/api/conferenceApi';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';

const { width: screenWidth } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ConferenceListScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [filterMenuVisible, setFilterMenuVisible] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const sortButtonRef = useRef(null);
    const filterButtonRef = useRef(null);

    const [sortAnchor, setSortAnchor] = useState({ x: 0, y: 0 });

    // API calls using custom hooks
    const {
        conferences,
        loading: conferencesLoading,
        error: conferencesError,
        fetchConferences,
        refetchConferences
    } = useConference();

    const {
        categories: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
        fetchCategories,
        refetchCategories
    } = useConferenceCategory();

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchConferences();
                await fetchCategories();
            } catch (error) {
                console.log('Error loading data:', error);
            }
        };
        loadData();
    }, [fetchConferences, fetchCategories]);

    // Retry function
    const handleRetry = async () => {
        setRetryCount(prev => prev + 1);
        try {
            await fetchConferences();
            await fetchCategories();
        } catch (error) {
            console.log('Retry failed:', error);
        }
    };

    // Effect to handle errors and show retry option
    useEffect(() => {
        // Chỉ show error khi không đang loading và có error
        if ((conferencesError || categoriesError) && !conferencesLoading && !categoriesLoading) {
            Alert.alert(
                'Error Loading Data',
                conferencesError || categoriesError || 'Failed to load data. Please try again.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Retry',
                        onPress: handleRetry
                    }
                ]
            );
        }
    }, [conferencesError, categoriesError, conferencesLoading, categoriesLoading]);
    // useEffect(() => {
    //     if (conferencesError || categoriesError) {
    //         Alert.alert(
    //             'Error Loading Data',
    //             conferencesError || categoriesError || 'Failed to load data. Please try again.',
    //             [
    //                 { text: 'Cancel', style: 'cancel' },
    //                 {
    //                     text: 'Retry',
    //                     onPress: handleRetry
    //                 }
    //             ]
    //         );
    //     }
    // }, [conferencesError, categoriesError]);

    // Helper function to determine conference status
    const getConferenceStatus = (conference: ConferenceResponse) => {
        if (!conference.startDate) return 'upcoming';

        const now = new Date();
        const startDate = new Date(conference.startDate);
        const endDate = conference.endDate ? new Date(conference.endDate) : startDate;

        if (now >= startDate && now <= endDate) {
            return 'current';
        } else if (now < startDate) {
            return 'upcoming';
        } else {
            return 'past';
        }
    };

    // Helper function to check if conference is free
    const isConferenceFree = (conference: ConferenceResponse) => {
        if (!conference.prices || conference.prices.length === 0) return true;
        return conference.prices.some(price => (price.ticketPrice || 0) === 0);
    };

    // Helper function to get minimum price
    const getMinPrice = (conference: ConferenceResponse) => {
        if (!conference.prices || conference.prices.length === 0) return 0;
        const prices = conference.prices.map(price => price.ticketPrice || 0);
        return Math.min(...prices);
    };

    // Helper function to format price display
    const formatPrice = (conference: ConferenceResponse) => {
        if (isConferenceFree(conference)) return 'Free';
        const minPrice = getMinPrice(conference);
        return minPrice > 0 ? `$${minPrice}` : 'Free';
    };

    // Helper function to get category name by conference
    const getCategoryName = (conference: ConferenceResponse) => {
        if (!categoriesData || !conference.categoryId) return 'General';
        const category = categoriesData.find(cat => cat.categoryId === conference.categoryId);
        return category?.categoryName || 'General';
    };

    // Dynamic filter options based on API categories
    const filterOptions = useMemo(() => {
        const baseOptions = [
            { key: 'all', label: 'All Events' },
            { key: 'current', label: 'Live Now' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'free', label: 'Free' }
        ];

        if (categoriesData && categoriesData.length > 0) {
            const categoryOptions = categoriesData.map((cat, index) => ({
                // key: cat.categoryId.toString(),
                // label: cat.categoryName
                key: (cat?.categoryId ?? `unknown-${index}`).toString(),
                label: cat?.categoryName ?? 'Unknown'
            }));
            return [...baseOptions, ...categoryOptions];
        }

        return baseOptions;
    }, [categoriesData]);

    const sortOptions = [
        { key: 'date', label: 'Date' },
        { key: 'price', label: 'Price' },
        { key: 'rating', label: 'Rating' },
        { key: 'attendees', label: 'Popularity' },
        { key: 'title', label: 'Name' }
    ];

    // Filter and sort data from API
    const filteredAndSortedData = useMemo(() => {
        if (!conferences || conferences.length === 0) return [];

        let filtered = conferences.filter(conference => {
            // Search filter
            const categoryName = getCategoryName(conference);
            const matchesSearch =
                (conference.conferenceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (conference.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (conference.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                categoryName.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Category filter
            if (selectedFilter === 'all') return true;
            if (selectedFilter === 'free') return isConferenceFree(conference);
            if (selectedFilter === 'current') return getConferenceStatus(conference) === 'current';
            if (selectedFilter === 'upcoming') return getConferenceStatus(conference) === 'upcoming';

            // Category-based filter (by categoryId)
            if (!isNaN(Number(selectedFilter))) {
                return conference.categoryId === selectedFilter;
            }

            return true;
        });

        // Sort data
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                    return dateA - dateB;
                case 'price':
                    return getMinPrice(a) - getMinPrice(b);
                case 'title':
                    return (a.conferenceName || '').localeCompare(b.conferenceName || '');
                case 'capacity':
                    return (b.capacity || 0) - (a.capacity || 0);
                case 'name':
                    return (a.conferenceName || '').localeCompare(b.conferenceName || '');
                default:
                    return 0;
            }
        });

        return filtered;
    }, [conferences, categoriesData, searchQuery, selectedFilter, sortBy]);

    const ConferenceCard = ({ conference }: { conference: ConferenceResponse }) => {
        const categoryName = getCategoryName(conference);
        const status = getConferenceStatus(conference);
        const priceDisplay = formatPrice(conference);

        // Format date display
        const formatDateDisplay = () => {
            if (!conference.startDate) return 'TBA';
            const startDate = new Date(conference.startDate);
            if (!conference.endDate) return startDate.toLocaleDateString();
            const endDate = new Date(conference.endDate);
            if (startDate.getTime() === endDate.getTime()) {
                return startDate.toLocaleDateString();
            }
            return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        };

        const dateDisplay = formatDateDisplay();

        return (
            <View className="mb-4 mx-4">
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
                        className="p-4"
                    >
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1">
                                <Chip
                                    mode="outlined"
                                    className="bg-white/20 self-start mb-2"
                                    textStyle={{ color: '#F6F1F1', fontSize: 12 }}
                                >
                                    {categoryName}
                                </Chip>
                                <Text
                                    className="text-white font-bold text-lg leading-tight"
                                    numberOfLines={2}
                                    style={{ color: '#F6F1F1' }}
                                >
                                    {conference.conferenceName || 'Untitled Conference'}
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

                    <Card.Content className="p-4">
                        <View className="flex-row justify-between mb-4">
                            <View className="flex-1 space-y-2">
                                <View className="flex-row items-center">
                                    <Icon source="calendar" size={16} color="#19A7CE" />
                                    <Text className="text-gray-300 text-sm ml-2 flex-1" numberOfLines={1}>
                                        {dateDisplay}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Icon source="map-marker" size={16} color="#19A7CE" />
                                    <Text className="text-gray-300 text-sm ml-2 flex-1" numberOfLines={1}>
                                        {conference.address || 'Location TBA'}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Icon source="account-group" size={16} color="#19A7CE" />
                                    <Text className="text-gray-300 text-sm ml-2 flex-1" numberOfLines={1}>
                                        {conference.capacity ? `${conference.capacity} capacity` : 'Capacity TBA'}
                                    </Text>
                                </View>
                            </View>

                            <View className="items-end justify-between ml-4">
                                <View className="flex-row items-center mb-2">
                                    <Icon source="clock" size={16} color="#FFD700" />
                                    <Text className="text-white text-sm ml-1" style={{ color: '#F6F1F1' }}>
                                        {status}
                                    </Text>
                                </View>
                                <Text className="text-white font-bold text-lg" style={{ color: '#F6F1F1' }}>
                                    {priceDisplay}
                                </Text>
                            </View>
                        </View>

                        <Divider className="my-3 bg-white/20" />

                        <View className="flex-row justify-between items-center">
                            <View className="flex-1 mr-3">
                                <Text className="text-gray-400 text-xs mb-1">
                                    Status: {status.charAt(0).toUpperCase() + status.slice(1)} | {conference.isActive ? 'Active' : 'Inactive'}
                                </Text>
                                {conference.description && (
                                    <Text className="text-gray-400 text-xs" numberOfLines={2}>
                                        {conference.description}
                                    </Text>
                                )}
                                {conference.isResearchConference && (
                                    <Text className="text-blue-400 text-xs mt-1">
                                        Research Conference
                                    </Text>
                                )}
                            </View>
                            <Button
                                mode="contained"
                                buttonColor="#19A7CE"
                                textColor="#000000"
                                style={{ borderRadius: 12 }}
                                compact
                                onPress={() => {
                                    navigation.navigate('ConferenceDetails', {
                                        conferenceId: conference.conferenceId.toString(),
                                    });
                                }}
                            >
                                View Details
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );
    };

    const FilterChip = ({ filter }: { filter: any }) => (
        <Chip
            key={filter.key}
            mode={selectedFilter === filter.key ? 'flat' : 'outlined'}
            selected={selectedFilter === filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={{
                marginRight: 8,
                backgroundColor: selectedFilter === filter.key
                    ? 'rgba(25, 167, 206, 0.2)'
                    : 'rgba(246, 241, 241, 0.1)',
                borderColor: selectedFilter === filter.key
                    ? '#19A7CE'
                    : 'rgba(246, 241, 241, 0.3)',
            }}
            textStyle={{
                color: selectedFilter === filter.key ? '#F6F1F1' : 'rgba(246, 241, 241, 0.7)',
                fontSize: 12
            }}
        >
            {filter.label}
        </Chip>
    );

    // Show loading state
    if (conferencesLoading || categoriesLoading) {
        return (
            <PaperProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#19A7CE" />
                    <Text style={{ color: '#F6F1F1', marginTop: 16, fontSize: 16 }}>
                        Loading conferences...
                    </Text>
                </View>
            </PaperProvider>
        );
    }

    // Show error state with retry option
    if ((conferencesError || categoriesError) && (!conferences || conferences.length === 0)) {
        return (
            <PaperProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
                    <Icon source="alert-circle" size={64} color="rgba(246, 241, 241, 0.5)" />
                    <Text style={{ color: '#F6F1F1', marginTop: 16, fontSize: 18, textAlign: 'center' }}>
                        Failed to load conferences
                    </Text>
                    <Text style={{ color: 'rgba(246, 241, 241, 0.7)', marginTop: 8, fontSize: 14, textAlign: 'center' }}>
                        {/* {conferencesMessage || 'Please check your internet connection and try again.'} */}
                    </Text>
                    <Button
                        mode="contained"
                        buttonColor="#19A7CE"
                        textColor="#000000"
                        style={{ marginTop: 24, borderRadius: 12 }}
                        onPress={handleRetry}
                        loading={conferencesLoading || categoriesLoading}
                    >
                        Retry
                    </Button>
                </View>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <View style={{ flex: 1 }}>
                {/* Header Section - Fixed */}
                <View className="px-4 pt-16 pb-4" style={{ backgroundColor: 'transparent' }}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-bold text-2xl flex-1" style={{ color: '#F6F1F1' }}>
                            Conference List
                        </Text>
                        <Text className="text-sm" style={{ color: 'rgba(246, 241, 241, 0.7)' }}>
                            {filteredAndSortedData.length} events
                        </Text>
                    </View>

                    {/* Search Bar */}
                    <Searchbar
                        placeholder="Search conferences, locations, categories..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
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

                    {/* Controls Row - Sort and Filter */}
                    <View className="flex-row justify-between items-center mb-3">
                        {/* Sort Button */}
                        <DropdownMenuButton
                            label={`Sort: ${sortOptions.find(s => s.key === sortBy)?.label}`}
                            options={sortOptions}
                            selectedKey={sortBy}
                            onSelect={(key) => setSortBy(key)}
                            iconName="sort"
                        />
                        {/* <View>
                            <TouchableOpacity
                                ref={sortButtonRef}
                                onPress={() => setSortMenuVisible(true)}
                                className="flex-row items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20"
                            >
                                <Icon source="sort" size={16} color="#19A7CE" />
                                <Text className="text-white ml-2 text-sm" style={{ color: '#F6F1F1' }}>
                                    Sort: {sortOptions.find(s => s.key === sortBy)?.label}
                                </Text>
                                <Icon source="chevron-down" size={16} color="#19A7CE" />
                            </TouchableOpacity>

                            <Menu
                                visible={sortMenuVisible}
                                onDismiss={() => setSortMenuVisible(false)}
                                anchor={{ x: 0, y: 0 }}
                                contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.9)' }}
                            >
                                {sortOptions.map((option) => (
                                    <Menu.Item
                                        key={option.key}
                                        onPress={() => {
                                            setSortBy(option.key);
                                            setSortMenuVisible(false);
                                        }}
                                        title={option.label}
                                        titleStyle={{ color: '#F6F1F1' }}
                                    />
                                ))}
                            </Menu>
                        </View> */}
                        {/* <View>
                            <Menu
                                visible={sortMenuVisible}
                                onDismiss={() => setSortMenuVisible(false)}
                                anchor={
                                    <TouchableOpacity
                                        onPress={() => setSortMenuVisible(true)}
                                        className="flex-row items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20"
                                    >
                                        <Icon source="sort" size={16} color="#19A7CE" />
                                        <Text className="text-white ml-2 text-sm" style={{ color: '#F6F1F1' }}>
                                            Sort: {sortOptions.find(s => s.key === sortBy)?.label}
                                        </Text>
                                        <Icon source="chevron-down" size={16} color="#19A7CE" />
                                    </TouchableOpacity>
                                }
                                contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.9)' }}
                            >
                                {sortOptions.map((option) => (
                                    <Menu.Item
                                        key={option.key}
                                        onPress={() => {
                                            setSortBy(option.key);
                                            setSortMenuVisible(false);
                                        }}
                                        title={option.label}
                                        titleStyle={{ color: '#F6F1F1' }}
                                    />
                                ))}
                            </Menu></View> */}

                        {/* Filter Button */}
                        <Menu
                            key={`filter-${filterMenuVisible}`}
                            visible={filterMenuVisible}
                            onDismiss={() => setFilterMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setFilterMenuVisible(true)}
                                    className="flex-row items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20"
                                >
                                    <Icon source="filter" size={16} color="#19A7CE" />
                                    <Text className="text-white ml-2 text-sm" style={{ color: '#F6F1F1' }}>
                                        Filter: {filterOptions.find(f => f.key === selectedFilter)?.label}
                                    </Text>
                                    <Icon source="chevron-down" size={16} color="#19A7CE" />
                                </TouchableOpacity>
                            }
                            contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.9)' }}
                        >
                            {filterOptions.map((option) => (
                                <Menu.Item
                                    key={option.key}
                                    onPress={() => {
                                        setSelectedFilter(option.key);
                                        setFilterMenuVisible(false);
                                    }}
                                    title={option.label}
                                    titleStyle={{ color: '#F6F1F1' }}
                                />
                            ))}
                        </Menu>
                    </View>

                    {/* Quick Filter Chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {filterOptions.slice(0, 5).map((filter) => (
                            <FilterChip key={filter.key} filter={filter} />
                        ))}
                    </ScrollView>
                </View>

                {/* Conference List - Scrollable */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={filteredAndSortedData}
                        renderItem={({ item }) => <ConferenceCard conference={item} />}
                        keyExtractor={(item) => item.conferenceId.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-16">
                                <Icon source="calendar-search" size={64} color="rgba(246, 241, 241, 0.3)" />
                                <Text className="text-center text-lg mt-4 mb-2" style={{ color: 'rgba(246, 241, 241, 0.7)' }}>
                                    {conferences && conferences.length > 0 ? 'No conferences match your filters' : 'No conferences available'}
                                </Text>
                                <Text className="text-center text-sm px-8" style={{ color: 'rgba(246, 241, 241, 0.5)' }}>
                                    {conferences && conferences.length > 0
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Please check back later for new conferences'
                                    }
                                </Text>
                                {conferences && conferences.length === 0 && (
                                    <Button
                                        mode="outlined"
                                        textColor="#19A7CE"
                                        style={{ marginTop: 16, borderColor: '#19A7CE' }}
                                        onPress={handleRetry}
                                        loading={conferencesLoading || categoriesLoading}
                                    >
                                        Refresh
                                    </Button>
                                )}
                            </View>
                        }
                    />
                </View>
            </View>
        </PaperProvider>
    );
};

export default ConferenceListScreen;

type DropdownMenuButtonProps = {
    label: string;
    options: { key: string; label: string }[];
    selectedKey: string;
    onSelect: (key: string) => void;
    iconName?: string;
};

export const DropdownMenuButton = React.memo(
    ({ label, options, selectedKey, onSelect, iconName = 'menu' }: DropdownMenuButtonProps) => {
        const [visible, setVisible] = React.useState(false);
        const anchorRef = React.useRef<View>(null);

        return (
            <View ref={anchorRef}>
                <Menu
                    key={`menu-${visible}`}
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <TouchableOpacity
                            onPress={() => setVisible(true)}
                            className="flex-row items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20"
                        >
                            <Icon source={iconName} size={16} color="#19A7CE" />
                            <Text className="text-white ml-2 text-sm" style={{ color: '#F6F1F1' }}>
                                {label}
                            </Text>
                            <Icon source="chevron-down" size={16} color="#19A7CE" />
                        </TouchableOpacity>
                    }
                    contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.9)' }}
                    anchorPosition="bottom"
                >
                    {options.map((option) => (
                        <Menu.Item
                            key={option.key}
                            onPress={() => {
                                onSelect(option.key);
                                setVisible(false);
                            }}
                            title={option.label}
                            titleStyle={{ color: '#F6F1F1' }}
                        />
                    ))}
                </Menu>
            </View>
        );
    }
);

// export const DropdownMenuButton = React.memo(
//     ({ label, options, selectedKey, onSelect, iconName = 'menu' }: DropdownMenuButtonProps) => {
//         const [visible, setVisible] = React.useState(false);

//         return (
//             <Menu
//                 visible={visible}
//                 onDismiss={() => setVisible(false)}
//                 anchor={
//                     <TouchableOpacity
//                         onPress={() => setVisible(true)}
//                         className="flex-row items-center bg-white/10 px-3 py-2 rounded-lg border border-white/20"
//                     >
//                         <Icon source={iconName} size={16} color="#19A7CE" />
//                         <Text className="text-white ml-2 text-sm">{label}</Text>
//                         <Icon source="chevron-down" size={16} color="#19A7CE" />
//                     </TouchableOpacity>
//                 }
//                 contentStyle={{ backgroundColor: 'rgba(20, 108, 148, 0.9)' }}
//             >
//                 {options.map((option) => (
//                     <Menu.Item
//                         key={option.key}
//                         onPress={() => {
//                             onSelect(option.key);
//                             setVisible(false);
//                         }}
//                         title={option.label}
//                         titleStyle={{ color: '#F6F1F1' }}
//                     />
//                 ))}
//             </Menu>
//         );
//     }
// );