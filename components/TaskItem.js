import React from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

const TaskItem = ({ title, completed, onToggle, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.taskContainer}>
        <Text style={[styles.title, completed && styles.completed]}>
          {title}
        </Text>
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
    flex: 1
  },
  title: {
    fontSize: 16
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888'
  }
});

export default TaskItem;