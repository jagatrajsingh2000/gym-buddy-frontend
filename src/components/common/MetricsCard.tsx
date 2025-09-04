import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  IconButton, 
  Alert, 
  CircularProgress, 
  Grid, 
  Collapse, 
  TextField, 
  Paper, 
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Analytics as AnalyticsIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { bodyMetricsService, bodyCompositionService, bodyMeasurementsService } from '../../services/bodyMetricsService';
import { BodyMetricsAnalytics, BodyCompositionAnalytics, WeightTrackingAnalytics } from './analytics';

interface MetricsCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradientColors: {
    from: string;
    to: string;
  };
  type: 'body-metrics' | 'body-composition' | 'weight-tracking';
}

// Body Metrics Interface
interface BodyMetrics {
  id: number;
  chest?: string | null;
  waist?: string | null;
  hips?: string | null;
  biceps?: string | null;
  forearms?: string | null;
  thighs?: string | null;
  calves?: string | null;
  neck?: string | null;
  measurementDate: string;
  notes?: string | null;
}

// Body Composition Interface
interface BodyComposition {
  id: number;
  bodyFatPercentage: string | null;
  muscleMass: string | null;
  boneMass: string | null;
  waterPercentage: string | null;
  measurementDate: string;
  notes: string | null;
}

