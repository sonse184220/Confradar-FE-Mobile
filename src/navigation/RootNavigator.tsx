import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import { navigationRef } from "../utils/navigationUtil";
import AppStack from "./AppStack";
import EditProfileScreen from "../test/EditProfileScreen";
import ChangePasswordScreen from "../test/ChangePasswordScreen";
import ConferenceDetailScreen from "../test/ConferenceDetailScreen";

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
    BookingFlow: { confId: number };
    HistoryDetail: { historyId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const isAuthenticated = true;

    return (
        <NavigationContainer ref={navigationRef} theme={navTheme}>
            {/* {isAuthenticated ? <AppStack /> : <AuthStack />} */}
            {/* <AuthStack /> */}
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        {/* <Stack.Screen name="Auth" component={AuthStack} /> */}
                        <Stack.Screen name="Auth" component={ConferenceDetailScreen} />
                        <Stack.Screen name="App" component={AppStack} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

{/* <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
                        <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} /> */}
export default RootNavigator;