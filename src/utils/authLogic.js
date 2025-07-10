import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { removeAuth, addAuth } from '../reduxs/reducers/authReducer';

export const useAuthLogic = () => {
  const authData = useSelector((state) => state.authReducer.data);
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isFirstTimeUse, setIsFirstTimeUse] = useState(true);

  const appStart = useCallback(async () => {
    try {
      const isFirstTime = await checkFirstTimeUse();
      setIsFirstTimeUse(isFirstTime);

      const authDataFromStorage = await AsyncStorage.getItem('Auth_Data');
      if (authDataFromStorage) {
        const parsedData = JSON.parse(authDataFromStorage);
        if (parsedData && parsedData.token) {
          const currentTime = new Date().getTime();
          if (parsedData.expiryTime && currentTime > parsedData.expiryTime) {
            console.log('Token expired on app start');
            await handleLogout();
            // Đảm bảo không set token valid khi đã hết hạn
            setIsTokenValid(false);
          } else {
            dispatch(addAuth(parsedData));
            setIsTokenValid(true);
          }
        } else {
          // Nếu không có token hoặc token không hợp lệ
          setIsTokenValid(false);
        }
      } else {
        // Nếu không có dữ liệu auth trong storage
        setIsTokenValid(false);
      }
    } catch (error) {
      console.log('Error during app start:', error);
      setIsTokenValid(false); // Đảm bảo set false khi có lỗi
    } finally {
      setIsAppLoading(false);
    }
  }, [dispatch, handleLogout]);
  const checkFirstTimeUse = async () => {
    try {
      const firstTimeFlag = await AsyncStorage.getItem('First_Time_Use');
      return firstTimeFlag === null;
    } catch (error) {
      console.error('Error checking first time use:', error);
      return true;
    }
  };

  const setFirstTimeUsed = async () => {
    try {
      await AsyncStorage.setItem('First_Time_Use', 'false');
      setIsFirstTimeUse(false);
    } catch (error) {
      console.error('Error setting first time use:', error);
    }
  };
  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('Auth_Data');
      dispatch(removeAuth());
      setIsTokenValid(false);
      console.log('Logged out successfully');
    } catch (error) {
      console.log('Error logout:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    appStart();
  }, [appStart]);
  return {
    authData,
    isAppLoading,
    isTokenValid,
    isFirstTimeUse,
    handleLogout,
    setFirstTimeUsed,
  };
};
