import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Card,
    Button,
    Chip,
    IconButton,
    Searchbar,
    Surface,
    Menu,
    Portal,
    ActivityIndicator,
    PaperProvider,
    Divider,
    Icon
} from 'react-native-paper';
import { useConference } from '@/hooks/useConference';
import { useConferenceCategory } from '@/hooks/useConferenceCategory';
import { ConferenceResponse } from '@/types/conference.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/HomeStack';

interface ConferenceListWithPaginationProps {
    paginatedConferences: ConferenceResponse[];
    renderConferenceCard: ({ item }: { item: ConferenceResponse }) => React.ReactElement;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (value: number | ((prev: number) => number)) => void;
}

const ConferenceListWithPagination: React.FC<ConferenceListWithPaginationProps> = ({
    paginatedConferences,
    renderConferenceCard,
    totalPages,
    currentPage,
    setCurrentPage
}) => {
    return (
        <>
            {/* Conference List - Scrollable */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={paginatedConferences}
                    renderItem={renderConferenceCard}
                    keyExtractor={(item) => item.conferenceId}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
                            <Icon source="calendar-search" size={64} color="rgba(246, 241, 241, 0.3)" />
                            <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 16, marginBottom: 8, color: 'rgba(246, 241, 241, 0.7)' }}>
                                Không tìm thấy hội nghị nào
                            </Text>
                            <Text style={{ textAlign: 'center', fontSize: 14, paddingHorizontal: 32, color: 'rgba(246, 241, 241, 0.5)' }}>
                                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* Pagination - Fixed at bottom */}
            {totalPages > 1 && (
                <Surface style={{
                    backgroundColor: 'rgba(246, 241, 241, 0.05)',
                    padding: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(246, 241, 241, 0.1)'
                }}>
                    <Button
                        mode="outlined"
                        disabled={currentPage === 1}
                        onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        style={{ borderColor: 'rgba(246, 241, 241, 0.3)', borderRadius: 8 }}
                        textColor="#F6F1F1"
                    >
                        Trước
                    </Button>

                    <Text style={{ color: '#F6F1F1', fontSize: 14 }}>
                        Trang {currentPage} / {totalPages}
                    </Text>

                    <Button
                        mode="outlined"
                        disabled={currentPage === totalPages}
                        onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        style={{ borderColor: 'rgba(246, 241, 241, 0.3)', borderRadius: 8 }}
                        textColor="#F6F1F1"
                    >
                        Sau
                    </Button>
                </Surface>
            )}
        </>
    );
};

export default ConferenceListWithPagination;