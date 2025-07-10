import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    Modal,
    StatusBar,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AddProductModal } from '../components';
import bg1 from '../../assets/images/bg1.png';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '~/utils/cloudinary';

const { width, height } = Dimensions.get('window');

const CreateBill = () => {
    const navigation = useNavigation();
    const [billDate, setBillDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showDeleteMode, setShowDeleteMode] = useState(false);
    const [showUserSelector, setShowUserSelector] = useState(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [billImage, setBillImage] = useState(null);
    const [image, setImage] = useState(null);

    // Mock data for group members
    const [groupMembers] = useState([
        { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
        { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
        { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
        { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
    ]);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Ăn sáng',
            price: 550000,
            payer: { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
                { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }
            ]
        },
        {
            id: 2,
            name: 'Uống cà phê',
            price: 250000,
            payer: { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' }
            ]
        },
        {
            id: 3,
            name: 'Ăn trưa',
            price: 800000,
            payer: { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' }
            ]
        },
        {
            id: 4,
            name: 'Ăn kem',
            price: 70000,
            payer: { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ]
        },
        {
            id: 5,
            name: 'Ăn kem',
            price: 70000,
            payer: { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ]
        },
        {
            id: 6,
            name: 'Ăn kem',
            price: 70000,
            payer: { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' },
            users: [
                { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ],
            assignedTo: [
                { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
            ]
        }
    ]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            setBillDate(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleAddProduct = (newProduct) => {
        setProducts([...products, newProduct]);
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
    };

    const handleUpdateProductUsers = (productId, newUsers) => {
        setProducts(products.map(product =>
            product.id === productId ? { ...product, users: newUsers } : product
        ));
        // Không đóng dropdown khi chọn người
    };

    const requestBillImagePermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Cần quyền truy cập thư viện ảnh để chọn ảnh hóa đơn');
            return false;
        }
        return true;
    };

    const requestBillCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Cần quyền truy cập camera để chụp ảnh hóa đơn');
            return false;
        }
        return true;
    };

    const pickBillImageFromLibrary = async () => {
        const hasPermission = await requestBillImagePermission();
        if (!hasPermission) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Enable cropping
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled) {
            setBillImage(result.assets[0].uri);
            setShowImagePicker(false);
        }
    };

    const takeBillPhoto = async () => {
        const hasPermission = await requestBillCameraPermission();
        if (!hasPermission) return;
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Enable cropping
            aspect: [4, 3],
            quality: 0.8,
        });
        if (!result.canceled) {
            console.log("Camera result:", result.assets[0]);
            setImage(result.assets[0]);
            setBillImage(result.assets[0].uri);
            setShowImagePicker(false);
        }
    };

    const handleSaveBill = async () => {
        const billData = {
            date: billDate,
            products,
        };
        const imageResponse = await uploadImageToCloudinary(image);
        console.log(imageResponse);
        console.log('Save Bill', billData);
        // navigation.goBack();
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN') + 'đ̲';
    };

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
            <View className='flex-1 px-4 pt-12 pb-4'>

                {/* Header */}
                <View className='flex-row items-center justify-between mb-6'>
                    <TouchableOpacity
                        onPress={handleBack}
                        className='p-2'
                    >
                        <Ionicons
                            name='close'
                            size={24}
                            color='#1F2937'
                        />
                    </TouchableOpacity>
                    <View className='flex-1 items-center'>
                        <Text className='text-xl font-bold text-gray-900'>
                            Hóa đơn
                        </Text>
                        <TouchableOpacity
                            className='flex-row items-center mt-1'
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text className='text-sm text-gray-700 mr-1'>
                                {formatDate(billDate)}
                            </Text>
                            <Ionicons name='chevron-down' size={16} color='#374151' />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ScanBill')}
                        className='p-2 bg-purple-100 rounded-lg'
                    >
                        <Ionicons
                            name='scan'
                            size={20}
                            color='#8B5CF6'
                        />
                    </TouchableOpacity>
                </View>

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
                                Danh sách sản phẩm
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

                    {products.map((product) => (
                        <View key={product.id} className='mb-2 bg-white rounded-lg border border-gray-200 p-3'>
                            <View className='flex-row items-center justify-between'>
                                <View className='flex-row items-center flex-1'>

                                    <View className='flex-1 px-3'>
                                        <Text className='text-gray-900 font-medium text-base'>
                                            {product.name}
                                        </Text>
                                        <Text className='text-primary font-bold text-sm'>
                                            {formatCurrency(product.price)}
                                        </Text>
                                    </View>
                                    <View className='flex-row items-center'>
                                        <TouchableOpacity
                                            onPress={() => setShowUserSelector(showUserSelector === product.id ? null : product.id)}
                                            className='flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2'
                                        >
                                            <View className='flex-row items-center'>
                                                {product.users?.slice(0, 2).map((user, index) => (
                                                    <Image
                                                        key={user.id}
                                                        source={{ uri: user.avatar }}
                                                        className={`w-5 h-5 rounded-full ${index > 0 ? '-ml-1' : ''}`}
                                                        style={{
                                                            zIndex: 2 - index,
                                                            borderWidth: 2,
                                                            borderColor: '#6C63FF'
                                                        }}
                                                    />
                                                ))}
                                                {product.users?.length > 2 && (
                                                    <View
                                                        className='w-5 h-5 rounded-full bg-purple-100 -ml-1 items-center justify-center'
                                                        style={{
                                                            borderWidth: 2,
                                                            borderColor: '#6C63FF'
                                                        }}
                                                    >
                                                        <Text className='text-xs text-purple-600 font-bold'>
                                                            +{product.users.length - 2}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Ionicons
                                                name={showUserSelector === product.id ? 'chevron-up' : 'chevron-down'}
                                                size={12}
                                                color='#6B7280'
                                                style={{ marginLeft: 4 }}
                                            />
                                        </TouchableOpacity>
                                        <Image
                                            source={{ uri: product.payer?.avatar }}
                                            className='w-6 h-6 rounded-full'
                                        />
                                    </View>
                                </View>
                                {showDeleteMode && (
                                    <TouchableOpacity
                                        onPress={() => handleRemoveProduct(product.id)}
                                        className='bg-red-50 rounded-full p-2 ml-2'
                                    >
                                        <Ionicons name='remove' size={16} color='#EF4444' />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Expanded User Selection */}
                            {showUserSelector === product.id && (
                                <View className='mt-3 pt-3 border-t border-gray-100'>
                                    <View className='flex-row items-center justify-between mb-3'>
                                        <View className='flex-row items-center'>
                                            <Ionicons name='people' size={16} color='#374151' />
                                            <Text className='text-sm font-medium text-gray-900 ml-2'>
                                                Chọn người sử dụng
                                            </Text>
                                        </View>
                                        <Text className='text-xs text-gray-500'>
                                            {product.users?.length || 0} người
                                        </Text>
                                    </View>
                                    <View className='flex-row flex-wrap gap-2'>
                                        {groupMembers.map((member) => {
                                            const isSelected = product.users?.some(u => u.id === member.id);
                                            return (
                                                <TouchableOpacity
                                                    key={member.id}
                                                    onPress={() => {
                                                        const currentUsers = product.users || [];
                                                        let newUsers;
                                                        if (isSelected) {
                                                            newUsers = currentUsers.filter(u => u.id !== member.id);
                                                        } else {
                                                            newUsers = [...currentUsers, member];
                                                        }
                                                        handleUpdateProductUsers(product.id, newUsers);
                                                    }}
                                                    className='items-center mb-2'
                                                >
                                                    <Image
                                                        source={{ uri: member.avatar }}
                                                        className='w-12 h-12 rounded-full'
                                                        style={{
                                                            borderWidth: isSelected ? 3 : 2,
                                                            borderColor: isSelected ? '#6C63FF' : '#E5E7EB'
                                                        }}
                                                    />
                                                    <Text className={`text-xs mt-1 ${isSelected ? 'text-purple-600 font-medium' : 'text-gray-600'}`}>
                                                        {member.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}


                    {/* Add Bill Image & Add Product Buttons Row */}
                    <View className='flex-row items-center mt-2'>
                        {/* Add Bill Image Button */}
                        <TouchableOpacity
                            onPress={() => setShowImagePicker(true)}
                            className='rounded-lg px-3 py-2 items-center mr-2 flex-row'
                            style={{ backgroundColor: '#F3F4F6' }}
                        >
                            <Ionicons name='image' size={16} color='#6366F1' />
                            <Text className='text-indigo-600 font-medium ml-1 text-sm'>
                                Thêm ảnh hóa đơn
                            </Text>
                        </TouchableOpacity>

                        {/* Add Product Button */}
                        <TouchableOpacity
                            onPress={() => setShowAddProductModal(true)}
                            className='rounded-lg px-3 py-2 items-center flex-row'
                            style={{ backgroundColor: '#6366F1' }}
                        >
                            <Ionicons name='add' size={16} color='white' />
                            <Text className='text-white font-medium ml-1 text-sm'>
                                Thêm sản phẩm
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bill Image Preview */}
                    {billImage && (
                        <View className='mt-3 mb-2 items-start'>
                            <Text className='text-gray-700 font-medium mb-1 text-sm'>Ảnh hóa đơn đã chọn:</Text>
                            <Image
                                source={{ uri: billImage }}
                                className='w-40 h-32 rounded-lg border border-gray-200'
                                resizeMode='cover'
                            />
                        </View>
                    )}

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
                                        {formatCurrency(products.reduce((total, product) => total + product.price, 0))}
                                    </Text>
                                </View>

                                {/* Số tiền đã trả */}
                                {(() => {
                                    const paymentSummary = {};
                                    products.forEach(product => {
                                        if (product.payer) {
                                            const payerId = product.payer.id;
                                            if (!paymentSummary[payerId]) {
                                                paymentSummary[payerId] = {
                                                    payer: product.payer.name,
                                                    payerAvatar: product.payer.avatar,
                                                    amount: 0
                                                };
                                            }
                                            paymentSummary[payerId].amount += product.price;
                                        }
                                    });

                                    const payments = Object.values(paymentSummary);
                                    if (payments.length === 0) {
                                        return (
                                            <View className='flex-row items-center justify-center p-3 bg-gray-50 rounded-lg'>
                                                <Ionicons name='information-circle' size={16} color='#6B7280' />
                                                <Text className='text-gray-500 ml-2 text-sm'>
                                                    Chưa có ai trả tiền
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
                                                            source={{ uri: payment.payerAvatar }}
                                                            className='w-7 h-7 rounded-full mr-3'
                                                            style={{
                                                                backgroundColor: '#E5E7EB'
                                                            }}
                                                        />
                                                        <Text className='text-gray-700 font-medium text-sm'>
                                                            {payment.payer}
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



                        <TouchableOpacity
                            onPress={handleSaveBill}
                            className='bg-primary py-4 rounded-2xl mb-8'
                        >
                            <View className='flex-row items-center justify-center'>
                                <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                    LƯU HÓA ĐƠN
                                </Text>

                            </View>

                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>


            {/* Add Product Modal */}
            <AddProductModal
                visible={showAddProductModal}
                onClose={() => setShowAddProductModal(false)}
                onAddProduct={handleAddProduct}
                groupMembers={groupMembers}
            />

            {/* Bill Image Picker Overlay */}
            {showImagePicker && (
                <View className='absolute inset-0 flex-1 justify-end bg-black/40 z-50'>
                    <View className='bg-white rounded-t-3xl p-6'>
                        <View className='flex-row items-center justify-between mb-4'>
                            <Text className='text-lg font-bold text-gray-900'>Chọn ảnh hóa đơn</Text>
                            <TouchableOpacity
                                onPress={() => setShowImagePicker(false)}
                                className='w-8 h-8 items-center justify-center'
                            >
                                <Ionicons name='close' size={20} color='#6B7280' />
                            </TouchableOpacity>
                        </View>
                        <View className='gap-3'>
                            <TouchableOpacity
                                onPress={takeBillPhoto}
                                className='flex-row items-center p-4 bg-blue-50 rounded-xl border border-blue-200'
                            >
                                <View className='w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3'>
                                    <Ionicons name='camera' size={20} color='white' />
                                </View>
                                <View className='flex-1'>
                                    <Text className='text-blue-700 font-medium'>Chụp ảnh</Text>
                                    <Text className='text-blue-600 text-sm'>Sử dụng camera để chụp ảnh hóa đơn</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={pickBillImageFromLibrary}
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
                </View>
            )}

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={billDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                />
            )}

            {/* iOS Date Picker Modal */}
            {Platform.OS === 'ios' && showDatePicker && (
                <Modal
                    visible={showDatePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    <View className='flex-1 justify-end bg-black bg-opacity-50'>
                        <View className='bg-white rounded-t-3xl p-6'>
                            <View className='flex-row items-center justify-between mb-4'>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(false)}
                                    className='p-2'
                                >
                                    <Text className='text-blue-600 font-medium'>Hủy</Text>
                                </TouchableOpacity>
                                <Text className='text-lg font-bold text-gray-900'>
                                    Chọn ngày
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(false)}
                                    className='p-2'
                                >
                                    <Text className='text-blue-600 font-medium'>Xong</Text>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={billDate}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                                style={{ height: 200 }}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

export default CreateBill

