import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({ 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  gradient,
  rounded = false,
  children, 
  sx,
  ...props 
}) => {
  const getGradientColors = (gradientType?: string) => {
    switch (gradientType) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
          hover: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)'
        };
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          hover: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)'
        };
      case 'success':
        return {
          background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
          hover: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)'
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)',
          hover: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
          hover: 'linear-gradient(135deg, #ff3742 0%, #ff2e44 100%)'
        };
      case 'info':
        return {
          background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
          hover: 'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
          hover: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)'
        };
    }
  };

  const getSizeStyles = (sizeType: string) => {
    switch (sizeType) {
      case 'small':
        return {
          px: 2,
          py: 0.75,
          fontSize: '0.75rem',
          borderRadius: rounded ? 2 : 1.5
        };
      case 'large':
        return {
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          borderRadius: rounded ? 4 : 3
        };
      default:
        return {
          px: 3,
          py: 1,
          fontSize: '0.875rem',
          borderRadius: rounded ? 3 : 2
        };
    }
  };

  const gradientColors = getGradientColors(gradient);
  const sizeStyles = getSizeStyles(size);

  const baseStyles = {
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease-in-out',
    position: 'relative' as const,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease-in-out'
    },
    '&:hover::before': {
      left: '100%'
    }
  };

  const variantStyles = {
    contained: {
      ...baseStyles,
      ...sizeStyles,
      background: gradient ? gradientColors.background : undefined,
      color: 'white',
      boxShadow: gradient ? '0px 4px 20px rgba(0, 0, 0, 0.15)' : undefined,
      '&:hover': {
        background: gradient ? gradientColors.hover : undefined,
        transform: 'translateY(-2px)',
        boxShadow: gradient ? '0px 8px 25px rgba(0, 0, 0, 0.25)' : undefined
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: gradient ? '0px 2px 10px rgba(0, 0, 0, 0.2)' : undefined
      }
    },
    outlined: {
      ...baseStyles,
      ...sizeStyles,
      borderWidth: '2px',
      borderColor: gradient ? 'transparent' : undefined,
      background: gradient ? gradientColors.background : 'transparent',
      color: gradient ? 'white' : undefined,
      '&:hover': {
        background: gradient ? gradientColors.hover : 'rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-2px)',
        boxShadow: gradient ? '0px 8px 25px rgba(0, 0, 0, 0.25)' : undefined
      }
    },
    text: {
      ...baseStyles,
      ...sizeStyles,
      background: 'transparent',
      color: gradient ? undefined : undefined,
      '&:hover': {
        background: gradient ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        transform: 'translateY(-1px)'
      }
    }
  };

  return (
    <MuiButton 
      variant={variant} 
      color={color} 
      size={size} 
      sx={{
        ...variantStyles[variant as keyof typeof variantStyles],
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
