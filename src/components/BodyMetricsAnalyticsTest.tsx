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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMetricsAnalytics } from '../services';

/**
 * Test Component for Body Metrics Analytics API Integration
 * This demonstrates how to use the new /api/body-metrics/analytics endpoint
 */
const BodyMetricsAnalyticsTest: React.FC = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<BodyMetricsAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Test parameters
  const [testStartDate, setTestStartDate] = useState('');
  const [testEndDate, setTestEndDate] = useState('');

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params: any = {};

      // Add date filters if set
      if (testStartDate) params.startDate = testStartDate;
      if (testEndDate) params.endDate = testEndDate;

      const response = await bodyMeasurementsService.getBodyMetricsAnalytics(token, params);
      
      if (response.success) {
        if (response.data?.analytics) {
          setAnalytics(response.data.analytics);
          setSuccess('Analytics loaded successfully!');
        } else {
          setAnalytics(null);
          setSuccess(response.message || 'No analytics data available');
        }
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

  // Test the API on component mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Analytics API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Analytics API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>/api/body-metrics/analytics</code> endpoint with progress tracking and trend analysis
      </Typography>

      {/* Test Parameters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 Test Parameters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Start Date (optional)"
              value={testStartDate}
              onChange={(e) => setTestStartDate(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="End Date (optional)"
              value={testEndDate}
              onChange={(e) => setTestEndDate(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={fetchAnalytics}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : '🔄 Test Analytics API'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              setTestStartDate('');
              setTestEndDate('');
              fetchAnalytics();
            }}
          >
            🗑️ Reset & Test
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
          <Typography sx={{ ml: 2 }}>Testing analytics API...</Typography>
        </Box>
      )}

      {/* Analytics Summary */}
      {analytics && (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'success.50' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📊 Analytics Summary
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
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
                <Typography variant="h6" color="text.secondary">
                  {Object.keys(analytics.progress).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Measurement Types
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Progress Details */}
      {analytics && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📈 Progress Details
          </Typography>
          
          <Grid container spacing={2}>
                      {Object.entries(analytics.progress).map(([measurementType, progress]) => {
            // Skip if progress data is null or undefined
            if (!progress) {
              return null;
            }
            
            return (
              <Grid item xs={12} sm={6} md={4} key={measurementType}>
                <Card sx={{ p: 2, bgcolor: 'grey.50', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                      {measurementType}
                    </Typography>
                    <Chip
                      label={progress.trend || 'stable'}
                      color={bodyMetricsUtils.getTrendColor(progress.trend || 'stable')}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Start</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {bodyMetricsUtils.formatMeasurement(progress.start || '0')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Current</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {bodyMetricsUtils.formatMeasurement(progress.current || '0')}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" 
                      color={bodyMetricsUtils.getTrendColor(progress.trend || 'stable')}
                      sx={{ fontWeight: 700 }}
                    >
                                              {bodyMetricsUtils.getTrendIcon(progress.trend || 'stable')}
                        {bodyMetricsUtils.formatChange(progress.change || 0)}
                    </Typography>
                    
                    {bodyMetricsUtils.isSignificantChange(progress.change || 0) && (
                      <Chip
                        label="Significant"
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
          </Grid>
        </Card>
      )}

      {/* No Data State */}
      {!loading && !analytics && !error && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No analytics data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {testStartDate || testEndDate 
              ? 'No analytics found for the selected date range. Try adjusting your filters.'
              : 'Need at least 2 measurements for progress analysis.'
            }
          </Typography>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'warning.50' }}>
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
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Trends:</strong> increasing (↗️), decreasing (↘️), stable (→)
        </Typography>
        <Typography variant="body2">
          <strong>Requirements:</strong> Minimum 2 measurements needed for analysis
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsAnalyticsTest;
