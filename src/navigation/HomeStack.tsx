import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../test/HomeScreen";
import CurrentEventsScreen from "../test/CurrentEventsScreen";
import UpcomingEventsScreen from "../test/UpcomingEventsScreen";
import MoreEventsScreen from "../test/MoreEventsScreen";
import DiscoveryScreen from "../screens/DiscoveryScreen";

export type HomeStackParamList = {
    Home: undefined;
    CurrentEvents: undefined;
    UpcomingEvents: undefined;
    MoreEvents: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={DiscoveryScreen} />
        <Stack.Screen name="CurrentEvents" component={CurrentEventsScreen} />
        <Stack.Screen name="UpcomingEvents" component={UpcomingEventsScreen} />
        <Stack.Screen name="MoreEvents" component={MoreEventsScreen} />
    </Stack.Navigator>
);

export default HomeStack;