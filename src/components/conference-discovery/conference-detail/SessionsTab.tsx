import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface } from 'react-native-paper';
import {
    TechnicalConferenceDetailResponse,
    ResearchConferenceDetailResponse,
    TechnicalConferenceSessionResponse,
    ResearchConferenceSessionResponse,
} from '@/types/conference.type';

interface SessionsTabProps {
    conference:
    | TechnicalConferenceDetailResponse
    | ResearchConferenceDetailResponse;
    isResearch: boolean;
    formatDate: (dateString?: string) => string;
    formatTime: (timeString?: string) => string;
    setSelectedImage?: (image: string | null) => void;
}

const SessionsTab: React.FC<SessionsTabProps> = ({
    conference,
    isResearch,
    formatDate,
    formatTime,
    setSelectedImage,
}) => {
    const sessions = isResearch
        ? (conference as ResearchConferenceDetailResponse).researchSessions || []
        : (conference as TechnicalConferenceDetailResponse).sessions || [];

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Lịch trình Sessions
            </Text>

            {sessions.length > 0 ? (
                <View style={{ gap: 12 }}>
                    {[...sessions]
                        .sort((a, b) => {
                            const dateA = new Date(
                                ('date' in a ? a.date : a.startTime) || ''
                            ).getTime();
                            const dateB = new Date(
                                ('date' in b ? b.date : b.startTime) || ''
                            ).getTime();
                            if (dateA !== dateB) return dateA - dateB;

                            const timeA = new Date(a.startTime || '').getTime();
                            const timeB = new Date(b.startTime || '').getTime();
                            return timeA - timeB;
                        })
                        .map((session, index) => {
                            if (isResearch) {
                                const s = session as ResearchConferenceSessionResponse;
                                return (
                                    <Surface
                                        key={s.conferenceSessionId || index}
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <View style={{ marginBottom: 12 }}>
                                            <Image
                                                source={{
                                                    uri: conference.bannerImageUrl || '/images/customer_route/confbannerbg2.jpg',
                                                }}
                                                style={{ width: '100%', height: 150, borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                        </View>

                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                            {s.title || 'Phiên họp chưa đặt tên'}
                                        </Text>

                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12, lineHeight: 18 }}>
                                            {s.description || 'Chưa có mô tả cho phiên họp này'}
                                        </Text>

                                        <View style={{ gap: 8, marginBottom: 12 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Icon name="access-time" size={16} color="white" />
                                                <Text style={{ color: 'white', fontSize: 12 }}>
                                                    {s.startTime && s.endTime
                                                        ? `${formatTime(s.startTime)} - ${formatTime(s.endTime)}`
                                                        : 'Thời gian chưa xác định'}
                                                </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Icon name="event" size={16} color="white" />
                                                <Text style={{ color: 'white', fontSize: 12 }}>
                                                    {s.date ? formatDate(s.date) : 'Ngày chưa xác định'}
                                                </Text>
                                            </View>
                                        </View>

                                        {s.sessionMedia && s.sessionMedia.length > 0 && setSelectedImage && (
                                            <View style={{ marginTop: 12 }}>
                                                <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>
                                                    Session Media:
                                                </Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                                    {s.sessionMedia.map((media) => {
                                                        console.log('MEDIA:', media);
                                                        console.log('URL:', media.conferenceSessionMediaUrl);
                                                        const isImage = /\.(png|jpe?g|gif|webp)$/i.test(media.conferenceSessionMediaUrl || '');
                                                        const isVideo = /\.(mp4|webm|ogg)$/i.test(media.conferenceSessionMediaUrl || '');

                                                        return (
                                                            <TouchableOpacity
                                                                key={media.conferenceSessionMediaId}
                                                                onPress={() => setSelectedImage(media.conferenceSessionMediaUrl || '')}
                                                                style={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    borderRadius: 8,
                                                                    overflow: 'hidden',
                                                                    borderWidth: 1,
                                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                                }}
                                                            >
                                                                {isImage && (
                                                                    <>
                                                                        {console.log('MEDIA URL:', media.conferenceSessionMediaUrl)}
                                                                        <Image
                                                                            source={{ uri: media.conferenceSessionMediaUrl }}
                                                                            style={{ width: '100%', height: '100%' }}
                                                                            resizeMode="cover"
                                                                        />
                                                                    </>
                                                                )}
                                                                {isVideo && (
                                                                    <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Icon name="play-circle-outline" size={32} color="white" />
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
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
                                            borderRadius: 12,
                                            padding: 16,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <View style={{ marginBottom: 12 }}>
                                            <Image
                                                source={{
                                                    uri: conference.bannerImageUrl || '/images/customer_route/confbannerbg2.jpg',
                                                }}
                                                style={{ width: '100%', height: 150, borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                        </View>

                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                            {s.title}
                                        </Text>

                                        {s.description && (
                                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12, lineHeight: 18 }}>
                                                {s.description}
                                            </Text>
                                        )}

                                        <View style={{ gap: 8, marginBottom: 12 }}>
                                            {s.startTime && s.endTime && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Icon name="access-time" size={16} color="white" />
                                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                                        {formatTime(s.startTime)} - {formatTime(s.endTime)}
                                                    </Text>
                                                </View>
                                            )}

                                            {s.sessionDate && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Icon name="event" size={16} color="white" />
                                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                                        {formatDate(s.sessionDate)}
                                                    </Text>
                                                </View>
                                            )}

                                            {s.room && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Icon name="location-on" size={16} color="white" />
                                                    <Text style={{ color: 'white', fontSize: 12 }}>
                                                        {s.room.displayName || s.room.number || 'Phòng chưa xác định'}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {s.speakers && s.speakers.length > 0 && (
                                            <View style={{ marginTop: 8 }}>
                                                <Text style={{ color: 'white', fontWeight: '600', fontSize: 14, marginBottom: 8 }}>
                                                    Diễn giả:
                                                </Text>
                                                <View style={{ gap: 8 }}>
                                                    {s.speakers.map((speaker) => (
                                                        <View
                                                            key={speaker.speakerId}
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                gap: 8,
                                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                                padding: 8,
                                                                borderRadius: 8,
                                                            }}
                                                        >
                                                            {speaker.image && (
                                                                <Image
                                                                    source={{ uri: speaker.image }}
                                                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                                                    resizeMode="cover"
                                                                />
                                                            )}
                                                            <View style={{ flex: 1 }}>
                                                                <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>
                                                                    {speaker.name}
                                                                </Text>
                                                                {speaker.description && (
                                                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                                                        {speaker.description}
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )}

                                        {s.sessionMedia && s.sessionMedia.length > 0 && setSelectedImage && (
                                            <View style={{ marginTop: 12 }}>
                                                <Text style={{ color: 'white', fontWeight: '600', marginBottom: 8, fontSize: 14 }}>
                                                    Session Media:
                                                </Text>
                                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                                    {s.sessionMedia.map((media) => {
                                                        const isImage = /\.(png|jpe?g|gif|webp)$/i.test(media.conferenceSessionMediaUrl || '');
                                                        const isVideo = /\.(mp4|webm|ogg)$/i.test(media.conferenceSessionMediaUrl || '');

                                                        return (
                                                            <TouchableOpacity
                                                                key={media.conferenceSessionMediaId}
                                                                onPress={() => setSelectedImage(media.conferenceSessionMediaUrl || '')}
                                                                style={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    borderRadius: 8,
                                                                    overflow: 'hidden',
                                                                    borderWidth: 1,
                                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                                }}
                                                            >
                                                                {isImage && (
                                                                    <Image
                                                                        source={{ uri: media.conferenceSessionMediaUrl }}
                                                                        style={{ width: '100%', height: '100%' }}
                                                                        resizeMode="cover"
                                                                    />
                                                                )}
                                                                {isVideo && (
                                                                    <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Icon name="play-circle-outline" size={32} color="white" />
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        )}
                                    </Surface>
                                );
                            }
                        })}
                </View>
            ) : (
                <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                        Chưa có thông tin về sessions
                    </Text>
                </Surface>
            )}
        </ScrollView>
    );
};

export default SessionsTab;