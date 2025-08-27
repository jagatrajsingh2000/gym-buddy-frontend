import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  FitnessCenter,
  EmojiEvents,
  Scale,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';


interface ProgressData {
  currentStats: {
    weight: number;
    height: number;
    bmi: number;
    bodyFat: number;
    muscleMass: number;
    strength: number;
  };
  goals: {
    targetWeight: number;
    targetBodyFat: number;
    targetMuscleMass: number;
    targetStrength: number;
  };
  history: {
    date: string;
    weight: number;
    bodyFat: number;
    muscleMass: number;
    strength: number;
  }[];
}

const Progress: React.FC = () => {
  const { user, token } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        // TODO: Replace with real API call
        // const response = await progressService.getProgress(token);
        // if (response.success) {
        //   setProgressData(response.data);
        // }
        
        // For now, show loading state
        setProgressData(null);
      } catch (err) {
        setError('Failed to fetch progress data');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!progressData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="text.secondary">
          No progress data available yet. Start tracking your fitness journey!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0, sm: 0.5, md: 1 } }}>
      <Typography variant="h4" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 600 }}>
        Progress Tracking 📊
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 } }}>
        Monitor your fitness journey and celebrate your achievements
      </Typography>

      {/* Current Stats Cards */}
      <Grid container spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Scale sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.weight} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weight
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.height} cm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Height
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <FitnessCenter sx={{ fontSize: { xs: 32, sm: 40 }, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.bmi}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                BMI
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <EmojiEvents sx={{ fontSize: { xs: 32, sm: 40 }, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.bodyFat}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Body Fat
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.muscleMass} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Muscle Mass
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Favorite sx={{ fontSize: { xs: 32, sm: 40 }, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.strength}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strength Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Charts Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Progress Over Time
        </Typography>
        
        {/* Weight Progress Chart */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Weight Progress
          </Typography>
          <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
            {progressData.history.slice(-7).map((entry, index) => (
              <Box key={entry.date} sx={{ flex: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    height: `${(entry.weight / Math.max(...progressData.history.map(h => h.weight))) * 150}px`,
                    backgroundColor: 'primary.main',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '20px'
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {new Date(entry.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {entry.weight} kg
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Goals Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Goals
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                {progressData.goals.targetWeight} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target Weight
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" color="secondary.main" sx={{ mb: 1 }}>
                {progressData.goals.targetBodyFat}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target Body Fat
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                {progressData.goals.targetMuscleMass} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target Muscle Mass
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" color="warning.main" sx={{ mb: 1 }}>
                {progressData.goals.targetStrength}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Target Strength
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Progress;
