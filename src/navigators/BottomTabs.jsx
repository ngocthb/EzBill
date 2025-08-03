import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, StatusBar, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  HomeScreen,

  NotificationScreen,
  AccountScreen,

  AllGroupsScreen
} from '../screens';
import { useNavigation } from '@react-navigation/native';

const BottomTabs = createBottomTabNavigator();
const EmptyScreen = () => <View style={{ flex: 1 }}></View>;

const HomeTabs = () => {
  const navigation = useNavigation();
  return (
    <>
      {Platform.OS === 'ios' ? (

        <StatusBar barStyle='dark-content' />

      ) : (
        <StatusBar backgroundColor='#EBFDFE' barStyle='dark-content' />
      )}
      <BottomTabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: 85,
            backgroundColor: 'white',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
            paddingHorizontal: 10,


          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#4461F2',
          tabBarInactiveTintColor: '#DFDFDF',
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        <BottomTabs.Screen
          name="Trang chủ"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className={`items-center ${focused ? 'scale-110' : ''}`}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <BottomTabs.Screen
          name="Nhóm"
          component={AllGroupsScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className={`items-center ${focused ? 'scale-110' : ''}`}>
                <Ionicons
                  name={focused ? "people-circle" : "people-circle-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <BottomTabs.Screen
          name="Plus"
          component={EmptyScreen}
          options={{
            tabBarButton: (props) => (
              <View className="absolute -top-5 items-center justify-center w-[60px]">
                <TouchableOpacity
                  className="bg-[#f0f1fe] w-[56px] h-[56px] rounded-full items-center justify-center border-[6px] border-white"
                  onPress={() => {
                    navigation.navigate('CreateGroup')
                  }}
                >
                  <Ionicons name="add" size={24} color="#4461F2" />
                </TouchableOpacity>
              </View>
            ),
            tabBarLabel: () => null
          }}
        />

        <BottomTabs.Screen
          name="Thông báo"
          component={NotificationScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className={`items-center ${focused ? 'scale-110' : ''}`}>
                <Ionicons
                  name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <BottomTabs.Screen
          name="Tài khoản"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className={`items-center ${focused ? 'scale-110' : ''}`}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </BottomTabs.Navigator>
    </>
  );
};

export default HomeTabs;