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
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = () => {
    if (email.trim() === '') {
      Alert.alert('Input required', 'Please enter your email address.');
      return;
    }
    
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Check Your Email', 'A password reset link has been sent to your email address.', [
          { text: "OK", onPress: () => navigation.navigate('Login') }
        ]);
      })
      .catch(err => Alert.alert('Error', err.message))
      .finally(() => setLoading(false));
  };

  return (
    <LinearGradient
      colors={['#173e56ff', '#272987ff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingContainer}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email below and we'll send you a link to get back into your account.</Text>
            
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
              <LinearGradient
                colors={['#00F260', '#0575E6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.buttonGradient}
              >
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoidingContainer: { flex: 1 },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  contentContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 15 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', marginBottom: 40 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 15, marginBottom: 20, paddingHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#fff', fontSize: 16 },
  button: { borderRadius: 15, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  buttonGradient: { paddingVertical: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;