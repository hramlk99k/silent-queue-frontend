import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, Home, List } from 'lucide-react-native';
import React from 'react';
import AboutScreen from '../screens/AboutScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import QueueScreen from '../screens/QueueScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#1A1A1A', 
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10
        },
        tabBarActiveTintColor: Colors.primaryGlow,
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="My Queue" 
        component={QueueScreen} 
        options={{ tabBarIcon: ({ color }) => <List color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarIcon: ({ color }) => <Clock color={color} size={24} /> }}
      />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}