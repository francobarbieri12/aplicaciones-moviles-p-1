import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const getTasks = async () => {
  try {
    const value = await AsyncStorage.getItem('tasks');
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};