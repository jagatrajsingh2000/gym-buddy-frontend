import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FitnessCenter, PersonOutline, FitnessCenterOutlined, AdminPanelSettings } from '@mui/icons-material';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { demoCredentials } from '../../data/demoCredentials';

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
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    
    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Demo login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred with demo login.');
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <AdminPanelSettings sx={{ fontSize: 20 }} />;
      case 'trainer':
        return <FitnessCenterOutlined sx={{ fontSize: 20 }} />;
      case 'client':
        return <PersonOutline sx={{ fontSize: 20 }} />;
      default:
        return <PersonOutline sx={{ fontSize: 20 }} />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'error';
      case 'trainer':
        return 'warning';
      case 'client':
        return 'primary';
      default:
        return 'default';
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

        {/* Demo Credentials Section */}
        <Paper elevation={2} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}>
            🚀 Demo Credentials
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Try the app with different user types - no registration required!
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
            {demoCredentials.map((demo, index) => (
              <Card 
                key={index} 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.2s',
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
                onClick={() => handleDemoLogin(demo.email, demo.password)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getUserTypeIcon(demo.userType)}
                    <Chip
                      label={demo.userType.toUpperCase()}
                      color={getUserTypeColor(demo.userType) as any}
                      size="small"
                      sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {demo.profile.firstName} {demo.profile.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {demo.email}
                  </Typography>
                  {demo.profile.specialization && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {demo.profile.specialization}
                    </Typography>
                  )}
                  {demo.profile.gymName && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {demo.profile.gymName}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            Click any card above to instantly log in as that user type
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
