import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Analytics,
  CalendarToday,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMetricsAnalytics } from '../services';

interface BodyMetricsAnalyticsComponentProps {
  onRefresh?: () => void;
}

const BodyMetricsAnalyticsComponent: React.FC<BodyMetricsAnalyticsComponentProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<BodyMetricsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [dateRange, setDateRange] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const params: any = {};

      // Add date filters if set
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await bodyMeasurementsService.getBodyMetricsAnalytics(token, params);
      
      if (response.success && response.data) {
        setAnalytics(response.data.analytics);
      } else {
        setError(response.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (event: any) => {
    const range = event.target.value;
    setDateRange(range);
    
    if (range === 'custom') {
      // Keep custom dates
    } else if (range !== 'all') {
      const { startDate: start, endDate: end } = bodyMetricsUtils.getDateRange(parseInt(range));
      setStartDate(start);
      setEndDate(end);
      fetchAnalytics();
    } else {
      setStartDate('');
      setEndDate('');
      fetchAnalytics();
    }
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    fetchAnalytics();
  };

  // Initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to view body metrics analytics
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        📊 Body Metrics Analytics
      </Typography>

      {/* Filters Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Analytics sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Analytics Filters</Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={handleDateRangeChange}
                label="Date Range"
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="60">Last 60 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="180">Last 6 months</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              fullWidth
              disabled={dateRange !== 'custom'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              fullWidth
              disabled={dateRange !== 'custom'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => applyCustomDateFilter()}
                disabled={dateRange !== 'custom'}
                size="small"
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setDateRange('30');
                  setStartDate('');
                  setEndDate('');
                  fetchAnalytics();
                }}
                size="small"
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

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
          <Typography sx={{ ml: 2 }}>Loading analytics...</Typography>
        </Box>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📈 Progress Summary
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {analytics.totalMeasurements}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Measurements
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {bodyMetricsUtils.formatMeasurementDate(analytics.dateRange.start)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {bodyMetricsUtils.formatMeasurementDate(analytics.dateRange.end)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchAnalytics}
                  disabled={loading}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Progress Cards */}
      {analytics && (
        <Grid container spacing={3}>
          {Object.entries(analytics.progress).map(([measurementType, progress]) => {
            // Skip if progress data is null or undefined
            if (!progress) {
              return null;
            }
            
            return (
              <Grid item xs={12} sm={6} md={4} key={measurementType}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                      {measurementType}
                    </Typography>
                    <Chip
                      icon={
                        progress.trend === 'increasing' ? <TrendingUp /> :
                        progress.trend === 'decreasing' ? <TrendingDown /> :
                        <Remove />
                      }
                      label={progress.trend || 'stable'}
                      color={bodyMetricsUtils.getTrendColor(progress.trend || 'stable')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                {/* Progress Values */}
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Start
                      </Typography>
                                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {bodyMetricsUtils.formatMeasurement(progress.start || '0')}
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">
                        Current
                      </Typography>
                                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {bodyMetricsUtils.formatMeasurement(progress.current || '0')}
                        </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Change Display */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" 
                    color={bodyMetricsUtils.getTrendColor(progress.trend || 'stable')}
                    sx={{ 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {bodyMetricsUtils.getTrendIcon(progress.trend || 'stable')}
                    {bodyMetricsUtils.formatChange(progress.change || 0)}
                  </Typography>
                  
                  {bodyMetricsUtils.isSignificantChange(progress.change || 0) && (
                    <Chip
                      label="Significant Change"
                      color="warning"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Progress Visualization
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Math.abs(progress.change || 0) / 5 * 100, 100)} // Scale based on 5cm max change
                    color={bodyMetricsUtils.getTrendColor(progress.trend || 'stable')}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      {/* No Data State */}
      {!loading && !analytics && !error && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No analytics data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {startDate || endDate 
              ? 'No analytics found for the selected date range. Try adjusting your filters.'
              : 'Need at least 2 measurements for progress analysis.'
            }
          </Typography>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Analytics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>GET /api/body-metrics/analytics</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Query Parameters:</strong> startDate, endDate (both optional)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response Format:</strong> JSON with analytics object containing progress data
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Progress Data:</strong> start, current, change, and trend for each measurement
        </Typography>
        <Typography variant="body2">
          <strong>Trends:</strong> increasing (↗️), decreasing (↘️), stable (→)
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsAnalyticsComponent;
