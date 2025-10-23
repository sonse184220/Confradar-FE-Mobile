import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CurrentStackParamList } from '../navigation/CurrentStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTicket } from '../hooks/useTicket';

// Ticket interface from API
interface Ticket {
  ticketId: string;
  userId?: string;
  conferencePriceId?: string;
  transactionId?: string;
  registeredDate?: string;
  isRefunded?: boolean;
  actualPrice?: number;
}

const CurrentEventsScreen = () => {
  type LoginScreenProp = NativeStackNavigationProp<CurrentStackParamList, 'CurrentEvents'>;
  const navigation = useNavigation<LoginScreenProp>();
  const [activeFilter, setActiveFilter] = useState('All');

  const handleViewDetaill = () => { navigation.push('MoreEvents'); };

  // Use ticket hook to get tickets data
  const { fetchTickets, loading, paymentError } = useTicket();

  // We need to get tickets from the hook - but useTicket doesn't expose tickets directly
  // So we'll use the API query that's available in the hook
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // Fetch tickets on component mount
  React.useEffect(() => {
    const loadTickets = async () => {
      setTicketsLoading(true);
      try {
        const result = await fetchTickets();
        setTickets(result?.data || []);
        setTicketsError(null);
      } catch (error: any) {
        setTicketsError('Có lỗi xảy ra khi tải tickets.');
        setTickets([]);
      } finally {
        setTicketsLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Helper functions for ticket data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTicketStatus = (ticket: Ticket): string => {
    if (ticket.isRefunded) return 'Refunded';
    // Check if ticket is for current events (you can customize this logic)
    const registeredDate = new Date(ticket.registeredDate || '');
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) return 'Live Now';
    return 'Active';
  };

  const getTicketProgress = (ticket: Ticket): string => {
    if (ticket.isRefunded) return 'Refunded';
    const status = getTicketStatus(ticket);
    if (status === 'Live Now') return 'Currently Active';
    return 'Registered';
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets;

    // Apply filter
    switch (activeFilter) {
      case 'Live Now':
        filtered = tickets.filter(ticket => getTicketStatus(ticket) === 'Live Now');
        break;
      case 'Active':
        filtered = tickets.filter(ticket => getTicketStatus(ticket) === 'Active');
        break;
      case 'Refunded':
        filtered = tickets.filter(ticket => ticket.isRefunded === true);
        break;
      case 'All':
      default:
        filtered = tickets;
        break;
    }

    // Sort by registeredDate (newest first)
    // return filtered.sort((a, b) => {
    //   const dateA = new Date(a.registeredDate || 0).getTime();
    //   const dateB = new Date(b.registeredDate || 0).getTime();
    //   return dateB - dateA;
    // });
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.registeredDate || 0).getTime();
      const dateB = new Date(b.registeredDate || 0).getTime();
      return dateB - dateA;
    });
  }, [tickets, activeFilter]);

  const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    const status = getTicketStatus(ticket);
    const progress = getTicketProgress(ticket);
    const registeredDate = formatDate(ticket.registeredDate);

    return (
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
              backgroundColor: status === 'Live Now'
                ? 'rgba(34, 197, 94, 0.2)'
                : status === 'Refunded'
                  ? 'rgba(107, 114, 128, 0.2)'
                  : 'rgba(249, 115, 22, 0.2)',
              borderWidth: 1,
              borderColor: status === 'Live Now'
                ? 'rgba(34, 197, 94, 0.3)'
                : status === 'Refunded'
                  ? 'rgba(107, 114, 128, 0.3)'
                  : 'rgba(249, 115, 22, 0.3)',
            }}
          >
            <View
              className="w-2 h-2 rounded-full mr-2"
              style={{
                backgroundColor: status === 'Live Now' ? '#22c55e' : status === 'Refunded' ? '#6b7280' : '#f97316',
              }}
            />
            <Text className={`text-sm font-medium ${status === 'Live Now'
              ? 'text-green-300'
              : status === 'Refunded'
                ? 'text-gray-300'
                : 'text-orange-300'
              }`}>
              {status}
            </Text>
          </View>
          <TouchableOpacity
            className="p-3 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Text className="text-white text-lg">🎫</Text>
          </TouchableOpacity>
        </View>

        {/* Ticket Info */}
        <Text className="text-white font-bold text-xl mb-4 leading-tight">
          Ticket #{ticket.ticketId.slice(-8)}
        </Text>

        <View className="space-y-3 mb-6">
          <View className="flex-row items-center">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(147, 51, 234, 0.3)' }}
            >
              <Text className="text-purple-300 text-xs">📅</Text>
            </View>
            <Text className="text-white/90 text-base font-medium">Registered: {registeredDate}</Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
            >
              <Text className="text-blue-300 text-xs">💳</Text>
            </View>
            <Text className="text-white/90 text-base font-medium">
              Transaction: {ticket.transactionId?.slice(-8) || 'N/A'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-6 h-6 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(219, 39, 119, 0.3)' }}
            >
              <Text className="text-pink-300 text-xs">💰</Text>
            </View>
            <Text className="text-pink-300 text-base font-medium">
              ${ticket.actualPrice?.toFixed(2) || '0.00'}
            </Text>
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
          <Text className="text-white/90 text-center font-medium text-base">{progress}</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 py-4 rounded-2xl"
            style={{
              // background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(219, 39, 119, 0.9))',
              backgroundColor: '#9333ea',
            }}
          >
            <Text className="text-white font-bold text-center text-base">
              {status === 'Live Now' ? 'View Ticket' : status === 'Refunded' ? 'Refunded' : 'View Ticket'}
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
  };

  return (
    <View className="flex-1">
      {/* Enhanced Background Gradient */}
      <View
        className="absolute inset-0"
        style={{
          // background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #7b2cbf 100%)',
          backgroundColor: '#1a1a2e',
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-white font-bold text-3xl mb-2">My Tickets</Text>
          <Text className="text-white/70 text-base mb-6">
            Your registered tickets and conference access
          </Text>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            {['All', 'Live Now', 'Active', 'Refunded'].map((filter) => (
              <TouchableOpacity
                key={filter}
                className={`px-4 py-2 rounded-full mr-3 ${activeFilter === filter ? 'bg-white/30' : 'bg-white/10'
                  }`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text className={`font-medium ${activeFilter === filter ? 'text-white' : 'text-white/70'
                  }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tickets List */}
        <View className="flex-1">
          {ticketsLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-white text-base">Loading tickets...</Text>
            </View>
          ) : ticketsError ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-red-400 text-base text-center px-6">
                {ticketsError}
              </Text>
            </View>
          ) : filteredAndSortedTickets.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-400 text-base">No tickets found</Text>
            </View>
          ) : (
            filteredAndSortedTickets.map((ticket) => (
              <TicketCard key={ticket.ticketId} ticket={ticket} />
            ))
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default CurrentEventsScreen;