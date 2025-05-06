import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Available languages
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'he', name: 'Hebrew' }
];

const HistoryScreen = ({ navigation }) => {
  const [translations, setTranslations] = useState([]);

  // Load translations when screen loads
  useEffect(() => {
    loadTranslations();
  }, []);

  // Function to load translations from local storage
  const loadTranslations = async () => {
    try {
      const savedTranslations = await AsyncStorage.getItem('translations');
      if (savedTranslations !== null) {
        setTranslations(JSON.parse(savedTranslations));
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  // Function to delete a translation
  const deleteTranslation = async (id) => {
    try {
      const updatedTranslations = translations.filter(item => item.id !== id);
      setTranslations(updatedTranslations);
      await AsyncStorage.setItem('translations', JSON.stringify(updatedTranslations));
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  // Function to clear all history
  const clearAllHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all translation history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('translations');
              setTranslations([]);
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  // Function to share a translation
  const shareTranslation = async (item) => {
    try {
      await Share.share({
        message: `Source (${getLanguageName(item.sourceLanguage)}): ${item.originalText}\nTranslation (${getLanguageName(item.targetLanguage)}): ${item.translatedText}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the translation');
    }
  };

  // Function to get language name by code
  const getLanguageName = (code) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render translation item
  const renderTranslationItem = ({ item }) => (
    <View style={styles.translationItem}>
      <View style={styles.translationHeader}>
        <Text style={styles.translationDate}>
          {formatDate(item.timestamp)}
        </Text>
        <View style={styles.languagePair}>
          <Text style={styles.languageText}>
            {getLanguageName(item.sourceLanguage)}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#888" style={styles.arrowIcon} />
          <Text style={styles.languageText}>
            {getLanguageName(item.targetLanguage)}
          </Text>
        </View>
      </View>
      
      <View style={styles.translationContent}>
        <Text style={styles.originalText}>{item.originalText}</Text>
        <Text style={styles.translatedText}>{item.translatedText}</Text>
      </View>
      
      <View style={styles.translationActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => shareTranslation(item)}
        >
          <Ionicons name="share-outline" size={20} color="#4A6572" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deleteTranslation(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#4A6572" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {translations.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllHistory}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6347" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {translations.length > 0 ? (
        <FlatList
          data={translations}
          renderItem={renderTranslationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No translation history yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    marginLeft: 4,
    color: '#FF6347',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  translationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  translationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  translationDate: {
    color: '#888',
    fontSize: 12,
  },
  languagePair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 12,
    color: '#4A6572',
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginHorizontal: 4,
  },
  translationContent: {
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#4A6572',
    paddingLeft: 12,
  },
  originalText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  translatedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  translationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HistoryScreen;