import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const TestAuth: React.FC = () => {
  const { user, token, loading, login, logout } = useAuth();

  const handleDemoLogin = () => {
    login('client@gymbuddy.com', 'demo123');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          🔍 Authentication Test Page
        </Typography>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current State
            </Typography>
            <Typography variant="body1">
              <strong>Loading:</strong> {loading ? '🔄 Yes' : '✅ No'}
            </Typography>
            <Typography variant="body1">
              <strong>Has Token:</strong> {token ? '✅ Yes' : '❌ No'}
            </Typography>
            <Typography variant="body1">
              <strong>Has User:</strong> {user ? '✅ Yes' : '❌ No'}
            </Typography>
            {token && (
              <Typography variant="body1">
                <strong>Token:</strong> {token.substring(0, 20)}...
              </Typography>
            )}
            {user && (
              <Typography variant="body1">
                <strong>User:</strong> {user.email} ({user.userType})
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              localStorage Contents
            </Typography>
            <Typography variant="body1">
              <strong>Token:</strong> {localStorage.getItem('token') || 'None'}
            </Typography>
            <Typography variant="body1">
              <strong>User:</strong> {localStorage.getItem('user') || 'None'}
            </Typography>
            <Typography variant="body1">
              <strong>Demo User:</strong> {localStorage.getItem('demo_user') || 'None'}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Login as Demo Client
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleLogout}
            disabled={!user}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TestAuth;
