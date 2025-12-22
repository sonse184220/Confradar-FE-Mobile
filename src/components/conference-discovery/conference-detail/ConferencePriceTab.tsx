import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface, Chip } from 'react-native-paper';
import {
    TechnicalConferenceDetailResponse,
    ResearchConferenceDetailResponse,
    ConferencePricePhaseResponse,
} from '@/types/conference.type';

interface ConferencePriceTabProps {
    conference:
    | TechnicalConferenceDetailResponse
    | ResearchConferenceDetailResponse;
    formatDate: (dateString?: string) => string;
    formatTime: (timeString?: string) => string;
}

const ConferencePriceTab: React.FC<ConferencePriceTabProps> = ({
    conference,
    formatDate,
    formatTime,
}) => {
    const pricesList = conference.conferencePrices || [];
    const isResearch = conference.isResearchConference;

    const getPhaseStatus = (phase: ConferencePricePhaseResponse) => {
        if (!phase.startDate || !phase.endDate) return 'unknown';

        const now = new Date();
        const startDate = new Date(phase.startDate);
        const endDate = new Date(phase.endDate);

        if (now < startDate) return 'upcoming';
        if (now > endDate) return 'ended';
        return 'current';
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'current':
                return {
                    icon: 'check-circle',
                    text: 'Đang diễn ra',
                    color: '#10B981',
                    bgColor: 'rgba(16, 185, 129, 0.2)',
                };
            case 'upcoming':
                return {
                    icon: 'schedule',
                    text: 'Chưa diễn ra',
                    color: '#F59E0B',
                    bgColor: 'rgba(245, 158, 11, 0.2)',
                };
            case 'ended':
                return {
                    icon: 'cancel',
                    text: 'Đã kết thúc',
                    color: '#6B7280',
                    bgColor: 'rgba(107, 114, 128, 0.2)',
                };
            default:
                return {
                    icon: 'help-outline',
                    text: 'Chưa xác định',
                    color: '#6B7280',
                    bgColor: 'rgba(107, 114, 128, 0.2)',
                };
        }
    };

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                {isResearch ? 'Các hình thức tham dự' : 'Các loại vé'}
            </Text>

            {pricesList.length > 0 ? (
                <View style={{ gap: 16 }}>
                    {pricesList.map((ticket) => (
                        <Surface
                            key={ticket.conferencePriceId}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: 12,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.2)',
                            }}
                        >
                            {/* Ticket Header */}
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
                                            {ticket.ticketName || (isResearch ? 'Chưa đặt tên' : 'Vé chưa đặt tên')}
                                        </Text>
                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 16 }}>
                                            {ticket.ticketDescription ||
                                                (isResearch
                                                    ? 'Chưa có mô tả cho hình thức tham dự này'
                                                    : 'Chưa có mô tả cho loại vé này')}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ color: '#EF4444', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                                            {ticket.ticketPrice
                                                ? `${ticket.ticketPrice.toLocaleString('vi-VN')}₫`
                                                : (isResearch ? 'Phí chưa xác định' : 'Giá chưa xác định')}
                                        </Text>
                                        {ticket.isAuthor && (
                                            <Chip
                                                mode="flat"
                                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', height: 24 }}
                                                textStyle={{ color: '#60A5FA', fontSize: 11 }}
                                            >
                                                Dành cho tác giả
                                            </Chip>
                                        )}
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', gap: 16 }}>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                        <Text style={{ fontWeight: '600' }}>
                                            {isResearch ? 'Tổng số chỗ:' : 'Tổng số vé:'}
                                        </Text>{' '}
                                        {ticket.totalSlot || 'Chưa xác định'}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                                        <Text style={{ fontWeight: '600' }}>Còn lại:</Text>{' '}
                                        {ticket.availableSlot !== undefined ? ticket.availableSlot : 'Chưa xác định'}
                                    </Text>
                                </View>
                            </View>

                            {/* Price Phases */}
                            {!conference.isResearchConference && (
                                <View>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
                                        {isResearch ? 'Các giai đoạn phí đăng ký' : 'Các giai đoạn giá vé'}
                                    </Text>
                                    {ticket.pricePhases && ticket.pricePhases.length > 0 ? (
                                        <View style={{ gap: 12 }}>
                                            {Array.from(ticket.pricePhases || [])
                                                .sort((a, b) => {
                                                    const startA = new Date(a.startDate || '').getTime();
                                                    const startB = new Date(b.startDate || '').getTime();
                                                    return startA - startB;
                                                })
                                                .map((phase, index) => {
                                                    const status = getPhaseStatus(phase);
                                                    const statusDisplay = getStatusDisplay(status);
                                                    const actualPrice =
                                                        ticket.ticketPrice && phase.applyPercent
                                                            ? Math.round(ticket.ticketPrice * (phase.applyPercent / 100))
                                                            : ticket.ticketPrice;

                                                    return (
                                                        <View
                                                            key={phase.pricePhaseId}
                                                            style={{
                                                                backgroundColor: statusDisplay.bgColor,
                                                                borderRadius: 8,
                                                                padding: 12,
                                                                borderWidth: 1,
                                                                borderColor: statusDisplay.color + '40',
                                                                ...(status === 'current' && {
                                                                    borderWidth: 2,
                                                                    shadowColor: statusDisplay.color,
                                                                    shadowOffset: { width: 0, height: 2 },
                                                                    shadowOpacity: 0.3,
                                                                    shadowRadius: 4,
                                                                    elevation: 4,
                                                                }),
                                                            }}
                                                        >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                                                <View style={{ flex: 1 }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                                        <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>
                                                                            {phase.phaseName || `Giai đoạn ${index + 1}`}
                                                                        </Text>
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                                            <Icon name={statusDisplay.icon} size={14} color={statusDisplay.color} />
                                                                            <Text style={{ color: statusDisplay.color, fontSize: 11, fontWeight: '500' }}>
                                                                                {statusDisplay.text}
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: 'bold' }}>
                                                                    {actualPrice ? `${actualPrice.toLocaleString('vi-VN')}₫` : 'Giá chưa xác định'}
                                                                </Text>
                                                            </View>

                                                            {phase.applyPercent && (
                                                                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 8 }}>
                                                                    Giảm {100 - phase.applyPercent}% ({phase.applyPercent}% giá gốc)
                                                                </Text>
                                                            )}

                                                            <View style={{ gap: 6 }}>
                                                                {phase.startDate && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                                        <Icon name="event" size={14} color="rgba(255,255,255,0.7)" />
                                                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                                                            Bắt đầu: {formatDate(phase.startDate)}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                                {phase.endDate && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                                        <Icon name="event" size={14} color="rgba(255,255,255,0.7)" />
                                                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                                                            Kết thúc: {formatDate(phase.endDate)}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                                {phase.startDate && phase.endDate && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                                        <Icon name="access-time" size={14} color="rgba(255,255,255,0.7)" />
                                                                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                                                            {formatTime(phase.startDate)} - {formatTime(phase.endDate)}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                                    <Icon name="confirmation-number" size={14} color="rgba(255,255,255,0.7)" />
                                                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                                                        Vé còn lại: {phase.availableSlot !== undefined ? phase.availableSlot : 'Chưa xác định'}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            {/* Refund Policies */}
                                                            <View
                                                                style={{
                                                                    marginTop: 12,
                                                                    paddingTop: 12,
                                                                    borderTopWidth: 1,
                                                                    borderTopColor: 'rgba(255,255,255,0.1)',
                                                                }}
                                                            >
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                                                                    <Icon name="access-time" size={14} color="rgba(255,255,255,0.7)" />
                                                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                                                                        Chính sách hoàn vé
                                                                    </Text>
                                                                </View>

                                                                {phase.refundPolicies?.length ? (
                                                                    <View style={{ gap: 8 }}>
                                                                        {Array.from(phase.refundPolicies)
                                                                            .sort((a, b) => {
                                                                                const deadlineA = new Date(a.refundDeadline || '').getTime();
                                                                                const deadlineB = new Date(b.refundDeadline || '').getTime();
                                                                                return deadlineA - deadlineB;
                                                                            })
                                                                            .map((policy) => (
                                                                                <View
                                                                                    key={policy.refundPolicyId}
                                                                                    style={{
                                                                                        flexDirection: 'row',
                                                                                        gap: 8,
                                                                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                                                                        padding: 8,
                                                                                        borderRadius: 6,
                                                                                    }}
                                                                                >
                                                                                    <Icon name="check-circle" size={14} color="#10B981" style={{ marginTop: 2 }} />
                                                                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, flex: 1, lineHeight: 16 }}>
                                                                                        Hoàn <Text style={{ fontWeight: '600', color: '#10B981' }}>{policy.percentRefund}%</Text> nếu hủy trước{'\n'}
                                                                                        {formatDate(policy.refundDeadline)} – {formatTime(policy.refundDeadline)}
                                                                                    </Text>
                                                                                </View>
                                                                            ))}

                                                                        <View
                                                                            style={{
                                                                                flexDirection: 'row',
                                                                                gap: 8,
                                                                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                                                padding: 8,
                                                                                borderRadius: 6,
                                                                            }}
                                                                        >
                                                                            <Icon name="info" size={14} color="#F59E0B" style={{ marginTop: 2 }} />
                                                                            <Text style={{ color: '#F59E0B', fontSize: 10, flex: 1, lineHeight: 14 }}>
                                                                                Vui lòng đọc kỹ chính sách trước khi mua vé.
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                ) : (
                                                                    <View
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            gap: 8,
                                                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                                            padding: 8,
                                                                            borderRadius: 6,
                                                                        }}
                                                                    >
                                                                        <Icon name="cancel" size={14} color="#EF4444" style={{ marginTop: 2 }} />
                                                                        <Text style={{ color: '#EF4444', fontSize: 11, flex: 1, fontWeight: '500' }}>
                                                                            Không hỗ trợ hoàn vé ở giai đoạn này
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </View>
                                                    );
                                                })}
                                        </View>
                                    ) : (
                                        <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 16 }}>
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 12 }}>
                                                {isResearch ? 'Chưa có thông tin về các giai đoạn phí đăng ký' : 'Chưa có thông tin về các giai đoạn giá vé'}
                                            </Text>
                                        </Surface>
                                    )}
                                </View>
                            )}
                        </Surface>
                    ))}
                </View>
            ) : (
                <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 24 }}>
                    <Icon name="info" size={40} color="rgba(255,255,255,0.5)" style={{ alignSelf: 'center', marginBottom: 12 }} />
                    <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 16, marginBottom: 8 }}>
                        Chưa có thông tin về giá vé
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: 12 }}>
                        Vui lòng quay lại sau hoặc liên hệ ban tổ chức để biết thêm chi tiết
                    </Text>
                </Surface>
            )}
        </ScrollView>
    );
};

export default ConferencePriceTab;