import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FormInput from '../components/auth/FormInput';
import { SocialButton } from '../components/auth/SocialButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { ImageLibraryOptions, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { Avatar } from 'react-native-paper';
import { RegisterData } from '../types/auth';

const { height } = Dimensions.get('window');

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bioDescription, setBioDescription] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Use useAuth hook
  const { register, loading, registerError, registerResponse } = useAuth();

  const handleSelectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]?.uri) {
        setProfileImage(response.assets[0].uri);
        setAvatarFile(response.assets[0]);
      }
    });
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name || !agreeToTerms) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    try {
      // const formData = new FormData();
      // formData.append('email', email);
      // formData.append('password', password);
      // formData.append('confirmPassword', confirmPassword);
      // formData.append('fullName', name);
      // if (phoneNumber) formData.append('phoneNumber', phoneNumber);
      // if (birthday) formData.append('birthday', birthday);
      // formData.append('gender', gender);
      // if (bioDescription) formData.append('bioDescription', bioDescription);
      const registerData: RegisterData = {
        email,
        password,
        confirmPassword,
        fullName: name,
        birthday,
        phoneNumber,
        gender,
        bioDescription,
        avatarFile: avatarFile, // Avatar file from image picker
      };

      const result = await register(registerData);
      if (result.success) {
        // setSuccessMessage(result.Message || 'Đăng ký thành công!');
        // Auto navigate to login after 2 seconds
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }
    } catch (error) {
      // Error will be handled by useAuth hook and available in registerError
      console.log('Register failed:', error);
    }
  };

  const handleSignIn = () => { navigation.navigate('Login') };
  const handleGoogleRegister = () => { };
  const handleFacebookRegister = () => { };

  type navigateprop = NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  const navigation = useNavigation<navigateprop>();

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
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Số điện thoại"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Nhập số điện thoại của bạn"
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="Nhập mật khẩu của bạn"
              secureTextEntry
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Nhập lại mật khẩu của bạn"
              secureTextEntry
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            <FormInput
              label="Ngày sinh"
              value={birthday}
              onChangeText={setBirthday}
              placeholder="DD/MM/YYYY"
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16 }}
            />

            {/* Gender Selection */}
            <Text className="text-gray-700 text-sm font-medium mb-2">Giới tính</Text>
            <View className="flex-row mb-4">
              {(['Male', 'Female', 'Other'] as const).map((genderOption) => (
                <TouchableOpacity
                  key={genderOption}
                  className={`flex-1 py-3 px-4 mr-2 rounded-lg border ${gender === genderOption
                    ? 'bg-purple-100 border-purple-600'
                    : 'bg-gray-50 border-gray-300'
                    }`}
                  onPress={() => setGender(genderOption)}
                >
                  <Text className={`text-center text-sm ${gender === genderOption ? 'text-purple-600 font-medium' : 'text-gray-600'
                    }`}>
                    {genderOption === 'Male' ? 'Nam' : genderOption === 'Female' ? 'Nữ' : 'Khác'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FormInput
              label="Mô tả bản thân (Tùy chọn)"
              value={bioDescription}
              onChangeText={setBioDescription}
              placeholder="Viết vài dòng về bản thân bạn..."
              multiline
              numberOfLines={3}
              style={{ backgroundColor: '#F9FAFB', marginBottom: 16, height: 80 }}
            />

            {/* Profile Image Selection */}
            <Text className="text-gray-700 text-sm font-medium mb-2">Ảnh đại diện (Tùy chọn)</Text>
            <View className="items-center mb-6">
              <TouchableOpacity onPress={handleSelectImage} className="relative">
                <View style={{
                  borderWidth: 2,
                  borderColor: '#7C3AED',
                  borderRadius: 50,
                  padding: 2,
                  backgroundColor: 'white'
                }}>
                  <Avatar.Image
                    size={80}
                    source={
                      profileImage
                        ? { uri: profileImage }
                        : require('../assets/taylorswift.jpg')
                    }
                    style={{ backgroundColor: '#F9FAFB' }}
                  />
                </View>
                <View
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#7C3AED' }}
                >
                  <Text className="text-white text-xs">📷</Text>
                </View>
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-2 text-center">Nhấn để chọn ảnh đại diện</Text>
            </View>

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

            {/* Error Message */}
            {registerError && (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                  {registerError}
                </Text>
              </View>
            )}

            {/* Success Message */}
            {registerResponse?.success && (
              <View style={{ backgroundColor: '#D1FAE5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#065F46', fontSize: 14 }}>
                  {registerResponse?.message}
                </Text>
              </View>
            )}

            {/* Password Match Error */}
            {password && confirmPassword && password !== confirmPassword && (
              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#DC2626', fontSize: 14 }}>
                  Mật khẩu xác nhận không khớp
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              buttonColor="#7C3AED"
              textColor="#FFF"
              style={{ borderRadius: 16, marginBottom: 16 }}
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !email || !password || !confirmPassword || !name || !agreeToTerms || password !== confirmPassword}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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