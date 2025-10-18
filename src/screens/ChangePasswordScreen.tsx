import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Appbar, Button, TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PasswordRequirements from '../components/auth/PasswordRequirements';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirm = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      console.log('Password changed successfully');
    } else {
      console.log('Passwords do not match or requirements not met');
    }
  };

  const isPasswordValid = () => {
    const requirements = [
      newPassword.length >= 8,
      /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
      /\d/.test(newPassword),
      /[!@#$%^&*(),.?\":{}|<>]/.test(newPassword),
    ];
    return requirements.every(req => req) && newPassword === confirmPassword && newPassword.length > 0;
  };

  return (
    <View className="flex-1"
    // style={{ backgroundColor: '#000000' }}
    >
      <Svg
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        viewBox="0 0 375 812"
      >
        <Defs>
          <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#000000" />
            <Stop offset="10%" stopColor="#0B0B10" />
            <Stop offset="25%" stopColor="#1E1E2F" />
            <Stop offset="40%" stopColor="#125773" />
            <Stop offset="55%" stopColor="#146C94" />
            <Stop offset="70%" stopColor="#0F4565" />
            <Stop offset="85%" stopColor="#081F2A" />
            <Stop offset="100%" stopColor="#000000" />
            {/* <Stop offset="0%" stopColor="#000000" />
                <Stop offset="25%" stopColor="#1E1E2F" />
                <Stop offset="50%" stopColor="#146C94" />
                <Stop offset="100%" stopColor="#000000" /> */}
          </LinearGradient>
        </Defs>

        <Rect x="0" y="0" width="375" height="812" fill="url(#bgGradient)" />
      </Svg>

      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0, }}>
        <Appbar.BackAction onPress={() => console.log('Go back')} />
        <Appbar.Content title="Set Password" titleStyle={{ color: '#F6F1F1', fontWeight: 'bold', textAlign: 'center' }} />
        <Appbar.Action icon="" onPress={() => { }} />
      </Appbar.Header>

      <View className="items-center mb-8">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-4"
          style={{
            borderWidth: 2,
            borderColor: '#19A7CE',
            backgroundColor: 'rgba(20,108,148,0.3)',
          }}
        >
          <Icon name="shield-key-outline" size={48} color="#F6F1F1" />
        </View>
        <Text className="text-white text-2xl font-extrabold text-center mb-1">
          Secure Your Account
        </Text>
        <Text className="text-white text-base text-center">
          Update your Confradar password for better protection
        </Text>
      </View>

      <View className="flex-1 px-5">
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
        >
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">New password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={true}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F6F1F1',
                backgroundColor: 'rgba(246, 241, 241, 0.1)',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              theme={{
                colors: {
                  primary: '#F6F1F1',
                  outline: '#F6F1F1',
                  onSurfaceVariant: '#F6F1F1',
                }
              }}
              textColor="#F6F1F1"
              underlineStyle={{ display: 'none' }}
            />
          </View>

          <View className="mb-6">
            <Text className="text-white text-sm mb-2 font-medium">Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Enter confirm password"
              secureTextEntry={true}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#F6F1F1',
                backgroundColor: 'rgba(246, 241, 241, 0.1)',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              theme={{
                colors: {
                  primary: '#F6F1F1',
                  outline: '#F6F1F1',
                  onSurfaceVariant: '#F6F1F1',
                }
              }}
              textColor="#F6F1F1"
              underlineStyle={{ display: 'none' }}
            />
          </View>

          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <View className="mb-6">
              <PasswordRequirements
                password={newPassword}
                confirmPassword={confirmPassword}
              />
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!isPasswordValid()}
            style={{
              borderRadius: 16,
              marginTop: 20,
              backgroundColor: isPasswordValid() ? '#19A7CE' : '#cccccc'
            }}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Confirm
          </Button>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;