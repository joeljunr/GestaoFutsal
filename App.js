import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from 'screens/HomeScreen';
import DetailsScreen from 'screens/DetailsScreen';
import CalendarScreen from 'screens/CalendarScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }
  const projectId = Constants.expoConfig.extra.eas.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log(token);
  return token;
}

function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Login">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Informações" component={DetailsScreen} />
        <Tab.Screen name="Calendario" component={CalendarScreen} />
        <Tab.Screen name="Login" component={LoginScreen} options={{ tabBarButton: () => null }} />
        <Tab.Screen name="Register" component={RegisterScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
