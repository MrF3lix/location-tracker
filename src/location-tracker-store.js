import AsyncStorage from '@react-native-community/async-storage';

export const addLocation = async (id, location) => {
    let existingList = await getExistingLocations(id);


    const jsonValue = JSON.stringify({list: [
        location,
        ...existingList
    ]})

    await AsyncStorage.setItem(id, jsonValue)
}

export const getExistingLocations = async id => {
    const existingLocationsRaw = await AsyncStorage.getItem(id);
    if(!existingLocationsRaw) return [];
    
    try { 
        const existingLocation = JSON.parse(existingLocationsRaw);
        return existingLocation.list;
    } catch (e) {
        console.error(e);
    }

    return [];
}

export const clearAllRuns = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error(error)
    }
}