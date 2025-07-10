import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
    Linking,
    Alert,
    Image,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
const { width, height } = Dimensions.get('window');

const HelpCenterScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    // Dữ liệu câu hỏi thường gặp
    const faqData = [
        {
            id: 1,
            question: 'Làm thế nào để tạo nhóm mới?',
            answer: 'Để tạo nhóm mới:\n1. Vào màn hình chính, nhấn nút "Tạo nhóm"\n2. Nhập tên nhóm và thông tin cần thiết\n3. Thêm thành viên vào nhóm\n4. Nhấn "Tạo nhóm" để hoàn tất'
        },
        {
            id: 2,
            question: 'Cách chia bill trong nhóm?',
            answer: 'Để chia bill:\n1. Mở nhóm bạn muốn chia bill\n2. Nhấn "Thêm chi tiêu" hoặc nút "+" \n3. Nhập tên chi tiêu và số tiền\n4. Chọn người trả và người tham gia\n5. Lưu lại để tự động tính toán'
        },
        {
            id: 3,
            question: 'Làm sao để thanh toán nợ?',
            answer: 'Để thanh toán nợ:\n1. Vào tab "Nợ" để xem danh sách nợ\n2. Chọn khoản nợ cần thanh toán\n3. Nhấn "Thanh toán"\n4. Xác nhận thông tin và hoàn tất'
        },
        {
            id: 4,
            question: 'Tại sao số tiền tính toán không chính xác?',
            answer: 'Số tiền có thể không chính xác do:\n• Nhập sai số tiền chi tiêu\n• Thiếu thông tin người tham gia\n• Lỗi làm tròn số\n• Có thay đổi thành viên sau khi tạo bill\nHãy kiểm tra lại thông tin các khoản chi tiêu.'
        },
        {
            id: 5,
            question: 'Có thể sử dụng nhiều loại tiền tệ không?',
            answer: 'Có, ứng dụng hỗ trợ quy đổi tiền tệ:\n1. Khi tạo nhóm, bật tính năng "Quy đổi tiền tệ"\n2. Chọn tiền tệ gốc và tiền tệ đích\n3. Hệ thống sẽ tự động quy đổi theo tỷ giá hiện tại'
        },
        {
            id: 6,
            question: 'Cách mời thêm thành viên vào nhóm?',
            answer: 'Để mời thêm thành viên:\n1. Vào nhóm cần thêm thành viên\n2. Nhấn biểu tượng "+" hoặc "Thêm thành viên"\n3. Chọn từ danh sách bạn bè hoặc nhập thông tin\n4. Gửi lời mời và chờ xác nhận'
        },
        {
            id: 7,
            question: 'Dữ liệu có được đồng bộ giữa các thiết bị không?',
            answer: 'Có, dữ liệu được đồng bộ tự động khi:\n• Bạn đăng nhập cùng tài khoản\n• Thiết bị có kết nối internet\n• Ứng dụng được cập nhật phiên bản mới nhất'
        },
        {
            id: 8,
            question: 'Làm thế nào để xuất báo cáo chi tiêu?',
            answer: 'Để xuất báo cáo:\n1. Vào nhóm cần xuất báo cáo\n2. Nhấn menu "..." ở góc phải\n3. Chọn "Xuất báo cáo"\n4. Chọn định dạng (PDF/Excel) và gửi'
        }
    ];

    // Dữ liệu danh mục hỗ trợ
    const supportCategories = [
        {
            id: 1,
            title: 'Hướng dẫn sử dụng',
            icon: 'book-outline',
            color: '#6C63FF',
            description: 'Tìm hiểu cách sử dụng các tính năng'
        },
        {
            id: 2,
            title: 'Báo lỗi',
            icon: 'bug-outline',
            color: '#EF4444',
            description: 'Báo cáo lỗi hoặc sự cố gặp phải'
        },
        {
            id: 3,
            title: 'Góp ý tính năng',
            icon: 'bulb-outline',
            color: '#F59E0B',
            description: 'Đề xuất tính năng mới cho ứng dụng'
        },
        {
            id: 4,
            title: 'Liên hệ hỗ trợ',
            icon: 'headset-outline',
            color: '#10B981',
            description: 'Liên hệ trực tiếp với đội hỗ trợ'
        }
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const handleSupportCategory = (category) => {
        switch (category.id) {
            case 1:
                Alert.alert(
                    'Hướng dẫn sử dụng',
                    'Tính năng này sẽ được cập nhật trong phiên bản tiếp theo',
                    [{ text: 'OK' }]
                );
                break;
            case 2:
                Alert.alert(
                    'Báo lỗi',
                    'Bạn có muốn gửi email báo lỗi?',
                    [
                        { text: 'Hủy', style: 'cancel' },
                        {
                            text: 'Gửi email',
                            onPress: () => Linking.openURL('mailto:support@sharebill.com?subject=Báo lỗi ứng dụng')
                        }
                    ]
                );
                break;
            case 3:
                Alert.alert(
                    'Góp ý tính năng',
                    'Bạn có muốn gửi email góp ý?',
                    [
                        { text: 'Hủy', style: 'cancel' },
                        {
                            text: 'Gửi email',
                            onPress: () => Linking.openURL('mailto:feedback@sharebill.com?subject=Góp ý tính năng mới')
                        }
                    ]
                );
                break;
            case 4:
                Alert.alert(
                    'Liên hệ hỗ trợ',
                    'Chọn cách liên hệ:',
                    [
                        { text: 'Hủy', style: 'cancel' },
                        {
                            text: 'Email',
                            onPress: () => Linking.openURL('mailto:support@sharebill.com?subject=Yêu cầu hỗ trợ')
                        },
                        {
                            text: 'Hotline',
                            onPress: () => Linking.openURL('tel:1900123456')
                        }
                    ]
                );
                break;
        }
    };

    const filteredFAQ = faqData.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar backgroundColor="#667eea" barStyle="light-content" />

            <View
                className='absolute bottom-0 left-0 right-0'
                style={{ zIndex: 0 }}
            >
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        transform: [{ translateY: -height * 0 }]
                    }}
                    resizeMode='cover'
                />
            </View>

            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-6 pt-4 pb-6"
                style={{
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30
                }}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-white">Trung tâm trợ giúp</Text>
                        <Text className="text-white/80 text-sm mt-1">Hỗ trợ 24/7</Text>
                    </View>
                    <View className="w-12" />
                </View>

                {/* Search Bar */}
                <View className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex-row items-center">
                    <Ionicons name="search" size={20} color="white" />
                    <TextInput
                        className="flex-1 ml-3 text-white"
                        placeholder="Tìm kiếm câu hỏi..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 24 }}
            >
                {/* Support Categories */}
                <View className="pt-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Danh mục hỗ trợ
                    </Text>
                    <View className="flex-row flex-wrap gap-3 mb-8">
                        {supportCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                onPress={() => handleSupportCategory(category)}
                                className="flex-1 min-w-[48%] bg-white rounded-2xl p-4 mb-2"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 12,
                                    elevation: 5
                                }}
                            >
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                                    style={{ backgroundColor: `${category.color}20` }}
                                >
                                    <Ionicons
                                        name={category.icon}
                                        size={24}
                                        color={category.color}
                                    />
                                </View>
                                <Text className="font-semibold text-gray-900 mb-1">
                                    {category.title}
                                </Text>
                                <Text className="text-sm text-gray-600" numberOfLines={2}>
                                    {category.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                <View className="pb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Câu hỏi thường gặp
                    </Text>

                    {filteredFAQ.length === 0 ? (
                        <View className="bg-white rounded-2xl p-6 items-center">
                            <Ionicons name="search" size={48} color="#D1D5DB" />
                            <Text className="text-gray-500 text-center mt-4">
                                Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchQuery}"
                            </Text>
                        </View>
                    ) : (
                        <View>
                            {filteredFAQ.map((item) => (
                                <View
                                    key={item.id}
                                    className="bg-white rounded-2xl overflow-hidden"
                                    style={{
                                        marginBottom: 16,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 12,
                                        elevation: 5
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => toggleFAQ(item.id)}
                                        className="flex-row items-center justify-between p-4"
                                    >
                                        <Text className="flex-1 font-medium text-gray-900 mr-4">
                                            {item.question}
                                        </Text>
                                        <Ionicons
                                            name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#6C63FF"
                                        />
                                    </TouchableOpacity>

                                    {expandedFAQ === item.id && (
                                        <View className="px-4 pb-4 border-t border-gray-100">
                                            <Text className="text-gray-700 leading-6 mt-3">
                                                {item.answer}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Contact Section */}
                <View className="pb-8">
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: 16,
                            padding: 24,
                            shadowColor: '#667eea',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 12,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                                <Ionicons name="chatbubbles" size={24} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg">
                                    Cần thêm hỗ trợ?
                                </Text>
                                <Text className="text-white/80 text-sm">
                                    Liên hệ với đội ngũ hỗ trợ 24/7
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => Linking.openURL('mailto:support@sharebill.com')}
                                className="flex-1 bg-white/20 rounded-xl py-3 px-4 flex-row items-center justify-center"
                            >
                                <Ionicons name="mail" size={18} color="white" />
                                <Text className="text-white font-medium ml-2">Email</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => Linking.openURL('tel:1900123456')}
                                className="flex-1 bg-white/20 rounded-xl py-3 px-4 flex-row items-center justify-center"
                            >
                                <Ionicons name="call" size={18} color="white" />
                                <Text className="text-white font-medium ml-2">Hotline</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                {/* App Info */}
                <View className="pb-12">
                    <View className="bg-white rounded-2xl p-6" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 12,
                        elevation: 5
                    }}>
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            Thông tin ứng dụng
                        </Text>
                        <View className="space-y-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Phiên bản</Text>
                                <Text className="text-gray-900 font-medium">1.0.0</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Cập nhật lần cuối</Text>
                                <Text className="text-gray-900 font-medium">07/01/2025</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Hỗ trợ</Text>
                                <Text className="text-gray-900 font-medium">24/7</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HelpCenterScreen;
