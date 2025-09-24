import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

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
      className={`${size === 'large' ? 'w-80' : 'w-64'} mr-4 bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl`}
    >
      <View className={`${size === 'large' ? 'h-40' : 'h-32'} bg-gradient-to-br from-purple-400 to-pink-400`}>
        {/* Placeholder for conference image */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-white font-bold text-lg">{conference.title.split(' ')[0]}</Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-white font-bold text-lg mb-1" numberOfLines={2}>
          {conference.title}
        </Text>
        <Text className="text-white/70 text-sm mb-1">
          📅 {conference.date}
        </Text>
        <Text className="text-white/70 text-sm">
          📍 {conference.location}
        </Text>
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
      {/* Background Gradient */}
      <View className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      
      {/* Background Pattern/Blur Effect */}
      <View className="absolute inset-0 opacity-30">
        <View className="absolute top-20 left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl" />
        <View className="absolute top-40 right-10 w-24 h-24 bg-pink-400 rounded-full blur-2xl" />
        <View className="absolute bottom-40 left-20 w-28 h-28 bg-blue-400 rounded-full blur-3xl" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-white/70 text-base mb-2">Welcome back!</Text>
          <Text className="text-white font-bold text-3xl mb-4">
            Discover Conferences
          </Text>
          
          {/* Search Bar */}
          <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex-row items-center">
            <Text className="text-white/50 flex-1">🔍 Search conferences...</Text>
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

        {/* Stats Section */}
        <View className="mx-6 mb-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6">
          <Text className="text-white font-bold text-xl mb-4">Your Conference Journey</Text>
          
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-purple-300 font-bold text-2xl">12</Text>
              <Text className="text-white/70 text-sm">Attended</Text>
            </View>
            <View className="items-center">
              <Text className="text-pink-300 font-bold text-2xl">3</Text>
              <Text className="text-white/70 text-sm">Upcoming</Text>
            </View>
            <View className="items-center">
              <Text className="text-blue-300 font-bold text-2xl">8</Text>
              <Text className="text-white/70 text-sm">Bookmarked</Text>
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