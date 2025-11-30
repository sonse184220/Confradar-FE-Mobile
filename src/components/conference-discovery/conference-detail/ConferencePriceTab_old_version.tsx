import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    ActivityIndicator,
    Alert,
    Linking,
} from 'react-native';
import {
    Card,
    Button,
    Chip,
    IconButton,
    Surface,
    Divider,
    Appbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeStackParamList } from '@/navigation/HomeStack';
import { useConference } from '@/hooks/useConference';
import { useTransaction } from '@/hooks/useTransaction';
import { ConferencePricePhaseResponse, ConferencePriceResponse, ResearchConferenceDetailResponse, ResearchConferenceSessionResponse, TechnicalConferenceDetailResponse, TechnicalConferenceSessionResponse } from '@/types/conference.type';

interface ConferencePriceTabProps {
    conference: TechnicalConferenceDetailResponse | ResearchConferenceDetailResponse;
    formatDate: (dateString?: string) => string;
    formatTime: (timeString?: string) => string;
}

const ConferencePriceTab: React.FC<ConferencePriceTabProps> = ({ conference, formatDate, formatTime }) => {
    const pricesList = conference.conferencePrices || [];

    const getPhaseStatus = (phase: ConferencePricePhaseResponse) => {
        if (!phase.startDate || !phase.endDate) return 'unknown';
        const now = new Date();
        const startDate = new Date(phase.startDate);
        const endDate = new Date(phase.endDate);
        if (now < startDate) return 'upcoming';
        if (now > endDate) return 'ended';
        return 'current';
    };

    return (
        <View>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Các loại vé
            </Text>

            {pricesList.length > 0 ? (
                pricesList.map((ticket) => (
                    <Surface
                        key={ticket.conferencePriceId}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 12,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                                    {ticket.ticketName || 'Ticket Type TBD'}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                    {ticket.ticketDescription || 'Description TBD'}
                                </Text>
                            </View>
                            <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: 'bold' }}>
                                {ticket.ticketPrice ? `${ticket.ticketPrice.toLocaleString('vi-VN')}₫` : 'TBD'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Total: {ticket.totalSlot || 'Unlimited'}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                                Available: {ticket.availableSlot !== undefined ? ticket.availableSlot : 'TBD'}
                            </Text>
                        </View>

                        {ticket.isAuthor && (
                            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 4, padding: 8, marginBottom: 8 }}>
                                <Text style={{ color: '#3B82F6', fontSize: 12, textAlign: 'center' }}>
                                    Dành cho tác giả
                                </Text>
                            </View>
                        )}

                        {/* Price Phases */}
                        {ticket.pricePhases && ticket.pricePhases.length > 0 && (
                            <View style={{ marginTop: 8 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Các giai đoạn giá vé:</Text>
                                {ticket.pricePhases.map((phase, index) => {
                                    const status = getPhaseStatus(phase);
                                    const actualPrice = ticket.ticketPrice && phase.applyPercent
                                        ? Math.round(ticket.ticketPrice * (phase.applyPercent / 100))
                                        : ticket.ticketPrice;

                                    return (
                                        <View
                                            key={phase.pricePhaseId}
                                            style={{
                                                backgroundColor: status === 'current' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                                                borderRadius: 6,
                                                padding: 12,
                                                marginBottom: 6,
                                                borderWidth: status === 'current' ? 1 : 0,
                                                borderColor: status === 'current' ? '#22C55E' : 'transparent',
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                                    {phase.phaseName || `Giai đoạn ${index + 1}`}
                                                </Text>
                                                <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>
                                                    {actualPrice ? `${actualPrice.toLocaleString('vi-VN')}₫` : 'TBD'}
                                                </Text>
                                            </View>

                                            {phase.startDate && phase.endDate && (
                                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
                                                    {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                                </Text>
                                            )}

                                            {phase.applyPercent && (
                                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                                    Giảm {100 - phase.applyPercent}% ({phase.applyPercent}% giá gốc)
                                                </Text>
                                            )}

                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                                Còn lại: {phase.availableSlot !== undefined ? phase.availableSlot : 'TBD'}
                                            </Text>

                                            {status === 'current' && (
                                                <Text style={{ color: '#22C55E', fontSize: 12, fontWeight: 'bold', marginTop: 4 }}>
                                                    ● Đang diễn ra
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </Surface>
                ))
            ) : (
                <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingVertical: 32 }}>
                    Chưa có thông tin về giá vé
                </Text>
            )}
        </View>
    );
};

export default ConferencePriceTab;