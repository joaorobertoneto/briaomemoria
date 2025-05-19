import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#9a9a9a" barStyle="dark-content" />
      <View style={styles.gameboy}>
 
        <View style={styles.powerIndicator}>
          <View style={styles.powerLight} />
          <View style={styles.powerText}>

            <View style={styles.powerDot} />
            <View style={styles.powerDot} />
          </View>
        </View>
        <HomeScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9a9a9a', // Cor do GameBoy original
  },
  gameboy: {
    flex: 1,
    backgroundColor: '#9a9a9a',
    position: 'relative',
  },
  powerIndicator: {
    position: 'absolute',
    top: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  powerLight: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
    marginRight: 5,
  },
  powerText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#636363',
    marginRight: 3,
  },
});