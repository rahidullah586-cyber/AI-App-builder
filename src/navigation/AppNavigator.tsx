import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { GradientBar } from '../theme/GradientView';

import ChatScreen from '../screens/ChatScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import MemoryScreen from '../screens/MemoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ThemePickerScreen from '../screens/ThemePickerScreen';

type TabParamList = {
  Chat: undefined;
  History: undefined;
  Memory: undefined;
  Themes: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabBarIndicator() {
  const { colors } = useTheme();
  return <GradientBar height={2} />;
}

export default function AppNavigator() {
  const { colors, isDark, themePreset, gradientStart } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 2,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarIcon: ({ color, size, focused }) => {
          let icon: React.ReactNode;

          switch (route.name) {
            case 'Chat':
              icon = (
                <Animated.View style={{ transform: [{ scale: focused ? 1.1 : 1 }] }}>
                  <Ionicons
                    name={focused ? 'chatbubbles' : 'chatbubble-outline'}
                    size={focused ? size + 2 : size}
                    color={color}
                  />
                </Animated.View>
              );
              break;
            case 'History':
              icon = (
                <Ionicons
                  name={focused ? 'time' : 'time-outline'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Memory':
              icon = (
                <MaterialCommunityIcons
                  name={focused ? 'brain' : 'brain-outline'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Themes':
              icon = (
                <Ionicons
                  name={focused ? 'color-palette' : 'color-palette-outline'}
                  size={size}
                  color={color}
                />
              );
              break;
            case 'Settings':
              icon = (
                <Ionicons
                  name={focused ? 'settings' : 'settings-outline'}
                  size={size}
                  color={color}
                />
              );
              break;
            default:
              icon = null;
          }
          return icon;
        },
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
      <Tab.Screen name="History" component={ConversationsScreen} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Memory" component={MemoryScreen} options={{ tabBarLabel: 'Memory' }} />
      <Tab.Screen name="Themes" component={ThemePickerScreen} options={{ tabBarLabel: 'Themes' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
