// declare module 'react-native-vector-icons/MaterialCommunityIcons' {
//   import { Icon } from 'react-native-vector-icons/Icon';
//   import { IconProps } from 'react-native-vector-icons/Icon';
//   export default class MaterialCommunityIcons extends Icon<IconProps> {}
// }

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
    import * as React from 'react';
    import { TextStyle, ViewStyle } from 'react-native';

    export interface IconProps {
        name: string;
        size?: number;
        color?: string;
        style?: TextStyle | ViewStyle;
    }

    export default class MaterialCommunityIcons extends React.Component<IconProps> { }
}

declare module 'react-native-vector-icons/MaterialIcons' {
    import * as React from 'react';
    import { TextStyle, ViewStyle } from 'react-native';

    export interface IconProps {
        name: string;
        size?: number;
        color?: string;
        style?: TextStyle | ViewStyle;
    }

    export default class MaterialIcons extends React.Component<IconProps> { }
}