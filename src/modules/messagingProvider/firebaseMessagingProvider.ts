import { Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';

export async function requestUserPermission() {
    const messaging = getMessaging(getApp());
    const authStatus = await requestPermission(messaging);
    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;
    return enabled;
}

export async function getFcmToken(): Promise<{ webToken: string | null; mobileToken: string | null }> {
    await requestUserPermission();

    let mobileToken: string | null = null;
    let webToken: string | null = null;

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        const messaging = getMessaging(getApp());
        mobileToken = await getToken(messaging);
    }

    return { webToken, mobileToken };
}
