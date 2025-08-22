import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { Grid } from '../../components/common';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as FitnessCenterIcon,
  Speed as SpeedIcon,
  Scale as ScaleIcon,
  Height as HeightIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';

// Static progress data
const staticProgressData = {
  currentStats: {
    weight: 175,
    bodyFat: 15.2,
    muscleMass: 68.5,
    restingHeartRate: 62,
    maxHeartRate: 185,
    vo2Max: 42.5
  },
  goals: {
    targetWeight: 170,
    targetBodyFat: 12.0,
    targetMuscleMass: 72.0,
    targetRestingHeartRate: 58
  },
  weeklyProgress: [
    { week: "Week 1", weight: 178, bodyFat: 16.1, muscleMass: 67.2, workouts: 4 },
    { week: "Week 2", weight: 177, bodyFat: 15.8, muscleMass: 67.8, workouts: 5 },
    { week: "Week 3", weight: 176, bodyFat: 15.5, muscleMass: 68.1, workouts: 4 },
    { week: "Week 4", weight: 175, bodyFat: 15.2, muscleMass: 68.5, workouts: 6 }
  ],
  strengthProgress: [
    { exercise: "Bench Press", current: 185, previous: 175, improvement: "+10 lbs", date: "2024-12-20" },
    { exercise: "Squats", current: 225, previous: 215, improvement: "+10 lbs", date: "2024-12-18" },
    { exercise: "Deadlifts", current: 275, previous: 265, improvement: "+10 lbs", date: "2024-12-16" },
    { exercise: "Overhead Press", current: 125, previous: 120, improvement: "+5 lbs", date: "2024-12-14" }
  ],
  achievements: [
    { title: "First 5K Run", date: "2024-12-15", description: "Completed your first 5K in 28:45", icon: "🏃‍♂️" },
    { title: "100th Workout", date: "2024-12-10", description: "Reached 100 workouts milestone", icon: "💪" },
    { title: "Weight Goal", date: "2024-12-05", description: "Lost 10 pounds in 3 months", icon: "🎯" },
    { title: "Strength Gain", date: "2024-11-30", description: "Increased bench press by 20 lbs", icon: "🏋️‍♂️" }
  ]
};

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const calculateProgress = (current: number, target: number, isLowerBetter = false) => {
    if (isLowerBetter) {
      const total = Math.abs(target - current) + Math.abs(target - current);
      const progress = Math.abs(target - current) / total * 100;
      return Math.min(100, Math.max(0, progress));
    }
    const progress = (current / target) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "success";
    if (progress >= 60) return "warning";
    return "error";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Progress Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your fitness journey and celebrate your achievements
        </Typography>
      </Box>

      {/* Current Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScaleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {staticProgressData.currentStats.weight} lbs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Weight
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(
                  staticProgressData.currentStats.weight,
                  staticProgressData.goals.targetWeight,
                  true
                )}
                color={getProgressColor(calculateProgress(
                  staticProgressData.currentStats.weight,
                  staticProgressData.goals.targetWeight,
                  true
                )) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenterIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {staticProgressData.currentStats.muscleMass} lbs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Muscle Mass
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(
                  staticProgressData.currentStats.muscleMass,
                  staticProgressData.goals.targetMuscleMass
                )}
                color={getProgressColor(calculateProgress(
                  staticProgressData.currentStats.muscleMass,
                  staticProgressData.goals.targetMuscleMass
                )) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {staticProgressData.currentStats.bodyFat}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Body Fat
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(
                  staticProgressData.currentStats.bodyFat,
                  staticProgressData.goals.targetBodyFat,
                  true
                )}
                color={getProgressColor(calculateProgress(
                  staticProgressData.currentStats.bodyFat,
                  staticProgressData.goals.targetBodyFat,
                  true
                )) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <HeartIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" component="div" gutterBottom>
                {staticProgressData.currentStats.restingHeartRate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resting HR (bpm)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(
                  staticProgressData.currentStats.restingHeartRate,
                  staticProgressData.goals.targetRestingHeartRate,
                  true
                )}
                color={getProgressColor(calculateProgress(
                  staticProgressData.currentStats.restingHeartRate,
                  staticProgressData.goals.targetRestingHeartRate,
                  true
                )) as any}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different progress views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Weekly Progress" />
          <Tab label="Strength Gains" />
          <Tab label="Achievements" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Progress Overview
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Week</TableCell>
                    <TableCell align="right">Weight (lbs)</TableCell>
                    <TableCell align="right">Body Fat (%)</TableCell>
                    <TableCell align="right">Muscle Mass (lbs)</TableCell>
                    <TableCell align="right">Workouts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staticProgressData.weeklyProgress.map((week, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {week.week}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {week.weight}
                          {index > 0 && (
                            <Chip
                              label={week.weight < staticProgressData.weeklyProgress[index - 1].weight ? "↓" : "↑"}
                              size="small"
                              color={week.weight < staticProgressData.weeklyProgress[index - 1].weight ? "success" : "warning"}
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {week.bodyFat}
                          {index > 0 && (
                            <Chip
                              label={week.bodyFat < staticProgressData.weeklyProgress[index - 1].bodyFat ? "↓" : "↑"}
                              size="small"
                              color={week.bodyFat < staticProgressData.weeklyProgress[index - 1].bodyFat ? "success" : "warning"}
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {week.muscleMass}
                          {index > 0 && (
                            <Chip
                              label={week.muscleMass > staticProgressData.weeklyProgress[index - 1].muscleMass ? "↑" : "↓"}
                              size="small"
                              color={week.muscleMass > staticProgressData.weeklyProgress[index - 1].muscleMass ? "success" : "warning"}
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{week.workouts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Strength Progress
            </Typography>
            <Grid container spacing={2}>
              {staticProgressData.strengthProgress.map((exercise, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {exercise.exercise}
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {exercise.current} lbs
                      </Typography>
                      <Chip
                        label={exercise.improvement}
                        color="success"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        {formatDate(exercise.date)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Achievements
            </Typography>
            <List>
              {staticProgressData.achievements.map((achievement, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ fontSize: '1.5rem' }}>
                        {achievement.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={achievement.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {achievement.description}
                          </Typography>
                          <br />
                          {formatDate(achievement.date)}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < staticProgressData.achievements.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Goals Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Goals & Targets
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {staticProgressData.goals.targetWeight} lbs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target Weight
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="secondary">
                  {staticProgressData.goals.targetMuscleMass} lbs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target Muscle Mass
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="info">
                  {staticProgressData.goals.targetBodyFat}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target Body Fat
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                  {staticProgressData.goals.targetRestingHeartRate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target Resting HR
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Progress;