// Weight Tracking Interface
interface WeightEntry {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
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

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  subtitle,
  icon,
  gradientColors,
  type
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Data states
  const [bodyMetrics, setBodyMetrics] = useState<BodyMetrics[]>([]);
  const [bodyCompositions, setBodyCompositions] = useState<BodyComposition[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [editingEntry, setEditingEntry] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, type]);

  const fetchData = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      switch (type) {
        case 'body-metrics':
          const metricsResponse = await bodyMetricsService.getCurrentMetrics(token);
          const metricsHistoryResponse = await bodyMetricsService.getMetricsHistory(token, { page: 1, limit: 10 });
          
          if (metricsResponse.success) {
            setBodyMetrics(metricsResponse.data ? [metricsResponse.data] : []);
          }
          if (metricsHistoryResponse.success && metricsHistoryResponse.data) {
            const historyData = metricsHistoryResponse.data.metrics || metricsHistoryResponse.data.items || [];
            setBodyMetrics(prev => [...prev, ...historyData]);
          }
          break;
          
        case 'body-composition':
          const compositionResponse = await bodyCompositionService.getCurrentComposition(token);
          const compositionHistoryResponse = await bodyCompositionService.getCompositionHistory(token, { page: 1, limit: 10 });
          
          if (compositionResponse.success && compositionResponse.data) {
            setBodyCompositions(compositionResponse.data.composition ? [compositionResponse.data.composition] : []);
          }
          if (compositionHistoryResponse.success && compositionHistoryResponse.data) {
            const historyData = compositionHistoryResponse.data.compositions || [];
            setBodyCompositions(prev => [...prev, ...historyData]);
          }
          break;
          
        case 'weight-tracking':
          const weightResponse = await bodyMetricsService.getWeightHistory(token, { page: 1, limit: 10 });
          if (weightResponse.success && weightResponse.data) {
            const weightData = weightResponse.data.weightHistory || weightResponse.data.items || [];
            setWeightEntries(weightData);
          }
          break;
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setShowAddForm(true);
    setFormData({});
    setEditingEntry(null);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setFormData(entry);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    
    try {
      let response;
      switch (type) {
        case 'body-metrics':
          response = await bodyMetricsService.deleteMetrics(token, id);
          break;
        case 'body-composition':
          response = await bodyCompositionService.deleteComposition(token, id);
          break;
        case 'weight-tracking':
          response = await bodyMetricsService.deleteWeightEntry(token, id);
          break;
      }
      
      if (response?.success) {
        setSuccess('Entry deleted successfully');
        fetchData();
      } else {
        setError('Failed to delete entry');
      }
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  const handleSave = async () => {
    if (!token) return;
    
    try {
      let response;
      switch (type) {
        case 'body-metrics':
          if (editingEntry) {
            response = await bodyMetricsService.updateMetrics(token, editingEntry.id, formData);
          } else {
            response = await bodyMetricsService.createMetrics(token, formData);
          }
          break;
        case 'body-composition':
          if (editingEntry) {
            response = await bodyCompositionService.updateComposition(token, editingEntry.id, formData);
          } else {
            response = await bodyCompositionService.logComposition(token, formData);
          }
          break;
        case 'weight-tracking':
          if (editingEntry) {
            response = await bodyMetricsService.updateWeightEntry(token, editingEntry.id, formData);
          } else {
            response = await bodyMetricsService.logWeight(token, formData);
          }
          break;
      }
      
      if (response?.success) {
        setSuccess(editingEntry ? 'Entry updated successfully' : 'Entry created successfully');
        setShowAddForm(false);
        setFormData({});
        setEditingEntry(null);
        fetchData();
      } else {
        setError('Failed to save entry');
      }
    } catch (err) {
      setError('Failed to save entry');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({});
    setEditingEntry(null);
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    
    setAnalyticsLoading(true);
    try {
      let response;
      switch (type) {
        case 'body-metrics':
          response = await bodyMeasurementsService.getBodyMetricsAnalytics(token);
          break;
        case 'body-composition':
          response = await bodyCompositionService.getCompositionAnalytics(token);
          break;
        case 'weight-tracking':
          response = await bodyMetricsService.getWeightAnalytics(token, { period: 30 });
          break;
      }
      
      if (response?.success) {
        // Handle different data structures from different APIs
        if (type === 'body-metrics' && response.data?.analytics) {
          setAnalytics(response.data.analytics);
        } else if (type === 'weight-tracking' && response.data?.analytics) {
          setAnalytics(response.data.analytics);
        } else if (type === 'body-composition' && response.data?.analytics) {
          setAnalytics(response.data.analytics);
        } else {
          setAnalytics(response.data);
        }
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleAnalyticsToggle = () => {
    if (!showAnalytics && !analytics) {
      fetchAnalytics();
    }
    setShowAnalytics(!showAnalytics);
  };

  const getRecentData = () => {
    switch (type) {
      case 'body-metrics':
        return bodyMetrics.slice(0, 3);
      case 'body-composition':
        return bodyCompositions.slice(0, 3);
      case 'weight-tracking':
        return weightEntries.slice(0, 3);
      default:
        return [];
    }
  };

  const renderForm = () => {
    if (!showAddForm) return null;

    return (
      <Collapse in={showAddForm}>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingEntry ? 'Edit Entry' : 'Add New Entry'}
          </Typography>
          
          <Grid container spacing={2}>
            {type === 'body-metrics' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Chest (cm)"
                    value={formData.chest || ''}
                    onChange={(e) => setFormData({...formData, chest: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Waist (cm)"
                    value={formData.waist || ''}
                    onChange={(e) => setFormData({...formData, waist: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hips (cm)"
                    value={formData.hips || ''}
                    onChange={(e) => setFormData({...formData, hips: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Biceps (cm)"
                    value={formData.biceps || ''}
                    onChange={(e) => setFormData({...formData, biceps: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Forearms (cm)"
                    value={formData.forearms || ''}
                    onChange={(e) => setFormData({...formData, forearms: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Thighs (cm)"
                    value={formData.thighs || ''}
                    onChange={(e) => setFormData({...formData, thighs: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Calves (cm)"
                    value={formData.calves || ''}
                    onChange={(e) => setFormData({...formData, calves: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Neck (cm)"
                    value={formData.neck || ''}
                    onChange={(e) => setFormData({...formData, neck: e.target.value})}
                  />
                </Grid>
              </>
            )}
            
            {type === 'body-composition' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Body Fat %"
                    value={formData.bodyFatPercentage || ''}
                    onChange={(e) => setFormData({...formData, bodyFatPercentage: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Muscle Mass (kg)"
                    value={formData.muscleMass || ''}
                    onChange={(e) => setFormData({...formData, muscleMass: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bone Mass (kg)"
                    value={formData.boneMass || ''}
                    onChange={(e) => setFormData({...formData, boneMass: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Water %"
                    value={formData.waterPercentage || ''}
                    onChange={(e) => setFormData({...formData, waterPercentage: e.target.value})}
                  />
                </Grid>
              </>
            )}
            
            {type === 'weight-tracking' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={formData.weightUnit || 'kg'}
                    onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="lbs">lbs</MenuItem>
                  </TextField>
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              {editingEntry ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Collapse>
    );
  };

  const renderDataList = () => {
    const data = getRecentData();
    if (data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available. Add your first entry!
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {data.map((entry, index) => (
          <Paper key={entry.id || index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {new Date(entry.measurementDate || (entry as any).created_at).toLocaleDateString()}
                </Typography>
                {type === 'body-metrics' && (
                  <Typography variant="body2" color="text.secondary">
                    Chest: {(entry as BodyMetrics).chest || 'N/A'}cm | Waist: {(entry as BodyMetrics).waist || 'N/A'}cm | Hips: {(entry as BodyMetrics).hips || 'N/A'}cm
                  </Typography>
                )}
                {type === 'body-composition' && (
                  <Typography variant="body2" color="text.secondary">
                    Body Fat: {(entry as BodyComposition).bodyFatPercentage || 'N/A'}% | Muscle: {(entry as BodyComposition).muscleMass || 'N/A'}kg
                  </Typography>
                )}
                {type === 'weight-tracking' && (
                  <Typography variant="body2" color="text.secondary">
                    Weight: {(entry as WeightEntry).weight || 'N/A'} {(entry as WeightEntry).weightUnit || 'kg'}
                    {(entry as WeightEntry).bmi && ` | BMI: ${(entry as WeightEntry).bmi}`}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleEdit(entry)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(entry.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    switch (type) {
      case 'body-metrics':
        return <BodyMetricsAnalytics analytics={analytics} />;
      case 'body-composition':
        return <BodyCompositionAnalytics analytics={analytics} />;
      case 'weight-tracking':
        return <WeightTrackingAnalytics analytics={analytics} />;
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Analytics not available for this card type.
          </Typography>
        );
    }
  };

  return (
    <Card sx={{ 
      mb: 4, 
      borderRadius: 3, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        background: `linear-gradient(135deg, ${gradientColors.from} 0%, ${gradientColors.to} 100%)`,
        p: 3,
        color: 'white',
        marginBottom: '10px'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {icon} {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
          {subtitle}
        </Typography>
      </Box>
      
      <Box sx={{ p: 3 }}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Recent Data
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ mr: 1 }}
            >
              Add Entry
            </Button>
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={handleAnalyticsToggle}
              disabled={analyticsLoading}
            >
              {analyticsLoading ? 'Loading...' : 'Analytics'}
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderDataList()
        )}

        {renderForm()}

        <Collapse in={showAnalytics}>
          <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📊 Analytics - {title}
            </Typography>
            
            {analyticsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading analytics...
                </Typography>
              </Box>
            ) : analytics ? (
              renderAnalytics()
            ) : (
              <Typography variant="body2" color="text.secondary">
                No analytics data available. Add some entries to see your progress!
              </Typography>
            )}
          </Paper>
        </Collapse>
      </Box>
    </Card>
  );
};

export default MetricsCard;
