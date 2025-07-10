import './global.css';
import { Provider } from 'react-redux';
import store from './src/reduxs/store';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigators';
import toastConfig from './src/components/CustomToast';


export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator />
            <Toast config={toastConfig} />
        </Provider>
    );
}
