import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({ 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  children, 
  ...props 
}) => {
  return (
    <MuiButton 
      variant={variant} 
      color={color} 
      size={size} 
      {...props}
    >
      {children}
    </MuiButton>
  );
};
