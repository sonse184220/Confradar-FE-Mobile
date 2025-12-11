import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import {
  Appbar,
  Avatar,
  IconButton,
  List,
  Surface,
  ActivityIndicator
} from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import type { Notification } from '@/types/notification.type';

const NotificationScreen = () => {
  const [activeTab, setActiveTab] = useState<'recent' | 'previously'>('recent');
  const {
    notifications,
    isNotiLoading,
    notificationsError,
    refetchNotifications
  } = useAuth();

  // Phân loại notifications theo recent (7 ngày gần đây) và previously
  const { recentNotifications, previousNotifications } = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent: Notification[] = [];
    const previous: Notification[] = [];

    notifications.forEach((notification) => {
      if (notification.createdAt) {
        const createdDate = new Date(notification.createdAt);
        if (createdDate >= sevenDaysAgo) {
          recent.push(notification);
        } else {
          previous.push(notification);
        }
      } else {
        recent.push(notification);
      }
    });

    return { recentNotifications: recent, previousNotifications: previous };
  }, [notifications]);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Get avatar text from title or type
  const getAvatarText = (notification: Notification) => {
    if (notification.title) {
      return notification.title.charAt(0).toUpperCase();
    }
    if (notification.type) {
      return notification.type.charAt(0).toUpperCase();
    }
    return 'N';
  };

  const renderNotificationItem = (item: Notification) => (
    <Surface
      key={item.notificationId || Math.random().toString()}
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <List.Item
        title={item.title || 'Notification'}
        description={item.message || ''}
        titleStyle={{
          color: '#ffffff',
          fontSize: 16,
          fontWeight: '600'
        }}
        descriptionStyle={{
          color: '#9ca3af',
          fontSize: 14,
          marginTop: 4
        }}
        left={(props) => (
          <View className="justify-center items-center mr-3">
            <Avatar.Text
              {...props}
              size={40}
              label={getAvatarText(item)}
              style={{ backgroundColor: '#8A2BE2' }}
              labelStyle={{ color: '#ffffff', fontSize: 16 }}
            />
          </View>
        )}
        right={(props) => (
          <View className="justify-center items-center">
            <Text className="text-gray-400 text-xs mb-1">
              {formatDate(item.createdAt)}
            </Text>
            {!item.readStatus && (
              <View className="w-2 h-2 bg-purple-600 rounded-full" />
            )}
          </View>
        )}
        className="py-4 px-4"
      />
    </Surface>
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="bg-gray-800 rounded-full p-6 mb-6">
        <IconButton
          icon="bell-outline"
          size={48}
          iconColor="#8A2BE2"
        />
      </View>
      <Text className="text-white text-xl font-semibold mb-2">
        No notifications yet
      </Text>
      <Text className="text-gray-400 text-center px-8 mb-6">
        Your notifications will appear here once you've received them.
      </Text>
      <Text className="text-gray-400 text-sm mb-2">
        Missing notifications?
      </Text>
      <TouchableOpacity onPress={() => setActiveTab('previously')}>
        <Text className="text-purple-400 text-sm underline">
          Go to historical notifications
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ErrorState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="bg-gray-800 rounded-full p-6 mb-6">
        <IconButton
          icon="alert-circle-outline"
          size={48}
          iconColor="#ef4444"
        />
      </View>
      <Text className="text-white text-xl font-semibold mb-2">
        Error loading notifications
      </Text>
      <Text className="text-gray-400 text-center px-8 mb-6">
        Something went wrong. Please try again.
      </Text>
      <TouchableOpacity
        onPress={refetchNotifications}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-medium">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const currentNotifications = activeTab === 'recent'
    ? recentNotifications
    : previousNotifications;

  const hasNotifications = currentNotifications.length > 0;

  return (
    <View className="flex-1">
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Appbar.Action
          icon="cog-outline"
          iconColor="#ffffff"
          onPress={() => { }}
        />
        <Appbar.Content
          title="Notifications"
          titleStyle={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: '600',
            textAlign: 'center'
          }}
          style={{ alignItems: 'center' }}
        />
        <Appbar.Action
          icon="cog-outline"
          iconColor="#ffffff"
          onPress={() => { }}
        />
      </Appbar.Header>

      <View className="mx-4 mb-4">
        <Surface style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          padding: 16
        }}>
          <Text className="text-white text-center font-medium">
            Customize your notifications!
          </Text>
        </Surface>
      </View>

      <View className="flex-row mx-4 mb-4">
        <TouchableOpacity
          className={`flex-1 py-3 px-4 rounded-lg mr-2 ${activeTab === 'recent' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          onPress={() => setActiveTab('recent')}
        >
          <Text className={`text-center font-medium ${activeTab === 'recent' ? 'text-white' : 'text-gray-400'
            }`}>
            Recent ({recentNotifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 px-4 rounded-lg ml-2 ${activeTab === 'previously' ? 'bg-purple-600' : 'bg-gray-800'
            }`}
          onPress={() => setActiveTab('previously')}
        >
          <Text className={`text-center font-medium ${activeTab === 'previously' ? 'text-white' : 'text-gray-400'
            }`}>
            Previously ({previousNotifications.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {isNotiLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#8A2BE2" />
            <Text className="text-gray-400 mt-4">Loading notifications...</Text>
          </View>
        ) : notificationsError ? (
          <ErrorState />
        ) : hasNotifications ? (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isNotiLoading}
                onRefresh={refetchNotifications}
                tintColor="#8A2BE2"
                colors={['#8A2BE2']}
              />
            }
          >
            {currentNotifications.map(renderNotificationItem)}

            <View className="py-6 items-center">
              <Text className="text-gray-400 text-sm mb-2">
                Missing notifications?
              </Text>
              <TouchableOpacity
                onPress={() => setActiveTab(
                  activeTab === 'recent' ? 'previously' : 'recent'
                )}
              >
                <Text className="text-purple-400 text-sm underline">
                  {activeTab === 'recent'
                    ? 'Go to historical notifications'
                    : 'Go to recent notifications'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <EmptyState />
        )}
      </View>
    </View>
  );
};

