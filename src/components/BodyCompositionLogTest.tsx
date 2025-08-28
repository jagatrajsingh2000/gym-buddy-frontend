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
  FormHelperText
} from '@mui/material';
import { 
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService, CreateBodyCompositionRequest } from '../services/bodyMetricsService';

const BodyCompositionLogTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [lastLoggedComposition, setLastLoggedComposition] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<CreateBodyCompositionRequest>({
    bodyFatPercentage: undefined,
    muscleMass: undefined,
    boneMass: undefined,
    waterPercentage: undefined,
    measurementDate: '',
    notes: ''
  });

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Check if at least one measurement field is provided
    const hasMeasurement = formData.bodyFatPercentage !== undefined || 
                          formData.muscleMass !== undefined || 
                          formData.boneMass !== undefined || 
                          formData.waterPercentage !== undefined;
    
    if (!hasMeasurement) {
      newErrors.general = 'At least one body composition measurement is required';
    }

    // Validate body fat percentage (0-100%)
    if (formData.bodyFatPercentage !== undefined) {
      if (formData.bodyFatPercentage < 0 || formData.bodyFatPercentage > 100) {
        newErrors.bodyFatPercentage = 'Body fat percentage must be between 0 and 100';
      }
    }

    // Validate muscle mass (positive number)
    if (formData.muscleMass !== undefined) {
      if (formData.muscleMass <= 0) {
        newErrors.muscleMass = 'Muscle mass must be a positive number';
      }
    }

    // Validate bone mass (positive number)
    if (formData.boneMass !== undefined) {
      if (formData.boneMass <= 0) {
        newErrors.boneMass = 'Bone mass must be a positive number';
      }
    }

    // Validate water percentage (0-100%)
    if (formData.waterPercentage !== undefined) {
      if (formData.waterPercentage < 0 || formData.waterPercentage > 100) {
        newErrors.waterPercentage = 'Water percentage must be between 0 and 100';
      }
    }

    // Validate date if provided
    if (formData.measurementDate) {
      const date = new Date(formData.measurementDate);
      if (isNaN(date.getTime())) {
        newErrors.measurementDate = 'Invalid measurement date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateBodyCompositionRequest, value: any) => {
    let parsedValue = value;

    // Parse numeric fields
    if (['bodyFatPercentage', 'muscleMass', 'boneMass', 'waterPercentage'].includes(field)) {
      if (value === '') {
        parsedValue = undefined;
      } else {
        parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
          parsedValue = undefined;
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));
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
      // Prepare data for submission
      const submitData: CreateBodyCompositionRequest = {};
      
      if (formData.bodyFatPercentage !== undefined) submitData.bodyFatPercentage = formData.bodyFatPercentage;
      if (formData.muscleMass !== undefined) submitData.muscleMass = formData.muscleMass;
      if (formData.boneMass !== undefined) submitData.boneMass = formData.boneMass;
      if (formData.waterPercentage !== undefined) submitData.waterPercentage = formData.waterPercentage;
      if (formData.measurementDate) submitData.measurementDate = formData.measurementDate;
      if (formData.notes) submitData.notes = formData.notes;

      const response = await bodyCompositionService.logComposition(token!, submitData);
      
      if (response.success && response.data) {
        setSuccess(response.data.message || 'Body composition logged successfully!');
        setLastLoggedComposition(response.data.composition);
        handleClearForm();
        setShowForm(false);
      } else {
        setError(response.message || 'Failed to log body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error logging body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      bodyFatPercentage: undefined,
      muscleMass: undefined,
      boneMass: undefined,
      waterPercentage: undefined,
      measurementDate: '',
      notes: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleRandomData = () => {
    const randomData: CreateBodyCompositionRequest = {
      bodyFatPercentage: Math.round((Math.random() * 20 + 10) * 100) / 100, // 10-30%
      muscleMass: Math.round((Math.random() * 20 + 60) * 100) / 100, // 60-80 kg
      boneMass: Math.round((Math.random() * 2 + 3) * 100) / 100, // 3-5 kg
      waterPercentage: Math.round((Math.random() * 20 + 55) * 100) / 100, // 55-75%
      measurementDate: new Date().toISOString().split('T')[0],
      notes: 'Random test data'
    };
    
    setFormData(randomData);
    setErrors({});
    setTouched({});
  };

  const getFieldError = (field: string): string => {
    return touched[field] ? errors[field] || '' : '';
  };

  const hasError = (field: string): boolean => {
    return touched[field] && !!errors[field];
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition Log API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ➕ Body Composition Log API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing POST /api/body-metrics/composition/log endpoint with form validation
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setShowForm(!showForm)}
            startIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showForm ? 'Hide Form' : 'Show Form'}
          </Button>
          {showForm && (
            <>
              <Button 
                variant="outlined" 
                onClick={handleRandomData}
                startIcon={<AddIcon />}
              >
                Random Data
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleClearForm}
                startIcon={<ClearIcon />}
                color="error"
              >
                Clear Form
              </Button>
            </>
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

        {/* Logging Form */}
        <Collapse in={showForm}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Log New Body Composition
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* Body Fat Percentage */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Body Fat %"
                    type="number"
                    value={formData.bodyFatPercentage || ''}
                    onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                    fullWidth
                    size="small"
                    error={hasError('bodyFatPercentage')}
                    helperText={getFieldError('bodyFatPercentage')}
                    inputProps={{ 
                      step: 0.1, 
                      min: 0, 
                      max: 100 
                    }}
                  />
                </Grid>

                {/* Muscle Mass */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Muscle Mass (kg)"
                    type="number"
                    value={formData.muscleMass || ''}
                    onChange={(e) => handleInputChange('muscleMass', e.target.value)}
                    fullWidth
                    size="small"
                    error={hasError('muscleMass')}
                    helperText={getFieldError('muscleMass')}
                    inputProps={{ 
                      step: 0.1, 
                      min: 0 
                    }}
                  />
                </Grid>

                {/* Bone Mass */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Bone Mass (kg)"
                    type="number"
                    value={formData.boneMass || ''}
                    onChange={(e) => handleInputChange('boneMass', e.target.value)}
                    fullWidth
                    size="small"
                    error={hasError('boneMass')}
                    helperText={getFieldError('boneMass')}
                    inputProps={{ 
                      step: 0.1, 
                      min: 0 
                    }}
                  />
                </Grid>

                {/* Water Percentage */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Water %"
                    type="number"
                    value={formData.waterPercentage || ''}
                    onChange={(e) => handleInputChange('waterPercentage', e.target.value)}
                    fullWidth
                    size="small"
                    error={hasError('waterPercentage')}
                    helperText={getFieldError('waterPercentage')}
                    inputProps={{ 
                      step: 0.1, 
                      min: 0, 
                      max: 100 
                    }}
                  />
                </Grid>

                {/* Measurement Date */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Measurement Date"
                    type="date"
                    value={formData.measurementDate}
                    onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                    fullWidth
                    size="small"
                    error={hasError('measurementDate')}
                    helperText={getFieldError('measurementDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Notes */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="Optional notes..."
                  />
                </Grid>

                {/* General Error */}
                {errors.general && (
                  <Grid item xs={12}>
                    <FormHelperText error>
                      {errors.general}
                    </FormHelperText>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                    fullWidth
                  >
                    {loading ? 'Logging...' : 'Log Body Composition'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Collapse>

        {/* Last Logged Composition */}
        {lastLoggedComposition && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Last Logged Composition
            </Typography>
            
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat: <strong>{lastLoggedComposition.bodyFatPercentage ? `${lastLoggedComposition.bodyFatPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Muscle Mass: <strong>{lastLoggedComposition.muscleMass ? `${lastLoggedComposition.muscleMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Bone Mass: <strong>{lastLoggedComposition.boneMass ? `${lastLoggedComposition.boneMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Water %: <strong>{lastLoggedComposition.waterPercentage ? `${lastLoggedComposition.waterPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date: <strong>{lastLoggedComposition.measurementDate}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Notes: <strong>{lastLoggedComposition.notes || 'No notes'}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Box>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> POST /api/body-metrics/composition/log<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Last Logged:</strong> {lastLoggedComposition ? `ID ${lastLoggedComposition.id}` : 'None'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionLogTest;
