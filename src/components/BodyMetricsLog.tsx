import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Add,
  Save,
  Clear,
  ExpandMore,
  ExpandLess,
  Straighten,
  CalendarToday,
  Notes,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, LogBodyMetricsRequest } from '../services';

interface BodyMetricsLogProps {
  onSuccess?: (data: any) => void;
  onRefresh?: () => void;
}

const BodyMetricsLog: React.FC<BodyMetricsLogProps> = ({ onSuccess, onRefresh }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<LogBodyMetricsRequest>({
    measurementDate: bodyMetricsUtils.getTodayDate(),
    notes: ''
  });
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  // Measurement fields configuration
  const measurementFields = [
    { key: 'chest', label: 'Chest', placeholder: '95.5' },
    { key: 'waist', label: 'Waist', placeholder: '78.2' },
    { key: 'hips', label: 'Hips', placeholder: '98.0' },
    { key: 'biceps', label: 'Biceps', placeholder: '32.5' },
    { key: 'forearms', label: 'Forearms', placeholder: '28.0' },
    { key: 'thighs', label: 'Thighs', placeholder: '58.0' },
    { key: 'calves', label: 'Calves', placeholder: '38.5' },
    { key: 'neck', label: 'Neck', placeholder: '38.0' }
  ];

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData };
    
    if (field === 'measurementDate' || field === 'notes') {
      newFormData[field] = value;
    } else {
      // Handle measurement fields
      const parsedValue = bodyMetricsUtils.parseMeasurementValue(value);
      if (parsedValue !== undefined) {
        (newFormData as any)[field] = parsedValue;
      } else {
        // Remove the field if value is empty
        delete (newFormData as any)[field];
      }
    }
    
    setFormData(newFormData);
    
    // Mark field as touched
    const newTouched = new Set(touched);
    newTouched.add(field);
    setTouched(newTouched);
    
    // Clear success/error messages when user starts typing
    if (success || error) {
      setSuccess(null);
      setError(null);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const validation = bodyMetricsUtils.validateBodyMetrics(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Authentication required');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.logBodyMetrics(token, formData);
      
      if (response.success && response.data) {
        setSuccess('Body metrics logged successfully!');
        
        // Reset form
        setFormData({
          measurementDate: bodyMetricsUtils.getTodayDate(),
          notes: ''
        });
        setTouched(new Set());
        setValidationErrors([]);
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Refresh data if callback provided
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setError(response.message || 'Failed to log body metrics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setFormData({
      measurementDate: bodyMetricsUtils.getTodayDate(),
      notes: ''
    });
    setTouched(new Set());
    setValidationErrors([]);
    setSuccess(null);
    setError(null);
  };

  // Check if form has any measurements
  const hasMeasurements = measurementFields.some(
    field => formData[field.key as keyof LogBodyMetricsRequest] !== undefined
  );

  // Get field error
  const getFieldError = (field: string): string | null => {
    if (!touched.has(field)) return null;
    
    const error = validationErrors.find(err => 
      err.toLowerCase().includes(field.toLowerCase())
    );
    
    return error || null;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to log body metrics
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Straighten color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📏 Log New Body Metrics
            </Typography>
          </Box>
          
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Collapsible Form */}
        <Collapse in={expanded}>
          <Divider sx={{ mb: 3 }} />
          
          <form onSubmit={handleSubmit}>
            {/* Status Messages */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {validationErrors.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Please fix the following errors:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Measurement Fields */}
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Straighten />
              Body Measurements (cm)
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {measurementFields.map((field) => (
                <Grid item xs={12} sm={6} md={4} key={field.key}>
                  <TextField
                    fullWidth
                    label={field.label}
                    placeholder={field.placeholder}
                    value={bodyMetricsUtils.formatMeasurementValue(formData[field.key as keyof LogBodyMetricsRequest] as number)}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    error={!!getFieldError(field.key)}
                    helperText={getFieldError(field.key) || 'Optional'}
                    size="small"
                    type="number"
                    inputProps={{
                      step: 0.1,
                      min: 0
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Date and Notes */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Measurement Date"
                  type="date"
                  value={formData.measurementDate || ''}
                  onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  placeholder="How are you feeling? Any observations?"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  size="small"
                  multiline
                  rows={1}
                  InputProps={{
                    startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading}
                startIcon={<Clear />}
              >
                Clear
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !hasMeasurements}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? 'Logging...' : 'Log Metrics'}
              </Button>
            </Box>

            {/* Help Text */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Tip:</strong> You only need to fill in the measurements you want to record. 
                All fields are optional, but at least one measurement is required.
              </Typography>
            </Box>
          </form>
        </Collapse>

        {/* Quick Stats */}
        {hasMeasurements && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
              ✅ Ready to log {measurementFields.filter(field => 
                formData[field.key as keyof LogBodyMetricsRequest] !== undefined
              ).length} measurement(s)
            </Typography>
          </Box>
        )}
      </Card>

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📝 Log Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>POST /api/body-metrics/</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Content-Type:</strong> application/json
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Validation:</strong> At least one measurement required, all values must be positive
        </Typography>
        <Typography variant="body2">
          <strong>Response:</strong> JSON with created metrics object and success message
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsLog;
