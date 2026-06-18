import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { getTasks, saveTasks } from '../utils/storage';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [recordatorio, setRecordatorio] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('tareas', {
          name: 'Recordatorios de tareas',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        });
      }
      await Notifications.requestPermissionsAsync();
    };
    setupNotifications();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Escribe un titulo para la tarea');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      recordatorio: recordatorio.trim(),
      completed: false
    };

    const existingTasks = await getTasks();
    const updatedTasks = [...existingTasks, newTask];
    await saveTasks(updatedTasks);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Tarea agregada con exito',
        body: recordatorio.trim() ? `"${title.trim()}": ${recordatorio.trim()}` : title.trim(),
        sound: 'default',
      },
      trigger: null,
    });

    Alert.alert(
      'Tarea guardada',
      `"${title.trim()}" ha sido agregada a tus tareas`,
      [
        { text: 'Ver tareas', onPress: () => navigation.navigate('Home') },
        { text: 'Seguir agregando', onPress: () => { setTitle(''); setRecordatorio(''); } }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titulo de la tarea</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Escribe aqui..."
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Recordatorio</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Breve descripcion..."
        value={recordatorio}
        onChangeText={setRecordatorio}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default AddTaskScreen;