import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Container,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag,
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { bodyMetricsService, BodyMetrics } from '../../services/bodyMetricsService';

const Goals: React.FC = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<BodyMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<BodyMetrics | null>(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await bodyMetricsService.getGoals(token);
      
      if (response.success && response.data) {
        setGoals(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch goals');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openAddDialog = () => {
    setEditingGoal(null);
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (goal: BodyMetrics) => {
    setEditingGoal(goal);
    setFormData({
      chest: goal.chest?.toString() || '',
      waist: goal.waist?.toString() || '',
      hips: goal.hips?.toString() || '',
      biceps: goal.biceps?.toString() || '',
      forearms: goal.forearms?.toString() || '',
      thighs: goal.thighs?.toString() || '',
      calves: goal.calves?.toString() || '',
      neck: goal.neck?.toString() || '',
      measurementDate: goal.measurementDate || new Date().toISOString().split('T')[0],
      notes: goal.notes || ''
    });
    setShowAddDialog(true);
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingGoal(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const goalData = {
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
      };

      let response;
      if (editingGoal) {
        response = await bodyMetricsService.updateGoal(token, editingGoal.id, goalData);
      } else {
        response = await bodyMetricsService.createGoal(token, goalData);
      }
      
      if (response.success) {
        setSuccess(editingGoal ? 'Goal updated successfully!' : 'Goal created successfully!');
        closeDialog();
        fetchGoals();
      } else {
        setError(response.message || 'Failed to save goal');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await bodyMetricsService.deleteGoal(token, goalId);
      
      if (response.success) {
        setSuccess('Goal deleted successfully!');
        fetchGoals();
      } else {
        setError(response.message || 'Failed to delete goal');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting goal:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="success" />;
      case 'decreasing':
        return <TrendingDown color="error" />;
      default:
        return <TrendingFlat color="action" />;
    }
  };

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view goals
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          🎯 Fitness Goals
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Set, track, and achieve your fitness targets
        </Typography>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 4 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Add Goal Button */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          disabled={loading}
          sx={{ px: 4, py: 1.5 }}
        >
          Create New Goal
        </Button>
      </Box>

      {/* Goals Display */}
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading goals...
          </Typography>
        </Box>
      ) : goals.length > 0 ? (
        <Grid container spacing={3}>
          {goals.map((goal) => (
            <Grid item xs={12} md={6} key={goal.id}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: '100%'
              }}>
                {/* Goal Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Flag color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Fitness Goal
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => openEditDialog(goal)}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGoal(goal.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Goal Date */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={new Date(goal.measurementDate).toLocaleDateString()}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Goal Notes */}
                {goal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{goal.notes}"
                  </Typography>
                )}

                {/* Goal Measurements */}
                <Grid container spacing={2}>
                  {Object.entries(goal).map(([key, value]) => {
                    // Skip non-measurement fields and timestamp fields
                    if (['id', 'measurementDate', 'notes', 'created_at', 'updated_at'].includes(key)) return null;
                    
                    // Skip if goal value is null/undefined or not a valid number
                    if (!value || isNaN(parseFloat(String(value)))) return null;
                    
                    return (
                      <Grid item xs={6} key={key}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid', 
                          borderColor: 'divider', 
                          borderRadius: 1,
                          textAlign: 'center'
                        }}>
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 600, mb: 1 }}>
                            {key}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {parseFloat(String(value)).toFixed(1)}cm
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* No Goals State */
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No goals set yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Set your first fitness goal to start tracking your progress
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
          >
            Create Your First Goal
          </Button>
        </Card>
      )}

      {/* Add/Edit Goal Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                type="number"
                value={formData.chest}
                onChange={(e) => handleInputChange('chest', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                type="number"
                value={formData.waist}
                onChange={(e) => handleInputChange('waist', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                type="number"
                value={formData.hips}
                onChange={(e) => handleInputChange('hips', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Biceps (cm)"
                type="number"
                value={formData.biceps}
                onChange={(e) => handleInputChange('biceps', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Forearms (cm)"
                type="number"
                value={formData.forearms}
                onChange={(e) => handleInputChange('forearms', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thighs (cm)"
                type="number"
                value={formData.thighs}
                onChange={(e) => handleInputChange('thighs', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calves (cm)"
                type="number"
                value={formData.calves}
                onChange={(e) => handleInputChange('calves', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Neck (cm)"
                type="number"
                value={formData.neck}
                onChange={(e) => handleInputChange('neck', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Measurement Date"
                type="date"
                value={formData.measurementDate}
                onChange={(e) => handleInputChange('measurementDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                size="small"
                placeholder="Add notes about your goal..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Create Goal')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Goals;
