import {
    createNavigationContainerRef,
    StackActions,
    CommonActions,
} from '@react-navigation/native';
import { AuthStackParamList } from '../navigation/AuthStack';

// Ref
export const navigationRef = createNavigationContainerRef<AuthStackParamList>();

// navigateTo
// export function navigate<RouteName extends keyof RootStackParamList>(
//   name: RouteName,
//   params?: RootStackParamList[RouteName]
// ) {
//   if (navigationRef.isReady()) {
//     navigationRef.navigate( name as never,
//       params as never);
//   }
// }
export function navigate<RouteName extends keyof AuthStackParamList>(
    name: RouteName,
    params?: AuthStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as any, params as any);
    }
}

// goBack
export function goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
        navigationRef.goBack();
    }
}

// push thêm vào stack
export function push<RouteName extends keyof AuthStackParamList>(
    name: RouteName,
    params?: AuthStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(name, params));
    }
}

// replace screen
export function replace<RouteName extends keyof AuthStackParamList>(
    name: RouteName,
    params?: AuthStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(name, params));
    }
}

// reset stack
export function reset<RouteName extends keyof AuthStackParamList>(
    name: RouteName,
    params?: AuthStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name, params }],
            })
        );
    }
}

// pop
export function pop(count: number = 1) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.pop(count));
    }
}

// back to top
export function popToTop() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop());
    }
}
