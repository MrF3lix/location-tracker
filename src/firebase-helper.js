import * as firebase from 'firebase';
import { getUniqueId } from 'react-native-device-info';
import dayjs from 'dayjs';

export const init = () => {
    if (firebase.apps.length != 0) return;
    const config = {
        apiKey: "AIzaSyDYAZbmSlgcazgxxT4t2MUymkzjkunj9G8",
        authDomain: "locationtracker-281711.firebaseapp.com",
        databaseURL: "https://locationtracker-281711.firebaseio.com",
        projectId: "locationtracker-281711",
        storageBucket: "locationtracker-281711.appspot.com",
        messagingSenderId: "727349450304",
        appId: "1:727349450304:web:a9bf75e63dd6b4c55ab1a5"
    };

    firebase.initializeApp(config);
}

export const storeLocation = (id, location) => {
    try {
        const itemId = dayjs(location.timestamp).format('HHmmss')
        firebase.database().ref(`tracking/${id}/${itemId}`).set({
            id: `${id}_${itemId}`,
            location
        });
        
        firebase.database().ref(`tracking/${id}/latest`).set({
            id: `${id}_${itemId}`,
            location
        });
    } catch (e) {
        console.log('Permission denied')
    }
}

const getId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)