import React from 'react';
import { Paper, Typography } from '@mui/material';

interface EmojisComponentProps {
  emojis: string[];
}

export const EmojisComponent: React.FC<EmojisComponentProps> = ({ emojis }) => {
  const paperStyle = {
    backgroundColor: '#011830',
    padding: '2px', // Adjust padding as needed
    borderRadius: '8px', // Adjust border radius as needed
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Add elevation
  };

  return (
    <Paper style={paperStyle}>
      <Typography variant="body2">Emojis:</Typography>
      <Typography variant="body2">
        {emojis.map((emoji, index) => (
          <span key={index} style={{ fontSize: '24px', marginRight: '8px' }}>
            {emoji}
          </span>
        ))}
      </Typography>
    </Paper>
  );
};
