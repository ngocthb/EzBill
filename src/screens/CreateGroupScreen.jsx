import React, { useState } from 'react';
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
import axiosClient from '~/apis/axiosClient';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const CreateGroupScreen = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [fromDate, setFromDate] = useState(new Date()); // Ngày hiện tại
    const [toDate, setToDate] = useState(new Date()); // Ngày hiện tại
    const [budget, setBudget] = useState('');

    // State cho việc hiển thị DateTimePicker
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

    // State cho iOS modal
    const [currentPickerType, setCurrentPickerType] = useState(null);
    const [tempDate, setTempDate] = useState(new Date());

    // State cho Add Member Modal
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [isSelectingLeader, setIsSelectingLeader] = useState(false);

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


    const [members, setMembers] = useState([
    ]);

    // State cho trưởng nhóm
    const [groupLeader, setGroupLeader] = useState(null);

    // State cho quy đổi tiền tệ
    const [enableCurrencyConversion, setEnableCurrencyConversion] = useState(false);
    const [fromCurrency, setFromCurrency] = useState('VND');
    const [toCurrency, setToCurrency] = useState('USD');
    const [showFromCurrencyPicker, setShowFromCurrencyPicker] = useState(false);
    const [showToCurrencyPicker, setShowToCurrencyPicker] = useState(false);

    // Danh sách các loại tiền tệ
    const currencies = [
        {
            code: 'VND',
            name: 'Việt Nam Đồng',
            symbol: '₫',
            flag: '🇻🇳'
        },
        {
            code: 'USD',
            name: 'Đô la Mỹ',
            symbol: '$',
            flag: '🇺🇸'
        },
        {
            code: 'EUR',
            name: 'Euro',
            symbol: '€',
            flag: '🇪🇺'
        },
        {
            code: 'JPY',
            name: 'Yên Nhật',
            symbol: '¥',
            flag: '🇯🇵'
        },
        {
            code: 'GBP',
            name: 'Bảng Anh',
            symbol: '£',
            flag: '🇬🇧'
        },
        {
            code: 'AUD',
            name: 'Đô la Úc',
            symbol: 'A$',
            flag: '🇦🇺'
        },
        {
            code: 'CAD',
            name: 'Đô la Canada',
            symbol: 'C$',
            flag: '🇨🇦'
        },
        {
            code: 'CHF',
            name: 'Franc Thụy Sĩ',
            symbol: 'CHF',
            flag: '🇨🇭'
        },
        {
            code: 'CNY',
            name: 'Nhân dân tệ',
            symbol: '¥',
            flag: '🇨🇳'
        },
        {
            code: 'KRW',
            name: 'Won Hàn Quốc',
            symbol: '₩',
            flag: '🇰🇷'
        }
    ];

    const handleBack = () => {
        navigation.goBack();
    };

    // Hàm format số tiền
    const formatCurrency = (value) => {
        // Loại bỏ tất cả ký tự không phải số
        const numericValue = value.replace(/[^0-9]/g, '');

        // Nếu không có số nào, trả về chuỗi rỗng
        if (!numericValue) return '';

        // Thêm dấu phẩy vào số
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // Hàm xử lý khi thay đổi budget
    const handleBudgetChange = (value) => {
        const formattedValue = formatCurrency(value);
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
            const fromCurrencyData = getSelectedFromCurrency();
            const toCurrencyData = getSelectedToCurrency();
            if (enableCurrencyConversion) {
                console.log('Quy đổi tiền tệ:', `${fromCurrencyData?.name} → ${toCurrencyData?.name}`);
                console.log('Tỷ giá:', getExchangeRate());
            } else {
                console.log('Quy đổi tiền tệ: Không sử dụng');
            }
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
                    "accountId": member.id,
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
                navigation.navigate('Summary');
                setTitle('');
                setFromDate(new Date());
                setToDate(new Date());
                setBudget('');
                setMembers([]);
                setGroupLeader(null);
                setEnableCurrencyConversion(false);
                setFromCurrency('VND');
                setToCurrency('USD');
                setShowAddMemberModal(false);
                setIsSelectingLeader(false);
                setShowFromCurrencyPicker(false);
                setShowToCurrencyPicker(false);

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
        if (isSelectingLeader) {
            // Nếu đang chọn trưởng nhóm
            setGroupLeader(selectedMember);
            setIsSelectingLeader(false);
        } else {
            // Nếu đang chọn thành viên thường
            // Kiểm tra xem thành viên đã có trong danh sách chưa
            const isAlreadyMember = members.some(member => member.id === selectedMember.id);

            if (!isAlreadyMember) {
                setMembers([...members, selectedMember]);
            }
        }

        setShowAddMemberModal(false);
    };

    const handleCloseAddMemberModal = () => {
        setShowAddMemberModal(false);
        setIsSelectingLeader(false);
    };

    const handleRemoveMember = (memberId) => {
        setMembers(members.filter(member => member.id !== memberId));
    };

    const handleFromCurrencyChange = (currencyCode) => {
        setFromCurrency(currencyCode);

        // Nếu chọn trùng với toCurrency, tự động đổi toCurrency sang VND hoặc USD
        if (currencyCode === toCurrency) {
            setToCurrency(currencyCode === 'VND' ? 'USD' : 'VND');
        }

        setShowFromCurrencyPicker(false);
    };

    const handleToCurrencyChange = (currencyCode) => {
        setToCurrency(currencyCode);

        // Nếu chọn trùng với fromCurrency, tự động đổi fromCurrency sang VND hoặc USD
        if (currencyCode === fromCurrency) {
            setFromCurrency(currencyCode === 'VND' ? 'USD' : 'VND');
        }

        setShowToCurrencyPicker(false);
    };

    const handleSwapCurrencies = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    const getSelectedFromCurrency = () => {
        return currencies.find(currency => currency.code === fromCurrency);
    };

    const getSelectedToCurrency = () => {
        return currencies.find(currency => currency.code === toCurrency);
    };

    const getExchangeRate = () => {
        // Mock exchange rates - có thể kết nối API thực tế
        const rates = {
            'VND_USD': '1 USD ≈ 24,000 VND',
            'USD_VND': '1 USD ≈ 24,000 VND',
            'VND_EUR': '1 EUR ≈ 26,000 VND',
            'EUR_VND': '1 EUR ≈ 26,000 VND',
            'VND_JPY': '1 JPY ≈ 160 VND',
            'JPY_VND': '1 JPY ≈ 160 VND',
            'VND_GBP': '1 GBP ≈ 30,000 VND',
            'GBP_VND': '1 GBP ≈ 30,000 VND',
            'VND_VND': '1 VND = 1 VND',
            'USD_EUR': '1 USD ≈ 0.92 EUR',
            'EUR_USD': '1 EUR ≈ 1.08 USD'
        };
        return rates[`${fromCurrency}_${toCurrency}`] || 'Tỷ giá không có sẵn';
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
                className='flex-row items-center px-4 pt-10 pb-4'
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
                        style={{ marginRight: 10 }}
                    />
                    <Text className='text-2xl font-bold text-text-title '>
                        Tạo Nhóm
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className='flex-1 px-6' contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Tên nhóm */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Tên nhóm
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder='Nhập tên nhóm'
                        className='bg-white rounded-xl px-4 py-4 text-2xl text-gray-900 font-bold shadow-md'

                    />
                </View>

                {/* Thời gian */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Thời gian
                    </Text>

                    <View className='flex-row gap-4' >
                        <TouchableOpacity
                            onPress={() => openPicker('fromDate')}
                            className='flex-1 bg-white rounded-xl px-4 py-4 shadow-md'

                        >
                            <Text className='text-xs text-gray-500 mb-1'>Từ ngày</Text>
                            <Text className='text-primary font-medium'>
                                {formatDate(fromDate)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => openPicker('toDate')}
                            className='flex-1 bg-white rounded-xl px-4 py-4 shadow-md'

                        >
                            <Text className='text-xs text-gray-500 mb-1'>Đến ngày</Text>
                            <Text className='text-primary font-medium'>
                                {formatDate(toDate)}
                            </Text>
                            {toDate < fromDate && (
                                <Text className='text-red-500 text-xs mt-1'>
                                    Đến ngày phải sau từ ngày
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Budget */}
                <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Ngân sách dự kiến
                    </Text>
                    <TextInput
                        value={budget}
                        onChangeText={handleBudgetChange}
                        placeholder='VD: 5,000,000'
                        keyboardType='numeric'
                        className='bg-white rounded-xl px-4 py-4 text-base text-gray-900 shadow-md'

                    />
                    <Text className='text-xs text-gray-500 mt-2'>
                        Nhập số tiền dự kiến cho chuyến đi (không bắt buộc)
                    </Text>
                </View>

                {/* Trưởng nhóm */}
                {/* <View className='mb-6'>
                    <Text className='text-base font-medium text-gray-900 mb-3'>
                        Trưởng nhóm
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setIsSelectingLeader(true);
                            setShowAddMemberModal(true);
                        }}
                        className='flex-row items-center bg-white rounded-xl px-4 py-4 shadow-md'
                       
                        <View className='w-12 h-12 rounded-full mr-3 items-center justify-center overflow-hidden'
                            style={{ backgroundColor: '#E8E8E8' }}>
                            <Image
                                source={{
                                    uri: groupLeader?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                                }}
                                className='w-full h-full'
                                resizeMode='cover'
                            />
                        </View>
                        <View className='flex-1'>
                            <Text className='text-gray-900 font-medium text-base'>
                                {groupLeader?.name || 'Chọn trưởng nhóm'}
                            </Text>
                            <Text className='text-gray-500 text-sm'>
                                {groupLeader ? 'Group Admin' : 'Nhấn để chọn trưởng nhóm'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View> */}

                {/* Quy đổi tiền tệ */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-base font-medium text-gray-900">
                            Quy đổi tiền tệ
                        </Text>

                        <Switch
                            value={enableCurrencyConversion}
                            onValueChange={setEnableCurrencyConversion}
                            trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {enableCurrencyConversion && (
                        <>
                            <View className="flex-row items-center gap-4">
                                {/* From Currency */}
                                <TouchableOpacity
                                    onPress={() => setShowFromCurrencyPicker(true)}
                                    className="flex-1 bg-white rounded-xl px-4 py-4 shadow-md"
                                >
                                    <Text className="text-xs text-gray-500 mb-1">Từ</Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-lg mr-2">{getSelectedFromCurrency()?.flag}</Text>
                                        <View className="flex-1">
                                            <Text className="text-base font-medium text-gray-900">
                                                {getSelectedFromCurrency()?.code}
                                            </Text>
                                            <Text className="text-xs text-gray-500" numberOfLines={1}>
                                                {getSelectedFromCurrency()?.name}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                    </View>
                                </TouchableOpacity>

                                {/* Swap Button */}
                                <TouchableOpacity
                                    onPress={handleSwapCurrencies}
                                    className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="swap-horizontal" size={20} color="#6C63FF" />
                                </TouchableOpacity>

                                {/* To Currency */}
                                <TouchableOpacity
                                    onPress={() => setShowToCurrencyPicker(true)}
                                    className="flex-1 bg-white rounded-xl px-4 py-4 shadow-md"
                                >
                                    <Text className="text-xs text-gray-500 mb-1">Sang</Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-lg mr-2">{getSelectedToCurrency()?.flag}</Text>
                                        <View className="flex-1">
                                            <Text className="text-base font-medium text-gray-900">
                                                {getSelectedToCurrency()?.code}
                                            </Text>
                                            <Text className="text-xs text-gray-500" numberOfLines={1}>
                                                {getSelectedToCurrency()?.name}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Exchange Rate */}
                            <View className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <Text className="text-xs text-primary text-center">
                                    Tỷ giá: {getExchangeRate()}
                                </Text>
                            </View>
                        </>
                    )}
                </View>


                {/* Mời thành viên */}
                <View className='mb-8'>
                    <Text className='text-base font-medium text-gray-900 mb-4'>
                        Mời thành viên
                    </Text>

                    <View className='flex-row flex-wrap' style={{ gap: 16 }}>
                        {/* Hiển thị các thành viên hiện tại */}
                        {members.map((member, index) => (
                            <TouchableOpacity
                                key={member.id}
                                className='relative'
                                onPress={() => handleRemoveMember(member.id)}
                            >
                                <View className='w-14 h-14 rounded-full overflow-hidden'
                                    style={{ backgroundColor: '#4A5568' }}>
                                    <Image
                                        source={{ uri: member.avatar }}
                                        className='w-full h-full'
                                        resizeMode='cover'
                                    />
                                </View>
                                <View className='absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center border border-white'>
                                    <Text className='text-white text-xs font-bold'>-</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Nút Add Member */}
                        <TouchableOpacity
                            onPress={handleAddMember}
                            className='w-14 h-14 rounded-full border-2 border-dashed border-gray-400 items-center justify-center bg-gray-50'
                        >
                            <Text className='text-gray-400 text-2xl font-light'>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleGenerate}
                    className='bg-primary py-4 rounded-2xl mb-8'
                >
                    <View className='flex-row items-center justify-center'>
                        <Text className='text-text-button text-center text-lg font-bold mr-1'>
                            TẠO NHÓM
                        </Text>
                        <Ionicons name='chevron-forward-outline' size={20} color='#FFFFFF' />
                    </View>

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
                    <View className='flex-1 justify-end bg-black bg-opacity-50'>
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

            {/* From Currency Picker Modal */}
            {showFromCurrencyPicker && enableCurrencyConversion && (
                <View className='absolute inset-0 bg-black/40 bg-opacity-50 flex-1 justify-end' style={{ zIndex: 1000 }}>
                    <View
                        className='bg-white rounded-t-3xl'
                        style={{
                            height: height * 0.6,
                            paddingTop: Platform.OS === 'ios' ? 20 : 15
                        }}
                    >
                        {/* Header */}
                        <View className='flex-row items-center justify-between px-6 pb-4'>
                            <View className='w-8' />
                            <Text className='text-lg font-bold text-gray-900'>
                                Chọn tiền tệ gốc
                            </Text>
                            <TouchableOpacity onPress={() => setShowFromCurrencyPicker(false)} className='p-2'>
                                <Ionicons name='close' size={24} color='#6B7280' />
                            </TouchableOpacity>
                        </View>

                        {/* Currency List */}
                        <ScrollView
                            className='flex-1 px-6'
                            showsVerticalScrollIndicator={false}
                        >
                            {currencies.map((currency) => {
                                const isDisabled = currency.code === toCurrency;
                                return (
                                    <TouchableOpacity
                                        key={currency.code}
                                        onPress={() => !isDisabled && handleFromCurrencyChange(currency.code)}
                                        className={`flex-row items-center py-4 px-4 rounded-xl mb-3 ${fromCurrency === currency.code
                                            ? 'bg-blue-50 border-2 border-blue-200'
                                            : isDisabled
                                                ? 'bg-gray-100 border border-gray-200 opacity-50'
                                                : 'bg-gray-50 border border-gray-200'
                                            }`}
                                        disabled={isDisabled}
                                    >
                                        <Text className='text-2xl mr-4'>{currency.flag}</Text>
                                        <View className='flex-1'>
                                            <Text className={`font-semibold text-base ${fromCurrency === currency.code
                                                ? 'text-blue-900'
                                                : isDisabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-900'
                                                }`}>
                                                {currency.code} - {currency.name}
                                            </Text>
                                            <Text className={`text-sm ${fromCurrency === currency.code
                                                ? 'text-blue-700'
                                                : isDisabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-600'
                                                }`}>
                                                {isDisabled ? 'Đã chọn làm tiền tệ đích' : `Ký hiệu: ${currency.symbol}`}
                                            </Text>
                                        </View>
                                        {fromCurrency === currency.code && (
                                            <Ionicons name='checkmark-circle' size={24} color='#6C63FF' />
                                        )}
                                        {isDisabled && (
                                            <Ionicons name='ban' size={24} color='#9CA3AF' />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            )}
            {showToCurrencyPicker && enableCurrencyConversion && (
                <View className='absolute inset-0 bg-black/40 bg-opacity-50 flex-1 justify-end' style={{ zIndex: 1000 }}>
                    <View
                        className='bg-white rounded-t-3xl'
                        style={{
                            height: height * 0.6,
                            paddingTop: Platform.OS === 'ios' ? 20 : 15
                        }}
                    >
                        {/* Header */}
                        <View className='flex-row items-center justify-between px-6 pb-4'>
                            <View className='w-8' />
                            <Text className='text-lg font-bold text-gray-900'>
                                Chọn tiền tệ đích
                            </Text>
                            <TouchableOpacity onPress={() => setShowToCurrencyPicker(false)} className='p-2'>
                                <Ionicons name='close' size={24} color='#6B7280' />
                            </TouchableOpacity>
                        </View>

                        {/* Currency List */}
                        <ScrollView
                            className='flex-1 px-6'
                            showsVerticalScrollIndicator={false}
                        >
                            {currencies.map((currency) => {
                                const isDisabled = currency.code === fromCurrency;
                                return (
                                    <TouchableOpacity
                                        key={currency.code}
                                        onPress={() => !isDisabled && handleToCurrencyChange(currency.code)}
                                        className={`flex-row items-center py-4 px-4 rounded-xl mb-3 ${toCurrency === currency.code
                                            ? 'bg-blue-50 border-2 border-blue-200'
                                            : isDisabled
                                                ? 'bg-gray-100 border border-gray-200 opacity-50'
                                                : 'bg-gray-50 border border-gray-200'
                                            }`}
                                        disabled={isDisabled}
                                    >
                                        <Text className='text-2xl mr-4'>{currency.flag}</Text>
                                        <View className='flex-1'>
                                            <Text className={`font-semibold text-base ${toCurrency === currency.code
                                                ? 'text-blue-900'
                                                : isDisabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-900'
                                                }`}>
                                                {currency.code} - {currency.name}
                                            </Text>
                                            <Text className={`text-sm ${toCurrency === currency.code
                                                ? 'text-blue-700'
                                                : isDisabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-600'
                                                }`}>
                                                {isDisabled ? 'Đã chọn làm tiền tệ gốc' : `Ký hiệu: ${currency.symbol}`}
                                            </Text>
                                        </View>
                                        {toCurrency === currency.code && (
                                            <Ionicons name='checkmark-circle' size={24} color='#6C63FF' />
                                        )}
                                        {isDisabled && (
                                            <Ionicons name='ban' size={24} color='#9CA3AF' />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
};

export default CreateGroupScreen;
