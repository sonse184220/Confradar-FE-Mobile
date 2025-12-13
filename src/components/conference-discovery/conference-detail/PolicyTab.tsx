import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface } from 'react-native-paper';
import {
    ResearchConferenceDetailResponse,
    TechnicalConferenceDetailResponse,
} from '@/types/conference.type';

interface PolicyTabProps {
    conference:
    | TechnicalConferenceDetailResponse
    | ResearchConferenceDetailResponse;
}

const PolicyTab: React.FC<PolicyTabProps> = ({ conference }) => {
    const policies = conference.policies || [];

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Chính sách
            </Text>

            {/* Policies Section */}
            <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Icon name="verified-user" size={20} color="#3B82F6" />
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                        Chính sách & Quy định
                    </Text>
                </View>

                {policies.length > 0 ? (
                    <View style={{ gap: 12 }}>
                        {policies.map((policy) => (
                            <Surface
                                key={policy.policyId}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 12,
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                }}
                            >
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <Icon name="description" size={20} color="#3B82F6" style={{ marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 8 }}>
                                            {policy.policyName || 'Chính sách chưa đặt tên'}
                                        </Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 20 }}>
                                            {policy.description || 'Chưa có mô tả cho chính sách này'}
                                        </Text>
                                    </View>
                                </View>
                            </Surface>
                        ))}
                    </View>
                ) : (
                    <Surface
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                        }}
                    >
                        <Icon name="description" size={40} color="rgba(255,255,255,0.3)" style={{ alignSelf: 'center', marginBottom: 12 }} />
                        <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 15, marginBottom: 4 }}>
                            Chưa có thông tin về chính sách và quy định
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 12 }}>
                            Thông tin chính sách sẽ được cập nhật sớm
                        </Text>
                    </Surface>
                )}
            </View>

            {/* Important Notice */}
            <View
                style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: 8,
                    padding: 12,
                }}
            >
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Icon name="verified-user" size={18} color="#F59E0B" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#F59E0B', fontWeight: '600', fontSize: 14, marginBottom: 4 }}>
                            Lưu ý quan trọng
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18 }}>
                            Vui lòng đọc kỹ các chính sách trước khi đăng ký tham gia hội nghị. Mọi thắc mắc về chính sách và điều khoản hoàn tiền, xin liên hệ ban tổ chức để được hỗ trợ.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default PolicyTab;