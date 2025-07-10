import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const icons = {
  success: require('../../assets/images/success.png'),
  error: require('../../assets/images/error.png'),
};

const CustomSuccessToast = (props) => (
  <BaseToast
    {...props}
    style={[styles.toastContainer, { borderLeftColor: '#10B981' }]}
    contentContainerStyle={styles.content}
    text1Style={styles.text1}
    text2Style={styles.text2}
    renderLeadingIcon={() => (
      <View style={styles.iconWrapper}>
        <Image source={icons.success} style={styles.icon} />
      </View>
    )}
  />
);

const CustomErrorToast = (props) => (
  <ErrorToast
    {...props}
    style={[styles.toastContainer, { borderLeftColor: '#EF4444' }]}
    contentContainerStyle={styles.content}
    text1Style={styles.text1}
    text2Style={styles.text2}
    renderLeadingIcon={() => (
      <View style={styles.iconWrapper}>
        <Image source={icons.error} style={styles.icon} />
      </View>
    )}
  />
);

const toastConfig = {
  success: (props) => <CustomSuccessToast {...props} />,
  error: (props) => <CustomErrorToast {...props} />,
};

const styles = StyleSheet.create({
  toastContainer: {
    borderLeftWidth: 3, // mỏng hơn
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 60,
    paddingVertical: 10,
  },
  content: {
    paddingHorizontal: 5,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  text2: {
    fontSize: 14,
    color: '#6B7280',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});

export default toastConfig;
