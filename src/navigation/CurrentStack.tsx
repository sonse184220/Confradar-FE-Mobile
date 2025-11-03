import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/draft-screen/HomeScreen";
import CurrentEventsScreen from "../screens/draft-screen/CurrentEventsScreen";
import UpcomingEventsScreen from "../screens/draft-screen/UpcomingEventsScreen";
import MoreEventsScreen from "../screens/draft-screen/MoreEventsScreen";

export type CurrentStackParamList = {
    Home: undefined;
    CurrentEvents: undefined;
    UpcomingEvents: undefined;
    MoreEvents: undefined;
};

const Stack = createNativeStackNavigator<CurrentStackParamList>();

const CurrentStack = () => (
    <Stack.Navigator initialRouteName="CurrentEvents" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CurrentEvents" component={CurrentEventsScreen} />
        <Stack.Screen name="UpcomingEvents" component={UpcomingEventsScreen} />
        <Stack.Screen name="MoreEvents" component={MoreEventsScreen} />
    </Stack.Navigator>
);

export default CurrentStack;