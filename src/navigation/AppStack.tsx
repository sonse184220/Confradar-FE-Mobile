import { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigationState } from '@react-navigation/native';

import NavBar from "../components/BottomBar";
import HomeStack from "./HomeStack";
import CurrentStack, { CurrentStackParamList } from "./CurrentStack";
import NotificationScreen from "../screens/NotificationScreen";
import AccountSettingScreen from "../screens/AccountSettingScreen";
import TicketConferenceScreen from "@/screens/TicketConferenceScreen";
import ConferenceCalendarScreen from "@/screens/ConferenceCalendarScreen";

export type AppStackParamList = {
    HomeStack: undefined;
    // CurrentStack: undefined;
    TicketStack: { screen?: keyof CurrentStackParamList; params?: any };
    ScheduleStack: undefined;
    NotificationStack: undefined;
    AccountStack: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();
const SCREEN_WIDTH = Dimensions.get('window').width;

const appStackKeys: (keyof AppStackParamList)[] = [
    "HomeStack",
    "TicketStack",
    "ScheduleStack",
    "NotificationStack",
    "AccountStack",
];

const ScheduleStack = () => (
    <ConferenceCalendarScreen />
);

const NotificationStack = () => (
    <NotificationScreen />
);

const AccountStack = () => (
    // <View style={{ flex: 1, backgroundColor: '#0F0F0F' }} />
    <AccountSettingScreen />
);

const AppStack = () => {
    const [activeTab, setActiveTab] = useState<keyof AppStackParamList>("HomeStack");
    const translateX = useSharedValue(0);

    const handleTabChange = (newTab: keyof AppStackParamList) => {
        const currentIndex = appStackKeys.indexOf(activeTab);
        const newIndex = appStackKeys.indexOf(newTab);

        // translateX.value = withTiming(
        //     (newIndex - currentIndex) * SCREEN_WIDTH,
        //     { duration: 300 }
        // );
        translateX.value = withTiming(-newIndex * SCREEN_WIDTH, { duration: 300 });

        setActiveTab(newTab);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={{ flex: 1, }}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    // tabBarStyle: { display: 'none' }
                    animation: 'shift',
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
                <Tab.Screen name="TicketStack" component={TicketConferenceScreen} />
                <Tab.Screen name="ScheduleStack" component={ScheduleStack} />
                <Tab.Screen name="NotificationStack" component={NotificationStack} />
                <Tab.Screen name="AccountStack" component={AccountStack} />
            </Tab.Navigator>

            {/* <NavBar activeTab={activeTab} setActiveTab={handleTabChange} /> */}
        </View>
    );
};

export default AppStack;