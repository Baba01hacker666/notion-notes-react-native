/**
 * React Native Entry Point
 * Uses AppRegistry to register the root component with the native runtime.
 * Metro bundler uses this file as the entry point for Android builds.
 */
import { AppRegistry } from 'react-native';
import App from './src/App';
import { initStorage } from './src/storage/MMKVStorage';

// Kick off persistence hydration before first render on Android / iOS
initStorage();

AppRegistry.registerComponent('NotionNotes', () => App);

