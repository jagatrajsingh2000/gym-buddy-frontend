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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  LinearProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  ShowChart as ChartIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService, WeightAnalytics } from '../services/bodyMetricsService';

interface WeightAnalyticsParams {
  period?: number;
  startDate?: string;
  endDate?: string;
}

const WeightAnalyticsTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<WeightAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [useCustomDates, setUseCustomDates] = useState<boolean>(false);

  // Load analytics on component mount
  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const fetchAnalytics = async (params: WeightAnalyticsParams = {}) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let requestParams: WeightAnalyticsParams = {};
      
      if (useCustomDates && customStartDate && customEndDate) {
        requestParams = {
          startDate: customStartDate,
          endDate: customEndDate
        };
      } else {
        requestParams = { period: selectedPeriod };
      }

      const response = await bodyMetricsService.getWeightAnalytics(token, requestParams);
      
      if (response.success && response.data) {
        setAnalytics(response.data.analytics);
        setSuccess('Weight analytics loaded successfully!');
      } else {
        setError(response.message || 'Failed to load weight analytics');
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching analytics');
      console.error('Error fetching weight analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: number) => {
    setSelectedPeriod(period);
    setUseCustomDates(false);
    fetchAnalytics({ period });
  };

  const handleCustomDateSubmit = () => {
    if (!customStartDate || !customEndDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(customStartDate) >= new Date(customEndDate)) {
      setError('Start date must be before end date');
      return;
    }

    fetchAnalytics({
      startDate: customStartDate,
      endDate: customEndDate
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon color="error" />;
      case 'decreasing':
        return <TrendingDownIcon color="success" />;
      case 'stable':
        return <TrendingFlatIcon color="info" />;
      default:
        return <TrendingFlatIcon color="disabled" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'error';
      case 'decreasing':
        return 'success';
      case 'stable':
        return 'info';
      default:
        return 'default';
    }
  };

  const getChangeColor = (change: number) => {
    if (change === 0) return 'info';
    return change > 0 ? 'error' : 'success';
  };

  const formatWeight = (weight: string) => {
    if (!weight) return 'N/A';
    return `${weight} kg`;
  };

  const formatBMI = (bmi: number) => {
    if (!bmi || isNaN(bmi)) return 'N/A';
    return bmi.toFixed(1);
  };

  const formatChange = (change: number) => {
    if (change === 0) return '0';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === 0) return '0%';
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const isAnalyticsDataComplete = (data: any): boolean => {
    return data && 
           data.weight && 
           data.bmi && 
           data.progress && 
           data.dateRange &&
           typeof data.totalEntries === 'number';
  };

  const getGoalProgressColor = (progress: number | null) => {
    if (progress === null) return 'primary';
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  const getGoalProgressLabel = (progress: number | null) => {
    if (progress === null) return 'No goal set';
    if (progress >= 100) return 'Goal achieved!';
    return `${progress.toFixed(1)}% complete`;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight Analytics API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Weight Analytics API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/weight/analytics endpoint with comprehensive analytics and period selection
        </Typography>

        {/* Period Selection Controls */}
        <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            📅 Analysis Period Selection
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Quick Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value as number)}
                  disabled={useCustomDates}
                  label="Quick Period"
                >
                  <MenuItem value={7}>Last 7 days</MenuItem>
                  <MenuItem value={14}>Last 14 days</MenuItem>
                  <MenuItem value={30}>Last 30 days</MenuItem>
                  <MenuItem value={60}>Last 60 days</MenuItem>
                  <MenuItem value={90}>Last 90 days</MenuItem>
                  <MenuItem value={180}>Last 6 months</MenuItem>
                  <MenuItem value={365}>Last year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant={useCustomDates ? "contained" : "outlined"}
                onClick={() => setUseCustomDates(!useCustomDates)}
                startIcon={<CalendarIcon />}
                fullWidth
                size="small"
              >
                Custom Dates
              </Button>
            </Grid>
            
            {useCustomDates && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    variant="contained"
                    onClick={handleCustomDateSubmit}
                    startIcon={<ChartIcon />}
                    fullWidth
                    size="small"
                  >
                    Analyze
                  </Button>
                </Grid>
              </>
            )}
            
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                onClick={() => fetchAnalytics()}
                startIcon={<RefreshIcon />}
                fullWidth
                size="small"
                disabled={loading}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography>Loading weight analytics...</Typography>
          </Box>
        )}

        {/* No Data State */}
        {!loading && !analytics && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No analytics data available. Click "Generate Analytics" to fetch data.
          </Alert>
        )}

        {/* Incomplete Data State */}
        {!loading && analytics && !isAnalyticsDataComplete(analytics) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Analytics data is incomplete. Some sections may not display properly.
          </Alert>
        )}

        {/* Analytics Display */}
        {analytics && isAnalyticsDataComplete(analytics) && (
          <>
            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Total Entries */}
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {analytics.totalEntries || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Entries
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" color="secondary" gutterBottom>
                      {analytics.dateRange?.days || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Analyzed
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {analytics.dateRange?.start || 'N/A'} to {analytics.dateRange?.end || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Weight Trend */}
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {analytics.weight?.trend ? getTrendIcon(analytics.weight.trend) : <TrendingFlatIcon color="disabled" />}
                    </Box>
                    <Typography variant="h6" color={analytics.weight?.trend ? getTrendColor(analytics.weight.trend) : 'default'}>
                      {analytics.weight?.trend ? analytics.weight.trend.charAt(0).toUpperCase() + analytics.weight.trend.slice(1) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weight Trend
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* BMI Trend */}
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {analytics.bmi?.trend ? getTrendIcon(analytics.bmi.trend) : <TrendingFlatIcon color="disabled" />}
                    </Box>
                    <Typography variant="h6" color={analytics.bmi?.trend ? getTrendColor(analytics.bmi.trend) : 'default'}>
                      {analytics.bmi?.trend ? analytics.bmi.trend.charAt(0).toUpperCase() + analytics.bmi.trend.slice(1) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      BMI Trend
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Weight Metrics */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon color="primary" />
                  Weight Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Start Weight:</strong></TableCell>
                            <TableCell>{formatWeight(analytics.weight?.start)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Current Weight:</strong></TableCell>
                            <TableCell>{formatWeight(analytics.weight?.current)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Change:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={`${formatChange(analytics.weight?.change || 0)} kg`}
                                color={getChangeColor(analytics.weight?.change || 0)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Change %:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={formatPercentage(analytics.weight?.changePercentage || 0)}
                                color={getChangeColor(analytics.weight?.changePercentage || 0)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Average Weight:</strong></TableCell>
                            <TableCell>{formatWeight(analytics.weight?.average)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Highest Weight:</strong></TableCell>
                            <TableCell>{formatWeight(analytics.weight?.highest)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Lowest Weight:</strong></TableCell>
                            <TableCell>{formatWeight(analytics.weight?.lowest)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Trend:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={analytics.weight?.trend ? analytics.weight.trend.charAt(0).toUpperCase() + analytics.weight.trend.slice(1) : 'N/A'}
                                color={analytics.weight?.trend ? getTrendColor(analytics.weight.trend) : 'default'}
                                size="small"
                                variant="outlined"
                                icon={analytics.weight?.trend ? getTrendIcon(analytics.weight.trend) : undefined}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BMI Metrics */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon color="secondary" />
                  BMI Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Start BMI:</strong></TableCell>
                            <TableCell>{formatBMI(analytics.bmi.start)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Current BMI:</strong></TableCell>
                            <TableCell>{formatBMI(analytics.bmi?.current)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Change:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={formatChange(analytics.bmi?.change || 0)}
                                color={getChangeColor(analytics.bmi?.change || 0)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Change %:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={formatPercentage(analytics.bmi?.changePercentage || 0)}
                                color={getChangeColor(analytics.bmi?.changePercentage || 0)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Average BMI:</strong></TableCell>
                            <TableCell>{formatBMI(analytics.bmi?.average)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Trend:</strong></TableCell>
                            <TableCell>
                              <Chip 
                                label={analytics.bmi?.trend ? analytics.bmi.trend.charAt(0).toUpperCase() + analytics.bmi.trend.slice(1) : 'N/A'}
                                color={analytics.bmi?.trend ? getTrendColor(analytics.bmi.trend) : 'default'}
                                size="small"
                                variant="outlined"
                                icon={analytics.bmi?.trend ? getTrendIcon(analytics.bmi.trend) : undefined}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Progress Metrics */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon color="success" />
                  Progress Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color="primary" gutterBottom>
                        {formatChange(analytics.progress?.weeklyChange || 0)} kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Weekly Change
                      </Typography>
                      <Chip 
                        label={formatChange(analytics.progress?.weeklyChange || 0)}
                        color={getChangeColor(analytics.progress?.weeklyChange || 0)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color="secondary" gutterBottom>
                        {formatChange(analytics.progress?.monthlyChange || 0)} kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monthly Change
                      </Typography>
                      <Chip 
                        label={formatChange(analytics.progress?.monthlyChange || 0)}
                        color={getChangeColor(analytics.progress?.monthlyChange || 0)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h5" color={getGoalProgressColor(analytics.progress?.goalProgress)} gutterBottom>
                        {getGoalProgressLabel(analytics.progress?.goalProgress)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Goal Progress
                      </Typography>
                      {analytics.progress?.goalProgress !== null && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(analytics.progress.goalProgress, 100)}
                            color={getGoalProgressColor(analytics.progress.goalProgress)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Raw Data Display */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Raw Analytics Data
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
                    <pre>{JSON.stringify(analytics, null, 2)}</pre>
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> GET /api/body-metrics/weight/analytics<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (analytics ? 'Success' : 'Ready'))}<br />
            <strong>Selected Period:</strong> {useCustomDates ? 'Custom Dates' : `${selectedPeriod} days`}<br />
            <strong>Custom Dates:</strong> {useCustomDates ? `${customStartDate} to ${customEndDate}` : 'Not used'}<br />
            <strong>Analytics Data:</strong> {analytics ? 'Loaded' : 'Not loaded'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightAnalyticsTest;
