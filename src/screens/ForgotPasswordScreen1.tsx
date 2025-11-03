import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FormInput from '../components/auth/FormInput';
import { AuthStackParamList } from '../navigation/AuthStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

const { height } = Dimensions.get('window');

const ForgotPasswordScreen1 = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  type navigateprop = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword1'>;
  const navigation = useNavigation<navigateprop>();

  // Use useAuth hook
  const { forgotPassword, loading, forgotError, forgotResponse } = useAuth();

  const handleSendCode = async () => {
    if (!email) {
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        // setSuccessMessage('Hãy mở email để reset password');
        // Auto navigate after 2 seconds
        setTimeout(() => {
          navigation.navigate('ForgotPassword2');
        }, 2000);
      }
    } catch (error: any) {
      // Error will be handled by useAuth hook and available in forgotError
      console.log('Forgot password failed:', error);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login')
  };

  const InfoCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <View className="bg-blue-50 rounded-xl p-4 mb-6">
      <Text className="text-blue-800 text-sm font-medium mb-1">{title}</Text>
      <Text className="text-blue-600 text-xs">{description}</Text>
    </View>
  );

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
          <Text className="text-[32px]">🔒</Text>
        </View>
        <Text className="text-white text-center text-2xl font-bold mb-1.5">
          Quên mật khẩu?
        </Text>
        <Text className="text-violet-200 text-center text-sm">
          Nhập email để nhận mã xác minh
        </Text>
      </View>

      {/* Forgot Password Form*/}
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
              Đặt lại mật khẩu
            </Text>

            <Text className="text-gray-600 text-center text-base mb-6">
              Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi mã xác minh để đặt lại mật khẩu.
            </Text>

            <InfoCard
              title="💡 Lưu ý"
              description="Mã xác minh sẽ được gửi đến email của bạn trong vài phút. Vui lòng kiểm tra cả thư mục spam nếu không thấy email."
            />

            <FormInput
              label="Địa chỉ Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email của bạn"
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            {/* Error Message */}
            {forgotError && (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                  {forgotError}
                </Text>
              </View>
            )}

            {/* Success Message */}
            {forgotResponse?.success && (
              <View style={{ backgroundColor: '#D1FAE5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#065F46', fontSize: 14 }}>
                  {forgotResponse?.message}
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              style={{ borderRadius: 16, marginBottom: 16 }}
              onPress={handleSendCode}
              loading={loading}
              disabled={loading || !email}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác minh'}
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

export default ForgotPasswordScreen1;