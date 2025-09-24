// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   interpolate,
// } from 'react-native-reanimated';

// import HomeScreen from './HomeScreen';
// import CurrentEventsScreen from './CurrentEventsScreen';
// import UpcomingEventsScreen from './UpcomingEventsScreen';
// import MoreEventsScreen from './MoreEventsScreen';

// type TabType = 'home' | 'current' | 'upcoming' | 'more';
// const SCREEN_WIDTH = Dimensions.get('window').width;

// const screens = {
//   home: <HomeScreen />,
//   current: <CurrentEventsScreen />,
//   upcoming: <UpcomingEventsScreen />,
//   more: <MoreEventsScreen />,
// };

// const NavBar = () => {
//   const [activeTab, setActiveTab] = useState<TabType>('home');
//   const insets = useSafeAreaInsets();
//   const progress = useSharedValue(0);

//   const tabKeys: TabType[] = ['home', 'current', 'upcoming', 'more'];

//   useEffect(() => {
//     const index = tabKeys.indexOf(activeTab);
//     progress.value = withTiming(index, { duration: 300 });
//   }, [activeTab]);

//   const animatedStyle = (index: number) =>
//     useAnimatedStyle(() => {
//       const translateX = interpolate(progress.value, [index, index], [0, 0]);
//       return {
//         transform: [{ translateX: (index - progress.value) * SCREEN_WIDTH }],
//       };
//     });

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


//   //Original version
//   // const renderScreen = () => {
//   //   switch (activeTab) {
//   //     case 'home':
//   //       return <HomeScreen />;
//   //     case 'current':
//   //       return <CurrentEventsScreen />;
//   //     case 'upcoming':
//   //       return <UpcomingEventsScreen />;
//   //     case 'more':
//   //       return <MoreEventsScreen />;
//   //     default:
//   //       return <HomeScreen />;
//   //   }
//   // };

//   // const handleTabPress = (tab: TabType) => {
//   //   if (tab === activeTab) return;

//   //   progress.value = 0; // fade out
//   //   setTimeout(() => {
//   //     setActiveTab(tab);
//   //     progress.value = withTiming(1, { duration: 300 }); // fade in
//   //   }, 150);
//   // };

//   // const animatedStyle = useAnimatedStyle(() => ({
//   //   opacity: progress.value,
//   //   transform: [{ translateY: (1 - progress.value) * 20 }],
//   // }));

//   //Fade version
//   // const TabButton = ({
//   //   label,
//   //   isActive,
//   //   onPress,
//   // }: {
//   //   label: string;
//   //   isActive: boolean;
//   //   onPress: () => void;
//   // }) => (
//   //   <TouchableOpacity
//   //     style={[styles.tabButton, isActive && styles.tabButtonActive]}
//   //     onPress={onPress}
//   //   >
//   //     <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
//   //       {label}
//   //     </Text>
//   //   </TouchableOpacity>
//   // );

//   // const TabButton = ({
//   //   tab,
//   //   label,
//   //   isActive
//   // }: {
//   //   tab: TabType;
//   //   label: string;
//   //   isActive: boolean;
//   // }) => (
//   //   <TouchableOpacity
//   //     onPress={() => setActiveTab(tab)}
//   //     className={`flex-1 py-3 px-4 items-center justify-center rounded-full mx-1 ${isActive
//   //       ? 'bg-white/30 shadow-lg'
//   //       : 'bg-white/10'
//   //       }`}
//   //   >
//   //     <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/70'
//   //       }`}>
//   //       {label}
//   //     </Text>
//   //   </TouchableOpacity>
//   // );

//   return (
//     <View style={styles.container}>
//       {/* Animated Screens */}
//       {tabKeys.map((key, index) => (
//         <Animated.View
//           key={key}
//           style={[styles.screenContainer, {
//             transform: [{ translateX: (index - tabKeys.indexOf(activeTab)) * SCREEN_WIDTH }]
//           }]}
//         >
//           {screens[key]}
//         </Animated.View>
//       ))}

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

// //   return (
// //     // <SafeAreaView className="flex-1">
// //     <>
// //       {/* Main Content */}
// //       <View className="flex-1">
// //         {renderScreen()}
// //       </View>

// //       {/* Bottom Tab Bar */}
// //       <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent"
// //         style={{ bottom: insets.bottom }}>
// //         <View className="flex-row items-center justify-between px-4 py-4 bg-black/20 backdrop-blur-xl rounded-t-3xl">
// //           <TabButton
// //             tab="home"
// //             label="Home"
// //             isActive={activeTab === 'home'}
// //           />
// //           <TabButton
// //             tab="current"
// //             label="Current"
// //             isActive={activeTab === 'current'}
// //           />
// //           <TabButton
// //             tab="upcoming"
// //             label="Upcoming"
// //             isActive={activeTab === 'upcoming'}
// //           />
// //           <TabButton
// //             tab="more"
// //             label="More"
// //             isActive={activeTab === 'more'}
// //           />
// //         </View>
// //       </View>
// //     </>
// //     // </SafeAreaView>
// //   );
// // };

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

type TabType = 'home' | 'current' | 'upcoming' | 'more';
const SCREEN_WIDTH = Dimensions.get('window').width;

const screens = {
  home: <HomeScreen />,
  current: <CurrentEventsScreen />,
  upcoming: <UpcomingEventsScreen />,
  more: <MoreEventsScreen />,
};

const NavBar = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const tabKeys: TabType[] = ['home', 'current', 'upcoming', 'more'];

  useEffect(() => {
    const index = tabKeys.indexOf(activeTab);
    progress.value = withTiming(index, { duration: 300 });
  }, [activeTab]);

  const TabButton = ({
    tab,
    label,
    isActive
  }: {
    tab: TabType;
    label: string;
    isActive: boolean;
  }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={[styles.tabButton, isActive ? styles.tabButtonActive : {}]}
    >
      <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Animated Screens */}
      {tabKeys.map((key, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const translateX = (index - progress.value) * SCREEN_WIDTH;
          return { transform: [{ translateX }] };
        });
        return (
          <Animated.View
            key={key}
            style={[styles.screenContainer, animatedStyle]}
          >
            {screens[key]}
          </Animated.View>
        );
      })}

      {/* Bottom Tab Bar */}
      <View style={[styles.bottomBarWrapper, { bottom: insets.bottom }]}>
        <View style={styles.bottomBar}>
          <TabButton tab="home" label="Home" isActive={activeTab === 'home'} />
          <TabButton tab="current" label="Current" isActive={activeTab === 'current'} />
          <TabButton tab="upcoming" label="Upcoming" isActive={activeTab === 'upcoming'} />
          <TabButton tab="more" label="More" isActive={activeTab === 'more'} />
        </View>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  screenContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    top: 0,
    bottom: 0,
  },
  bottomBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
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
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: { color: '#fff' },
  tabTextInactive: { color: 'rgba(255,255,255,0.7)' },
});
