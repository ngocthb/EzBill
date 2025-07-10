import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = () => {
    const navigation = useNavigation();

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [isLoading, setIsLoading] = useState(false);

    // References cho các TextInput
    const currentPasswordRef = React.useRef(null);
    const newPasswordRef = React.useRef(null);
    const confirmPasswordRef = React.useRef(null);
    const scrollViewRef = React.useRef(null);

    // Hàm để scroll đến input khi focus
    const scrollToInput = (inputRef) => {
        setTimeout(() => {
            if (inputRef.current && scrollViewRef.current) {
                inputRef.current.measureLayout(
                    scrollViewRef.current,
                    (x, y) => {
                        scrollViewRef.current.scrollTo({
                            y: y - 100,
                            animated: true
                        });
                    }
                );
            }
        }, 100);
    };

    // Hàm kiểm tra độ mạnh mật khẩu
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, text: '', color: '#E5E7EB' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Tính điểm dựa trên các tiêu chí
        score += checks.length ? 20 : 0;
        score += checks.lowercase ? 20 : 0;
        score += checks.uppercase ? 20 : 0;
        score += checks.numbers ? 20 : 0;
        score += checks.special ? 20 : 0;

        if (score <= 20) {
            return { strength: score, text: 'Rất yếu', color: '#EF4444' };
        } else if (score <= 40) {
            return { strength: score, text: 'Yếu', color: '#F97316' };
        } else if (score <= 60) {
            return { strength: score, text: 'Trung bình', color: '#F59E0B' };
        } else if (score <= 80) {
            return { strength: score, text: 'Mạnh', color: '#10B981' };
        } else {
            return { strength: score, text: 'Rất mạnh', color: '#059669' };
        }
    };

    const passwordStrength = getPasswordStrength(passwords.newPassword);

    // Lấy danh sách gợi ý cải thiện mật khẩu
    const getPasswordSuggestions = (password) => {
        const suggestions = [];
        if (password.length < 8) suggestions.push('Ít nhất 8 ký tự');
        if (!/[a-z]/.test(password)) suggestions.push('Chữ cái thường');
        if (!/[A-Z]/.test(password)) suggestions.push('Chữ cái hoa');
        if (!/\d/.test(password)) suggestions.push('Số');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) suggestions.push('Ký tự đặc biệt');
        return suggestions;
    };

    const suggestions = getPasswordSuggestions(passwords.newPassword);

    const handleChangePassword = async () => {
        // Validate inputs
        if (!passwords.currentPassword.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu hiện tại');
            return;
        }

        if (!passwords.newPassword.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu mới');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (passwordStrength.strength < 60) {
            Alert.alert(
                'Mật khẩu yếu',
                'Mật khẩu của bạn còn yếu. Bạn có muốn tiếp tục?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Tiếp tục', onPress: () => submitPasswordChange() }
                ]
            );
            return;
        }

        submitPasswordChange();
    };

    const submitPasswordChange = async () => {
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            Alert.alert(
                'Thành công',
                'Mật khẩu đã được thay đổi thành công!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-default">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 30}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        {/* Background */}
                        <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                            <Image
                                source={bg1}
                                style={{
                                    width: width,
                                    height: height * 0.8,
                                    transform: [{ translateY: -height * 0 }]
                                }}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 bg-bg-default border-b border-gray-100">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="w-10 h-10 items-center justify-center"
                            >
                                <Ionicons name="chevron-back" size={24} color="#374151" />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold text-gray-900">Đổi mật khẩu</Text>
                            <View className="w-10" />
                        </View>

                        <ScrollView
                            ref={scrollViewRef}
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 120 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Security Info */}
                            <View className="mx-6 mt-6 mb-4">
                                <View className="bg-blue-50 rounded-2xl p-4 flex-row items-center">
                                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                        <Ionicons name="shield-checkmark" size={24} color="#3B82F6" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-blue-900 font-semibold mb-1">Bảo mật tài khoản</Text>
                                        <Text className="text-blue-700 text-sm">
                                            Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Change Password Form */}
                            <View className="bg-white mx-6 rounded-2xl p-6" style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 3
                            }}>
                                <Text className="text-lg font-bold text-gray-900 mb-6">Thay đổi mật khẩu
                                </Text>
                                <View className="mb-6">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</Text>
                                    <View className="relative">
                                        <TextInput
                                            ref={currentPasswordRef}
                                            value={passwords.currentPassword}
                                            onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
                                            className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-gray-900"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            secureTextEntry={!showPasswords.current}
                                            returnKeyType="next"
                                            onSubmitEditing={() => newPasswordRef.current?.focus()}
                                            onFocus={() => scrollToInput(currentPasswordRef)}
                                            blurOnSubmit={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => togglePasswordVisibility('current')}
                                            className="absolute right-4 top-3"
                                        >
                                            <Ionicons
                                                name={showPasswords.current ? "eye-off" : "eye"}
                                                size={20}
                                                color="#9CA3AF"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* New Password */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</Text>
                                    <View className="relative">
                                        <TextInput
                                            ref={newPasswordRef}
                                            value={passwords.newPassword}
                                            onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
                                            className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-gray-900"
                                            placeholder="Nhập mật khẩu mới"
                                            secureTextEntry={!showPasswords.new}
                                            returnKeyType="next"
                                            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                            onFocus={() => scrollToInput(newPasswordRef)}
                                            blurOnSubmit={false}
                                        />
                                        <TouchableOpacity
                                            onPress={() => togglePasswordVisibility('new')}
                                            className="absolute right-4 top-3"
                                        >
                                            <Ionicons
                                                name={showPasswords.new ? "eye-off" : "eye"}
                                                size={20}
                                                color="#9CA3AF"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Password Strength Indicator - Nổi bật hơn */}
                                    {passwords.newPassword.length > 0 && (
                                        <View className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <View className="flex-row items-center justify-between mb-3">
                                                <Text className="text-sm font-medium text-gray-700">Độ mạnh mật khẩu:</Text>
                                                <Text
                                                    className="text-sm font-bold"
                                                    style={{ color: passwordStrength.color }}
                                                >
                                                    {passwordStrength.text}
                                                </Text>
                                            </View>

                                            {/* Progress Bar - To và rõ ràng hơn */}
                                            <View className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                                                <View
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${passwordStrength.strength}%`,
                                                        backgroundColor: passwordStrength.color,
                                                        transition: 'width 0.3s ease'
                                                    }}
                                                />
                                            </View>

                                            {/* Progress Percentage */}
                                            <Text className="text-xs text-gray-500 text-center mb-3">
                                                {passwordStrength.strength}% hoàn thiện
                                            </Text>

                                            {/* Suggestions */}
                                            {suggestions.length > 0 && (
                                                <View>
                                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                                        Để tăng độ mạnh, cần thêm:
                                                    </Text>
                                                    <View className="flex-row flex-wrap">
                                                        {suggestions.map((suggestion, index) => (
                                                            <View
                                                                key={index}
                                                                className="bg-orange-100 border border-orange-200 px-3 py-1 rounded-full mr-2 mb-2"
                                                            >
                                                                <Text className="text-xs text-orange-700 font-medium">
                                                                    {suggestion}
                                                                </Text>
                                                            </View>
                                                        ))}
                                                    </View>
                                                </View>
                                            )}

                                            {/* Success message when strong */}
                                            {passwordStrength.strength >= 80 && (
                                                <View className="flex-row items-center mt-2">
                                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                                    <Text className="text-sm text-green-600 font-medium ml-2">
                                                        Mật khẩu rất mạnh!
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>

                                {/* Confirm Password */}
                                <View className="mb-8">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</Text>
                                    <View className="relative">
                                        <TextInput
                                            ref={confirmPasswordRef}
                                            value={passwords.confirmPassword}
                                            onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
                                            className="bg-gray-50 rounded-xl px-4 py-3 pr-12 text-gray-900"
                                            placeholder="Nhập lại mật khẩu mới"
                                            secureTextEntry={!showPasswords.confirm}
                                            returnKeyType="done"
                                            onSubmitEditing={handleChangePassword}
                                            onFocus={() => scrollToInput(confirmPasswordRef)}
                                        />
                                        <TouchableOpacity
                                            onPress={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-4 top-3"
                                        >
                                            <Ionicons
                                                name={showPasswords.confirm ? "eye-off" : "eye"}
                                                size={20}
                                                color="#9CA3AF"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Password Match Indicator */}
                                    {passwords.confirmPassword.length > 0 && (
                                        <View className="mt-3 p-3 rounded-xl" style={{
                                            backgroundColor: passwords.newPassword === passwords.confirmPassword ? '#F0FDF4' : '#FEF2F2'
                                        }}>
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name={passwords.newPassword === passwords.confirmPassword ? "checkmark-circle" : "close-circle"}
                                                    size={18}
                                                    color={passwords.newPassword === passwords.confirmPassword ? "#10B981" : "#EF4444"}
                                                />
                                                <Text
                                                    className="text-sm font-medium ml-2"
                                                    style={{
                                                        color: passwords.newPassword === passwords.confirmPassword ? "#10B981" : "#EF4444"
                                                    }}
                                                >
                                                    {passwords.newPassword === passwords.confirmPassword
                                                        ? "Mật khẩu khớp ✓"
                                                        : "Mật khẩu không khớp ✗"
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    onPress={handleChangePassword}
                                    disabled={isLoading}
                                    className={`rounded-xl py-3 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                                >
                                    {isLoading ? (
                                        <View className="flex-row items-center justify-center">
                                            <Text className="text-white font-semibold mr-2">Đang xử lý...</Text>
                                        </View>
                                    ) : (
                                        <Text className="text-white text-center font-semibold text-base">
                                            Đổi mật khẩu
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Password Tips */}
                            <View className="bg-white mx-6 mt-6 rounded-2xl p-6" style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 3
                            }}>
                                <Text className="text-lg font-bold text-gray-900 mb-4">Mẹo tạo mật khẩu mạnh</Text>

                                <View className="space-y-3">
                                    {[
                                        { icon: "checkmark-circle", text: "Sử dụng ít nhất 8 ký tự", color: "#10B981" },
                                        { icon: "checkmark-circle", text: "Kết hợp chữ hoa, chữ thường", color: "#10B981" },
                                        { icon: "checkmark-circle", text: "Bao gồm số và ký tự đặc biệt", color: "#10B981" },
                                        { icon: "close-circle", text: "Không sử dụng thông tin cá nhân", color: "#EF4444" },
                                        { icon: "close-circle", text: "Tránh mật khẩu phổ biến", color: "#EF4444" }
                                    ].map((tip, index) => (
                                        <View key={index} className="flex-row items-center">
                                            <Ionicons name={tip.icon} size={16} color={tip.color} />
                                            <Text className="text-gray-700 ml-3 flex-1">{tip.text}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;
