import { Text, View } from 'react-native'
import { useState } from 'react'
import { ScrollView, Image, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const bg1 = require('../../assets/images/bg1.png');
const noti1 = require('../../assets/images/noti1.png');
const noti2 = require('../../assets/images/noti2.png');

const { width, height } = Dimensions.get('window');
const NotificationScreen = () => {
    const [activeTab, setActiveTab] = useState('Notification');
    return (
        <>
            <View className="flex-1 bg-bg-default relative"  >

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
                <View className='p-8 pt-14'>
                    <Text className="text-3xl font-bold ">Thông báo</Text>

                </View>
                <ScrollView className='px-6' showsVerticalScrollIndicator={false} contentContainerStyle={{
                    paddingBottom: 100,
                }}>
                    {Array.from({ length: 5 }).map((_, index) => (<View key={index}>
                        <View className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                            <Image source={noti1} className="w-16 h-16" resizeMode="cover" />
                            <View className='flex-1'>
                                <Text numberOfLines={1} ellipsizeMode="tail">
                                    Mission completed tiền đã bay về phía bạn!
                                </Text>

                                <View className='flex-row items-center gap-2 mt-1'>
                                    <Ionicons
                                        name="time"
                                        size={14}
                                        color={"#B8B8D2"}
                                    />
                                    <Text className='text-[#B8B8D2] font-light text-sm'> Ngay bây giờ</Text>
                                </View>
                            </View>

                        </View>
                        <View className='bg-white flex-row rounded-xl p-4 gap-6 items-center mb-4'>
                            <Image source={noti1} className="w-16 h-16" resizeMode="cover" />
                            <View className='flex-1'>
                                <Text numberOfLines={1} ellipsizeMode="tail">Một ngày đẹp trời để... chuyển khoản nhẹ </Text>
                                <View className='flex-row items-center gap-2 mt-1'>
                                    <Ionicons
                                        name="time"
                                        size={14}
                                        color={"#B8B8D2"}
                                    />
                                    <Text className='text-[#B8B8D2] font-light text-sm'>2 phút trước</Text>
                                </View>
                            </View>

                        </View></View>
                    ))}

                </ScrollView>


            </View>
        </>
    )
}

export default NotificationScreen

