import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { navigationRef } from "../utils/navigationUtil";
import AppStack from "./AppStack";

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
    },
};


const RootNavigator = () => {
    const isAuthenticated = true;

    return (
        <NavigationContainer ref={navigationRef} theme={navTheme}>
            {/* {isAuthenticated ? <AppStack /> : <AuthStack />} */}
            <AppStack />
        </NavigationContainer>
    );
};

export default RootNavigator;