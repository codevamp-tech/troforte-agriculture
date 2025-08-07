import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = async (): Promise<string> => {
  let id = await AsyncStorage.getItem('deviceId');
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem('deviceId', id);
  }
  return id;
};
