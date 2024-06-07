import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Searchbar() {
  return (
    <Autocomplete
      id="free-solo-demo"
      freeSolo
      options={[]}
      renderInput={(params) => <TextField {...params} label="Search" />}
      sx={{ width: 300 }}
    />
  );
}
