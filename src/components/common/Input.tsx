import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface CustomInputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  type?: string;
  error?: boolean;
  helperText?: string;
}

export const Input: React.FC<CustomInputProps> = ({ 
  label, 
  type = 'text', 
  error = false, 
  helperText, 
  ...props 
}) => {
  return (
    <TextField
      label={label}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
};
