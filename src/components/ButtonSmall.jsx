import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ButtonSmall({ onClick, children }) {
  return (
    <Box sx={{ '& button': { m: 1 } }}>
      <div>
        <Button variant="contained" size="small" onClick={onClick}>
          {children}
        </Button>
      </div>
    </Box>
  );
}
