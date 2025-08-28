import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  TextField,
  Collapse,
  Chip,
  LinearProgress
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService } from '../services/bodyMetricsService';

interface CompositionProgress {
  start: string;
  current: string;
  change: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface CompositionAnalytics {
  totalMeasurements: number;
  dateRange: {
    start: string;
    end: string;
  };
  progress: {
    bodyFat?: CompositionProgress;
    muscleMass?: CompositionProgress;
    boneMass?: CompositionProgress;
    waterPercentage?: CompositionProgress;
  };
}

const BodyCompositionAnalyticsTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<CompositionAnalytics | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [insufficientData, setInsufficientData] = useState<string | null>(null);

  // Date filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Load analytics on component mount
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    setAnalytics(null);
    setInsufficientData(null);

    try {
      const params: { startDate?: string; endDate?: string } = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await bodyCompositionService.getCompositionAnalytics(token!, params);
      
      if (response.success && response.data) {
        if (response.data.analytics) {
          setAnalytics(response.data.analytics);
        } else {
          setInsufficientData(response.data.message || 'Need at least 2 measurements for progress analysis');
        }
      } else {
        setError(response.message || 'Failed to fetch analytics');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching composition analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = () => {
    fetchAnalytics();
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    fetchAnalytics();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon color="success" />;
      case 'decreasing':
        return <TrendingDownIcon color="error" />;
      case 'stable':
        return <TrendingFlatIcon color="info" />;
      default:
        return <TrendingFlatIcon color="disabled" />;
    }
  };



  const getProgressColor = (change: number, metric: string): 'success' | 'error' | 'info' => {
    if (metric === 'bodyFat') {
      // For body fat, decreasing is positive (good)
      return change <= 0 ? 'success' : 'error';
    } else {
      // For other metrics, increasing is positive (good)
      return change >= 0 ? 'success' : 'error';
    }
  };

  const formatProgressValue = (value: string | undefined): string => {
    if (!value) return 'N/A';
    return value;
  };

  const formatChange = (change: number): string => {
    if (change > 0) return `+${change.toFixed(1)}`;
    if (change < 0) return `${change.toFixed(1)}`;
    return '0.0';
  };

  const getProgressPercentage = (start: string, current: string): number => {
    const startVal = parseFloat(start);
    const currentVal = parseFloat(current);
    
    if (isNaN(startVal) || isNaN(currentVal) || startVal === 0) return 0;
    
    const change = ((currentVal - startVal) / startVal) * 100;
    return Math.min(Math.max(change, -100), 100); // Clamp between -100% and 100%
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition Analytics API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Body Composition Analytics API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/composition/analytics endpoint with progress tracking and trend analysis
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setShowFilters(!showFilters)}
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showFilters ? 'Hide Filters' : 'Show Date Filters'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchAnalytics}
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Analytics'}
          </Button>
          {showFilters && (
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              startIcon={<CalendarIcon />}
              color="warning"
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Date Filters */}
        <Collapse in={showFilters}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Date Range Filters (Optional)
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  onClick={handleDateFilterChange}
                  disabled={loading}
                  fullWidth
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Collapse>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {insufficientData && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Insufficient Data:</strong> {insufficientData}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Create at least 2 body composition measurements to see analytics.
            </Typography>
          </Alert>
        )}

        {/* Analytics Display */}
        {analytics && (
          <Box>
            {/* Summary Information */}
            <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                📈 Analytics Summary
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
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
                      {analytics.dateRange.start}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      {analytics.dateRange.end}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End Date
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      {Math.ceil((new Date(analytics.dateRange.end).getTime() - new Date(analytics.dateRange.start).getTime()) / (1000 * 60 * 60 * 24))} days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Progress Analysis */}
            <Typography variant="h6" gutterBottom>
              📊 Progress Analysis
            </Typography>
            
            <Grid container spacing={2}>
              {/* Body Fat Progress */}
              {analytics.progress.bodyFat && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Body Fat Percentage
                      </Typography>
                      <Chip 
                        icon={getTrendIcon(analytics.progress.bodyFat.trend)}
                        label={analytics.progress.bodyFat.trend}
                        color={analytics.progress.bodyFat.trend === 'decreasing' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.abs(getProgressPercentage(analytics.progress.bodyFat.start, analytics.progress.bodyFat.current))}
                        color={getProgressColor(analytics.progress.bodyFat.change, 'bodyFat')}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Grid container spacing={2} textAlign="center">
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Start
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.bodyFat.start)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.bodyFat.current)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Change
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color={getProgressColor(analytics.progress.bodyFat.change, 'bodyFat')}
                        >
                          {formatChange(analytics.progress.bodyFat.change)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}

              {/* Muscle Mass Progress */}
              {analytics.progress.muscleMass && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Muscle Mass
                      </Typography>
                      <Chip 
                        icon={getTrendIcon(analytics.progress.muscleMass.trend)}
                        label={analytics.progress.muscleMass.trend}
                        color={analytics.progress.muscleMass.trend === 'increasing' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.abs(getProgressPercentage(analytics.progress.muscleMass.start, analytics.progress.muscleMass.current))}
                        color={getProgressColor(analytics.progress.muscleMass.change, 'muscleMass')}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Grid container spacing={2} textAlign="center">
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Start
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.muscleMass.start)} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.muscleMass.current)} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Change
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color={getProgressColor(analytics.progress.muscleMass.change, 'muscleMass')}
                        >
                          {formatChange(analytics.progress.muscleMass.change)} kg
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}

              {/* Bone Mass Progress */}
              {analytics.progress.boneMass && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Bone Mass
                      </Typography>
                      <Chip 
                        icon={getTrendIcon(analytics.progress.boneMass.trend)}
                        label={analytics.progress.boneMass.trend}
                        color={analytics.progress.boneMass.trend === 'increasing' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.abs(getProgressPercentage(analytics.progress.boneMass.start, analytics.progress.boneMass.current))}
                        color={getProgressColor(analytics.progress.boneMass.change, 'boneMass')}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Grid container spacing={2} textAlign="center">
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Start
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.boneMass.start)} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.boneMass.current)} kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Change
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color={getProgressColor(analytics.progress.boneMass.change, 'boneMass')}
                        >
                          {formatChange(analytics.progress.boneMass.change)} kg
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}

              {/* Water Percentage Progress */}
              {analytics.progress.waterPercentage && (
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Water Percentage
                      </Typography>
                      <Chip 
                        icon={getTrendIcon(analytics.progress.waterPercentage.trend)}
                        label={analytics.progress.waterPercentage.trend}
                        color={analytics.progress.waterPercentage.trend === 'increasing' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.abs(getProgressPercentage(analytics.progress.waterPercentage.start, analytics.progress.waterPercentage.current))}
                        color={getProgressColor(analytics.progress.waterPercentage.change, 'waterPercentage')}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Grid container spacing={2} textAlign="center">
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Start
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.waterPercentage.start)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Current
                        </Typography>
                        <Typography variant="h6">
                          {formatProgressValue(analytics.progress.waterPercentage.current)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Change
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color={getProgressColor(analytics.progress.waterPercentage.change, 'waterPercentage')}
                        >
                          {formatChange(analytics.progress.waterPercentage.change)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> GET /api/body-metrics/composition/analytics<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (analytics ? 'Success' : (insufficientData ? 'Insufficient Data' : 'Ready')))}<br />
            <strong>Date Filters:</strong> {startDate || 'None'} to {endDate || 'None'}<br />
            <strong>Analytics:</strong> {analytics ? `${analytics.totalMeasurements} measurements` : 'Not available'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionAnalyticsTest;
