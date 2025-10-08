import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { FormInputProps } from "../../types/ui/auth";

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,

  style,
  theme,
  textColor,
  contentStyle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry && !showPassword
      }
      mode="outlined"
      // right={
      //   secureTextEntry ? (
      //     <TextInput.Icon
      //       icon={showPassword ? 'eye' : 'eye-off'}
      //       onPress={() => setShowPassword(!showPassword)
      //       }
      //       color="#7C3AED"
      //     />
      //   ) : undefined
      // }
      // style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
      style={style}
      theme={theme}
      textColor={textColor}
      contentStyle={contentStyle}
    />
  );
};

export default FormInput;