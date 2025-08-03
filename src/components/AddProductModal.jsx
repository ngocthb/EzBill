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
import { EXCHANGE_RATE_API_KEY } from '@env';
import axios from 'axios';
import hcmt from '../../assets/images/hcmt.png';
import hhuy from '../../assets/images/hhuy.webp';
import trihcmse from '../../assets/images/trihcmse.webp';
import paavagl from '../../assets/images/paavagl.webp';
const AddProductModal = ({
    visible,
    onClose,
    onAddProduct,
    groupMembers,
    tripId
}) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [splitType, setSplitType] = useState(1); // 0: người trả bao luôn, 1: chia đều, 2: chia tỉ lệ
    const [ratios, setRatios] = useState({});
    const [currency, setCurrency] = useState('VND');
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(1);
    const currencies = [
        { code: 'VND', name: 'Việt Nam Đồng', symbol: '₫' },
        { code: 'USD', name: 'Đô la Mỹ', symbol: '$' }
    ];

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh');
            return false;
        }
        return true;
    };

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập camera để chụp ảnh');
            return false;
        }
        return true;
    };

    const pickProductImageFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled) {
            setProductImage(result.assets[0].uri);
            setShowImagePicker(false);
        }
    };

    const takeProductPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần quyền truy cập', 'Ứng dụng cần quyền truy cập camera để chụp ảnh');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled) {
            setProductImage(result.assets[0].uri);
            setShowImagePicker(false);
        }
    };

    const fetchExchangeRate = async () => {
        try {
            const response = await axios.get(`https://api.getgeoapi.com/v2/currency/convert?api_key=${EXCHANGE_RATE_API_KEY}&from=USD&to=VND&amount=1&format=json`)
            setExchangeRate(response.data.rates.VND.rate);
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể lấy tỷ giá hối đoái. Vui lòng thử lại sau.'
            });
            return 1;
        }

    };


    const handleAddProduct = async () => {
        try {
            setLoading(true);

            if (!productName.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Tên sản phẩm không được để trống.'
                });
                return;
            }
            if (!productPrice.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Giá tiền không được để trống.'
                });
                return;
            }
            if (!selectedPayer) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Vui lòng chọn người trả tiền.'
                });
                return;
            }
            if (selectedUsers.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Vui lòng chọn ít nhất một người sử dụng.'
                });
                return;
            }

            let imageUrl = null;
            if (productImage) {
                const imageObj = {
                    uri: productImage,
                    mimeType: 'image/jpeg',
                    fileName: 'product.jpg',
                };
                imageUrl = await uploadImageToCloudinary(imageObj);
            }

            // Build eventUses array
            let eventUses = [];
            if (splitType === 0) {
                // Người trả bao luôn
                eventUses = selectedUsers.map(u => ({ accountId: u.accountId, ratio: u.accountId === selectedPayer.accountId ? 100 : 0 }));
            } else if (splitType === 1) {
                // Chia đều
                const ratio = Math.floor(100 / selectedUsers.length);
                eventUses = selectedUsers.map(u => ({ accountId: u.accountId, ratio }));
            } else if (splitType === 2) {
                // Chia tỉ lệ
                const ids = selectedUsers.map(u => u.accountId);
                eventUses = ids.map((id, idx) => {
                    if (idx === ids.length - 1) {
                        // Người cuối cùng lấy phần còn lại
                        const total = ids.reduce((sum, uid, i) => {
                            if (i === ids.length - 1) return sum;
                            return sum + (Number(ratios[uid]) || 0);
                        }, 0);
                        return { accountId: id, ratio: 100 - total };
                    }
                    return { accountId: id, ratio: Number(ratios[id]) || 0 };
                });
            }

            const newBill = {
                id: Date.now().toString(),
                tripId: tripId,
                eventName: productName,
                eventDescription: "",
                eventDate: formatDateToISO(),
                receiptUrl: imageUrl,
                paidBy: selectedPayer.accountId || selectedPayer.id,
                currency: currency,
                amountOriginal: parseFormattedPrice(productPrice),
                exchangeRate: currency === 'USD' ? exchangeRate : 1,
                splitType: splitType,
                eventUses: eventUses
            };

            console.log('New Bill Data:', newBill);

            const response = await axiosClient.post('Event', newBill);

            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Yay!',
                    text2: 'Hóa đơn đã được lưu thành công.'
                });

                onAddProduct({
                    eventId: response.data.eventId,
                    eventName: productName,
                    eventDescription: "",
                    eventDate: formatDateToISO(),
                    paidBy: selectedPayer.accountId || selectedPayer.id,
                    amountInTripCurrency: response.data.totalAmount,
                    beneficiaries: response.data.beneficiaries,
                });

                // Reset form
                setProductName('');
                setProductPrice('');
                setSelectedPayer(null);
                setSelectedUsers([]);
                setProductImage(null);
                setShowImagePicker(false);
                setCurrency('VND'); // Reset currency to default
                setShowCurrencyPicker(false);
                onClose();
            }



        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Lỗi khi lưu hóa đơn. Vui lòng thử lại sau.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form
        setProductName('');
        setProductPrice('');
        setSelectedPayer(null);
        setSelectedUsers([]);
        setProductImage(null);
        setShowImagePicker(false);
        setCurrency('VND'); // Reset currency to default
        setShowCurrencyPicker(false);
        onClose();
    };


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

    useEffect(() => {
        fetchUserData();
        fetchExchangeRate();
    }, []);

    // Set default payer and users when modal opens and user/groupMembers are loaded
    useEffect(() => {
        if (visible && user && groupMembers.length > 0) {
            setSelectedPayer(user);
            setSelectedUsers(groupMembers);
        }
    }, [visible, user, groupMembers]);

    if (!visible) return null;

    return (
        <View className='absolute inset-0 flex-1 justify-center items-center bg-black/40 px-4 z-50'>
            <View className='bg-white rounded-2xl p-5 w-full max-w-sm max-h-4/5'>
                <ScrollView showsVerticalScrollIndicator={false} >
                    {/* Header */}
                    <View className='flex-row items-center justify-between mb-5'>
                        <TouchableOpacity
                            onPress={handleCancel}
                            className='w-8 h-8 items-center justify-center'
                        >
                            <Ionicons name='close' size={22} color='#374151' />
                        </TouchableOpacity>
                        <Text className='text-lg font-semibold text-gray-900'>
                            Hóa đơn mới
                        </Text>
                        <View className='w-8' />
                    </View>

                    {/* Tên sản phẩm */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>
                            Tên hóa đơn
                        </Text>
                        <TextInput
                            editable={!loading}
                            value={productName}
                            onChangeText={setProductName}
                            placeholder='Nhập tên sản phẩm'
                            placeholderTextColor='#9CA3AF'
                            className='text-gray-900 text-base py-2.5 border-b border-gray-300'
                        />
                    </View>

                    {/* Giá tiền */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>
                            Tổng tiền
                        </Text>
                        <View className='flex-row items-center border-b border-gray-300 py-2.5'>
                            <TextInput
                                value={productPrice}
                                onChangeText={(text) => setProductPrice(formatPrice(text))}
                                placeholder='0'
                                editable={!loading}
                                placeholderTextColor='#9CA3AF'
                                keyboardType='numeric'
                                className='flex-1 text-gray-900 text-base font-medium'
                            />
                            <TouchableOpacity
                                onPress={() => setShowCurrencyPicker(true)}
                                className='flex-row items-center ml-2 px-3 py-1 bg-gray-100 rounded-lg'
                                disabled={loading}
                            >
                                <Text className='text-gray-700 font-medium mr-1'>
                                    {currencies.find(c => c.code === currency)?.symbol}
                                </Text>
                                <Text className='text-gray-700 font-medium mr-1'>
                                    {currency}
                                </Text>
                                <Ionicons name="chevron-down" size={16} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Người trả tiền */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>
                            Người trả tiền
                        </Text>
                        <View className='border-b border-gray-300 pb-3'>
                            <View className='flex-row flex-wrap gap-2'>
                                {groupMembers.map((member) => (
                                    <TouchableOpacity
                                        key={member.accountId}
                                        onPress={() => setSelectedPayer(member)}
                                        className='items-center'
                                        disabled={loading}
                                    >
                                        <View className='w-12 h-12 rounded-full overflow-hidden' style={{
                                            borderColor: selectedPayer?.accountId === member.accountId ? '#6C63FF' : 'transparent',
                                            borderWidth: selectedPayer?.accountId === member.accountId ? 2 : 0
                                        }}>
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
                                            className={`text-xs mt-1 ${selectedPayer?.accountId === member.accountId ? 'font-semibold' : 'text-gray-600'}`}
                                            style={{
                                                color: selectedPayer?.accountId === member.accountId ? '#6C63FF' : '#6B7280'
                                            }}
                                        >
                                            {truncateText(member.email, 10)}
                                        </Text>

                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Người sử dụng & chia đều/ tỉ lệ */}
                    <View className='mb-4'>
                        <View className='flex-row items-center justify-between mb-2'>
                            <Text className='text-gray-700 font-medium text-sm'>Người sử dụng</Text>
                            <View className='flex-row gap-2'>
                                <TouchableOpacity
                                    onPress={() => setSplitType(0)}
                                    className={`px-3 py-1 rounded-full ${splitType === 0 ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                >
                                    <Text className={`text-xs ${splitType === 0 ? 'text-white' : 'text-gray-700'}`}>Bao luôn</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setSplitType(1)}
                                    className={`px-3 py-1 rounded-full ${splitType === 1 ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                >
                                    <Text className={`text-xs ${splitType === 1 ? 'text-white' : 'text-gray-700'}`}>Chia đều</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setSplitType(2)}
                                    className={`px-3 py-1 rounded-full ${splitType === 2 ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                >
                                    <Text className={`text-xs ${splitType === 2 ? 'text-white' : 'text-gray-700'}`}>Chia tỉ lệ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className='border-b border-gray-300 pb-3'>
                            <View className='flex-row flex-wrap gap-2'>
                                {groupMembers.map((member, idx) => {
                                    const selected = selectedUsers.some(u => u.accountId === member.accountId);
                                    // Chỉ lấy selectedUsers để xác định vị trí người cuối cùng
                                    const selectedList = selectedUsers.map(u => u.accountId);
                                    const isLast = selected && selectedList[selectedList.length - 1] === member.accountId;
                                    return (
                                        <TouchableOpacity
                                            key={member.accountId}
                                            disabled={loading}
                                            onPress={() => {
                                                if (selected) {
                                                    setSelectedUsers(selectedUsers.filter(u => u.accountId !== member.accountId));
                                                } else {
                                                    setSelectedUsers([...selectedUsers, member]);
                                                }
                                            }}
                                            className='items-center'
                                        >
                                            <View className='w-12 h-12 rounded-full overflow-hidden' style={{
                                                borderColor: selected ? '#6C63FF' : 'transparent',
                                                borderWidth: selected ? 2 : 0
                                            }}>
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
                                                style={{ color: selected ? '#6C63FF' : '#6B7280' }}
                                            >
                                                {truncateText(member.email, 10)}
                                            </Text>
                                            {splitType === 2 && selected && (
                                                isLast ? (
                                                    <Text className='border border-gray-300 rounded px-2 py-1 mt-1 text-xs w-14 text-center bg-gray-100'>
                                                        {(() => {
                                                            // Tính tỉ lệ còn lại cho người cuối cùng
                                                            const ids = selectedUsers.map(u => u.accountId);
                                                            const total = ids.reduce((sum, accountId, i) => {
                                                                if (i === ids.length - 1) return sum;
                                                                return sum + (Number(ratios[accountId]) || 0);
                                                            }, 0);
                                                            const remain = 100 - total;
                                                            return remain > 0 ? remain : 0;
                                                        })()}%
                                                    </Text>
                                                ) : (
                                                    <View className='flex-row items-center'>
                                                        <TextInput
                                                            value={String(ratios[member.accountId] || '')}
                                                            onChangeText={val => {
                                                                let num = val.replace(/[^0-9]/g, '');
                                                                // Giới hạn không vượt quá phần còn lại
                                                                const ids = selectedUsers.map(u => u.accountId);
                                                                const idxInSelected = ids.indexOf(member.accountId);
                                                                const totalOthers = ids.reduce((sum, accountId, i) => {
                                                                    if (accountId === member.accountId) return sum;
                                                                    if (i === ids.length - 1) return sum;
                                                                    return sum + (Number(ratios[accountId]) || 0);
                                                                }, 0);
                                                                const max = 100 - totalOthers;
                                                                if (Number(num) > max) num = String(max);
                                                                setRatios({ ...ratios, [member.accountId]: num });
                                                            }}
                                                            placeholder='%'
                                                            keyboardType='numeric'
                                                            className='border border-gray-300 rounded px-2 py-1 mt-1 text-xs w-10 text-center'
                                                            editable={splitType === 2 && !loading}
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

                    {/* Upload/Chọn ảnh sản phẩm */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>Ảnh sản phẩm (tuỳ chọn)</Text>
                        <View className='flex-row items-center'>

                            {productImage ? (
                                <Image
                                    source={{ uri: productImage }}
                                    className='w-16 h-16 rounded-lg border border-gray-200 ml-3'
                                    style={{ resizeMode: 'cover' }}
                                />
                            ) : (<TouchableOpacity
                                onPress={() => setShowImagePicker(true)}
                                className='rounded-lg px-3 py-2 items-center flex-row'
                                style={{ backgroundColor: '#F3F4F6' }}
                                disabled={loading}
                            >
                                <Ionicons name='image' size={16} color='#6366F1' />
                                <Text className='text-indigo-600 font-medium ml-1 text-sm'>Chọn/Chụp ảnh</Text>
                            </TouchableOpacity>)}
                        </View>
                    </View>

                    {/* Button */}
                    {loading ? (
                        <View className='bg-indigo-500 rounded-lg py-4 items-center'>
                            <ActivityIndicator size='small' color='white' />

                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddProduct}
                            className='bg-indigo-500 rounded-lg py-4 items-center'
                        >
                            <Text className='text-white font-semibold text-base'>
                                LƯU HÓA ĐƠN
                            </Text>
                        </TouchableOpacity>)}
                </ScrollView>
            </View>

            {/* Currency Picker Modal */}
            {showCurrencyPicker && (
                <View className='absolute inset-0 flex-1 justify-center items-center bg-black/60 z-60'>
                    <View className='bg-white rounded-2xl p-6 mx-6 w-80'>
                        <View className='flex-row items-center justify-between mb-4'>
                            <Text className='text-lg font-bold text-gray-900'>Chọn tiền tệ</Text>
                            <TouchableOpacity
                                onPress={() => setShowCurrencyPicker(false)}
                                className='w-8 h-8 items-center justify-center bg-gray-100 rounded-full'
                            >
                                <Ionicons name='close' size={20} color='#6B7280' />
                            </TouchableOpacity>
                        </View>

                        <View className='gap-3'>
                            {currencies.map((curr) => (
                                <TouchableOpacity
                                    key={curr.code}
                                    onPress={() => {
                                        setCurrency(curr.code);
                                        setShowCurrencyPicker(false);
                                    }}
                                    className={`flex-row items-center p-4 rounded-xl border-2 ${currency === curr.code
                                        ? 'bg-indigo-50 border-indigo-200'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <View className='w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-4'>
                                        <Text className='text-2xl'>{curr.symbol}</Text>
                                    </View>
                                    <View className='flex-1'>
                                        <Text className={`font-bold text-base ${currency === curr.code ? 'text-indigo-900' : 'text-gray-900'
                                            }`}>
                                            {curr.code}
                                        </Text>
                                        <Text className={`text-sm ${currency === curr.code ? 'text-indigo-700' : 'text-gray-600'
                                            }`}>
                                            {curr.name}
                                        </Text>
                                    </View>
                                    {currency === curr.code && (
                                        <View className="w-6 h-6 bg-indigo-500 rounded-full items-center justify-center">
                                            <Ionicons name='checkmark' size={14} color='#FFFFFF' />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Overlay chọn/chụp ảnh */}
            {showImagePicker && (
                <View className='absolute inset-0 flex-1 justify-end bg-black/40 z-50'>
                    <View className='bg-white rounded-t-3xl p-6'>
                        <View className='flex-row items-center justify-between mb-4'>
                            <Text className='text-lg font-bold text-gray-900'>Chọn ảnh sản phẩm</Text>
                            <TouchableOpacity
                                onPress={() => setShowImagePicker(false)}
                                className='w-8 h-8 items-center justify-center'
                            >
                                <Ionicons name='close' size={20} color='#6B7280' />
                            </TouchableOpacity>
                        </View>
                        <View className='gap-3'>
                            <TouchableOpacity
                                onPress={takeProductPhoto}
                                className='flex-row items-center p-4 bg-blue-50 rounded-xl border border-blue-200'
                            >
                                <View className='w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3'>
                                    <Ionicons name='camera' size={20} color='white' />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-blue-700 font-medium'>Chụp ảnh</Text>
                                    <Text className='text-blue-600 text-sm'>Sử dụng camera để chụp ảnh sản phẩm</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={pickProductImageFromLibrary}
                                className='flex-row items-center p-4 bg-green-50 rounded-xl border border-green-200 mb-8'
                            >
                                <View className='w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3'>
                                    <Ionicons name='images' size={20} color='white' />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-green-700 font-medium'>Chọn từ thư viện</Text>
                                    <Text className='text-green-600 text-sm'>Chọn ảnh từ thư viện ảnh của bạn</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            )}
        </View >
    );
};

export default AddProductModal;
