import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MeditationScreen from './meditation';
import PaywallScreen from './paywall';
import SessionDetailScreen from './session/[id]';

export type RootStackParamList = {
  Meditation: undefined;
  Paywall: undefined;
  SessionDetail: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Meditation"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Meditation" component={MeditationScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
