# 🌎 Language Translator App

A simple yet powerful language translation app built with React Native

## ✨ Features

- **Multiple Languages Support**: Translate between 10 different languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Arabic, and Hebrew
- **Intuitive UI**: Clean and user-friendly interface for a seamless experience
- **Language Swap**: Easily swap between source and target languages with one tap
- **Translation History**: Save and access your previous translations
- **Sharing**: Share translations with others via native share functionality
- **Modern Design**: Beautiful UI with responsive components and smooth animations

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Batya19/react-native-translator.git
   cd react-native-translator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. Create a `.env` file in the root directory with your Google Translate API key:
   ```
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 App Preview

The app features a clean, intuitive interface with:
- Home screen for translations
- History screen to view past translations
- Elegant splash screen
- Modal language selection
- Easy text input and results display

## 📋 Technologies Used

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Google Cloud Translation API](https://cloud.google.com/translate)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)

## 🔍 App Structure

```
src/
  └── screens/
      ├── HomeScreen.jsx      # Main translation interface
      ├── HistoryScreen.jsx   # Translation history view
      └── SplashScreen.jsx    # Initial loading screen
```

## 🛠️ Setup Google Translate API

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Cloud Translation API
4. Create an API key
5. Add the API key to your `.env` file as shown in the installation section

## 💡 Usage

1. **Translation**: 
   - Select source and target languages
   - Enter text to translate
   - Tap the "Translate" button
   
2. **History**:
   - View past translations
   - Share or delete individual entries
   - Clear all history with one tap

3. **Language Selection**:
   - Choose from 10 supported languages
   - Quickly swap between source and target languages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the love of coding and languages