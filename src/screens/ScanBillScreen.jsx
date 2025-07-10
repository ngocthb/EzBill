import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated,
    Alert,
    Modal,
    TextInput,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AddProductModal } from '../components';
import { sendToMindee } from '../utils/ocr';

import OCRStatus from '../components/OCRStatus';
import bg1 from '../../assets/images/bg1.png';

const { width, height } = Dimensions.get('window');

const ScanBillScreen = () => {
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [isScanning, setIsScanning] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    // Remove modal, always show editableData on main screen if extractedData exists
    const [editableData, setEditableData] = useState({
        storeName: '',
        date: '',
        totalAmount: '',
        items: []
    });

    // OCR related states
    const [ocrStatus, setOcrStatus] = useState('ready');
    const [ocrConfidence, setOcrConfidence] = useState(0);
    const [showDeleteModeOCR, setShowDeleteModeOCR] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const cameraRef = useRef(null);
    const scanAnimation = useRef(new Animated.Value(0)).current;


    const [groupMembers] = useState([
        { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
        { id: 2, name: 'Jane', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face' },
        { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=50&h=50&fit=crop&crop=face' },
        { id: 4, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face' }
    ]);


    useEffect(() => {
        if (isScanning) {
            startScanAnimation();
        } else {
            stopScanAnimation();
        }
    }, [isScanning]);

    const startScanAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanAnimation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanAnimation, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopScanAnimation = () => {
        scanAnimation.stopAnimation();
        scanAnimation.setValue(0);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                setIsScanning(true);

                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                    exif: false,
                });


                console.log('🖼️ Đường dẫn ảnh:', photo.uri);

                setCapturedImage(photo.uri);
                setShowCamera(false);

                // Gọi OCR với ảnh vừa chụp
                performOCR(photo.uri);

            } catch (error) {
                console.error('Camera error:', error);
                setIsScanning(false);
                Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
            }
        }
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        console.log('📷 Chuyển camera:', facing === 'back' ? 'front' : 'back');
    };



    const performOCR = async (imageUri) => {
        try {
            setIsScanning(true);
            setOcrStatus('processing');
            console.log('🔍 Bắt đầu OCR cho ảnh:', imageUri);

            const extractedText = await sendToMindee(imageUri);



            // Nếu là object Mindee trả về
            if (extractedText && typeof extractedText === 'object' && extractedText.supplier) {
                setOcrStatus('parsing');
                setOcrConfidence((extractedText.avgConfidence || 0) * 100);

                const mapped = {
                    storeName: extractedText.supplier?.name || '',
                    address: extractedText.supplier?.address || '',
                    phone: extractedText.supplier?.phone || '',
                    date: extractedText.date || '',
                    time: extractedText.time || '',
                    totalAmount: extractedText.totalAmount || '',
                    items: (extractedText.lineItems || []).map(item => ({
                        name: item.description || '',
                        quantity: item.quantity || 1,
                        price: item.unitPrice || item.totalAmount || 0,
                        total: item.totalAmount || 0
                    })),
                    raw: extractedText
                };
                setTimeout(() => {
                    setExtractedData(mapped);
                    setEditableData(mapped);
                    setOcrStatus('ready');
                }, 1000);
                return;
            }

            if (extractedText) {

                setOcrConfidence(extractedText.avgConfidence * 100);
                setOcrStatus('success');

                setTimeout(() => {
                    setExtractedData(extractedData);
                    setEditableData(extractedData);
                    setOcrStatus('ready');
                }, 1000);
            } else {
                setOcrStatus('error');

            }
        } catch (error) {
            console.error('❌ OCR Error:', error);
            setOcrStatus('error');
            setTimeout(() => {
                Alert.alert(
                    'Lỗi nhận diện',
                    'Có lỗi xảy ra khi nhận diện văn bản. Bạn có muốn nhập thông tin thủ công?',
                    [
                        { text: 'Thử lại', onPress: () => { setIsScanning(false); setOcrStatus('ready'); } },
                        { text: 'Nhập thủ công', onPress: () => showManualEntry() }
                    ]
                );
            }, 1500);
        } finally {
            setTimeout(() => {
                setIsScanning(false);
            }, 2000);
        }
    };



    const showManualEntry = () => {
        const manualData = {
            storeName: '',
            date: new Date().toLocaleDateString('vi-VN'),
            totalAmount: '',
            items: [
                { name: 'Sản phẩm 1', price: '', quantity: '1' }
            ]
        };
        setExtractedData(manualData);
        setEditableData(manualData);
        setShowEditModal(true);
        setIsScanning(false);
        setOcrStatus('ready');
    };



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ̲';
    };

    const removeItem = (index) => {
        const newItems = editableData.items.filter((_, i) => i !== index);
        const newTotal = newItems.reduce((total, item) => {
            return total + (parseInt(item.price) || 0) * (parseInt(item.quantity) || 0);
        }, 0);
        setEditableData({
            ...editableData,
            items: newItems,
            totalAmount: newTotal
        });
    };

    const updateItemName = (index, name) => {
        const newItems = [...editableData.items];
        newItems[index].name = name;
        setEditableData({
            ...editableData,
            items: newItems
        });
    };


    const handleAddProduct = (newProduct) => {
        const newItems = [...editableData.items, newProduct];
        const newTotal = newItems.reduce((total, item) => {
            return total + (parseInt(item.price) || 0) * (parseInt(item.quantity) || 1);
        }, 0);
        setEditableData({ ...editableData, items: newItems, totalAmount: newTotal });

    };


    const handleSaveBill = () => {
        console.log('💾 Lưu hóa đơn:', editableData);
    }

    if (!permission) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-6 py-4"
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-semibold">Quét hóa đơn</Text>
                        <View className="w-10" />
                    </View>
                </LinearGradient>

                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-600">Đang yêu cầu quyền truy cập camera...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="px-6 py-4"
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-semibold">Quét hóa đơn</Text>
                        <View className="w-10" />
                    </View>
                </LinearGradient>

                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="camera-off" size={64} color="#9CA3AF" />
                    <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
                        Cần quyền truy cập camera
                    </Text>
                    <Text className="text-gray-600 text-center mt-2">
                        Để quét hóa đơn, ứng dụng cần quyền truy cập camera. Vui lòng cấp quyền trong cài đặt.
                    </Text>
                    <TouchableOpacity
                        onPress={requestPermission}
                        className="bg-purple-600 px-6 py-3 rounded-xl mt-6"
                    >
                        <Text className="text-white font-semibold">
                            Cấp quyền
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-bg-default relative">
            {/* Background image for consistency with CreateBill */}
            <View
                className="absolute bottom-0 left-0 right-0"
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
            <View className="flex-1 px-4 pt-12 pb-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2"
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center">
                        <Text className="text-xl font-bold text-gray-900">
                            Quét hóa đơn
                        </Text>
                    </View>
                    <View className="w-10" />
                </View>

                {!showCamera && !capturedImage && !extractedData && (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Quick Actions */}
                        <View className="mb-4">
                            <View className="bg-white rounded-2xl p-6 shadow-sm">
                                <View className="items-center mb-6">
                                    <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                                        <Ionicons name="scan" size={36} color="#8B5CF6" />
                                    </View>
                                    <Text className="text-gray-800 text-xl font-bold mb-2">Quét hóa đơn thông minh</Text>
                                    <Text className="text-gray-600 text-center">
                                        Sử dụng camera để tự động nhận diện thông tin hóa đơn
                                    </Text>
                                </View>
                                <View className="flex-row gap-2">
                                    <View className="flex-1 items-center">
                                        <TouchableOpacity
                                            onPress={() => setShowCamera(true)}
                                            className="rounded-lg px-3 py-2 items-center flex-row justify-center w-full"
                                            style={{ backgroundColor: '#6366F1' }}
                                        >
                                            <Ionicons name="camera" size={20} color="white" />
                                            <Text className="text-white font-medium ml-1 text-sm">
                                                Chụp ảnh hóa đơn
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* Tips */}
                        <View className="mb-4">
                            <View className="bg-white rounded-2xl p-6 shadow-sm">
                                <View className='flex-row'>
                                    <Ionicons name="bulb" size={24} color="#FFC107" />
                                    <Text className="text-gray-800 text-lg font-semibold mb-4"> Mẹo để quét hiệu quả
                                    </Text>
                                </View>
                                <View className="space-y-3">
                                    <View className="flex-row">
                                        <Text className="text-purple-600 mr-3">•</Text>
                                        <Text className="text-gray-600 flex-1">Đảm bảo hóa đơn được chiếu sáng đều</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-purple-600 mr-3">•</Text>
                                        <Text className="text-gray-600 flex-1">Giữ camera ổn định và song song với hóa đơn</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-purple-600 mr-3">•</Text>
                                        <Text className="text-gray-600 flex-1">Hóa đơn phải hiển thị rõ ràng, không bị mờ</Text>
                                    </View>
                                    <View className="flex-row">
                                        <Text className="text-purple-600 mr-3">•</Text>
                                        <Text className="text-gray-600 flex-1">Tránh phản chiếu ánh sáng lên bề mặt hóa đơn</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                )}

                {/* Show extracted bill after scan (read-only, before edit) */}
                {!showCamera && !isScanning && extractedData && (
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        <View className="rounded-2xl mb-4 bg-white p-4 border border-gray-100">
                            <Text className="text-gray-800 text-lg font-semibold mb-4">Hóa đơn của bạn</Text>

                            {/* Tên cửa hàng */}
                            <View className="mb-2">
                                <Text className="text-gray-600 mb-1">Tên cửa hàng</Text>
                                <TextInput
                                    value={editableData.storeName}
                                    onChangeText={(text) => setEditableData({ ...editableData, storeName: text })}
                                    className="bg-gray-50 p-3 rounded-xl border border-gray-200"
                                    placeholder="Nhập tên cửa hàng"
                                />
                            </View>
                            {/* Ngày & Giờ */}
                            <View className="flex-row mb-2">
                                <View className="flex-1 mr-2">
                                    <Text className="text-gray-600 mb-1">Ngày</Text>
                                    <TextInput
                                        value={editableData.date}
                                        onChangeText={text => setEditableData({ ...editableData, date: text })}
                                        className="bg-gray-50 p-3 rounded-xl border border-gray-200"
                                        placeholder="dd/mm/yyyy"
                                    />
                                </View>
                                <View className="flex-1 ml-2">
                                    <Text className="text-gray-600 mb-1">Giờ</Text>
                                    <TextInput
                                        value={editableData.time}
                                        onChangeText={text => setEditableData({ ...editableData, time: text })}
                                        className="bg-gray-50 p-3 rounded-xl border border-gray-200"
                                        placeholder="hh:mm"
                                    />
                                </View>
                            </View>

                            {/* Danh sách sản phẩm */}
                            <View className="mb-4">
                                <View className="flex-row items-center justify-between mb-2 ">
                                    <View className='flex-row items-center'>
                                        <Ionicons name='list' size={18} color='#374151' />
                                        <Text className='text-base font-medium text-gray-900 ml-2'>
                                            Danh sách sản phẩm
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setShowDeleteModeOCR(!showDeleteModeOCR)}
                                        className="p-2"
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            color={showDeleteModeOCR ? '#EF4444' : '#9CA3AF'}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {editableData.items?.length > 0 ? (
                                    <View className="rounded-lg overflow-hidden  bg-white">

                                        {/* Rows */}
                                        {editableData.items.map((item, index) => (
                                            <View
                                                key={index}
                                                className="flex-row items-start py-3"
                                            >
                                                {/* Tên sản phẩm (editable) */}
                                                <TextInput
                                                    value={item.name}
                                                    onChangeText={text => updateItemName(index, text)}
                                                    placeholder="Tên sản phẩm"
                                                    multiline
                                                    numberOfLines={2}
                                                    className="flex-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 mr-2 min-h-[48px]"
                                                    textAlignVertical="top"
                                                />
                                                {/* Thành tiền */}
                                                <View className="w-28 justify-center items-center ">
                                                    <Text className="text-gray-800 font-semibold text-center">
                                                        {formatCurrency((parseInt(item.price) || 0) * (parseInt(item.quantity) || 1))}
                                                    </Text>
                                                </View>
                                                {/* Nút xóa */}
                                                {showDeleteModeOCR && (
                                                    <TouchableOpacity
                                                        onPress={() => removeItem(index)}
                                                        className="ml-2 bg-red-100 p-2 rounded-lg self-center"
                                                    >
                                                        <Ionicons name="remove" size={16} color="#EF4444" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                ) : (
                                    <Text className="text-gray-500">Không có sản phẩm</Text>
                                )}
                                {/* Thêm sản phẩm */}
                                <TouchableOpacity
                                    onPress={() => setShowAddProductModal(true)}
                                    className='rounded-lg px-3 py-2 items-center flex-row w-40 mt-2'
                                    style={{ backgroundColor: '#6366F1' }}
                                >
                                    <Ionicons name='add' size={16} color='white' />
                                    <Text className='text-white font-medium ml-1 text-sm'>
                                        Thêm sản phẩm
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Tổng tiền */}
                            <View className="flex-row justify-between items-center mt-4">
                                <Text className="text-primary text-lg font-semibold">Tổng tiền:</Text>
                                <Text className="text-primary text-xl font-bold">
                                    {formatCurrency(editableData.totalAmount)}
                                </Text>
                            </View>

                            {/* Nút lưu */}
                            <TouchableOpacity
                                onPress={handleSaveBill}
                                className='bg-primary py-4 rounded-2xl mt-4 mb-8'
                            >
                                <View className='flex-row items-center justify-center'>
                                    <Text className='text-text-button text-center text-lg font-bold mr-1'>
                                        LƯU HÓA ĐƠN
                                    </Text>

                                </View>

                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                )}

                {/* Camera View - Real */}
                {showCamera && (
                    <View style={StyleSheet.absoluteFillObject}>
                        <CameraView
                            ref={cameraRef}
                            style={StyleSheet.absoluteFillObject}
                            facing={facing}
                        >
                            <View style={StyleSheet.absoluteFillObject} className="justify-center items-center">
                                {/* Scan Frame */}
                                <View className="relative">
                                    <View className="w-80 h-80 border-2 border-white/50 rounded-xl">
                                        {/* Corner indicators */}
                                        <View className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white" />
                                        <View className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white" />
                                        <View className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white" />
                                        <View className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white" />

                                        {/* Scanning line */}
                                        {isScanning && (
                                            <Animated.View
                                                style={{
                                                    transform: [{
                                                        translateY: scanAnimation.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [0, 320]
                                                        })
                                                    }]
                                                }}
                                                className="absolute w-full h-1 bg-white shadow-lg"
                                            />
                                        )}
                                    </View>

                                    <Text className="text-white text-center mt-4 font-medium">
                                        Đưa hóa đơn vào khung để quét
                                    </Text>
                                </View>
                            </View>

                            {/* Controls */}
                            <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-6">
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity
                                        onPress={() => setShowCamera(false)}
                                        className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="close" size={24} color="white" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={takePicture}
                                        disabled={isScanning}
                                        className="w-20 h-20 bg-white rounded-full items-center justify-center"
                                    >
                                        {isScanning ? (
                                            <View className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <View className="w-16 h-16 bg-purple-600 rounded-full" />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={toggleCameraFacing}
                                        className="w-12 h-12 bg-white/20 rounded-full items-center justify-center"
                                    >
                                        <Ionicons name="camera-reverse" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </CameraView >
                    </View >
                )}

                {/* Processing Overlay */}
                {
                    isScanning && !showCamera && (
                        <View style={StyleSheet.absoluteFillObject} className="bg-black/50 items-center justify-center">
                            <View className="bg-white rounded-2xl p-8 mx-6 items-center">
                                <View className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                                <OCRStatus status={ocrStatus} confidence={ocrConfidence} />
                                <View className="mt-4 bg-purple-50 px-4 py-2 rounded-lg">
                                    <Text className="text-purple-600 text-sm font-medium">Powered by AI OCR</Text>
                                </View>
                            </View>
                        </View>
                    )
                }

                <AddProductModal
                    visible={showAddProductModal}
                    onClose={() => setShowAddProductModal(false)}
                    onAddProduct={handleAddProduct}
                    groupMembers={groupMembers}
                />
            </View>
        </SafeAreaView >
    );
};

export default ScanBillScreen;
