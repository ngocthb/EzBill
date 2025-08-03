import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AIChatPopup = ({ visible, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [message, setMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    // Sử dụng Animated.Value cho position
    const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height * 0.6 })).current;

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý AI của EzBill. Tôi có thể giúp bạn phân tích chi tiêu, tạo nhóm, hoặc trả lời câu hỏi về app.',
            isUser: false,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                isUser: true,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, newMessage]);
            setMessage('');

            // Simulate AI response
            setTimeout(() => {
                const aiResponse = getAIResponse(message.trim());
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: aiResponse,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1000);
        }
    };

    const getAIResponse = (userMessage) => {
        const responses = {
            'chi tiêu': 'Dựa trên dữ liệu của bạn, tôi thấy bạn chi tiêu nhiều nhất cho ăn uống (42%). Bạn có muốn tôi đưa ra gợi ý tiết kiệm không?',
            'nhóm': 'Bạn hiện có 8 nhóm hoạt động. Nhóm "Đà Lạt Trip 2024" có hoạt động gần đây nhất. Bạn cần tạo nhóm mới hay quản lý nhóm hiện tại?',
            'tiết kiệm': 'Bạn đang đạt 75% mục tiêu tiết kiệm tháng này! Còn 750,000đ nữa là hoàn thành. Tôi gợi ý giảm chi tiêu giải trí 20% để đạt mục tiêu.',
            'phân tích': 'Chi tiêu tháng này tăng 12.5% so với tháng trước. Nguyên nhân chính là tăng chi phí ăn uống và di chuyển. Bạn muốn xem báo cáo chi tiết không?'
        };

        for (const [key, response] of Object.entries(responses)) {
            if (userMessage.toLowerCase().includes(key)) {
                return response;
            }
        }

        return 'Tôi hiểu bạn cần hỗ trợ. Bạn có thể hỏi tôi về: chi tiêu, nhóm, tiết kiệm, phân tích dữ liệu, hoặc cách sử dụng các tính năng trong app.';
    };

    // PanResponder cho việc kéo thả
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsDragging(true);
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                setIsDragging(false);
                pan.flattenOffset();

                // Đưa button về biên màn hình gần nhất
                const currentX = pan.x._value;
                const targetX = currentX > width / 2 ? width - 80 : 16;

                Animated.spring(pan.x, {
                    toValue: targetX,
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <>
            {/* Floating Chat Button - Always visible */}
            {!isExpanded && (
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            zIndex: 1000,
                        },
                        {
                            transform: [
                                { translateX: pan.x },
                                { translateY: pan.y }
                            ]
                        }
                    ]}
                    {...panResponder.panHandlers}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        onPress={() => !isDragging && setIsExpanded(true)}
                        className="w-16 h-16"
                        disabled={isDragging}
                    >
                        <LinearGradient
                            colors={isDragging ? ['#8B5CF6', '#A855F7'] : ['#667eea', '#764ba2']}
                            style={{
                                shadowColor: isDragging ? '#8B5CF6' : '#667eea',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                                transform: [{ scale: isDragging ? 1.1 : 1 }],
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons
                                name={isDragging ? "move" : "logo-octocat"}
                                size={28}
                                color="white"
                            />
                        </LinearGradient>

                        {/* Notification dot */}
                        <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">AI</Text>
                        </View>

                        {/* Close button */}
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 rounded-full items-center justify-center"
                            style={{ zIndex: 1001 }}
                        >
                            <Ionicons name="close" size={12} color="white" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Expanded Chat Window - Only use Modal when expanded */}
            {isExpanded && (
                <Modal
                    visible={isExpanded}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setIsExpanded(false)}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <TouchableOpacity
                            className="flex-1"
                            onPress={() => setIsExpanded(false)}
                            activeOpacity={1}
                        />

                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            className="bg-white rounded-t-3xl"
                            style={{ height: height * 0.65 }}
                        >
                            {/* Chat Header */}
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={{ padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                                            <Ionicons name="logo-octocat" size={20} color="white" />
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold text-lg">EzBill AI</Text>
                                            <View className="flex-row items-center">
                                                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                                <Text className="text-white/80 text-sm">Đang hoạt động</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-2">
                                        <TouchableOpacity
                                            onPress={() => setIsExpanded(false)}
                                            className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
                                        >
                                            <Ionicons name="remove" size={16} color="white" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setIsExpanded(false)}
                                            className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
                                        >
                                            <Ionicons name="close" size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </LinearGradient>

                            {/* Messages */}
                            <ScrollView className="flex-1 px-4 py-4" style={{ maxHeight: height * 0.35 }}>
                                {messages.map((msg) => (
                                    <View
                                        key={msg.id}
                                        className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}
                                    >
                                        <View
                                            className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.isUser
                                                ? 'bg-indigo-500'
                                                : 'bg-gray-100'
                                                }`}
                                        >
                                            <Text
                                                className={`text-base ${msg.isUser ? 'text-white' : 'text-gray-800'
                                                    }`}
                                            >
                                                {msg.text}
                                            </Text>
                                        </View>
                                        <Text className="text-gray-400 text-xs mt-1">
                                            {msg.timestamp}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Quick Actions */}
                            <View className="px-4 py-2">
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row space-x-2">
                                        {[
                                            { text: 'Phân tích chi tiêu', icon: 'analytics' },
                                            { text: 'Gợi ý tiết kiệm', icon: 'bulb' },
                                            { text: 'Tạo nhóm mới', icon: 'people' },
                                            { text: 'Báo cáo tháng', icon: 'document-text' }
                                        ].map((action, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => setMessage(action.text)}
                                                className="bg-gray-100 px-3 py-2 rounded-full flex-row items-center"
                                            >
                                                <Ionicons name={action.icon} size={14} color="#6B7280" />
                                                <Text className="text-gray-600 text-sm ml-1">{action.text}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Input */}
                            <View className="px-4 py-4 border-t border-gray-100">
                                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-2">
                                    <TextInput
                                        value={message}
                                        onChangeText={setMessage}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 text-base py-2"
                                        multiline
                                        maxLength={500}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSendMessage}
                                        disabled={!message.trim()}
                                        className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${message.trim() ? 'bg-indigo-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <Ionicons
                                            name="send"
                                            size={18}
                                            color={message.trim() ? 'white' : '#9CA3AF'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
            )}
        </>
    );
};

export default AIChatPopup;
