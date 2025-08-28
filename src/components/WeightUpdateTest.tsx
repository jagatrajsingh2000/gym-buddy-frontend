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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService } from '../services/bodyMetricsService';

interface WeightEntry {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
  measurementDate: string;
  measurementTime: string | null;
  measurementCondition: string | null;
  notes: string | null;
  mood: string | null;
  sleepHours: number | null;
  stressLevel: string | null;
  bmi?: string;
  created_at: string;
  updated_at: string;
}

interface WeightUpdateForm {
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

const WeightUpdateTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [availableEntries, setAvailableEntries] = useState<WeightEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WeightEntry | null>(null);
  const [updatedEntry, setUpdatedEntry] = useState<WeightEntry | null>(null);

  // Form state
  const [formData, setFormData] = useState<WeightUpdateForm>({
    weight: '',
    weightUnit: 'kg',
    measurementDate: '',
    measurementTime: '',
    measurementCondition: '',
    notes: '',
    mood: '',
    sleepHours: '',
    stressLevel: 'low'
  });

  // Track modified fields
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  const [originalData, setOriginalData] = useState<WeightUpdateForm | null>(null);

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

  // Load available weight entries on component mount
  useEffect(() => {
    if (token) {
      loadAvailableEntries();
    }
  }, [token]);

  const loadAvailableEntries = async () => {
    try {
      const response = await bodyMetricsService.getWeightHistory(token!, { limit: 50 });
      if (response.success && response.data) {
        setAvailableEntries(response.data.weightHistory || []);
      }
    } catch (err) {
      console.error('Error loading weight entries:', err);
    }
  };

  const handleEntrySelection = (entry: WeightEntry) => {
    setSelectedEntry(entry);
    setOriginalData({
      weight: entry.weight,
      weightUnit: entry.weightUnit as 'kg' | 'lbs',
      measurementDate: entry.measurementDate,
      measurementTime: entry.measurementTime || '',
      measurementCondition: entry.measurementCondition || '',
      notes: entry.notes || '',
      mood: entry.mood || '',
      sleepHours: entry.sleepHours ? entry.sleepHours.toString() : '',
      stressLevel: entry.stressLevel as 'low' | 'medium' | 'high'
    });
    setFormData({
      weight: entry.weight,
      weightUnit: entry.weightUnit as 'kg' | 'lbs',
      measurementDate: entry.measurementDate,
      measurementTime: entry.measurementTime || '',
      measurementCondition: entry.measurementCondition || '',
      notes: entry.notes || '',
      mood: entry.mood || '',
      sleepHours: entry.sleepHours ? entry.sleepHours.toString() : '',
      stressLevel: entry.stressLevel as 'low' | 'medium' | 'high'
    });
    setModifiedFields(new Set());
    setErrors({});
    setError(null);
    setSuccess(null);
    setUpdatedEntry(null);
    setShowForm(true);
  };

