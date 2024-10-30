import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    loadAttendanceList();
  }, []);

  const saveAttendanceList = async (list) => {
    try {
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem('@attendance_list', jsonValue);
    } catch (e) {
      Alert.alert('Erro', 'Erro ao salvar a lista de presenças');
    }
  };

  const loadAttendanceList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@attendance_list');
      if (jsonValue != null) {
        setAttendanceList(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro ao carregar a lista de presenças');
    }
  };

  const addNameToList = () => {
    const newList = [...attendanceList, { key: name, status: 'Pending' }];
    setAttendanceList(newList);
    saveAttendanceList(newList);
    setName('');
    sendNotification();
  };

  const updateStatus = (index, status) => {
    const newList = [...attendanceList];
    newList[index].status = status;
    setAttendanceList(newList);
    saveAttendanceList(newList);
  };

  const removeNameFromList = (index) => {
    const newList = attendanceList.filter((_, i) => i !== index);
    setAttendanceList(newList);
    saveAttendanceList(newList);
  };

  const sendNotification = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Atividade!",
        body: 'Não se esqueça da atividade de hoje!',
      },
      trigger: { seconds: 10 },
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../src/assets/logo.png')} style={styles.logo} />
      <TextInput
        placeholder="Digite o nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Adicionar" onPress={addNameToList} />
      <FlatList
        data={attendanceList}
        renderItem={({ item, index }) => (
          <View style={[styles.listItem, item.status === 'Present' ? styles.presentBackground : item.status === 'Absent' ? styles.absentBackground : null]}>
            <Text style={styles.nameText}>{item.key}</Text>
            <Text style={styles.statusText}>Status: {item.status}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.presentButton} onPress={() => updateStatus(index, 'Present')}>
                <Text style={styles.buttonText}>Presente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.absentButton} onPress={() => updateStatus(index, 'Ausente')}>
                <Text style={styles.buttonText}>Ausente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeNameFromList(index)}>
                <Text style={styles.buttonText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  presentBackground: {
    backgroundColor: 'green',
  },
  absentBackground: {
    backgroundColor: 'orange',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  presentButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  absentButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
