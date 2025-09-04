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
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Divider,
  Tooltip,
  LinearProgress
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
  Straighten as StraightenIcon,
  FitnessCenter as FitnessCenterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { bodyMetricsService, bodyMeasurementsService } from '../services/bodyMetricsService';
import { useAuth } from '../context/AuthContext';

interface BodyMetrics {
  id: number;
  chest: string;
  waist: string;
  hips: string;
  biceps: string;
  forearms: string;
  thighs: string;
  calves: string;
  neck: string;
  measurementDate: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface BodyMetricsAnalytics {
  totalMeasurements: number;
  dateRange: {
    start: string;
    end: string;
  };
  progress: {
    chest: MeasurementProgress | null;
    waist: MeasurementProgress | null;
    hips: MeasurementProgress | null;
    biceps: MeasurementProgress | null;
    forearms: MeasurementProgress | null;
    thighs: MeasurementProgress | null;
    calves: MeasurementProgress | null;
    neck: MeasurementProgress | null;
  };
}

interface MeasurementProgress {
  start: string;
  current: string;
  change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

const BodyMetricsCard: React.FC = () => {
  const { token } = useAuth();
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics[]>([]);
  const [analytics, setAnalytics] = useState<BodyMetricsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BodyMetrics | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAllMeasurements, setShowAllMeasurements] = useState(false);
  const [showRecentMeasurements, setShowRecentMeasurements] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<{
    chest: string;
    waist: string;
    hips: string;
    biceps: string;
    forearms: string;
    thighs: string;
    calves: string;
    neck: string;
    measurementDate: string;
    notes: string;
  }>({
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    forearms: '',
    thighs: '',
    calves: '',
    neck: '',
    measurementDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Load body metrics on component mount and when page changes
  useEffect(() => {
    if (token) {
      fetchBodyMetrics();
    }
  }, [token, currentPage]);



  const fetchBodyMetrics = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get current measurements
      const currentResponse = await bodyMeasurementsService.getCurrentBodyMetrics(token);
      
      // Get history of measurements
      const historyResponse = await bodyMeasurementsService.getBodyMetricsHistory(token, { page: currentPage, limit: itemsPerPage });
      
      if (currentResponse.success && currentResponse.data && currentResponse.data.metrics) {
        // Convert current metrics to extended format
        const currentMetrics = {
          ...currentResponse.data.metrics,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Combine current with history
        let allMetrics = [currentMetrics];
        
        if (historyResponse.success && historyResponse.data && historyResponse.data.metrics) {
          // Convert history metrics to extended format
          const historyMetrics = historyResponse.data.metrics.map(metric => ({
            ...metric,
            created_at: (metric as any).created_at || new Date().toISOString(),
            updated_at: (metric as any).updated_at || new Date().toISOString()
          }));
          
          // Merge and remove duplicates based on ID
          const existingIds = new Set([currentMetrics.id]);
          const uniqueHistoryMetrics = historyMetrics.filter(metric => !existingIds.has(metric.id));
          allMetrics = [currentMetrics, ...uniqueHistoryMetrics];
          
          // Update pagination state
          if (historyResponse.data.pagination) {
            setTotalPages(historyResponse.data.pagination.totalPages);
            setTotalItems(historyResponse.data.pagination.totalItems);
          }
        }
        
        setBodyMetrics(allMetrics);
      } else if (historyResponse.success && historyResponse.data && historyResponse.data.metrics) {
        // If no current metrics, just show history
        const historyMetrics = historyResponse.data.metrics.map(metric => ({
          ...metric,
          created_at: (metric as any).created_at || new Date().toISOString(),
          updated_at: (metric as any).updated_at || new Date().toISOString()
        }));
        setBodyMetrics(historyMetrics);
      } else {
        setBodyMetrics([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching body metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMetricsService.getAnalytics(token, 30); // Get last 30 days
      
      if (response.success && response.data) {
        console.log('Body Metrics Analytics response:', response.data); // Debug log
        // Transform the response to match our interface
        // Create fallback data if API doesn't return expected structure
        const fallbackDate = new Date();
        const fallbackStartDate = new Date(fallbackDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Extract analytics data from the nested structure
        const analyticsData = response.data.analytics || response.data;
        
        const transformedAnalytics: BodyMetricsAnalytics = {
          totalMeasurements: analyticsData.totalMeasurements || analyticsData.total || bodyMetrics.length || 0,
          dateRange: {
            start: analyticsData.dateRange?.start || analyticsData.startDate || fallbackStartDate.toISOString().split('T')[0],
            end: analyticsData.dateRange?.end || analyticsData.endDate || fallbackDate.toISOString().split('T')[0]
          },
          progress: {
            chest: analyticsData.progress?.chest || analyticsData.chest || null,
            waist: analyticsData.progress?.waist || analyticsData.waist || null,
            hips: analyticsData.progress?.hips || analyticsData.hips || null,
            biceps: analyticsData.progress?.biceps || analyticsData.biceps || null,
            forearms: analyticsData.progress?.forearms || analyticsData.forearms || null,
            thighs: analyticsData.progress?.thighs || analyticsData.thighs || null,
            calves: analyticsData.progress?.calves || analyticsData.calves || null,
            neck: analyticsData.progress?.neck || analyticsData.neck || null
          }
        };
        console.log('Transformed analytics:', transformedAnalytics); // Debug log
        console.log('Available progress fields:', Object.keys(transformedAnalytics.progress).filter(key => transformedAnalytics.progress[key as keyof typeof transformedAnalytics.progress] !== null)); // Debug log
        setAnalytics(transformedAnalytics);
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

  const handleAddMetrics = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMeasurementsService.logBodyMetrics(token, {
        measurementDate: formData.measurementDate,
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        forearms: formData.forearms ? parseFloat(formData.forearms) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
        calves: formData.calves ? parseFloat(formData.calves) : undefined,
        neck: formData.neck ? parseFloat(formData.neck) : undefined,
        notes: formData.notes
      });
      
      if (response.success) {
        setSuccess('Body metrics added successfully!');
        setShowAddForm(false);
        resetForm();
        fetchBodyMetrics();
      } else {
        setError(response.message || 'Failed to add body metrics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding body metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMetrics = async () => {
    if (!token || !editingEntry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMeasurementsService.updateBodyMetrics(token, editingEntry.id, {
        chest: formData.chest ? parseFloat(formData.chest) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        biceps: formData.biceps ? parseFloat(formData.biceps) : undefined,
        forearms: formData.forearms ? parseFloat(formData.forearms) : undefined,
        thighs: formData.thighs ? parseFloat(formData.thighs) : undefined,
        calves: formData.calves ? parseFloat(formData.calves) : undefined,
        neck: formData.neck ? parseFloat(formData.neck) : undefined,
        notes: formData.notes
      });
      
      if (response.success) {
        setSuccess('Body metrics updated successfully!');
        setEditingEntry(null);
        resetForm();
        fetchBodyMetrics();
      } else {
        setError(response.message || 'Failed to update body metrics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error updating body metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMetrics = async (entryId: number) => {
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this body metrics entry? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyMeasurementsService.deleteBodyMetrics(token, entryId);
      
      if (response.success) {
        setSuccess('Body metrics deleted successfully!');
        fetchBodyMetrics();
      } else {
        setError(response.message || 'Failed to delete body metrics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting body metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      chest: '',
      waist: '',
      hips: '',
      biceps: '',
      forearms: '',
      thighs: '',
      calves: '',
      neck: '',
      measurementDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const startEditing = (entry: BodyMetrics) => {
    setEditingEntry(entry);
    setFormData({
      chest: entry.chest,
      waist: entry.waist,
      hips: entry.hips,
      biceps: entry.biceps,
      forearms: entry.forearms,
      thighs: entry.thighs,
      calves: entry.calves,
      neck: entry.neck,
      measurementDate: entry.measurementDate,
      notes: entry.notes || ''
    });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    resetForm();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getCurrentMetrics = (): BodyMetrics | null => {
    if (bodyMetrics.length === 0) return null;
    return bodyMetrics[0]; // Most recent entry
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

  const formatMeasurement = (value: string) => {
    return `${value} cm`;
  };

  const getMeasurementIcon = (measurementType: string) => {
    switch (measurementType) {
      case 'chest':
        return <FitnessCenterIcon fontSize="small" />;
      case 'waist':
        return <StraightenIcon fontSize="small" />;
      case 'hips':
        return <FitnessCenterIcon fontSize="small" />;
      case 'biceps':
        return <FitnessCenterIcon fontSize="small" />;
      case 'forearms':
        return <FitnessCenterIcon fontSize="small" />;
      case 'thighs':
        return <FitnessCenterIcon fontSize="small" />;
      case 'calves':
        return <FitnessCenterIcon fontSize="small" />;
      case 'neck':
        return <StraightenIcon fontSize="small" />;
      default:
        return <StraightenIcon fontSize="small" />;
    }
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to access body metrics tracking features
      </Alert>
    );
  }

  const currentMetrics = getCurrentMetrics();

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 3 }}>
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
          Add Measurements
        </Button>
      </Box>

      {/* Spacer */}
      <Box sx={{ height: 32 }} />

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

        {/* Current Measurements Display */}
        {currentMetrics && (
          <Box sx={{ mb: 4 }}>
            {/* Simple Header */}
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: 2, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              📏 Current Measurements
            </Typography>
            
            {/* Complete Measurements Grid */}
            <Grid container spacing={2}>
              {/* Chest */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('chest')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Chest
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.chest)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Waist */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('waist')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Waist
                  </Typography>
                  <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.waist)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Hips */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('hips')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Hips
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.hips)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Biceps */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('biceps')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Biceps
                  </Typography>
                  <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.biceps)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Forearms */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('forearms')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Forearms
                  </Typography>
                  <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.forearms)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Thighs */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('thighs')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Thighs
                  </Typography>
                  <Typography variant="h6" color="info.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.thighs)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Calves */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('calves')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Calves
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.calves)}
                  </Typography>
                </Box>
              </Grid>
                
              {/* Neck */}
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getMeasurementIcon('neck')}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Neck
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                    {formatMeasurement(currentMetrics.neck)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            {/* Simple Info Row */}
            <Box sx={{ 
              mt: 2, 
              textAlign: 'center',
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                Last measured: {formatDate(currentMetrics.measurementDate)}
              </Typography>
              {currentMetrics.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                  💬 "{currentMetrics.notes}"
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Quick Add/Edit Form */}
        <Collapse in={showAddForm}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingEntry ? 'Edit Body Measurements' : 'Add New Body Measurements'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Chest (cm)"
                  type="number"
                  value={formData.chest}
                  onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Waist (cm)"
                  type="number"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hips (cm)"
                  type="number"
                  value={formData.hips}
                  onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Biceps (cm)"
                  type="number"
                  value={formData.biceps}
                  onChange={(e) => setFormData({ ...formData, biceps: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Forearms (cm)"
                  type="number"
                  value={formData.forearms}
                  onChange={(e) => setFormData({ ...formData, forearms: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thighs (cm)"
                  type="number"
                  value={formData.thighs}
                  onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Calves (cm)"
                  type="number"
                  value={formData.calves}
                  onChange={(e) => setFormData({ ...formData, calves: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Neck (cm)"
                  type="number"
                  value={formData.neck}
                  onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
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
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any notes about today's measurements?"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={editingEntry ? <SaveIcon /> : <AddIcon />}
                onClick={editingEntry ? handleUpdateMetrics : handleAddMetrics}
                disabled={loading}
              >
                {editingEntry ? 'Update' : 'Add Measurements'}
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

                {/* Recent Measurements History */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: 'primary.main',
              fontWeight: 600
            }}>
              <HistoryIcon color="primary" />
              Recent Measurements
            </Typography>
            
                        <Button
              variant="outlined"
              size="small"
              onClick={() => setShowRecentMeasurements(!showRecentMeasurements)}
              startIcon={showRecentMeasurements ? <VisibilityOffIcon /> : <VisibilityIcon />}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '0.875rem',
                border: '2px solid',
                borderColor: showRecentMeasurements ? 'warning.main' : 'success.main',
                bgcolor: 'background.paper',
                color: showRecentMeasurements ? 'warning.main' : 'success.main',
                '&:hover': {
                  bgcolor: showRecentMeasurements ? 'warning.50' : 'success.50',
                  borderColor: showRecentMeasurements ? 'warning.dark' : 'success.dark'
                }
              }}
            >
              {showRecentMeasurements ? 'Hide' : 'Show'}
            </Button>
          </Box>
          
          {showRecentMeasurements ? (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : bodyMetrics.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  bgcolor: 'grey.50', 
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'divider'
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    📏 No measurements yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add your first body measurements to start tracking your progress!
                  </Typography>
                </Box>
              ) : (
                <Box>

                  
                  {(showAllMeasurements ? bodyMetrics : bodyMetrics.slice(0, 3)).map((entry, index) => (
                <Box
                  key={entry.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'grey.50'
                    }
                  }}
                >
                    {/* Header with Date and Actions */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={formatDate(entry.measurementDate)}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => startEditing(entry)}
                            disabled={loading}
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMetrics(entry.id)}
                            disabled={loading}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.50' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Complete Measurements Grid */}
                    <Grid container spacing={1}>
                      {/* Chest */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Chest
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight={600}>
                            {entry.chest || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Waist */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Waist
                          </Typography>
                          <Typography variant="body2" color="secondary.main" fontWeight={600}>
                            {entry.waist || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Hips */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Hips
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            {entry.hips || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Biceps */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Biceps
                          </Typography>
                          <Typography variant="body2" color="warning.main" fontWeight={600}>
                            {entry.biceps || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Forearms */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Forearms
                          </Typography>
                          <Typography variant="body2" color="error.main" fontWeight={600}>
                            {entry.forearms || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Thighs */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Thighs
                          </Typography>
                          <Typography variant="body2" color="info.main" fontWeight={600}>
                            {entry.thighs || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Calves */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Calves
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            {entry.calves || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {/* Neck */}
                      <Grid item xs={6} sm={4} md={3}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Neck
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight={600}>
                            {entry.neck || 'N/A'}cm
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Notes */}
                    {entry.notes && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          💬 "{entry.notes}"
                        </Typography>
                      </Box>
                    )}
                </Box>
              ))}
              
              {/* Show All/Less Button */}
              {bodyMetrics.length > 3 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3,
                  mb: 2
                }}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => setShowAllMeasurements(!showAllMeasurements)}
                    startIcon={showAllMeasurements ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      px: 3,
                      py: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'primary.50',
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    {showAllMeasurements ? 'Show Less' : `Show All (${bodyMetrics.length})`}
                  </Button>
                </Box>
              )}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: 2, 
                  mt: 3,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 2
                }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    startIcon={<HistoryIcon />}
                  >
                    Previous
                  </Button>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Page {currentPage} of {totalPages}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    endIcon={<HistoryIcon />}
                  >
                    Next
                  </Button>
                </Box>
              )}
              
              {/* Total Items Info */}
              {totalItems > 0 && (
                <Box sx={{ 
                  textAlign: 'center', 
                  mt: 2,
                  p: 2,
                  bgcolor: 'primary.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.100'
                }}>
                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                    📊 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4, 
          bgcolor: 'grey.50', 
          borderRadius: 2,
          border: '2px dashed',
          borderColor: 'divider'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            👁️ Recent Measurements Hidden
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Show" to display your recent body measurements
          </Typography>
        </Box>
      )}
        </Box>

        {/* Analytics Card */}
        {showAnalytics && analytics && (
          <Card sx={{ 
            mb: 4, 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              p: 3,
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  📊 Body Measurements Analytics
                </Typography>
                <IconButton 
                  onClick={() => setShowAnalytics(false)}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Advanced insights and trend analysis for your fitness journey
              </Typography>
            </Box>
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {analytics.totalMeasurements || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Measurements
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="secondary">
                      {analytics.dateRange?.start && analytics.dateRange?.end ? 
                        Math.ceil((new Date(analytics.dateRange.end).getTime() - new Date(analytics.dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Analyzed
                    </Typography>
                    {analytics.dateRange?.start && analytics.dateRange?.end && (
                      <Typography variant="caption" color="text.secondary">
                        {analytics.dateRange.start} to {analytics.dateRange.end}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Chest Progress */}
                {analytics.progress?.chest && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.chest.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.chest.trend || 'stable')}>
                        Chest {(analytics.progress.chest.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.chest.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.chest.change || 0) > 0 ? '+' : ''}{(analytics.progress.chest.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Waist Progress */}
                {analytics.progress?.waist && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.waist.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.waist.trend || 'stable')}>
                        Waist {(analytics.progress.waist.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.waist.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.waist.change || 0) > 0 ? '+' : ''}{(analytics.progress.waist.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Hips Progress */}
                {analytics.progress?.hips && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.hips.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.hips.trend || 'stable')}>
                        Hips {(analytics.progress.hips.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.hips.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.hips.change || 0) > 0 ? '+' : ''}{(analytics.progress.hips.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Biceps Progress */}
                {analytics.progress?.biceps && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.biceps.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.biceps.trend || 'stable')}>
                        Biceps {(analytics.progress.biceps.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.biceps.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.biceps.change || 0) > 0 ? '+' : ''}{(analytics.progress.biceps.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Forearms Progress */}
                {analytics.progress?.forearms && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.forearms.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.forearms.trend || 'stable')}>
                        Forearms {(analytics.progress.forearms.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.forearms.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.forearms.change || 0) > 0 ? '+' : ''}{(analytics.progress.forearms.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Thighs Progress */}
                {analytics.progress?.thighs && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.thighs.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.thighs.trend || 'stable')}>
                        Thighs {(analytics.progress.thighs.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.thighs.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.thighs.change || 0) > 0 ? '+' : ''}{(analytics.progress.thighs.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Calves Progress */}
                {analytics.progress?.calves && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.calves.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.calves.trend || 'stable')}>
                        Calves {(analytics.progress.calves.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.calves.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.calves.change || 0) > 0 ? '+' : ''}{(analytics.progress.calves.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {/* Neck Progress */}
                {analytics.progress?.neck && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {getTrendIcon(analytics.progress.neck.trend || 'stable')}
                      </Box>
                      <Typography variant="h6" color={getTrendColor(analytics.progress.neck.trend || 'stable')}>
                        Neck {(analytics.progress.neck.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.neck.trend || 'stable').slice(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(analytics.progress.neck.change || 0) > 0 ? '+' : ''}{(analytics.progress.neck.change || 0).toFixed(1)}cm
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Progress Summary
              </Typography>
              <Grid container spacing={2}>
                {analytics.progress?.chest && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Chest:</strong> Started at {analytics.progress.chest.start}cm, now at {analytics.progress.chest.current}cm 
                      ({(analytics.progress.chest.change || 0) > 0 ? '+' : ''}{(analytics.progress.chest.change || 0).toFixed(1)}cm change)
                    </Typography>
                  </Grid>
                )}
                {analytics.progress?.waist && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Waist:</strong> Started at {analytics.progress.waist.start}cm, now at {analytics.progress.waist.current}cm 
                      ({(analytics.progress.waist.change || 0) > 0 ? '+' : ''}{(analytics.progress.waist.change || 0).toFixed(1)}cm change)
                    </Typography>
                  </Grid>
                )}
                {analytics.progress?.hips && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Hips:</strong> Started at {analytics.progress.hips.start}cm, now at {analytics.progress.hips.current}cm 
                      ({(analytics.progress.hips.change || 0) > 0 ? '+' : ''}{(analytics.progress.hips.change || 0).toFixed(1)}cm change)
                    </Typography>
                  </Grid>
                )}
                {analytics.progress?.biceps && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Biceps:</strong> Started at {analytics.progress.biceps.start}cm, now at {analytics.progress.biceps.current}cm 
                      ({(analytics.progress.biceps.change || 0) > 0 ? '+' : ''}{(analytics.progress.biceps.change || 0).toFixed(1)}cm change)
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              {/* Analytics Data Summary */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="body2" color="info.main">
                  📊 <strong>Analytics Summary:</strong> Based on {analytics.totalMeasurements} measurements from {analytics.dateRange?.start} to {analytics.dateRange?.end}. 
                  Showing progress for measurements with sufficient data. Fields with no measurements are not displayed.
                </Typography>
              </Box>
            </Box>
          </Card>
        )}
      </CardContent>
    </Box>
  );
};

export default BodyMetricsCard;
