import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',      // Blue - fitness/health
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#ff6b35',      // Orange - energy/motivation
      light: '#ff8a65',
      dark: '#e64a19'
    },
    success: {
      main: '#4caf50',      // Green - progress/achievement
    },
    warning: {
      main: '#ff9800',      // Orange - attention
    },
    error: {
      main: '#f44336',      // Red - errors/alerts
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }
    }
  }
});
