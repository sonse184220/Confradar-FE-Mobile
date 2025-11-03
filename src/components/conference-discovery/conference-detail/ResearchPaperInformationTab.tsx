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

interface ResearchPaperInformationTabProps {
    conference: ResearchConferenceDetailResponse;
    formatDate: (dateString?: string) => string;
    formatTime: (timeString?: string) => string;
}

// Component con cho ResearchPaperInformationTab
const ResearchPaperInformationTab: React.FC<ResearchPaperInformationTabProps> = ({ conference, formatDate, formatTime }) => (
    <View>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Research Paper Information
        </Text>

        {/* Research Phase Timeline */}
        {conference.researchPhase && (
            <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Research Conference Timeline
                </Text>

                {conference.researchPhase.registrationStartDate && conference.researchPhase.registrationEndDate && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>Registration Period:</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {formatDate(conference.researchPhase.registrationStartDate)} - {formatDate(conference.researchPhase.registrationEndDate)}
                        </Text>
                    </View>
                )}

                {conference.researchPhase.fullPaperStartDate && conference.researchPhase.fullPaperEndDate && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>Full Paper Submission:</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {formatDate(conference.researchPhase.fullPaperStartDate)} - {formatDate(conference.researchPhase.fullPaperEndDate)}
                        </Text>
                    </View>
                )}

                {conference.researchPhase.reviewStartDate && conference.researchPhase.reviewEndDate && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>Review Period:</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {formatDate(conference.researchPhase.reviewStartDate)} - {formatDate(conference.researchPhase.reviewEndDate)}
                        </Text>
                    </View>
                )}

                {conference.researchPhase.reviseStartDate && conference.researchPhase.reviseEndDate && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>Revision Period:</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {formatDate(conference.researchPhase.reviseStartDate)} - {formatDate(conference.researchPhase.reviseEndDate)}
                        </Text>
                    </View>
                )}

                {conference.researchPhase.cameraReadyStartDate && conference.researchPhase.cameraReadyEndDate && (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>Camera Ready:</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {formatDate(conference.researchPhase.cameraReadyStartDate)} - {formatDate(conference.researchPhase.cameraReadyEndDate)}
                        </Text>
                    </View>
                )}

                {/* Revision Round Deadlines */}
                {conference.researchPhase.revisionRoundDeadlines && conference.researchPhase.revisionRoundDeadlines.length > 0 && (
                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Revision Rounds:</Text>
                        {conference.researchPhase.revisionRoundDeadlines.map((round, index) => (
                            <Text key={round.revisionRoundDeadlineId || index} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 }}>
                                Round {round.roundNumber}: {formatDate(round.endDate)}
                            </Text>
                        ))}
                    </View>
                )}
            </Surface>
        )}

        {/* Additional Research Information */}
        {conference.rankValue && (
            <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Conference Ranking:</Text>
                <Text style={{ color: 'white' }}>{conference.rankValue}</Text>
                {conference.rankingDescription && (
                    <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                        {conference.rankingDescription}
                    </Text>
                )}
            </Surface>
        )}

        {/* Refund Policies */}
        {conference.refundPolicies && conference.refundPolicies.length > 0 && (
            <View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    Refund Policies
                </Text>
                {conference.refundPolicies.map((policy) => (
                    <Surface
                        key={policy.refundPolicyId}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 8,
                            padding: 12,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                            Hoàn {policy.percentRefund || 0}% phí tham gia
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                            Hạn chót: {policy.refundDeadline ? new Date(policy.refundDeadline).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                        </Text>
                    </Surface>
                ))}
            </View>
        )}
    </View>
);

export default ResearchPaperInformationTab;