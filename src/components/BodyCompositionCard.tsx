import React, { useState, useEffect } from 'react';
import {
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
  History as HistoryIcon,
  FitnessCenter as FitnessCenterIcon,
  WaterDrop as WaterDropIcon,
  Spa as SpaIcon,
  MonitorWeight as MonitorWeightIcon
} from '@mui/icons-material';
import { bodyCompositionService } from '../services/bodyMetricsService';
import { useAuth } from '../context/AuthContext';

interface BodyComposition {
  id: number;
  bodyFatPercentage: string | null;
  muscleMass: string | null;
  boneMass: string | null;
  waterPercentage: string | null;
  measurementDate: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface BodyCompositionAnalytics {
  totalMeasurements: number;
  dateRange: {
    start: string;
    end: string;
  };
  progress: {
    bodyFat: {
      start: string;
      current: string;
      change: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    muscleMass: {
      start: string;
      current: string;
      change: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    boneMass: {
      start: string;
      current: string;
      change: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    waterPercentage: {
      start: string;
      current: string;
      change: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
  };
}

const BodyCompositionCard: React.FC = () => {
  const { token } = useAuth();
  const [bodyCompositions, setBodyCompositions] = useState<BodyComposition[]>([]);
  const [analytics, setAnalytics] = useState<BodyCompositionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BodyComposition | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  
  // Form data
  const [formData, setFormData] = useState<{
    bodyFatPercentage: string;
    muscleMass: string;
    boneMass: string;
    waterPercentage: string;
    measurementDate: string;
    notes: string;
  }>({
    bodyFatPercentage: '',
    muscleMass: '',
    boneMass: '',
    waterPercentage: '',
    measurementDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Load body composition on component mount and when page changes
  useEffect(() => {
    if (token) {
      fetchBodyCompositions();
    }
  }, [token, currentPage]);

  const fetchBodyCompositions = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get current composition
      const currentResponse = await bodyCompositionService.getCurrentComposition(token);
      
      // Get history of compositions
      const historyResponse = await bodyCompositionService.getCompositionHistory(token, { page: currentPage, limit: itemsPerPage });
      
      if (currentResponse.success && currentResponse.data && currentResponse.data.composition) {
        // Convert current composition to extended format
        const currentComposition = {
          ...currentResponse.data.composition,
          created_at: (currentResponse.data.composition as any).created_at || new Date().toISOString(),
          updated_at: (currentResponse.data.composition as any).updated_at || new Date().toISOString()
        };
        
        // Combine current with history
        let allCompositions = [currentComposition];
        
        if (historyResponse.success && historyResponse.data && historyResponse.data.compositions) {
          // Convert history compositions to extended format
          const historyCompositions = historyResponse.data.compositions.map(composition => ({
            ...composition,
            created_at: (composition as any).created_at || new Date().toISOString(),
            updated_at: (composition as any).updated_at || new Date().toISOString()
          }));
          
          // Merge and remove duplicates based on ID
          const existingIds = new Set([currentComposition.id]);
          const uniqueHistoryCompositions = historyCompositions.filter(composition => !existingIds.has(composition.id));
          allCompositions = [currentComposition, ...uniqueHistoryCompositions];
          
          // Update pagination state
          if (historyResponse.data.pagination) {
            setTotalPages(historyResponse.data.pagination.totalPages);
            setTotalItems(historyResponse.data.pagination.totalItems);
          }
        }
        
        setBodyCompositions(allCompositions);
      } else if (historyResponse.success && historyResponse.data && historyResponse.data.compositions) {
        // If no current composition, just show history
        const historyCompositions = historyResponse.data.compositions.map(composition => ({
          ...composition,
          created_at: (composition as any).created_at || new Date().toISOString(),
          updated_at: (composition as any).updated_at || new Date().toISOString()
        }));
        setBodyCompositions(historyCompositions);
        
        // Update pagination state
        if (historyResponse.data.pagination) {
          setTotalPages(historyResponse.data.pagination.totalPages);
          setTotalItems(historyResponse.data.pagination.totalItems);
        }
      } else {
        setBodyCompositions([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching body compositions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyCompositionService.getCompositionAnalytics(token);
      
      if (response.success && response.data) {
        console.log('Analytics response:', response.data); // Debug log
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

  const handleAddComposition = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyCompositionService.logComposition(token, {
        measurementDate: formData.measurementDate,
        bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
        boneMass: formData.boneMass ? parseFloat(formData.boneMass) : undefined,
        waterPercentage: formData.waterPercentage ? parseFloat(formData.waterPercentage) : undefined,
        notes: formData.notes
      });
      
      if (response.success) {
        setSuccess('Body composition added successfully!');
        setShowAddForm(false);
        resetForm();
        fetchBodyCompositions();
      } else {
        setError(response.message || 'Failed to add body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error adding body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComposition = async () => {
    if (!token || !editingEntry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyCompositionService.updateComposition(token, editingEntry.id, {
        bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
        boneMass: formData.boneMass ? parseFloat(formData.boneMass) : undefined,
        waterPercentage: formData.waterPercentage ? parseFloat(formData.waterPercentage) : undefined,
        notes: formData.notes
      });
      
      if (response.success) {
        setSuccess('Body composition updated successfully!');
        setEditingEntry(null);
        setShowAddForm(false); // Hide form after successful update
        resetForm();
        fetchBodyCompositions();
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

  const handleDeleteComposition = async (entryId: number) => {
    if (!token) return;
    
    if (!window.confirm('Are you sure you want to delete this body composition entry? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bodyCompositionService.deleteComposition(token, entryId);
      
      if (response.success) {
        setSuccess('Body composition deleted successfully!');
        fetchBodyCompositions();
      } else {
        setError(response.message || 'Failed to delete body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bodyFatPercentage: '',
      muscleMass: '',
      boneMass: '',
      waterPercentage: '',
      measurementDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const startEditing = (entry: BodyComposition) => {
    setEditingEntry(entry);
    setShowAddForm(true); // Ensure form is visible when editing
    setFormData({
      bodyFatPercentage: entry.bodyFatPercentage || '',
      muscleMass: entry.muscleMass || '',
      boneMass: entry.boneMass || '',
      waterPercentage: entry.waterPercentage || '',
      measurementDate: entry.measurementDate,
      notes: entry.notes || ''
    });
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setShowAddForm(false); // Hide form when canceling edit
    resetForm();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getCurrentComposition = (): BodyComposition | null => {
    if (bodyCompositions.length === 0) return null;
    return bodyCompositions[0]; // Most recent entry
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

  const formatPercentage = (value: string | null) => {
    return value ? `${value}%` : 'N/A';
  };

  const formatMass = (value: string | null) => {
    return value ? `${value} kg` : 'N/A';
  };

  const getCompositionIcon = (metricType: string) => {
    switch (metricType) {
      case 'bodyFat':
        return <MonitorWeightIcon fontSize="small" />;
      case 'muscleMass':
        return <FitnessCenterIcon fontSize="small" />;
      case 'boneMass':
        return <SpaIcon fontSize="small" />;
      case 'waterPercentage':
        return <WaterDropIcon fontSize="small" />;
      default:
        return <FitnessCenterIcon fontSize="small" />;
    }
  };

  const getBodyFatColor = (percentage: string | null) => {
    if (!percentage) return 'default';
    const value = parseFloat(percentage);
    if (value < 10) return 'error'; // Too low
    if (value < 20) return 'success'; // Good
    if (value < 30) return 'warning'; // Moderate
    return 'error'; // Too high
  };

  const getWaterColor = (percentage: string | null) => {
    if (!percentage) return 'default';
    const value = parseFloat(percentage);
    if (value < 50) return 'error'; // Too low
    if (value < 60) return 'warning'; // Moderate
    if (value < 70) return 'success'; // Good
    return 'error'; // Too high
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to access body composition tracking features
      </Alert>
    );
  }

  const currentComposition = getCurrentComposition();

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
          Add Composition
        </Button>
      </Box>

      {/* Spacer */}
      <Box sx={{ height: 32 }} />

      <Box sx={{ p: 3 }}>
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

        {/* Current Composition Display */}
        {currentComposition && (
          <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🧬 Current Composition
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat
                  </Typography>
                  <Typography variant="h6" color={getBodyFatColor(currentComposition.bodyFatPercentage)}>
                    {formatPercentage(currentComposition.bodyFatPercentage)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Muscle Mass
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatMass(currentComposition.muscleMass)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bone Mass
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    {formatMass(currentComposition.boneMass)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Water %
                  </Typography>
                  <Typography variant="h6" color={getWaterColor(currentComposition.waterPercentage)}>
                    {formatPercentage(currentComposition.waterPercentage)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Last measured: {formatDate(currentComposition.measurementDate)}
            </Typography>
            {currentComposition.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontStyle: 'italic' }}>
                "{currentComposition.notes}"
              </Typography>
            )}
          </Box>
        )}

        {/* Quick Add/Edit Form */}
        <Collapse in={showAddForm || editingEntry !== null}>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {editingEntry ? 'Edit Body Composition' : 'Add New Body Composition'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Body Fat Percentage (%)"
                  type="number"
                  value={formData.bodyFatPercentage}
                  onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Muscle Mass (kg)"
                  type="number"
                  value={formData.muscleMass}
                  onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bone Mass (kg)"
                  type="number"
                  value={formData.boneMass}
                  onChange={(e) => setFormData({ ...formData, boneMass: e.target.value })}
                  inputProps={{ step: 0.1, min: 0 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Water Percentage (%)"
                  type="number"
                  value={formData.waterPercentage}
                  onChange={(e) => setFormData({ ...formData, waterPercentage: e.target.value })}
                  inputProps={{ step: 0.1, min: 0, max: 100 }}
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
                  placeholder="Any notes about today's composition measurement?"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                startIcon={editingEntry ? <SaveIcon /> : <AddIcon />}
                onClick={editingEntry ? handleUpdateComposition : handleAddComposition}
                disabled={loading}
              >
                {editingEntry ? 'Update' : 'Add Composition'}
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

        {/* Recent Compositions History */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="secondary" />
            Recent Compositions
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : bodyCompositions.length === 0 ? (
            <Alert severity="info">
              No body composition entries yet. Add your first composition to get started!
            </Alert>
          ) : (
            <List>
              {bodyCompositions.map((entry) => (
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
                          label={`Fat: ${formatPercentage(entry.bodyFatPercentage)}, Muscle: ${formatMass(entry.muscleMass)}`}
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
                              {getCompositionIcon('bodyFat')}
                              <Typography variant="caption">
                                Fat: {formatPercentage(entry.bodyFatPercentage)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getCompositionIcon('muscleMass')}
                              <Typography variant="caption">
                                Muscle: {formatMass(entry.muscleMass)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getCompositionIcon('boneMass')}
                              <Typography variant="caption">
                                Bone: {formatMass(entry.boneMass)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getCompositionIcon('waterPercentage')}
                              <Typography variant="caption">
                                Water: {formatPercentage(entry.waterPercentage)}
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
                          onClick={() => handleDeleteComposition(entry.id)}
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
                📊 Body Composition Analytics
              </Typography>
              <IconButton onClick={() => setShowAnalytics(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Basic Analytics Info */}
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
              
              {/* Body Fat Analytics - with null checks */}
              {analytics.progress?.bodyFat && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {getTrendIcon(analytics.progress.bodyFat.trend || 'stable')}
                    </Box>
                    <Typography variant="h6" color={getTrendColor(analytics.progress.bodyFat.trend || 'stable')}>
                      Body Fat {(analytics.progress.bodyFat.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.bodyFat.trend || 'stable').slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(analytics.progress.bodyFat.change || 0) > 0 ? '+' : ''}{(analytics.progress.bodyFat.change || 0).toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {/* Muscle Mass Analytics - with null checks */}
              {analytics.progress?.muscleMass && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {getTrendIcon(analytics.progress.muscleMass.trend || 'stable')}
                    </Box>
                    <Typography variant="h6" color={getTrendColor(analytics.progress.muscleMass.trend || 'stable')}>
                      Muscle {(analytics.progress.muscleMass.trend || 'stable').charAt(0).toUpperCase() + (analytics.progress.muscleMass.trend || 'stable').slice(1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(analytics.progress.muscleMass.change || 0) > 0 ? '+' : ''}{(analytics.progress.muscleMass.change || 0).toFixed(1)}kg
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Quick Stats - with null checks */}
            {analytics.progress && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Progress Summary
                </Typography>
                <Grid container spacing={2}>
                  {analytics.progress.bodyFat && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Body Fat:</strong> Started at {analytics.progress.bodyFat.start}%, now at {analytics.progress.bodyFat.current}% 
                        ({analytics.progress.bodyFat.change > 0 ? '+' : ''}{analytics.progress.bodyFat.change.toFixed(1)}% change)
                      </Typography>
                    </Grid>
                  )}
                  {analytics.progress.muscleMass && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Muscle Mass:</strong> Started at {analytics.progress.muscleMass.start}kg, now at {analytics.progress.muscleMass.current}kg 
                        ({analytics.progress.muscleMass.change > 0 ? '+' : ''}{analytics.progress.muscleMass.change.toFixed(1)}kg change)
                      </Typography>
                    </Grid>
                  )}
                  {analytics.progress.boneMass && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Bone Mass:</strong> Started at {analytics.progress.boneMass.start}kg, now at {analytics.progress.boneMass.current}kg 
                        ({analytics.progress.boneMass.change > 0 ? '+' : ''}{analytics.progress.boneMass.change.toFixed(1)}kg change)
                      </Typography>
                    </Grid>
                  )}
                  {analytics.progress.waterPercentage && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Water %:</strong> Started at {analytics.progress.waterPercentage.start}%, now at {analytics.progress.waterPercentage.current}% 
                        ({analytics.progress.waterPercentage.change > 0 ? '+' : ''}{analytics.progress.waterPercentage.change.toFixed(1)}% change)
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
            
            {/* Fallback for incomplete analytics data */}
            {(!analytics.progress || !analytics.progress.bodyFat) && (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Analytics data is being processed. Some metrics may not be available yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Continue logging body composition data to see detailed analytics.
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default BodyCompositionCard;
