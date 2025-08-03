import './global.css';
import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import AppNavigator from './src/navigators';
import { AIChatProvider } from './src/contexts/AIChatContext';
import { AIChatPopup } from './src/components';
import { useAIChat } from './src/contexts/AIChatContext';

const AppContent = () => {
    const { isVisible, hideAIChat } = useAIChat();

    return (
        <View style={{ flex: 1 }}>
            <AppNavigator />
            {isVisible && <AIChatPopup visible={isVisible} onClose={hideAIChat} />}
        </View>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <AIChatProvider>
                <AppContent />
            </AIChatProvider>
        </Provider>
    );
}
