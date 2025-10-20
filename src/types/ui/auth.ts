import { StyleProp, ViewStyle } from 'react-native';

export interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;

    style?: StyleProp<ViewStyle>;
    theme?: any;
    // theme?: Partial<MD3Theme>;
    // theme?: {
    //     colors?: Record<string, any>; 
    //     [key: string]: any;
    // };
    textColor?: string;
    contentStyle?: StyleProp<ViewStyle>;

    multiline?: boolean;
    numberOfLines?: number;
}

export interface SocialButtonProps {
    title: string;
    iconName: string;
    iconColor: string;
    onPress: () => void;
    style?: object;
}

export interface PasswordRequirementsProps {
    password: string;
    confirmPassword?: string;
    showConfirmMatch?: boolean;
}
