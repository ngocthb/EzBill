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
    Platform,
    Modal,
    Switch, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import bg1 from '../../assets/images/bg1.png';
import { StepSelector, AddMemberModal } from '../components';
import { useAIChat } from '../contexts/AIChatContext';
import { formatPrice } from '../utils/formatUtils';
import axiosClient from '~/apis/axiosClient';
import Toast from 'react-native-toast-message';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';
const { width, height } = Dimensions.get('window');

const CreateGroupScreen = () => {
    const navigation = useNavigation();
    const { toggleAIChat } = useAIChat();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [fromDate, setFromDate] = useState(new Date()); // Ngày hiện tại
    const [toDate, setToDate] = useState(new Date()); // Ngày hiện tại
    const [budget, setBudget] = useState('');
    const [user, setUser] = useState(null);
    // State cho việc hiển thị DateTimePicker
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    // State cho iOS modal
    const [currentPickerType, setCurrentPickerType] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());

    // State cho Add Member Modal
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [isSelectingLeader, setIsSelectingLeader] = useState(false);

    // Danh sách ban đầu của tất cả thành viên có thể thêm
    const initialAvailableMembers = [
        {
            accountId: "ccb3ef34-021f-4f54-9007-2fd47fffdb1d",
            email: "huynhcongminhtri79",
            status: "ACTIVE"
        },
        {
            accountId: "2179fd2a-fc41-4baa-882a-fe27e4b16d0b",
            email: "trihcmse183799",
            status: "ACTIVE"
        },
        {
            accountId: "011e8d39-2705-4cfc-a6d7-103f2f8abbbe",
            email: "paavagl19",
            status: "ACTIVE"
        },
        {
            accountId: "cf0ab205-f29e-4fa8-b182-7c38262a5281",
            email: "hhuy00355",
            status: "ACTIVE"
        }
    ];

    // Danh sách tất cả thành viên có thể thêm
    const [availableMembers, setAvailableMembers] = useState(initialAvailableMembers);

    const [members, setMembers] = useState([
    ]);



    const handleBack = () => {
        navigation.goBack();
    };

    // Hàm xử lý khi thay đổi budget
    const handleBudgetChange = (value) => {
        const formattedValue = formatPrice(value);
        setBudget(formattedValue);
    };

    // Hàm định dạng ngày cho log (YYYY-MM-DD)
    const formatDateForLog = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Hàm định dạng ngày cho hiển thị (DD/MM/YYYY)
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Hàm xử lý khi chọn ngày
    const onFromDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowFromDatePicker(false);
        }
        if (selectedDate) {
            // Đảm bảo không chọn ngày trước hôm nay
            if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
                return;
            }
            setFromDate(selectedDate);
            // Nếu từ ngày sau đến ngày, tự động cập nhật đến ngày
            if (selectedDate > toDate) {
                setToDate(selectedDate);
            }
        }
    };

    const onToDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowToDatePicker(false);
        }
        if (selectedDate) {
            // Đảm bảo không chọn ngày trước từ ngày
            if (selectedDate < fromDate) {
                return;
            }
            setToDate(selectedDate);
        }
    };

    // Hàm xử lý cho iOS modal
    const handleIOSPickerChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const confirmIOSPicker = () => {
        switch (currentPickerType) {
            case 'fromDate':
                // Đảm bảo không chọn ngày trước hôm nay
                if (tempDate < new Date().setHours(0, 0, 0, 0)) {
                    return;
                }
                setFromDate(tempDate);
                // Nếu từ ngày sau đến ngày, tự động cập nhật đến ngày
                if (tempDate > toDate) {
                    setToDate(tempDate);
                }
                break;
            case 'toDate':
                // Đảm bảo không chọn ngày trước từ ngày
                if (tempDate < fromDate) {
                    return;
                }
                setToDate(tempDate);
                break;
        }
        setCurrentPickerType(null);
    };

    const cancelIOSPicker = () => {
        setCurrentPickerType(null);
    };

    // Hàm mở picker
    const openPicker = (type) => {
        if (Platform.OS === 'ios') {
            switch (type) {
                case 'fromDate':
                    setTempDate(fromDate);
                    break;
                case 'toDate':
                    setTempDate(toDate);
                    break;
            }
            setCurrentPickerType(type);
        } else {
            // Android
            switch (type) {
                case 'fromDate':
                    setShowFromDatePicker(true);
                    break;
                case 'toDate':
                    setShowToDatePicker(true);
                    break;
            }
        }
    };

    const handleGenerate = async () => {
        try {
            setIsLoading(true);
            if (members.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Không thể tạo nhóm',
                    text2: 'Vui lòng mời ít nhất một thành viên vào nhóm!'
                });
                return;
            }

            const data = {
                "tripName": title || 'Chuyến đi mới',
                "startDate": formatDateForLog(fromDate),
                "endDate": formatDateForLog(toDate),
                "budget": budget ? parseFloat(budget.replace(/,/g, '')) : null,
                "tripMember": members.map(member => ({
                    "accountId": member.accountId,
                    "amount": null
                }))
            }

            const response = await axiosClient.post('trip', data)

            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Tạo nhóm thành công',
                    text2: 'Nhóm của bạn đã được tạo thành công!'
                });
                const tripId = response.data.tripId;
                navigation.navigate('Summary', { tripId });
                setTitle('');
                setFromDate(new Date());
                setToDate(new Date());
                setBudget('');
                setMembers([]);
                setShowAddMemberModal(false);
                setIsSelectingLeader(false);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi khi tạo nhóm',
                    text2: 'Vui lòng thử lại sau!'
                });

            }

            // navigation.navigate('Summary');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi khi tạo nhóm',
                text2: 'Vui lòng thử lại sau!'
            });

        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = () => {
        setShowAddMemberModal(true);
    };

    const handleSelectMember = (selectedMember) => {
        // Add member to group with correct structure
        const newMember = {
            accountId: selectedMember.accountId,
            email: selectedMember.email,
            status: selectedMember.status || "ACTIVE"
        };

        setMembers(prevMembers => [...prevMembers, newMember]);
        setAvailableMembers(prevAvailable =>
            prevAvailable.filter(member => member.accountId !== selectedMember.accountId)
        );
        setShowAddMemberModal(false);
    };

    const handleCloseAddMemberModal = () => {
        setShowAddMemberModal(false);
        setIsSelectingLeader(false);
    };

    const handleRemoveMember = (memberId) => {
        // Prevent removing the logged-in user
        if (user && memberId === user.accountId) return;

        // Find the member to remove
        const memberToRemove = members.find(member => member.accountId === memberId);
        if (!memberToRemove) return;

        // Remove the member from the group
        setMembers(prevMembers =>
            prevMembers.filter(member => member.accountId !== memberId)
        );

        // Add the removed member back to availableMembers with correct structure
        const availableMember = {
            accountId: memberToRemove.accountId,
            email: memberToRemove.email,
            status: memberToRemove.status || "ACTIVE"
        };

        setAvailableMembers(prevAvailable => [...prevAvailable, availableMember]);
    };

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Đảm bảo user login luôn nằm trong nhóm
    useEffect(() => {
        if (user && user.accountId) {
            const isInMembers = members.some(m => m.accountId === user.accountId);
            if (!isInMembers) {
                const userMember = {
                    accountId: user.accountId,
                    email: user.email || user.name || 'Bạn',
                    status: "ACTIVE"
                };
                setMembers(prevMembers => [userMember, ...prevMembers]);
            }
        }
    }, [user]);

    // Cập nhật lại danh sách thành viên có sẵn khi có sự thay đổi về user hoặc members
    useEffect(() => {
        if (user && user.accountId) {
            // Filter out the logged-in user and existing group members from availableMembers
            const filteredMembers = initialAvailableMembers.filter(member =>
                member.accountId !== user.accountId &&
                !members.some(m => m.accountId === member.accountId)
            );

            setAvailableMembers(filteredMembers);
        }
    }, [user, members]);
    console.log(members);
    return (
        <View className='flex-1  bg-bg-default'>
            <StatusBar barStyle="light-content" />
            <View className="absolute bottom-0 left-0 right-0" style={{ zIndex: 0 }}>
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                        opacity: 1,
                        transform: [{ translateY: -height * 0.1 }],

                    }}
                    resizeMode="cover"
                />
            </View>
            {/* Modern Gradient Header */}
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
                            onPress={handleBack}
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
                            <Text className="text-white text-2xl font-bold">Tạo nhóm</Text>
                            <Text className="text-white/80 text-sm mt-1">Thiết lập chuyến đi mới</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>


            <ScrollView
                className='flex-1 px-5'
                contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Group Name Card */}
                <View className='mb-6 bg-white rounded-3xl p-6 shadow-sm' style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                }}>
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center mr-3">
                            <Ionicons name="people" size={20} color="#667eea" />
                        </View>
                        <Text className='text-lg font-bold text-gray-900'>
                            Tên nhóm
                        </Text>
                    </View>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Nhập tên nhóm của bạn'
                        placeholderTextColor='#9CA3AF'
                        className='bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-900 font-medium'
                        style={{
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    />
                </View>

                {/* Time Period Card */}
                <View className='mb-6 bg-white rounded-3xl p-6 shadow-sm' style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                }}>
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                            <Ionicons name="calendar" size={20} color="#3B82F6" />
                        </View>
                        <Text className='text-lg font-bold text-gray-900'>
                            Thời gian chuyến đi
                        </Text>
                    </View>

                    <View className='flex-row gap-4'>
                        <TouchableOpacity
                            onPress={() => openPicker('fromDate')}
                            className='flex-1 bg-gray-50 rounded-2xl px-4 py-4'
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                            }}
                        >
                            <Text className='text-xs text-gray-500 mb-2 font-medium'>Từ ngày</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#667eea" style={{ marginRight: 8 }} />
                                <Text className='text-purple-600 font-semibold text-base'>
                                    {formatDate(fromDate)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openPicker('toDate')}
                            className='flex-1 bg-gray-50 rounded-2xl px-4 py-4'
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                            }}
                        >
                            <Text className='text-xs text-gray-500 mb-2 font-medium'>Đến ngày</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={16} color="#667eea" style={{ marginRight: 8 }} />
                                <Text className='text-purple-600 font-semibold text-base'>
                                    {formatDate(toDate)}
                                </Text>
                            </View>
                            {toDate < fromDate && (
                                <Text className='text-red-500 text-xs mt-2 font-medium'>
                                    Đến ngày phải sau từ ngày
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Budget Card */}
                <View className='mb-6 bg-white rounded-3xl p-6 shadow-sm' style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                }}>
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-green-100 rounded-2xl items-center justify-center mr-3">
                            <Ionicons name="wallet" size={20} color="#10B981" />
                        </View>
                        <Text className='text-lg font-bold text-gray-900'>
                            Ngân sách dự kiến
                        </Text>
                    </View>
                    <TextInput
                        value={budget}
                        onChangeText={handleBudgetChange}
                        placeholder='VD: 5,000,000'
                        keyboardType='numeric'
                        placeholderTextColor='#9CA3AF'
                        className='bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-900 font-medium'
                        style={{
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                        }}
                    />
                    <Text className='text-sm text-gray-500 mt-3 font-medium'>
                        Nhập số tiền dự kiến cho chuyến đi (không bắt buộc)
                    </Text>
                </View>




                {/* Members Card */}
                <View className='mb-8 bg-white rounded-3xl p-6 shadow-sm' style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                }}>
                    <View className="flex-row items-center mb-5">
                        <View className="w-10 h-10 bg-pink-100 rounded-2xl items-center justify-center mr-3">
                            <Ionicons name="person-add" size={20} color="#EC4899" />
                        </View>
                        <View className="flex-1">
                            <Text className='text-lg font-bold text-gray-900'>
                                Mời thành viên
                            </Text>
                            <Text className='text-sm text-gray-500 font-medium'>
                                {members.length} thành viên được chọn
                            </Text>
                        </View>
                    </View>

                    <View className='flex-row flex-wrap' style={{ gap: 16 }}>
                        {members.map((member, index) => (
                            <TouchableOpacity
                                key={member.accountId}
                                className='relative'
                                onPress={() => handleRemoveMember(member.accountId)}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                }}
                            >
                                <View className='w-16 h-16 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400'>
                                    <Image
                                        source={
                                            member.email === 'paavagl19' ? paavagl :
                                                member.email === 'hhuy00355' ? hhuy :
                                                    member.email === 'trihcmse183799' ? trihcmse :
                                                        hcmt
                                        }
                                        style={{
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        resizeMode='cover'
                                    />
                                </View>
                                {member.accountId !== user?.accountId && (
                                    <View className='absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center border-2 border-white' style={{
                                        shadowColor: '#EF4444',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                    }}>
                                        <Ionicons name="remove" size={12} color="white" />
                                    </View>
                                )}
                                {member.accountId === user?.accountId && (
                                    <View className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full items-center justify-center border-2 border-white' style={{
                                        shadowColor: '#10B981',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                    }}>
                                        <Ionicons name="checkmark" size={12} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={handleAddMember}
                            className='w-16 h-16 rounded-3xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50'
                            style={{
                                borderColor: '#667eea',
                                backgroundColor: '#f8faff',
                            }}
                        >
                            <Ionicons name="add" size={24} color="#667eea" />
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Create Group Button */}
                <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={isLoading}
                    style={{
                        shadowColor: '#667eea',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        borderRadius: 24,
                    }}
                >
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: 12,
                        }}
                    >
                        <View className='flex-row items-center justify-center'>

                            <Text className='text-white font-semibold py-4 text-base'>
                                TẠO NHÓM
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* Android DateTimePicker */}
            {Platform.OS === 'android' && showFromDatePicker && (
                <DateTimePicker
                    testID="fromDatePicker"
                    value={fromDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()} // Không cho chọn ngày trước hôm nay
                    onChange={onFromDateChange}
                />
            )}

            {Platform.OS === 'android' && showToDatePicker && (
                <DateTimePicker
                    testID="toDatePicker"
                    value={toDate}
                    mode="date"
                    display="default"
                    minimumDate={fromDate} // Không cho chọn ngày trước từ ngày
                    onChange={onToDateChange}
                />
            )}

            {/* iOS Modal DateTimePicker */}
            {Platform.OS === 'ios' && currentPickerType && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={currentPickerType !== null}
                    onRequestClose={cancelIOSPicker}
                >
                    <View className='flex-1 justify-end bg-black/40 bg-opacity-50'>
                        <View className='bg-white rounded-t-3xl pb-10'>
                            {/* Header */}
                            <View className='flex-row justify-between items-center px-5 pt-5 pb-3 border-b border-gray-200'>
                                <TouchableOpacity onPress={cancelIOSPicker}>
                                    <Text className='text-primary text-base'>Hủy</Text>
                                </TouchableOpacity>
                                <Text className='text-lg font-bold text-gray-800'>
                                    {currentPickerType === 'fromDate' && 'Chọn ngày bắt đầu'}
                                    {currentPickerType === 'toDate' && 'Chọn ngày kết thúc'}
                                </Text>
                                <TouchableOpacity onPress={confirmIOSPicker}>
                                    <Text className='text-primary text-base font-bold'>Xong</Text>
                                </TouchableOpacity>
                            </View>

                            {/* DateTimePicker */}
                            <DateTimePicker
                                testID="iOSDateTimePicker"
                                value={tempDate}
                                mode="date"
                                display="spinner"
                                minimumDate={currentPickerType === 'fromDate' ? new Date() : fromDate}
                                onChange={handleIOSPickerChange}
                                style={{ height: 200 }}
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* Add Member Modal */}
            <AddMemberModal
                visible={showAddMemberModal}
                onClose={handleCloseAddMemberModal}
                onSelectMember={handleSelectMember}
                availableMembers={availableMembers}
                selectedMembers={members}
                isSelectingLeader={isSelectingLeader}
            />
        </View>
    );
};

export default CreateGroupScreen;
