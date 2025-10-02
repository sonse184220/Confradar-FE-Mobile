import { useState } from "react";
import { View } from "react-native";

import NavBar from "../test/NavBar";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from "./HomeStack";
import { BottomNavigation } from "react-native-paper";
import CurrentStack from "./CurrentStack";

export type AppStackParamList = {
    HomeStack: undefined;
    CurrentStack: undefined;
    UpcomingStack: undefined;
    MoreStack: undefined;
};

const Tab = createBottomTabNavigator<AppStackParamList>();

const appStackKeys: (keyof AppStackParamList)[] = [
    "HomeStack",
    "CurrentStack",
    "UpcomingStack",
    "MoreStack",
];

const AppStack = () => {
    const [activeTab, setActiveTab] = useState<keyof AppStackParamList>("HomeStack");

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={{ headerShown: false }}
                tabBar={(props) => (
                    <BottomNavigation.Bar
                        {...props}
                        navigationState={{
                            index: appStackKeys.indexOf(activeTab),
                            routes: props.state.routes,
                        }}
                        onTabPress={({ route }) => {
                            setActiveTab(route.name as keyof AppStackParamList);
                        }}
                    />
                )}
            >
                <Tab.Screen name="HomeStack" component={HomeStack} />
                <Tab.Screen name="CurrentStack" component={CurrentStack} />
                {/* <Tab.Screen name="UpcomingStack" component={UpcomingStack} /> */}
                {/* <Tab.Screen name="MoreStack" component={MoreStack} /> */}
            </Tab.Navigator>

            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </View>
    );
};

export default AppStack;