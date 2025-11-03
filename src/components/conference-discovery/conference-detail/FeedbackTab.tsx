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

interface FeedbackTabProps {
    conference: ResearchConferenceDetailResponse | TechnicalConferenceDetailResponse;
}

// Component con cho FeedbackTab
const FeedbackTab: React.FC<FeedbackTabProps> = ({ conference }) => (
    <View>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
            Đánh giá từ khách hàng
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingVertical: 32 }}>
            Tính năng đánh giá sẽ được bổ sung sau
        </Text>
    </View>
);

export default FeedbackTab;