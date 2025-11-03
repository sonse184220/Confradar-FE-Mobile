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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeStackParamList } from '../navigation/HomeStack';
import { useConference } from '../hooks/useConference';
import { useTransaction } from '../hooks/useTransaction';
import { ConferencePriceResponse, ResearchConferenceDetailResponse, ResearchConferenceSessionResponse, TechnicalConferenceDetailResponse, TechnicalConferenceSessionResponse } from '../types/conference.type';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceDetailScreenProps {
  navigation?: any;
  route?: {
    params: {
      conferenceId: string;
      type?: string;
    };
  };
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ConferenceDetailScreen: React.FC<ConferenceDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [activeTab, setActiveTab] = useState('info');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<ConferencePriceResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const navigationTo = useNavigation<NavigationProp>();

  // Get conferenceId and type from route params
  const conferenceId = route?.params?.conferenceId || '';
  const type = route?.params?.type || 'technical';
  const isResearch = type === 'research';

  // Use the same logic as web ConferenceDetail
  const {
    technicalConference,
    technicalConferenceLoading,
    technicalConferenceError,
    refetchTechnicalConference,
    researchConference,
    researchConferenceLoading,
    researchConferenceError,
    refetchResearchConference
  } = useConference({ id: conferenceId });

  // const {
  //   purchaseTechTicket,
  //   purchaseResearchPaper,
  //   loading: paymentLoading,
  //   techPaymentError,
  //   researchPaymentError,
  // } = useTransaction();

  // const {
  //   purchaseTechTicket,
  //   purchaseResearchPaper,
  //   loading: paymentLoading,
  //   techPaymentError,
  //   researchPaymentError,
  // } = useTransaction();

  // Use the appropriate conference data based on type (like web)
  const conference = isResearch ? researchConference : technicalConference;
  const loading = isResearch ? researchConferenceLoading : technicalConferenceLoading;
  const error = isResearch ? researchConferenceError : technicalConferenceError;

  // Handle purchase ticket (like web)
  // const handlePurchaseTicket = async () => {
  //   if (!selectedTicket) return;

  //   try {
  //     let response;

  //     if (selectedTicket.isAuthor) {
  //       response = await purchaseResearchPaper({ conferencePriceId: selectedTicket.conferencePriceId });
  //     } else {
  //       response = await purchaseTechTicket({ conferencePriceId: selectedTicket.conferencePriceId });
  //     }

  //     if (response?.data) {
  //       // Handle payment URL redirect for mobile - you might want to open WebView or browser
  //       Alert.alert('Thanh toán', 'Chuyển hướng đến trang thanh toán...', [
  //         { text: 'OK', onPress: () => console.log('Payment URL:', response.data) }
  //       ]);
  //     } else {
  //       Alert.alert('Lỗi', 'Không nhận được đường dẫn thanh toán.');
  //     }
  //   } catch (error) {
  //     console.error('Purchase error:', error);
  //     Alert.alert('Lỗi', 'Có lỗi xảy ra khi thanh toán.');
  //   } finally {
  //     setIsDialogOpen(false);
  //   }
  // };

  // Format date and time functions (like web)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state (like web)
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: 'white', marginTop: 16 }}>Đang tải thông tin hội nghị...</Text>
      </View>
    );
  }

  // Error state (like web)
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <Text style={{ color: '#EF4444', marginBottom: 16, textAlign: 'center' }}>Có lỗi xảy ra khi tải thông tin hội nghị</Text>
        <Text style={{ color: 'white', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>{error.data?.Message}</Text>
        <Button mode="contained" onPress={() => isResearch ? refetchResearchConference() : refetchTechnicalConference()}>
          Thử lại
        </Button>
      </View>
    );
  }

  // No data state (like web)
  if (!conference) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <Text style={{ color: 'white' }}>Không tìm thấy thông tin hội nghị</Text>
      </View>
    );
  }

  const tabs = [
    { key: 'info', label: 'Conference Info' },
    { key: 'sessions', label: 'Sessions' },
    ...(isResearch ? [{ key: 'research', label: 'Details' }] : [{ key: 'details', label: 'Details' }]),
    { key: 'feedback', label: 'Feedback' }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      {/* Header with back button */}
      <View style={{
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#16213e',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          onPress={() => navigationTo.goBack()}
        />
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 }}>
          Chi tiết hội nghị
        </Text>
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          iconColor={isFavorite ? "#EF4444" : "white"}
          onPress={() => setIsFavorite(!isFavorite)}
        />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Hero Section */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: conference.bannerImageUrl || 'https://via.placeholder.com/400x200' }}
            style={{ width: screenWidth, height: 200 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 16
          }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              {conference.conferenceName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Icon name="event" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white' }}>{formatDate(conference.startDate)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="location-on" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', flex: 1 }}>{conference.address}</Text>
            </View>
            <Chip
              mode="flat"
              style={{ backgroundColor: isResearch ? '#EF4444' : '#3B82F6', alignSelf: 'flex-start' }}
              textStyle={{ color: 'white' }}
            >
              {isResearch ? 'Nghiên cứu' : 'Công nghệ'}
            </Chip>
          </View>
        </View>

        {/* Register Button */}
        <Surface style={{ margin: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            Đăng ký ngay
          </Text>
          <Text style={{ color: 'white', marginBottom: 16, opacity: 0.8 }}>
            Nhấn để chọn khung giá vé và thanh toán
          </Text>
          {isResearch ? (
            <Button
              mode="contained"
              disabled
              style={{ backgroundColor: '#6B7280' }}
            >
              Chỉ cho phép mua vé ở web
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={() => setIsDialogOpen(true)}
              style={{ backgroundColor: '#3B82F6' }}
            >
              Mở chọn vé
            </Button>
          )}
        </Surface>

        {/* Description */}
        <Surface style={{ margin: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <Text style={{ color: 'white', lineHeight: 24 }}>{conference.description}</Text>
        </Surface>

        {/* Tab Navigation */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderRadius: 16,
            padding: 4,
            // backdropFilter: 'blur(16px)'
          }}>
            <View style={{ flexDirection: 'row' }}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: 12,
                    backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 14,
                      fontWeight: '500',
                      color: activeTab === tab.key ? '#1F2937' : 'rgba(255,255,255,0.8)',
                    }}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>

            {/* Tab Content */}
            <View style={{ padding: 16 }}>
              {activeTab === 'info' && (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Conference Info
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
                </View>
              )}

              {activeTab === 'sessions' && (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Sessions
                  </Text>

                  {(() => {
                    const isResearch = conference.isResearchConference === true;
                    const sessions = isResearch
                      ? (conference as ResearchConferenceDetailResponse).researchSessions || []
                      : (conference as TechnicalConferenceDetailResponse).sessions || [];

                    return sessions.length > 0 ? (
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
                                marginBottom: 12
                              }}
                            >
                              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                {s.title}
                              </Text>
                              {s.description && (
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 8 }}>
                                  {s.description}
                                </Text>
                              )}
                              {s.startTime && s.endTime && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                  <Icon name="access-time" size={16} color="white" style={{ marginRight: 8 }} />
                                  <Text style={{ color: 'white', fontSize: 12 }}>
                                    {formatTime(s.startTime)} - {formatTime(s.endTime)}
                                  </Text>
                                </View>
                              )}
                              {s.date && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                  <Icon name="event" size={16} color="white" style={{ marginRight: 8 }} />
                                  <Text style={{ color: 'white', fontSize: 12 }}>
                                    {formatDate(s.date)}
                                  </Text>
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
                        } else {
                          const s = session as TechnicalConferenceSessionResponse;
                          return (
                            <Surface
                              key={s.conferenceSessionId || index}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 12
                              }}
                            >
                              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                {s.title}
                              </Text>
                              {s.description && (
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 8 }}>
                                  {s.description}
                                </Text>
                              )}
                              {s.startTime && s.endTime && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                  <Icon name="access-time" size={16} color="white" style={{ marginRight: 8 }} />
                                  <Text style={{ color: 'white', fontSize: 12 }}>
                                    {formatTime(s.startTime)} - {formatTime(s.endTime)}
                                  </Text>
                                </View>
                              )}
                              {s.sessionDate && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                  <Icon name="event" size={16} color="white" style={{ marginRight: 8 }} />
                                  <Text style={{ color: 'white', fontSize: 12 }}>
                                    {formatDate(s.sessionDate)}
                                  </Text>
                                </View>
                              )}
                              {s.room && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                  <Icon name="location-on" size={16} color="white" style={{ marginRight: 8 }} />
                                  <Text style={{ color: 'white', fontSize: 12 }}>
                                    {s.room.displayName || s.room.number || 'Phòng chưa xác định'}
                                  </Text>
                                </View>
                              )}
                              {s.speakers && s.speakers.length > 0 && (
                                <View style={{ marginBottom: 8 }}>
                                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                                    Diễn giả:
                                  </Text>
                                  {s.speakers.map((speaker) => (
                                    <View key={speaker.speakerId} style={{ marginLeft: 8, marginTop: 4 }}>
                                      <Text style={{ color: 'white', fontSize: 12 }}>
                                        {speaker.name}
                                      </Text>
                                      {speaker.description && (
                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>
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
                    );
                  })()}
                </View>
              )}

              {/* {activeTab === 'sessions' && (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Lịch trình Sessions
                  </Text>

                  {conference.sessions && conference.sessions.length > 0 ? (
                    conference.sessions.map((session) => (
                      <Surface key={session.conferenceSessionId} style={{ 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        borderRadius: 8, 
                        padding: 16, 
                        marginBottom: 12 
                      }}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                          {session.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Icon name="access-time" size={16} color="white" style={{ marginRight: 8 }} />
                          <Text style={{ color: 'white', fontSize: 12 }}>
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Icon name="event" size={16} color="white" style={{ marginRight: 8 }} />
                          <Text style={{ color: 'white', fontSize: 12 }}>
                            {formatDate(session.sessionDate)}
                          </Text>
                        </View>
                        {session.room && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Icon name="location-on" size={16} color="white" style={{ marginRight: 8 }} />
                            <Text style={{ color: 'white', fontSize: 12 }}>
                              {session.room.displayName || session.room.number || 'Phòng chưa xác định'}
                            </Text>
                          </View>
                        )}
                        {session.speakers && session.speakers.length > 0 && (
                          <Text style={{ color: 'white', fontSize: 12, marginBottom: 8 }}>
                            <Text style={{ fontWeight: 'bold' }}>Diễn giả: </Text>
                            {session.speakers.map(s => s.name).join(', ')}
                          </Text>
                        )}
                        <Text style={{ color: 'white', fontSize: 12 }}>{session.description}</Text>
                      </Surface>
                    ))
                  ) : (
                    <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingVertical: 32 }}>
                      Chưa có thông tin về sessions
                    </Text>
                  )}
                </View>
              )} */}

              {(activeTab === 'research' || activeTab === 'details') && (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    {isResearch ? 'Research Paper Information' : 'Conference Details'}
                  </Text>

                  {isResearch && researchConference ? (
                    <>
                      {/* Research specific fields */}
                      <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Paper Format:</Text>
                        <Text style={{ color: 'white', marginBottom: 12 }}>{researchConference.paperFormat || 'Chưa xác định'}</Text>

                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Number of Papers Accepted:</Text>
                        <Text style={{ color: 'white', marginBottom: 12 }}>{researchConference.numberPaperAccept || 'Chưa xác định'}</Text>

                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Ranking:</Text>
                        <Text style={{ color: 'white' }}>{researchConference.rankingDescription || 'Chưa xác định'}</Text>
                      </Surface>

                      {/* Research phases */}
                      {researchConference.researchPhase && (
                        <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 16 }}>
                          <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 12 }}>Important Deadlines:</Text>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Registration:</Text>
                            <Text style={{ color: 'white' }}>
                              {formatDate(researchConference.researchPhase.registrationStartDate)} - {formatDate(researchConference.researchPhase.registrationEndDate)}
                            </Text>
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Full Paper:</Text>
                            <Text style={{ color: 'white' }}>
                              {formatDate(researchConference.researchPhase.fullPaperStartDate)} - {formatDate(researchConference.researchPhase.fullPaperEndDate)}
                            </Text>
                          </View>
                          <View style={{ marginBottom: 8 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Review:</Text>
                            <Text style={{ color: 'white' }}>
                              {formatDate(researchConference.researchPhase.reviewStartDate)} - {formatDate(researchConference.researchPhase.reviewEndDate)}
                            </Text>
                          </View>
                        </Surface>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Technical Conference Details */}
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
                            Conference Policy
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
                    </>
                  )}
                </View>
              )}

              {activeTab === 'feedback' && (
                <View>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                    Feedback
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', paddingVertical: 32 }}>
                    Tính năng đánh giá sẽ được bổ sung sau
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Ticket Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDialogOpen}
        onRequestClose={() => setIsDialogOpen(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <Surface style={{
            backgroundColor: 'rgba(26, 26, 46, 0.95)',
            borderRadius: 16,
            padding: 24,
            width: screenWidth - 32,
            maxHeight: '80%'
          }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
              Chọn loại vé
            </Text>

            <ScrollView style={{ maxHeight: 300, marginBottom: 16 }}>
              {(conference.conferencePrices || []).map((ticket) => (
                <TouchableOpacity
                  key={ticket.conferencePriceId}
                  onPress={() => setSelectedTicket(ticket)}
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                    borderWidth: 2,
                    borderColor: selectedTicket?.conferencePriceId === ticket.conferencePriceId ? '#EF4444' : 'rgba(255,255,255,0.2)',
                    backgroundColor: selectedTicket?.conferencePriceId === ticket.conferencePriceId ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{ticket.ticketName}</Text>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>
                      {(ticket.ticketPrice || 0).toLocaleString("vi-VN")}₫
                    </Text>
                  </View>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
                    {ticket.ticketDescription}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                mode="outlined"
                onPress={() => setIsDialogOpen(false)}
                style={{ flex: 1, marginRight: 8, borderColor: '#6B7280' }}
                textColor="white"
              >
                Hủy
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  // console.log('Check In Event');
                  // navigationTo.navigate('TicketSelection')
                  navigation.navigate('TicketSelection', {
                    conferenceId: conference?.conferenceId,
                  });
                }}
                // onPress={handlePurchaseTicket}
                // disabled={!selectedTicket || paymentLoading}
                // loading={paymentLoading}
                style={{ flex: 1, marginLeft: 8, backgroundColor: '#EF4444' }}
              >
                {/* {paymentLoading ? 'Đang xử lý...' : 'Thanh toán'} */}
                "Đăng ký"
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>

      {/* Image Modal */}
      {selectedImage && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 40, right: 16, zIndex: 1 }}
              onPress={() => setSelectedImage(null)}
            >
              <Icon name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={{ width: screenWidth - 32, height: 400 }}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ConferenceDetailScreen;