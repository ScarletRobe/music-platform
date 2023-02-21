import React, { useEffect } from 'react';
import { PlayArrow, Pause, VolumeUp, VolumeDown } from '@mui/icons-material';
import { IconButton, Grid, Slider, Box, Stack } from '@mui/material';
import TrackProgress from './TrackProgress';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import {
  setCurrentTime,
  setDuration,
  setPlay,
  setVolume,
  setPause,
} from '@/store/playerSlice/playerSlice';

import styles from './Player.module.css';

let audio: HTMLAudioElement | null = null;

const Player = () => {
  const dispatch = useDispatch();

  // Player destructuring causes rerender when any state property is changed even unused ones
  const pause = useTypedSelector((state) => state.player.pause);
  const activeTrack = useTypedSelector((state) => state.player.activeTrack);
  const volume = useTypedSelector((state) => state.player.volume);

  useEffect(() => {
    if (!audio) {
      audio = new Audio();
    } else {
      setAudio();
      audio.onloadeddata = () => {
        play();
      };
    }
  }, [activeTrack]);

  useEffect(() => {
    if (!audio) {
      return;
    }
    if (audio.src) {
      !pause ? audio?.play() : audio?.pause();
    }
  }, [pause]);

  const setAudio = () => {
    if (activeTrack && audio) {
      audio.src = 'http://localhost:5000/' + activeTrack.audio;
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => {
        if (!audio) {
          return;
        }
        dispatch(setDuration(Math.ceil(audio.duration)));
      };
      audio.ontimeupdate = () => {
        if (!audio) {
          return;
        }
        dispatch(setCurrentTime(Math.ceil(audio.currentTime)));
      };
      audio.onended = () => {
        dispatch(setPause());
      };
    }
  };

  const play = () => {
    if (!audio) {
      return;
    }

    if (pause) {
      dispatch(setPlay());
    } else {
      dispatch(setPause());
    }
  };

  const changeVolume = (_: any, value: number | number[]) => {
    if (!audio) {
      dispatch(setVolume(0));
      return;
    }
    audio.volume = Number(value) / 100;
    dispatch(setVolume(Number(value)));
  };

  const changeCurrentTime = (_: any, value: number | number[]) => {
    if (!audio) {
      dispatch(setCurrentTime(0));
      return;
    }
    audio.currentTime = Number(value);
    dispatch(setCurrentTime(Number(value)));
  };

  if (!activeTrack) {
    return null;
  }

  return (
    <div className={styles.player}>
      <IconButton onClick={play}>
        {pause ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Stack direction="row" className={styles.trackInfo} spacing="2">
        <Image
          width="50"
          height="50"
          src={`http://localhost:5000/${activeTrack.picture}`}
          alt="Track cover"
        ></Image>
        <Grid
          container
          direction="column"
          sx={{ flex: '1', overflow: 'hidden' }}
        >
          <div>{activeTrack?.name}</div>
          <div className={styles.artist}>{activeTrack?.artist}</div>
        </Grid>
      </Stack>
      <TrackProgress onChange={changeCurrentTime} />
      <Box ml="auto" sx={{ width: 200 }}>
        <Stack direction="row" alignItems="center">
          <VolumeDown />
          <Slider
            aria-label="Volume"
            min={0}
            max={100}
            value={volume}
            onChange={changeVolume}
          />
          <VolumeUp />
        </Stack>
      </Box>
    </div>
  );
};

export default Player;
