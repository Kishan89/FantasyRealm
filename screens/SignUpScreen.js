import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignUp = () => {
    if (email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Invalid Input', 'Please fill all the fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords do not match.');
      return;
    }
    if (password.length < 6) {
        Alert.alert('Weak Password', 'Password should be at least 6 characters long.');
        return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => console.log('Sign up success'))
      .catch(err => {
        let errorMessage = 'An unknown error occurred.';
        if (err.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already in use.';
        } else if (err.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }
        Alert.alert('Sign Up Error', errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={['#42275a', '#734b6d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the League of Champions</Text>
          
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!isConfirmPasswordVisible}
            />
             <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}>
              <Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={20} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
            <LinearGradient
              // Sign Up button gradient
              colors={['#1CB5E0', '#000046']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.buttonGradient}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerText}>Already have an account? <Text style={styles.boldText}>Login</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// Reusing most styles from LoginScreen but with minor tweaks
const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  contentContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10, textShadowColor: 'rgba(0, 0, 0, 0.25)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
  subtitle: { fontSize: 18, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#fff', fontSize: 16 },
  button: { borderRadius: 15, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  buttonGradient: { paddingVertical: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { marginTop: 30, alignItems: 'center' },
  footerText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 },
  boldText: { fontWeight: 'bold', color: '#fff' }
});

export default SignUpScreen;