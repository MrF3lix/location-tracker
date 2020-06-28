import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    StyleSheet
} from 'react-native';

import { LocationTracker } from './src/location-tracker';

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <LocationTracker />
            </SafeAreaView>
        </>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    }
});
