import React from 'react';
import { Card as MuiCard, CardHeader, CardContent, CardActions, CardProps } from '@mui/material';

interface CustomCardProps extends CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CustomCardProps> = ({ 
  title, 
  children, 
  actions, 
  ...props 
}) => {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};
