import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CurrentStackParamList } from '../navigation/CurrentStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const CurrentEventsScreen = () => {
  type LoginScreenProp = NativeStackNavigationProp<CurrentStackParamList, 'CurrentEvents'>;
  const navigation = useNavigation<LoginScreenProp>();

  const handleViewDetaill = () => { navigation.push('MoreEvents'); };

  const currentEvents = [
    {
      id: 1,
      title: 'React Native Conference 2024',
      date: 'Mar 15-17, 2024',
      location: 'San Francisco, CA',
      status: 'Live Now',
      attendees: '1,200+',
      progress: 'Day 2 of 3'
    },
    {
      id: 2,
      title: 'Mobile UX Design Summit',
      date: 'Mar 16-17, 2024',
      location: 'Virtual Event',
      status: 'Live Now',
      attendees: '800+',
      progress: 'Day 1 of 2'
    },
    {
      id: 3,
      title: 'AI & Machine Learning Expo',
      date: 'Mar 17-18, 2024',
      location: 'Boston, MA',
      status: 'Starting Soon',
      attendees: '1,500+',
      progress: 'Starts in 2 hours'
    }
  ];

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
      {/* Status Badge */}
      <View className="flex-row justify-between items-start mb-6">
        <View
          className="px-4 py-2 rounded-full flex-row items-center"
          style={{
            backgroundColor: event.status === 'Live Now'
              ? 'rgba(34, 197, 94, 0.2)'
              : 'rgba(249, 115, 22, 0.2)',
            borderWidth: 1,
            borderColor: event.status === 'Live Now'
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(249, 115, 22, 0.3)',
          }}
        >
          <View
            className="w-2 h-2 rounded-full mr-2"
            style={{
              backgroundColor: event.status === 'Live Now' ? '#22c55e' : '#f97316',
            }}
          />
          <Text className={`text-sm font-medium ${event.status === 'Live Now'
            ? 'text-green-300'
            : 'text-orange-300'
            }`}>
            {event.status}
          </Text>
        </View>
        <TouchableOpacity
          className="p-3 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <Text className="text-white text-lg">❤️</Text>
        </TouchableOpacity>
      </View>

      {/* Event Info */}
      <Text className="text-white font-bold text-xl mb-4 leading-tight">{event.title}</Text>

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
            style={{ backgroundColor: 'rgba(219, 39, 119, 0.3)' }}
          >
            <Text className="text-pink-300 text-xs">👥</Text>
          </View>
          <Text className="text-pink-300 text-base font-medium">{event.attendees} attendees</Text>
        </View>
      </View>

      {/* Progress */}
      <View
        className="rounded-2xl p-4 mb-6"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <Text className="text-white/90 text-center font-medium text-base">{event.progress}</Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          className="flex-1 py-4 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(219, 39, 119, 0.9))',
            backgroundColor: '#9333ea',
          }}
        >
          <Text className="text-white font-bold text-center text-base">
            {event.status === 'Live Now' ? 'Join Now' : 'Set Reminder'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleViewDetaill}
          className="flex-1 py-4 rounded-2xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text className="text-white font-medium text-center text-base">View Details</Text>
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
          <Text className="text-white font-bold text-3xl mb-2">Current Events</Text>
          <Text className="text-white/70 text-base mb-6">
            Events happening right now and starting soon
          </Text>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <TouchableOpacity className="bg-white/30 px-4 py-2 rounded-full mr-3">
              <Text className="text-white font-medium">All</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/10 px-4 py-2 rounded-full mr-3">
              <Text className="text-white/70 font-medium">Live Now</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/10 px-4 py-2 rounded-full mr-3">
              <Text className="text-white/70 font-medium">Starting Soon</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white/10 px-4 py-2 rounded-full mr-3">
              <Text className="text-white/70 font-medium">Virtual</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Events List */}
        <View className="flex-1">
          {currentEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default CurrentEventsScreen;