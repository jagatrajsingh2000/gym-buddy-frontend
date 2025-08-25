import React from 'react';
import { Card as MuiCard, CardHeader, CardContent, CardActions, CardProps, Box, Typography } from '@mui/material';

interface CustomCardProps extends CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'none';
  elevated?: boolean;
  hoverable?: boolean;
  icon?: React.ReactNode;
}

export const Card: React.FC<CustomCardProps> = ({ 
  title, 
  subtitle,
  children, 
  actions, 
  gradient = 'none',
  elevated = true,
  hoverable = true,
  icon,
  sx,
  ...props 
}) => {
  const getGradientStyles = (gradientType: string) => {
    if (gradientType === 'none') return {};
    
    const gradients = {
      primary: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
      secondary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      success: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
      warning: 'linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)',
      error: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
      info: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)'
    };

    return {
      background: gradients[gradientType as keyof typeof gradients],
      color: 'white',
      '& .MuiCardHeader-title, & .MuiCardHeader-subheader': {
        color: 'white'
      }
    };
  };

  const baseStyles = {
    borderRadius: 4,
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    position: 'relative' as const,
    ...(elevated && {
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)'
    }),
    ...(hoverable && {
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
        '& .card-hover-overlay': {
          opacity: 1
        }
      }
    })
  };

  const gradientStyles = getGradientStyles(gradient);

  return (
    <MuiCard 
      sx={{
        ...baseStyles,
        ...gradientStyles,
        ...sx
      }}
      {...props}
    >
      {/* Hover Overlay Effect */}
      {hoverable && (
        <Box
          className="card-hover-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}

      {/* Enhanced Header */}
      {(title || subtitle || icon) && (
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: gradient === 'none' 
                    ? 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: gradient === 'none' ? 'white' : 'white',
                  fontSize: '1.2rem'
                }}>
                  {icon}
                </Box>
              )}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '0.3px'
                }}
              >
                {title}
              </Typography>
            </Box>
          }
          subheader={
            subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8,
                  mt: 0.5,
                  fontSize: '0.85rem'
                }}
              >
                {subtitle}
              </Typography>
            )
          }
          sx={{
            pb: 1,
            '& .MuiCardHeader-content': {
              minWidth: 0
            }
          }}
        />
      )}

      {/* Content */}
      <CardContent sx={{ 
        position: 'relative',
        zIndex: 2,
        '&:last-child': { pb: 2 }
      }}>
        {children}
      </CardContent>

      {/* Actions */}
      {actions && (
        <CardActions sx={{ 
          pt: 0,
          pb: 2,
          px: 2,
          position: 'relative',
          zIndex: 2
        }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};
