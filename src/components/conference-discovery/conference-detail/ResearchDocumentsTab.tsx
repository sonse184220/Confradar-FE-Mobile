import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Surface } from 'react-native-paper';
import { ResearchConferenceDetailResponse } from '@/types/conference.type';

interface ResearchDocumentsTabProps {
    conference: ResearchConferenceDetailResponse;
}

const ResearchDocumentsTab: React.FC<ResearchDocumentsTabProps> = ({ conference }) => {
    const hasContent =
        (conference?.rankingFileUrls && conference.rankingFileUrls.length > 0) ||
        (conference?.materialDownloads && conference.materialDownloads.length > 0) ||
        (conference?.rankingReferenceUrls && conference.rankingReferenceUrls.length > 0);

    if (!hasContent) {
        return (
            <Surface style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 24 }}>
                <Icon name="insert-drive-file" size={48} color="rgba(255,255,255,0.5)" style={{ alignSelf: 'center', marginBottom: 12 }} />
                <Text style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                    Chưa có tài liệu nào được tải lên
                </Text>
            </Surface>
        );
    }

    return (
        <ScrollView>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
                Tài liệu & Hướng dẫn
            </Text>

            {/* Author Note */}
            <View style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 1,
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16
            }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Icon name="info" size={20} color="#60A5FA" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            📝 Hướng dẫn dành cho tác giả (Paper Submission)
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 18, marginBottom: 12 }}>
                            Nếu bạn muốn tham dự hội nghị với vai trò <Text style={{ fontWeight: 'bold' }}>tác giả</Text> và gửi bài báo khoa học, vui lòng tham khảo các tài liệu bên dưới. Đây là <Text style={{ fontWeight: 'bold' }}>tài liệu hướng dẫn nộp paper</Text>.
                        </Text>
                        <View style={{ gap: 4 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                • Hướng dẫn format bài báo (format guideline)
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                • Quy trình nộp và review paper
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                • Tiêu chí đánh giá và chấm điểm
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
                                • Template mẫu
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Material Downloads Section */}
            {conference.materialDownloads && conference.materialDownloads.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Icon name="file-download" size={20} color="#10B981" />
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                            Tài liệu hướng dẫn nộp bài báo
                        </Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
                        Tải xuống các tài liệu sau để biết cách thức nộp bài báo, định dạng yêu cầu và quy trình đánh giá:
                    </Text>
                    <View style={{ gap: 12 }}>
                        {conference.materialDownloads.map((material) => (
                            <Surface
                                key={material.materialDownloadId}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            >
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <View style={{ width: 48, height: 48, backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="file-download" size={24} color="#10B981" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 15, marginBottom: 4 }}>
                                            {material.fileName || 'Tài liệu hướng dẫn'}
                                        </Text>
                                        {material.fileDescription && (
                                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8, lineHeight: 16 }}>
                                                {material.fileDescription}
                                            </Text>
                                        )}
                                        {material.fileUrl && (
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(material.fileUrl || '')}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 8,
                                                    borderRadius: 8,
                                                    alignSelf: 'flex-start',
                                                }}
                                            >
                                                <Icon name="file-download" size={14} color="#10B981" />
                                                <Text style={{ color: '#10B981', fontSize: 12, fontWeight: '500' }}>
                                                    Tải xuống tài liệu
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </Surface>
                        ))}
                    </View>
                </View>
            )}

            {/* Ranking Documents Section */}
            {conference.rankingFileUrls && conference.rankingFileUrls.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Icon name="description" size={20} color="#3B82F6" />
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                            Tài liệu minh chứng xếp hạng hội nghị
                        </Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
                        Đây là các tài liệu chính thức nhằm chứng minh hội nghị đạt các chỉ số như{' '}
                        <Text style={{ fontWeight: 'bold' }}>CORE rank, Impact Factor (IF), H-index, Scopus…</Text>
                    </Text>
                    <View style={{ gap: 12 }}>
                        {conference.rankingFileUrls.map((file, index) => (
                            <Surface
                                key={file.rankingFileUrlId}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            >
                                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                    <View style={{ width: 40, height: 40, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="description" size={20} color="#3B82F6" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: 'white', fontWeight: '500', marginBottom: 4, fontSize: 14 }}>
                                            Tài liệu minh chứng {index + 1}
                                        </Text>
                                        {file.fileUrl && (
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(file.fileUrl || '')}
                                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                            >
                                                <Icon name="open-in-new" size={14} color="#60A5FA" />
                                                <Text style={{ color: '#60A5FA', fontSize: 12, fontWeight: '500' }}>
                                                    Xem tài liệu
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </Surface>
                        ))}
                    </View>
                </View>
            )}

            {/* Ranking Verification Links */}
            {conference.rankingReferenceUrls && conference.rankingReferenceUrls.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Icon name="link" size={20} color="#8B5CF6" />
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                            Liên kết xác thực xếp hạng hội nghị
                        </Text>
                    </View>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
                        Đây là các đường dẫn chính thức dùng để xác minh hội nghị thuộc các bảng xếp hạng uy tín như{' '}
                        <Text style={{ fontWeight: 'bold' }}>CORE, Scopus, SJR, Q-index, Impact Factor,...</Text>. Các link này có chức năng{' '}
                        <Text style={{ fontWeight: 'bold' }}>chứng minh tính học thuật & mức độ uy tín</Text> của hội nghị.
                    </Text>
                    <View style={{ gap: 8 }}>
                        {conference.rankingReferenceUrls.map((reference, index) => (
                            <Surface
                                key={reference.referenceUrlId}
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            >
                                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                    <View style={{ width: 32, height: 32, backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="link" size={16} color="#8B5CF6" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500', marginBottom: 2 }}>
                                            Link xác thực {index + 1}
                                        </Text>
                                        {reference.referenceUrl && (
                                            <TouchableOpacity onPress={() => Linking.openURL(reference.referenceUrl || '')}>
                                                <Text style={{ color: '#A78BFA', fontSize: 11 }} numberOfLines={1}>
                                                    {reference.referenceUrl}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </Surface>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

export default ResearchDocumentsTab;