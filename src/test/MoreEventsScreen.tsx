import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const MoreEventsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const moreEvents = [
    {
      id: 1,
      title: 'Tech Innovation Expo 2024',
      date: 'May 10-12, 2024',
      location: 'Los Angeles, CA',
      price: '$199',
      category: 'Innovation',
      rating: 4.8,
      attendees: '2,000+',
      recommended: true
    },
    {
      id: 2,
      title: 'DevOps & Infrastructure Summit',
      date: 'Jun 5-7, 2024',
      location: 'Chicago, IL',
      price: '$349',
      category: 'DevOps',
      rating: 4.7,
      attendees: '1,500+',
      recommended: false
    },
    {
      id: 3,
      title: 'Data Science Conference',
      date: 'Jul 15-17, 2024',
      location: 'Virtual Event',
      price: 'Free',
      category: 'Data Science',
      rating: 4.9,
      attendees: '3,000+',
      recommended: true
    },
    {
      id: 4,
      title: 'Cybersecurity Workshop',
      date: 'Aug 20-21, 2024',
      location: 'Miami, FL',
      price: '$299',
      category: 'Security',
      rating: 4.6,
      attendees: '800+',
      recommended: false
    }
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'recommended', label: 'Recommended' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'devops', label: 'DevOps' },
    { key: 'data-science', label: 'Data Science' },
    { key: 'security', label: 'Security' }
  ];

  const filteredEvents = moreEvents.filter(event => {
    switch (selectedCategory) {
      case 'recommended':
        return event.recommended;
      case 'innovation':
        return event.category === 'Innovation';
      case 'devops':
        return event.category === 'DevOps';
      case 'data-science':
        return event.category === 'Data Science';
      case 'security':
        return event.category === 'Security';
      default:
        return true;
    }
  });

  const EventCard = ({ event }: { event: any }) => (
    <TouchableOpacity
      className="mb-4 mx-6 overflow-hidden"
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
        padding: 24,
      }}
    >
      {/* Header with Recommended Badge */}
      <View className="flex-row justify-between items-start mb-6">
        <View
          className="px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(99, 102, 241, 0.3)',
          }}
        >
          <Text className="text-indigo-300 text-sm font-medium">{event.category}</Text>
        </View>
        {event.recommended && (
          <View
            className="px-4 py-2 rounded-full flex-row items-center"
            style={{
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              borderWidth: 1,
              borderColor: 'rgba(234, 179, 8, 0.3)',
            }}
          >
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: '#eab308' }}
            />
            <Text className="text-yellow-300 text-sm font-medium">Recommended</Text>
          </View>
        )}
      </View>

      {/* Event Title */}
      <Text className="text-white font-bold text-xl mb-4 leading-tight">{event.title}</Text>

      {/* Event Details */}
      <View className="space-y-3 mb-6">
        <View className="flex-row items-center">
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
          >
            <Text className="text-purple-300 text-xs">📅</Text>
          </View>
          <Text className="text-white/90 text-base font-medium">{event.date}</Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
          >
            <Text className="text-blue-300 text-xs">📍</Text>
          </View>
          <Text className="text-white/90 text-base font-medium">{event.location}</Text>
        </View>
        <View className="flex-row items-center">
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
          >
            <Text className="text-green-300 text-xs">💰</Text>
          </View>
          <Text className="text-green-300 text-base font-medium">{event.price}</Text>
        </View>

        {/* Rating and Attendees */}
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.3)' }}
            >
              <Text className="text-yellow-300 text-xs">⭐</Text>
            </View>
            <Text className="text-white/90 text-base font-medium">{event.rating}</Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: 'rgba(219, 39, 119, 0.3)' }}
            >
              <Text className="text-pink-300 text-xs">👥</Text>
            </View>
            <Text className="text-pink-300 text-base font-medium">{event.attendees}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 py-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(147, 51, 234, 0.9))',
            backgroundColor: '#6366f1',
          }}
        >
          <Text className="text-white font-bold text-center text-base">Explore Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text className="text-white text-lg">🔖</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text className="text-white text-lg">↗️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {/* Enhanced Background Gradient */}
      <View
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7b2cbf 100%)',
          backgroundColor: '#1a1a2e',
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-white font-bold text-3xl mb-2">Discover More</Text>
          <Text className="text-white/70 text-base mb-6">
            Explore conferences tailored to your interests
          </Text>

          {/* Search Bar */}
          <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex-row items-center mb-6">
            <Text className="text-white/50 flex-1">🔍 Search by topic, location, or speaker...</Text>
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                onPress={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full mr-3 ${selectedCategory === category.key
                    ? 'bg-white/30'
                    : 'bg-white/10'
                  }`}
              >
                <Text className={`font-medium ${selectedCategory === category.key
                    ? 'text-white'
                    : 'text-white/70'
                  }`}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events Counter and Sort */}
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text className="text-white/70 text-base">
            {filteredEvents.length} events found
          </Text>
          <TouchableOpacity className="bg-white/10 px-3 py-1 rounded-full">
            <Text className="text-white/70 text-sm">Sort by Rating ↓</Text>
          </TouchableOpacity>
        </View>

        {/* Events List */}
        <View className="flex-1">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default MoreEventsScreen;