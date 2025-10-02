import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import HomeScreen from './HomeScreen';
import CurrentEventsScreen from './CurrentEventsScreen';
import UpcomingEventsScreen from './UpcomingEventsScreen';
import MoreEventsScreen from './MoreEventsScreen';
import { AppStackParamList } from '../navigation/AppStack';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// type TabType = 'home' | 'current' | 'upcoming' | 'more';

// const SCREEN_WIDTH = Dimensions.get('window').width;

// const screens = {
//   home: <HomeScreen />,
//   current: <CurrentEventsScreen />,
//   upcoming: <UpcomingEventsScreen />,
//   more: <MoreEventsScreen />,
// };

type TabType = keyof AppStackParamList;

interface NavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const tabLabels: Record<TabType, string> = {
  HomeStack: 'Home',
  CurrentStack: 'Current',
  UpcomingStack: 'Upcoming',
  MoreStack: 'More',
};

const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab }) => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(Object.keys(tabLabels).indexOf(activeTab));
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  useEffect(() => {
    const index = Object.keys(tabLabels).indexOf(activeTab);
    progress.value = withTiming(index, { duration: 300 });
  }, [activeTab]);

  const TabButton = ({ tab }: { tab: TabType }) => {
    const isActive = tab === activeTab;
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(isActive ? 1.1 : 1) }],
    }));

    const handlePress = () => {
      setActiveTab(tab);
      navigation.navigate(tab);
    };

    return (
      <TouchableOpacity style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={handlePress}>
        <Animated.Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive, animatedStyle]}>
          {tabLabels[tab]}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bottomBarWrapper, { bottom: insets.bottom }]}>
      <View style={styles.bottomBar}>
        {Object.keys(tabLabels).map((tab) => (
          <TabButton key={tab} tab={tab as TabType} />
        ))}
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  bottomBarWrapper: { position: 'absolute', left: 0, right: 0 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  tabButtonActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabText: { fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#fff' },
  tabTextInactive: { color: 'rgba(255,255,255,0.7)' },
});

// const NavBar = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('home');
//   const insets = useSafeAreaInsets();
//   const progress = useSharedValue(0);
//   const tabKeys: TabType[] = ['home', 'current', 'upcoming', 'more'];

//   useEffect(() => {
//     const index = tabKeys.indexOf(activeTab);
//     progress.value = withTiming(index, { duration: 300 });
//   }, [activeTab]);

//   const TabButton = ({
//     tab,
//     label,
//     isActive
//   }: {
//     tab: TabType;
//     label: string;
//     isActive: boolean;
//   }) => (
//     <TouchableOpacity
//       onPress={() => setActiveTab(tab)}
//       style={[styles.tabButton, isActive ? styles.tabButtonActive : {}]}
//     >
//       <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Animated Screens */}
//       {tabKeys.map((key, index) => {
//         const animatedStyle = useAnimatedStyle(() => {
//           const translateX = (index - progress.value) * SCREEN_WIDTH;
//           return { transform: [{ translateX }] };
//         });
//         return (
//           <Animated.View
//             key={key}
//             style={[styles.screenContainer, animatedStyle]}
//           >
//             {screens[key]}
//           </Animated.View>
//         );
//       })}

//       {/* Bottom Tab Bar */}
//       <View style={[styles.bottomBarWrapper, { bottom: insets.bottom }]}>
//         <View style={styles.bottomBar}>
//           <TabButton tab="home" label="Home" isActive={activeTab === 'home'} />
//           <TabButton tab="current" label="Current" isActive={activeTab === 'current'} />
//           <TabButton tab="upcoming" label="Upcoming" isActive={activeTab === 'upcoming'} />
//           <TabButton tab="more" label="More" isActive={activeTab === 'more'} />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default NavBar;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0f0f0f' },
//   screenContainer: {
//     position: 'absolute',
//     width: SCREEN_WIDTH,
//     top: 0,
//     bottom: 0,
//   },
//   bottomBarWrapper: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 999,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//   },
//   tabButtonActive: {
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   tabTextActive: { color: '#fff' },
//   tabTextInactive: { color: 'rgba(255,255,255,0.7)' },
// });
