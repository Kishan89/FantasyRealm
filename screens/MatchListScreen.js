import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MATCHES } from '../constants/data';
import { flags } from '../constants/flags';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { resetCurrentTeam } from '../store/features/teamSlice';
import { auth } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const MatchListScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleCreateTeam = (matchId) => {
    dispatch(resetCurrentTeam());
    navigation.navigate('CreateTeam', { matchId });
  };

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to log out?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          signOut(auth)
            .catch(error => console.error('Logout error:', error));
        },
      },
    ],
    { cancelable: true }
  );
};
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.teamContainer}>
        <View style={styles.team}>
          <View style={styles.logoPlaceholder}><Text style={styles.flagText}>{flags[item.teamAShort] || '🏴'}</Text></View>
          <Text style={styles.teamName}>{item.teamA}</Text>
        </View>
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.team}>
          <View style={styles.logoPlaceholder}><Text style={styles.flagText}>{flags[item.teamBShort] || '🏴'}</Text></View>
          <Text style={styles.teamName}>{item.teamB}</Text>
        </View>
      </View>
      <Text style={styles.time}>{item.time}</Text>
      <TouchableOpacity onPress={() => handleCreateTeam(item.id)}>
        <LinearGradient
          colors={['#FDC830', '#F37335']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Team</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#161616', '#000000']} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>Upcoming Matches</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={MATCHES}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 10 
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  logoutButton: { padding: 5 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  teamContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  team: { alignItems: 'center', flex: 1 },
  logoPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  flagText: { fontSize: 40 },
  teamName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  vsText: { color: '#FDC830', fontSize: 14, fontWeight: 'bold', marginHorizontal: 10 },
  time: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, textAlign: 'center', marginVertical: 15 },
  button: { paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
});

export default MatchListScreen;