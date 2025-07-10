import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import bg1 from '../../assets/images/bg1.png';
import summary1 from '../../assets/images/summary1.png';

const ShareBill = () => {
    const navigation = useNavigation();

    // Mock data - 2 người trả tiền, 3 người nợ
    const payerList = [
        { name: 'Nguyễn Văn A', avatar: bg1, amount: '740,000đ̲' },
        { name: 'Trần Minh B', avatar: bg1, amount: '500,000đ̲' }
    ];

    const debtList = [
        { debtor: { name: 'Trần Thị C', avatar: bg1 }, creditor: { name: 'Nguyễn Văn A', avatar: bg1 }, amount: '310,000đ̲' },
        { debtor: { name: 'Lê Văn D', avatar: bg1 }, creditor: { name: 'Trần Minh B', avatar: bg1 }, amount: '250,000đ̲' },
        { debtor: { name: 'Phạm Thị E', avatar: bg1 }, creditor: { name: 'Nguyễn Văn A', avatar: bg1 }, amount: '180,000đ̲' }
    ];

    const handleCreateReminder = () => {
        console.log('Create Reminder');
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

            <LinearGradient
                colors={['#6C63FF', '#8B5CF6', '#A855F7']}
                className="absolute inset-0"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView className="flex-1 pt-12 px-5">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm items-center justify-center"
                    >
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text className="text-xl font-bold text-white">Kết quả chia tiền</Text>

                    </View>
                    <View className="w-12" />
                </View>

                {/* Main Content Card */}
                <View className="flex-1 mb-12 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/15">
                    {/* Header Section */}
                    <View className="items-center py-8 px-6 bg-gradient-to-b from-purple-50 to-white border-b border-gray-100">
                        <View className="relative mb-4">
                            <View className="w-30 h-30 rounded-full items-center justify-center mt-4">
                                <Image source={summary1} className="w-28 h-28" />
                            </View>

                        </View>
                        <Text className="text-2xl font-bold text-gray-800 mb-2">Hoàn thành!</Text>
                        <Text className="text-base text-gray-600">Đã chia tiền thành công</Text>
                    </View>

                    {/* Stats Cards */}
                    <View className="flex-row px-6 py-6 bg-gray-50/55 mb-2">
                        <View className="flex-1 items-center bg-white rounded-2xl py-4 mx-1 shadow-sm">
                            <Text className="text-lg font-bold text-gray-800">1,240,000đ̲</Text>
                            <Text className="text-xs text-gray-500 mt-1">Tổng tiền</Text>
                        </View>
                        <View className="flex-1 items-center bg-white rounded-2xl py-4 mx-1 shadow-sm">
                            <Text className="text-lg font-bold text-gray-800">4</Text>
                            <Text className="text-xs text-gray-500 mt-1">Thành viên</Text>
                        </View>
                        <View className="flex-1 items-center bg-white rounded-2xl py-4 mx-1 shadow-sm">
                            <Text className="text-lg font-bold text-gray-800">310,000đ̲</Text>
                            <Text className="text-xs text-gray-500 mt-1">Trung bình</Text>
                        </View>
                    </View>


                    <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
                        {/* Payers Section */}
                        <View className="px-6 py-6">
                            <View className="flex-row items-center mb-4">
                                <View className="w-10 h-10 rounded-full bg-emerald-100 items-center justify-center mr-3">
                                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                </View>
                                <Text className="text-lg font-bold text-gray-800">Người trả tiền</Text>
                                <View
                                    className="ml-2 px-2 py-1 rounded-full"
                                    style={{ backgroundColor: '#d1fae5' }}
                                >
                                    <Text className="text-xs font-bold text-emerald-700">{payerList.length}</Text>
                                </View>
                            </View>
                            {payerList.map((payer, index) => (
                                <View key={index} className=" p-4 flex-row items-center  mb-3">
                                    <View className="w-12 h-12 rounded-full bg-white shadow-md items-center justify-center mr-4">
                                        <Image source={payer.avatar} className="w-10 h-10 rounded-full" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base font-bold text-gray-800">{payer.name}</Text>
                                        <Text className="text-sm text-emerald-600 mt-1 font-semibold">✓ Đã thanh toán {payer.amount}</Text>
                                    </View>
                                    <View className="w-8 h-8 rounded-full bg-emerald-500 items-center justify-center">
                                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Debts Section */}
                        <View className="px-6 py-6">
                            <View className="flex-row items-center mb-4">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: '#fecaca', borderRadius: 50 }}
                                >
                                    <Ionicons name="time" size={20} color="#E11D48" />
                                </View>
                                <Text className="text-lg font-bold text-gray-800">Danh sách nợ</Text>
                                <View
                                    className="ml-2 px-2 py-1 rounded-full"
                                    style={{ backgroundColor: '#fecaca' }}
                                >
                                    <Text className="text-xs font-bold text-rose-700">{debtList.length}</Text>
                                </View>
                            </View>
                            {debtList.map((debt, index) => (
                                <View key={index} className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                                    <View className="flex-row items-center flex-1">
                                        <Image source={debt.debtor.avatar} className="w-12 h-12 rounded-full mr-3" />
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-gray-800">{debt.debtor.name}</Text>
                                            <Text className="text-sm text-gray-500 mt-1">Cần thanh toán</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-lg font-bold text-rose-500">{debt.amount}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-xs text-gray-400 mr-1">đến</Text>
                                            <Image source={debt.creditor.avatar} className="w-5 h-5 rounded-full mr-1" />
                                            <Text className="text-xs font-medium text-emerald-600">{debt.creditor.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View className="p-6 bg-white">
                        <TouchableOpacity
                            onPress={handleCreateReminder}
                            className='bg-primary py-4 rounded-2xl '
                        >
                            <View className='flex-row items-center justify-center'>
                                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-3">
                                    <Ionicons name="notifications" size={18} color="#FFFFFF" />
                                </View>
                                <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                    TẠO NHẮC NHỞ
                                </Text>

                            </View>

                        </TouchableOpacity>



                    </View>

                </View>
            </SafeAreaView>
        </>
    );
};

export default ShareBill;