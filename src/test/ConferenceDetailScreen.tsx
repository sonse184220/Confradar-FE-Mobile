import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  Card,
  Avatar,
  Button,
  Chip,
  IconButton,
  Appbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

interface ConferenceDetailScreenProps {
  navigation?: any;
}

const imageMap: Record<string, any> = {
  conf1: require('../assets/conf1.jpg'),
  conf2: require('../assets/conf2.jpg'),
  taylorswift: require('../assets/taylorswift.jpg'),
};

const ConferenceDetailScreen: React.FC<ConferenceDetailScreenProps> = ({
  navigation,
}) => {
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
  };

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
          console.log('Check In Event');
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <EventImageSection />
        <EventInfoSection />
        <LocationSection />
        <HostSection />
        <AttendeesSection />
        <AboutSection />
        <CheckInButton />
      </ScrollView>
    </View>
  );
};

export default ConferenceDetailScreen;