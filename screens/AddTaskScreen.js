import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Image } from 'react-native';
import { getTasks, saveTasks } from '../utils/storage';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';

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
  const [imagenUri, setImagenUri] = useState(null);
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

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a la camara');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a la galeria');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Escribe un titulo para la tarea');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      recordatorio: recordatorio.trim(),
      imagen: imagenUri || null,
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
        { text: 'Seguir agregando', onPress: () => { setTitle(''); setRecordatorio(''); setImagenUri(null); } }
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
      <Text style={styles.label}>Imagen</Text>
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImageFromCamera}>
          <Text style={styles.imageButtonText}>Tomar foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
          <Text style={styles.imageButtonText}>Elegir de galeria</Text>
        </TouchableOpacity>
      </View>
      {imagenUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imagenUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageButton} onPress={() => setImagenUri(null)}>
            <Text style={styles.removeImageText}>X</Text>
          </TouchableOpacity>
        </View>
      )}
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
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: '35%',
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
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