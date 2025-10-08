import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Avatar, Menu, TextInput, Appbar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageLibraryOptions, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';

const EditProfileScreen = () => {
  const [name, setName] = useState('Melissa Peters');
  const [email, setEmail] = useState('melpeters@gmail.com');
  const [password, setPassword] = useState('••••••••••');
  const [dateOfBirth, setDateOfBirth] = useState('23/05/1995');
  const [country, setCountry] = useState('Nigeria');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const countries = [
    'Nigeria', 'Vietnam', 'United States', 'United Kingdom', 'Canada', 'Australia'
  ];

  const handleSaveChanges = () => {
    console.log('Save changes pressed');
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
      } else if (response.assets && response.assets[0]?.uri) {
        setProfileImage(response.assets[0].uri);
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
        <Appbar.BackAction onPress={() => console.log('Go back')} />
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
              // source={profileImage ? { uri: profileImage } : { uri: '/test' }}
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/taylorswift.jpg')
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
            <Text className="text-white text-sm mb-2 font-medium">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
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
            />
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
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
            />
          </View>

          {/* Password Field */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={true}
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
                },
              }}
              textColor="#F6F1F1"
              underlineStyle={{ display: 'none' }}
            />
          </View>

          {/* Date of Birth Dropdown */}
          <View className="mb-4">
            <Text className="text-white text-sm mb-2 font-medium">Date of Birth</Text>
            <Menu
              visible={showDateMenu}
              onDismiss={() => setShowDateMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowDateMenu(true)}
                  className="border rounded-2xl p-4 flex-row justify-between items-center"
                  style={{ borderColor: '#F6F1F1', backgroundColor: 'rgba(246, 241, 241, 0.1)' }}
                >
                  <Text className="text-white">{dateOfBirth}</Text>
                  <Text className="text-white">▼</Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => { setDateOfBirth('23/05/1995'); setShowDateMenu(false); }} title="23/05/1995" />
              <Menu.Item onPress={() => { setDateOfBirth('15/08/1990'); setShowDateMenu(false); }} title="15/08/1990" />
              <Menu.Item onPress={() => { setDateOfBirth('10/12/1988'); setShowDateMenu(false); }} title="10/12/1988" />
            </Menu>
          </View>

          {/* Country/Region Dropdown */}
          <View className="mb-6">
            <Text className="text-white text-sm mb-2 font-medium">Country/Region</Text>
            <Menu
              visible={showCountryMenu}
              onDismiss={() => setShowCountryMenu(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setShowCountryMenu(true)}
                  className="border rounded-2xl p-4 flex-row justify-between items-center"
                  style={{ borderColor: '#F6F1F1', backgroundColor: 'rgba(246, 241, 241, 0.1)' }}
                >
                  <Text className="text-white">{country}</Text>
                  <Text className="text-white">▼</Text>
                </TouchableOpacity>
              }
            >
              {countries.map((countryItem, index) => (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    setCountry(countryItem);
                    setShowCountryMenu(false);
                  }}
                  title={countryItem}
                />
              ))}
            </Menu>
          </View>

          <Button
            mode="contained"
            onPress={handleSaveChanges}
            style={{
              borderRadius: 16,
              marginTop: 20,
              backgroundColor: '#19A7CE'
            }}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Save changes
          </Button>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default EditProfileScreen;