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

interface InformationTabProps {
    conference: TechnicalConferenceDetailResponse | ResearchConferenceDetailResponse;
    isResearch: boolean;
    formatDate: (dateString?: string) => string;
    setSelectedImage: (imageUrl: string) => void;
}

const InformationTab: React.FC<InformationTabProps> = ({ conference, isResearch, formatDate, setSelectedImage }) => (
    <View>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Thông tin chi tiết
        </Text>

        {/* Basic Conference Information */}
        <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Location:</Text>
            <Text style={{ color: 'white', marginBottom: 12 }}>{conference.address}</Text>

            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Date:</Text>
            <Text style={{ color: 'white', marginBottom: 12 }}>{formatDate(conference.startDate)} - {formatDate(conference.endDate)}</Text>

            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Capacity:</Text>
            <Text style={{ color: 'white' }}>{conference.totalSlot || 'Unlimited'} attendees</Text>
        </Surface>

        {/* Conference Description */}
        <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>About:</Text>
            <Text style={{ color: 'white', lineHeight: 20 }}>{conference.description}</Text>
        </Surface>

        {/* Research Conference Specific Information */}
        {isResearch && (conference as ResearchConferenceDetailResponse).paperFormat && (
            <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Research Conference Details:</Text>
                <Text style={{ color: 'white', marginBottom: 8 }}>Paper Format: {(conference as ResearchConferenceDetailResponse).paperFormat}</Text>
                <Text style={{ color: 'white', marginBottom: 8 }}>Papers Accepted: {(conference as ResearchConferenceDetailResponse).numberPaperAccept || 'TBD'}</Text>
                <Text style={{ color: 'white', marginBottom: 8 }}>Revision Attempts: {(conference as ResearchConferenceDetailResponse).revisionAttemptAllowed || 'TBD'}</Text>
                <Text style={{ color: 'white' }}>Allow Listeners: {(conference as ResearchConferenceDetailResponse).allowListener ? 'Yes' : 'No'}</Text>
            </Surface>
        )}

        {/* Media */}
        {conference.conferenceMedia && conference.conferenceMedia.length > 0 && (
            <View style={{ marginBottom: 20 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Conference Photos
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {conference.conferenceMedia.map((media) => (
                        <TouchableOpacity
                            key={media.mediaId}
                            onPress={() => setSelectedImage(media.mediaUrl || '')}
                            style={{ marginRight: 12 }}
                        >
                            <Image
                                source={{ uri: media.mediaUrl || 'https://via.placeholder.com/200x150' }}
                                style={{ width: 200, height: 150, borderRadius: 8 }}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        )}

        {/* Sponsors */}
        {conference.sponsors && conference.sponsors.length > 0 && (
            <View style={{ marginBottom: 20 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Sponsors
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {conference.sponsors.map((sponsor) => (
                        <View key={sponsor.sponsorId} style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 8,
                            padding: 12,
                            marginRight: 12,
                            alignItems: 'center',
                            width: 120
                        }}>
                            <Image
                                source={{ uri: sponsor.imageUrl || 'https://via.placeholder.com/60x60' }}
                                style={{ width: 60, height: 60, borderRadius: 8, marginBottom: 8 }}
                                resizeMode="contain"
                            />
                            <Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>
                                {sponsor.name}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        )}

        {/* Policies */}
        {conference.policies && conference.policies.length > 0 && (
            <View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Conference Policies
                </Text>
                {conference.policies.map((policy) => (
                    <Surface key={policy.policyId} style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 8
                    }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                            {policy.policyName}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            {policy.description}
                        </Text>
                    </Surface>
                ))}
            </View>
        )}
    </View>
);

export default InformationTab;