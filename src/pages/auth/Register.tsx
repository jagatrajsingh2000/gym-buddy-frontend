import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  FitnessCenter,
  PersonOutline,
  FitnessCenterOutlined,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService, RegisterRequest } from '../../services';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    userType: 'client',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(formData);

      if (response.success && response.data) {
        // Auto-login after successful registration
        const loginResponse = await login(formData.email, formData.password);
        if (loginResponse) {
          navigate('/dashboard');
        } else {
          setError('Registration successful but login failed. Please login manually.');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <PersonOutline sx={{ fontSize: 32, color: 'primary.main' }} />;
      case 'trainer':
        return <FitnessCenterOutlined sx={{ fontSize: 32, color: 'secondary.main' }} />;
      case 'admin':
        return <AdminPanelSettings sx={{ fontSize: 32, color: 'error.main' }} />;
      default:
        return <PersonOutline sx={{ fontSize: 32, color: 'primary.main' }} />;
    }
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case 'client':
        return 'Track workouts, manage diet, and monitor progress';
      case 'trainer':
        return 'Manage clients, create plans, and track progress';
      case 'admin':
        return 'Manage gym operations, trainers, and clients';
      default:
        return '';
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', borderRadius: 3 }}>
          <FitnessCenter sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Create Your Gym Buddy Account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join our fitness community today!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Phone (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="user-type-label">Account Type</InputLabel>
              <Select
                labelId="user-type-label"
                name="userType"
                value={formData.userType}
                label="Account Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="client">Client</MenuItem>
                <MenuItem value="trainer">Trainer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <RouterLink to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Sign in
                  </Box>
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ mt: 3, p: 3, borderRadius: 3, width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: 'primary.main' }}>
            Account Types
          </Typography>
          <Grid container spacing={2}>
            {['client', 'trainer', 'admin'].map((type, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  {getUserTypeIcon(type)}
                  <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getUserTypeDescription(type)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
