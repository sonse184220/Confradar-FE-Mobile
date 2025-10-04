import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { IconButton } from 'react-native-paper';
import { AppStackParamList } from '../navigation/AppStack';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type TabType = keyof AppStackParamList;

interface NavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  navigation: any;
  state: any;
}

const tabData = [
  { key: 'HomeStack' as TabType, label: 'Home', icon: 'home-outline' },
  { key: 'CurrentStack' as TabType, label: 'Current', icon: 'calendar-today' },
  { key: 'UpcomingStack' as TabType, label: 'Upcoming', icon: 'calendar-clock' },
  { key: 'MoreStack' as TabType, label: 'More', icon: 'dots-horizontal' },
];

const BottomBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab, navigation, state }) => {
  const insets = useSafeAreaInsets();
  // const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    navigation.navigate(tab);
  };

  const handleCameraPress = () => {
    console.log('Camera pressed');
  };

  const TabButton = ({ tab, label, icon }: { tab: TabType; label: string; icon: string }) => {
    const isActive = tab === activeTab;

    const animatedStyle = useAnimatedStyle(() => {
      const scale = withTiming(isActive ? 1.1 : 1, { duration: 200 });
      const opacity = withTiming(isActive ? 1 : 0.6, { duration: 200 });
      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <TouchableOpacity
        className="flex-1 items-center justify-center py-2"
        onPress={() => handleTabPress(tab)}
      >
        <Animated.View style={animatedStyle} className="items-center">
          <IconButton
            icon={icon}
            size={20}
            iconColor={isActive ? '#8A2BE2' : '#9CA3AF'}
          />
          <Text
            className={`text-xs font-medium mt-1 ${isActive ? 'text-purple-600' : 'text-gray-400'
              }`}
          >
            {label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    // <View
    //   className="absolute left-0 right-0"
    //   style={{
    //     bottom: 0,
    //   }}
    // >
    <View className="bg-gray-900 flex-row items-end justify-between px-4 py-0" style={styles.bottomBar}>
      <View className="flex-row flex-1">
        {tabData.slice(0, 2).map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab.key}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </View>

      <View className="items-center justify-center w-20">
        {/* <View style={styles.cameraContainer}> */}
        <TouchableOpacity
          onPress={handleCameraPress}
          className="bg-purple-600 rounded-full items-center justify-center"
          style={styles.cameraButton}
        >
          <IconButton
            icon="camera"
            size={24}
            iconColor="#FFFFFF"
          />
        </TouchableOpacity>
        {/* </View> */}
      </View>

      <View className="flex-row flex-1">
        {tabData.slice(2, 4).map((tab) => (
          <TabButton
            key={tab.key}
            tab={tab.key}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </View>
    </View>
    // </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  bottomBar: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    // overflow: 'visible',
  },
  cameraButton: {
    // width: 72,
    // height: 72,
    aspectRatio: 1,
    minWidth: 48,
    maxWidth: 80,
    width: '100%',
    transform: [{ translateY: -20 }],
    shadowColor: '#8A2BE2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});