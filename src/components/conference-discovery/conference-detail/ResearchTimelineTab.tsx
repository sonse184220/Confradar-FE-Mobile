import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface, Button } from 'react-native-paper';
import {
    ResearchConferenceDetailResponse,
    ResearchConferencePhaseResponse,
} from '@/types/conference.type';

interface ResearchTimelineTabProps {
    conference: ResearchConferenceDetailResponse;
    formatDate: (dateString?: string) => string;
}

const ResearchTimelineTab: React.FC<ResearchTimelineTabProps> = ({
    conference,
    formatDate,
}) => {
    // const [activeSubTab, setActiveSubTab] = useState<'main' | 'waitlist'>('main');
    const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

    const researchPhases = conference.researchPhase || [];

    const sortedPhases = [...researchPhases].sort((a, b) =>
        (a.phaseOrder || 0) - (b.phaseOrder || 0)
    );
    // const mainPhases = researchPhases.filter((phase) => !phase.isWaitlist);
    // const waitlistPhases = researchPhases.filter((phase) => phase.isWaitlist);

    const renderPhaseSection = (
        title: string,
        iconName: string,
        items: Array<{
            label: string;
            startDate?: string;
            endDate?: string;
            note?: string;
        }>,
        color: string
    ) => {
        const hasData = items.some((item) => item.startDate && item.endDate);
        if (!hasData) return null;

        return (
            <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Text style={{ fontSize: 18 }}>{title.split(' ')[0]}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        {title.substring(title.indexOf(' ') + 1)}
                    </Text>
                </View>
                <View style={{ gap: 12, paddingLeft: 8 }}>
                    {items.map((item, idx) => {
                        if (!item.startDate || !item.endDate) return null;
                        return (
                            <View
                                key={idx}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    padding: 12,
                                    borderLeftWidth: 4,
                                    borderLeftColor: color,
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: '500', marginBottom: 4, fontSize: 14 }}>
                                    {item.label}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                    <Icon name="event" size={14} color="rgba(255,255,255,0.8)" />
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                                    </Text>
                                </View>
                                {item.note && (
                                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontStyle: 'italic', marginTop: 4, lineHeight: 16 }}>
                                        {item.note}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const renderPhaseContent = (phases: ResearchConferencePhaseResponse[]) => {
        if (phases.length === 0) {
            return (
                <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                        Chưa có thông tin timeline cho giai đoạn này
                    </Text>
                </Surface>
            );
        }

        return (
            <View style={{ gap: 16 }}>
                {phases.map((phase, phaseIndex) => (
                    <Surface
                        key={phase.researchConferencePhaseId}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: 12,
                            padding: 16,
                        }}
                    >
                        <View style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)' }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                                {/* Giai đoạn {phaseIndex + 1} */}
                                Giai đoạn {phase.phaseOrder || 'N/A'}
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {phase.isActive ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                        <Icon name="check-circle" size={12} color="#10B981" />
                                        <Text style={{ color: '#10B981', fontSize: 11 }}>Đang hoạt động</Text>
                                    </View>
                                ) : (
                                    <View style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                        <Text style={{ color: '#9CA3AF', fontSize: 11 }}>Không hoạt động</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Registration & Abstract Section */}
                        {renderPhaseSection(
                            '📝 Đăng ký & Nộp bản tóm tắt (Abstract)',
                            'person-add',
                            [
                                {
                                    label: 'Thời gian đăng ký với tư cách tác giả',
                                    startDate: phase.registrationStartDate,
                                    endDate: phase.registrationEndDate,
                                    note: 'Khách hàng chỉ được mua vé và nộp bài báo trong khoảng thời gian này',
                                },
                                {
                                    label: 'Thời gian quyết định trạng thái bản tóm tắt (Abstract)',
                                    startDate: phase.abstractDecideStatusStart,
                                    endDate: phase.abstractDecideStatusEnd,
                                    note: 'Ban tổ chức phải quyết định trạng thái và phân công reviewer trong khoảng này',
                                },
                            ],
                            '#3B82F6'
                        )}

                        {/* Full Paper Section */}
                        {renderPhaseSection(
                            '📄 Nộp bài báo bản đầy đủ (Full Paper)',
                            'description',
                            [
                                {
                                    label: 'Thời gian nộp bài báo bản đầy đủ',
                                    startDate: phase.fullPaperStartDate,
                                    endDate: phase.fullPaperEndDate,
                                    note: 'Khách hàng phải nộp full paper trong khoảng thời gian này',
                                },
                                {
                                    label: 'Thời gian đánh giá',
                                    startDate: phase.reviewStartDate,
                                    endDate: phase.reviewEndDate,
                                    note: 'Các reviewer phải nộp đánh giá trong khoảng này',
                                },
                                {
                                    label: 'Thời gian quyết định trạng thái bài báo đầy đủ',
                                    startDate: phase.fullPaperDecideStatusStart,
                                    endDate: phase.fullPaperDecideStatusEnd,
                                    note: 'Head Reviewer phải quyết định trạng thái trong khoảng này',
                                },
                            ],
                            '#10B981'
                        )}

                        {/* Revision Paper Section */}
                        {renderPhaseSection(
                            '🔄 Chỉnh sửa bài báo (Revision Paper)',
                            'edit',
                            [
                                {
                                    label: 'Thời gian chỉnh sửa',
                                    startDate: phase.reviseStartDate,
                                    endDate: phase.reviseEndDate,
                                    note: 'Khách hàng sẽ nộp các bản chỉnh sửa theo nhận xét từ Head Reviewer. Head Reviewer sẽ gửi phản hồi và yêu cầu chỉnh sửa qua từng vòng trong khoảng này.',
                                },
                                {
                                    label: 'Thời gian quyết định trạng thái bài báo chỉnh sửa',
                                    startDate: phase.revisionPaperDecideStatusStart,
                                    endDate: phase.revisionPaperDecideStatusEnd,
                                    note: 'Head Reviewer phải quyết định trạng thái trong khoảng này',
                                },
                            ],
                            '#F59E0B'
                        )}

                        {/* Revision Rounds */}
                        {phase.revisionRoundDeadlines && phase.revisionRoundDeadlines.length > 0 && (
                            <View style={{ marginBottom: 16, paddingLeft: 8 }}>
                                <Text style={{ color: 'white', fontWeight: '500', marginBottom: 12, fontSize: 14 }}>
                                    Các vòng chỉnh sửa chi tiết:
                                </Text>
                                <View style={{ gap: 8 }}>
                                    {Array.from(phase.revisionRoundDeadlines)
                                        .sort((a, b) => (a.roundNumber || 0) - (b.roundNumber || 0))
                                        .map((round, index) => (
                                            <View
                                                key={round.revisionRoundDeadlineId || index}
                                                style={{
                                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                                    borderRadius: 8,
                                                    padding: 12,
                                                    borderLeftWidth: 4,
                                                    borderLeftColor: '#F59E0B',
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                                                        Vòng {round.roundNumber}
                                                    </Text>
                                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontStyle: 'italic' }}>
                                                        Deadline: {formatDate(round.endSubmissionDate)}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                                        {formatDate(round.startSubmissionDate)}
                                                    </Text>
                                                    <Text style={{ color: '#F59E0B', fontWeight: '600' }}>→</Text>
                                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                                        {formatDate(round.endSubmissionDate)}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                </View>
                            </View>
                        )}

                        {/* Camera Ready Section */}
                        {renderPhaseSection(
                            '📹 Bản cuối cùng (Camera Ready)',
                            'videocam',
                            [
                                {
                                    label: 'Thời gian nộp bản camera ready',
                                    startDate: phase.cameraReadyStartDate,
                                    endDate: phase.cameraReadyEndDate,
                                    note: 'Khách hàng phải nộp bản camera-ready trong khoảng thời gian này',
                                },
                                {
                                    label: 'Thời gian quyết định trạng thái camera ready',
                                    startDate: phase.cameraReadyDecideStatusStart,
                                    endDate: phase.cameraReadyDecideStatusEnd,
                                    note: 'Head Reviewer phải quyết định trạng thái trong khoảng này',
                                },
                            ],
                            '#8B5CF6'
                        )}
                    </Surface>
                ))}
            </View>
        );
    };

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Timeline nộp bài báo
            </Text>

            {/* Tabs cho từng phase */}
            {sortedPhases.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 16 }}
                >
                    <View style={{ flexDirection: 'row', gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 4 }}>
                        {sortedPhases.map((phase, index) => (
                            <TouchableOpacity
                                key={phase.researchConferencePhaseId || index}
                                onPress={() => setActivePhaseIndex(index)}
                                style={{
                                    paddingVertical: 10,
                                    paddingHorizontal: 16,
                                    borderRadius: 6,
                                    backgroundColor: activePhaseIndex === index ? '#3B82F6' : 'transparent',
                                }}
                            >
                                <Text
                                    style={{
                                        color: activePhaseIndex === index ? 'white' : 'rgba(255,255,255,0.7)',
                                        textAlign: 'center',
                                        fontWeight: '500',
                                        fontSize: 13,
                                    }}
                                >
                                    Giai đoạn {phase.phaseOrder || index + 1}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* Thông tin chung */}
            <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <Text style={{ color: '#93C5FD', fontSize: 12, lineHeight: 18 }}>
                    Hội nghị có thể có nhiều giai đoạn (phases) để nộp bài báo. Vui lòng tuân thủ các mốc thời gian của từng giai đoạn để đảm bảo bài báo của bạn được xem xét.
                </Text>
            </View>

            {/* Hiển thị content của phase được chọn */}
            {sortedPhases.length > 0 && sortedPhases[activePhaseIndex] ? (
                renderPhaseContent([sortedPhases[activePhaseIndex]])
            ) : (
                <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                        Chưa có thông tin timeline
                    </Text>
                </Surface>
            )}
        </ScrollView>
        // <ScrollView>
        //     <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        //         Timeline nộp bài báo
        //     </Text>

        //     {/* Sub-tabs */}
        //     <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 4 }}>
        //         <TouchableOpacity
        //             onPress={() => setActiveSubTab('main')}
        //             style={{
        //                 flex: 1,
        //                 paddingVertical: 10,
        //                 paddingHorizontal: 12,
        //                 borderRadius: 6,
        //                 backgroundColor: activeSubTab === 'main' ? '#3B82F6' : 'transparent',
        //             }}
        //         >
        //             <Text
        //                 style={{
        //                     color: activeSubTab === 'main' ? 'white' : 'rgba(255,255,255,0.7)',
        //                     textAlign: 'center',
        //                     fontWeight: '500',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Timeline chính
        //             </Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //             onPress={() => setActiveSubTab('waitlist')}
        //             style={{
        //                 flex: 1,
        //                 paddingVertical: 10,
        //                 paddingHorizontal: 12,
        //                 borderRadius: 6,
        //                 backgroundColor: activeSubTab === 'waitlist' ? '#F59E0B' : 'transparent',
        //             }}
        //         >
        //             <Text
        //                 style={{
        //                     color: activeSubTab === 'waitlist' ? 'white' : 'rgba(255,255,255,0.7)',
        //                     textAlign: 'center',
        //                     fontWeight: '500',
        //                     fontSize: 13,
        //                 }}
        //             >
        //                 Timeline Waitlist
        //             </Text>
        //         </TouchableOpacity>
        //     </View>

        //     {/* Main Timeline */}
        //     {activeSubTab === 'main' && (
        //         <View>
        //             <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        //                 <Text style={{ color: '#93C5FD', fontSize: 12, lineHeight: 18 }}>
        //                     <Text style={{ fontWeight: 'bold' }}>Timeline chính:</Text> Đây là lịch trình chuẩn để nộp bài báo và tham gia hội nghị. Vui lòng tuân thủ các mốc thời gian để đảm bảo bài báo của bạn được xem xét.
        //                 </Text>
        //             </View>
        //             {renderPhaseContent(mainPhases)}
        //         </View>
        //     )}

        //     {/* Waitlist Timeline */}
        //     {activeSubTab === 'waitlist' && (
        //         <View>
        //             <View style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
        //                 <Text style={{ color: '#FCD34D', fontSize: 12, lineHeight: 18 }}>
        //                     <Text style={{ fontWeight: 'bold' }}>⚠️ Lưu ý về Waitlist:</Text> Timeline waitlist chỉ được mở khi timeline chính chưa đủ số lượng bài báo cần thiết. Nếu bạn đăng ký tham dự chậm hoặc muốn có cơ hội dự phòng, vui lòng tham gia vào waitlist để chờ đợi. Bài báo trong waitlist sẽ được xem xét nếu có chỗ trống.
        //                 </Text>
        //             </View>
        //             {renderPhaseContent(waitlistPhases)}
        //         </View>
        //     )}
        // </ScrollView>
    );
};

export default ResearchTimelineTab;