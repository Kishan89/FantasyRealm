import React, { useEffect } from 'react'; 
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Feather icons
import { loadTeamForEditing } from '../store/features/teamSlice';

// Small visual marker component for a player (shows avatar initial, name and points).
// Receives `player` object and flags for captain / vice-captain.
const PlayerMarker = ({ player, isCaptain, isViceCaptain }) => (
    <View style={styles.playerMarker}>
        <View style={styles.playerAvatarContainer}>
            <View style={[styles.playerAvatar, isCaptain && styles.captain, isViceCaptain && styles.viceCaptain]}>
                <Text style={styles.playerInitial}>{player.name.charAt(0)}</Text>
            </View>
            {isCaptain && <View style={[styles.markerBadge, styles.captainBadge]}><Text style={styles.markerBadgeText}>C</Text></View>}
            {isViceCaptain && <View style={[styles.markerBadge, styles.vcBadge]}><Text style={styles.markerBadgeText}>VC</Text></View>}
        </View>
        <View style={styles.playerNameContainer}>
            <Text numberOfLines={1} style={styles.markerPlayerName}>{player.name}</Text>
        </View>
        <Text style={styles.markerPlayerPoints}>{player.points} Pts</Text>
    </View>
);

// Section that groups players by role (title + horizontal wrapped list).
// `title` is the section label, `players` is an array, `team` is used to identify captain/vice-captain.
const PlayerSection = ({ title, players, team }) => (
    <View style={styles.playerSection}>
        <Text style={styles.sectionTitle}>{title} ({players.length})</Text>
        <View style={styles.sectionPlayerContainer}>
            {players.map(p => (
                <PlayerMarker 
                    key={p.id} 
                    player={p}
                    isCaptain={p.id === team.captain}
                    isViceCaptain={p.id === team.viceCaptain}
                />
            ))}
        </View>
    </View>
);


const TeamPreviewScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { teamId } = route.params;
    // Select the saved team from Redux by id
    const team = useSelector(state => state.teams.savedTeams.find(t => t.id === teamId));

    // Handler for Edit button — loads the team into Redux for editing and navigates to CreateTeam screen
    const handleEdit = () => {
        dispatch(loadTeamForEditing(teamId)); // Load team into Redux for editing
        navigation.navigate('CreateTeam'); // Navigate to the team creation/edit screen
    };

    // Add an "Edit" button to the header when the screen mounts
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleEdit} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <Feather name="edit-2" size={20} color="#FDC830" />
                    <Text style={{ color: '#FDC830', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>Edit</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, teamId]);


    if (!team) {
        // If the team cannot be found, show a simple gradient error screen
        return (
            <LinearGradient colors={['#161616', '#000000']} style={styles.errorContainer}>
                <Text style={styles.errorText}>Team not found!</Text>
            </LinearGradient>
        );
    }

    // Helper to get players filtered by role (WK, Batsman, All-rounder, Bowler)
    const getPlayersByRole = (role) => team.players.filter(p => p.role === role);

    return (
        <View style={{flex: 1}}>
            <ImageBackground 
                source={require('../assets/ground.png')}
                resizeMode="cover"
                style={styles.ground}
            >
                <View style={styles.overlay} />
                <SafeAreaView style={styles.container}>
                    <PlayerSection title="Wicket Keepers" players={getPlayersByRole('WK')} team={team} />
                    <PlayerSection title="Batsmen" players={getPlayersByRole('Batsman')} team={team} />
                    <PlayerSection title="All Rounders" players={getPlayersByRole('All-rounder')} team={team} />
                    <PlayerSection title="Bowlers" players={getPlayersByRole('Bowler')} team={team} />
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    // Rest of the styles remain unchanged...
    container: { flex: 1, justifyContent: 'space-evenly' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'white', fontSize: 18 },
    ground: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    playerSection: { width: '100%', alignItems: 'center', marginVertical: 5 },
    sectionTitle: { color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold', paddingVertical: 4, paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 15, marginBottom: 15, letterSpacing: 1 },
    sectionPlayerContainer: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', width: '100%', paddingHorizontal: 10 },
    playerMarker: { alignItems: 'center', width: 80, marginHorizontal: 2, marginBottom: 10 },
    playerAvatarContainer: { marginBottom: 5 },
    playerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
    playerInitial: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    playerNameContainer: { backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, width: '100%' },
    markerPlayerName: { color: '#fff', fontSize: 11, fontWeight: '600', textAlign: 'center' },
    markerPlayerPoints: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 2, fontWeight: 'bold' },
    captain: { borderColor: '#FDC830' },
    viceCaptain: { borderColor: '#c0c0c0' },
    markerBadge: { position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#161616'},
    captainBadge: { backgroundColor: '#FDC830' },
    vcBadge: { backgroundColor: '#c0c0c0' },
    markerBadgeText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
});

export default TeamPreviewScreen;
