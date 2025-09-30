import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Card, Checkbox } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FormInput from '../components/auth/FormInput';
import PasswordRequirements from '../components/auth/PasswordRequirements';

const { height } = Dimensions.get('window');

const ForgotPasswordScreen2 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
  };

  const handleBackToLogin = () => {
  };

  // const PasswordRequirements: React.FC = () => (
  //   <View className="mb-6 p-4 bg-green-50 rounded-xl">
  //     <Text className="text-green-800 text-sm font-medium mb-2">
  //       📋 Yêu cầu mật khẩu:
  //     </Text>
  //     <Text className="text-green-600 text-xs leading-5">
  //       • Ít nhất 8 ký tự{'\n'}
  //       • Chứa chữ hoa và chữ thường{'\n'}
  //       • Chứa ít nhất một số{'\n'}
  //       • Chứa ít nhất một ký tự đặc biệt
  //     </Text>
  //   </View>
  // );



  // const SuccessInfo: React.FC = () => (
  //   <View className="bg-blue-50 rounded-xl p-4 mb-6">
  //     <Text className="text-blue-800 text-sm font-medium mb-1">🔐 Bảo mật</Text>
  //     <Text className="text-blue-600 text-xs">
  //       Mật khẩu mới sẽ được áp dụng ngay lập tức sau khi đặt lại thành công.
  //     </Text>
  //   </View>
  // );

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
          <Text className="text-[32px]">🔑</Text>
        </View>
        <Text className="text-white text-center text-2xl font-bold mb-1.5">
          Đặt lại mật khẩu
        </Text>
        <Text className="text-violet-200 text-center text-sm">
          Tạo mật khẩu mới bảo mật cho tài khoản của bạn
        </Text>
      </View>

      {/* Reset Password Form*/}
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
            <Text className="text-gray-800 text-2xl font-bold text-center mb-4">
              Tạo mật khẩu mới
            </Text>

            <Text className="text-gray-600 text-center text-base mb-6">
              Vui lòng nhập mật khẩu mới và xác nhận để hoàn tất quá trình đặt lại.
            </Text>

            {/* <SuccessInfo /> */}

            <FormInput
              label="Mật khẩu mới"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu mới của bạn"
              secureTextEntry
            />

            <FormInput
              label="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu mới của bạn"
              secureTextEntry
            />

            <PasswordRequirements
              password={password}
              confirmPassword={confirmPassword}
            />

            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              style={{ borderRadius: 16, marginBottom: 16 }}
              onPress={handleResetPassword}
            >
              Đặt lại mật khẩu
            </Button>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-base">
                Nhớ mật khẩu rồi?{' '}
              </Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text className="text-purple-600 text-base font-bold">
                  Quay lại đăng nhập
                </Text>
              </TouchableOpacity>
            </View>

          </KeyboardAwareScrollView>
        </Card>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen2;