import React, { useState, useEffect } from 'react';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import axiosClient from '../apis/axiosClient';
import { formatPrice, parseFormattedPrice, formatDateToISO, truncateText } from '../utils/formatUtils';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';
const AddTaxRefundModal = ({
    visible,
    onClose,
    onAddTaxRefund,
    groupMembers,
    tripId
}) => {
    const [productName, setProductName] = useState('');
    const [originalAmount, setOriginalAmount] = useState('');
    const [refundPercent, setRefundPercent] = useState('');
    const [selectedRefunder, setSelectedRefunder] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [splitType, setSplitType] = useState('KEEP'); // 'KEEP', 'EQUAL', 'RATIO'
    const [ratios, setRatios] = useState({});
    const [loading, setLoading] = useState(false);

    const handleAddTaxRefund = async () => {
        try {
            setLoading(true);
            if (!productName.trim() || !originalAmount.trim() || !refundPercent.trim() || !selectedRefunder || (splitType !== 'KEEP' && selectedUsers.length === 0)) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Vui lòng điền đầy đủ thông tin.'
                });
                return;
            }

            const taxRefund_Usages = splitType === 'KEEP'
                ? [{ accountId: selectedRefunder.accountId, ratio: 100 }]
                : splitType === 'EQUAL'
                    ? selectedUsers.map(u => ({ accountId: u.accountId, ratio: Math.floor(100 / selectedUsers.length) }))
                    : selectedUsers.map((u, idx) => {
                        if (idx === selectedUsers.length - 1) {
                            // Tính tỉ lệ còn lại cho người cuối cùng giống logic hiển thị
                            const ids = selectedUsers.map(user => user.accountId);
                            const total = ids.reduce((sum, accountId, i) => {
                                if (i === ids.length - 1) return sum;
                                return sum + (Number(ratios[accountId]) || 0);
                            }, 0);
                            const remain = 100 - total;
                            return { accountId: u.accountId, ratio: remain > 0 ? remain : 0 };
                        }
                        return { accountId: u.accountId, ratio: Number(ratios[u.accountId]) || 0 };
                    });

            const newTaxRefund = {
                tripId,
                productName,
                originalAmount: parseFormattedPrice(originalAmount),
                refundPercent: parseFloat(refundPercent),
                refundedBy: selectedRefunder.accountId,
                splitType,
                taxRefund_Usages
            };

            const response = await axiosClient.post('TaxRefund/process', newTaxRefund);
            if (response.status === 200) {

                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Đã thêm hoàn thuế thành công!'
                });
            }

            onAddTaxRefund(newTaxRefund);
            onClose();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể thêm hoàn thuế. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRatioChange = (memberId, value) => {
        let num = value.replace(/[^0-9]/g, '');
        const totalOthers = selectedUsers.reduce((sum, user) => {
            if (user.accountId === memberId) return sum;
            return sum + (Number(ratios[user.accountId]) || 0);
        }, 0);

        const max = 100 - totalOthers;
        if (Number(num) > max) num = String(max);

        setRatios(prevRatios => {
            const updatedRatios = { ...prevRatios, [memberId]: num };
            const total = selectedUsers.reduce((sum, user) => sum + (Number(updatedRatios[user.accountId]) || 0), 0);

            // Automatically set the last user's ratio to the remaining percentage
            if (total < 100) {
                const lastUser = selectedUsers[selectedUsers.length - 1];
                if (lastUser.accountId !== memberId) {
                    updatedRatios[lastUser.accountId] = Math.max(0, 100 - total);
                }
            } else if (total > 100) {
                const lastUser = selectedUsers[selectedUsers.length - 1];
                if (lastUser.accountId !== memberId) {
                    updatedRatios[lastUser.accountId] = Math.max(0, 100 - totalOthers - Number(num));
                }
            }

            return updatedRatios;
        });
    };

    const calculateRemainingRatio = (selectedUsers, ratios) => {
        const ids = selectedUsers.map(u => u.accountId);
        const total = ids.reduce((sum, accountId, i) => {
            if (i === ids.length - 1) return sum;
            return sum + (Number(ratios[accountId]) || 0);
        }, 0);
        const remain = 100 - total;
        return remain > 0 ? remain : 0;
    };

    const handleUserSelection = (member) => {
        const selected = selectedUsers.some(u => u.accountId === member.accountId);
        if (selected) {
            setSelectedUsers(selectedUsers.filter(u => u.accountId !== member.accountId));
        } else {
            setSelectedUsers([...selectedUsers, member]);
        }
    };

    const handleInputRatioChange = (member, val) => {
        let num = val.replace(/[^0-9]/g, '');
        const ids = selectedUsers.map(u => u.accountId);
        const totalOthers = ids.reduce((sum, accountId, i) => {
            if (accountId === member.accountId) return sum;
            if (i === ids.length - 1) return sum;
            return sum + (Number(ratios[accountId]) || 0);
        }, 0);
        const max = 100 - totalOthers;
        if (Number(num) > max) num = String(max);
        setRatios({ ...ratios, [member.accountId]: num });
    };

    if (!visible) return null;

    return (
        <View className='absolute inset-0 flex-1 justify-center items-center bg-black/40 px-4 z-50'>
            <View className='bg-white rounded-2xl p-5 w-full max-w-sm max-h-4/5'>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className='flex-row items-center justify-between mb-5'>
                        <TouchableOpacity onPress={onClose} className='w-8 h-8 items-center justify-center'>
                            <Ionicons name='close' size={22} color='#374151' />
                        </TouchableOpacity>
                        <Text className='text-lg font-semibold text-gray-900'>Thêm hoàn thuế</Text>
                        <View className='w-8' />
                    </View>

                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Tên sản phẩm/dịch vụ</Text>
                        <TextInput
                            value={productName}
                            onChangeText={setProductName}
                            placeholder='Nhập tên sản phẩm/dịch vụ'
                            className='text-gray-900 text-base py-2.5 border-b border-gray-300'
                        />
                    </View>

                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Số tiền gốc</Text>
                        <TextInput
                            value={originalAmount}
                            onChangeText={(text) => setOriginalAmount(formatPrice(text))}
                            placeholder='0'
                            keyboardType='numeric'
                            className='text-gray-900 text-base py-2.5 border-b border-gray-300'
                        />
                    </View>

                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Phần trăm hoàn thuế</Text>
                        <TextInput
                            value={refundPercent}
                            onChangeText={setRefundPercent}
                            placeholder='0'
                            keyboardType='numeric'
                            className='text-gray-900 text-base py-2.5 border-b border-gray-300'
                        />
                    </View>

                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Người hoàn thuế</Text>
                        <View className='flex-row flex-wrap gap-2'>
                            {groupMembers.map((member) => {
                                const selected = selectedRefunder?.accountId === member.accountId;
                                return (
                                    <TouchableOpacity
                                        key={member.accountId}
                                        onPress={() => setSelectedRefunder(member)}
                                        className='items-center'
                                        disabled={loading}
                                    >
                                        <View
                                            className='w-12 h-12 rounded-full overflow-hidden'
                                            style={{
                                                borderColor: selected ? '#6C63FF' : 'transparent',
                                                borderWidth: selected ? 2 : 0
                                            }}
                                        >
                                            <Image
                                                source={
                                                    member.email === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                        member.email === 'hhuy00355@gmail.com' ? hhuy :
                                                            member.email === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                                paavagl
                                                }
                                                className='w-full h-full'
                                                resizeMode='cover'
                                            />
                                        </View>
                                        <Text
                                            className={`text-xs mt-1 ${selected ? 'font-semibold' : 'text-gray-600'}`}
                                            style={{
                                                color: selected ? '#6C63FF' : '#6B7280'
                                            }}
                                        >
                                            {truncateText(member.email, 10)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Cách chia</Text>
                        <View className='flex-row flex-wrap gap-2 mb-3'>
                            {[{ value: 'KEEP', label: 'Giữ riêng' }, { value: 'EQUAL', label: 'Chia đều' }, { value: 'RATIO', label: 'Chia theo tỉ lệ' }].map(type => (
                                <TouchableOpacity
                                    key={type.value}
                                    onPress={() => {
                                        setSplitType(type.value);
                                        if (type.value === 'KEEP') {
                                            setSelectedUsers([]);
                                        } else if (groupMembers.length > 0) {
                                            setSelectedUsers(groupMembers);
                                        }
                                    }}
                                    className={`px-3 py-2 rounded-full ${splitType === type.value ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                >
                                    <Text className={`text-xs ${splitType === type.value ? 'text-white' : 'text-gray-700'}`}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {splitType !== 'KEEP' && (
                        <View className='mb-4'>
                            <Text className='text-gray-700 font-medium mb-2 text-sm'>Người nhận hoàn thuế</Text>
                            <View className='border-b border-gray-300 pb-3'>
                                <View className='flex-row flex-wrap gap-2'>
                                    {groupMembers.map((member) => {
                                        const selected = selectedUsers.some(u => u.accountId === member.accountId);
                                        const selectedList = selectedUsers.map(u => u.accountId);
                                        const isLast = selected && selectedList[selectedList.length - 1] === member.accountId;
                                        return (
                                            <TouchableOpacity
                                                key={member.accountId}
                                                onPress={() => handleUserSelection(member)}
                                                className='items-center'
                                                disabled={loading}
                                            >
                                                <View
                                                    className='w-12 h-12 rounded-full overflow-hidden'
                                                    style={{
                                                        borderColor: selected ? '#6C63FF' : 'transparent',
                                                        borderWidth: selected ? 2 : 0
                                                    }}
                                                >
                                                    <Image
                                                        source={
                                                            member.email === 'huynhcongminhtri79@gmail.com' ? hcmt :
                                                                member.email === 'hhuy00355@gmail.com' ? hhuy :
                                                                    member.email === 'trihcmse183799@fpt.edu.vn' ? trihcmse :
                                                                        paavagl
                                                        }
                                                        className='w-full h-full'
                                                        resizeMode='cover'
                                                    />
                                                </View>
                                                <Text
                                                    className={`text-xs mt-1 ${selected ? 'font-semibold' : 'text-gray-600'}`}
                                                    style={{
                                                        color: selected ? '#6C63FF' : '#6B7280'
                                                    }}
                                                >
                                                    {truncateText(member.email, 10)}
                                                </Text>
                                                {splitType === 'RATIO' && selected && (
                                                    isLast ? (
                                                        <Text className='border border-gray-300 rounded px-2 py-1 mt-1 text-xs w-14 text-center bg-gray-100'>
                                                            {calculateRemainingRatio(selectedUsers, ratios)}%
                                                        </Text>
                                                    ) : (
                                                        <View className='flex-row items-center'>
                                                            <TextInput
                                                                value={String(ratios[member.accountId] || '')}
                                                                onChangeText={val => handleInputRatioChange(member, val)}
                                                                placeholder='%'
                                                                keyboardType='numeric'
                                                                className='border border-gray-300 rounded px-2 py-1 mt-1 text-xs w-10 text-center'
                                                                editable={splitType === 'RATIO' && !loading}
                                                            />
                                                            <Text className='ml-1 text-xs text-gray-500'>%</Text>
                                                        </View>
                                                    )
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={handleAddTaxRefund}
                        className='bg-indigo-500 rounded-lg py-4 items-center'
                    >
                        <Text className='text-white font-semibold text-base'>Thêm hoàn thuế</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default AddTaxRefundModal;
