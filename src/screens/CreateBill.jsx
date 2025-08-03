import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Modal,
    StatusBar,
    Platform,
    ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AddProductModal } from '../components';
import bg1 from '../../assets/images/bg1.png';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '~/utils/cloudinary';
import { formatCurrency, formatEmail } from '../utils/formatUtils';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axiosClient from '~/apis/axiosClient';
import Notfound from '~/components/Notfound';
import { LinearGradient } from 'expo-linear-gradient';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';
const { width, height } = Dimensions.get('window');

const CreateBill = () => {
    const route = useRoute();
    const { tripId } = route.params;

    const navigation = useNavigation();

    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showDeleteMode, setShowDeleteMode] = useState(false);
    const [showUserSelector, setShowUserSelector] = useState(null);

    const [bills, setBills] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [loading, setLoading] = useState(false);



    const handleBack = () => {
        navigation.goBack();
    };

    const handleAddProduct = (newProduct) => {
        setBills(prevBills => [...prevBills, newProduct]);
    };

    const handleRemoveProduct = (productId) => {
        setProducts(bills.filter(product => product.eventId !== productId));
    };





    const fetchBillsData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`Event/by-trip/${tripId}`);
            if (response.status === 200) {
                setBills(response.data);

            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tải dữ liệu hóa đơn. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    }

    const fetchGroupDetails = async () => {
        try {
            const response = await axiosClient.get(`${tripId}/details`);
            if (response.status === 200) {
                setGroupMembers(response.data.members);
            }
        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tải thông tin nhóm. Vui lòng thử lại sau.'
            });
        }
    };

    useEffect(() => {
        fetchBillsData();
        fetchGroupDetails();
    }, [tripId]);

    useFocusEffect(
        useCallback(() => {
            fetchBillsData();
        }
            , [])
    );
    console.log('bills', bills[0]);
    return (
        <View className='flex-1 bg-bg-default relative' >
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

            <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: 50,
                    paddingBottom: 25,
                    paddingHorizontal: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center mr-4"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Tạo hóa đơn</Text>
                            <Text className="text-white/80 text-sm mt-1">Thêm hóa đơn mới</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("ScanBill", { tripId })}
                        className="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm"
                    >
                        <Text className="text-white font-medium text-sm">Scan hóa đơn</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient >
            <View className='flex-1 px-4 pt-4 pb-4'>
                {/* Products List */}
                <ScrollView
                    className='flex-1 px-2'
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View className='flex-row items-center justify-between mb-4'>
                        <View className='flex-row items-center'>
                            <Ionicons name='list' size={18} color='#374151' />
                            <Text className='text-base font-medium text-gray-900 ml-2'>
                                Danh sách hóa đơn
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowDeleteMode(!showDeleteMode)}
                            className='p-2'
                        >
                            <Ionicons
                                name='trash-outline'
                                size={18}
                                color={showDeleteMode ? '#EF4444' : '#9CA3AF'}
                            />
                        </TouchableOpacity>
                    </View>
                    {bills.length > 0 ? (
                        bills.map((bill, index) => (
                            <View key={index} className='mb-2 bg-white rounded-lg border border-gray-200 p-3'>
                                <View className='flex-row items-center justify-between'>
                                    <View className='flex-row items-center flex-1'>

                                        <View className='flex-1 px-3'>
                                            <Text className='text-gray-900 font-medium text-base'>
                                                {bill.eventName}
                                            </Text>
                                            <Text className='text-primary font-bold text-sm'>
                                                {formatCurrency(bill.amountInTripCurrency || 0)}
                                            </Text>
                                        </View>
                                        <View className='flex-row items-center'>
                                            <TouchableOpacity
                                                onPress={() => setShowUserSelector(showUserSelector === bill.eventId ? null : bill.eventId)}
                                                className='flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2'
                                            >
                                                <View className='flex-row items-center'>
                                                    {bill?.beneficiaries?.slice(0, 2).map((user, index) => (
                                                        <Image
                                                            key={user.accountId}
                                                            source={
                                                                user.accountId === 'ccb3ef34-021f-4f54-9007-2fd47fffdb1d' ? hcmt :
                                                                    user.accountId === 'cf0ab205-f29e-4fa8-b182-7c38262a5281' ? accountId :
                                                                        user.accountId === '2179fd2a-fc41-4baa-882a-fe27e4b16d0b' ? trihcmse :
                                                                            paavagl
                                                            }
                                                            className={`w-5 h-5 rounded-full ${index > 0 ? '-ml-1' : ''}`}
                                                            style={{
                                                                zIndex: 2 - index,
                                                                borderWidth: 2,
                                                                borderColor: '#6C63FF'
                                                            }}
                                                        />

                                                    ))}
                                                    {bill?.beneficiaries?.length > 2 && (
                                                        <View
                                                            className='w-5 h-5 rounded-full bg-purple-100 -ml-1 items-center justify-center'
                                                            style={{
                                                                borderWidth: 2,
                                                                borderColor: '#6C63FF'
                                                            }}
                                                        >
                                                            <Text className='text-xs text-purple-600 font-bold'>
                                                                +{bill?.beneficiaries.length - 2}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Ionicons
                                                    name={showUserSelector === bill.eventId ? 'chevron-up' : 'chevron-down'}
                                                    size={12}
                                                    color='#6B7280'
                                                    style={{ marginLeft: 4 }}
                                                />
                                            </TouchableOpacity>
                                            <Image
                                                source={
                                                    bill?.paidBy === 'ccb3ef34-021f-4f54-9007-2fd47fffdb1d' ? hcmt :
                                                        bill?.paidBy === 'cf0ab205-f29e-4fa8-b182-7c38262a5281' ? hhuy :
                                                            bill?.paidBy === '2179fd2a-fc41-4baa-882a-fe27e4b16d0b' ? trihcmse :
                                                                paavagl
                                                }
                                                className='w-6 h-6 rounded-full'
                                            />
                                        </View>
                                    </View>
                                    {showDeleteMode && (
                                        <TouchableOpacity
                                            onPress={() => handleRemoveProduct(bill.eventId)}
                                            className='bg-red-50 rounded-full p-2 ml-2'
                                        >
                                            <Ionicons name='remove' size={16} color='#EF4444' />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {/* Expanded User Selection */}
                                {showUserSelector === bill.eventId && (
                                    <View className='mt-3 pt-3 border-t border-gray-100'>
                                        <View className='flex-row items-center justify-between mb-3'>
                                            <View className='flex-row items-center'>
                                                <Ionicons name='people' size={16} color='#374151' />
                                                <Text className='text-sm font-medium text-gray-900 ml-2'>
                                                    Người sử dụng
                                                </Text>
                                            </View>
                                            <Text className='text-xs text-gray-500'>
                                                {bill?.beneficiaries?.length || 0} người
                                            </Text>
                                        </View>
                                        <View className='flex-row flex-wrap gap-2'>
                                            {bill?.beneficiaries?.map((member) => {
                                                return (
                                                    <View key={member.accountId} className="flex-col items-center justify-center">
                                                        <Image
                                                            source={
                                                                member.accountId === 'ccb3ef34-021f-4f54-9007-2fd47fffdb1d' ? hcmt :
                                                                    member.accountId === 'cf0ab205-f29e-4fa8-b182-7c38262a5281' ? hhuy :
                                                                        member.accountId === '2179fd2a-fc41-4baa-882a-fe27e4b16d0b' ? trihcmse :
                                                                            paavagl
                                                            }
                                                            className="w-12 h-12 rounded-full border-2 border-blue-600"
                                                        />
                                                        <Text className="text-xs mt-1 text-purple-600 font-medium">
                                                            {formatCurrency(member.amount || 0)}
                                                        </Text>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))) : (<Notfound text="Chưa có hóa đơn nào" />)}


                    {/* Add Bill Image & Add Product Buttons Row */}
                    <View className='flex-row items-center mt-2'>

                        {/* Add Product Button */}
                        <TouchableOpacity
                            onPress={() => setShowAddProductModal(true)}
                            className='rounded-lg px-3 py-2 items-center flex-row'
                            style={{ backgroundColor: '#6366F1' }}
                        >
                            <Ionicons name='add' size={16} color='white' />
                            <Text className='text-white font-medium ml-1 text-sm'>
                                Thêm hóa đơn
                            </Text>
                        </TouchableOpacity>
                    </View>



                    {/* Bottom Section */}
                    <View className='mt-6 mb-6'>
                        {/* Tổng kết compact */}
                        <View >
                            {/* Header thống kê */}
                            <View className='flex-row items-center justify-between mb-3'>
                                <View className='flex-row items-center'>
                                    <Ionicons name='stats-chart' size={18} color='#374151' />
                                    <Text className='text-base font-medium text-gray-900 ml-2'>
                                        Thống kê chi tiêu
                                    </Text>
                                </View>
                            </View>

                            <View className='bg-white rounded-xl p-3 mb-4 border border-gray-200'>
                                {/* Tổng tiền */}
                                <View className='flex-row items-center justify-between mb-3 p-2 bg-purple-50 rounded-lg'>
                                    <View className='flex-row items-center'>
                                        <Ionicons name='wallet' size={16} color='#6C63FF' />
                                        <Text className='text-primary font-medium ml-2'>
                                            Tổng:
                                        </Text>
                                    </View>
                                    <Text className='text-primary font-bold text-lg'>
                                        {formatCurrency(bills.reduce((total, bill) => total + bill.amountInTripCurrency, 0))}
                                    </Text>
                                </View>

                                {/* Số tiền đã trả */}
                                {(() => {
                                    const paymentSummary = {};
                                    bills.forEach(bill => {
                                        if (bill.paidBy) {
                                            const payerId = bill.paidBy;
                                            if (!paymentSummary[payerId]) {
                                                paymentSummary[payerId] = {
                                                    payer: groupMembers.find(member => member.accountId === payerId)?.email || 'Unknown',
                                                    payerAvatar: groupMembers.find(member => member.accountId === payerId)?.avatar || '',
                                                    amount: 0
                                                };
                                            }
                                            paymentSummary[payerId].amount += bill.amountInTripCurrency;
                                        }
                                    });

                                    const payments = Object.values(paymentSummary);
                                    if (payments.length === 0) {
                                        return (
                                            <View className='flex-row items-center justify-center p-3 bg-gray-50 rounded-lg'>
                                                <Ionicons name='information-circle' size={16} color='#6B7280' />
                                                <Text className='text-gray-500 ml-2 text-sm'>
                                                    Chưa có hóa đơn nào được thanh toán
                                                </Text>
                                            </View>
                                        );
                                    }

                                    return (
                                        <View className='space-y-2'>
                                            {payments.map((payment, index) => (
                                                <View key={index} className='flex-row items-center justify-between py-2 px-1'>
                                                    <View className='flex-row items-center'>
                                                        <Image
                                                            source={
                                                                payment.payer === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                                    payment.payer === 'hhuy00355@gmail.com' ? hhuy :
                                                                        payment.payer === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                                            paavagl
                                                            }
                                                            className='w-7 h-7 rounded-fpaymentull mr-3'
                                                            style={{
                                                                backgroundColor: '#E5E7EB'
                                                            }}
                                                        />
                                                        <Text className='text-gray-700 font-medium text-sm'>
                                                            {formatEmail(payment.payer)}
                                                        </Text>
                                                    </View>
                                                    <Text className='text-gray-900 font-bold text-sm'>
                                                        {formatCurrency(payment.amount)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })()}
                            </View>
                        </View>




                    </View>
                </ScrollView>

            </View>


            {/* Add Product Modal */}
            <AddProductModal
                visible={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onAddProduct={handleAddProduct}
                groupMembers={groupMembers}
                tripId={tripId}
            />




        </View >
    );
}

export default CreateBill

