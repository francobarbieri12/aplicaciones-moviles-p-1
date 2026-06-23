import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Image } from 'react-native';

const TaskItem = ({ title, recordatorio, imagen, ubicacion, contacto, fechaEvento, completed, onToggle, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.taskContainer}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.thumbnail} />
        ) : null}
        <View style={styles.textContainer}>
          <Text style={[styles.title, completed && styles.completed]}>
            {title}
          </Text>
          {recordatorio ? (
            <Text style={[styles.recordatorio, completed && styles.completed]}>
              {recordatorio}
            </Text>
          ) : null}
          {ubicacion ? (
            <Text style={[styles.ubicacion, completed && styles.completed]}>
              📍 {ubicacion.latitude.toFixed(4)}, {ubicacion.longitude.toFixed(4)}
            </Text>
          ) : null}
          {contacto ? (
            <Text style={[styles.contacto, completed && styles.completed]}>
              👤 {contacto.name}
            </Text>
          ) : null}
          {fechaEvento ? (
            <Text style={[styles.fechaEvento, completed && styles.completed]}>
              📅 {fechaEvento}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <Button title="Eliminar" onPress={onDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  taskContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16
  },
  recordatorio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  ubicacion: {
    fontSize: 12,
    color: '#888',
    marginTop: 4
  },
  contacto: {
    fontSize: 12,
    color: '#9333ea',
    marginTop: 4
  },
  fechaEvento: {
    fontSize: 12,
    color: '#ea33a3',
    marginTop: 4
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888'
  }
});

export default TaskItem;