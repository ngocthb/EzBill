import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  HomeScreen,
  ExploreScreen,
  NotificationScreen,
  AccountScreen,
  CreateGroup
} from '../screens';
import { useNavigation } from '@react-navigation/native';

const BottomTabs = createBottomTabNavigator();
const EmptyScreen = () => <View style={{ flex: 1 }}></View>;

const HomeTabs = () => {
  const navigation = useNavigation();
  return (
    <>
      <StatusBar backgroundColor='#EBFDFE' barStyle='dark-content' />
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
          name="Home"
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
          name="Ez AI"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View className={`items-center ${focused ? 'scale-110' : ''}`}>
                <Ionicons
                  name={focused ? "logo-octocat" : "logo-octocat"}
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
          name="Notification"
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
          name="Account"
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