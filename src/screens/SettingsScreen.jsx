import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    Alert,
    Switch,
    ActivityIndicator,
    StatusBar,
    TouchableWithoutFeedback,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
const { width, height } = Dimensions.get('window');

const SettingsScreen = () => {
    const navigation = useNavigation();

    // State cho form
    const [profileData, setProfileData] = useState({
        fullName: 'NgocTHB',
        email: 'ngocthb@example.com',
        phone: '+84 123 456 789',
        bio: 'Yêu thích quản lý chi tiêu và chia sẻ với bạn bè'
    });

    // State cho settings
    const [settings, setSettings] = useState({
        notifications: true,
        emailUpdates: false,
        darkMode: false,
        biometric: true,
        language: 'vi' // 'vi' cho tiếng việt, 'en' cho tiếng anh
    });

    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const languageOptions = [
        { value: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
        { value: 'en', label: 'English', shortLabel: 'EN' }
    ];

    const handleSaveProfile = () => {
        Alert.alert(
            'Thành công',
            'Thông tin profile đã được cập nhật!',
            [{ text: 'OK' }]
        );
    };

    const handleChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Xóa tài khoản',
            'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => console.log('Delete account') }
            ]
        );
    };

    return (
        <View className="flex-1 bg-bg-default">
            <StatusBar backgroundColor="#667eea" barStyle="light-content" />

            {/* Background */}
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

                style={{
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    paddingTop: 50,
                    paddingBottom: 20,
                    paddingHorizontal: 20,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-white">Cài đặt</Text>
                        <Text className="text-white/80 text-sm mt-1">Quản lý tài khoản</Text>
                    </View>
                    <View className="w-12" />
                </View>
            </LinearGradient>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 24 }}
                nestedScrollEnabled={true}
            >
                {/* Profile Section */}
                <View className="bg-white rounded-2xl p-6 mb-4" style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5
                }}>
                    <Text className="text-lg font-bold text-gray-900 mb-6">Thông tin cá nhân</Text>

                    {/* Avatar */}
                    <View className="items-center mb-8">
                        <TouchableOpacity className="relative">
                            <Image
                                source={{
                                    uri: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1msOP5?w=0&h=0&q=60&m=6&f=jpg&u=t',
                                }}
                                className="w-28 h-28 rounded-full"
                                style={{
                                    borderWidth: 4,
                                    borderColor: '#F3F4F6'
                                }}
                            />
                            <View className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: '#667eea',
                                    shadowColor: '#667eea',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 4,
                                    elevation: 4
                                }}
                            >
                                <Ionicons name="camera" size={18} color="white" />
                            </View>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-500 mt-3 font-medium">Nhấn để thay đổi ảnh đại diện</Text>
                    </View>

                    {/* Form Fields */}
                    <View className="space-y-5">
                        {/* Full Name */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Họ và tên</Text>
                            <TextInput
                                value={profileData.fullName}
                                onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
                                className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 text-base"
                                placeholder="Nhập họ và tên"
                                placeholderTextColor="#9CA3AF"
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6'
                                }}
                            />
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Email</Text>
                            <TextInput
                                value={profileData.email}
                                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                                className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 text-base"
                                placeholder="Nhập email"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6'
                                }}
                            />
                        </View>

                        {/* Phone */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Số điện thoại</Text>
                            <TextInput
                                value={profileData.phone}
                                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                                className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 text-base"
                                placeholder="Nhập số điện thoại"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6'
                                }}
                            />
                        </View>

                        {/* Bio */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 mb-3">Giới thiệu</Text>
                            <TextInput
                                value={profileData.bio}
                                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                                className="bg-gray-50 rounded-xl px-4 py-4 text-gray-900 text-base"
                                placeholder="Viết vài dòng về bản thân..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6',
                                    minHeight: 80
                                }}
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSaveProfile}
                        className="mt-6 rounded-xl overflow-hidden"
                        style={{
                            shadowColor: '#667eea',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 6
                        }}
                    >
                        <LinearGradient
                            colors={['#764ba2', '#667eea']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 8
                            }}
                        >
                            <Text className="text-white text-center font-semibold text-base">
                                Lưu thay đổi
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* App Settings */}
                <View className="bg-white rounded-2xl p-6 mb-4" style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5
                }}>
                    <Text className="text-lg font-bold text-gray-900 mb-6">Cài đặt ứng dụng</Text>

                    {/* Settings Items */}
                    <View className="space-y-1">
                        {/* Notifications */}
                        <View className="flex-row items-center justify-between py-4 px-2 rounded-xl">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center mr-4">
                                    <Ionicons name="notifications-outline" size={22} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold text-base">Thông báo</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Nhận thông báo từ ứng dụng</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.notifications}
                                onValueChange={(value) => setSettings({ ...settings, notifications: value })}
                                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                                thumbColor={settings.notifications ? '#FFFFFF' : '#F3F4F6'}
                                ios_backgroundColor="#E5E7EB"
                            />
                        </View>

                        {/* Email Updates */}
                        <View className="flex-row items-center justify-between py-4 px-2 rounded-xl">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center mr-4">
                                    <Ionicons name="mail-outline" size={22} color="#10B981" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold text-base">Email cập nhật</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Nhận email về tính năng mới</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.emailUpdates}
                                onValueChange={(value) => setSettings({ ...settings, emailUpdates: value })}
                                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                                thumbColor={settings.emailUpdates ? '#FFFFFF' : '#F3F4F6'}
                                ios_backgroundColor="#E5E7EB"
                            />
                        </View>

                        {/* Biometric */}
                        <View className="flex-row items-center justify-between py-4 px-2 rounded-xl">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-xl bg-purple-100 items-center justify-center mr-4">
                                    <Ionicons name="finger-print-outline" size={22} color="#8B5CF6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold text-base">Xác thực sinh trắc học</Text>
                                    <Text className="text-gray-500 text-sm mt-1">Sử dụng vân tay hoặc Face ID</Text>
                                </View>
                            </View>
                            <Switch
                                value={settings.biometric}
                                onValueChange={(value) => setSettings({ ...settings, biometric: value })}
                                trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                                thumbColor={settings.biometric ? '#FFFFFF' : '#F3F4F6'}
                                ios_backgroundColor="#E5E7EB"
                            />
                        </View>

                        {/* Language */}
                        <View className="flex-row items-center justify-between py-4 px-2 rounded-xl">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 rounded-xl bg-indigo-100 items-center justify-center mr-4">
                                    <Ionicons name="language-outline" size={22} color="#6366F1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold text-base">Ngôn ngữ</Text>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        {languageOptions.find(opt => opt.value === settings.language)?.label}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowLanguageDropdown(true)}
                                className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
                            >
                                <Text className="text-gray-700 font-medium mr-2">
                                    {languageOptions.find(opt => opt.value === settings.language)?.shortLabel}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Security Section */}
                <View className="bg-white rounded-2xl p-6 mb-4" style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 5
                }}>
                    <Text className="text-lg font-bold text-gray-900 mb-6">Bảo mật</Text>

                    {/* Change Password */}
                    <TouchableOpacity
                        onPress={handleChangePassword}
                        className="flex-row items-center py-4 px-2 rounded-xl active:bg-gray-50"
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F4F6'
                        }}
                    >
                        <View className="w-12 h-12 rounded-xl bg-orange-100 items-center justify-center mr-4">
                            <Ionicons name="key-outline" size={22} color="#F59E0B" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold text-base">Đổi mật khẩu</Text>
                            <Text className="text-gray-500 text-sm mt-1">Cập nhật mật khẩu bảo mật</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Privacy Policy */}
                    <TouchableOpacity
                        className="flex-row items-center py-4 px-2 rounded-xl active:bg-gray-50"
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: '#F3F4F6'
                        }}
                    >
                        <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center mr-4">
                            <Ionicons name="shield-outline" size={22} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold text-base">Chính sách bảo mật</Text>
                            <Text className="text-gray-500 text-sm mt-1">Xem chính sách của chúng tôi</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Terms of Service */}
                    <TouchableOpacity className="flex-row items-center py-4 px-2 rounded-xl active:bg-gray-50">
                        <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-4">
                            <Ionicons name="document-text-outline" size={22} color="#6B7280" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold text-base">Điều khoản sử dụng</Text>
                            <Text className="text-gray-500 text-sm mt-1">Các quy định và điều khoản</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View className="bg-white rounded-2xl p-6 border border-red-200" style={{
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 5
                }}>
                    <View className="flex-row items-center mb-6">
                        <Ionicons name="warning-outline" size={22} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text className="text-lg font-bold text-red-600">Vùng nguy hiểm</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        className="flex-row items-center py-4 px-2 rounded-xl bg-red-50/50 active:bg-red-100/50"
                    >
                        <View className="w-12 h-12 rounded-xl bg-red-100 items-center justify-center mr-4">
                            <Ionicons name="trash-outline" size={22} color="#EF4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-red-600 font-semibold text-base">Xóa tài khoản</Text>
                            <Text className="text-red-400 text-sm mt-1">Xóa vĩnh viễn tài khoản và dữ liệu</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Language Selection Modal */}
            <Modal
                visible={showLanguageDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLanguageDropdown(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowLanguageDropdown(false)}>
                    <View className="flex-1 bg-black/50 justify-center items-center">
                        <TouchableWithoutFeedback>
                            <View className="bg-white rounded-2xl mx-8 p-6 min-w-[250px]" style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.25,
                                shadowRadius: 20,
                                elevation: 15
                            }}>
                                <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
                                    Chọn ngôn ngữ
                                </Text>

                                {languageOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => {
                                            setSettings({ ...settings, language: option.value });
                                            setShowLanguageDropdown(false);
                                        }}
                                        className={`flex-row items-center justify-between py-4 px-4 rounded-xl ${settings.language === option.value ? 'bg-indigo-50' : 'bg-gray-50'
                                            } ${index < languageOptions.length - 1 ? 'mb-2' : ''}`}
                                    >
                                        <View className="flex-row items-center flex-1">
                                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${settings.language === option.value ? 'bg-indigo-100' : 'bg-gray-200'
                                                }`}>
                                                <Text className={`font-bold ${settings.language === option.value ? 'text-indigo-600' : 'text-gray-600'
                                                    }`}>
                                                    {option.shortLabel}
                                                </Text>
                                            </View>
                                            <Text className={`font-medium text-base ${settings.language === option.value ? 'text-indigo-600' : 'text-gray-700'
                                                }`}>
                                                {option.label}
                                            </Text>
                                        </View>
                                        {settings.language === option.value && (
                                            <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                                        )}
                                    </TouchableOpacity>
                                ))}

                                <TouchableOpacity
                                    onPress={() => setShowLanguageDropdown(false)}
                                    className="mt-4 bg-gray-100 py-3 rounded-xl"
                                >
                                    <Text className="text-center text-gray-600 font-medium">
                                        Hủy
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default SettingsScreen;
