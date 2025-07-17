import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Animated,
    Dimensions,
    TextInput,
    Image, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axiosClient from '../apis/axiosClient';
import { formatCurrency } from '../utils/formatUtils';
import bg1 from '../../assets/images/bg1.png';


const { width, height } = Dimensions.get('window');

const AnimatedCard = ({ children, delay = 0 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            {children}
        </Animated.View>
    );
};

const AllGroupsScreen = () => {
    const navigation = useNavigation();
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        try {
            const response = await axiosClient.get("profile");
            if (response.status === 200) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi tải dữ liệu',
                text2: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
            });
        }
        return null;
    };

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const userData = await fetchUserData();

            if (userData) {
                const groupRes = await axiosClient.get(`account/${userData.accountId}`);
                if (groupRes.status === 200) {
                    const sortedGroups = groupRes.data.sort((a, b) => {
                        return new Date(b.startDate) - new Date(a.startDate);
                    });
                    setGroups(sortedGroups);
                    setFilteredGroups(sortedGroups);
                }
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi tải dữ liệu',
                text2: 'Không thể tải danh sách nhóm. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGroups();
        setRefreshing(false);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredGroups(groups);
        } else {
            const filtered = groups.filter(group =>
                group.tripName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredGroups(filtered);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleGroupPress = (group) => {
        navigation.navigate('Summary', { tripId: group.tripId });
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const renderGroupCard = (group, index) => (
        <AnimatedCard key={index} delay={index * 100}>
            <TouchableOpacity
                className="bg-white rounded-2xl p-5 mb-4 mx-4"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                }}
                onPress={() => handleGroupPress(group)}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                        <LinearGradient
                            colors={['#4f46e5', '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 16
                            }}
                        >
                            <Ionicons name="people" size={24} color="white" />
                        </LinearGradient>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-bold text-lg mb-1">
                                {group.tripName}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                                {group.members.length} thành viên
                            </Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>

                <View className="border-t border-gray-100 pt-3">
                    <View className="flex-row justify-between items-center mb-2">
                        <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                            <Text className="text-gray-600 text-sm ml-2">
                                {formatDate(group.startDate)} - {formatDate(group.endDate)}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="wallet-outline" size={16} color="#6B7280" />
                            <View className="bg-green-100 rounded-lg px-2 py-1 ml-2">
                                <Text className="text-green-700 text-sm">
                                    {formatCurrency(group.budget)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="flex-row -space-x-2 mr-3">
                            {group.members.slice(0, 3).map((member, memberIndex) => (
                                <View
                                    key={memberIndex}
                                    className="w-8 h-8 bg-blue-200 rounded-full items-center justify-center border-2 border-white"
                                >
                                    <Text className="text-blue-700 font-semibold text-xs">
                                        {member.email.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                            {group.members.length > 3 && (
                                <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center border-2 border-white">
                                    <Text className="text-gray-700 font-semibold text-xs">
                                        +{group.members.length - 3}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-gray-500 text-xs flex-1">
                            {group.members.map(m => m.email.split('@')[0]).join(', ')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </AnimatedCard>
    );

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center px-6 py-20">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-800 text-xl font-bold mb-2">
                {searchQuery ? 'Không tìm thấy nhóm' : 'Chưa có nhóm nào'}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
                {searchQuery
                    ? 'Thử tìm kiếm với từ khóa khác'
                    : 'Tạo nhóm đầu tiên để bắt đầu chia sẻ chi phí cùng bạn bè'
                }
            </Text>
            {!searchQuery && (
                <TouchableOpacity
                    className="bg-blue-600 px-6 py-3 rounded-full"
                    onPress={() => navigation.navigate('CreateGroup')}
                >
                    <Text className="text-white font-semibold">Tạo nhóm mới</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Background */}
            <StatusBar backgroundColor="#667eea" barStyle="light-content" />
            <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        opacity: 0.05,
                        transform: [{ translateY: -height * 0.1 }]
                    }}
                    resizeMode="cover"
                />
            </View>

            {/* Header */}
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}

                style={{
                    paddingHorizontal: 16,
                    paddingBottom: 30,
                    paddingTop: 20,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30
                }}
            >
                <View className="flex-row items-center justify-between mb-6 mt-10">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Tất cả nhóm</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white/20 rounded-2xl flex-row items-center px-3 py-1">
                    <Ionicons name="search" size={20} color="white" />
                    <TextInput
                        className="flex-1 ml-3 py-2 text-white placeholder-white/70"
                        placeholder="Tìm kiếm nhóm..."
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        onFocus={() => console.log('Search bar focused')}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            {/* Stats */}
            <View className="px-6 mt-4 mb-4">
                <View className="bg-white rounded-2xl p-4 flex-row justify-between items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4
                    }}
                >
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-blue-600">
                            {filteredGroups.length}
                        </Text>
                        <Text className="text-gray-600 text-sm">Tổng nhóm</Text>
                    </View>
                    <View className="w-px h-10 bg-gray-200" />
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600">
                            {filteredGroups.filter(g => g.members.length > 1).length}
                        </Text>
                        <Text className="text-gray-600 text-sm">Có thành viên</Text>
                    </View>
                    <View className="w-px h-10 bg-gray-200" />
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-purple-600">
                            {filteredGroups.filter(g => g.budget).length}
                        </Text>
                        <Text className="text-gray-600 text-sm">Có ngân sách</Text>
                    </View>
                </View>
            </View>

            {/* Groups List */}
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text className="text-gray-500 mt-2">Đang tải...</Text>
                    </View>
                ) : filteredGroups.length > 0 ? (
                    <View className="pb-6">
                        {filteredGroups.map((group, index) => renderGroupCard(group, index))}
                    </View>
                ) : (
                    renderEmptyState()
                )}
            </ScrollView>
        </View>
    );
};

export default AllGroupsScreen;
