import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainScreen from '../src/screens/MainScreen';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A1A' }}>
        <StatusBar style="light" />
        <View style={{
          width: 90, height: 90, borderRadius: 45, backgroundColor: '#1A1A3E',
          justifyContent: 'center', alignItems: 'center', marginBottom: 24,
        }}>
          <View style={{
            width: 60, height: 60, borderRadius: 30, backgroundColor: '#818CF8',
            justifyContent: 'center', alignItems: 'center',
          }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#0A0A1A', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#818CF8', fontSize: 22, fontWeight: '800' }}>Z</Text>
            </View>
          </View>
        </View>
        <ActivityIndicator size="small" color="#818CF8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0A0A1A" />
      <MainScreen />
    </SafeAreaProvider>
  );
}
