import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { TrendingDown, TrendingUp, TrendingFlat } from '@mui/icons-material';

interface BodyCompositionAnalyticsProps {
  analytics: {
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
  } | null;
}

const BodyCompositionAnalytics: React.FC<BodyCompositionAnalyticsProps> = ({ analytics }) => {
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

  const formatValue = (value: string, unit: string) => {
    return `${parseFloat(value).toFixed(1)}${unit}`;
  };

  const formatChange = (change: number, unit: string) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Body Composition Analytics
      </Typography>
      
      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
            <Typography variant="h4" color="primary.main" fontWeight={600}>
              {analytics.totalMeasurements}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Measurements
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
            <Typography variant="h6" color="info.main" fontWeight={600}>
              {new Date(analytics.dateRange.start).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
            <Typography variant="h6" color="success.main" fontWeight={600}>
              {new Date(analytics.dateRange.end).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              End Date
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
            <Typography variant="h6" color="warning.main" fontWeight={600}>
              {Math.ceil((new Date(analytics.dateRange.end).getTime() - new Date(analytics.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Period
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Composition Details */}
      <Typography variant="h6" gutterBottom>
        Composition Progress
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(analytics.progress).map(([composition, data]: [string, any]) => {
          const getCompositionLabel = (key: string) => {
            switch (key) {
              case 'bodyFat': return 'Body Fat %';
              case 'muscleMass': return 'Muscle Mass (kg)';
              case 'boneMass': return 'Bone Mass (kg)';
              case 'waterPercentage': return 'Water %';
              default: return key;
            }
          };

          const getCompositionUnit = (key: string) => {
            switch (key) {
              case 'bodyFat': return '%';
              case 'muscleMass': return ' kg';
              case 'boneMass': return ' kg';
              case 'waterPercentage': return '%';
              default: return '';
            }
          };

          return (
            <Grid item xs={12} sm={6} md={3} key={composition}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {getCompositionLabel(composition)}
                  </Typography>
                  <Chip
                    icon={getTrendIcon(data.trend)}
                    label={data.trend}
                    color={getTrendColor(data.trend) as any}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Start: {formatValue(data.start, getCompositionUnit(composition))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current: {formatValue(data.current, getCompositionUnit(composition))}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={600}
                    color={data.change > 0 ? 'success.main' : data.change < 0 ? 'error.main' : 'text.primary'}
                  >
                    Change: {formatChange(data.change, getCompositionUnit(composition))}
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
                    bgcolor: data.change > 0 ? 'success.main' : data.change < 0 ? 'error.main' : 'info.main',
                    opacity: 0.3
                  }} />
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default BodyCompositionAnalytics;
