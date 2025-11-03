import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/draft-screen/HomeScreen";
import CurrentEventsScreen from "../screens/draft-screen/CurrentEventsScreen";
import UpcomingEventsScreen from "../screens/draft-screen/UpcomingEventsScreen";
import MoreEventsScreen from "../screens/draft-screen/MoreEventsScreen";
import DiscoveryScreen from "../screens/DiscoveryScreen";
import ConferenceDetailScreen from "../screens/ConferenceDetailScreen";
import TicketSelectionScreen from "../screens/TicketSelectionScreen";
import ConferenceListScreen from "../screens/ConferenceListScreen";

export type HomeStackParamList = {
    Home: undefined;
    ConferenceList: undefined;
    ConferenceDetails: { conferenceId: string, type: string };
    TicketSelection: { conferenceId: string };
    CurrentEvents: undefined;
    UpcomingEvents: undefined;
    MoreEvents: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Home" component={DiscoveryScreen} /> */}
        <Stack.Screen name="ConferenceList" component={ConferenceListScreen} />
        <Stack.Screen name="ConferenceDetails" component={ConferenceDetailScreen} />
        <Stack.Screen name="TicketSelection" component={TicketSelectionScreen} />
        <Stack.Screen name="CurrentEvents" component={CurrentEventsScreen} />
        <Stack.Screen name="UpcomingEvents" component={UpcomingEventsScreen} />
        <Stack.Screen name="MoreEvents" component={MoreEventsScreen} />
    </Stack.Navigator>
);

export default HomeStack;