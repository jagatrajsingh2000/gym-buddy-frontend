import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Button,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Flag,
  ExpandMore,
  ExpandLess,
  Add,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

interface BodyMetricsGoalsProps {
  onRefresh?: () => void;
  currentMeasurements?: BodyMeasurements | null;
}

const BodyMetricsGoals: React.FC<BodyMetricsGoalsProps> = ({ onRefresh, currentMeasurements }) => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<BodyMeasurements[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);

  // Fetch goals data
  const fetchGoals = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await bodyMeasurementsService.getBodyMetricsGoals(token);
      
      if (response.success && response.data) {
        setGoals(response.data.goals);
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

  // Toggle goal expansion
  const toggleGoalExpansion = (goalId: number) => {
    setExpandedGoal(expandedGoal === goalId ? null : goalId);
  };

  // Calculate progress for a specific measurement
  const calculateProgress = (current: string | number, goal: string | number): number => {
    if (!current || !goal) return 0;
    return bodyMetricsUtils.calculateGoalProgress(current, goal);
  };

  // Get goal status for a measurement
  const getGoalStatus = (current: string | number, goal: string | number) => {
    if (!current || !goal) return 'far';
    return bodyMetricsUtils.getGoalStatus(current, goal);
  };

  // Initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to view body metrics goals
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🎯 Body Metrics Goals
      </Typography>

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Track your progress towards your fitness targets
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {/* TODO: Open goal creation dialog */}}
          size="small"
        >
          Add New Goal
        </Button>
      </Box>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading goals...</Typography>
        </Box>
      )}

      {/* Goals List */}
      {goals.length > 0 ? (
        <Grid container spacing={3}>
          {goals.map((goal) => {
            const isExpanded = expandedGoal === goal.id;
            
            return (
              <Grid item xs={12} key={goal.id}>
                <Card sx={{ p: 3 }}>
                  {/* Goal Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Flag color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Goal #{goal.id}
                      </Typography>
                      <Chip
                        label={bodyMetricsUtils.formatGoalDate(goal.measurementDate)}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => toggleGoalExpansion(goal.id)}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Goal Notes */}
                  {goal.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {goal.notes}
                    </Typography>
                  )}

                  {/* Progress Overview */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {Object.entries(goal).map(([key, value]) => {
                      // Skip non-measurement fields
                      if (['id', 'measurementDate', 'notes'].includes(key)) return null;
                      
                      // Skip if goal value is null/undefined or not a valid number
                      if (!value || isNaN(parseFloat(String(value)))) return null;
                      
                      const currentValue = currentMeasurements?.[key as keyof BodyMeasurements];
                      const progress = currentValue && value ? calculateProgress(currentValue, value) : 0;
                      const status = currentValue && value ? getGoalStatus(currentValue, value) : 'far';
                      
                      return (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                {key}
                              </Typography>
                              <Chip
                                icon={<span>{bodyMetricsUtils.getGoalStatusIcon(status)}</span>}
                                label={status}
                                color={bodyMetricsUtils.getGoalStatusColor(status)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Target: {bodyMetricsUtils.formatMeasurement(value)}
                              </Typography>
                              {currentValue && (
                                <Typography variant="body2" color="text.secondary">
                                  Current: {bodyMetricsUtils.formatMeasurement(currentValue)}
                                </Typography>
                              )}
                            </Box>
                            
                            <LinearProgress
                              variant="determinate"
                              value={progress}
                              color={bodyMetricsUtils.getGoalStatusColor(status)}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                            
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              {progress.toFixed(1)}% complete
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Expanded Goal Details */}
                  <Collapse in={isExpanded}>
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      📊 Detailed Progress Analysis
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {Object.entries(goal).map(([key, value]) => {
                        if (['id', 'measurementDate', 'notes'].includes(key)) return null;
                        
                        const currentValue = currentMeasurements?.[key as keyof BodyMeasurements];
                        if (!currentValue || !value) return null;
                        
                        // Ensure both values are valid numbers
                        const currentNum = parseFloat(String(currentValue));
                        const goalNum = parseFloat(String(value));
                        
                        if (isNaN(currentNum) || isNaN(goalNum)) return null;
                        
                        const difference = currentNum - goalNum;
                        const isPositive = difference >= 0;
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={key}>
                            <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 600, mb: 1 }}>
                                {key} Progress
                              </Typography>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                {isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
                                <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
                                  {isPositive ? '+' : ''}{difference.toFixed(1)} cm
                                </Typography>
                              </Box>
                              
                              <Typography variant="caption" color="text.secondary">
                                {isPositive ? 'Ahead of target' : 'Behind target'}
                              </Typography>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Collapse>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* No Goals State */
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No goals set yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Set your first body metrics goal to start tracking your progress
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {/* TODO: Open goal creation dialog */}}
          >
            Create Your First Goal
          </Button>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'success.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🎯 Goals API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>GET /api/body-metrics/goals</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response Format:</strong> JSON with goals array containing target measurements
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Goal Data:</strong> target values, measurement date, and notes for each goal
        </Typography>
        <Typography variant="body2">
          <strong>Progress Tracking:</strong> Compare current measurements with goal targets
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsGoals;
