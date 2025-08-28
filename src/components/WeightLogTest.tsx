import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  TextField,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
  Divider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Casino as CasinoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService } from '../services/bodyMetricsService';

interface WeightLogForm {
  weight: string;
  weightUnit: 'kg' | 'lbs';
  measurementDate: string;
  measurementTime: string;
  measurementCondition: string;
  notes: string;
  mood: string;
  sleepHours: string;
  stressLevel: 'low' | 'medium' | 'high';
}

interface WeightEntry {
  id: number;
  userId: number;
  weight: number;
  weightUnit: string;
  measurementDate: string;
  measurementTime: string | null;
  measurementCondition: string | null;
  notes: string | null;
  mood: string | null;
  sleepHours: number | null;
  stressLevel: string | null;
  bmi: string | null;
  created_at: string;
  updated_at: string;
}

const WeightLogTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [lastLoggedEntry, setLastLoggedEntry] = useState<WeightEntry | null>(null);

  // Form state
  const [formData, setFormData] = useState<WeightLogForm>({
    weight: '',
    weightUnit: 'kg',
    measurementDate: new Date().toISOString().split('T')[0],
    measurementTime: new Date().toTimeString().slice(0, 5),
    measurementCondition: '',
    notes: '',
    mood: '',
    sleepHours: '',
    stressLevel: 'low'
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined options
  const measurementConditions = [
    'morning', 'evening', 'after_workout', 'before_workout', 
    'after_meal', 'before_meal', 'fasting', 'post_shower'
  ];

  const moodOptions = [
    'good', 'tired', 'stressed', 'energetic', 'focused', 
    'relaxed', 'motivated', 'exhausted'
  ];

  const stressLevels = ['low', 'medium', 'high'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else {
      const weight = parseFloat(formData.weight);
      if (isNaN(weight) || weight <= 0) {
        newErrors.weight = 'Weight must be a positive number';
      } else if (weight > 1000) {
        newErrors.weight = 'Weight seems too high. Please check the value.';
      }
    }

    // Validate weight unit
    if (!formData.weightUnit) {
      newErrors.weightUnit = 'Weight unit is required';
    }

    // Validate date
    if (!formData.measurementDate) {
      newErrors.measurementDate = 'Date is required';
    } else {
      const date = new Date(formData.measurementDate);
      if (isNaN(date.getTime())) {
        newErrors.measurementDate = 'Invalid date format';
      }
    }

    // Validate time (optional but if provided, must be valid)
    if (formData.measurementTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.measurementTime)) {
      newErrors.measurementTime = 'Invalid time format (HH:MM)';
    }

    // Validate sleep hours (optional but if provided, must be valid)
    if (formData.sleepHours.trim()) {
      const sleepHours = parseFloat(formData.sleepHours);
      if (isNaN(sleepHours) || sleepHours < 0 || sleepHours > 24) {
        newErrors.sleepHours = 'Sleep hours must be between 0 and 24';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof WeightLogForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        weight: parseFloat(formData.weight),
        weightUnit: formData.weightUnit,
        measurementDate: formData.measurementDate,
        measurementTime: formData.measurementTime || undefined,
        measurementCondition: formData.measurementCondition || undefined,
        notes: formData.notes || undefined,
        mood: formData.mood || undefined,
        sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : undefined,
        stressLevel: formData.stressLevel
      };

      const response = await bodyMetricsService.logWeight(token!, submitData);
      
      if (response.success && response.data) {
        setSuccess(response.data.message || 'Weight logged successfully!');
        setLastLoggedEntry(response.data.entry);
        setShowForm(false);
        // Reset form to current date/time for next entry
        setFormData(prev => ({
          ...prev,
          measurementDate: new Date().toISOString().split('T')[0],
          measurementTime: new Date().toTimeString().slice(0, 5)
        }));
      } else {
        setError(response.message || 'Failed to log weight');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error logging weight:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      weight: '',
      weightUnit: 'kg',
      measurementDate: new Date().toISOString().split('T')[0],
      measurementTime: new Date().toTimeString().slice(0, 5),
      measurementCondition: '',
      notes: '',
      mood: '',
      sleepHours: '',
      stressLevel: 'low'
    });
    setErrors({});
    setError(null);
    setSuccess(null);
  };

  const generateRandomData = () => {
    const randomWeight = (Math.random() * 30 + 60).toFixed(1); // 60-90 kg
    const randomSleep = (Math.random() * 4 + 6).toFixed(1); // 6-10 hours
    const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
    const randomStress = stressLevels[Math.floor(Math.random() * stressLevels.length)];
    const randomCondition = measurementConditions[Math.floor(Math.random() * measurementConditions.length)];

    setFormData(prev => ({
      ...prev,
      weight: randomWeight,
      sleepHours: randomSleep,
      mood: randomMood,
      stressLevel: randomStress as 'low' | 'medium' | 'high',
      measurementCondition: randomCondition,
      notes: `Random test data - ${new Date().toLocaleTimeString()}`
    }));
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight Log API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ⚖️ Weight Log API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing POST /api/body-metrics/weight/log endpoint with comprehensive form validation and data submission
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setShowForm(!showForm)}
            startIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showForm ? 'Hide Form' : 'Show Weight Log Form'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={generateRandomData}
            startIcon={<CasinoIcon />}
            disabled={!showForm}
          >
            Generate Random Data
          </Button>
          {showForm && (
            <Button 
              variant="outlined" 
              onClick={handleClearForm}
              startIcon={<ClearIcon />}
              color="warning"
            >
              Clear Form
            </Button>
          )}
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Weight Log Form */}
        <Collapse in={showForm}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Weight and Unit */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weight *"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    error={!!errors.weight}
                    helperText={errors.weight || 'Enter your weight'}
                    fullWidth
                    required
                    inputProps={{ step: 0.1, min: 0.1, max: 1000 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.weightUnit}>
                    <InputLabel>Weight Unit *</InputLabel>
                    <Select
                      value={formData.weightUnit}
                      onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                      label="Weight Unit *"
                    >
                      <MenuItem value="kg">Kilograms (kg)</MenuItem>
                      <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date and Time */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Measurement Date *"
                    type="date"
                    value={formData.measurementDate}
                    onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                    error={!!errors.measurementDate}
                    helperText={errors.measurementDate || 'Date of measurement'}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Measurement Time"
                    type="time"
                    value={formData.measurementTime}
                    onChange={(e) => handleInputChange('measurementTime', e.target.value)}
                    error={!!errors.measurementTime}
                    helperText={errors.measurementTime || 'Time of measurement (optional)'}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Condition and Mood */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Measurement Condition</InputLabel>
                    <Select
                      value={formData.measurementCondition}
                      onChange={(e) => handleInputChange('measurementCondition', e.target.value)}
                      label="Measurement Condition"
                    >
                      <MenuItem value="">None</MenuItem>
                      {measurementConditions.map(condition => (
                        <MenuItem key={condition} value={condition}>
                          {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mood</InputLabel>
                    <Select
                      value={formData.mood}
                      onChange={(e) => handleInputChange('mood', e.target.value)}
                      label="Mood"
                    >
                      <MenuItem value="">None</MenuItem>
                      {moodOptions.map(mood => (
                        <MenuItem key={mood} value={mood}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Sleep Hours and Stress Level */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Sleep Hours (Previous Night)"
                    type="number"
                    value={formData.sleepHours}
                    onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                    error={!!errors.sleepHours}
                    helperText={errors.sleepHours || 'Hours of sleep (0-24)'}
                    fullWidth
                    inputProps={{ step: 0.5, min: 0, max: 24 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" gutterBottom>
                      Stress Level *
                    </Typography>
                    <RadioGroup
                      row
                      value={formData.stressLevel}
                      onChange={(e) => handleInputChange('stressLevel', e.target.value)}
                    >
                      {stressLevels.map(level => (
                        <FormControlLabel
                          key={level}
                          value={level}
                          control={<Radio />}
                          label={level.charAt(0).toUpperCase() + level.slice(1)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Notes */}
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    fullWidth
                    placeholder="Additional notes about your weight measurement..."
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? 'Logging Weight...' : 'Log Weight Entry'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Collapse>

        {/* Last Logged Entry Display */}
        {lastLoggedEntry && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Last Logged Weight Entry
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Weight
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {lastLoggedEntry.weight} {lastLoggedEntry.weightUnit}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Date & Time
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(lastLoggedEntry.measurementDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(lastLoggedEntry.measurementTime)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Condition
                  </Typography>
                  <Typography variant="body1">
                    {lastLoggedEntry.measurementCondition || 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    BMI
                  </Typography>
                  <Typography variant="body1">
                    {lastLoggedEntry.bmi || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              {(lastLoggedEntry.mood || lastLoggedEntry.sleepHours || lastLoggedEntry.stressLevel) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {lastLoggedEntry.mood && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Mood
                        </Typography>
                        <Chip 
                          label={lastLoggedEntry.mood} 
                          color="primary" 
                          variant="outlined"
                        />
                      </Grid>
                    )}
                    
                    {lastLoggedEntry.sleepHours && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Sleep Hours
                        </Typography>
                        <Typography variant="body1">
                          {lastLoggedEntry.sleepHours}h
                        </Typography>
                      </Grid>
                    )}
                    
                    {lastLoggedEntry.stressLevel && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Stress Level
                        </Typography>
                        <Chip 
                          label={lastLoggedEntry.stressLevel} 
                          color={
                            lastLoggedEntry.stressLevel === 'low' ? 'success' : 
                            lastLoggedEntry.stressLevel === 'medium' ? 'warning' : 'error'
                          }
                          variant="outlined"
                        />
                      </Grid>
                    )}
                  </Grid>
                </>
              )}

              {lastLoggedEntry.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {lastLoggedEntry.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> POST /api/body-metrics/weight/log<br />
            <strong>Status:</strong> {loading ? 'Submitting...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Form Visible:</strong> {showForm ? 'Yes' : 'No'}<br />
            <strong>Last Entry:</strong> {lastLoggedEntry ? `ID ${lastLoggedEntry.id}` : 'None'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightLogTest;
