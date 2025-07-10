import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import bg1 from '../../assets/images/bg1.png';


const { width, height } = Dimensions.get('window');

const welcomeData = [
    {
        id: 1,
        subtitle: 'Chia tiền gọn,\nvi vu trọn!',
        description: 'Đúng ý bạn muốn',
        image: require('../../assets/images/welcome1.png')
    },
    {
        id: 2,
        subtitle: 'Bạn lo chơi,\nEzBill lo chia!',
        description: 'Đi là tôi, chia là xong!',
        image: require('../../assets/images/welcome2.png')
    },
    {
        id: 3,
        subtitle: 'EzBill – kết nối\nmọi hành trình',
        description: 'Cùng đi, cùng chia!',
        image: require('../../assets/images/welcome3.png')
    }
];

const dotColors = ['#58C1CA', '#60A5FA', '#F6A192'];

const WelcomeScreen = () => {
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        if (index !== currentIndex) {
            setCurrentIndex(index);
        }
    };

    const scrollToIndex = (index) => {
        scrollViewRef.current?.scrollTo({
            x: index * width,
            animated: true
        });
    };

    const handleNext = () => {
        if (currentIndex < welcomeData.length - 1) {
            const nextIndex = currentIndex + 1;
            scrollToIndex(nextIndex);
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <View className='flex-1 bg-bg-welcome relative'>
            {/* Background Image */}
            <View className='absolute bottom-32 '>
                <Image
                    source={bg1}
                    style={{
                        width: width,
                        height: height * 0.8,
                    }}
                    resizeMode='cover'
                />
            </View>



            {/* Slides */}
            <View className='flex-1 z-10'>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                    decelerationRate='fast'
                >
                    {welcomeData.map((item) => (
                        <View
                            key={item.id}
                            className="justify-center items-center px-8"
                            style={{ width }}
                        >
                            <View className="w-80 h-80 justify-center items-center mb-8">
                                <Image
                                    source={item.image}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Bọc text trong View để canh trái */}
                            <View className="w-full items-start">
                                <Text className="text-4xl font-bold tracking-widest text-text-title mb-2 text-left leading-snug ">
                                    {item.subtitle}
                                </Text>

                                <Text className="text-base text-text-title font-light text-left leading-6">
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    ))}

                </ScrollView>
            </View>

            <View className='w-full flex items-center pb-12 px-8 z-10'>
                {/* Dot Indicator */}
                <View className='w-full px-8 pb-12 z-10'>
                    <View className='flex-row justify-between items-center mb-6'>

                        {/* Dots group */}
                        <View className='flex-row items-center gap-1'>
                            {welcomeData.map((_, dotIndex) => (
                                <View
                                    key={dotIndex}
                                    className='h-2 rounded-full'
                                    style={{
                                        width: dotIndex === currentIndex ? 24 : 12,
                                        backgroundColor:
                                            dotIndex === currentIndex
                                                ? '#000000'
                                                : dotColors[dotIndex] || '#D1D5DB',
                                    }}
                                />
                            ))}
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            onPress={handleNext}
                            style={{ backgroundColor: 'black' }}
                            className="w-14 h-14 rounded-full justify-center items-center"
                        >
                            <Ionicons name="chevron-forward-outline" size={28} color="#FFFFFF" />
                        </TouchableOpacity>


                    </View>
                </View>

            </View>


        </View>
    );
};

export default WelcomeScreen;
