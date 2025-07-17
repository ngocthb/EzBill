import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

import homepage2 from '../../assets/images/homepage2.png'
const Notfound = ({ text }) => {
    return (
        <View className="items-center justify-center mt-10 mb-8">
            <Image
                source={homepage2} // Hoặc dùng URL nếu là ảnh online
                style={{ width: 150, height: 150, marginBottom: 16 }}
                resizeMode="contain"
            />
            <Text className="text-gray-500 text-base">{text}</Text>
        </View>
    )
}

export default Notfound

const styles = StyleSheet.create({})