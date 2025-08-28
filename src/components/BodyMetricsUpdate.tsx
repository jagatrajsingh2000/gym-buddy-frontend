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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  Collapse,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Clear,
  ExpandMore,
  ExpandLess,
  Straighten,
  CalendarToday,
  Notes,
  History,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements, UpdateBodyMetricsRequest } from '../services';

interface BodyMetricsUpdateProps {
  measurement: BodyMeasurements;
  onSuccess?: (data: any) => void;
  onRefresh?: () => void;
  onCancel?: () => void;
}

const BodyMetricsUpdate: React.FC<BodyMetricsUpdateProps> = ({ 
  measurement, 
  onSuccess, 
  onRefresh, 
  onCancel 
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Form state - start with current values
  const [formData, setFormData] = useState<UpdateBodyMetricsRequest>({});
  
  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  
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

  // Initialize form data when measurement changes
  useEffect(() => {
    if (measurement) {
        const initialData: UpdateBodyMetricsRequest = {};
        measurementFields.forEach(field => {
          const value = measurement[field.key as keyof BodyMeasurements];
          if (value !== undefined && value !== null) {
            (initialData as any)[field.key] = parseFloat(value as string);
          }
        });
        
        if (measurement.measurementDate) {
          initialData.measurementDate = measurement.measurementDate;
        }
        
        if (measurement.notes) {
          initialData.notes = measurement.notes;
        }
        
        setFormData(initialData);
        setModifiedFields(new Set());
        setTouched(new Set());
        setValidationErrors([]);
        setSuccess(null);
        setError(null);
    }
  }, [measurement]);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData };
    const originalValue = measurement[field as keyof BodyMeasurements];
    const newModifiedFields = new Set(modifiedFields);
    
    if (field === 'measurementDate' || field === 'notes') {
      newFormData[field] = value;
    } else {
      // Handle measurement fields
      const parsedValue = bodyMetricsUtils.parseMeasurementValue(value);
      if (parsedValue !== undefined) {
        (newFormData as any)[field] = parsedValue;
      } else {
        delete (newFormData as any)[field];
      }
      
      // Track modifications for measurement fields
      const originalNum = originalValue ? parseFloat(originalValue as string) : undefined;
      if (parsedValue !== originalNum) {
        newModifiedFields.add(field);
      } else {
        newModifiedFields.delete(field);
      }
    }
    
    setFormData(newFormData);
    
    // Track modifications for non-measurement fields
    if (field === 'measurementDate' || field === 'notes') {
      if (value !== (originalValue || '')) {
        newModifiedFields.add(field);
      } else {
        newModifiedFields.delete(field);
      }
    }
    setModifiedFields(newModifiedFields);
    
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
    const validation = bodyMetricsUtils.validateBodyMetricsUpdate(formData);
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

    // Check if any fields were modified
    if (modifiedFields.size === 0) {
      setError('No changes detected. Please modify at least one field before updating.');
      return;
    }

    setShowConfirmDialog(true);
  };

  // Confirm and submit update
  const confirmUpdate = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.updateBodyMetrics(token!, measurement.id, formData);
      
      if (response.success && response.data) {
        setSuccess('Body metrics updated successfully!');
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Refresh data if callback provided
        if (onRefresh) {
          onRefresh();
        }
        
        // Reset modification tracking
        setModifiedFields(new Set());
      } else {
        setError(response.message || 'Failed to update body metrics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to original values
  const handleReset = () => {
          const initialData: UpdateBodyMetricsRequest = {};
      measurementFields.forEach(field => {
        const value = measurement[field.key as keyof BodyMeasurements];
        if (value !== undefined && value !== null) {
          (initialData as any)[field.key] = parseFloat(value as string);
        }
      });
    
    if (measurement.measurementDate) {
      initialData.measurementDate = measurement.measurementDate;
    }
    
    if (measurement.notes) {
      initialData.notes = measurement.notes;
    }
    
    setFormData(initialData);
    setModifiedFields(new Set());
    setTouched(new Set());
    setValidationErrors([]);
    setSuccess(null);
    setError(null);
  };

  // Get field error
  const getFieldError = (field: string): string | null => {
    if (!touched.has(field)) return null;
    
    const error = validationErrors.find(err => 
      err.toLowerCase().includes(field.toLowerCase())
    );
    
    return error || null;
  };

  // Get field value for display
  const getFieldValue = (field: string): string => {
    if (field === 'measurementDate' || field === 'notes') {
      return formData[field] || '';
    }
    
    const value = formData[field as keyof UpdateBodyMetricsRequest];
    if (value !== undefined) {
      return value.toString();
    }
    
    // Fallback to original measurement value
    const originalValue = measurement[field as keyof BodyMeasurements];
    return originalValue ? (originalValue as string) : '';
  };

  // Check if field is modified
  const isFieldModified = (field: string): boolean => {
    return modifiedFields.has(field);
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to update body metrics
      </Alert>
    );
  }

  if (!measurement) {
    return (
      <Alert severity="error">
        No measurement data provided for update
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Edit color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ✏️ Update Body Metrics
            </Typography>
            <Chip 
              label={`ID: ${measurement.id}`} 
              size="small" 
              variant="outlined" 
              color="primary" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`${modifiedFields.size} field(s) modified`}
              size="small"
              color={modifiedFields.size > 0 ? "warning" : "default"}
              icon={modifiedFields.size > 0 ? <Warning /> : <CheckCircle />}
            />
            
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        {/* Original Measurement Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            📊 Original Measurement (ID: {measurement.id})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)} | 
            Notes: {measurement.notes || 'No notes'}
          </Typography>
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
                    value={getFieldValue(field.key)}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    error={!!getFieldError(field.key)}
                    helperText={getFieldError(field.key) || (isFieldModified(field.key) ? 'Modified' : 'Original value')}
                    size="small"
                    type="number"
                    inputProps={{
                      step: 0.1,
                      min: 0
                    }}
                    InputProps={{
                      endAdornment: isFieldModified(field.key) && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          sx={{ height: 20 }}
                        />
                      )
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
                  value={getFieldValue('measurementDate')}
                  onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: isFieldModified('measurementDate') && (
                      <Chip 
                        label="Modified" 
                        size="small" 
                        color="warning" 
                        sx={{ height: 20 }}
                      />
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notes"
                  placeholder="Update your notes..."
                  value={getFieldValue('notes')}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  size="small"
                  multiline
                  rows={1}
                  InputProps={{
                    startAdornment: <Notes sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: isFieldModified('notes') && (
                      <Chip 
                        label="Modified" 
                        size="small" 
                        color="warning" 
                        sx={{ height: 20 }}
                      />
                    )
                  }}
                />
              </Grid>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                startIcon={<Cancel />}
              >
                Cancel
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={loading}
                startIcon={<Clear />}
              >
                Reset
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                disabled={loading || modifiedFields.size === 0}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                color="warning"
              >
                {loading ? 'Updating...' : 'Update Metrics'}
              </Button>
            </Box>

            {/* Help Text */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Tip:</strong> Only modified fields will be updated. Fields with no changes will remain unchanged.
                You can reset the form to restore original values at any time.
              </Typography>
            </Box>
          </form>
        </Collapse>

        {/* Modification Summary */}
        {modifiedFields.size > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
              🔄 Fields to be Updated:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Array.from(modifiedFields).map((field) => (
                <Chip 
                  key={field} 
                  label={field} 
                  size="small" 
                  color="warning" 
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>
          Confirm Update
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to update this measurement? The following fields will be modified:
          </Typography>
          <Box sx={{ mt: 2 }}>
            {Array.from(modifiedFields).map((field) => (
              <Chip 
                key={field} 
                label={field} 
                size="small" 
                color="warning" 
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Cancel
          </Button>
          <Button onClick={confirmUpdate} variant="contained" color="warning">
            Confirm Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📝 Update Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>PUT /api/body-metrics/{measurement.id}</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Content-Type:</strong> application/json
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Validation:</strong> At least one field required, all values must be positive
        </Typography>
        <Typography variant="body2">
          <strong>Response:</strong> JSON with updated metrics object and success message
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsUpdate;
