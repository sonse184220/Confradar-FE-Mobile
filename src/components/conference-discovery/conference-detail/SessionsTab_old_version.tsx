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

interface SessionsTabProps {
    conference: TechnicalConferenceDetailResponse | ResearchConferenceDetailResponse;
    isResearch: boolean;
    formatDate: (dateString?: string) => string;
    formatTime: (timeString?: string) => string;
}
// Component con cho SessionsTab
const SessionsTab: React.FC<SessionsTabProps> = ({ conference, isResearch, formatDate, formatTime }) => {
    const sessions = isResearch
        ? (conference as ResearchConferenceDetailResponse).researchSessions || []
        : (conference as TechnicalConferenceDetailResponse).sessions || [];

    return (
        <View>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Lịch trình Sessions
            </Text>

            {sessions.length > 0 ? (
                sessions.map((session, index) => {
                    if (isResearch) {
                        const s = session as ResearchConferenceSessionResponse;
                        return (
                            <Surface
                                key={s.conferenceSessionId || index}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 12,
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                    {s.title || 'Session Title TBD'}
                                </Text>

                                {s.startTime && s.endTime && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Icon name="schedule" size={16} color="rgba(255,255,255,0.8)" />
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                            {formatTime(s.startTime)} - {formatTime(s.endTime)}
                                        </Text>
                                    </View>
                                )}

                                {s.date && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <Icon name="event" size={16} color="rgba(255,255,255,0.8)" />
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                            {formatDate(s.date)}
                                        </Text>
                                    </View>
                                )}

                                {s.description && (
                                    <Text style={{ color: 'white', marginBottom: 8, lineHeight: 20 }}>
                                        {s.description}
                                    </Text>
                                )}

                                {s.sessionMedia && s.sessionMedia.length > 0 && (
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>
                                            Session Media:
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {s.sessionMedia.map((media, idx) => (
                                                <Text
                                                    key={media.conferenceSessionMediaId || idx}
                                                    style={{ color: '#60A5FA', fontSize: 12 }}
                                                    onPress={() => media.conferenceSessionMediaUrl && Linking.openURL(media.conferenceSessionMediaUrl)}
                                                >
                                                    Media {idx + 1}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </Surface>
                        );
                    } else {
                        const s = session as TechnicalConferenceSessionResponse;
                        return (
                            <Surface
                                key={s.conferenceSessionId || index}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 12,
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                    {s.title || 'Session Title TBD'}
                                </Text>

                                {s.startTime && s.endTime && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Icon name="schedule" size={16} color="rgba(255,255,255,0.8)" />
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                            {formatTime(s.startTime)} - {formatTime(s.endTime)}
                                        </Text>
                                    </View>
                                )}

                                {s.sessionDate && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Icon name="event" size={16} color="rgba(255,255,255,0.8)" />
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                            {formatDate(s.sessionDate)}
                                        </Text>
                                    </View>
                                )}

                                {s.room && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                        <Icon name="location-on" size={16} color="rgba(255,255,255,0.8)" />
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                            {s.room.displayName || s.room.number || 'Room TBD'}
                                        </Text>
                                    </View>
                                )}

                                {s.description && (
                                    <Text style={{ color: 'white', marginBottom: 8, lineHeight: 20 }}>
                                        {s.description}
                                    </Text>
                                )}

                                {s.speakers && s.speakers.length > 0 && (
                                    <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                                            Speakers:
                                        </Text>
                                        {s.speakers.map((speaker) => (
                                            <View key={speaker.speakerId} style={{ marginBottom: 4 }}>
                                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                                                    {speaker.name}
                                                </Text>
                                                {speaker.description && (
                                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>
                                                        {speaker.description}
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {s.sessionMedia && s.sessionMedia.length > 0 && (
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, marginBottom: 4 }}>
                                            Session Media:
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {s.sessionMedia.map((media, idx) => (
                                                <Text
                                                    key={media.conferenceSessionMediaId || idx}
                                                    style={{ color: '#60A5FA', fontSize: 12 }}
                                                    onPress={() => media.conferenceSessionMediaUrl && Linking.openURL(media.conferenceSessionMediaUrl)}
                                                >
                                                    Media {idx + 1}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </Surface>
                        );
                    }
                })
            ) : (
                <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingVertical: 32 }}>
                    Chưa có thông tin về sessions
                </Text>
            )}
        </View>
    );
};

export default SessionsTab;