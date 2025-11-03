import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const UpcomingEventsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: 'Mobile Dev Summit 2024',
      date: 'Apr 20-22, 2024',
      location: 'New York, NY',
      price: '$299',
      category: 'Development',
      daysLeft: 25,
      registered: true
    },
    {
      id: 2,
      title: 'Cloud Computing Conference',
      date: 'May 5-7, 2024',
      location: 'Seattle, WA',
      price: '$399',
      category: 'Cloud',
      daysLeft: 40,
      registered: false
    },
    {
      id: 3,
      title: 'Design Systems Meetup',
      date: 'May 15, 2024',
      location: 'Virtual Event',
      price: 'Free',
      category: 'Design',
      daysLeft: 50,
      registered: true
    },
    {
      id: 4,
      title: 'Blockchain & Web3 Summit',
      date: 'Jun 10-12, 2024',
      location: 'Austin, TX',
      price: '$499',
      category: 'Blockchain',
      daysLeft: 76,
      registered: false
    }
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'registered', label: 'Registered' },
    { key: 'development', label: 'Development' },
    { key: 'design', label: 'Design' },
    { key: 'free', label: 'Free' }
  ];

  const filteredEvents = upcomingEvents.filter(event => {
    switch (selectedFilter) {
      case 'registered':
        return event.registered;
      case 'development':
        return event.category === 'Development';
      case 'design':
        return event.category === 'Design';
      case 'free':
        return event.price === 'Free';
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
      {/* Header with Category and Days Left */}
      <View className="flex-row justify-between items-start mb-6">
        <View
          className="px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(147, 51, 234, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(147, 51, 234, 0.3)',
          }}
        >
          <Text className="text-purple-300 text-sm font-medium">{event.category}</Text>
        </View>
        <View
          className="px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(249, 115, 22, 0.3)',
          }}
        >
          <Text className="text-orange-300 text-sm font-medium">{event.daysLeft} days left</Text>
        </View>
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
      </View>

      {/* Registration Status */}
      {event.registered && (
        <View
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(34, 197, 94, 0.3)',
          }}
        >
          <Text className="text-green-300 text-center font-medium text-base">✅ Registered</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        {event.registered ? (
          <>
            <TouchableOpacity
              className="flex-1 py-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9))',
                backgroundColor: '#3b82f6',
              }}
            >
              <Text className="text-white font-bold text-center text-base">View Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-4 rounded-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text className="text-white font-medium text-center text-base">Add to Calendar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              className="flex-1 py-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(219, 39, 119, 0.9))',
                backgroundColor: '#9333ea',
              }}
            >
              <Text className="text-white font-bold text-center text-base">Register Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-4 rounded-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text className="text-white font-medium text-center text-base">Learn More</Text>
            </TouchableOpacity>
          </>
        )}
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
          <Text className="text-white font-bold text-3xl mb-2">Upcoming Events</Text>
          <Text className="text-white/70 text-base mb-6">
            Plan ahead and secure your spots
          </Text>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-full mr-3 ${selectedFilter === filter.key
                    ? 'bg-white/30'
                    : 'bg-white/10'
                  }`}
              >
                <Text className={`font-medium ${selectedFilter === filter.key
                    ? 'text-white'
                    : 'text-white/70'
                  }`}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events Counter */}
        <View className="px-6 mb-4">
          <Text className="text-white/70 text-base">
            {filteredEvents.length} events found
          </Text>
        </View>

        {/* Events List */}
        <View className="flex-1">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-20">
            <Text className="text-white/50 text-6xl mb-4">📅</Text>
            <Text className="text-white font-bold text-xl mb-2">No events found</Text>
            <Text className="text-white/70 text-center">
              Try adjusting your filters or check back later for new events
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default UpcomingEventsScreen;