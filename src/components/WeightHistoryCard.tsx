import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Collapse,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  LinearProgress,
  Grid,
  Paper,
  Divider,
  Tooltip,
  Fab,
  Zoom
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { bodyMetricsService } from '../services/bodyMetricsService';
import { useAuth } from '../context/AuthContext';

interface WeightEntry {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
  height?: string;
  heightUnit?: string;
  bmi?: string;
  measurementDate: string;
  measurementTime: string;
  measurementCondition: string;
  notes: string | null;
  mood: string;
  sleepHours: number;
  stressLevel: string;
  created_at: string;
  updated_at: string;
}

interface WeightAnalytics {
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
  weight: {
    start: string;
    current: string;
    change: number;
    changePercentage: number;
    average: string;
    highest: string;
    lowest: string;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  bmi: {
    start: number;
    current: number;
    change: number;
    changePercentage: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  progress: {
    weeklyChange: number;
    monthlyChange: number;
    goalProgress: number | null;
  };
}

const WeightHistoryCard: React.FC = () => {
  const { token } = useAuth();
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [analytics, setAnalytics] = useState<WeightAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<{
    weight: string;
    weightUnit: 'kg' | 'lbs';
    measurementDate: string;
    measurementTime: string;
    measurementCondition: string;
    notes: string;
    mood: string;
    sleepHours: number;
    stressLevel: 'low' | 'medium' | 'high';
  }>({
    weight: '',
    weightUnit: 'kg',
    measurementDate: new Date().toISOString().split('T')[0],
    measurementTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    measurementCondition: 'after_sleep',
    notes: '',
    mood: 'neutral',
    sleepHours: 8,
    stressLevel: 'low'
  });

  // Load weight history on component mount
  useEffect(() => {
    if (token) {
      fetchWeightHistory();
    }
  }, [token]);

  const fetchWeightHistory = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.getWeightHistory(token, { limit: 10 });
      
      if (response.success && response.data) {
        setWeightHistory(response.data.weightHistory || []);
      } else {
        setError(response.message || 'Failed to fetch weight history');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching weight history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.getWeightAnalytics(token);
      
      if (response.success && response.data) {
        setAnalytics(response.data.analytics);
        setShowAnalytics(true);
      } else {
        setError(response.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!token || !formData.weight) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.logWeight(token, {
        weight: parseFloat(formData.weight),
        weightUnit: formData.weightUnit,
        measurementDate: formData.measurementDate,
        measurementTime: formData.measurementTime,
        measurementCondition: formData.measurementCondition,
        notes: formData.notes,
        mood: formData.mood,
        sleepHours: formData.sleepHours,
        stressLevel: formData.stressLevel
      });
      
      if (response.success) {
        setSuccess('Weight entry added successfully!');
        setShowAddForm(false);
        resetForm();
        fetchWeightHistory();
      } else {
        setError(response.message || 'Failed to add weight entry');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding weight entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWeight = async () => {
    if (!token || !editingEntry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.updateWeightEntry(token, editingEntry.id, {
        weight: parseFloat(formData.weight),
        weightUnit: formData.weightUnit,
        measurementTime: formData.measurementTime,
        measurementCondition: formData.measurementCondition,
        notes: formData.notes,
        mood: formData.mood,
        sleepHours: formData.sleepHours,
        stressLevel: formData.stressLevel
      });
      
      if (response.success) {
        setSuccess('Weight entry updated successfully!');
        setEditingEntry(null);
        resetForm();
        fetchWeightHistory();
      } else {
        setError(response.message || 'Failed to update weight entry');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating weight entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWeight = async (entryId: number) => {
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this weight entry? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.deleteWeightEntry(token, entryId);
      
      if (response.success) {
        setSuccess('Weight entry deleted successfully!');
        fetchWeightHistory();
      } else {
        setError(response.message || 'Failed to delete weight entry');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting weight entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      weight: '',
      weightUnit: 'kg',
      measurementDate: new Date().toISOString().split('T')[0],
      measurementTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      measurementCondition: 'after_sleep',
      notes: '',
      mood: 'neutral',
      sleepHours: 8,
      stressLevel: 'low'
    });
  };

  const startEditing = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setFormData({
      weight: entry.weight,
      weightUnit: entry.weightUnit as 'kg' | 'lbs',
      measurementDate: entry.measurementDate,
      measurementTime: entry.measurementTime,
      measurementCondition: entry.measurementCondition,
      notes: entry.notes || '',
      mood: entry.mood,
      sleepHours: entry.sleepHours,
      stressLevel: entry.stressLevel as 'low' | 'medium' | 'high'
    });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    resetForm();
  };

  const getCurrentWeight = (): WeightEntry | null => {
    if (weightHistory.length === 0) return null;
    return weightHistory[0]; // Most recent entry
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon color="error" />;
      case 'decreasing':
        return <TrendingDownIcon color="success" />;
      default:
        return <TrendingFlatIcon color="info" />;
    }
  };

  const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return 'error';
      case 'decreasing':
        return 'success';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatWeight = (weight: string, unit: string) => {
    return `${weight} ${unit}`;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to access weight tracking features
      </Alert>
    );
  }

  const currentWeight = getCurrentWeight();

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2, px: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AnalyticsIcon />}
          onClick={fetchAnalytics}
          disabled={loading}
        >
          Analytics
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
          disabled={loading}
        >
          Add Weight
        </Button>
      </Box>

      <CardContent>
        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Current Weight Display */}
        {currentWeight && (
          <Box sx={{ textAlign: 'center', mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h3" color="primary" gutterBottom>
              {formatWeight(currentWeight.weight, currentWeight.weightUnit)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Last measured: {formatDate(currentWeight.measurementDate)}
            </Typography>
            {currentWeight.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                "{currentWeight.notes}"
              </Typography>
            )}
          </Box>
        )}

        {/* Quick Add Form */}
        <Collapse in={showAddForm}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingEntry ? 'Edit Weight Entry' : 'Add New Weight Entry'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.weightUnit}
                    onChange={(e) => setFormData({ ...formData, weightUnit: e.target.value as 'kg' | 'lbs' })}
                    label="Unit"
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="lbs">lbs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.measurementDate}
                  onChange={(e) => setFormData({ ...formData, measurementDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  type="time"
                  value={formData.measurementTime}
                  onChange={(e) => setFormData({ ...formData, measurementTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={formData.measurementCondition}
                    onChange={(e) => setFormData({ ...formData, measurementCondition: e.target.value })}
                    label="Condition"
                  >
                    <MenuItem value="after_sleep">After Sleep</MenuItem>
                    <MenuItem value="before_breakfast">Before Breakfast</MenuItem>
                    <MenuItem value="after_workout">After Workout</MenuItem>
                    <MenuItem value="before_workout">Before Workout</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling? Any notes about today's measurement?"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Mood</InputLabel>
                  <Select
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    label="Mood"
                  >
                    <MenuItem value="good">😊 Good</MenuItem>
                    <MenuItem value="neutral">😐 Neutral</MenuItem>
                    <MenuItem value="bad">😔 Bad</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Sleep Hours"
                  type="number"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) || 0 })}
                  inputProps={{ step: 0.5, min: 0, max: 24 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Stress Level</InputLabel>
                  <Select
                    value={formData.stressLevel}
                    onChange={(e) => setFormData({ ...formData, stressLevel: e.target.value as 'low' | 'medium' | 'high' })}
                    label="Stress Level"
                  >
                    <MenuItem value="low">😌 Low</MenuItem>
                    <MenuItem value="medium">😐 Medium</MenuItem>
                    <MenuItem value="high">😰 High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={editingEntry ? <SaveIcon /> : <AddIcon />}
                onClick={editingEntry ? handleUpdateWeight : handleAddWeight}
                disabled={loading || !formData.weight}
              >
                {editingEntry ? 'Update' : 'Add Weight'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setShowAddForm(false);
                  cancelEditing();
                }}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Collapse>

        {/* Recent Weight History */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="secondary" />
            Recent Entries
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : weightHistory.length === 0 ? (
            <Alert severity="info">
              No weight entries yet. Add your first weight entry to get started!
            </Alert>
          ) : (
            <List>
              {weightHistory.slice(0, 5).map((entry) => (
                <ListItem
                  key={entry.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="primary">
                          {formatWeight(entry.weight, entry.weightUnit)}
                        </Typography>
                        {entry.bmi && (
                          <Chip
                            label={`BMI: ${entry.bmi}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(entry.measurementDate)}
                          {entry.measurementTime && ` at ${entry.measurementTime}`}
                        </Typography>
                        {entry.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{entry.notes}"
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {entry.mood && (
                            <Chip
                              label={entry.mood}
                              size="small"
                              variant="outlined"
                              color={entry.mood === 'good' ? 'success' : entry.mood === 'bad' ? 'error' : 'default'}
                            />
                          )}
                          {entry.sleepHours && (
                            <Chip
                              label={`${entry.sleepHours}h sleep`}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          )}
                          {entry.stressLevel && (
                            <Chip
                              label={`Stress: ${entry.stressLevel}`}
                              size="small"
                              variant="outlined"
                              color={entry.stressLevel === 'high' ? 'error' : entry.stressLevel === 'medium' ? 'warning' : 'success'}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={() => startEditing(entry)}
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteWeight(entry.id)}
                          disabled={loading}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          
          {weightHistory.length > 5 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ViewIcon />}
                onClick={() => {/* TODO: Navigate to full history page */}}
              >
                View All {weightHistory.length} Entries
              </Button>
            </Box>
          )}
        </Box>

        {/* Analytics Overlay */}
        {showAnalytics && analytics && (
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              mb: 2,
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" color="primary">
                📊 Weight Analytics
              </Typography>
              <IconButton onClick={() => setShowAnalytics(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary">
                    {analytics.totalEntries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getTrendIcon(analytics.weight.trend)}
                  </Box>
                  <Typography variant="h6" color={getTrendColor(analytics.weight.trend)}>
                    {analytics.weight.trend.charAt(0).toUpperCase() + analytics.weight.trend.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weight Trend
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" color="info">
                    {analytics.weight.change > 0 ? '+' : ''}{analytics.weight.change.toFixed(1)} {currentWeight?.weightUnit || 'kg'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Change
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.weight.changePercentage > 0 ? '+' : ''}{analytics.weight.changePercentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" color="secondary">
                    {analytics.dateRange.days}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days Analyzed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {analytics.dateRange.start} to {analytics.dateRange.end}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                                  <Typography variant="body2" color="text.secondary">
                    <strong>Average:</strong> {analytics.weight.average} {currentWeight?.weightUnit || 'kg'}
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                                  <Typography variant="body2" color="text.secondary">
                    <strong>Highest:</strong> {analytics.weight.highest} {currentWeight?.weightUnit || 'kg'}
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                                  <Typography variant="body2" color="text.secondary">
                    <strong>Lowest:</strong> {analytics.weight.lowest} {currentWeight?.weightUnit || 'kg'}
                  </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </CardContent>
    </Box>
  );
};

export default WeightHistoryCard;
