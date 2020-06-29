import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TRACKER_TASK_NAME = 'Background_Location_Tracker';

export const start = async () => {
    let permission = await Location.requestPermissionsAsync();
    if (permission.status !== 'granted') {
        throw 'Permission to access location was denied';
    }

    await Location.startLocationUpdatesAsync(LOCATION_TRACKER_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        showsBackgroundLocationIndicator: true,
        timeInterval: 10000,
        distanceInterval: 2,
        foregroundService: {
            notificationTitle: 'Location Tracker',
            notificationBody: 'We are currently tracking your location',
            notificationColor: '#FF0000'
        },
        activityType: Location.ActivityType.Fitness
    });
}

export const listen = callback => {
    TaskManager.defineTask(LOCATION_TRACKER_TASK_NAME, async ({ data: { locations }, error }) => {
        if (error) {
            throw error;
        }
        locations.map(location => callback(location));
    });
}

export const stop = async () => {
    try {
        await TaskManager.unregisterTaskAsync(LOCATION_TRACKER_TASK_NAME)
    } catch (e) {
        console.log('Was already stopped')
    }
}