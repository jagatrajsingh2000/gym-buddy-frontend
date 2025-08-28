import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

/**
 * Test Component for Body Metrics Goals API Integration
 * This demonstrates how to use the new /api/body-metrics/goals endpoint
 */
const BodyMetricsGoalsTest: React.FC = () => {
  const { token } = useAuth();
  const [goals, setGoals] = useState<BodyMeasurements[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch goals data
  const fetchGoals = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.getBodyMetricsGoals(token);
      
      if (response.success) {
        if (response.data?.goals && response.data.goals.length > 0) {
          setGoals(response.data.goals);
          setSuccess(`Successfully loaded ${response.data.goals.length} goal(s)!`);
        } else {
          setGoals([]);
          setSuccess('No goals found. You can create your first goal to get started.');
        }
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

  // Test the API on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Goals API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Goals API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>/api/body-metrics/goals</code> endpoint for retrieving user fitness goals
      </Typography>

      {/* Test Controls */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 Test Controls
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={fetchGoals}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : '🔄 Test Goals API'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              setGoals([]);
              setSuccess(null);
              setError(null);
            }}
          >
            🗑️ Clear Results
          </Button>
        </Box>
      </Card>

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

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Testing goals API...</Typography>
        </Box>
      )}

      {/* Goals Summary */}
      {goals.length > 0 && (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'success.50' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            🎯 Goals Summary
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {goals.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Goals
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {goals[0]?.measurementDate ? bodyMetricsUtils.formatGoalDate(goals[0].measurementDate) : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Next Goal Date
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {goals.filter(g => g.notes).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Goals with Notes
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {Object.keys(goals[0] || {}).filter(key => !['id', 'measurementDate', 'notes'].includes(key)).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Measurement Types
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Goals Table */}
      {goals.length > 0 && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📊 Goals Data Table
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Goal ID</strong></TableCell>
                  <TableCell><strong>Target Date</strong></TableCell>
                  <TableCell><strong>Chest (cm)</strong></TableCell>
                  <TableCell><strong>Waist (cm)</strong></TableCell>
                  <TableCell><strong>Hips (cm)</strong></TableCell>
                  <TableCell><strong>Biceps (cm)</strong></TableCell>
                  <TableCell><strong>Forearms (cm)</strong></TableCell>
                  <TableCell><strong>Thighs (cm)</strong></TableCell>
                  <TableCell><strong>Calves (cm)</strong></TableCell>
                  <TableCell><strong>Neck (cm)</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell>
                      <Chip label={`#${goal.id}`} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {bodyMetricsUtils.formatMeasurementDate(goal.measurementDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bodyMetricsUtils.formatGoalDate(goal.measurementDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>{goal.chest}</TableCell>
                    <TableCell>{goal.waist}</TableCell>
                    <TableCell>{goal.hips}</TableCell>
                    <TableCell>{goal.biceps}</TableCell>
                    <TableCell>{goal.forearms}</TableCell>
                    <TableCell>{goal.thighs}</TableCell>
                    <TableCell>{goal.calves}</TableCell>
                    <TableCell>{goal.neck}</TableCell>
                    <TableCell>
                      {goal.notes ? (
                        <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {goal.notes}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No notes
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* No Goals State */}
      {!loading && goals.length === 0 && !error && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No goals found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This user hasn't set any body metrics goals yet.
          </Typography>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'warning.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Goals API Endpoint Information
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
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Progress Tracking:</strong> Compare current measurements with goal targets
        </Typography>
        <Typography variant="body2">
          <strong>Use Cases:</strong> Goal setting, progress tracking, motivation displays
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsGoalsTest;
