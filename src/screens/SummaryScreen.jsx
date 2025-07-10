import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';
import summary1 from '../../assets/images/summary1.png';
import { AddMemberModal } from '../components';

const { width, height } = Dimensions.get('window');

const SummaryScreen = () => {
    const navigation = useNavigation();
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [isRemoveMode, setIsRemoveMode] = useState(false);

    // Danh sách tất cả thành viên có thể thêm
    const [availableMembers, setAvailableMembers] = useState([
        { id: 101, name: 'Afrin Sabila', subtitle: 'Life is beautiful 😊', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face' },
        { id: 102, name: 'Adil Adnan', subtitle: 'Be your own hero 💪', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
        { id: 103, name: 'Bristy Haque', subtitle: 'Keep working 💪', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
        { id: 104, name: 'John Borino', subtitle: 'Make yourself proud 🔥', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
        { id: 105, name: 'Borsha Akther', subtitle: 'Flowers are beautiful 🌸', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
        { id: 106, name: 'Sheik Sadi', subtitle: 'Life is beautiful 😊', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face' },
        { id: 107, name: 'Alex Johnson', subtitle: 'Dream big 🚀', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
        { id: 108, name: 'Sarah Williams', subtitle: 'Stay positive ✨', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face' },
        { id: 109, name: 'Michael Brown', subtitle: 'Never give up 💯', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
        { id: 110, name: 'Emma Davis', subtitle: 'Believe in yourself 🌟', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' }
    ]);

    // Mock data cho nhóm (thường sẽ được truyền từ CreateGroupScreen)
    const [groupData, setGroupData] = useState({
        id: 1,
        name: 'Phú Quốc Trip',
        avatar: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop&crop=face',
        duration: '01/07/2025 - 04/07/2025',
        totalAmount: 2500000,
        members: [
            {
                id: 1,
                name: 'John Doe',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
                spent: 500000
            },
            {
                id: 2,
                name: 'Jane Smith',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
                spent: 750000
            },
            {
                id: 3,
                name: 'Mike Johnson',
                avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
                spent: 600000
            },
            {
                id: 4,
                name: 'Sarah Wilson',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
                spent: 450000
            },
            {
                id: 5,
                name: 'Emily Davis',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
                spent: 200000
            }
        ],
        leader: {
            id: 1,
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
    });

    const handleBack = () => {
        navigation.goBack();
    };

    const handleChatGroup = () => {
        console.log('Chat Group');
    };

    const handleTaxRefund = () => {
        console.log('Tax Refund');
    };

    const handleGroupLink = () => {
        console.log('Group Link');
    };

    const handleShareBill = () => {
        navigation.navigate('ShareBill');
    };

    const handleCreateInvoice = () => {
        navigation.navigate('CreateBill')
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
        // Thêm thành viên mới vào nhóm với chi phí mặc định là 0
        const newMember = {
            ...selectedMember,
            spent: 0
        };

        setGroupData(prev => ({
            ...prev,
            members: [...prev.members, newMember],
            totalAmount: prev.totalAmount // Có thể cập nhật tổng chi phí nếu cần
        }));

        setShowAddMemberModal(false);
    };

    const handleCloseAddMemberModal = () => {
        setShowAddMemberModal(false);
    };

    const handleToggleRemoveMode = () => {
        setIsRemoveMode(!isRemoveMode);
    };

    const handleRemoveMember = (memberId) => {
        // Không cho phép xóa trưởng nhóm
        if (memberId === groupData.leader.id) {
            console.log('Không thể xóa trưởng nhóm');
            return;
        }

        setGroupData(prev => ({
            ...prev,
            members: prev.members.filter(member => member.id !== memberId),
            totalAmount: prev.totalAmount // Có thể cập nhật tổng chi phí nếu cần
        }));
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

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
            <View
                className='flex-row items-center justify-between  px-4 pt-12 pb-4'
                style={{ zIndex: 1 }}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    className='flex-row items-center p-3'
                >
                    <Ionicons
                        name='chevron-back-outline'
                        size={28}
                        color='#6C63FF'
                        style={{ marginRight: 4 }}
                    />
                </TouchableOpacity>
                <Text className='text-xl font-bold text-gray-900'>
                    Tổng quan nhóm
                </Text>
                <View

                    className='px-6'
                >

                </View>
            </View>

            {/* Content */}
            <View className='flex-1 px-6' style={{ zIndex: 1 }}>
                <ScrollView
                    className='flex-1'
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {/* Group Info Card */}
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
                        {/* Group Avatar and Name */}
                        <View className='items-center mb-6'>
                            <View className='w-24 h-24 rounded-full mb-4 overflow-hidden'>
                                <Image
                                    source={{ uri: groupData.avatar }}
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    resizeMode='cover'
                                />
                            </View>
                            <Text className='text-xl font-bold text-gray-900 mb-2'>
                                {groupData.name}
                            </Text>
                            <Text className='text-gray-500 text-sm'>
                                {groupData.duration}
                            </Text>
                        </View>

                        {/* Total Amount */}
                        <View className='bg-blue-50 rounded-2xl p-4 mb-6'>
                            <Text className='text-center text-sm text-gray-600 mb-1'>
                                Tổng chi phí
                            </Text>
                            <Text className='text-center text-2xl font-bold text-primary'>
                                {formatCurrency(groupData.totalAmount)}
                            </Text>
                        </View>

                        {/* Members List */}
                        <View>
                            <View className='flex-row items-center justify-between mb-4'>
                                <Text className='text-lg font-semibold text-gray-900'>
                                    Thành viên ({groupData.members.length})
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

                            {/* Add Member Button - Only show when not in remove mode */}
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

                            {groupData.members.map((member) => (
                                <View key={member.id} className='flex-row items-center justify-between mb-4'>
                                    <View className='flex-row items-center flex-1'>
                                        <View className='w-10 h-10 rounded-full mr-3 overflow-hidden'>
                                            <Image
                                                source={{ uri: member.avatar }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                                resizeMode='cover'
                                            />
                                        </View>
                                        <View className='flex-1'>
                                            <Text className='text-gray-900 font-medium'>
                                                {member.name}
                                                {member.id === groupData.leader.id && (
                                                    <Text className='text-primary text-sm'> (Trưởng nhóm)</Text>
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className='flex-row items-center'>
                                        <Text className='text-gray-600 text-sm mr-3'>
                                            {formatCurrency(member.spent)}
                                        </Text>
                                        {/* Remove button - Only show in remove mode and not for leader */}
                                        {isRemoveMode && member.id !== groupData.leader.id && (
                                            <TouchableOpacity
                                                onPress={() => handleRemoveMember(member.id)}
                                                className='bg-red-50 rounded-full p-2'
                                            >
                                                <Ionicons name='remove' size={16} color='#EF4444' />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className='mb-6'>
                        {/* Share Bill - Main Feature (Highlighted) */}
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
                selectedMembers={groupData.members}
                isSelectingLeader={false}
            />
        </View>
    );
};

export default SummaryScreen;
