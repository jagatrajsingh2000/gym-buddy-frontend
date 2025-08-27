import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FitnessCenter } from '@mui/icons-material';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        // The error message will be set by the AuthContext
        setError('Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      // Handle specific API errors
      if (err.message?.includes('429')) {
        setError('Too many login attempts. Please try again later.');
      } else if (err.message?.includes('400')) {
        setError('Email and password are required.');
      } else if (err.message?.includes('401')) {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred. Please check your connection and try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3
          }}
        >
          <FitnessCenter sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Welcome to Gym Buddy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to track your fitness journey
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Sign up
                  </Box>
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
