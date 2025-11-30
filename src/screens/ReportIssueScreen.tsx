import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useReport } from '@/hooks/useReport';
import { goBack } from '../utils/navigationUtil';

const ReportIssueScreen = () => {
    const [reportForm, setReportForm] = useState({
        reportSubject: '',
        reason: '',
        description: ''
    });

    const { createReport, loading } = useReport();

    const handleSubmitReport = async () => {
        // Validate form
        if (!reportForm.reportSubject.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề báo cáo.');
            return;
        }
        if (!reportForm.reason.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập lý do báo cáo.');
            return;
        }
        if (!reportForm.description.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mô tả chi tiết.');
            return;
        }

        try {
            await createReport(reportForm);

            Alert.alert(
                'Thành công',
                'Gửi báo cáo thành công!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setReportForm({
                                reportSubject: '',
                                reason: '',
                                description: ''
                            });
                            goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi báo cáo');
        }
    };

    const isFormValid = () => {
        return reportForm.reportSubject.trim() &&
            reportForm.reason.trim() &&
            reportForm.description.trim();
    };

    return (
        <View className="flex-1">
            {/* Gradient Background */}
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
                    </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="375" height="812" fill="url(#bgGradient)" />
            </Svg>

            {/* Header */}
            <Appbar.Header style={{ backgroundColor: 'transparent', elevation: 0 }}>
                <Appbar.BackAction onPress={() => goBack()} color="#F6F1F1" />
                <Appbar.Content
                    title="Báo cáo vấn đề"
                    titleStyle={{ color: '#F6F1F1', fontWeight: 'bold', textAlign: 'center' }}
                />
                <Appbar.Action icon="" onPress={() => { }} />
            </Appbar.Header>

            {/* Icon and Title */}
            <View className="items-center mb-8">
                <View
                    className="w-24 h-24 rounded-full items-center justify-center mb-4"
                    style={{
                        borderWidth: 2,
                        borderColor: '#19A7CE',
                        backgroundColor: 'rgba(20,108,148,0.3)',
                    }}
                >
                    <Icon name="flag-outline" size={48} color="#F6F1F1" />
                </View>
                <Text className="text-white text-2xl font-extrabold text-center mb-1">
                    Báo cáo vấn đề
                </Text>
                <Text className="text-white text-base text-center px-6">
                    Hãy cho chúng tôi biết vấn đề bạn gặp phải
                </Text>
            </View>

            {/* Form */}
            <View className="flex-1 px-5">
                <KeyboardAwareScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={20}
                >
                    {/* Tiêu đề */}
                    <View className="mb-4">
                        <Text className="text-white text-sm mb-2 font-medium">
                            Tiêu đề <Text style={{ color: '#FF6B6B' }}>*</Text>
                        </Text>
                        <TextInput
                            value={reportForm.reportSubject}
                            onChangeText={(text) => setReportForm({ ...reportForm, reportSubject: text })}
                            placeholder="Nhập tiêu đề báo cáo"
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
                            disabled={loading}
                        />
                    </View>

                    {/* Lý do */}
                    <View className="mb-4">
                        <Text className="text-white text-sm mb-2 font-medium">
                            Lý do <Text style={{ color: '#FF6B6B' }}>*</Text>
                        </Text>
                        <TextInput
                            value={reportForm.reason}
                            onChangeText={(text) => setReportForm({ ...reportForm, reason: text })}
                            placeholder="Nhập lý do báo cáo"
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
                            disabled={loading}
                        />
                    </View>

                    {/* Mô tả chi tiết */}
                    <View className="mb-6">
                        <Text className="text-white text-sm mb-2 font-medium">
                            Mô tả chi tiết <Text style={{ color: '#FF6B6B' }}>*</Text>
                        </Text>
                        <TextInput
                            value={reportForm.description}
                            onChangeText={(text) => setReportForm({ ...reportForm, description: text })}
                            placeholder="Mô tả chi tiết vấn đề của bạn"
                            multiline
                            numberOfLines={6}
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
                                minHeight: 120,
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
                            disabled={loading}
                        />
                    </View>

                    {/* Submit Button */}
                    <Button
                        mode="contained"
                        onPress={handleSubmitReport}
                        disabled={!isFormValid() || loading}
                        style={{
                            borderRadius: 16,
                            marginTop: 20,
                            backgroundColor: (isFormValid() && !loading) ? '#19A7CE' : '#cccccc'
                        }}
                        contentStyle={{ paddingVertical: 8 }}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        loading={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
                    </Button>
                </KeyboardAwareScrollView>
            </View>
        </View>
    );
};

export default ReportIssueScreen;