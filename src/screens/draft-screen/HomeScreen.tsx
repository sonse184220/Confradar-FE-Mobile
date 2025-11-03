import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const conferenceData = [
    {
      id: 1,
      title: 'React Native Conference 2024',
      date: 'Mar 15-17, 2024',
      location: 'San Francisco, CA',
      image: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?_gl=1*19s8m8v*_ga*MTMyNTM5NzI0Ny4xNzU4NzA2MTgz*_ga_8JE65Q40S6*czE3NTg3MDYxODIkbzEkZzEkdDE3NTg3MDYxODckajU1JGwwJGgw',
      status: 'current'
    },
    {
      id: 2,
      title: 'Mobile Dev Summit',
      date: 'Apr 20-22, 2024',
      location: 'New York, NY',
      image: 'https://via.placeholder.com/300x180',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Tech Innovation Expo',
      date: 'May 10-12, 2024',
      location: 'Los Angeles, CA',
      image: 'https://via.placeholder.com/300x180',
      status: 'more'
    }
  ];

  const ConferenceCard = ({ conference, size = 'large' }: { conference: any; size?: 'large' | 'small' }) => (
    <TouchableOpacity
      className={`${size === 'large' ? 'w-80' : 'w-64'} mr-4 overflow-hidden`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <View className={`${size === 'large' ? 'h-40' : 'h-32'} relative overflow-hidden`}>
        {/* Gradient Background */}
        {/* <View
          className="absolute inset-0"
          style={{
            backgroundColor: '#8B5CF6',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(219, 39, 119, 0.8) 50%, rgba(59, 130, 246, 0.9) 100%)',
          }}
        /> */}
        <LinearGradient
          colors={[
            'rgba(147, 51, 234, 0.9)',  // tím
            'rgba(219, 39, 119, 0.8)',  // hồng
            'rgba(59, 130, 246, 0.9)',  // xanh
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />

        {/* Content */}
        <View className="flex-1 items-center justify-center relative z-10 px-3">
          <View
            className="px-3 py-1 rounded-full mb-2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Text className="text-white text-xs font-medium">Conference</Text>
          </View>
          <Text className="text-white font-bold text-lg text-center">
            {conference.title.split(' ')[0]}
          </Text>
        </View>
      </View>

      <View className="p-5">
        <Text className="text-white font-bold text-lg mb-3 leading-tight" numberOfLines={2}>
          {conference.title}
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-center">
            <View
              className="w-5 h-5 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
            >
              <Text className="text-purple-300 text-xs">📅</Text>
            </View>
            <Text className="text-white/90 text-sm font-medium">
              {conference.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-5 h-5 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <Text className="text-blue-300 text-xs">📍</Text>
            </View>
            <Text className="text-white/90 text-sm font-medium">
              {conference.location}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategorySection = ({
    title,
    data,
    showAll = false
  }: {
    title: string;
    data: any[];
    showAll?: boolean;
  }) => (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text className="text-white font-bold text-xl">{title}</Text>
        {!showAll && (
          <TouchableOpacity>
            <Text className="text-purple-300 font-medium">See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {data.map((item) => (
          <ConferenceCard
            key={item.id}
            conference={item}
            size={title === 'Featured Events' ? 'large' : 'small'}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Enhanced Background Gradient */}
      {/* <View
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7b2cbf 100%)',
          backgroundColor: '#1a1a2e',
        }}
      /> */}
      <LinearGradient
        colors={[
          '#1a1a2e', // đen tím
          '#16213e', // xanh đậm
          '#0f3460', // xanh biển đậm
          '#533483', // tím
          '#7b2cbf', // tím sáng
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-white/70 text-base mb-2">Welcome back!</Text>
          <Text className="text-white font-bold text-3xl mb-4">
            Discover Conferences
          </Text>

          {/* Enhanced Search Bar */}
          <View
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
            >
              <Text className="text-purple-300 text-sm">🔍</Text>
            </View>
            <Text className="text-white/70 flex-1 text-base">Search conferences...</Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <Text className="text-white/60 text-xs font-medium">Filter</Text>
            </View>
          </View>
        </View>

        {/* Featured Section */}
        <CategorySection
          title="Featured Events"
          data={conferenceData.filter(c => c.status === 'current')}
        />

        {/* Current Events */}
        <CategorySection
          title="Current Events"
          data={conferenceData.filter(c => c.status === 'current')}
        />

        {/* Upcoming Events */}
        <CategorySection
          title="Upcoming Events"
          data={conferenceData.filter(c => c.status === 'upcoming')}
        />

        {/* Recommended for You */}
        <CategorySection
          title="Recommended for You"
          data={conferenceData.filter(c => c.status === 'more')}
        />

        {/* Enhanced Stats Section */}
        <View
          className="mx-6 mb-8 rounded-3xl p-6"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center mb-6">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
            >
              <Text className="text-purple-300 text-lg">📊</Text>
            </View>
            <Text className="text-white font-bold text-xl">Your Conference Journey</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
              >
                <Text className="text-purple-300 font-bold text-2xl">12</Text>
              </View>
              <Text className="text-white/90 text-sm font-medium">Attended</Text>
            </View>
            <View className="items-center flex-1">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(219, 39, 119, 0.2)' }}
              >
                <Text className="text-pink-300 font-bold text-2xl">3</Text>
              </View>
              <Text className="text-white/90 text-sm font-medium">Upcoming</Text>
            </View>
            <View className="items-center flex-1">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
              >
                <Text className="text-blue-300 font-bold text-2xl">8</Text>
              </View>
              <Text className="text-white/90 text-sm font-medium">Bookmarked</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;