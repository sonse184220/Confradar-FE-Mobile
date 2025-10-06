import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FormInput from '../components/auth/FormInput';
import { SocialButton } from '../components/auth/SocialButton';

const { height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleRegister = () => { };
  const handleSignIn = () => { };
  const handleGoogleRegister = () => { };
  const handleFacebookRegister = () => { };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#000000', '#2e2e2e', '#6b6b6b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Logo and Welcome text */}
      <View className="pt-10 pb-5 px-5 items-center">
        <View
          className="w-[70px] h-[70px] rounded-full items-center justify-center mb-3 bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-[32px]">👤</Text>
        </View>
        <Text className="text-white text-center text-2xl font-bold mb-1.5">
          Tạo tài khoản
        </Text>
        <Text className="text-violet-200 text-center text-sm">
          Đăng ký để bắt đầu với tài khoản của bạn
        </Text>
      </View>

      {/* Register Form*/}
      <View className="flex-1 p-5 w-[90%] self-center">
        <Card
          style={{
            flex: 1,
            borderRadius: 24,
            padding: 0,
            margin: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 6,
            overflow: 'hidden',
          }}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={20}
          >
            <Text className="text-gray-800 text-2xl font-bold text-center mb-6">Đăng Ký</Text>

            <FormInput
              label="Tên đầy đủ"
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên đầy đủ của bạn"
            />

            <FormInput
              label="Số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại của bạn"
            />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
            />

            <FormInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu của bạn"
              secureTextEntry
            />

            <FormInput
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu của bạn"
              secureTextEntry
            />

            <FormInput
              label="Ngày sinh"
              value={birthday}
              onChangeText={setBirthday}
              placeholder="DD/MM/YYYY"
            />

            {/* Terms and Conditions */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${agreeToTerms ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && <Text className="text-white text-xs">✓</Text>}
              </TouchableOpacity>
              <Text className="flex-1 text-gray-600 text-sm">
                Tôi đồng ý với{' '}
                <Text className="text-purple-600 font-medium">Điều khoản dịch vụ</Text>
                {' '}và{' '}
                <Text className="text-purple-600 font-medium">Chính sách bảo mật</Text>
              </Text>
            </View>

            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              style={{ borderRadius: 16, marginBottom: 16 }}
              onPress={handleRegister}
            >
              Tạo tài khoản
            </Button>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 text-sm">Hoặc đăng ký với</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row mb-6">
              <SocialButton title="Google" iconName='google' iconColor="#EA4335" onPress={handleGoogleRegister} />
              <SocialButton title="Facebook" iconName='facebook' iconColor="#3B5998" onPress={handleFacebookRegister} />
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-base">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text className="text-purple-600 text-base font-bold">Đăng Nhập</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Card>
      </View>
    </View>
  );
};

export default RegisterScreen;