export default NotificationScreen;

// import React, { useState } from 'react';
// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import {
//   Appbar,
//   Avatar,
//   Button,
//   Card,
//   Chip,
//   Divider,
//   IconButton,
//   List,
//   Surface
// } from 'react-native-paper';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// interface NotificationItem {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   avatar: string;
//   isRead: boolean;
// }

// const NotificationScreen = () => {
//   const insets = useSafeAreaInsets();
//   const [activeTab, setActiveTab] = useState<'recent' | 'previously'>('recent');

//   const notifications: NotificationItem[] = [
//     {
//       id: '1',
//       title: 'Conference Tech Summit 2024',
//       description: 'New speaker announced: Sarah Johnson will be presenting on AI innovations',
//       date: 'Dec 16, 2023',
//       avatar: 'T',
//       isRead: false
//     },
//     {
//       id: '2',
//       title: 'Event Reminder',
//       description: 'Your registered event "Mobile Dev Conference" starts in 2 hours',
//       date: 'Dec 15, 2023',
//       avatar: 'E',
//       isRead: false
//     },
//     {
//       id: '3',
//       title: 'Registration Confirmed',
//       description: 'You have successfully registered for "React Native Workshop"',
//       date: 'Dec 14, 2023',
//       avatar: 'R',
//       isRead: true
//     }
//   ];

//   const previousNotifications: NotificationItem[] = [
//     {
//       id: '4',
//       title: 'Event Completed',
//       description: 'Thank you for attending "JavaScript Conference 2023"',
//       date: 'Dec 12, 2023',
//       avatar: 'J',
//       isRead: true
//     },
//     {
//       id: '5',
//       title: 'New Event Available',
//       description: 'Check out the latest conferences in your area',
//       date: 'Dec 10, 2023',
//       avatar: 'N',
//       isRead: true
//     }
//   ];

