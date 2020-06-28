import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
import dayjs from 'dayjs'

import * as LocationTrackerTask from './location-tracker-task'
import * as Firebase from './firebase-helper'
import { addLocation, getExistingLocations, clearAllRuns } from './location-tracker-store';

export const LocationTracker = () => {
    const [currentTrackingId, setCurrentTrackingId] = useState();
    const [isRunning, setIsRunning] = useState(false);
    const [data, setData] = useState([]);
    const [lastTimeStamp, setLastTimeStamp] = useState();

    const startTracking = async () => {
        let id = `TRACK_${getId()}`;
        setCurrentTrackingId(id);

        Firebase.init();

        await LocationTrackerTask.start();

        LocationTrackerTask.listen(async (location) => {
            await addLocation(id, location)
            setLastTimeStamp(location.timestamp);

            Firebase.storeLocation(id, location)
        });

        setIsRunning(true);
    }

    const stopTracking = async () => {
        await LocationTrackerTask.stop();
        setIsRunning(false);
    }

    const clearAllData = async () => {
        await stopTracking();
        await clearAllRuns();
        setLastTimeStamp(null);
        setData([])
    }

    useEffect(() => {
        (async () => {
            if (!currentTrackingId) return;

            const dataTemp = await getExistingLocations(currentTrackingId)
            setData(dataTemp)
        })();
    }, [lastTimeStamp])

    return (
        <View style={styles.container} >
            <View style={styles.topBar}>
                <Text style={styles.title}>Location Tracking - {isRunning ? 'Running' : 'Stopped'}</Text>
                <Text style={styles.title}>Total Items: {data.length}</Text>
                {!isRunning ?
                    <Button
                        style={styles.button}
                        onPress={startTracking}
                        title="Start New"
                        color="#0788FF"
                        accessibilityLabel="Start a new Tracker"
                    /> :

                    <Button
                        style={styles.button}
                        onPress={stopTracking}
                        title="Stop"
                        color="#0788FF"
                        accessibilityLabel="Stop the current Tracker"
                    />
                }
                <Button
                    style={styles.button}
                    onPress={clearAllData}
                    title="Clear"
                    color="#0788FF"
                    accessibilityLabel="Clear all items from storage"
                />
            </View>
            <FlatList
                backgroundColor={"white"}
                data={data}
                renderItem={({ index, item }) => {
                    const time = dayjs(item.timestamp);

                    return (
                        <View key={index} style={styles.item}>
                            <Text style={styles.title}>{time.format('HH:mm:ss')}</Text>
                            <Text>{item.coords.longitude} {item.coords.latitude}</Text>
                        </View>
                    )
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        padding: 10,
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    container: {
        width: '100%',
    },
    item: {
        borderBottomWidth: 1,
        padding: 10,
    },
    title: {
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#0788FF',
        borderColor: '#0788FF',
        borderWidth: 1
    }
});

const getId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)