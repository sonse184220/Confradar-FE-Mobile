import React from 'react';
import { Button } from 'react-native-paper';
import { SocialButtonProps } from "../../types/ui/auth"

export const SocialButton: React.FC<SocialButtonProps> = ({ title, iconName, iconColor, onPress, style }) => (
    <Button
        // icon={iconName ? { icon: iconName, color: iconColor } : undefined}
        icon={iconName}
        mode="outlined"
        textColor={iconColor}
        style={{ flex: 1, marginHorizontal: 4, ...style }}
        contentStyle={{ flexDirection: 'row-reverse', justifyContent: 'center', paddingVertical: 8 }}
        onPress={onPress}
    >
        {title}
    </Button>
);