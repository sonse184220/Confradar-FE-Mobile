export interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
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
