import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import bg1 from '../../assets/images/bg1.png';
import { formatCurrencyWithOptions } from '../utils/formatUtils';

const { width, height } = Dimensions.get('window');

const AnalyticsScreen = () => {
    const navigation = useNavigation();
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [stats, setStats] = useState({
        totalSpent: 12450000,
        totalGroups: 8,
        totalTransactions: 45,
        averagePerGroup: 1556250,
        topCategory: 'Ăn uống',
        savingsGoal: 75,
        monthlyGrowth: 12.5,
        balance: 2450000
    });

    const [monthlyData] = useState([
        { month: 'T1', amount: 2800000, groups: 3, growth: 5.2 },
        { month: 'T2', amount: 3200000, groups: 4, growth: 14.3 },
        { month: 'T3', amount: 2100000, groups: 2, growth: -34.4 },
        { month: 'T4', amount: 4350000, groups: 6, growth: 107.1 },
        { month: 'T5', amount: 1950000, groups: 3, growth: -55.2 },
        { month: 'T6', amount: 3450000, groups: 5, growth: 76.9 }
    ]);

    const [categoryData] = useState([
        { name: 'Ăn uống', amount: 5200000, percentage: 42, color: '#10B981', icon: 'restaurant' },
        { name: 'Di chuyển', amount: 2800000, percentage: 23, color: '#3B82F6', icon: 'car' },
        { name: 'Giải trí', amount: 2150000, percentage: 17, color: '#F59E0B', icon: 'game-controller' },
        { name: 'Mua sắm', amount: 1500000, percentage: 12, color: '#EF4444', icon: 'bag' },
        { name: 'Khác', amount: 800000, percentage: 6, color: '#8B5CF6', icon: 'ellipsis-horizontal' }
    ]);

    const [recentActivity] = useState([
        {
            group: 'Đà Lạt Trip 2024',
            amount: 450000,
            type: 'expense',
            date: '2 ngày trước',
            category: 'Ăn uống',
            avatar: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0ff2e?w=50&h=50&fit=crop'
        },
        {
            group: 'Team Building Q4',
            amount: 320000,
            type: 'income',
            date: '5 ngày trước',
            category: 'Giải trí',
            avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=50&h=50&fit=crop'
        },
        {
            group: 'Hội bạn thân',
            amount: 180000,
            type: 'expense',
            date: '1 tuần trước',
            category: 'Ăn uống',
            avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=50&h=50&fit=crop'
        }
    ]);

    const formatCurrency = (amount) => {
        return formatCurrencyWithOptions(amount, {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).replace('₫', 'đ̲');
    };

    const getMaxAmount = () => {
        return Math.max(...monthlyData.map(item => item.amount));
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Background */}
            <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        opacity: 0.03,
                        transform: [{ translateY: -height * 0.1 }]
                    }}
                    resizeMode="cover"
                />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Enhanced Header */}
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-6 pt-4 pb-8"
                    style={{
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32
                    }}
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-white">Thống kê chi tiêu</Text>
                            <Text className="text-white/80 text-sm mt-1">Tháng 7, 2025</Text>
                        </View>
                        <TouchableOpacity className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center">
                            <Ionicons name="options-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Period Selector */}
                    <View className="flex-row bg-white/15 backdrop-blur-sm rounded-2xl p-1">
                        {[
                            { key: 'week', label: 'Tuần', icon: 'calendar' },
                            { key: 'month', label: 'Tháng', icon: 'calendar-outline' },
                            { key: 'year', label: 'Năm', icon: 'calendar-clear' }
                        ].map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                className={`flex-1 py-3 px-4 rounded-xl flex-row items-center justify-center ${selectedPeriod === period.key ? 'bg-white shadow-lg' : ''
                                    }`}
                                onPress={() => setSelectedPeriod(period.key)}
                            >
                                <Ionicons
                                    name={period.icon}
                                    size={16}
                                    color={selectedPeriod === period.key ? '#667eea' : 'white'}
                                    style={{ marginRight: 6 }}
                                />
                                <Text className={`font-semibold ${selectedPeriod === period.key ? 'text-indigo-600' : 'text-white'
                                    }`}>
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </LinearGradient>

                {/* Main Balance Card */}
                <View className="px-6 -mt-6 mb-6">
                    <View
                        className="bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#667eea',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.15,
                            shadowRadius: 24,
                            elevation: 8
                        }}
                    >
                        <View className="items-center mb-6">
                            <Text className="text-gray-500 text-sm font-medium mb-2">Tổng chi tiêu tháng này</Text>
                            <Text className="text-4xl font-bold text-gray-900 mb-2">
                                {formatCurrency(stats.totalSpent)}
                            </Text>
                            <View className="flex-row items-center">
                                <View className="flex-row items-center bg-green-100 px-3 py-1 rounded-full">
                                    <Ionicons name="trending-up" size={14} color="#10B981" />
                                    <Text className="text-green-600 text-sm font-bold ml-1">
                                        +{stats.monthlyGrowth}%
                                    </Text>
                                </View>
                                <Text className="text-gray-400 text-sm ml-2">so với tháng trước</Text>
                            </View>
                        </View>

                        <View className="flex-row space-x-4">
                            <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-2">
                                        <Ionicons name="people" size={16} color="white" />
                                    </View>
                                    <Text className="text-blue-600 text-sm font-medium">Nhóm</Text>
                                </View>
                                <Text className="text-blue-900 text-2xl font-bold">{stats.totalGroups}</Text>
                            </View>

                            <View className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 bg-amber-500 rounded-full items-center justify-center mr-2">
                                        <Ionicons name="receipt" size={16} color="white" />
                                    </View>
                                    <Text className="text-amber-600 text-sm font-medium">Giao dịch</Text>
                                </View>
                                <Text className="text-amber-900 text-2xl font-bold">{stats.totalTransactions}</Text>
                            </View>

                            <View className="flex-1 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 bg-emerald-500 rounded-full items-center justify-center mr-2">
                                        <Ionicons name="calculator" size={16} color="white" />
                                    </View>
                                    <Text className="text-emerald-600 text-sm font-medium">TB/nhóm</Text>
                                </View>
                                <Text className="text-emerald-900 text-lg font-bold">
                                    {Math.round(stats.averagePerGroup / 1000)}K
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={20} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold text-gray-900">Thống kê</Text>
                        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/80 items-center justify-center">
                            <Ionicons name="calendar-outline" size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Period Selector */}
                    <View className="flex-row bg-white rounded-2xl p-1 shadow-sm">
                        {[
                            { key: 'week', label: 'Tuần' },
                            { key: 'month', label: 'Tháng' },
                            { key: 'year', label: 'Năm' }
                        ].map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                className={`flex-1 py-3 rounded-xl ${selectedPeriod === period.key ? 'bg-blue-500' : ''
                                    }`}
                                onPress={() => setSelectedPeriod(period.key)}
                            >
                                <Text className={`text-center font-medium ${selectedPeriod === period.key ? 'text-white' : 'text-gray-600'
                                    }`}>
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Overview Cards */}
                <View className="px-6 mb-8">
                    <View className="flex-row space-x-4 mb-4">
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            className="flex-1 rounded-2xl p-5"
                            style={{
                                shadowColor: '#10B981',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 6
                            }}
                        >
                            <View className="flex-row items-center mb-2">
                                <Ionicons name="trending-up" size={24} color="white" />
                                <Text className="text-white/80 text-sm ml-2">Tổng chi tiêu</Text>
                            </View>
                            <Text className="text-white text-2xl font-bold">
                                {formatCurrency(stats.totalSpent)}
                            </Text>
                            <Text className="text-white/70 text-xs mt-1">
                                +12% so với tháng trước
                            </Text>
                        </LinearGradient>

                        <View className="flex-1 space-y-4">
                            <View className="bg-white rounded-2xl p-4 shadow-sm">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="people" size={20} color="#3B82F6" />
                                    <Text className="text-gray-600 text-sm ml-2">Nhóm</Text>
                                </View>
                                <Text className="text-gray-900 text-xl font-bold">{stats.totalGroups}</Text>
                            </View>

                            <View className="bg-white rounded-2xl p-4 shadow-sm">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="receipt" size={20} color="#F59E0B" />
                                    <Text className="text-gray-600 text-sm ml-2">Giao dịch</Text>
                                </View>
                                <Text className="text-gray-900 text-xl font-bold">{stats.totalTransactions}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Average per group */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="calculator" size={20} color="#8B5CF6" />
                                </View>
                                <View>
                                    <Text className="text-gray-600 text-sm">Trung bình mỗi nhóm</Text>
                                    <Text className="text-gray-900 text-lg font-bold">
                                        {formatCurrency(stats.averagePerGroup)}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-green-600 text-sm font-medium">↗ 8.5%</Text>
                                <Text className="text-gray-400 text-xs">so với trước</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Enhanced Monthly Chart */}
                <View className="px-6 mb-8">
                    <View
                        className="bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-xl font-bold text-gray-900">Biểu đồ chi tiêu</Text>
                                <Text className="text-gray-500 text-sm mt-1">6 tháng gần nhất</Text>
                            </View>
                            <TouchableOpacity className="bg-gray-100 rounded-full p-2">
                                <Ionicons name="bar-chart" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-end justify-between h-48 mb-4">
                            {monthlyData.map((item, index) => {
                                const height = (item.amount / getMaxAmount()) * 160;
                                const isPositiveGrowth = item.growth > 0;
                                return (
                                    <View key={index} className="items-center flex-1">
                                        <View className="mb-3 items-center">
                                            <Text className="text-xs text-gray-600 font-medium mb-1">
                                                {Math.round(item.amount / 1000000)}M
                                            </Text>
                                            <View className={`px-2 py-1 rounded-full ${isPositiveGrowth ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <Text className={`text-xs font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {isPositiveGrowth ? '+' : ''}{item.growth.toFixed(1)}%
                                                </Text>
                                            </View>
                                        </View>
                                        <LinearGradient
                                            colors={isPositiveGrowth ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                                            style={{ height: height, width: 32 }}
                                            className="rounded-t-xl"
                                        />
                                        <Text className="text-sm text-gray-700 font-medium mt-3">{item.month}</Text>
                                        <Text className="text-xs text-gray-400 mt-1">{item.groups} nhóm</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Enhanced Category Breakdown */}
                <View className="px-6 mb-8">
                    <View
                        className="bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-xl font-bold text-gray-900">Chi tiêu theo danh mục</Text>
                                <Text className="text-gray-500 text-sm mt-1">Tổng: {formatCurrency(stats.totalSpent)}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-indigo-600 font-semibold">Chi tiết</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-5">
                            {categoryData.map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="active:scale-95 transition-transform"
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row items-center">
                                        <LinearGradient
                                            colors={[category.color, category.color + '80']}
                                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                        >
                                            <Ionicons name={category.icon} size={22} color="white" />
                                        </LinearGradient>
                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-2">
                                                <Text className="text-gray-900 font-semibold text-base">{category.name}</Text>
                                                <View className="items-end">
                                                    <Text className="text-gray-900 font-bold text-base">
                                                        {formatCurrency(category.amount)}
                                                    </Text>
                                                    <Text className="text-gray-500 text-sm">
                                                        {category.percentage}% tổng
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="bg-gray-200 rounded-full h-3">
                                                <LinearGradient
                                                    colors={[category.color, category.color + '80']}
                                                    style={{
                                                        width: `${category.percentage}%`,
                                                        height: 12,
                                                        borderRadius: 6
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Enhanced Recent Activity */}
                <View className="px-6 mb-8">
                    <View
                        className="bg-white rounded-3xl p-6"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 16,
                            elevation: 6
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-xl font-bold text-gray-900">Hoạt động gần đây</Text>
                                <Text className="text-gray-500 text-sm mt-1">3 giao dịch mới nhất</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-indigo-600 font-semibold">Tất cả</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="active:scale-95 transition-transform"
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row items-center p-4 bg-gray-50 rounded-2xl">
                                        <Image
                                            source={{ uri: activity.avatar }}
                                            className="w-12 h-12 rounded-2xl mr-4"
                                        />
                                        <View className="flex-1">
                                            <Text className="text-gray-900 font-semibold text-base mb-1">
                                                {activity.group}
                                            </Text>
                                            <View className="flex-row items-center">
                                                <View className={`px-2 py-1 rounded-full mr-2 ${activity.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                                                    }`}>
                                                    <Text className={`text-xs font-medium ${activity.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                                        }`}>
                                                        {activity.category}
                                                    </Text>
                                                </View>
                                                <Text className="text-gray-400 text-sm">• {activity.date}</Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className={`font-bold text-lg ${activity.type === 'expense' ? 'text-red-500' : 'text-green-500'
                                                }`}>
                                                {activity.type === 'expense' ? '-' : '+'}{formatCurrency(activity.amount)}
                                            </Text>
                                            <View className={`w-6 h-6 rounded-full items-center justify-center mt-1 ${activity.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                                                }`}>
                                                <Ionicons
                                                    name={activity.type === 'expense' ? 'arrow-down' : 'arrow-up'}
                                                    size={14}
                                                    color={activity.type === 'expense' ? '#EF4444' : '#10B981'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Enhanced Savings Goal */}
                <View className="px-6 mb-8">
                    <LinearGradient
                        colors={['#8B5CF6', '#A855F7']}
                        className="rounded-3xl p-6"
                        style={{
                            shadowColor: '#8B5CF6',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.25,
                            shadowRadius: 24,
                            elevation: 10
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-1">
                                <Text className="text-white text-xl font-bold mb-1">Mục tiêu tiết kiệm</Text>
                                <Text className="text-white/80 text-sm">Tiết kiệm 3,000,000đ̲ trong tháng này</Text>
                            </View>
                            <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
                                <Text className="text-white text-2xl font-bold">{stats.savingsGoal}%</Text>
                                <Text className="text-white/80 text-xs mt-1">hoàn thành</Text>
                            </View>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-white/80 text-sm">Đã tiết kiệm</Text>
                                <Text className="text-white font-semibold">2,250,000đ̲ / 3,000,000đ̲</Text>
                            </View>
                            <View className="bg-white/20 rounded-full h-4">
                                <LinearGradient
                                    colors={['#FFFFFF', '#F8FAFC']}
                                    style={{ width: `${stats.savingsGoal}%`, height: 16, borderRadius: 8 }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity className="bg-white/20 backdrop-blur-sm rounded-2xl py-4 px-6">
                            <View className="flex-row items-center justify-center">
                                <Ionicons name="target" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text className="text-white font-semibold text-base">Cập nhật mục tiêu</Text>
                            </View>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AnalyticsScreen;
