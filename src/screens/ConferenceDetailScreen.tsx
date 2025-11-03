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
  ImageBackground,
  StyleSheet,
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
import { HomeStackParamList } from '../navigation/HomeStack';
import { useConference } from '../hooks/useConference';
import { useTransaction } from '../hooks/useTransaction';
import { ConferencePricePhaseResponse, ConferencePriceResponse, ResearchConferenceDetailResponse, ResearchConferenceSessionResponse, TechnicalConferenceDetailResponse, TechnicalConferenceSessionResponse } from '../types/conference.type';
import InformationTab from '@/components/conference-discovery/conference-detail/InformationTab';
import SessionsTab from '@/components/conference-discovery/conference-detail/SessionsTab';
import ConferencePriceTab from '@/components/conference-discovery/conference-detail/ConferencePriceTab';
import ResearchPaperInformationTab from '@/components/conference-discovery/conference-detail/ResearchPaperInformationTab';
import FeedbackTab from '@/components/conference-discovery/conference-detail/FeedbackTab';
import { BlurView } from '@react-native-community/blur';

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

  const conferenceId = route?.params?.conferenceId || '';
  const type = route?.params?.type || 'technical';
  const isResearch = type === 'research';

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

  const conference = isResearch ? researchConference : technicalConference;
  const loading = isResearch ? researchConferenceLoading : technicalConferenceLoading;
  const error = isResearch ? researchConferenceError : technicalConferenceError;

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ color: 'white', marginTop: 16 }}>Đang tải thông tin hội nghị...</Text>
      </View>
    );
  }

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

  if (!conference) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        <Text style={{ color: 'white' }}>Không tìm thấy thông tin hội nghị</Text>
      </View>
    );
  }

  const tabs = [
    { key: 'info', label: 'Information' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'price', label: 'Price' },
    ...(isResearch ? [{ key: 'research', label: 'Research Detail' }] : []),
    { key: 'feedback', label: 'Feedback' }
  ];

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        mode="center-aligned"
        style={{ backgroundColor: '#16213e' }}>
        <Appbar.BackAction onPress={() => navigationTo.goBack()} color="white" />
        <Appbar.Content
          title="Chi tiết hội nghị"
          titleStyle={{ color: 'white', fontWeight: 'bold' }}
        />
        <IconButton
          icon={isFavorite ? "heart" : "heart-outline"}
          iconColor={isFavorite ? "#EF4444" : "white"}
          onPress={() => setIsFavorite(!isFavorite)}
        />
      </Appbar.Header>

      {/* <View style={{ position: 'relative', width: '100%', height: 200 }}>
        <ImageBackground
          source={{ uri: conference.bannerImageUrl || 'https://via.placeholder.com/400x200' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          blurRadius={50}
        >
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 40,
          }}>
            <IconButton
              icon="arrow-left"
              iconColor="white"
              onPress={() => navigationTo.goBack()}
            />

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {conference.conferenceName}
              </Text>
              <Chip
                mode="flat"
                style={{
                  backgroundColor: isResearch ? '#EF4444' : '#3B82F6',
                  alignSelf: 'flex-start',
                  marginTop: 4
                }}
                textStyle={{ color: 'white', fontSize: 12 }}
              >
                {isResearch ? 'Nghiên cứu' : 'Công nghệ'}
              </Chip>
            </View>

            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              iconColor={isFavorite ? "#EF4444" : "white"}
              onPress={() => setIsFavorite(!isFavorite)}
            />
          </View>
        </ImageBackground>
      </View> */}
      {/* <View style={{
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
      </View> */}

      <ScrollView style={{ flex: 1 }}>
        {/* Hero Section */}
        <View className="px-4 pb-4">
          <View className="overflow-hidden rounded-3xl" style={{ aspectRatio: 16 / 6 }}>
            <ImageBackground
              source={{ uri: conference.bannerImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
              blurRadius={50}
            >
              <View className="flex-row items-center p-4 h-full">
                <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
                  <Image
                    source={{ uri: conference.bannerImageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-white text-xl font-bold mb-2">
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
            </ImageBackground>
          </View>
        </View>
        {/* <View style={{ position: 'relative' }}>
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
        </View> */}

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
            // overflow: 'hidden',
            // backdropFilter: 'blur(16px)'
          }}>
            {/* <BlurView
              style={{ ...StyleSheet.absoluteFillObject, borderRadius: 16 }}
              blurType="light"
              blurAmount={16}
            /> */}
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
                <InformationTab
                  conference={conference}
                  isResearch={isResearch}
                  formatDate={formatDate}
                  setSelectedImage={setSelectedImage}
                />
              )}

              {activeTab === 'sessions' && (
                <SessionsTab
                  conference={conference}
                  isResearch={isResearch}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              )}

              {activeTab === 'price' && (
                <ConferencePriceTab
                  conference={conference}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
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

              {activeTab === 'research' && isResearch && (
                <ResearchPaperInformationTab
                  conference={(conference as ResearchConferenceDetailResponse)}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              )}

              {activeTab === 'feedback' && (
                <FeedbackTab conference={conference} />
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