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
  Grid
} from '@mui/material';
import {
  FitnessCenter,
  PersonOutline,
  FitnessCenterOutlined,
  Business
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService, RegisterRequest } from '../../services';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  height?: string;
  general?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    userType: 'client',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    height: undefined,
    heightUnit: 'cm'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.userType) newErrors.general = 'User type is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Password confirmation
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Height validation
    if (formData.height !== undefined && (formData.height <= 0 || formData.height > 300)) {
      newErrors.height = 'Height must be between 0 and 300';
    }

    // Phone validation (if provided)
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number format is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API (remove undefined values)
      const apiData = { ...formData };
      if (apiData.height === undefined) delete apiData.height;
      if (apiData.heightUnit === undefined) delete apiData.heightUnit;
      if (apiData.phone === '') delete apiData.phone;
      if (apiData.dateOfBirth === '') delete apiData.dateOfBirth;
      if (apiData.gender === 'prefer_not_to_say') delete apiData.gender;

      const response = await authService.register(apiData);

      if (response.success && response.data) {
        // Auto-login after successful registration
        const loginResponse = await login(formData.email, formData.password);
        if (loginResponse) {
          navigate('/dashboard');
        } else {
          setErrors({ general: 'Registration successful but login failed. Please login manually.' });
        }
      } else {
        setErrors({ general: response.message || 'Registration failed' });
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific API errors
      if (err.message?.includes('already exists')) {
        setErrors({ email: 'User with this email already exists' });
      } else if (err.message?.includes('Too many')) {
        setErrors({ general: 'Too many registration attempts. Please try again later.' });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
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
      case 'gym':
        return <Business sx={{ fontSize: 32, color: 'success.main' }} />;
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
      case 'gym':
        return 'Manage gym operations, trainers, and clients';
      default:
        return '';
    }
  };

  return (
    <Container component="main" maxWidth="md">
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
            {errors.general && <Alert severity="error" sx={{ mb: 2 }}>{errors.general}</Alert>}

            <Grid container spacing={2}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="+1234567890"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth (Optional)"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender (Optional)</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    label="Gender (Optional)"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (Optional)"
                  name="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={handleChange}
                  error={!!errors.height}
                  helperText={errors.height}
                  inputProps={{ min: 0, max: 300, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Height Unit</InputLabel>
                  <Select
                    name="heightUnit"
                    value={formData.heightUnit}
                    label="Height Unit"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="cm">Centimeters (cm)</MenuItem>
                    <MenuItem value="ft">Feet (ft)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Account Security */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                  Account Security
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                />
              </Grid>

              {/* Account Type */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
                  Account Type
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
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
                    <MenuItem value="gym">Gym</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <RouterLink to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    Sign up
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
            {['client', 'trainer', 'gym'].map((type, index) => (
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
