import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configurar o calendário para português
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt';

// Função para marcar todos os sábados
const markSaturdays = () => {
  const markedDates = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() !== month) break; // Evita marcar dias fora do mês atual
    if (date.getDay() === 6) { // 6 representa sábado
      const dateString = date.toISOString().split('T')[0];
      markedDates[dateString] = { marked: true, dotColor: 'blue' };
    }
  }

  return markedDates;
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    Alert.alert("Atividade", `Atividade marcada para ${day.dateString} às 08:00`);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markSaturdays()}
      />
      {selectedDate && (
        <View style={styles.activityInfo}>
          <Text style={styles.activityText}>Atividade marcada para {selectedDate} às 08:00</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CalendarScreen;
