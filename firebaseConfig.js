import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyCDINl9cv6gO-yO8fCtFveyTTHq7GlcKow",
  authDomain: "fantasyapp-f540d.firebaseapp.com",
  projectId: "fantasyapp-f540d",
  storageBucket: "fantasyapp-f540d.firebasestorage.app",
  messagingSenderId: "1096948827809",
  appId: "1:1096948827809:web:f89b5ff1ca5152d4b152e0",
  measurementId: "G-CVNXJHFY20"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});