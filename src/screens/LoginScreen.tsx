import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform, Image } from 'react-native';
import { TextInput, Button, Card, Icon } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FormInput from '../components/auth/FormInput';
import { SocialButton } from '../components/auth/SocialButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle } from '@/modules/authProviders/firebaseGoogleProvider';
import { getFcmToken } from '@/modules/messagingProvider/firebaseMessagingProvider';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  type LoginScreenProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  type LoginScreenProp2 = NativeStackNavigationProp<RootStackParamList, 'Auth'>;
  const navigation = useNavigation<LoginScreenProp>();
  const navigation2 = useNavigation<LoginScreenProp2>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    login,
    loading,
    loginError,
    loginResponse,
    googleLogin,
    googleLoading,
    googleLoginError,
  } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    const { webToken, mobileToken } = await getFcmToken();

    try {
      const result = await login({
        email,
        password,
        firebaseWebFcmToken: webToken,
        firebaseMobileFcmToken: mobileToken,
      });

      if (result.success) {
        navigation2.replace('App');
      }
    } catch (error) {
      console.log('Login failed:', error);
    }
  };
  const handleForgotPassword = () => { navigation.navigate('ForgotPassword1'); };
  const handleSignUp = () => { navigation.navigate('Register'); };
  const handleGoogleLogin = async () => {
    try {
      const googleResult = await signInWithGoogle();

      const result = await googleLogin(googleResult.firebaseIdToken);

      console.log('Google login success:', result);

      if (result.success) {
        navigation2.replace('App');
      }
    } catch (error) {
      console.log('Google login failed:', error);
    }
  };
  const handleFacebookLogin = () => { };

  return (
    // <SafeAreaView className="flex-1 bg-gray-900">
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#000000', '#2e2e2e', '#6b6b6b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      {/* <LinearGradient colors={[
        '#000000', // đen 
        '#2e2e2e', // xám đậm 
        '#6b6b6b', // xám nhạt 
      ]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" /> */}

      {/* Logo and Welcome text */}
      {/* <View className="items-center mb-12">
        <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
          <Text className="text-purple-600 text-2xl font-bold">📱</Text>
        </View>
        <Text className="text-white text-3xl font-bold mb-2">Welcome Back</Text>
        <Text className="text-purple-100 text-center text-base">
          Sign in to continue to your account
        </Text>
      </View> */}
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
          {/* <Text className="text-[32px]">📱</Text> */}
          <Image
            source={require('../assets/ConfradarLogo_Light.png')}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </View>
        <Text className="text-white text-center text-2xl font-bold mb-1.5">
          Chào mừng trở lại
        </Text>
        <Text className="text-violet-200 text-center text-sm">
          Đăng nhập để tiếp tục vào tài khoản của bạn
        </Text>
      </View>

      {/* Login Form*/}
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
        // containerStyle={{
        //   alignSelf: 'center',
        //   borderRadius: 24,
        //   padding: 0,
        //   shadowColor: '#000',
        //   shadowOffset: { width: 0, height: 4 },
        //   shadowOpacity: 0.1,
        //   shadowRadius: 10,
        //   elevation: 6,
        //   maxHeight: height * 0.7,
        //   width: '80%',
        //   overflow: 'hidden'
        // }}
        >
          <KeyboardAwareScrollView
            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 30, }}
            contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
            // contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            // @ts-ignore
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 80}
            extraScrollHeight={20}
          >
            <Text className="text-gray-800 text-2xl font-bold text-center mb-6">Sign In</Text>

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu của bạn"
              secureTextEntry
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <TouchableOpacity className="items-end mb-6" onPress={handleForgotPassword}>
              <Text className="text-purple-600 text-sm font-medium">Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {loginError && (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                  {loginError}
                </Text>
              </View>
            )}

            {loginResponse?.success && loginResponse.message && (
              <View style={{ backgroundColor: '#D1FAE5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#065F46', fontSize: 14 }}>
                  {loginResponse.message}
                </Text>
              </View>
            )}

            {googleLoginError && (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                  {googleLoginError}
                </Text>
              </View>
            )}

            {/* <Button
              title="Đăng Nhập"
              buttonStyle={{ backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 12 }}
              titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
              containerStyle={{ marginBottom: 16 }}
              onPress={handleLogin}
            /> */}

            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              style={{ borderRadius: 16, marginBottom: 16 }}
              onPress={handleLogin}
              loading={loading || googleLoading}
              disabled={loading || googleLoading || !email || !password}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 text-sm">Hoặc đăng nhập với</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row mb-6">
              <SocialButton title="Google" iconName='google' iconColor="#EA4335" onPress={handleGoogleLogin} />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-base">Bạn chưa có tài khoản? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text className="text-purple-600 text-base font-bold">Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Card>
      </View>
    </View >
  );
};

export default LoginScreen;