  const handleInputChange = (field: keyof WeightUpdateForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Track modified fields
    if (originalData && originalData[field] !== value) {
      setModifiedFields(prev => new Set(prev).add(field));
    } else if (originalData && originalData[field] === value) {
      setModifiedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Only validate fields that have been modified
    modifiedFields.forEach(field => {
      switch (field) {
        case 'weight':
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
          break;

        case 'weightUnit':
          if (!formData.weightUnit) {
            newErrors.weightUnit = 'Weight unit is required';
          }
          break;

        case 'measurementDate':
          if (!formData.measurementDate) {
            newErrors.measurementDate = 'Date is required';
          } else {
            const date = new Date(formData.measurementDate);
            if (isNaN(date.getTime())) {
              newErrors.measurementDate = 'Invalid date format';
            }
          }
          break;

        case 'measurementTime':
          if (formData.measurementTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.measurementTime)) {
            newErrors.measurementTime = 'Invalid time format (HH:MM)';
          }
          break;

        case 'sleepHours':
          if (formData.sleepHours.trim()) {
            const sleepHours = parseFloat(formData.sleepHours);
            if (isNaN(sleepHours) || sleepHours < 0 || sleepHours > 24) {
              newErrors.sleepHours = 'Sleep hours must be between 0 and 24';
            }
          }
          break;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modifiedFields.size === 0) {
      setError('No changes detected. Please modify at least one field.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!selectedEntry) {
      setError('No entry selected for update');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Only include modified fields in the update
      const updateData: any = {};
      modifiedFields.forEach(field => {
        switch (field) {
          case 'weight':
            updateData.weight = parseFloat(formData.weight);
            break;
          case 'weightUnit':
            updateData.weightUnit = formData.weightUnit;
            break;
          case 'measurementDate':
            updateData.measurementDate = formData.measurementDate;
            break;
          case 'measurementTime':
            updateData.measurementTime = formData.measurementTime || undefined;
            break;
          case 'measurementCondition':
            updateData.measurementCondition = formData.measurementCondition || undefined;
            break;
          case 'notes':
            updateData.notes = formData.notes || undefined;
            break;
          case 'mood':
            updateData.mood = formData.mood || undefined;
            break;
          case 'sleepHours':
            updateData.sleepHours = formData.sleepHours ? parseFloat(formData.sleepHours) : undefined;
            break;
          case 'stressLevel':
            updateData.stressLevel = formData.stressLevel;
            break;
        }
      });

      const response = await bodyMetricsService.updateWeightEntry(token!, selectedEntry.id, updateData);
      
      if (response.success && response.data) {
        setSuccess('Weight entry updated successfully!');
        setUpdatedEntry(response.data);
        
        // Update the entry in the available entries list
        setAvailableEntries(prev => 
          prev.map(entry => 
            entry.id === selectedEntry.id ? response.data as WeightEntry : entry
          )
        );
        
        // Reset form and selection
        setShowForm(false);
        setSelectedEntry(null);
        setModifiedFields(new Set());
        setErrors({});
      } else {
        setError(response.message || 'Failed to update weight entry');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating weight:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (originalData) {
      setFormData(originalData);
      setModifiedFields(new Set());
      setErrors({});
      setError(null);
      setSuccess(null);
    }
  };

  const handleClearSelection = () => {
    setSelectedEntry(null);
    setFormData({
      weight: '',
      weightUnit: 'kg',
      measurementDate: '',
      measurementTime: '',
      measurementCondition: '',
      notes: '',
      mood: '',
      sleepHours: '',
      stressLevel: 'low'
    });
    setModifiedFields(new Set());
    setErrors({});
    setError(null);
    setSuccess(null);
    setUpdatedEntry(null);
    setShowForm(false);
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

  const formatWeight = (weight: string, unit: string): string => {
    if (!weight) return 'N/A';
    return `${weight} ${unit}`;
  };

  const isFieldModified = (field: string): boolean => {
    return modifiedFields.has(field);
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight Update API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ✏️ Weight Update API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing PUT /api/body-metrics/weight/:id endpoint with partial updates and modification tracking
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setShowForm(!showForm)}
            startIcon={showForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            disabled={!selectedEntry}
          >
            {showForm ? 'Hide Update Form' : 'Show Update Form'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={loadAvailableEntries}
            startIcon={<RefreshIcon />}
          >
            Refresh Entries
          </Button>
          {selectedEntry && (
            <Button 
              variant="outlined" 
              onClick={handleClearSelection}
              startIcon={<ClearIcon />}
              color="warning"
            >
              Clear Selection
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

        {/* Available Entries Table */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              📋 Available Weight Entries (Select one to update)
            </Typography>
            
            {availableEntries.length === 0 ? (
              <Alert severity="info">
                No weight entries found. Create some entries first using the Weight Log API.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Mood</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableEntries.map((entry) => (
                      <TableRow 
                        key={entry.id} 
                        hover
                        selected={selectedEntry?.id === entry.id}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleEntrySelection(entry)}
                      >
                        <TableCell>
                          <Button
                            size="small"
                            variant={selectedEntry?.id === entry.id ? "contained" : "outlined"}
                            startIcon={<EditIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEntrySelection(entry);
                            }}
                          >
                            {selectedEntry?.id === entry.id ? 'Selected' : 'Select'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(entry.measurementDate)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(entry.measurementTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatWeight(entry.weight, entry.weightUnit)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {entry.measurementCondition ? (
                            <Chip 
                              label={entry.measurementCondition} 
                              size="small" 
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.mood ? (
                            <Chip 
                              label={entry.mood} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              maxWidth: 150, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {entry.notes || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Selected Entry Display */}
        {selectedEntry && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="primary">
                🎯 Selected Entry for Update
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Entry ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    #{selectedEntry.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Current Weight
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatWeight(selectedEntry.weight, selectedEntry.weightUnit)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedEntry.measurementDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedEntry.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Weight Update Form */}
        <Collapse in={showForm && !!selectedEntry}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ✏️ Update Weight Entry
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Modify the fields you want to update. Only changed fields will be sent to the API.
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Weight and Unit */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    error={!!errors.weight}
                    helperText={errors.weight || 'Enter new weight value'}
                    fullWidth
                    inputProps={{ step: 0.1, min: 0.1, max: 1000 }}
                    InputProps={{
                      endAdornment: isFieldModified('weight') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.weightUnit}>
                    <InputLabel>Weight Unit</InputLabel>
                    <Select
                      value={formData.weightUnit}
                      onChange={(e) => handleInputChange('weightUnit', e.target.value)}
                      label="Weight Unit"
                      endAdornment={isFieldModified('weightUnit') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )}
                    >
                      <MenuItem value="kg">Kilograms (kg)</MenuItem>
                      <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date and Time */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Measurement Date"
                    type="date"
                    value={formData.measurementDate}
                    onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                    error={!!errors.measurementDate}
                    helperText={errors.measurementDate || 'New measurement date'}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: isFieldModified('measurementDate') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Measurement Time"
                    type="time"
                    value={formData.measurementTime}
                    onChange={(e) => handleInputChange('measurementTime', e.target.value)}
                    error={!!errors.measurementTime}
                    helperText={errors.measurementTime || 'New measurement time'}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: isFieldModified('measurementTime') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )
                    }}
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
                      endAdornment={isFieldModified('measurementCondition') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )}
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
                      endAdornment={isFieldModified('mood') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )}
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
                    helperText={errors.sleepHours || 'New sleep hours (0-24)'}
                    fullWidth
                    inputProps={{ step: 0.5, min: 0, max: 24 }}
                    InputProps={{
                      endAdornment: isFieldModified('sleepHours') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <Typography variant="body2" gutterBottom>
                      Stress Level
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
                    {isFieldModified('stressLevel') && (
                      <Chip 
                        label="Modified" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
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
                    placeholder="Update notes about your weight measurement..."
                    InputProps={{
                      endAdornment: isFieldModified('notes') && (
                        <Chip 
                          label="Modified" 
                          size="small" 
                          color="warning" 
                          variant="outlined"
                        />
                      )
                    }}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || modifiedFields.size === 0}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{ minWidth: 200 }}
                    >
                      {loading ? 'Updating...' : 'Update Weight Entry'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      disabled={modifiedFields.size === 0}
                      startIcon={<ClearIcon />}
                    >
                      Reset Changes
                    </Button>
                  </Box>
                </Grid>

                {/* Modified Fields Summary */}
                {modifiedFields.size > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="info" icon={<WarningIcon />}>
                      <Typography variant="body2">
                        <strong>Fields to be updated:</strong> {Array.from(modifiedFields).join(', ')}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </form>
          </Card>
        </Collapse>

        {/* Updated Entry Display */}
        {updatedEntry && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Successfully Updated Weight Entry
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Entry ID
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    #{updatedEntry.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Updated Weight
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatWeight(updatedEntry.weight, updatedEntry.weightUnit)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(updatedEntry.measurementDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(updatedEntry.updated_at)}
                  </Typography>
                </Grid>
              </Grid>

              {(updatedEntry.mood || updatedEntry.sleepHours || updatedEntry.stressLevel) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {updatedEntry.mood && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Mood
                        </Typography>
                        <Chip 
                          label={updatedEntry.mood} 
                          color="primary" 
                          variant="outlined"
                        />
                      </Grid>
                    )}
                    
                    {updatedEntry.sleepHours && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Sleep Hours
                        </Typography>
                        <Typography variant="body1">
                          {updatedEntry.sleepHours}h
                        </Typography>
                      </Grid>
                    )}
                    
                    {updatedEntry.stressLevel && (
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Stress Level
                        </Typography>
                        <Chip 
                          label={updatedEntry.stressLevel} 
                          color={
                            updatedEntry.stressLevel === 'low' ? 'success' : 
                            updatedEntry.stressLevel === 'medium' ? 'warning' : 'error'
                          }
                          variant="outlined"
                        />
                      </Grid>
                    )}
                  </Grid>
                </>
              )}

              {updatedEntry.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {updatedEntry.notes}
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
            <strong>Endpoint:</strong> PUT /api/body-metrics/weight/:id<br />
            <strong>Status:</strong> {loading ? 'Updating...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Selected Entry:</strong> {selectedEntry ? `ID ${selectedEntry.id}` : 'None'}<br />
            <strong>Modified Fields:</strong> {modifiedFields.size > 0 ? Array.from(modifiedFields).join(', ') : 'None'}<br />
            <strong>Form Visible:</strong> {showForm ? 'Yes' : 'No'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightUpdateTest;
