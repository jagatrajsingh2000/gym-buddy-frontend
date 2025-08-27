import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TestAuth: React.FC = () => {
  const { user, token, loading, logout } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    // Get all localStorage data for debugging
    const data: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          data[key] = value;
        } catch (e) {
          data[key] = 'Error reading value';
        }
      }
    }
    setLocalStorageData(data);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    setLocalStorageData({});
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Authentication Test Page
        </Typography>

        {user ? (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ✅ User is Authenticated
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography><strong>User ID:</strong> {user.id}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
                <Typography><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
                <Typography><strong>User Type:</strong> {user.userType}</Typography>
                <Typography><strong>Status:</strong> {user.status}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'None'}</Typography>
                <Typography><strong>Created:</strong> {user.created_at}</Typography>
                <Typography><strong>Updated:</strong> {user.updated_at}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Alert severity="warning">
              <Typography variant="h6">❌ User is NOT Authenticated</Typography>
              <Typography>Please log in to access the dashboard.</Typography>
            </Alert>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Local Storage Debug Info
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={clearLocalStorage} sx={{ mr: 2 }}>
              Clear Local Storage
            </Button>
          </Box>
          <Grid container spacing={2}>
            {Object.entries(localStorageData).map(([key, value]) => (
              <Grid item xs={12} md={6} key={key}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="primary">
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default TestAuth;