//   const renderNotificationItem = (item: NotificationItem) => (
//     <Surface key={item.id} className="mb-3 rounded-lg"
//       style={{
//         backgroundColor: '#1a1a1a', borderRadius: 8,
//         marginBottom: 12,
//       }}>
//       <List.Item
//         title={item.title}
//         description={item.description}
//         titleStyle={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}
//         descriptionStyle={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}
//         left={(props) => (
//           <View className="justify-center items-center mr-3">
//             <Avatar.Text
//               {...props}
//               size={40}
//               label={item.avatar}
//               style={{ backgroundColor: '#8A2BE2' }}
//               labelStyle={{ color: '#ffffff', fontSize: 16 }}
//             />
//           </View>
//         )}
//         right={(props) => (
//           <View className="justify-center items-center">
//             <Text className="text-gray-400 text-xs mb-1">{item.date}</Text>
//             {!item.isRead && (
//               <View className="w-2 h-2 bg-purple-600 rounded-full" />
//             )}
//           </View>
//         )}
//         className="py-4 px-4"
//       />
//     </Surface>
//   );

//   const EmptyState = () => (
//     <View className="flex-1 justify-center items-center py-16">
//       <View className="bg-gray-800 rounded-full p-6 mb-6">
//         <IconButton
//           icon="bell-outline"
//           size={48}
//           iconColor="#8A2BE2"
//         />
//       </View>
//       <Text className="text-white text-xl font-semibold mb-2">
//         No notifications yet
//       </Text>
//       <Text className="text-gray-400 text-center px-8 mb-6">
//         Your notifications will appear here once you've received them.
//       </Text>
//       <Text className="text-gray-400 text-sm mb-2">
//         Missing notifications?
//       </Text>
//       <TouchableOpacity>
//         <Text className="text-purple-400 text-sm underline">
//           Go to historical notifications
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const currentNotifications = activeTab === 'recent' ? notifications : previousNotifications;
//   const hasNotifications = currentNotifications.length > 0;

//   return (
//     <View className="flex-1"
//     // style={{ backgroundColor: '#000000', paddingTop: insets.top }}
//     >
//       <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
//         {/* <Appbar.BackAction iconColor="#ffffff" onPress={() => { }} /> */}
//         <Appbar.Action icon="cog-outline" iconColor="#ffffff" onPress={() => { }} />
//         <Appbar.Content
//           title="Notifications"
//           titleStyle={{ color: '#ffffff', fontSize: 20, fontWeight: '600', textAlign: 'center' }}
//           style={{ alignItems: 'center' }}
//         />
//         <Appbar.Action icon="cog-outline" iconColor="#ffffff" onPress={() => { }} />
//       </Appbar.Header>

//       <View className="mx-4 mb-4">
//         <Surface style={{ backgroundColor: '#1a1a1a', borderRadius: 8, padding: 16, }}>
//           <Text className="text-white text-center font-medium">
//             Customize your notifications!
//           </Text>
//         </Surface>
//       </View>

//       <View className="flex-row mx-4 mb-4">
//         <TouchableOpacity
//           className={`flex-1 py-3 px-4 rounded-lg mr-2 ${activeTab === 'recent' ? 'bg-purple-600' : 'bg-gray-800'
//             }`}
//           onPress={() => setActiveTab('recent')}
//         >
//           <Text className={`text-center font-medium ${activeTab === 'recent' ? 'text-white' : 'text-gray-400'
//             }`}>
//             Recent
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className={`flex-1 py-3 px-4 rounded-lg ml-2 ${activeTab === 'previously' ? 'bg-purple-600' : 'bg-gray-800'
//             }`}
//           onPress={() => setActiveTab('previously')}
//         >
//           <Text className={`text-center font-medium ${activeTab === 'previously' ? 'text-white' : 'text-gray-400'
//             }`}>
//             Previously
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View className="flex-1">
//         {hasNotifications ? (
//           <ScrollView
//             className="flex-1 px-4"
//             showsVerticalScrollIndicator={false}
//           >
//             {currentNotifications.map(renderNotificationItem)}

//             <View className="py-6 items-center">
//               <Text className="text-gray-400 text-sm mb-2">
//                 Missing notifications?
//               </Text>
//               <TouchableOpacity>
//                 <Text className="text-purple-400 text-sm underline">
//                   Go to historical notifications
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         ) : (
//           <EmptyState />
//         )}
//       </View>
//     </View>
//   );
// };

// export default NotificationScreen;