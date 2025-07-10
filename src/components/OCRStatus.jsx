import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OCRStatus = ({ status, confidence }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'processing':
                return {
                    icon: 'eye',
                    color: '#8B5CF6',
                    message: 'Đang nhận diện văn bản...',
                    description: 'AI đang phân tích hóa đơn'
                };
            case 'parsing':
                return {
                    icon: 'analytics',
                    color: '#F59E0B',
                    message: 'Đang phân tích dữ liệu...',
                    description: 'Trích xuất thông tin từ văn bản'
                };
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    color: '#10B981',
                    message: 'Nhận diện thành công!',
                    description: `Độ chính xác: ${confidence}%`
                };
            case 'error':
                return {
                    icon: 'alert-circle',
                    color: '#EF4444',
                    message: 'Không thể nhận diện',
                    description: 'Vui lòng thử lại với ảnh rõ hơn'
                };
            default:
                return {
                    icon: 'scan',
                    color: '#6B7280',
                    message: 'Sẵn sàng quét',
                    description: 'Chọn ảnh hoặc chụp hóa đơn'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <View className="flex-row items-center bg-white/90 px-4 py-3 rounded-xl">
            <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${statusInfo.color}20` }}
            >
                <Ionicons name={statusInfo.icon} size={18} color={statusInfo.color} />
            </View>
            <View className="flex-1">
                <Text className="font-semibold text-gray-800">{statusInfo.message}</Text>
                <Text className="text-sm text-gray-600">{statusInfo.description}</Text>
            </View>
        </View>
    );
};

export default OCRStatus;
