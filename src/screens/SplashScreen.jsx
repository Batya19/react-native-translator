import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-vector/gradient-blur-pink-blue-abstract-background_53876-117324.jpg' }}
        style={styles.background}
      >
        <View style={styles.content}>
          <Ionicons name="language" size={80} color="#fff" />
          <Text style={styles.title}>Language Translator</Text>
          <Text style={styles.subtitle}>Quick and Easy Translation</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SplashScreen;