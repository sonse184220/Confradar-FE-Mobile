import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  List,
  Surface,
  Switch,
  TextInput
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { CommonActions } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
}

const AccountSettingScreen = () => {
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuth();

  const userInfo = {
    name: 'Jin Yong Lim',
    email: 'jin.yong@example.com',
    avatar: 'JY'
  };

  const accountSettings: SettingItem[] = [
    {
      id: '1',
      title: 'Chỉnh sửa hồ sơ',
      description: 'Chỉnh sửa hồ sơ của bạn',
      icon: 'account-edit',
      hasArrow: true,
      onPress: () => navigation.navigate('EditProfile')
    },
    {
      id: '2',
      title: 'Đổi mật khẩu',
      description: 'Quản lý bảo mật tài khoản của bạn',
      icon: 'lock',
      hasArrow: true,
      onPress: () => navigation.navigate('ChangePassword')
    },
    // {
    //   id: '3',
    //   title: 'Transaction History',
    //   description: 'Manage your payment transaction',
    //   icon: 'money',
    //   hasArrow: true,
    //   onPress: () => navigation.navigate('TransactionHistory')
    // },
    {
      id: '4',
      title: 'Hội nghị yêu thích',
      description: 'Xem những hội nghị yêu thích của bạn',
      icon: 'history',
      hasArrow: true,
      onPress: () => navigation.navigate('FavoriteConferences')
    },

    {
      id: '5',
      title: 'Vé tham dự của tôi',
      description: 'Xem những vé thanh toán thành công của bạn',
      icon: 'history',
      hasArrow: true,
      onPress: () => navigation.navigate('TicketConference')
    },

    {
      id: '6',
      title: 'Bài báo của tôi',
      description: 'Xem những bài báo đã nộp',
      icon: 'history',
      hasArrow: true,
      onPress: () => navigation.navigate('PaperList')
    },

    {
      id: '7',
      title: 'Lịch hội nghị của tôi',
      description: 'Xem những hội nghị đã đăng ký thành công trên lịch',
      icon: 'history',
      hasArrow: true,
      onPress: () => navigation.navigate('ConferenceCalendar')
    },

    {
      id: '8',
      title: 'Ví của tôi',
      description: 'Xem ví của bạn trên hệ thống',
      icon: 'money',
      hasArrow: true,
      onPress: () => navigation.navigate('Wallet')
    },

    {
      id: '8',
      title: 'Báo cáo vấn đề',
      description: 'Báo cáo vấn đề của bạn',
      icon: 'history',
      hasArrow: true,
      onPress: () => navigation.navigate('ReportList')
    }
  ];

  const appSettings: SettingItem[] = [
    {
      id: '4',
      title: 'Push Notifications',
      description: 'Get notified about events and updates',
      icon: 'bell',
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled
    },
    {
      id: '5',
      title: 'Dark Mode',
      description: 'Use dark theme throughout the app',
      icon: 'theme-light-dark',
      hasSwitch: true,
      switchValue: darkModeEnabled,
      onSwitchChange: setDarkModeEnabled
    },
    {
      id: '6',
      title: 'Location Services',
      description: 'Find nearby events automatically',
      icon: 'map-marker',
      hasSwitch: true,
      switchValue: locationEnabled,
      onSwitchChange: setLocationEnabled
    }
  ];

  const supportSettings: SettingItem[] = [
    {
      id: '7',
      title: 'Help Center',
      description: 'Get help and support',
      icon: 'help-circle',
      hasArrow: true,
      onPress: () => console.log('Help Center')
    },
    {
      id: '8',
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      icon: 'shield-account',
      hasArrow: true,
      onPress: () => console.log('Privacy Policy')
    },
    {
      id: '9',
      title: 'Terms of Service',
      description: 'View terms and conditions',
      icon: 'file-document',
      hasArrow: true,
      onPress: () => console.log('Terms of Service')
    },
    {
      id: '10',
      title: 'Give Feedback',
      description: 'Help us improve the app',
      icon: 'message-text',
      hasArrow: true,
      onPress: () => console.log('Give Feedback')
    }
  ];

  const renderSettingItem = (item: SettingItem) => (
    <Surface key={item.id} className="mb-1" style={{ backgroundColor: '#1a1a1a', marginBottom: 4 }}>
      <List.Item
        title={item.title}
        description={item.description}
        titleStyle={{ color: '#ffffff', fontSize: 16, fontWeight: '500' }}
        descriptionStyle={{ color: '#9ca3af', fontSize: 14, marginTop: 2 }}
        left={(props) => (
          <View className="justify-center items-center mr-3">
            <IconButton
              {...props}
              icon={item.icon}
              size={24}
              iconColor="#8A2BE2"
            />
          </View>
        )}
        right={(props) => (
          <View className="justify-center items-center">
            {item.hasSwitch && (
              <Switch
                value={item.switchValue}
                onValueChange={item.onSwitchChange}
                thumbColor={item.switchValue ? '#8A2BE2' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#8A2BE2' }}
              />
            )}
            {item.hasArrow && (
              <IconButton
                {...props}
                icon="chevron-right"
                size={20}
                iconColor="#9ca3af"
              />
            )}
          </View>
        )}
        onPress={item.onPress}
        className="py-2 px-4"
      />
    </Surface>
  );

  const SettingSection = ({ title, items }: { title: string; items: SettingItem[] }) => (
    <View className="mb-6">
      <Text className="text-white text-lg font-semibold mb-4 px-4">
        {title}
      </Text>
      <View className="mx-4">
        <Surface className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderRadius: 10, overflow: 'hidden' }}>
          {items.map((item, index) => (
            <View key={item.id}>
              {renderSettingItem(item)}
              {index < items.length - 1 && (
                <Divider style={{ backgroundColor: '#333333', marginLeft: 60 }} />
              )}
            </View>
          ))}
        </Surface>
      </View>
    </View>
  );

  return (
    <View className="flex-1" >
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        {/* <Appbar.BackAction iconColor="#ffffff" onPress={() => { }} /> */}
        <Appbar.Content
          title="Tài khoản của tôi"
          titleStyle={{ color: '#ffffff', fontSize: 20, fontWeight: '600', textAlign: 'center' }}
          style={{ alignItems: 'center' }}
        />
      </Appbar.Header>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        {/* <View className="px-4 py-6">
          <Surface className="rounded-lg p-6" style={{ backgroundColor: '#1a1a1a', borderRadius: 8, padding: 24 }}>
            <View className="flex-row items-center">
              <Avatar.Text
                size={60}
                label={userInfo.avatar}
                style={{ backgroundColor: '#8A2BE2' }}
                labelStyle={{ color: '#ffffff', fontSize: 20, fontWeight: '600' }}
              />
              <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-semibold">
                  {userInfo.name}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                  {userInfo.email}
                </Text>
                <TouchableOpacity className="mt-2" onPress={() => { navigation.navigate('EditProfile'); }}>
                  <Text className="text-purple-400 text-sm">
                    Edit profile →
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Surface>
        </View> */}

        {/* Account Settings */}
        <SettingSection title="Các mục quản lý" items={accountSettings} />

        {/* App Settings */}
        {/* <SettingSection title="Preferences" items={appSettings} /> */}

        {/* Support Settings */}
        {/* <SettingSection title="Support" items={supportSettings} /> */}

        {/* Logout Section */}
        <View className="px-4 mb-6">
          <Surface className="rounded-lg overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden' }}>
            <List.Item
              title="Log out"
              titleStyle={{ color: '#ef4444', fontSize: 16, fontWeight: '500' }}
              left={(props) => (
                <View className="justify-center items-center mr-3">
                  <IconButton
                    {...props}
                    icon="logout"
                    size={24}
                    iconColor="#ef4444"
                  />
                </View>
              )}
              onPress={async () => {
                await logout();
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                  })
                );
              }}
              className="py-2 px-4"
            />
          </Surface>
        </View>

        {/* App Version */}
        <View className="px-4 pb-8 items-center">
          <Text className="text-gray-500 text-sm mb-1">
            Version 1.0.2 (72)
          </Text>
          <TouchableOpacity>
            <Text className="text-gray-500 text-sm underline">
              Terms of Service
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountSettingScreen;