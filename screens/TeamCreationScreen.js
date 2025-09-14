import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { PLAYERS } from '../constants/data';
import { flags } from '../constants/flags';
import {
  addPlayer,
  removePlayer,
  setCaptain,
  setViceCaptain,
  saveCurrentTeam,
} from '../store/features/teamSlice';
import { LinearGradient } from 'expo-linear-gradient';


const PlayerCard = ({
  player,
  isSelected,
  onSelect,
  isCaptain,
  isViceCaptain,
  onSetCaptain,
  onSetViceCaptain,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={[styles.playerCard, isSelected && styles.selectedCard]}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.playerJersey}>
          <Text style={styles.flagText}>{flags[player.team] || '🏴'}</Text>
        </View>
        <View>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerRole}>{player.role}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.playerPoints}>{player.points} pts</Text>
        {isSelected && (
          <View style={styles.cvcContainer}>
            <TouchableOpacity
              onPress={onSetCaptain}
              style={[styles.cvcButton, isCaptain && styles.captainBadgeSelected]}
            >
              <Text style={[styles.cvcText, isCaptain && styles.cvcTextSelected]}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSetViceCaptain}
              style={[styles.cvcButton, isViceCaptain && styles.vcBadgeSelected]}
            >
              <Text style={[styles.cvcText, isViceCaptain && styles.cvcTextSelected]}>VC</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const TeamCreationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('All');

  const { players: selectedPlayers, captain, viceCaptain } = useSelector(
    (state) => state.teams.currentTeam
  );

  // Save allowed only when 11 players and both captain & vice-captain are selected
  const isSaveAllowed = selectedPlayers.length === 11 && !!captain && !!viceCaptain;

  // Handler that always runs on press. It validates and either saves or shows an alert.
  const handleSaveTeam = useCallback(() => {
    if (selectedPlayers.length !== 11) {
      Alert.alert('Incomplete Team', 'Please select exactly 11 players.');
      return;
    }
    if (!captain || !viceCaptain) {
      Alert.alert('Selection Needed', 'Please select a Captain and Vice-Captain.');
      return;
    }
    // All conditions satisfied -> dispatch save and navigate
    dispatch(saveCurrentTeam());
    // navigate back to main or teams list (adjust route if necessary)
    navigation.navigate('Main', { screen: 'My Team' });
  }, [selectedPlayers, captain, viceCaptain, dispatch, navigation]);

  // Put header button in navigation; button is always pressable, color indicates allowed state.
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSaveTeam} // always callable
          style={{ marginRight: 15, paddingHorizontal: 6, paddingVertical: 4 }}
          activeOpacity={0.7}
        >
          <Text
            style={{
              color: isSaveAllowed ? '#FDC830' : '#888', // visual cue: gold when allowed, grey otherwise
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            SAVE
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSaveTeam, isSaveAllowed]);

  const handleSelectPlayer = useCallback(
    (player) => {
      if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      const isSelected = selectedPlayers.some((p) => p.id === player.id);
      if (isSelected) {
        dispatch(removePlayer(player));
      } else {
        if (selectedPlayers.length < 11) {
          dispatch(addPlayer(player));
        } else {
          Alert.alert('Team Full', 'You can only select 11 players.');
        }
      }
    },
    [selectedPlayers, dispatch]
  );

  const filteredPlayers = useMemo(() => {
    if (filter === 'All') return PLAYERS;
    return PLAYERS.filter((p) => p.role === filter);
  }, [filter]);

  const renderFilterButton = (role) => (
    <TouchableOpacity key={role} onPress={() => setFilter(role)} activeOpacity={0.8}>
      <View style={[styles.filterButton, filter === role && styles.activeFilter]}>
        <Text style={[styles.filterText, filter === role && styles.activeFilterText]}>{role}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#161616', '#000000']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.stickyHeader}>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Players Selected: {selectedPlayers.length}/11</Text>
            <View style={styles.slotsContainer}>
              {Array(11)
                .fill(0)
                .map((_, index) => (
                  <View
                    key={index}
                    style={[styles.slot, index < selectedPlayers.length && styles.slotFilled]}
                  />
                ))}
            </View>
          </View>

          <View style={styles.filterContainer}>
            {renderFilterButton('All')}
            {renderFilterButton('Batsman')}
            {renderFilterButton('Bowler')}
            {renderFilterButton('All-rounder')}
            {renderFilterButton('WK')}
          </View>
        </View>

        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              isSelected={selectedPlayers.some((p) => p.id === item.id)}
              onSelect={() => handleSelectPlayer(item)}
              isCaptain={captain === item.id}
              isViceCaptain={viceCaptain === item.id}
              onSetCaptain={() => dispatch(setCaptain(item.id))}
              onSetViceCaptain={() => dispatch(setViceCaptain(item.id))}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 130, paddingBottom: 30 }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#161616',
  },
  counterContainer: { paddingVertical: 15, alignItems: 'center', marginTop: -25 },
  counterText: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  slotsContainer: { flexDirection: 'row', width: '100%', paddingHorizontal: 8 },
  slot: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
    marginHorizontal: 3,
  },
  slotFilled: { backgroundColor: '#FDC830' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 15 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  activeFilter: { backgroundColor: '#FDC830' },
  filterText: { color: 'white' },
  activeFilterText: { color: '#000', fontWeight: '700' },

  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  selectedCard: {
    borderColor: '#FDC830',
    borderWidth: 1.2,
    backgroundColor: 'rgba(253,200,48,0.06)',
  },
  playerJersey: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  flagText: { fontSize: 26 },
  playerName: { fontSize: 16, fontWeight: '600', color: '#fff' },
  playerRole: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' },
  playerPoints: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  cvcContainer: { flexDirection: 'row' },
  cvcButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cvcText: { color: '#fff', fontWeight: 'bold' },
  captainBadgeSelected: { backgroundColor: '#FDC830', borderColor: '#FDC830' },
  vcBadgeSelected: { backgroundColor: '#c0c0c0', borderColor: '#c0c0c0' },
  cvcTextSelected: { color: '#000' },
});

export default TeamCreationScreen;
