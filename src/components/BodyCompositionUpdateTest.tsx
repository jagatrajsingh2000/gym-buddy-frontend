import React, { useState, useEffect } from 'react';
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
  FormHelperText,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService, UpdateBodyCompositionRequest, BodyComposition } from '../services/bodyMetricsService';

const BodyCompositionUpdateTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [lastUpdatedComposition, setLastUpdatedComposition] = useState<BodyComposition | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateBodyCompositionRequest>({
    bodyFatPercentage: undefined,
    muscleMass: undefined,
    boneMass: undefined,
    waterPercentage: undefined,
    notes: ''
  });

  // Composition selection and data
  const [selectedCompositionId, setSelectedCompositionId] = useState<number | ''>('');
  const [availableCompositions, setAvailableCompositions] = useState<BodyComposition[]>([]);
  const [selectedComposition, setSelectedComposition] = useState<BodyComposition | null>(null);
  const [originalData, setOriginalData] = useState<UpdateBodyCompositionRequest>({});

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Load available compositions for selection
  useEffect(() => {
    if (token) {
      loadAvailableCompositions();
    }
  }, [token]);

  const loadAvailableCompositions = async () => {
    try {
      const response = await bodyCompositionService.getCompositionHistory(token!, { limit: 50 });
      if (response.success && response.data) {
        setAvailableCompositions(response.data.compositions || []);
      }
    } catch (err) {
      console.error('Error loading compositions:', err);
    }
  };

  const handleCompositionSelect = (compositionId: number) => {
    setSelectedCompositionId(compositionId);
    const composition = availableCompositions.find(c => c.id === compositionId);
    if (composition) {
      setSelectedComposition(composition);
      
      // Pre-populate form with current values
      const formData: UpdateBodyCompositionRequest = {};
      if (composition.bodyFatPercentage) formData.bodyFatPercentage = parseFloat(composition.bodyFatPercentage);
      if (composition.muscleMass) formData.muscleMass = parseFloat(composition.muscleMass);
      if (composition.boneMass) formData.boneMass = parseFloat(composition.boneMass);
      if (composition.waterPercentage) formData.waterPercentage = parseFloat(composition.waterPercentage);
      if (composition.notes) formData.notes = composition.notes;
      
      setFormData(formData);
      setOriginalData(formData);
      setErrors({});
      setTouched({});
      setShowForm(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Check if at least one field is provided for update
    const hasChanges = Object.keys(formData).some(key => {
      const field = key as keyof UpdateBodyCompositionRequest;
      return formData[field] !== originalData[field];
    });
    
    if (!hasChanges) {
      newErrors.general = 'No changes detected. Please modify at least one field.';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UpdateBodyCompositionRequest, value: any) => {
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

    if (!selectedCompositionId || typeof selectedCompositionId !== 'number') {
      setError('Please select a composition to update');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for submission - only include changed fields
      const submitData: UpdateBodyCompositionRequest = {};
      
      Object.keys(formData).forEach(key => {
        const field = key as keyof UpdateBodyCompositionRequest;
        if (formData[field] !== originalData[field]) {
          (submitData as any)[field] = formData[field];
        }
      });

      const response = await bodyCompositionService.updateComposition(token!, selectedCompositionId, submitData);
      
      if (response.success && response.data) {
        setSuccess(response.data.message || 'Body composition updated successfully!');
        setLastUpdatedComposition(response.data.composition);
        
        // Refresh the compositions list
        await loadAvailableCompositions();
        
        // Update the selected composition
        setSelectedComposition(response.data.composition);
        
        // Reset form
        handleReset();
        setShowForm(false);
      } else {
        setError(response.message || 'Failed to update body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (selectedComposition) {
      // Reset to original values
      const formData: UpdateBodyCompositionRequest = {};
      if (selectedComposition.bodyFatPercentage) formData.bodyFatPercentage = parseFloat(selectedComposition.bodyFatPercentage);
      if (selectedComposition.muscleMass) formData.muscleMass = parseFloat(selectedComposition.muscleMass);
      if (selectedComposition.boneMass) formData.boneMass = parseFloat(selectedComposition.boneMass);
      if (selectedComposition.waterPercentage) formData.waterPercentage = parseFloat(selectedComposition.waterPercentage);
      if (selectedComposition.notes) formData.notes = selectedComposition.notes;
      
      setFormData(formData);
      setOriginalData(formData);
    }
    setErrors({});
    setTouched({});
  };

  const handleClearSelection = () => {
    setSelectedCompositionId('');
    setSelectedComposition(null);
    setFormData({});
    setOriginalData({});
    setErrors({});
    setTouched({});
    setShowForm(false);
    setLastUpdatedComposition(null);
  };

  const getFieldError = (field: string): string => {
    return touched[field] ? errors[field] || '' : '';
  };

  const hasError = (field: string): boolean => {
    return touched[field] && !!errors[field];
  };

  const hasChanges = (): boolean => {
    return Object.keys(formData).some(key => {
      const field = key as keyof UpdateBodyCompositionRequest;
      return formData[field] !== originalData[field];
    });
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition Update API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ✏️ Body Composition Update API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing PUT /api/body-metrics/composition/:id endpoint with form pre-population and field updates
        </Typography>

        {/* Composition Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Composition to Update:
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Composition ID</InputLabel>
                <Select
                  value={selectedCompositionId}
                  onChange={(e) => handleCompositionSelect(e.target.value as number)}
                  label="Composition ID"
                >
                  {availableCompositions.map((comp) => (
                    <MenuItem key={comp.id} value={comp.id}>
                      ID {comp.id} - {comp.measurementDate}
                      {comp.bodyFatPercentage && ` (${comp.bodyFatPercentage}% fat)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button 
                variant="outlined" 
                onClick={loadAvailableCompositions}
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh List
              </Button>
            </Grid>
            
            {selectedCompositionId && (
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  onClick={handleClearSelection}
                  startIcon={<ClearIcon />}
                  color="error"
                  size="small"
                >
                  Clear Selection
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Selected Composition Display */}
        {selectedComposition && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Composition Data:
            </Typography>
            
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat: <strong>{selectedComposition.bodyFatPercentage ? `${selectedComposition.bodyFatPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Muscle Mass: <strong>{selectedComposition.muscleMass ? `${selectedComposition.muscleMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Bone Mass: <strong>{selectedComposition.boneMass ? `${selectedComposition.boneMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Water %: <strong>{selectedComposition.waterPercentage ? `${selectedComposition.waterPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date: <strong>{selectedComposition.measurementDate}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Notes: <strong>{selectedComposition.notes || 'No notes'}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Box>
        )}

        {/* Action Buttons */}
        {selectedCompositionId && (
          <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => setShowForm(!showForm)}
              startIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showForm ? 'Hide Update Form' : 'Show Update Form'}
            </Button>
            {showForm && (
              <>
                <Button 
                  variant="outlined" 
                  onClick={handleReset}
                  startIcon={<ClearIcon />}
                  color="warning"
                >
                  Reset to Original
                </Button>
              </>
            )}
          </Box>
        )}

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

        {/* Update Form */}
        <Collapse in={showForm && !!selectedCompositionId}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Update Body Composition (ID: {selectedCompositionId})
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

                {/* Notes */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Notes"
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="Update notes..."
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

                {/* Changes Indicator */}
                {hasChanges() && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body2" color="success.main">
                        Changes detected - ready to update
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button 
                    type="submit"
                    variant="contained" 
                    disabled={loading || !hasChanges()}
                    startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
                    fullWidth
                  >
                    {loading ? 'Updating...' : 'Update Body Composition'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Collapse>

        {/* Last Updated Composition */}
        {lastUpdatedComposition && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Last Updated Composition
            </Typography>
            
            <Card variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat: <strong>{lastUpdatedComposition.bodyFatPercentage ? `${lastUpdatedComposition.bodyFatPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Muscle Mass: <strong>{lastUpdatedComposition.muscleMass ? `${lastUpdatedComposition.muscleMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Bone Mass: <strong>{lastUpdatedComposition.boneMass ? `${lastUpdatedComposition.boneMass} kg` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Water %: <strong>{lastUpdatedComposition.waterPercentage ? `${lastUpdatedComposition.waterPercentage}%` : 'N/A'}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date: <strong>{lastUpdatedComposition.measurementDate}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Notes: <strong>{lastUpdatedComposition.notes || 'No notes'}</strong>
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
            <strong>Endpoint:</strong> PUT /api/body-metrics/composition/:id<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Selected ID:</strong> {selectedCompositionId || 'None'}<br />
            <strong>Last Updated:</strong> {lastUpdatedComposition ? `ID ${lastUpdatedComposition.id}` : 'None'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionUpdateTest;
