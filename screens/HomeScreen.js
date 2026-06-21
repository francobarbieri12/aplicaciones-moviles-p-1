import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTasks, saveTasks } from '../utils/storage';
import TaskItem from '../components/TaskItem';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadTasks = async () => {
        const storedTasks = await getTasks();
        setTasks(storedTasks);
      };
      loadTasks();
    }, [])
  );

  const handleToggle = async (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const filteredTasks = tasks.filter(task => task.id !== id);
            setTasks(filteredTasks);
            await saveTasks(filteredTasks);
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TaskItem
      title={item.title}
      recordatorio={item.recordatorio}
      imagen={item.imagen}
      ubicacion={item.ubicacion}
      completed={item.completed}
      onToggle={() => handleToggle(item.id)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Tareas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutText}>Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas</Text>}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ff4444',
    borderRadius: 8
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600'
  },
  listContent: {
    flexGrow: 1
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30
  }
});

export default HomeScreen;