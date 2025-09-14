import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { deleteTeam } from '../store/features/teamSlice';

const MyTeamScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const savedTeams = useSelector(state => state.teams.savedTeams);

  const handleDelete = (teamId) => {
    Alert.alert(
      "Delete Team",
      "Are you sure you want to delete this team?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => dispatch(deleteTeam(teamId)) }
      ]
    );
  };

  const TeamCard = ({ item, index }) => {
    const totalPoints = item.players.reduce((acc, player) => {
      let points = player.points;
      if (player.id === item.captain) points *= 2;
      if (player.id === item.viceCaptain) points *= 1.5;
      return acc + points;
    }, 0);

    const captainPlayer = item.players.find(p => p.id === item.captain);
    const viceCaptainPlayer = item.players.find(p => p.id === item.viceCaptain);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('TeamPreview', { teamId: item.id })}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.teamTitle}>Team {index + 1}</Text>
          <Text style={styles.totalPoints}>{totalPoints.toFixed(1)} Pts</Text>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Text style={styles.cvcLabel}>
            C: <Text style={styles.cvcName}>{captainPlayer?.name || 'N/A'}</Text>
          </Text>
          <Text style={styles.cvcLabel}>
            VC: <Text style={styles.cvcName}>{viceCaptainPlayer?.name || 'N/A'}</Text>
          </Text>
        </View>

        {/* Delete Button at Bottom-Right */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Feather name="trash-2" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#161616', '#000000']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Teams</Text>
          <Text style={styles.teamCount}>
            {savedTeams.length} {savedTeams.length === 1 ? 'Team' : 'Teams'}
          </Text>
        </View>

        {/* List */}
        {savedTeams.length === 0 ? (
          <View style={styles.containerCenter}>
            <Feather name="users" size={60} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyText}>You haven't created any teams yet.</Text>
            <Text style={styles.emptySubText}>Create a team from the Matches screen.</Text>
          </View>
        ) : (
          <FlatList
            data={savedTeams}
            renderItem={({ item, index }) => <TeamCard item={item} index={index} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10,
    paddingBottom: 10 
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  teamCount: { fontSize: 16, color: '#FDC830', alignSelf: 'flex-end' },

  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 22, color: 'rgba(255, 255, 255, 0.8)', marginTop: 20, fontWeight: 'bold', textAlign: 'center' },
  emptySubText: { fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', marginTop: 5, textAlign: 'center' },

  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 15, 
    marginBottom: 15, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)' 
  },

  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', 
    paddingBottom: 10 
  },
  teamTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  totalPoints: { color: '#FDC830', fontSize: 16, fontWeight: 'bold' },

  cardBody: { paddingTop: 15 },
  cvcLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, marginBottom: 5 },
  cvcName: { color: 'white', fontWeight: '600' },

  deleteButton: { 
    position: 'absolute', 
    bottom: 15,  
    right: 15, 
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 8,
    borderRadius: 20
  }
});

export default MyTeamScreen;
