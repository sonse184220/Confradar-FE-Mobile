import { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';

import NavBar from "../test/BottomBar";
import HomeStack from "./HomeStack";
import CurrentStack from "./CurrentStack";

export type AppStackParamList = {
    HomeStack: undefined;
    CurrentStack: undefined;
    UpcomingStack: undefined;
    MoreStack: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;

const appStackKeys: (keyof AppStackParamList)[] = [
    "HomeStack",
    "CurrentStack",
    "UpcomingStack",
    "MoreStack",
];

const AppStack = () => {
    const [activeTab, setActiveTab] = useState<keyof AppStackParamList>("HomeStack");
    const translateX = useSharedValue(0);

    const handleTabChange = (newTab: keyof AppStackParamList) => {
        const currentIndex = appStackKeys.indexOf(activeTab);
        const newIndex = appStackKeys.indexOf(newTab);

        // Animate the slide transition
        translateX.value = withTiming(
            (newIndex - currentIndex) * SCREEN_WIDTH,
            { duration: 300 }
        );

        setActiveTab(newTab);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
            {/* Navigation Container with hidden tab bar */}
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    // tabBarStyle: { display: 'none' }
                }}
                tabBar={(props) => (
                    <NavBar
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                        navigation={props.navigation}
                        state={props.state}
                    />
                )}
            // screenListeners={{
            //     state: (e) => {
            //         // Listen to navigation state changes
            //         const state = e.data.state;
            //         if (state) {
            //             const routeName = state.routes[state.index].name as keyof AppStackParamList;
            //             if (routeName !== activeTab) {
            //                 handleTabChange(routeName);
            //             }
            //         }
            //     },
            // }}
            >
                <Tab.Screen name="HomeStack" component={HomeStack} />
                <Tab.Screen name="CurrentStack" component={CurrentStack} />
                <Tab.Screen name="UpcomingStack" component={() => <View style={{ flex: 1, backgroundColor: '#0F0F0F' }} />} />
                <Tab.Screen name="MoreStack" component={() => <View style={{ flex: 1, backgroundColor: '#0F0F0F' }} />} />
            </Tab.Navigator>

            {/* Custom Bottom Bar */}
            {/* <NavBar activeTab={activeTab} setActiveTab={handleTabChange} /> */}
        </View>
    );
};

export default AppStack;