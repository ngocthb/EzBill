import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AIChatContext = createContext();

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    // Return default values instead of throwing error
    console.warn('useAIChat must be used within AIChatProvider, returning default values');
    return {
      isVisible: false,
      isLoggedIn: false,
      showAIChat: () => {},
      hideAIChat: () => {},
      toggleAIChat: () => {},
      updateLoginStatus: () => {},
      checkLoginStatus: () => {},
    };
  }
  return context;
};

export const AIChatProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        setIsLoggedIn(true);
        setIsVisible(true); // Hiện AI chat khi đã đăng nhập
      } else {
        setIsLoggedIn(false);
        setIsVisible(false); // Ẩn AI chat khi chưa đăng nhập
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      setIsLoggedIn(false);
      setIsVisible(false);
    }
  };

  const showAIChat = () => {
    if (isLoggedIn) {
      setIsVisible(true);
    }
  };

  const hideAIChat = () => setIsVisible(false);

  const toggleAIChat = () => {
    if (isLoggedIn) {
      setIsVisible((prev) => !prev);
    }
  };

  // Hàm để cập nhật trạng thái đăng nhập từ bên ngoài
  const updateLoginStatus = (status) => {
    setIsLoggedIn(status);
    if (status) {
      setIsVisible(true); // Hiện AI chat khi đăng nhập
    } else {
      setIsVisible(false); // Ẩn AI chat khi đăng xuất
    }
  };

  return (
    <AIChatContext.Provider
      value={{
        isVisible,
        isLoggedIn,
        showAIChat,
        hideAIChat,
        toggleAIChat,
        updateLoginStatus,
        checkLoginStatus,
      }}>
      {children}
    </AIChatContext.Provider>
  );
};
