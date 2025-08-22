import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Grid } from '../../components/common';
import {
  FitnessCenter,
  TrendingUp,
  CalendarToday,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { workoutService, Workout } from '../../services/workoutService';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await workoutService.getUserWorkouts(token, {
          limit: 10,
          page: 1
        });
        
        if (response.success) {
          setWorkouts(response.data || []);
        } else {
          setError(response.message || 'Failed to load workouts');
        }
      } catch (err) {
        setError('Failed to load workouts. Please try again.');
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [token]);

  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const upcomingWorkouts = workouts.filter(w => w.status === 'planned');
  const inProgressWorkouts = workouts.filter(w => w.status === 'in_progress');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Welcome back, {user?.firstName}! 💪
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {completedWorkouts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Workouts Completed
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {workouts.length > 0 ? Math.ceil(workouts.length / 7) : 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Weekly Average
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <CalendarToday sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {upcomingWorkouts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming Workouts
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {inProgressWorkouts.length > 0 ? 'Active' : 'Ready'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Status
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Workouts */}
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
                Recent Workouts
              </Typography>
              {completedWorkouts.length > 0 ? (
                <List>
                  {completedWorkouts.slice(0, 3).map((workout) => (
                    <ListItem key={workout.id} divider>
                      <ListItemIcon>
                        <FitnessCenter color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={workout.name}
                        secondary={`${workout.duration || 0} min • ${new Date(workout.date).toLocaleDateString()}`}
                      />
                      <Chip 
                        label={workout.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No completed workouts yet. Start your first workout!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 1, color: 'secondary.main' }} />
                Upcoming Workouts
              </Typography>
              {upcomingWorkouts.length > 0 ? (
                <List>
                  {upcomingWorkouts.slice(0, 3).map((workout) => (
                    <ListItem key={workout.id} divider>
                      <ListItemIcon>
                        <FitnessCenter color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={workout.name}
                        secondary={`${new Date(workout.date).toLocaleDateString()}`}
                      />
                      <Chip 
                        label={workout.type} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No upcoming workouts. Plan your next session!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid>
            <Chip 
              label="Start Workout" 
              color="primary" 
              variant="filled"
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
          <Grid>
            <Chip 
              label="View Progress" 
              color="secondary" 
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
          <Grid>
            <Chip 
              label="Schedule Session" 
              color="secondary" 
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
