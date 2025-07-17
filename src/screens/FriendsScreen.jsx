import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    TextInput,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import { formatCurrencyWithOptions } from '../utils/formatUtils';

const { width, height } = Dimensions.get('window');

const FriendsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');

    const [friendsList] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'vana@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            status: 'online',
            totalDebt: 250000,
            totalCredit: 150000,
            mutualGroups: 3,
            lastActive: '2 phút trước'
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'thib@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
            status: 'offline',
            totalDebt: 0,
            totalCredit: 320000,
            mutualGroups: 2,
            lastActive: '1 giờ trước'
        },
        {
            id: 3,
            name: 'Lê Minh C',
            email: 'minhc@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            status: 'online',
            totalDebt: 180000,
            totalCredit: 0,
            mutualGroups: 1,
            lastActive: 'Đang hoạt động'
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            email: 'thid@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            status: 'online',
            totalDebt: 75000,
            totalCredit: 200000,
            mutualGroups: 4,
            lastActive: 'Đang hoạt động'
        }
    ]);

    const [pendingRequests] = useState([
        {
            id: 1,
            name: 'Hoàng Văn E',
            email: 'hoange@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            mutualFriends: 2,
            requestDate: '2 ngày trước'
        },
        {
            id: 2,
            name: 'Võ Thị F',
            email: 'thif@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            mutualFriends: 1,
            requestDate: '1 tuần trước'
        }
    ]);

    const [suggestedFriends] = useState([
        {
            id: 1,
            name: 'Đỗ Văn G',
            email: 'vang@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            mutualFriends: 3,
            reason: 'Bạn chung với Nguyễn Văn A'
        },
        {
            id: 2,
            name: 'Ngô Thị H',
            email: 'thih@gmail.com',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
            mutualFriends: 1,
            reason: 'Cùng trường đại học'
        }
    ]);

    const formatCurrency = (amount) => {
        return formatCurrencyWithOptions(amount, {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).replace('₫', 'đ̲');
    };

    const getFilteredFriends = () => {
        if (!searchQuery) return friendsList;
        return friendsList.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            friend.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const renderFriendItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-4 active:scale-95"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3
            }}
            activeOpacity={0.8}
        >
            <View className="flex-row items-center">
                <View className="relative">
                    <Image
                        source={{ uri: item.avatar }}
                        className="w-16 h-16 rounded-2xl"
                    />
                    <View className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${item.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                </View>
                <View className="flex-1 ml-4">
                    <Text className="text-gray-900 font-bold text-base mb-1">{item.name}</Text>
                    <Text className="text-gray-500 text-sm mb-2">{item.email}</Text>
                    <Text className="text-gray-400 text-xs">{item.lastActive} • {item.mutualGroups} nhóm chung</Text>
                </View>
                <View className="items-end">
                    {item.totalDebt > 0 && (
                        <View className="bg-red-50 px-3 py-1 rounded-full mb-1">
                            <Text className="text-red-600 text-xs font-bold">
                                Nợ {formatCurrency(item.totalDebt)}
                            </Text>
                        </View>
                    )}
                    {item.totalCredit > 0 && (
                        <View className="bg-green-50 px-3 py-1 rounded-full mb-1">
                            <Text className="text-green-600 text-xs font-bold">
                                Được trả {formatCurrency(item.totalCredit)}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity className="mt-1">
                        <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderPendingRequest = ({ item }) => (
        <View
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3
            }}
        >
            <View className="flex-row items-center">
                <Image
                    source={{ uri: item.avatar }}
                    className="w-14 h-14 rounded-2xl"
                />
                <View className="flex-1 ml-4">
                    <Text className="text-gray-900 font-bold text-base mb-1">{item.name}</Text>
                    <Text className="text-gray-500 text-sm mb-1">{item.email}</Text>
                    <Text className="text-gray-400 text-xs">
                        {item.mutualFriends} bạn chung • {item.requestDate}
                    </Text>
                </View>
                <View className="flex-row space-x-2">
                    <TouchableOpacity className="bg-green-500 rounded-full w-10 h-10 items-center justify-center">
                        <Ionicons name="checkmark" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-200 rounded-full w-10 h-10 items-center justify-center">
                        <Ionicons name="close" size={18} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderSuggestedFriend = ({ item }) => (
        <View
            className="bg-white rounded-2xl p-4 mb-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3
            }}
        >
            <View className="flex-row items-center">
                <Image
                    source={{ uri: item.avatar }}
                    className="w-14 h-14 rounded-2xl"
                />
                <View className="flex-1 ml-4">
                    <Text className="text-gray-900 font-bold text-base mb-1">{item.name}</Text>
                    <Text className="text-gray-500 text-sm mb-1">{item.email}</Text>
                    <Text className="text-gray-400 text-xs">{item.reason}</Text>
                </View>
                <TouchableOpacity className="bg-blue-500 rounded-2xl px-4 py-2">
                    <Text className="text-white font-medium text-sm">Kết bạn</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-bg-default">
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
                className="px-6 pt-4 pb-6"
                style={{
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30
                }}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-white">Bạn bè</Text>
                        <Text className="text-white/80 text-sm mt-1">{friendsList.length} người bạn</Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
                        <Ionicons name="person-add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 flex-row items-center">
                    <Ionicons name="search" size={20} color="white" />
                    <TextInput
                        className="flex-1 ml-3 text-white placeholder:text-white/70"
                        placeholder="Tìm kiếm bạn bè..."
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

            {/* Tab Selector */}
            <View className="px-6 py-4">
                <View className="flex-row bg-white rounded-2xl p-1 shadow-sm">
                    {[
                        { key: 'friends', label: 'Bạn bè', count: friendsList.length },
                        { key: 'requests', label: 'Lời mời', count: pendingRequests.length },
                        { key: 'suggestions', label: 'Gợi ý', count: suggestedFriends.length }
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            className={`flex-1 py-3 px-4 rounded-xl ${activeTab === tab.key ? 'bg-blue-500' : ''
                                }`}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <View className="flex-row items-center justify-center">
                                <Text className={`font-semibold ${activeTab === tab.key ? 'text-white' : 'text-gray-600'
                                    }`}>
                                    {tab.label}
                                </Text>
                                {tab.count > 0 && (
                                    <View className={`ml-2 px-2 py-1 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                                        }`}>
                                        <Text className={`text-xs font-bold ${activeTab === tab.key ? 'text-white' : 'text-gray-600'
                                            }`}>
                                            {tab.count}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 px-6">
                {activeTab === 'friends' && (
                    <FlatList
                        data={getFilteredFriends()}
                        renderItem={renderFriendItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center py-12">
                                <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                                <Text className="text-gray-500 text-lg font-medium mt-4">
                                    {searchQuery ? 'Không tìm thấy bạn bè' : 'Chưa có bạn bè nào'}
                                </Text>
                                <Text className="text-gray-400 text-sm mt-2 text-center">
                                    {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm bạn bè để bắt đầu chia bill cùng nhau'}
                                </Text>
                            </View>
                        }
                    />
                )}

                {activeTab === 'requests' && (
                    <FlatList
                        data={pendingRequests}
                        renderItem={renderPendingRequest}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center py-12">
                                <Ionicons name="mail-outline" size={64} color="#D1D5DB" />
                                <Text className="text-gray-500 text-lg font-medium mt-4">Không có lời mời nào</Text>
                                <Text className="text-gray-400 text-sm mt-2 text-center">
                                    Chưa có ai gửi lời mời kết bạn cho bạn
                                </Text>
                            </View>
                        }
                    />
                )}

                {activeTab === 'suggestions' && (
                    <FlatList
                        data={suggestedFriends}
                        renderItem={renderSuggestedFriend}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center py-12">
                                <Ionicons name="bulb-outline" size={64} color="#D1D5DB" />
                                <Text className="text-gray-500 text-lg font-medium mt-4">Không có gợi ý</Text>
                                <Text className="text-gray-400 text-sm mt-2 text-center">
                                    Hiện tại chưa có gợi ý kết bạn nào cho bạn
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center"
                style={{
                    shadowColor: '#667eea',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 8
                }}
            >
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    className="w-16 h-16 rounded-full items-center justify-center"
                >
                    <Ionicons name="person-add" size={28} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FriendsScreen;
