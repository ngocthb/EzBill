import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import summary1 from '../../assets/images/summary1.png';
import { AddMemberModal } from '../components';
import axiosClient from '../apis/axiosClient';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import { formatCurrencyWithOptions, formatEmail } from '../utils/formatUtils';
import Notfound from '~/components/Notfound';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';

const { width, height } = Dimensions.get('window');

const SummaryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { tripId } = route.params;
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [isRemoveMode, setIsRemoveMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [trip, setTrip] = useState(null);
    const [groupData, setGroupData] = useState([])
    // Danh sách tất cả thành viên có thể thêm
    const [availableMembers, setAvailableMembers] = useState([
        {
            id: "ccb3ef34-021f-4f54-9007-2fd47fffdb1d",
            name: "huynhcongminhtri79",
            subtitle: "Available",
            avatar: "https://avatar.iran.liara.run/public/48"
        },
        {
            id: "2179fd2a-fc41-4baa-882a-fe27e4b16d0b",
            name: "trihcmse183799",
            subtitle: "Available",
            avatar: "https://mir-s3-cdn-cf.behance.net/user/276/113df11590428999.660561235c068.jpg"
        },
        {
            id: "011e8d39-2705-4cfc-a6d7-103f2f8abbbe",
            name: "paavagl19",
            subtitle: "Available",
            avatar: "https://th.bing.com/th/id/OIP.JBpgUJhTt8cI2V05-Uf53AHaG1?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
        },
        {
            id: "cf0ab205-f29e-4fa8-b182-7c38262a5281",
            name: "hhuy00355",
            subtitle: "Available",
            avatar: "https://tse1.mm.bing.net/th/id/OIP.-DonqiW8gRye2uR_9F6qYAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
        }
    ]);



    const handleBack = () => {
        navigation.goBack();
    };

    const handleChatGroup = () => {
        console.log('Chat Group');
    };

    const handleTaxRefund = () => {
        navigation.navigate('TaxRefund', { tripId, groupMembers: groupData });
    };

    const handleGroupLink = () => {
        console.log('Group Link');
    };

    const handleShareBill = () => {
        navigation.navigate('ShareBill', { tripId });
    };

    const handleCreateInvoice = () => {
        navigation.navigate('CreateBill', { tripId })
    };

    const handleScanInvoice = () => {
        navigation.navigate('ScanBill');
    };

    const handleEditGroup = () => {
        console.log('Edit Group');
    };

    const handleDeleteGroup = () => {
        console.log('Delete Group');
    };

    const handleAddMember = () => {
        setShowAddMemberModal(true);
    };

    const handleSelectMember = (selectedMember) => {
        setGroupData(pre => [...pre, selectedMember]);

        setShowAddMemberModal(false);
    };

    const handleCloseAddMemberModal = () => {
        setShowAddMemberModal(false);
    };

    const handleToggleRemoveMode = () => {
        setIsRemoveMode(!isRemoveMode);
    };

    const handleRemoveMember = (memberId) => {


        setGroupData(pre => (pre.filter(member => member.accountId !== memberId)));
    };

    const formatCurrency = (amount) => {
        return formatCurrencyWithOptions(amount, {
            style: 'currency',
            currency: 'VND'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const [year, month, day] = dateString.split('-');

        if (!year || !month || !day) return '';

        return `${day}/${month}/${year}`;
    };


    const fetchTripData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`${tripId}/details`);
            if (response.status === 200) {
                setTrip(response.data);
                setGroupData(response.data.members);

                // Filter available members to exclude those already in the group
                const existingMemberIds = response.data.members.map(member => member.accountId);
                const filteredAvailableMembers = availableMembers.filter(member => !existingMemberIds.includes(member.id));
                setAvailableMembers(filteredAvailableMembers);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Không tìm thấy dữ liệu chuyến đi'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể tải dữ liệu chuyến đi'
            });
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            if (tripId) {
                fetchTripData();
            }
        }, [tripId])
    );



    return (
        <View className='flex-1 bg-bg-default relative'>

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
                            <Text className="text-white text-2xl font-bold">Nhóm của bạn</Text>
                            <Text className="text-white/80 text-sm mt-1">Tổng quan nhóm</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View className='flex-1 px-6 mt-3' style={{ zIndex: 1 }}>
                <ScrollView
                    className='flex-1'
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >

                    <View
                        className='bg-white rounded-3xl px-6 pt-7 mb-6'
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <View className='items-center mb-6'>
                            <View className='w-24 h-24 rounded-full mb-4 overflow-hidden'>
                                <Image
                                    source={{ uri: "https://i.pinimg.com/736x/67/ba/ce/67bace3535ae85d0338e3f86ea6dd582.jpg" }}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    resizeMode='cover'
                                />
                            </View>
                            <Text className='text-xl font-bold text-gray-900 mb-2'>
                                {trip?.tripName}
                            </Text>
                            <Text className='text-gray-500 text-sm'>
                                {formatDate(trip?.startDate)} - {formatDate(trip?.endDate)}
                            </Text>
                        </View>

                        <View className='bg-blue-50 rounded-2xl p-4 mb-6'>
                            <Text className='text-center text-sm text-gray-600 mb-1'>
                                Tổng chi phí
                            </Text>
                            <Text className='text-center text-2xl font-bold text-primary'>
                                {formatCurrency(groupData?.totalAmount || 0)}
                            </Text>
                        </View>


                        <View>
                            <View className='flex-row items-center justify-between mb-4'>
                                <Text className='text-lg font-semibold text-gray-900'>
                                    Thành viên ({groupData?.length})
                                </Text>
                                <View className='flex-row items-center'>
                                    <TouchableOpacity
                                        onPress={handleToggleRemoveMode}
                                        className={`rounded-full p-2 ${isRemoveMode ? 'bg-red-50' : 'bg-gray-50'}`}
                                    >
                                        <Ionicons
                                            name='trash-outline'
                                            size={20}
                                            color={isRemoveMode ? '#EF4444' : '#6B7280'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {!isRemoveMode && (
                                <TouchableOpacity
                                    onPress={handleAddMember}
                                    className='flex-row items-center py-3 px-2 rounded-xl mb-3 border border-dashed border-gray-300'
                                >
                                    <View className='w-10 h-10 rounded-full mr-3 bg-gray-100 items-center justify-center'>
                                        <Ionicons name='add' size={20} color='#6B7280' />
                                    </View>
                                    <Text className='text-gray-500 font-medium'>
                                        Thêm thành viên mới
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {groupData?.length > 0 ? (groupData.map((member) => (
                                <View key={member.accountId} className='flex-row items-center justify-between mb-4'>
                                    <View className='flex-row items-center flex-1'>
                                        <View className='w-10 h-10 rounded-full mr-3 overflow-hidden'>
                                            <Image
                                                source={
                                                    member.email === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                        member.email === 'hhuy00355@gmail.com' ? hhuy :
                                                            member.email === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                                paavagl
                                                }
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                                resizeMode='cover'
                                            />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='text-gray-900 font-medium'>
                                                {formatEmail(member.email)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className='flex-row items-center'>
                                        {isRemoveMode && (
                                            <TouchableOpacity
                                                onPress={() => handleRemoveMember(member.accountId)}
                                                className='bg-red-50 rounded-full p-2'
                                            >
                                                <Ionicons name='remove' size={16} color='#EF4444' />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))) : (
                                <Notfound text="Nhóm này chưa có thành viên" />
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className='mb-6'>
                        <TouchableOpacity
                            onPress={handleShareBill}
                            className='bg-white rounded-2xl p-4 mb-4 flex-row items-center justify-between border-2 border-primary shadow-lg'
                            style={{
                                shadowColor: '#6366F1',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mr-4'>
                                    <Image
                                        source={summary1}
                                        className='w-14 h-14'
                                        resizeMode='contain'
                                    />
                                </View>
                                <View>
                                    <View className='flex-row items-center'>
                                        <Text className='text-gray-900 font-bold text-base mr-2'>
                                            Chia bill siêu chill
                                        </Text>
                                        <View className='bg-red-500 px-2 py-1 rounded-full'>
                                            <Text className='text-xs font-bold text-white'>
                                                HOT
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className='text-indigo-600 text-sm font-medium'>
                                        Ai trả gì? EzBill lo hết!
                                    </Text>
                                </View>
                            </View>
                            <View className='bg-indigo-50 rounded-xl p-2'>
                                <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                            </View>
                        </TouchableOpacity>
                        {/* Chat Group */}
                        <TouchableOpacity
                            onPress={handleChatGroup}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='chatbubbles' size={24} color='#3B82F6' />
                                </View>
                                <Text className='text-gray-900 font-medium text-base'>
                                    Chat nhóm
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>

                        {/* Create Invoice */}
                        <TouchableOpacity
                            onPress={handleCreateInvoice}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='document-text' size={24} color='#F59E0B' />
                                </View>
                                <Text className='text-gray-900 font-medium text-base'>
                                    Tạo hóa đơn
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>

                        {/* Scan Invoice */}
                        <TouchableOpacity
                            onPress={handleScanInvoice}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-amber-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='scan' size={24} color='#D97706' />
                                </View>
                                <Text className='text-gray-900 font-medium text-base'>
                                    Scan hóa đơn
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>

                        {/* Tax Refund */}
                        <TouchableOpacity
                            onPress={handleTaxRefund}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='receipt' size={24} color='#10B981' />
                                </View>
                                <Text className='text-gray-900 font-medium text-base'>
                                    Hoàn thuế
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>

                        {/* Group Link */}
                        <TouchableOpacity
                            onPress={handleGroupLink}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='link' size={24} color='#8B5CF6' />
                                </View>
                                <Text className='text-gray-900 font-medium text-base'>
                                    Link nhóm
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>

                        {/* Delete Group */}
                        <TouchableOpacity
                            onPress={handleDeleteGroup}
                            className='bg-white rounded-2xl p-4 mb-3 flex-row items-center justify-between'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                            }}
                        >
                            <View className='flex-row items-center'>
                                <View className='w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4'>
                                    <Ionicons name='trash' size={24} color='#EF4444' />
                                </View>
                                <Text className='text-red-500 font-medium text-base'>
                                    Xóa nhóm
                                </Text>
                            </View>
                            <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

            {/* Add Member Modal */}
            <AddMemberModal
                visible={showAddMemberModal}
                onClose={handleCloseAddMemberModal}
                onSelectMember={handleSelectMember}
                availableMembers={availableMembers}
                selectedMembers={groupData}
                isSelectingLeader={false}
            />
        </View>
    );
};

export default SummaryScreen;
