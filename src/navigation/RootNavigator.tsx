import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { navigationRef } from "../utils/navigationUtil";
import AppStack from "./AppStack";

const RootNavigator = () => {
    const isAuthenticated = true;

    return (
        <NavigationContainer ref={navigationRef}>
            {/* {isAuthenticated ? <AppStack /> : <AuthStack />} */}
            <AppStack />
        </NavigationContainer>
    );
};

export default RootNavigator;