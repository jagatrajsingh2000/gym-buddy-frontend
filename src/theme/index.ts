import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',      // Deep navy - premium, professional
      light: '#16213e',
      dark: '#0f0f23',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#e94560',      // Vibrant red - energy, motivation
      light: '#f06292',
      dark: '#c2185b',
      contrastText: '#ffffff'
    },
    success: {
      main: '#00d4aa',      // Teal green - progress, achievement
      light: '#4db6ac',
      dark: '#00796b',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#ff9f43',      // Warm orange - attention, vitality
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ff4757',      // Modern red - errors, alerts
      light: '#ff6b7a',
      dark: '#d32f2f',
      contrastText: '#ffffff'
    },
    info: {
      main: '#3742fa',      // Modern blue - information, data
      light: '#5c6bc0',
      dark: '#1976d2',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc',   // Light gray-blue - clean, modern
      paper: '#ffffff'
    },
    text: {
      primary: '#1a1a2e',   // Deep navy for primary text
      secondary: '#6b7280'  // Muted gray for secondary text
    },
    divider: '#e5e7eb'
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h1: { 
      fontSize: '3rem', 
      fontWeight: 700, 
      letterSpacing: '-0.02em',
      lineHeight: 1.2
    },
    h2: { 
      fontSize: '2.5rem', 
      fontWeight: 700, 
      letterSpacing: '-0.01em',
      lineHeight: 1.3
    },
    h3: { 
      fontSize: '2rem', 
      fontWeight: 600, 
      letterSpacing: '-0.01em',
      lineHeight: 1.4
    },
    h4: { 
      fontSize: '1.5rem', 
      fontWeight: 600, 
      letterSpacing: '0em',
      lineHeight: 1.4
    },
    h5: { 
      fontSize: '1.25rem', 
      fontWeight: 600, 
      letterSpacing: '0em',
      lineHeight: 1.5
    },
    h6: { 
      fontSize: '1.125rem', 
      fontWeight: 600, 
      letterSpacing: '0em',
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em'
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.025em',
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 16
  },
  // shadows: Using default Material-UI shadows
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)'
          },
          '&:active': {
            transform: 'translateY(0px)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16213e 0%, #0f0f23 100%)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 64,
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #e94560 0%, #ff9f43 100%)'
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 64,
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          color: '#6b7280',
          '&.Mui-selected': {
            color: '#1a1a2e'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e94560'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e94560',
              borderWidth: '2px'
            }
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.15)'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none'
        }
      }
    }
  }
});
