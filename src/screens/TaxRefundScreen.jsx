import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import Toast from 'react-native-toast-message';
import axiosClient from '../apis/axiosClient';
import { formatPrice, parseFormattedPrice, truncateText, formatPercentage, formatEmail } from '../utils/formatUtils';
import AddTaxRefundModal from '../components/AddTaxRefundModal';
import Notfound from '~/components/Notfound';

const { width, height } = Dimensions.get('window');

const TaxRefundScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tripId, groupMembers = [] } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [taxRefunds, setTaxRefunds] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axiosClient.get("profile");
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi tải dữ liệu',
                text2: 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
            });
        }
    };

    const fetchTaxRefunds = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`TaxRefund/by-trip/${tripId}`);
            if (response.status === 200) {
                setTaxRefunds(response.data);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tải danh sách hoàn thuế.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchTaxRefunds();
    }, []);

    const handleOpenModal = () => setModalVisible(true);
    const handleCloseModal = () => setModalVisible(false);

    const handleAddTaxRefund = (newTaxRefund) => {
        fetchTaxRefunds(); // Refresh data after adding
    };

    const getMemberById = (accountId) => {
        return groupMembers.find(member => member.accountId === accountId) || { email: 'Unknown' };
    };

    const renderTaxRefundItem = ({ item }) => {
        const refunder = getMemberById(item.refundedBy);

        return (
            <View className='bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100'>
                <View className='flex-row justify-between items-start mb-3'>
                    <View className='flex-1'>
                        <Text className='text-lg font-semibold text-gray-900 mb-1'>
                            {item.productName}
                        </Text>
                        <Text className='text-sm text-gray-600'>
                            Người hoàn: {formatEmail(refunder.email)}
                        </Text>
                    </View>
                    <View className='items-end'>
                        <Text className='text-lg font-bold text-green-600'>
                            +{formatPrice(item.refundAmount.toString())} đ
                        </Text>
                        <Text className='text-xs text-gray-500'>
                            {item.refundPercent}% của {formatPrice(item.originalAmount.toString())} đ
                        </Text>
                    </View>
                </View>

                <View className='flex-row items-center justify-between mb-3'>
                    <View className='flex-row items-center'>
                        <View className={`px-2 py-1 rounded-full ${item.splitType === 'KEEP' ? 'bg-blue-100' :
                            item.splitType === 'EQUAL' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                            <Text className={`text-xs font-medium ${item.splitType === 'KEEP' ? 'text-blue-700' :
                                item.splitType === 'EQUAL' ? 'text-green-700' : 'text-purple-700'
                                }`}>
                                {item.splitType === 'KEEP' ? 'Giữ riêng' :
                                    item.splitType === 'EQUAL' ? 'Chia đều' : 'Chia tỉ lệ'}
                            </Text>
                        </View>
                    </View>
                    <Text className='text-xs text-gray-500'>
                        {item.beneficiaries.length} người nhận
                    </Text>
                </View>

                <View className='border-t border-gray-100 pt-3'>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Người nhận:</Text>
                    <View className='flex-row flex-wrap gap-2'>
                        {item.beneficiaries.map((beneficiary, index) => {
                            const member = getMemberById(beneficiary.accountId);
                            return (
                                <View key={index} className='flex-row items-center bg-gray-50 rounded-lg px-3 py-2'>
                                    <View className='w-6 h-6 rounded-full bg-indigo-100 items-center justify-center mr-2'>
                                        <Text className='text-xs font-medium text-indigo-600'>
                                            {member.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className='text-xs font-medium text-gray-700'>
                                            {truncateText(member.email, 10)}
                                        </Text>
                                        <Text className='text-xs text-gray-500'>
                                            {formatPrice(beneficiary.amountReceived.toString())} đ ({beneficiary.ratio.toFixed(1)}%)
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>
        );
    };

    const renderHeader = () => {
        if (loading) {
            return (
                <View className='flex-1 justify-center items-center py-20'>
                    <ActivityIndicator size='large' color='#6C63FF' />
                    <Text className='text-gray-500 mt-2'>Đang tải...</Text>
                </View>
            );
        }

        if (taxRefunds.length === 0) {
            return (
                <View className='flex-1 justify-center items-center py-20'>
                    <Notfound text='Bạn chưa có hóa đơn hoàn thuế nào' />
                    <TouchableOpacity
                        onPress={handleOpenModal}
                        className='bg-indigo-500 rounded-lg px-6 py-3'
                    >
                        <Text className='text-white font-semibold'>Thêm hoàn thuế</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    return (
        <View className='flex-1 bg-bg-default relative'>
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
            <View className='flex-row items-center justify-between px-4 pt-12 pb-4 bg-white shadow-sm'>
                <TouchableOpacity onPress={() => navigation.goBack()} className='p-2'>
                    <Ionicons name='chevron-back-outline' size={28} color='#6C63FF' />
                </TouchableOpacity>
                <Text className='text-xl font-bold text-gray-900'>Hoàn thuế</Text>
                <TouchableOpacity onPress={handleOpenModal} className='p-2'>
                    <Ionicons name='add-outline' size={28} color='#6C63FF' />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <FlatList
                data={taxRefunds}
                keyExtractor={(item) => item.taxRefundId}
                renderItem={renderTaxRefundItem}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 100,
                    flexGrow: 1
                }}
            />

            {/* Floating Add Button */}
            {taxRefunds.length > 0 && (
                <TouchableOpacity
                    onPress={handleOpenModal}
                    className='absolute bottom-6 right-6 w-14 h-14 bg-indigo-500 rounded-full items-center justify-center shadow-lg'
                    style={{
                        shadowColor: '#6C63FF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons name='add' size={28} color='white' />
                </TouchableOpacity>
            )}

            <AddTaxRefundModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                onAddTaxRefund={handleAddTaxRefund}
                groupMembers={groupMembers}
                tripId={tripId}
            />
        </View>
    );
};

export default TaxRefundScreen;
