import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
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
    Icon
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack';

const { width: screenWidth } = Dimensions.get('window');

const getTextSize = (baseSize: number) => {
    if (screenWidth < 360) return baseSize - 2;
    if (screenWidth < 414) return baseSize;
    return baseSize + 1;
};

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;


const DiscoveryScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const navigation = useNavigation<NavigationProp>();

    const conferenceData = [
        {
            id: 1,
            title: 'React Native Conference 2024',
            date: 'Mar 15-17, 2024',
            location: 'San Francisco, CA',
            image: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg',
            status: 'current',
            category: 'Technology',
            attendees: '1,200+',
            price: 'Free'
        },
        {
            id: 2,
            title: 'Mobile Dev Summit',
            date: 'Apr 20-22, 2024',
            location: 'New York, NY',
            image: 'https://via.placeholder.com/300x180',
            status: 'upcoming',
            category: 'Development',
            attendees: '800+',
            price: '$299'
        },
        {
            id: 3,
            title: 'Tech Innovation Expo',
            date: 'May 10-12, 2024',
            location: 'Los Angeles, CA',
            image: 'https://via.placeholder.com/300x180',
            status: 'more',
            category: 'Innovation',
            attendees: '1,500+',
            price: '$199'
        },
        {
            id: 4,
            title: 'AI & Machine Learning Conference',
            date: 'Jun 5-7, 2024',
            location: 'Seattle, WA',
            image: 'https://via.placeholder.com/300x180',
            status: 'upcoming',
            category: 'AI/ML',
            attendees: '2,000+',
            price: '$399'
        },
        {
            id: 5,
            title: 'Design Systems Workshop',
            date: 'Jul 12-14, 2024',
            location: 'Austin, TX',
            image: 'https://via.placeholder.com/300x180',
            status: 'current',
            category: 'Design',
            attendees: '500+',
            price: '$149'
        }
    ];

    const filterOptions = [
        { key: 'all', label: 'All Events' },
        { key: 'current', label: 'Live Now' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'free', label: 'Free' },
        { key: 'tech', label: 'Technology' }
    ];

    const categories = [
        { name: 'Technology', icon: 'laptop', count: 12 },
        { name: 'Design', icon: 'palette', count: 8 },
        { name: 'Business', icon: 'briefcase', count: 15 },
        { name: 'AI/ML', icon: 'brain', count: 6 },
        { name: 'Marketing', icon: 'trending-up', count: 10 }
    ];

    const ConferenceCard = ({ conference, size = 'large' }: { conference: any; size?: 'large' | 'small' }) => {
        // const cardWidth = size === 'large' ? screenWidth * 0.8 : screenWidth * 0.65;
        const baseWidth = size === 'large' ? screenWidth * 0.8 : screenWidth * 0.65;
        const cardWidth = Math.min(Math.max(baseWidth, 280), 360);
        // const cardWidth = size === 'large' ? 340 : 280;
        const cardMinHeight = size === 'large' ? 300 : 260;

        return (
            <TouchableOpacity
                className="mr-4"
                style={{ width: cardWidth }}
            >
                <Card
                    style={{
                        backgroundColor: 'rgba(246, 241, 241, 0.1)',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(246, 241, 241, 0.2)',
                        // shadowColor: '#000',
                        // shadowOffset: { width: 0, height: 8 },
                        // shadowOpacity: 0.3,
                        // shadowRadius: 20,
                        // elevation: 10,
                        overflow: 'hidden',
                        minHeight: cardMinHeight,
                    }}
                    elevation={0}
                >
                    {/* <Card className="bg-white/10 rounded-3xl border border-white/20 shadow-lg"> */}
                    <LinearGradient
                        colors={['#146C94', '#19A7CE', '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        // style={{ padding: 16, minHeight: size === 'large' ? 120 : 100 }}
                        className={`p-4 ${size === 'large' ? 'min-h-[120px]' : 'min-h-[100px]'}`}
                    >
                        <View className="flex-row justify-between items-start mb-3">
                            <Chip
                                mode="outlined"
                                // textStyle={{ color: '#F6F1F1', fontSize: 12 }}
                                // style={{ backgroundColor: 'rgba(246, 241, 241, 0.2)' }}
                                className="bg-white/20 text-white text-xs"
                            // textStyle="text-white text-xs"
                            >
                                {conference.category}
                            </Chip>
                            <IconButton
                                icon="heart-outline"
                                iconColor="#F6F1F1"
                                size={20}
                                onPress={() => { }}
                            />
                        </View>

                        <Text
                            className="text-white font-bold text-lg leading-tight"
                            numberOfLines={2}
                            style={{ color: '#F6F1F1' }}
                        >
                            {conference.title}
                        </Text>
                    </LinearGradient>

                    <Card.Content
                        // style={{ padding: 16 }}
                        className="p-4"
                        style={{
                            padding: 16,
                            backgroundColor: 'transparent',
                        }}
                    >
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View className="space-y-3 mb-4">
                                <View className="flex-row items-center">
                                    <Icon source="calendar" size={16} color="#19A7CE" />
                                    <Text numberOfLines={1} className="text-gray-300 text-sm font-medium ml-2">
                                        {conference.date}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Icon source="map-marker" size={16} color="#19A7CE" />
                                    <Text numberOfLines={1} className="text-gray-300 text-sm font-medium ml-2">
                                        {conference.location}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Icon source="account-group" size={16} color="#19A7CE" />
                                    <Text numberOfLines={1} className="text-gray-300 text-sm font-medium ml-2">
                                        {conference.attendees} attendees
                                    </Text>
                                </View>
                            </View></View>

                        <Divider
                            // style={{ marginVertical: 12, backgroundColor: 'rgba(246, 241, 241, 0.2)' }} 
                            className="my-3 bg-white/20"
                        />

                        <View className="flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg" style={{ color: '#F6F1F1' }}>
                                {conference.price}
                            </Text>
                            <Button
                                mode="contained"
                                buttonColor="#19A7CE"
                                textColor="#000000"
                                style={{ borderRadius: 12 }}
                                onPress={() => {
                                    // navigation.navigate('CurrentStack', {
                                    //     screen: 'CurrentEvents',
                                    // });
                                }}
                            >
                                View Details
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    const CategoryCard = ({ category }: { category: any }) => (
        <TouchableOpacity className="mr-4">
            <Surface
                style={{
                    backgroundColor: 'rgba(246, 241, 241, 0.1)',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(246, 241, 241, 0.2)',
                    padding: 16,
                    minWidth: 120,
                    alignItems: 'center',
                }}
                elevation={0}
            >
                <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                // style={{
                //     width: 48,
                //     height: 48,
                //     borderRadius: 24,
                //     backgroundColor: 'rgba(25, 167, 206, 0.2)',
                //     alignItems: 'center',
                //     justifyContent: 'center',
                //     marginBottom: 12,
                // }}
                >
                    <Icon source={category.icon} size={24} color="#19A7CE" />
                </View>
                <Text className="text-white font-medium text-sm text-center mb-1" style={{ color: '#F6F1F1' }}>
                    {category.name}
                </Text>
                <Text className="text-gray-400 text-xs" style={{ color: 'rgba(246, 241, 241, 0.6)' }}>
                    {category.count} events
                </Text>
            </Surface>
        </TouchableOpacity>
    );

    const CategorySection = ({
        title,
        data,
        showAll = false,
        isCategories = false
    }: {
        title: string;
        data: any[];
        showAll?: boolean;
        isCategories?: boolean;
    }) => (
        <View className="mb-6">
            <View className="flex-row justify-between items-center px-6 mb-4">
                <Text className="text-white font-bold text-xl" style={{ color: '#F6F1F1' }}>
                    {title}
                </Text>
                {!showAll && (
                    <TouchableOpacity>
                        <Text className="font-medium" style={{ color: '#19A7CE' }}>
                            See All
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}
            >
                {data.map((item) => (
                    isCategories ? (
                        <CategoryCard key={item.name} category={item} />
                    ) : (
                        <ConferenceCard
                            key={item.id}
                            conference={item}
                            size={title === 'Featured Events' ? 'large' : 'small'}
                        />
                    )
                ))}
            </ScrollView>
        </View>
    );

    const filteredData = conferenceData.filter(conference => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'free') return conference.price === 'Free';
        if (selectedFilter === 'tech') return conference.category === 'Technology';
        return conference.status === selectedFilter;
    });

    return (
        // <View className="flex-1" >
        <View style={{ flex: 1 }} >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <Text className="text-base mb-2" style={{ color: 'rgba(246, 241, 241, 0.7)' }}>
                        Welcome back!
                    </Text>
                    <Text className="font-bold text-3xl mb-6" style={{ color: '#F6F1F1' }}>
                        Discover Conferences
                    </Text>

                    {/* Search Bar */}
                    <Searchbar
                        placeholder="Search conferences..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={{
                            backgroundColor: 'rgba(246, 241, 241, 0.1)',
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: 'rgba(246, 241, 241, 0.2)',
                        }}
                        inputStyle={{ color: '#F6F1F1' }}
                        placeholderTextColor="rgba(246, 241, 241, 0.6)"
                        iconColor="#19A7CE"
                    />

                    {/* Filter Chips */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-4"
                        contentContainerStyle={{ paddingRight: 24 }}
                    >
                        {filterOptions.map((filter) => (
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
                                }}
                            >
                                {filter.label}
                            </Chip>
                        ))}
                    </ScrollView>
                </View>

                <CategorySection
                    title="Categories"
                    data={categories}
                    isCategories={true}
                />

                <CategorySection
                    title="Featured Events"
                    data={filteredData.filter(c => c.status === 'current')}
                />

                <CategorySection
                    title="Current Events"
                    data={filteredData.filter(c => c.status === 'current')}
                />

                <CategorySection
                    title="Upcoming Events"
                    data={filteredData.filter(c => c.status === 'upcoming')}
                />

                <View className="mx-6 mb-8">
                    <Card
                        style={{
                            backgroundColor: 'rgba(246, 241, 241, 0.1)',
                            borderRadius: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(246, 241, 241, 0.2)',
                            // shadowColor: '#000',
                            // shadowOffset: { width: 0, height: 8 },
                            // shadowOpacity: 0.3,
                            // shadowRadius: 20,
                            // elevation: 12,
                        }}
                        elevation={0}
                    >
                        <Card.Content style={{ padding: 24 }}>
                            <View className="flex-row items-center mb-6">
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                    style={{ backgroundColor: 'rgba(25, 167, 206, 0.2)' }}
                                >
                                    <Icon source="chart-line" size={24} color="#19A7CE" />
                                </View>
                                <Text className="font-bold text-xl" style={{
                                    color: '#F6F1F1'
                                }}>
                                    Your Conference Journey
                                </Text>
                            </View>

                            <View className="flex-row justify-between">
                                <View className="items-center flex-1">
                                    <View
                                        className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                                        style={{ backgroundColor: 'rgba(25, 167, 206, 0.2)' }}
                                    >
                                        <Text className="font-bold text-2xl" style={{ color: '#19A7CE' }}>
                                            12
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-medium" style={{ color: 'rgba(246, 241, 241, 0.8)' }}>
                                        Attended
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <View
                                        className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                                        style={{ backgroundColor: 'rgba(20, 108, 148, 0.2)' }}
                                    >
                                        <Text className="font-bold text-2xl" style={{ color: '#146C94' }}>
                                            3
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-medium" style={{ color: 'rgba(246, 241, 241, 0.8)' }}>
                                        Upcoming
                                    </Text>
                                </View>
                                <View className="items-center flex-1">
                                    <View
                                        className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                                        style={{ backgroundColor: 'rgba(246, 241, 241, 0.2)' }}
                                    >
                                        <Text className="font-bold text-2xl" style={{ color: '#F6F1F1' }}>
                                            8
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-medium" style={{ color: 'rgba(246, 241, 241, 0.8)' }}>
                                        Bookmarked
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export default DiscoveryScreen;