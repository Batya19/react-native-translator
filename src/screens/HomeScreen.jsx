import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  Share,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GOOGLE_TRANSLATE_API_KEY } from '@env';

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

const HomeScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  const [lastTranslations, setLastTranslations] = useState([]);

  useEffect(() => {
    loadLastTranslations();
  }, []);

  const loadLastTranslations = async () => {
    try {
      const savedTranslations = await AsyncStorage.getItem('translations');
      if (savedTranslations !== null) {
        setLastTranslations(JSON.parse(savedTranslations));
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  };

  const saveTranslation = async (from, to, original, translated) => {
    try {
      const newTranslation = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        sourceLanguage: from,
        targetLanguage: to,
        originalText: original,
        translatedText: translated
      };

      const updatedTranslations = [newTranslation, ...lastTranslations.slice(0, 9)];
      setLastTranslations(updatedTranslations);
      await AsyncStorage.setItem('translations', JSON.stringify(updatedTranslations));
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const translateText = async () => {
    if (!inputText) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: inputText,
            source: sourceLanguage,
            target: targetLanguage,
            format: 'text',
          }),
        }
      );

      const data = await response.json();

      if (data.data && data.data.translations && data.data.translations[0]) {
        const translatedText = data.data.translations[0].translatedText;
        setTranslatedText(translatedText);
        saveTranslation(sourceLanguage, targetLanguage, inputText, translatedText);
      } else if (data.error) {
        console.error('API Error:', data.error.message);
        throw new Error(data.error.message);
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Translation error:', error);

      Alert.alert(
        'Connection Error',
        'Could not connect to translation service. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const shareTranslation = async () => {
    if (!translatedText) {
      Alert.alert('Error', 'No translation to share');
      return;
    }

    try {
      await Share.share({
        message: `Source (${getLanguageName(sourceLanguage)}): ${inputText}\nTranslation (${getLanguageName(targetLanguage)}): ${translatedText}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the translation');
    }
  };

  const getLanguageName = (code) => {
    const language = LANGUAGES.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate('History')}
            >
              <Ionicons name="time-outline" size={24} color="#4A6572" />
              <Text style={styles.historyButtonText}>History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.languageSelector}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setSourceModalVisible(true)}
            >
              <Text style={styles.languageButtonText}>
                {getLanguageName(sourceLanguage)}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#4A6572" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
              <Ionicons name="swap-horizontal" size={24} color="#4A6572" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setTargetModalVisible(true)}
            >
              <Text style={styles.languageButtonText}>
                {getLanguageName(targetLanguage)}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#4A6572" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter text to translate..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
            />
            {inputText ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setInputText('')}
              >
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.translateButton}
            onPress={translateText}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="language" size={20} color="#fff" />
                <Text style={styles.translateButtonText}>Translate</Text>
              </>
            )}
          </TouchableOpacity>

          {translatedText ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Translation Result:</Text>
              <Text style={styles.resultText}>{translatedText}</Text>
              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={shareTranslation}
                >
                  <Ionicons name="share-outline" size={20} color="#4A6572" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sourceModalVisible}
        onRequestClose={() => setSourceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Source Language</Text>
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((language) => (
                <Pressable
                  key={language.code}
                  style={[
                    styles.languageItem,
                    sourceLanguage === language.code && styles.selectedLanguage,
                  ]}
                  onPress={() => {
                    setSourceLanguage(language.code);
                    setSourceModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageItemText,
                      sourceLanguage === language.code && styles.selectedLanguageText,
                    ]}
                  >
                    {language.name}
                  </Text>
                  {sourceLanguage === language.code && (
                    <Ionicons name="checkmark" size={20} color="#4A6572" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSourceModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={targetModalVisible}
        onRequestClose={() => setTargetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Target Language</Text>
            <ScrollView style={styles.languageList}>
              {LANGUAGES.map((language) => (
                <Pressable
                  key={language.code}
                  style={[
                    styles.languageItem,
                    targetLanguage === language.code && styles.selectedLanguage,
                  ]}
                  onPress={() => {
                    setTargetLanguage(language.code);
                    setTargetModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageItemText,
                      targetLanguage === language.code && styles.selectedLanguageText,
                    ]}
                  >
                    {language.name}
                  </Text>
                  {targetLanguage === language.code && (
                    <Ionicons name="checkmark" size={20} color="#4A6572" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTargetModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  historyButtonText: {
    marginLeft: 4,
    color: '#4A6572',
    fontWeight: 'bold',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageButtonText: {
    marginRight: 4,
    fontWeight: 'bold',
    color: '#4A6572',
  },
  swapButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 120,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  translateButton: {
    backgroundColor: '#4A6572',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4A6572',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 16,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    color: '#4A6572',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.8,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageList: {
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff',
  },
  languageItemText: {
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: 'bold',
    color: '#4A6572',
  },
  closeButton: {
    backgroundColor: '#4A6572',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;