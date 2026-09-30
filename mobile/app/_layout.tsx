import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { PurchasesProvider, configurePurchases } from '../src/lib/purchases';
import { COLORS } from '../src/theme/colors';

export default function RootLayout() {
  useEffect(() => {
    // Guarded by Platform.OS !== 'web' and try/catch
    if (Platform.OS !== 'web') {
      try {
        configurePurchases();
      } catch (err) {
        console.warn('[RevenueCat] configure error in RootLayout:', err);
      }
    }
  }, []);

  return (
    <PurchasesProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={COLORS.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="agent/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: COLORS.backgroundSecondary },
              headerTintColor: COLORS.textPrimary,
              headerShadowVisible: false,
              headerBackTitle: 'Agents',
            }}
          />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </View>
    </PurchasesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
