import { createSlice } from '@reduxjs/toolkit';

// Initial state for the current team being built or edited
const initialCurrentTeamState = {
  players: [],          // List of selected player objects
  captain: null,        // Selected captain's player id
  viceCaptain: null,    // Selected vice-captain's player id
  teamId: null,         // If editing, store the team id being edited
};

const teamSlice = createSlice({
  name: 'teams',
  initialState: {
    currentTeam: initialCurrentTeamState, // Team currently being edited/created
    savedTeams: [],                       // All saved teams
  },
  reducers: {
    // Add a player to the current team (only if less than 11 players
    // and the player is not already added)
    addPlayer: (state, action) => {
      if (
        state.currentTeam.players.length < 11 &&
        !state.currentTeam.players.some(p => p.id === action.payload.id)
      ) {
        state.currentTeam.players.push(action.payload);
      }
    },

    // Remove a player from the current team
    // Also resets captain or vice-captain if that player held the role
    removePlayer: (state, action) => {
      const playerIdToRemove = action.payload.id;
      state.currentTeam.players = state.currentTeam.players.filter(
        p => p.id !== playerIdToRemove
      );
      if (state.currentTeam.captain === playerIdToRemove)
        state.currentTeam.captain = null;
      if (state.currentTeam.viceCaptain === playerIdToRemove)
        state.currentTeam.viceCaptain = null;
    },

    // Set the captain for the current team.
    // If the new captain was the vice-captain, remove them from vice-captain.
    setCaptain: (state, action) => {
      const newCaptainId = action.payload;
      if (state.currentTeam.viceCaptain === newCaptainId)
        state.currentTeam.viceCaptain = null;
      state.currentTeam.captain = newCaptainId;
    },

    // Set the vice-captain for the current team.
    // If the new vice-captain was the captain, remove them from captain.
    setViceCaptain: (state, action) => {
      const newViceCaptainId = action.payload;
      if (state.currentTeam.captain === newViceCaptainId)
        state.currentTeam.captain = null;
      state.currentTeam.viceCaptain = newViceCaptainId;
    },

    // Reset the current team back to its initial state (empty)
    resetCurrentTeam: (state) => {
      state.currentTeam = initialCurrentTeamState;
    },

    // Load an existing saved team into currentTeam for editing.
    loadTeamForEditing: (state, action) => {
      const teamId = action.payload;
      const teamToEdit = state.savedTeams.find(team => team.id === teamId);
      if (teamToEdit) {
        state.currentTeam = {
          players: teamToEdit.players,
          captain: teamToEdit.captain,
          viceCaptain: teamToEdit.viceCaptain,
          teamId: teamToEdit.id, // Keep the team id to know it's being edited
        };
      }
    },

    // Save the current team.
    // If teamId exists, update an existing team. If not, create a new team.
    saveCurrentTeam: (state) => {
      const { players, captain, viceCaptain, teamId } = state.currentTeam;

      if (teamId) {
        // Update existing team
        const teamIndex = state.savedTeams.findIndex(team => team.id === teamId);
        if (teamIndex !== -1) {
          state.savedTeams[teamIndex] = {
            ...state.savedTeams[teamIndex],
            players,
            captain,
            viceCaptain,
          };
        }
      } else {
        // Create a new team
        const newTeam = {
          id: new Date().getTime(), // simple unique id
          players,
          captain,
          viceCaptain,
        };
        state.savedTeams.push(newTeam);
      }

      // Clear currentTeam after saving
      state.currentTeam = initialCurrentTeamState;
    },

    // Delete a saved team by id
    deleteTeam: (state, action) => {
      state.savedTeams = state.savedTeams.filter(
        team => team.id !== action.payload
      );
    },
  },
});

// Export the actions for use in components
export const {
  addPlayer,
  removePlayer,
  setCaptain,
  setViceCaptain,
  resetCurrentTeam,
  loadTeamForEditing,
  saveCurrentTeam,
  deleteTeam,
} = teamSlice.actions;

// Export the reducer to include in the store
export default teamSlice.reducer;
