import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { TrendingDown, TrendingUp, TrendingFlat } from '@mui/icons-material';

interface WeightTrackingAnalyticsProps {
  analytics: {
    totalEntries: number;
    dateRange: {
      start: string;
      end: string;
      days: number;
    };
    weight: {
      start: string;
      current: string;
      change: number;
      changePercentage: number;
      average: string;
      highest: string;
      lowest: string;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    bmi?: {
      start: number;
      current: number;
      change: number;
      changePercentage: number;
      average: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    };
    progress?: {
      weeklyChange: number;
      monthlyChange: number;
      goalProgress: number | null;
    };
  } | null;
}

const WeightTrackingAnalytics: React.FC<WeightTrackingAnalyticsProps> = ({ analytics }) => {
  // Add null check and fallback
  if (!analytics) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No analytics data available.
        </Typography>
      </Box>
    );
  }

  const formatWeight = (weight: string) => {
    return `${parseFloat(weight).toFixed(1)} kg`;
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)} kg`;
  };

  const formatPercentage = (percentage: number) => {
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="success" />;
      case 'decreasing':
        return <TrendingDown color="error" />;
      case 'stable':
        return <TrendingFlat color="info" />;
      default:
        return <TrendingFlat color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'success';
      case 'decreasing':
        return 'error';
      case 'stable':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Weight Tracking Analytics
      </Typography>
      
      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
            <Typography variant="h4" color="primary.main" fontWeight={600}>
              {analytics.weight?.current ? formatWeight(analytics.weight.current) : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Weight
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" color="success.main" fontWeight={600} sx={{ mr: 1 }}>
                {analytics.weight?.change !== undefined ? formatChange(analytics.weight.change) : 'N/A'}
              </Typography>
              {analytics.weight?.trend && (
                <Chip
                  icon={getTrendIcon(analytics.weight.trend)}
                  label={analytics.weight.trend}
                  color={getTrendColor(analytics.weight.trend) as any}
                  size="small"
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Weight Change
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
            <Typography variant="h4" color="info.main" fontWeight={600}>
              {analytics.bmi?.current ? analytics.bmi.current.toFixed(1) : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current BMI
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Typography variant="h4" color="warning.main" fontWeight={600}>
              {analytics.totalEntries || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Entries
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={analytics.bmi ? 6 : 12}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Weight Statistics
              </Typography>
              {analytics.weight?.trend && (
                <Chip
                  icon={getTrendIcon(analytics.weight.trend)}
                  label={analytics.weight.trend}
                  color={getTrendColor(analytics.weight.trend) as any}
                  size="small"
                />
              )}
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Start:</strong> {analytics.weight?.start ? formatWeight(analytics.weight.start) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Current:</strong> {analytics.weight?.current ? formatWeight(analytics.weight.current) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Average:</strong> {analytics.weight?.average ? formatWeight(analytics.weight.average) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Highest:</strong> {analytics.weight?.highest ? formatWeight(analytics.weight.highest) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Lowest:</strong> {analytics.weight?.lowest ? formatWeight(analytics.weight.lowest) : 'N/A'}
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight={600}
                color={analytics.weight?.change && analytics.weight.change > 0 ? 'success.main' : analytics.weight?.change && analytics.weight.change < 0 ? 'error.main' : 'text.primary'}
              >
                <strong>Change:</strong> {analytics.weight?.changePercentage !== undefined ? formatPercentage(analytics.weight.changePercentage) : 'N/A'}
              </Typography>
            </Box>

            {/* Progress Bar */}
            {analytics.weight?.change !== undefined && (
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: 'grey.200', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: analytics.weight.change > 0 ? 'success.main' : analytics.weight.change < 0 ? 'error.main' : 'info.main',
                  opacity: 0.3
                }} />
              </Box>
            )}
          </Paper>
        </Grid>
        {analytics.bmi && (
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  BMI Statistics
                </Typography>
                <Chip
                  icon={getTrendIcon(analytics.bmi.trend)}
                  label={analytics.bmi.trend}
                  color={getTrendColor(analytics.bmi.trend) as any}
                  size="small"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Start:</strong> {analytics.bmi.start.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Current:</strong> {analytics.bmi.current.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Average:</strong> {analytics.bmi.average.toFixed(1)}
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight={600}
                  color={analytics.bmi.change > 0 ? 'success.main' : analytics.bmi.change < 0 ? 'error.main' : 'text.primary'}
                >
                  <strong>Change:</strong> {analytics.bmi.change.toFixed(1)} ({formatPercentage(analytics.bmi.changePercentage)})
                </Typography>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ 
                width: '100%', 
                height: 8, 
                bgcolor: 'grey.200', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  bgcolor: analytics.bmi.change > 0 ? 'success.main' : analytics.bmi.change < 0 ? 'error.main' : 'info.main',
                  opacity: 0.3
                }} />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Progress Summary */}
      {analytics.progress && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Progress Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main">
                  {analytics.progress.weeklyChange !== undefined ? formatChange(analytics.progress.weeklyChange) : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Weekly Change
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {analytics.progress.monthlyChange !== undefined ? formatChange(analytics.progress.monthlyChange) : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Change
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="info.main">
                  {analytics.progress.goalProgress ? `${analytics.progress.goalProgress.toFixed(1)}%` : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Goal Progress
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default WeightTrackingAnalytics;
