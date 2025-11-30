import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface } from 'react-native-paper';
import {
    ResearchConferenceDetailResponse,
    TechnicalConferenceDetailResponse,
} from '@/types/conference.type';

interface InformationTabProps {
    conference:
    | TechnicalConferenceDetailResponse
    | ResearchConferenceDetailResponse;
    isResearch: boolean;
    formatDate: (dateString?: string) => string;
    setSelectedImage: (image: string | null) => void;
}

const InformationTab: React.FC<InformationTabProps> = ({
    conference,
    isResearch,
    formatDate,
    setSelectedImage,
}) => {
    const mediaList = conference.conferenceMedia || [];
    const sponsorsList = conference.sponsors || [];

    const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                {label}
            </Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                {value || 'Chưa xác định'}
            </Text>
        </View>
    );

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Thông tin chi tiết
            </Text>

            {/* Basic Conference Information */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                    Thông tin cơ bản
                </Text>
                <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16 }}>
                    <InfoRow label="Tên hội nghị:" value={conference.conferenceName} />

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                            Mô tả:
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>
                            {conference.description || 'Chưa có mô tả'}
                        </Text>
                    </View>

                    <InfoRow
                        label="Ngày diễn ra:"
                        value={conference.startDate ? formatDate(conference.startDate) : undefined}
                    />
                    <InfoRow
                        label="Ngày kết thúc:"
                        value={conference.endDate ? formatDate(conference.endDate) : undefined}
                    />
                    <InfoRow label="Tổng số người tham dự tối đa:" value={conference.totalSlot} />
                    <InfoRow label="Số lượng chỗ còn lại:" value={conference.availableSlot} />
                    <InfoRow label="Địa chỉ:" value={conference.address} />
                    <InfoRow
                        label="Ngày tạo hội nghị:"
                        value={conference.createdAt ? formatDate(conference.createdAt) : undefined}
                    />
                    <InfoRow
                        label={isResearch ? "Ngày mở đăng ký tham dự (dành cho thính giả):" : "Ngày bắt đầu bán vé:"}
                        value={conference.ticketSaleStart ? formatDate(conference.ticketSaleStart) : undefined}
                    />
                    <InfoRow
                        label={isResearch ? "Ngày kết thúc thời hạn đăng ký tham dự (dành cho thính giả):" : "Ngày kết thúc bán vé:"}
                        value={conference.ticketSaleEnd ? formatDate(conference.ticketSaleEnd) : undefined}
                    />

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                            Hội nghị được tổ chức bởi nội bộ Confradar?
                        </Text>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                            {conference.isInternalHosted !== undefined
                                ? conference.isInternalHosted
                                    ? 'Có, đây là hội nghị được tổ chức bởi Confradar'
                                    : 'Không, đây là hội thảo được tổ chức bởi đối tác liên kết với Confradar'
                                : 'Chưa xác định'}
                        </Text>
                    </View>

                    <InfoRow
                        label="Loại:"
                        value={conference.isResearchConference !== undefined
                            ? conference.isResearchConference
                                ? 'Hội Nghị Nghiên cứu'
                                : 'Hội Thảo Công nghệ'
                            : undefined}
                    />
                </Surface>
            </View>

            {/* Research Conference Details */}
            {isResearch && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                        Thông tin chi tiết về hội nghị nghiên cứu
                    </Text>

                    <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontStyle: 'italic', lineHeight: 18 }}>
                            💡 <Text style={{ fontWeight: 'bold' }}>Lưu ý:</Text> Khi nộp bài báo (với tư cách tác giả), bạn sẽ thanh toán toàn bộ phí đăng ký ngay tại thời điểm nộp. Nếu bài báo bị từ chối, hệ thống sẽ hoàn lại <Text style={{ fontWeight: 'bold' }}>số tiền đã thanh toán, nhưng đã trừ đi khoản phí đánh giá bài báo</Text> tương ứng với hội nghị này.
                        </Text>
                    </View>

                    <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16 }}>
                        <InfoRow
                            label="Định dạng bài báo chấp nhận:"
                            value={(conference as ResearchConferenceDetailResponse).paperFormat}
                        />
                        <InfoRow
                            label="Số lượng bài báo tối đa chấp nhận:"
                            value={(conference as ResearchConferenceDetailResponse).numberPaperAccept}
                        />
                        <InfoRow
                            label="Số vòng chỉnh sửa tối đa:"
                            value={(conference as ResearchConferenceDetailResponse).revisionAttemptAllowed}
                        />

                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                                Cho phép thính giả tham dự?
                            </Text>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                                {(conference as ResearchConferenceDetailResponse).allowListener !== undefined
                                    ? (conference as ResearchConferenceDetailResponse).allowListener
                                        ? 'Có'
                                        : 'Không'
                                    : 'Chưa xác định'}
                            </Text>
                        </View>

                        <InfoRow
                            label="Giá trị xếp hạng:"
                            value={(conference as ResearchConferenceDetailResponse).rankValue}
                        />
                        <InfoRow
                            label="Năm xếp hạng:"
                            value={(conference as ResearchConferenceDetailResponse).rankYear}
                        />

                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                                Phí review bài báo
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontStyle: 'italic', marginBottom: 4 }}>
                                (Khoản phí này đã được tính gộp vào phí đăng ký tham dự nếu bạn đăng ký với tư cách <Text style={{ fontWeight: 'bold' }}>tác giả</Text>)
                            </Text>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                                {(conference as ResearchConferenceDetailResponse).reviewFee !== undefined
                                    ? `${(conference as ResearchConferenceDetailResponse).reviewFee?.toLocaleString('vi-VN')}₫`
                                    : 'Phí đánh giá bài báo chưa xác định'}
                            </Text>
                        </View>

                        <InfoRow
                            label="Ranking Category Name:"
                            value={(conference as ResearchConferenceDetailResponse).rankingCategoryName}
                        />

                        <View style={{ marginBottom: 0 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                                Ranking Description:
                            </Text>
                            <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>
                                {(conference as ResearchConferenceDetailResponse).rankingDescription || 'Chưa có mô tả về xếp hạng'}
                            </Text>
                        </View>
                    </Surface>
                </View>
            )}

            {/* Technical Conference Details */}
            {!isResearch && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                        Thông tin chi tiết về hội thảo
                    </Text>
                    <Surface style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 16 }}>
                        <View style={{ marginBottom: 0 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>
                                Đối tượng hội thảo muốn hướng tới:
                            </Text>
                            <Text style={{ color: 'white', fontSize: 14, lineHeight: 20 }}>
                                {(conference as TechnicalConferenceDetailResponse).targetAudience || 'Chưa có thông tin về đối tượng mục tiêu'}
                            </Text>
                        </View>
                    </Surface>
                </View>
            )}

            {/* Media Section */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                    Hình ảnh về hội nghị
                </Text>
                {mediaList.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {mediaList.map((media) => (
                            <TouchableOpacity
                                key={media.mediaId}
                                onPress={() => setSelectedImage(media.mediaUrl || '')}
                                style={{ width: '48%', aspectRatio: 16 / 9 }}
                            >
                                <Surface style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    height: '100%'
                                }}>
                                    <Image
                                        source={{ uri: media.mediaUrl || '/images/customer_route/confbannerbg2.jpg' }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    />
                                </Surface>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                            Chưa có hình ảnh hoặc media cho hội nghị này
                        </Text>
                    </Surface>
                )}
            </View>

            {/* Sponsors */}
            <View style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                    Nhà tài trợ
                </Text>
                {sponsorsList.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {sponsorsList.map((sponsor) => (
                            <Surface
                                key={sponsor.sponsorId}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 8,
                                    padding: 12,
                                    width: '30%',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ width: 48, height: 48, marginBottom: 8 }}>
                                    <Image
                                        source={{ uri: sponsor.imageUrl || '/images/LandingPage/logo_sponser/tech_logo/logo_microsoft.png' }}
                                        style={{ width: '100%', height: '100%' }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>
                                    {sponsor.name || 'Tên nhà tài trợ chưa xác định'}
                                </Text>
                            </Surface>
                        ))}
                    </View>
                ) : (
                    <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                            Chưa có thông tin về nhà tài trợ
                        </Text>
                    </Surface>
                )}
            </View>
        </ScrollView>
    );
};

export default InformationTab;