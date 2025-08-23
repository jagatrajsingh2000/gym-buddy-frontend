import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  FitnessCenter,
  EmojiEvents,
  Scale,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getDemoProgress, ProgressData } from '../../data/demoProgress';

const Progress: React.FC = () => {
  const { user, token } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (user && token) {
      if (token.startsWith('demo_token_')) {
        // Use demo data for demo users
        const demoData = getDemoProgress(user.email);
        setProgressData(demoData);
      } else {
        // TODO: Fetch real progress data from API
        setProgressData(null);
      }
    }
  }, [user, token]);

  if (!progressData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="text.secondary">
          Loading progress data...
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
              <TrendingUp sx={{ fontSize: { xs: 32, sm: 40 }, color: 'info.main', mb: 1 }} />
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
              <FitnessCenter sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {progressData.currentStats.muscleMass}%
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
                {progressData.currentStats.strengthScore}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strength Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Weekly Progress */}
      <Grid container spacing={1} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                Weekly Progress
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
                {progressData.weeklyProgress.map((week, index) => (
                  <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                    <Box
                      sx={{
                        height: `${(week.workouts / 7) * 100}%`,
                        bgcolor: 'primary.main',
                        borderRadius: '4px 4px 0 0',
                        minHeight: '20px'
                      }}
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {week.workouts} workouts
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 1, color: 'secondary.main' }} />
                Strength Gains
              </Typography>
              {progressData.strengthGains.map((gain, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{gain.exercise}</Typography>
                    <Typography variant="body2" color="success.main">
                      +{gain.improvement.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {gain.previousMax} → {gain.currentMax}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(gain.improvement, 100)}
                    color="success"
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Body Measurements */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FitnessCenter sx={{ mr: 1, color: 'info.main' }} />
            Body Measurements (cm)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.chest}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chest
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="secondary.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.waist}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Waist
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.hips}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hips
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="warning.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.leftArm}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Arms
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="info.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.leftThigh}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thighs
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="h6" color="error.main" sx={{ mb: 1 }}>
                  {progressData.currentStats.bodyMeasurements.leftCalf}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calves
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <EmojiEvents sx={{ mr: 1, color: 'warning.main' }} />
            Recent Achievements
          </Typography>
          <Grid container spacing={2}>
            {progressData.achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {achievement.icon}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {achievement.description}
                  </Typography>
                  <Chip
                    label={new Date(achievement.date).toLocaleDateString()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Progress;
