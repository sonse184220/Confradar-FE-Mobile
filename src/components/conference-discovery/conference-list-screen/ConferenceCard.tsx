import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    Card,
    Button,
    Chip,
    IconButton,
    Divider,
    Icon
} from 'react-native-paper';
import { ConferenceResponse } from '@/types/conference.type';

interface ConferenceCardProps {
    conference: ConferenceResponse;
    onPress: (conferenceId: string, type: 'research' | 'technical') => void;
    formatDate: (dateString?: string) => string;
    getCategoryName: (conference: ConferenceResponse) => string;
    getMinPrice: (conf: ConferenceResponse) => number | null;
    getMaxPrice: (conf: ConferenceResponse) => number | null;
}

const ConferenceCard: React.FC<ConferenceCardProps> = ({
    conference,
    onPress,
    formatDate,
    getCategoryName,
    getMinPrice,
    getMaxPrice
}) => {
    const minPrice = getMinPrice(conference);
    const maxPrice = getMaxPrice(conference);
    const priceText = minPrice !== null ?
        (minPrice === maxPrice ? `${minPrice.toLocaleString()}₫` : `${minPrice.toLocaleString()}₫ - ${maxPrice?.toLocaleString()}₫`) :
        'Miễn phí';

    const categoryName = getCategoryName(conference);

    return (
        <View style={{ marginBottom: 16, marginHorizontal: 16 }}>
            <Card
                style={{
                    backgroundColor: 'rgba(246, 241, 241, 0.1)',
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(246, 241, 241, 0.2)',
                    overflow: 'hidden',
                }}
                elevation={0}
            >
                <LinearGradient
                    colors={['#146C94', '#19A7CE', '#000000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16 }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Chip
                                mode="outlined"
                                style={{ backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', marginBottom: 8 }}
                                textStyle={{ color: '#F6F1F1', fontSize: 12 }}
                            >
                                {categoryName}
                            </Chip>
                            <Text
                                style={{ color: '#F6F1F1', fontWeight: 'bold', fontSize: 18, lineHeight: 24 }}
                                numberOfLines={2}
                            >
                                {conference.conferenceName}
                            </Text>
                        </View>
                        <IconButton
                            icon="heart-outline"
                            iconColor="#F6F1F1"
                            size={20}
                            onPress={() => { }}
                        />
                    </View>
                </LinearGradient>

                <Card.Content style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Icon source="calendar" size={16} color="#19A7CE" />
                                <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                    {formatDate(conference.startDate)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Icon source="map-marker" size={16} color="#19A7CE" />
                                <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                    {conference.address || 'Địa điểm chưa xác định'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon source="account-group" size={16} color="#19A7CE" />
                                <Text style={{ color: 'rgba(246, 241, 241, 0.8)', fontSize: 14, marginLeft: 8, flex: 1 }} numberOfLines={1}>
                                    {conference.totalSlot || 0} người tham gia
                                </Text>
                            </View>
                        </View>

                        <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', marginLeft: 16 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                <Icon source="clock" size={16} color="#FFD700" />
                                <Chip
                                    mode="flat"
                                    style={{
                                        backgroundColor: conference.isResearchConference ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                        height: 24,
                                        marginLeft: 4
                                    }}
                                    textStyle={{ color: '#F6F1F1', fontSize: 10 }}
                                >
                                    {conference.isResearchConference ? 'Research' : 'Technical'}
                                </Chip>
                            </View>
                            <Text style={{ color: '#F6F1F1', fontWeight: 'bold', fontSize: 18 }}>
                                {priceText}
                            </Text>
                        </View>
                    </View>

                    <Divider style={{ marginVertical: 12, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            {conference.description && (
                                <Text style={{ color: 'rgba(246, 241, 241, 0.6)', fontSize: 12 }} numberOfLines={2}>
                                    {conference.description}
                                </Text>
                            )}
                        </View>
                        <Button
                            mode="contained"
                            buttonColor="#19A7CE"
                            textColor="#000000"
                            style={{ borderRadius: 12 }}
                            compact
                            onPress={() => onPress(conference.conferenceId, conference.isResearchConference ? 'research' : 'technical')}
                        >
                            Chi tiết
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

export default ConferenceCard;