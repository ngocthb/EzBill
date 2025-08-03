import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import bg1 from '../../assets/images/bg1.png';
import summary1 from '../../assets/images/summary1.png';
import axiosClient from '../apis/axiosClient';
import Toast from 'react-native-toast-message';
import { formatEmail, formatCurrency } from '../utils/formatUtils';
import sharingBill from '../../assets/images/sharingBill.gif';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';
const ShareBill = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tripId } = route.params;
    const [resultShareBillData, setResultShareBillData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchResultShareBillData = async () => {
        try {
            const response = await axiosClient.post("Settlement/generate", { tripId });
            if (response.status === 200) {
                setResultShareBillData(response.data);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Không thể lấy dữ liệu chia tiền'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể lấy dữ liệu chia tiền'
            });
        } finally {
            setTimeout(() => setLoading(false), 2000);
        }
    };

    useEffect(() => {
        fetchResultShareBillData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (tripId) {
                fetchResultShareBillData();
            }
        }, [tripId])
    );

    const debtList = resultShareBillData.filter(item => item.status === "UNPAID");

    const handleCreateReminder = () => {
        console.log('Create Reminder');
    };

    const totalAmount = resultShareBillData.reduce((sum, item) => sum + item.amount, 0);
    const totalDebts = debtList.length;

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <Image source={sharingBill} style={{ width: 180, height: 180 }} resizeMode="contain" />
                <Text style={{ marginTop: 24, fontSize: 18, color: '#6C63FF', fontWeight: 'bold' }}>Đang chia tiền...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

            <LinearGradient
                colors={['#6C63FF', '#8B5CF6', '#A855F7']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <SafeAreaView className="flex-1 pt-12 px-8">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4 px-6">
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

                <View className="flex-1 mb-6 bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/15 mx-6">
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
                            <Text className="text-lg font-bold text-gray-800">{formatCurrency(totalAmount)}</Text>
                            <Text className="text-xs text-gray-500 mt-1">Tổng tiền nợ</Text>
                        </View>

                        <View className="flex-1 items-center bg-white rounded-2xl py-4 mx-1 shadow-sm">
                            <Text className="text-lg font-bold text-gray-800">{totalDebts}</Text>
                            <Text className="text-xs text-gray-500 mt-1">Số khoản nợ</Text>
                        </View>
                    </View>

                    <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
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
                                        <Image source={
                                            debt.fromAccountName === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                debt.fromAccountName === 'hhuy00355@gmail.com' ? hhuy :
                                                    debt.fromAccountName === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                        paavagl
                                        } className="w-12 h-12 rounded-full mr-3" />
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-gray-800">{formatEmail(debt.fromAccountName)}</Text>
                                            <Text className="text-sm text-gray-500 mt-1">Người nợ</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-lg font-bold text-rose-500">{formatCurrency(debt.amount)}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-xs text-gray-400 mr-1">cho</Text>
                                            <Image source={
                                                debt.toAccountName === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                    debt.toAccountName === 'hhuy00355@gmail.com' ? hhuy :
                                                        debt.toAccountName === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                            paavagl
                                            } className="w-5 h-5 rounded-full mr-1" />
                                            <Text className="text-xs font-medium text-emerald-600">{formatEmail(debt.toAccountName)}</Text>
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

            </SafeAreaView >
        </>
    );
};

export default ShareBill;