import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import {
  Card,
  Avatar,
  Button,
  Chip,
  IconButton,
  Appbar,
  Surface,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HomeStackParamList } from '../navigation/HomeStack';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceDetailScreenProps {
  navigation?: any;
}

type Session = {
  id: number;
  title: string;
  speaker: string;
  time: string;
  room: string;
  type: string;
};

type ConferenceType = 'technical' | 'research';

interface ConferenceDetail {
  sponsors: { name: string; logo: string }[];
  targetAudience: string[];
  faq: { question: string; answer: string }[];
  policy: string;
  photos: string[];
  speakers?: { name: string; title: string; image: string }[];
  ranking?: string;
  deadlines?: {
    abstract: string;
    paper: string;
    review: string;
    ticket: string;
  };
  acceptedPapers?: number;
}

const imageMap: Record<string, any> = {
  conf1: require('../assets/conf1.jpg'),
  conf2: require('../assets/conf2.jpg'),
  taylorswift: require('../assets/taylorswift.jpg'),
};

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ConferenceDetailScreen: React.FC<ConferenceDetailScreenProps> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2024-11-23');
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const navigationTo = useNavigation<NavigationProp>();

  const tabs = ['Conference Info', 'Sessions', 'Details', 'Feedback'];

  const eventData = {
    title: 'Hội thảo Khoa học Quốc tế về Trí tuệ Nhân tạo và Ứng dụng',
    date: 'Thứ Bảy, 23 Tháng 11, 2024',
    time: '8:00 - 17:30',
    day: '23',
    month: 'Thg 11',
    location: 'Tòa nhà Innovation, Đại học FPT, TP. Hồ Chí Minh',
    host: 'PGS. TS. Nguyễn Văn An',
    attendees: 124,
    maxAttendees: 200,
    description: `Hội thảo quy tụ các chuyên gia hàng đầu trong lĩnh vực Trí tuệ Nhân tạo (AI) và Khoa học Dữ liệu nhằm chia sẻ những tiến bộ mới nhất, thảo luận các hướng nghiên cứu tiềm năng và ứng dụng thực tiễn trong công nghiệp. Tham dự hội thảo, bạn sẽ có cơ hội giao lưu, học hỏi và mở rộng mạng lưới hợp tác nghiên cứu trong nước và quốc tế.`,
    image: 'conf1',
    peopleGoing: ['taylorswift', 'taylorswift', 'taylorswift', 'taylorswift'],
    // title: 'Basketball Offline Class On Sritex',
    // date: 'Sunday, September 2024',
    // time: '7:30am - 9am',
    // day: '15',
    // month: 'Sep',
    // location: '4517 Washington Ave.\nManchester Lorem Ipsum',
    // host: 'Mike Wazowki',
    // attendees: 24,
    // maxAttendees: 50,
    // description: `Unlock Your Potential On The Court With Our Basketball Offline Class At Sritex! Designed For Players Of All Skill Levels, This Hands-On Class Will Help You Sharpen Your Fundamentals, Enhance Your Game Strategy, And Build Teamwork Skills In A Fun, Supportive Environment. Whether You're A Beginner Looking To Learn The Basics Or An Advanced Player Aiming To Elevate Your Performance, Our Experienced Coaches Will Guide You Through Drills, Exercises, And Live Games. Join Us And Become The Best Version Of Yourself On The Court!`,
    // image: 'conf1',
    // // 'https://via.placeholder.com/400x200/4A5568/FFFFFF?text=Basketball+Court',
    // peopleGoing: [
    //   // 'https://via.placeholder.com/40/FF6B6B/FFFFFF?text=A',
    //   // 'https://via.placeholder.com/40/4ECDC4/FFFFFF?text=B',
    //   // 'https://via.placeholder.com/40/45B7D1/FFFFFF?text=C',
    //   // 'https://via.placeholder.com/40/96CEB4/FFFFFF?text=D',
    //   'taylorswift',
    //   'taylorswift',
    //   'taylorswift',
    //   'taylorswift',
    // ],
    type: 'research' as ConferenceType, // or 'research'
  };

  // Mock data for sessions
  const sessionData: Record<string, Session[]> = {
    '2024-11-23': [
      {
        id: 1,
        title: 'Opening Keynote: The Future of AI',
        speaker: 'Dr. John Smith',
        time: '08:30 - 09:30',
        room: 'Main Hall',
        type: 'keynote'
      },
      {
        id: 2,
        title: 'Machine Learning Fundamentals',
        speaker: 'Prof. Jane Doe',
        time: '10:00 - 11:30',
        room: 'Room A',
        type: 'presentation'
      },
      {
        id: 3,
        title: 'Deep Learning Applications',
        speaker: 'Dr. Mike Johnson',
        time: '13:30 - 15:00',
        room: 'Room B',
        type: 'workshop'
      }
    ],
    '2024-11-24': [
      {
        id: 4,
        title: 'Neural Networks in Practice',
        speaker: 'Dr. Sarah Wilson',
        time: '09:00 - 10:30',
        room: 'Room A',
        type: 'presentation'
      }
    ]
  };

  const conferenceDetails: Record<ConferenceType, ConferenceDetail> = {
    technical: {
      speakers: [
        { name: 'Dr. John Smith', title: 'AI Research Director', image: 'taylorswift' },
        { name: 'Prof. Jane Doe', title: 'ML Expert', image: 'taylorswift' }
      ],
      sponsors: [
        { name: 'Google', logo: 'https://via.placeholder.com/100x50/4285F4/FFFFFF?text=Google' },
        { name: 'Microsoft', logo: 'https://via.placeholder.com/100x50/00BCF2/FFFFFF?text=Microsoft' }
      ],
      targetAudience: ['Researchers', 'Data Scientists', 'AI Engineers', 'Graduate Students'],
      faq: [
        { question: 'What should I bring?', answer: 'Laptop and notebook for taking notes.' },
        { question: 'Is lunch provided?', answer: 'Yes, lunch is included in the registration fee.' }
      ],
      policy: 'Photography is allowed. Recording requires permission from speakers.',
      photos: ['conf1', 'conf2', 'taylorswift', 'conf1', 'conf2']
    },
    research: {
      sponsors: [
        { name: 'IEEE', logo: 'https://via.placeholder.com/100x50/00629B/FFFFFF?text=IEEE' }
      ],
      targetAudience: ['PhD Students', 'Researchers', 'Academics'],
      faq: [
        { question: 'How to submit paper?', answer: 'Submit through EasyChair system.' }
      ],
      policy: 'All presentations must be original research.',
      photos: ['conf1', 'conf2'],
      ranking: 'Q1 Conference (Impact Factor: 3.2)',
      deadlines: {
        abstract: '2024-09-15',
        paper: '2024-10-01',
        review: '2024-10-30',
        ticket: '2024-11-15'
      },
      acceptedPapers: 45
    }
  };

  const feedbacks = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      avatar: 'taylorswift',
      rating: 5,
      comment: 'Hội thảo rất bổ ích, nội dung chất lượng cao!',
      date: '2024-11-20'
    },
    {
      id: 2,
      user: 'Trần Thị B',
      avatar: 'taylorswift',
      rating: 4,
      comment: 'Speakers giỏi, tuy nhiên thời gian hơi ngắn.',
      date: '2024-11-19'
    }
  ];

  const EventImageSection = () => (
    // <View className="px-4 pb-4">
    //   <Card className="overflow-hidden">
    //     <View className="relative">
    //       <Image
    //         // source={{ uri: eventData.image }}
    //         source={imageMap[eventData.image]}
    //         className="w-full h-48"
    //         resizeMode="cover"
    //       />
    //       <View className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-sm">
    //         <Text className="text-lg font-bold text-gray-900">{eventData.day}</Text>
    //         <Text className="text-sm text-gray-600">{eventData.month}</Text>
    //       </View>
    //     </View>
    //   </Card>
    // </View>
    <View className="px-4 pb-4">
      <View className="overflow-hidden rounded-3xl" style={{ aspectRatio: 16 / 6 }}>
        <ImageBackground
          source={imageMap[eventData.image]}
          className="w-full h-full"
          resizeMode="cover"
          blurRadius={50}
        >
          <View className="flex-row items-center p-4 h-full">
            <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
              <Image
                source={imageMap[eventData.image]}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-2">
                {eventData.title}
              </Text>
              <View className="bg-white/30 rounded-full px-3 py-1 self-start">
                <Text className="text-white text-sm font-medium">
                  {eventData.attendees} người đã đăng ký
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );

  const EventInfoSection = () => (
    <View className="px-4 pb-4">
      <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
        <View className="flex-row">
          <View className="bg-gray-100 rounded-xl px-4 py-3 mr-4 items-center justify-center">
            <Text className="text-sm text-gray-500 uppercase">{eventData.month}</Text>
            <Text className="text-3xl font-bold text-gray-900">{eventData.day}</Text>
          </View>

          <View className="flex-1 justify-center">
            <View className="flex-row items-center mb-2">
              <Icon name="access-time" size={18} color="#E5E7EB" />
              <Text className="text-base text-white ml-2">{eventData.date}</Text>
            </View>

            <View className="flex-row items-center">
              <Icon name="schedule" size={18} color="#E5E7EB" />
              <Text className="text-base text-white ml-2">{eventData.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    // <View className="px-4 pb-4">
    //   <View className="bg-white rounded-2xl p-4 shadow-sm">
    //     <Text className="text-2xl font-bold text-gray-900 mb-2">
    //       {eventData.title}
    //     </Text>

    //     <View className="flex-row items-center mb-3">
    //       <Icon name="access-time" size={20} color="#6B7280" />
    //       <Text className="text-base text-gray-700 ml-2">{eventData.date}</Text>
    //     </View>

    //     <View className="flex-row items-center mb-4">
    //       <Icon name="schedule" size={20} color="#6B7280" />
    //       <Text className="text-base text-gray-700 ml-2">{eventData.time}</Text>
    //     </View>
    //   </View>
    // </View>
  );

  const LocationSection = () => (
    <View className="px-4 pb-4">
      <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="bg-white/20 rounded-xl p-2 mr-3">
              <Icon name="location-on" size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white text-sm flex-1" numberOfLines={2}>
              {eventData.location}
            </Text>
          </View>

          <TouchableOpacity className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 ml-2">
            <Text className="text-white text-xs font-medium">
              Xem bản đồ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // <View className="px-4 pb-4">
    //   <Card className="p-4">
    //     <View className="flex-row items-start">
    //       <View className="bg-gray-100 rounded-lg p-3 mr-4">
    //         <Icon name="location-on" size={24} color="#4B5563" />
    //       </View>
    //       <View className="flex-1">
    //         <Text className="text-base text-gray-900 font-medium mb-2">
    //           {eventData.location}
    //         </Text>
    //         <TouchableOpacity>
    //           <View className="bg-gray-100 rounded-lg px-4 py-2 self-start">
    //             <Text className="text-sm text-gray-700 font-medium">
    //               Get Direction
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </Card>
    // </View>
  );

  const HostSection = () => (
    <View className="px-4 pb-4">
      <Text className="text-lg font-semibold text-white mb-3">Đơn vị tổ chức</Text>
      <View className="flex-row items-center justify-between bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
        <View className="flex-row items-center flex-1">
          <Avatar.Text
            size={44}
            label="MW"
            style={{ backgroundColor: '#F59E0B' }}
          />
          <Text className="text-base font-medium text-white ml-3">
            {eventData.host}
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="#FFFFFF" />
      </View>
    </View>
    // <View className="px-4 pb-4">
    //   <Text className="text-lg font-semibold text-gray-900 mb-3">Hosted By</Text>
    //   <View className="flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
    //     <View className="flex-row items-center flex-1">
    //       <Avatar.Text
    //         size={48}
    //         label="MW"
    //         style={{ backgroundColor: '#F59E0B' }}
    //       />
    //       <Text className="text-base font-medium text-gray-900 ml-3">
    //         {eventData.host}
    //       </Text>
    //     </View>
    //     <IconButton
    //       icon="chevron-right"
    //       size={20}
    //       iconColor="#6B7280"
    //     />
    //   </View>
    // </View>
  );

  const AttendeesSection = () => (
    <View className="px-4 pb-4">
      <Text className="text-lg font-semibold text-white mb-3">
        Người tham dự ({eventData.attendees} người)
      </Text>
      <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
        <View className="flex-row items-center">
          {eventData.peopleGoing.slice(0, 4).map((avatar, index) => (
            <View
              key={index}
              className={`w-10 h-10 rounded-full border-2 border-white ${index > 0 ? '-ml-2' : ''
                }`}
            >
              <Avatar.Image size={36} source={imageMap[avatar]} />
            </View>
          ))}
          {eventData.attendees > 4 && (
            <View className="w-10 h-10 rounded-full bg-white/30 -ml-2 items-center justify-center border-2 border-white">
              <Text className="text-xs font-medium text-white">
                +{eventData.attendees - 4}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
    // <View className="px-4 pb-4">
    //   <Text className="text-lg font-semibold text-gray-900 mb-3">
    //     People Going ({eventData.attendees} People)
    //   </Text>
    //   <View className="flex-row items-center">
    //     <View className="flex-row">
    //       {eventData.peopleGoing.slice(0, 4).map((avatar, index) => (
    //         <View
    //           key={index}
    //           className={`w-10 h-10 rounded-full border-2 border-white ${index > 0 ? '-ml-2' : ''
    //             }`}
    //         >
    //           <Avatar.Image
    //             size={36}
    //             // source={{ uri: avatar }}
    //             source={imageMap[avatar]}
    //           />
    //         </View>
    //       ))}
    //       {eventData.attendees > 4 && (
    //         <View className="w-10 h-10 rounded-full bg-gray-200 -ml-2 items-center justify-center border-2 border-white">
    //           <Text className="text-xs font-medium text-gray-600">
    //             +{eventData.attendees - 4}
    //           </Text>
    //         </View>
    //       )}
    //     </View>
    //   </View>
    // </View>
  );

  const AboutSection = () => (
    <View className="px-4 pb-6">
      <Text className="text-lg font-semibold text-white mb-3">Giới thiệu hội thảo</Text>
      <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
        <Text className="text-base text-white/90 leading-6">
          {eventData.description}
        </Text>
      </View>
    </View>
    // <View className="px-4 pb-6">
    //   <Text className="text-lg font-semibold text-gray-900 mb-3">About Event</Text>
    //   <View className="bg-white rounded-2xl p-4 shadow-sm">
    //     <Text className="text-base text-gray-700 leading-6">
    //       {eventData.description}
    //     </Text>
    //   </View>
    // </View>
  );

  const CheckInButton = () => (
    <View className="px-4 pb-6">
      <TouchableOpacity
        onPress={() => {
          // console.log('Check In Event');
          navigationTo.navigate('TicketSelection')
        }}
        className="bg-white rounded-2xl py-4 flex-row items-center justify-center"
      >
        <Icon name="check-circle" size={20} color="#1F2937" />
        <Text className="text-gray-900 text-base font-semibold ml-2">
          Đăng ký ngay
        </Text>
      </TouchableOpacity>
    </View>
    // <View className="px-4 pb-6">
    //   <Button
    //     mode="contained"
    //     onPress={() => {
    //       // Handle check-in
    //       console.log('Check In Event');
    //     }}
    //     contentStyle={{ paddingVertical: 8 }}
    //     style={{
    //       backgroundColor: '#1F2937',
    //       borderRadius: 16,
    //     }}
    //     labelStyle={{
    //       fontSize: 16,
    //       fontWeight: '600',
    //       color: '#FFFFFF',
    //     }}
    //   >
    //     <Icon name="check-circle" size={20} color="#FFFFFF" />
    //     {'  '}Check In Event
    //   </Button>
    // </View>
  );

  // Tab Navigation Component
  const TabNavigation = () => (
    <View className="px-4 pb-4">
      <View className="bg-white/10 border border-white/20 rounded-2xl p-1 backdrop-blur-lg">
        <View className="flex-row">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              className={`flex-1 py-3 px-2 rounded-xl ${activeTab === index ? 'bg-white' : ''
                }`}
            >
              <Text
                className={`text-center text-sm font-medium ${activeTab === index ? 'text-gray-900' : 'text-white/80'
                  }`}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Conference Info Content (existing sections)
  const ConferenceInfoContent = () => (
    <>
      <EventImageSection />
      <EventInfoSection />
      <LocationSection />
      <HostSection />
      <AttendeesSection />
      <AboutSection />
      <CheckInButton />
    </>
  );

  // Sessions Content
  const SessionsContent = () => {
    const dates = Object.keys(sessionData);
    const currentSessions = showAllSessions
      ? Object.values(sessionData).flat()
      : sessionData[selectedDate] || [];

    return (
      <View className="px-4">
        {/* Calendar Navigation */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-white mb-3">Sessions</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-medium">November 2024</Text>
              <TouchableOpacity
                onPress={() => setShowAllSessions(!showAllSessions)}
                className="bg-white/20 rounded-lg px-3 py-1"
              >
                <Text className="text-white text-sm">
                  {showAllSessions ? 'Show by date' : 'Show all'}
                </Text>
              </TouchableOpacity>
            </View>

            {!showAllSessions && (
              <View className="flex-row justify-between">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <View key={index} className="items-center">
                    <Text className="text-white/60 text-xs mb-2">{day}</Text>
                    <View className="w-8 h-8" />
                  </View>
                ))}
              </View>
            )}

            {!showAllSessions && (
              <View className="flex-row justify-between mt-2">
                {[19, 20, 21, 22, 23, 24, 25].map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDate(`2024-11-${date}`)}
                    className={`w-8 h-8 rounded-full items-center justify-center ${selectedDate === `2024-11-${date}` ? 'bg-white' : ''
                      }`}
                  >
                    <Text
                      className={`text-sm ${selectedDate === `2024-11-${date}` ? 'text-gray-900 font-bold' : 'text-white'
                        }`}
                    >
                      {date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Sessions List */}
        <View className="space-y-3">
          {currentSessions.map((session) => (
            <View
              key={session.id}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg"
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-white font-semibold text-base mb-1">
                    {session.title}
                  </Text>
                  <Text className="text-white/80 text-sm">
                    by {session.speaker}
                  </Text>
                </View>
                <Chip
                  mode="outlined"
                  textStyle={{ color: '#fff', fontSize: 12 }}
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  {session.type}
                </Chip>
              </View>

              <View className="flex-row items-center mt-3">
                <View className="flex-row items-center mr-4">
                  <Icon name="access-time" size={16} color="#E5E7EB" />
                  <Text className="text-white/80 text-sm ml-1">{session.time}</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="location-on" size={16} color="#E5E7EB" />
                  <Text className="text-white/80 text-sm ml-1">{session.room}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Details Content
  const DetailsContent = () => {
    const details = conferenceDetails[eventData.type];

    return (
      <View className="px-4 space-y-4">
        {/* Speakers Section (Technical only) */}
        {eventData.type === 'technical' && details.speakers && (
          <View>
            <Text className="text-lg font-semibold text-white mb-3">Speakers</Text>
            <View className="space-y-3">
              {details.speakers.map((speaker, index) => (
                <View
                  key={index}
                  className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg"
                >
                  <View className="flex-row items-center">
                    <Avatar.Image size={50} source={imageMap[speaker.image]} />
                    <View className="ml-3 flex-1">
                      <Text className="text-white font-semibold">{speaker.name}</Text>
                      <Text className="text-white/80 text-sm">{speaker.title}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Conference Ranking (Research only) */}
        {eventData.type === 'research' && (
          <View>
            <Text className="text-lg font-semibold text-white mb-3">Conference Ranking</Text>
            <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
              <Text className="text-white">{details.ranking}</Text>
            </View>
          </View>
        )}

        {/* Deadlines (Research only) */}
        {eventData.type === 'research' && details.deadlines && (
          <View>
            <Text className="text-lg font-semibold text-white mb-3">Important Deadlines</Text>
            <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-white/80">Abstract Submission:</Text>
                <Text className="text-white">{details.deadlines.abstract}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/80">Paper Deadline:</Text>
                <Text className="text-white">{details.deadlines.paper}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/80">Review Deadline:</Text>
                <Text className="text-white">{details.deadlines.review}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-white/80">Ticket Sales:</Text>
                <Text className="text-white">{details.deadlines.ticket}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Accepted Papers (Research only) */}
        {eventData.type === 'research' && (
          <View>
            <Text className="text-lg font-semibold text-white mb-3">Accepted Papers</Text>
            <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
              <Text className="text-white text-2xl font-bold">{details.acceptedPapers}</Text>
              <Text className="text-white/80">papers accepted</Text>
            </View>
          </View>
        )}

        {/* Sponsors */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">Sponsors</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <View className="flex-row flex-wrap">
              {details.sponsors.map((sponsor, index) => (
                <View key={index} className="mr-4 mb-2 items-center">
                  <View className="w-20 h-10 bg-white rounded-lg items-center justify-center">
                    <Text className="text-xs font-bold text-gray-800">{sponsor.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Target Audience */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">Target Audience</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <View className="flex-row flex-wrap">
              {details.targetAudience.map((audience, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  textStyle={{ color: '#fff', fontSize: 12 }}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    marginRight: 8,
                    marginBottom: 8
                  }}
                >
                  {audience}
                </Chip>
              ))}
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">FAQ</Text>
          <View className="space-y-3">
            {details.faq.map((item, index) => (
              <View
                key={index}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg"
              >
                <Text className="text-white font-semibold mb-2">{item.question}</Text>
                <Text className="text-white/80">{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Policy */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">Conference Policy</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <Text className="text-white/90">{details.policy}</Text>
          </View>
        </View>

        {/* Photos */}
        <View className="pb-6">
          <Text className="text-lg font-semibold text-white mb-3">Conference Photos</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <View className="flex-row flex-wrap">
              {details.photos.slice(0, 3).map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPhotoIndex(index);
                    setPhotoModalVisible(true);
                  }}
                  className="w-20 h-20 rounded-lg overflow-hidden mr-2 mb-2"
                >
                  <Image
                    source={imageMap[photo]}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
              {details.photos.length > 3 && (
                <TouchableOpacity
                  onPress={() => setPhotoModalVisible(true)}
                  className="w-20 h-20 rounded-lg bg-white/20 items-center justify-center"
                >
                  <Text className="text-white font-bold">+{details.photos.length - 3}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Feedback Content
  const FeedbackContent = () => {
    const [newFeedback, setNewFeedback] = useState('');
    const [newRating, setNewRating] = useState(5);

    const renderStars = (rating: number,
      interactive: boolean = false,
      onPress: ((rating: number) => void) | null = null) => {
      return (
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => interactive && onPress && onPress(star)}
              disabled={!interactive}
            >
              <Icon
                name={star <= rating ? 'star' : 'star-border'}
                size={20}
                color="#FFD700"
                style={{ marginRight: 2 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    return (
      <View className="px-4">
        {/* Add Feedback Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Share Your Feedback</Text>
          <View className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg">
            <View className="mb-4">
              <Text className="text-white mb-2">Rating:</Text>
              {renderStars(newRating, true, setNewRating)}
            </View>

            <View className="mb-4">
              <Text className="text-white mb-2">Your Comment:</Text>
              <TextInput
                value={newFeedback}
                onChangeText={setNewFeedback}
                placeholder="Share your experience..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={4}
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                // Handle submit feedback
                console.log('Submit feedback:', { rating: newRating, comment: newFeedback });
                setNewFeedback('');
                setNewRating(5);
              }}
              className="bg-white rounded-xl py-3 items-center"
            >
              <Text className="text-gray-900 font-semibold">Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Existing Feedbacks */}
        <View>
          <Text className="text-lg font-semibold text-white mb-3">
            Reviews ({feedbacks.length})
          </Text>
          <View className="space-y-4">
            {feedbacks.map((feedback) => (
              <View
                key={feedback.id}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-lg"
              >
                <View className="flex-row items-start mb-3">
                  <Avatar.Image size={40} source={imageMap[feedback.avatar]} />
                  <View className="ml-3 flex-1">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-white font-semibold">{feedback.user}</Text>
                      <Text className="text-white/60 text-xs">{feedback.date}</Text>
                    </View>
                    <View className="mt-1">
                      {renderStars(feedback.rating)}
                    </View>
                  </View>
                </View>

                <Text className="text-white/90 leading-5">{feedback.comment}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Photo Modal
  const PhotoModal = () => (
    <Modal
      visible={photoModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setPhotoModalVisible(false)}
    >
      <View className="flex-1 bg-black/90 justify-center items-center">
        <TouchableOpacity
          onPress={() => setPhotoModalVisible(false)}
          className="absolute top-12 right-4 z-10 bg-white/20 rounded-full p-2"
        >
          <Icon name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <FlatList
          data={conferenceDetails[eventData.type].photos}
          horizontal
          pagingEnabled
          initialScrollIndex={selectedPhotoIndex}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ width: screenWidth }} className="justify-center items-center">
              <Image
                source={imageMap[item]}
                style={{ width: screenWidth - 40, height: 300 }}
                resizeMode="contain"
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            // fallback: cuộn thủ công khi index fail
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            }, 100);
          }}
          ref={flatListRef}
        />
      </View>
    </Modal>
  );

  return (
    <View className="flex-1">
      <Appbar.Header
        mode="center-aligned"
        style={{ backgroundColor: 'transparent', elevation: 0 }}
      >
        <Appbar.BackAction onPress={() => navigation?.goBack()} color="#F6F1F1" />
        <Appbar.Content
          title="Thông tin chi tiết"
          titleStyle={{ color: '#F6F1F1', fontWeight: 'bold', textAlign: 'center' }}
        />
      </Appbar.Header>

      <TabNavigation />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {activeTab === 0 && <ConferenceInfoContent />}
        {activeTab === 1 && <SessionsContent />}
        {activeTab === 2 && <DetailsContent />}
        {activeTab === 3 && <FeedbackContent />}
      </ScrollView>

      <PhotoModal />
    </View>
  );
};

export default ConferenceDetailScreen;