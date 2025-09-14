import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MatchListScreen from '../screens/MatchListScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import TeamCreationScreen from '../screens/TeamCreationScreen';
import TeamPreviewScreen from '../screens/TeamPreviewScreen';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(22, 22, 22, 0.95)',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          zIndex: 1000,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Matches') {
            iconName = 'shield';
          } else if (route.name === 'My Team') {
            iconName = 'users';
          }
          return (
            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={iconName} size={28} color={color}/>
              {focused && (<View style={{ position: 'absolute', bottom: 10, height: 5, width: 5, borderRadius: 2.5, backgroundColor: '#FDC830'}} />)}
            </View>
          );
        },
        tabBarActiveTintColor: '#FDC830',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Matches" component={MatchListScreen} />
      <Tab.Screen name="My Team" component={MyTeamScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#161616',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
        // YEH LINE 'Create Team' WALI SCREEN KA WHITE BLINK FIX KARTI HAI
        cardStyle: { backgroundColor: 'transparent' }, 
      }}
    >
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTeam"
        component={TeamCreationScreen}
        options={{ title: 'Create Your Team' }}
      />
      <Stack.Screen
        name="TeamPreview"
        component={TeamPreviewScreen}
        options={{ title: 'Team Preview' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;