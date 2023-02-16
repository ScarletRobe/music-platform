import { Track } from '@/types/track';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

type PlayerInitialState = {
  activeTrack: null | Track;
  volume: number;
  duration: number;
  currentTime: number;
  pause: boolean;
};

const initialState: PlayerInitialState = {
  currentTime: 0,
  duration: 0,
  volume: 0,
  pause: true,
  activeTrack: null,
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlay: (state) => {
      console.log('working');
      state.pause = false;
    },
    setPause: (state) => {
      state.pause = true;
    },
    setActiveTrack: (state, action: PayloadAction<Track | null>) => {
      state.activeTrack = action.payload;
      state.duration = 0;
      state.currentTime = 0;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
  },
});

export const {
  setPlay,
  setPause,
  setActiveTrack,
  setCurrentTime,
  setDuration,
  setVolume,
} = playerSlice.actions;