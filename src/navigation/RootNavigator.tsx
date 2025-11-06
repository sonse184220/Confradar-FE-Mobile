import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import { navigationRef } from "../utils/navigationUtil";
import AppStack from "./AppStack";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import ConferenceDetailScreen from "../screens/ConferenceDetailScreen";
import TransactionHistoryScreen from "../screens/TransactionHistoryScreen";
import FavoriteConferencesScreen from "@/screens/FavoriteConferencesScreen";
import TicketConferenceScreen from "@/screens/TicketConferenceScreen";
import PaperListScreen from "@/screens/PaperListScreen";
import PaperDetailScreen from "@/screens/PaperDetailScreen";

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
    TransactionHistory: undefined;
    FavoriteConferences: undefined;
    TicketConference: undefined;
    PaperList: undefined;
    PaperDetail: { paperId: string };
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
                        <Stack.Screen name="Auth" component={AuthStack} />
                        {/* <Stack.Screen name="Auth" component={ConferenceDetailScreen} /> */}
                        <Stack.Screen name="App" component={AppStack} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
                        <Stack.Screen name="FavoriteConferences" component={FavoriteConferencesScreen} />
                        <Stack.Screen name="TicketConference" component={TicketConferenceScreen} />
                        <Stack.Screen name="PaperList" component={PaperListScreen} />
                        <Stack.Screen name="PaperDetail" component={PaperDetailScreen} />
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