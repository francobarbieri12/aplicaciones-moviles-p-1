import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../src/store/useTaskStore';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HORA_RECORDATORIO = 10;
const MINUTO_RECORDATORIO = 0;

const AddTaskScreen = ({ navigation }) => {
  const addTask = useTaskStore(state => state.addTask);
  const [title, setTitle] = useState('');
  const [recordatorio, setRecordatorio] = useState('');
  const [imagenUri, setImagenUri] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [fechaEvento, setFechaEvento] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
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

  const getUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitas permitir acceso a la ubicacion');
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        enableHighAccuracy: true,
        timeInterval: 5000,
        distanceInterval: 0
      });
      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicacion');
    }
  };

  const pickContacto = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas permitir acceso a contactos');
      return;
    }
    const contacts = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name],
      pageSize: 5,
      sort: Contacts.SortTypes.FirstName,
    });
    if (contacts.length === 0) {
      Alert.alert('Sin contactos', 'No se encontraron contactos');
      return;
    }
    Alert.alert(
      'Seleccionar contacto',
      'Elegi un contacto',
      [
        ...contacts.data.map((c) => ({
          text: c.name || 'Sin nombre',
          onPress: () => setContacto({ id: c.id, name: c.name }),
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const openDatePicker = () => {
    setTempDate(fechaEvento ? new Date(fechaEvento + 'T12:00:00') : new Date());
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFechaEvento(dateStr);
    }
  };

  const crearEventoCalendario = async (task) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') return;

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (calendars.length === 0) return;

    const defaultCalendar = calendars.find(c => c.allowsModifications) || calendars[0];
    const [year, month, day] = task.fechaEvento.split('-').map(Number);

    await Calendar.createEventAsync(defaultCalendar.id, {
      title: task.title,
      startDate: new Date(year, month - 1, day, HORA_RECORDATORIO, MINUTO_RECORDATORIO),
      endDate: new Date(year, month - 1, day, 23, 59),
      allDay: true,
      alarms: [{ relativeOffset: 0 }],
    });
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
      ubicacion: ubicacion || null,
      contacto: contacto || null,
      fechaEvento: fechaEvento || null,
      completed: false
    };

    await addTask(newTask);

    if (fechaEvento) {
      await crearEventoCalendario(newTask);
    }

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
      `"${title.trim()}" ha sido agregada a tus tareas${fechaEvento ? '. Evento creado en calendario.' : ''}`,
      [
        { text: 'Ver tareas', onPress: () => navigation.navigate('Home') },
        { text: 'Seguir agregando', onPress: () => {
          setTitle('');
          setRecordatorio('');
          setImagenUri(null);
          setUbicacion(null);
          setContacto(null);
          setFechaEvento(null);
        }}
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        <Text style={styles.label}>Ubicacion</Text>
        <TouchableOpacity style={styles.locationButton} onPress={getUbicacion}>
          <Text style={styles.locationButtonText}>
            {ubicacion ? `📍 ${ubicacion.latitude.toFixed(4)}, ${ubicacion.longitude.toFixed(4)}` : 'Obtener ubicacion actual'}
          </Text>
        </TouchableOpacity>
        {ubicacion && (
          <TouchableOpacity onPress={() => setUbicacion(null)}>
            <Text style={styles.removeText}>Quitar ubicacion</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.label}>Contacto</Text>
        <TouchableOpacity style={styles.contactButton} onPress={pickContacto}>
          <Text style={styles.contactButtonText}>
            {contacto ? `👤 ${contacto.name}` : 'Seleccionar contacto'}
          </Text>
        </TouchableOpacity>
        {contacto && (
          <TouchableOpacity onPress={() => setContacto(null)}>
            <Text style={styles.removeText}>Quitar contacto</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.label}>Evento en calendario</Text>
        <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
          <Text style={styles.dateButtonText}>
            {fechaEvento ? `📅 ${fechaEvento}` : 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {fechaEvento && (
          <TouchableOpacity onPress={() => setFechaEvento(null)}>
            <Text style={styles.removeText}>Quitar fecha</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Tarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40
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
  locationButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  contactButton: {
    backgroundColor: '#9333ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  dateButton: {
    backgroundColor: '#ea33a3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  removeText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
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