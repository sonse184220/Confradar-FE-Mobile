import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, Avatar, Menu, TextInput, Appbar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageLibraryOptions, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { useAuth } from '../hooks/useAuth';
import { goBack } from '../utils/navigationUtil';

const EditProfileScreen = () => {
  const { profile, isLoading, updateProfile, isUpdating, updateError, refetch } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bioDescription, setBioDescription] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showGenderMenu, setShowGenderMenu] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  // Load profile data when component mounts or profile data changes
  useEffect(() => {
    if (profile) {
      setName(profile.fullName || '');
      setEmail(profile.email || '');
      setPhoneNumber(profile.phoneNumber || '');
      setDateOfBirth(profile.birthDay || '');
      setGender(profile.gender || '');
      setBioDescription(profile.bioDescription || '');
      setProfileImage(profile.avatarUrl || null);
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    try {
      const updateData: any = {};

      if (name !== (profile?.fullName || '')) updateData.fullName = name;
      if (phoneNumber !== (profile?.phoneNumber || '')) updateData.phoneNumber = phoneNumber;
      if (dateOfBirth !== (profile?.birthDay || '')) updateData.birthDay = dateOfBirth;
      if (gender !== (profile?.gender || '')) updateData.gender = gender as 'Male' | 'Female' | 'Other';
      if (bioDescription !== (profile?.bioDescription || '')) updateData.bioDescription = bioDescription;
      if (avatarFile) updateData.avatarFile = avatarFile;

      if (Object.keys(updateData).length === 0) {
        Alert.alert('Thông báo', 'Không có thay đổi nào để lưu.');
        return;
      }

      await updateProfile(updateData);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!', [
        { text: 'OK', onPress: () => goBack() }
      ]);
      refetch();
    } catch (error: any) {
      const errorMessage = updateError ?
        (typeof updateError === 'object' && 'data' in updateError ?
          (updateError.data as any)?.message || (updateError.data as any)?.Message || 'Có lỗi xảy ra'
          : 'Có lỗi xảy ra')
        : 'Có lỗi xảy ra';
      Alert.alert('Lỗi', errorMessage);
    }
  };

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
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        if (asset.uri) {
          setProfileImage(asset.uri);
          // Create File object for upload
          if (asset.fileName && asset.type) {
            const file = {
              uri: asset.uri,
              type: asset.type,
              name: asset.fileName,
            } as any;
            setAvatarFile(file);
          }
        }
      }
    });
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
          {/* Full screen background gradient */}
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

      {/* <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: '#146C94',
            opacity: 0.15
          }
        ]}
      />
      <Svg
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        viewBox="0 0 375 812"
      >
        <Defs>
          <LinearGradient id="topLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F6F1F1" stopOpacity={0.2} />
            <Stop offset="50%" stopColor="#F6F1F1" stopOpacity={0.1} />
            <Stop offset="100%" stopColor="#F6F1F1" stopOpacity={0} />
          </LinearGradient>

          <LinearGradient id="bottomLight" x1="100%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#F6F1F1" stopOpacity={0.2} />
            <Stop offset="50%" stopColor="#F6F1F1" stopOpacity={0.1} />
            <Stop offset="100%" stopColor="#F6F1F1" stopOpacity={0} />
          </LinearGradient>

          //màu ở dưới tạm ổn
           <LinearGradient id="topLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F6F1F1" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#F6F1F1" stopOpacity="0" />
          </LinearGradient>

          <LinearGradient id="bottomLight" x1="100%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#E0E0E0" stopOpacity="0.06" />
            <Stop offset="100%" stopColor="#E0E0E0" stopOpacity="0" />
          </LinearGradient> 
        </Defs>

        <Path
          d="M0,0 L0,270 Q120,180 220,120 T375,0 L375,0 Z"
          fill="url(#topLight)"
        />

        <Path
          d="M375,542 L375,812 L0,812 Q80,750 150,700 T375,542 Z"
          fill="url(#bottomLight)"
        />
      </Svg> */}

      {/* Header */}
      {/* <View className="pt-12 pb-6 px-5 flex-row items-center justify-center relative">
        <TouchableOpacity className="absolute left-5">
          <Text className="text-white text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Edit Profile</Text>
      </View> */}
      <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
        <Appbar.BackAction onPress={() => goBack()} />
        <Appbar.Content title="Edit Profile" titleStyle={{ color: '#F6F1F1', fontWeight: 'bold', textAlign: 'center' }} />
        <Appbar.Action icon="" onPress={() => { }} />
      </Appbar.Header>

      <View className="items-center mb-8">
        <TouchableOpacity onPress={handleSelectImage} className="relative">
          <View style={{
            borderWidth: 3,
            borderColor: '#FF6B35',
            borderRadius: 70,
            padding: 4,
            backgroundColor: 'white'
          }}>
            <Avatar.Image
              size={120}
              source={
                profileImage
                  ? { uri: profileImage }
                  : { uri: 'https://via.placeholder.com/120x120?text=No+Avatar' }
              }
              style={{ backgroundColor: '#F6F1F1' }}
            />
          </View>
          <View
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: '#FF6B35' }}
          >
            <Text className="text-white text-lg">📷</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View className="flex-1 px-5">
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={20}
        >
          {/* Name Field */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={isLoading ? "Loading..." : "Enter your name"}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                paddingRight: 40,
                borderRadius: 16,
                borderWidth: 1.5,
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
              disabled={isLoading}
            />
          </View>

          {/* Email Field - Read Only */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Email</Text>
            <TextInput
              value={email}
              placeholder={isLoading ? "Loading..." : "Email address"}
              editable={false}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#888888',
                backgroundColor: 'rgba(136, 136, 136, 0.1)',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
              theme={{
                colors: {
                  primary: '#888888',
                  outline: '#888888',
                  onSurfaceVariant: '#888888',
                }
              }}
              textColor="#888888"
              underlineStyle={{ display: 'none' }}
            />
          </View>

          {/* Phone Number Field */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={isLoading ? "Loading..." : "Enter your phone number"}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1.5,
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
              disabled={isLoading}
            />
          </View>

          {/* Date of Birth Field */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Date of Birth</Text>
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder={isLoading ? "Loading..." : "YYYY-MM-DD"}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1.5,
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
              disabled={isLoading}
            />
          </View>

          {/* Gender Dropdown */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Gender</Text>
            <Menu
              key={`menu-gender-${showGenderMenu}`}
              visible={showGenderMenu}
              onDismiss={() => setShowGenderMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowGenderMenu(true)}
                  className="border rounded-2xl p-4 flex-row justify-between items-center"
                  style={{ borderColor: '#F6F1F1', backgroundColor: 'rgba(246, 241, 241, 0.1)' }}
                  disabled={isLoading}
                >
                  <Text className="text-white">{gender || (isLoading ? "Loading..." : "Select gender")}</Text>
                  <Text className="text-white">▼</Text>
                </TouchableOpacity>
              }
            >
              {genderOptions.map((genderOption, index) => (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    setGender(genderOption);
                    setShowGenderMenu(false);
                  }}
                  title={genderOption}
                />
              ))}
            </Menu>
          </View>

          {/* Bio Description Field */}
          <View className="mb-6">
            <Text className="text-white text-sm mb-2 font-medium">Bio Description</Text>
            <TextInput
              value={bioDescription}
              onChangeText={setBioDescription}
              placeholder={isLoading ? "Loading..." : "Tell us about yourself"}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: 'transparent',
              }}
              contentStyle={{
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: '#F6F1F1',
                backgroundColor: 'rgba(246, 241, 241, 0.1)',
                paddingHorizontal: 16,
                paddingVertical: 12,
                minHeight: 80,
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
              disabled={isLoading}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSaveChanges}
            disabled={isUpdating || isLoading}
            style={{
              borderRadius: 16,
              marginTop: 20,
              backgroundColor: (isUpdating || isLoading) ? '#cccccc' : '#19A7CE'
            }}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
            loading={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default EditProfileScreen;