import React, { useState } from 'react';

import { FormControl, Input, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchTrackQuery } from '@/services/tracksService';
import { useDebounce } from '@/hooks/useDebounce';
import { useInput } from '@/hooks/useInput';
import { Track } from '@/types/track';
import { useRouter } from 'next/router';
import { borderColor } from '@mui/system';

const Searchbar = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  // const [skip, setSkip] = useState(true);
  // const { data } = useSearchTrackQuery(searchbar.value, { skip });
  // const debouncedQuery = useDebounce(searchbar.value, 500);
  // const { data } = useSearchTrackQuery(debouncedQuery);
  // if (data && debouncedQuery !== null) {
  //   setTracks(data);
  // }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      return;
    }
    setQuery('');
    router.push(`/search/${query}`);
  };

  return (
    <FormControl
      variant="standard"
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          sx={{
            color: 'white',
            '&:before': { borderBottom: '1px solid #b8b8b8' },
            '&:hover:before': { borderBottom: '2px solid #b8b8b8 !important' },
          }}
          color="secondary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          id="input-with-icon-adornment"
          placeholder="Поиск"
          startAdornment={
            <InputAdornment position="start">
              <SearchRoundedIcon htmlColor="white" />
            </InputAdornment>
          }
        />
      </form>
    </FormControl>
  );
};

export default Searchbar;
