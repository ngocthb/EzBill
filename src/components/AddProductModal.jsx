import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
const AddProductModal = ({
    visible,
    onClose,
    onAddProduct,
    groupMembers = []
}) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    // Đã bỏ upload ảnh sản phẩm

    const formatPrice = (text) => {
        const number = text.replace(/\D/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

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

    // Đã bỏ upload ảnh sản phẩm

    const handleAddProduct = () => {
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

        const newProduct = {
            id: Date.now(),
            name: productName,
            price: parseFloat(productPrice.replace(/\D/g, '')),
            payer: selectedPayer,
            users: selectedUsers,
            // image: productImage, // Đã bỏ upload ảnh sản phẩm
            assignedTo: []
        };

        console.log('Adding product:', newProduct);
        onAddProduct(newProduct);
        Alert.alert('Thành công', 'Sản phẩm đã được thêm vào hóa đơn');

        // Reset form
        setProductName('');
        setProductPrice('');
        setSelectedPayer(null);
        setSelectedUsers([]);
        // setProductImage(null); // Đã bỏ upload ảnh sản phẩm
        onClose();
    };

    const handleCancel = () => {
        // Reset form
        setProductName('');
        setProductPrice('');
        setSelectedPayer(null);
        setSelectedUsers([]);
        // setProductImage(null); // Đã bỏ upload ảnh sản phẩm
        onClose();
    };


    if (!visible) return null;

    return (
        <View className='absolute inset-0 flex-1 justify-center items-center bg-black/40 px-4 z-50'>
            <View className='bg-white rounded-2xl p-5 w-full max-w-sm max-h-4/5'>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className='flex-row items-center justify-between mb-5'>
                        <TouchableOpacity
                            onPress={handleCancel}
                            className='w-8 h-8 items-center justify-center'
                        >
                            <Ionicons name='close' size={22} color='#374151' />
                        </TouchableOpacity>
                        <Text className='text-lg font-semibold text-gray-900'>
                            Thêm sản phẩm
                        </Text>
                        <View className='w-8' />
                    </View>

                    {/* Tên sản phẩm */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>
                            Tên sản phẩm
                        </Text>
                        <TextInput
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
                            Giá tiền
                        </Text>
                        <View className='flex-row items-center border-b border-gray-300 py-2.5'>
                            <TextInput
                                value={productPrice}
                                onChangeText={(text) => setProductPrice(formatPrice(text))}
                                placeholder='0'
                                placeholderTextColor='#9CA3AF'
                                keyboardType='numeric'
                                className='flex-1 text-gray-900 text-base font-medium'
                            />
                            <Text className='text-gray-600 ml-2 font-medium'>đ</Text>
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
                                        key={member.id}
                                        onPress={() => setSelectedPayer(member)}
                                        className='items-center'
                                    >
                                        <View className='w-12 h-12 rounded-full overflow-hidden' style={{
                                            borderColor: selectedPayer?.id === member.id ? '#6C63FF' : 'transparent',
                                            borderWidth: selectedPayer?.id === member.id ? 2 : 0
                                        }}>
                                            <Image
                                                source={{ uri: member.avatar }}
                                                className='w-full h-full'
                                                resizeMode='cover'
                                            />
                                        </View>
                                        <Text className={`text-xs mt-1 ${selectedPayer?.id === member.id ? 'font-semibold' : 'text-gray-600'
                                            }`} style={{
                                                color: selectedPayer?.id === member.id ? '#6C63FF' : '#6B7280'
                                            }}>
                                            {member.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Người sử dụng - chia đều */}
                    <View className='mb-4'>
                        <Text className='text-gray-700 font-medium mb-2 text-sm'>
                            Người sử dụng (chia đều)
                        </Text>
                        <View className='border-b border-gray-300 pb-3'>
                            <View className='flex-row flex-wrap gap-2'>
                                {groupMembers.map((member) => (
                                    <TouchableOpacity
                                        key={member.id}
                                        onPress={() => {
                                            if (selectedUsers.some(u => u.id === member.id)) {
                                                setSelectedUsers(selectedUsers.filter(u => u.id !== member.id));
                                            } else {
                                                setSelectedUsers([...selectedUsers, member]);
                                            }
                                        }}
                                        className='items-center'
                                    >
                                        <View className='w-12 h-12 rounded-full overflow-hidden' style={{
                                            borderColor: selectedUsers.some(u => u.id === member.id) ? '#6C63FF' : 'transparent',
                                            borderWidth: selectedUsers.some(u => u.id === member.id) ? 2 : 0
                                        }}>
                                            <Image
                                                source={{ uri: member.avatar }}
                                                className='w-full h-full'
                                                resizeMode='cover'
                                            />
                                        </View>
                                        <Text className={`text-xs mt-1 ${selectedUsers.some(u => u.id === member.id) ? 'font-semibold' : 'text-gray-600'
                                            }`} style={{
                                                color: selectedUsers.some(u => u.id === member.id) ? '#6C63FF' : '#6B7280'
                                            }}>
                                            {member.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>


                    {/* Đã bỏ upload ảnh sản phẩm */}

                    {/* Button */}
                    <TouchableOpacity
                        onPress={handleAddProduct}
                        className='bg-indigo-500 rounded-lg py-4 items-center'
                    >
                        <Text className='text-white font-semibold text-base'>
                            Thêm sản phẩm
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>


            {/* Đã bỏ upload ảnh sản phẩm */}
        </View>
    );
};

export default AddProductModal;
