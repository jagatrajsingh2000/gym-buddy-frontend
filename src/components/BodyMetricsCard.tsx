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
  FitnessCenter as FitnessCenterIcon
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
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
  measurements: {
    chest: {
      start: string;
      current: string;
      change: number;
      changePercentage: number;
      average: string;
      highest: string;
      lowest: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    waist: {
      start: string;
      current: string;
      change: number;
      changePercentage: number;
      average: string;
      highest: string;
      lowest: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    hips: {
      start: string;
      current: string;
      change: number;
      changePercentage: number;
      average: string;
      highest: string;
      lowest: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
  progress: {
    weeklyChange: number;
    monthlyChange: number;
    goalProgress: number | null;
  };
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
      // TODO: Implement analytics when getBodyMeasurementsAnalytics is available
      setError('Analytics feature coming soon!');
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
    <Card sx={{ mb: 3, position: 'relative' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StraightenIcon color="primary" />
            <Typography variant="h5" component="h2">
              Body Measurements
            </Typography>
          </Box>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
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
        }
      />

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
          <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📏 Current Measurements
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chest
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMeasurement(currentMetrics.chest)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Waist
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMeasurement(currentMetrics.waist)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Hips
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMeasurement(currentMetrics.hips)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Neck
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMeasurement(currentMetrics.neck)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Last measured: {formatDate(currentMetrics.measurementDate)}
            </Typography>
            {currentMetrics.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }}>
                "{currentMetrics.notes}"
              </Typography>
            )}
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="secondary" />
            Recent Measurements
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : bodyMetrics.length === 0 ? (
            <Alert severity="info">
              No body measurements yet. Add your first measurements to get started!
            </Alert>
          ) : (
            <List>
              {bodyMetrics.map((entry) => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(entry.measurementDate)}
                        </Typography>
                        <Chip
                          label={`${entry.chest}cm chest, ${entry.waist}cm waist`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMeasurementIcon('chest')}
                              <Typography variant="caption">
                                Chest: {entry.chest}cm
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMeasurementIcon('waist')}
                              <Typography variant="caption">
                                Waist: {entry.waist}cm
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMeasurementIcon('hips')}
                              <Typography variant="caption">
                                Hips: {entry.hips}cm
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMeasurementIcon('neck')}
                              <Typography variant="caption">
                                Neck: {entry.neck}cm
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        {entry.notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            "{entry.notes}"
                          </Typography>
                        )}
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
                          onClick={() => handleDeleteMetrics(entry.id)}
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
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                startIcon={<HistoryIcon />}
              >
                Previous
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
              
              <Button
                variant="outlined"
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
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </Typography>
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
                📊 Body Measurements Analytics
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
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getTrendIcon(analytics.measurements.chest.trend)}
                  </Box>
                  <Typography variant="h6" color={getTrendColor(analytics.measurements.chest.trend)}>
                    Chest {analytics.measurements.chest.trend.charAt(0).toUpperCase() + analytics.measurements.chest.trend.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.measurements.chest.change > 0 ? '+' : ''}{analytics.measurements.chest.change.toFixed(1)}cm
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getTrendIcon(analytics.measurements.waist.trend)}
                  </Box>
                  <Typography variant="h6" color={getTrendColor(analytics.measurements.waist.trend)}>
                    Waist {analytics.measurements.waist.trend.charAt(0).toUpperCase() + analytics.measurements.waist.trend.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analytics.measurements.waist.change > 0 ? '+' : ''}{analytics.measurements.waist.change.toFixed(1)}cm
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
                  <strong>Chest:</strong> {analytics.measurements.chest.average}cm avg, {analytics.measurements.chest.highest}cm high, {analytics.measurements.chest.lowest}cm low
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Waist:</strong> {analytics.measurements.waist.average}cm avg, {analytics.measurements.waist.highest}cm high, {analytics.measurements.waist.lowest}cm low
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Hips:</strong> {analytics.measurements.hips.average}cm avg, {analytics.measurements.hips.highest}cm high, {analytics.measurements.hips.lowest}cm low
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default BodyMetricsCard;
