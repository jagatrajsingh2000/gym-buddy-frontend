import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Container,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  Timeline,
  Assessment,
  BarChart
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { bodyMetricsService, bodyCompositionService, bodyMeasurementsService } from '../../services/bodyMetricsService';
import { BodyMetricsAnalytics, BodyCompositionAnalytics, WeightTrackingAnalytics } from '../../components/common/analytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Analytics: React.FC = () => {
  const { token } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bodyMetricsAnalytics, setBodyMetricsAnalytics] = useState<any>(null);
  const [weightAnalytics, setWeightAnalytics] = useState<any>(null);
  const [compositionAnalytics, setCompositionAnalytics] = useState<any>(null);

  useEffect(() => {
    if (token) {
      fetchAllAnalytics();
    }
  }, [token]);

  const fetchAllAnalytics = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch all analytics in parallel
      const [bodyMetricsResponse, weightResponse, compositionResponse] = await Promise.all([
        bodyMeasurementsService.getBodyMetricsAnalytics(token),
        bodyMetricsService.getWeightAnalytics(token, { period: 30 }),
        bodyCompositionService.getCompositionAnalytics(token)
      ]);

      if (bodyMetricsResponse.success && bodyMetricsResponse.data?.analytics) {
        setBodyMetricsAnalytics(bodyMetricsResponse.data.analytics);
      }

      if (weightResponse.success && weightResponse.data?.analytics) {
        setWeightAnalytics(weightResponse.data.analytics);
      }

      if (compositionResponse.success && compositionResponse.data?.analytics) {
        setCompositionAnalytics(compositionResponse.data.analytics);
      }

    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Please log in to view analytics
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading analytics...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          📊 Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive insights into your fitness journey
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Analytics Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab 
              icon={<Assessment />} 
              label="Body Metrics" 
              iconPosition="start"
            />
            <Tab 
              icon={<Timeline />} 
              label="Weight Tracking" 
              iconPosition="start"
            />
            <Tab 
              icon={<BarChart />} 
              label="Body Composition" 
              iconPosition="start"
            />
            <Tab 
              icon={<TrendingUp />} 
              label="Overall Progress" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Body Metrics Analytics Tab */}
        <TabPanel value={tabValue} index={0}>
          {bodyMetricsAnalytics ? (
            <BodyMetricsAnalytics analytics={bodyMetricsAnalytics} />
          ) : (
            <Alert severity="info">
              No body metrics analytics data available
            </Alert>
          )}
        </TabPanel>

        {/* Weight Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          {weightAnalytics ? (
            <WeightTrackingAnalytics analytics={weightAnalytics} />
          ) : (
            <Alert severity="info">
              No weight analytics data available
            </Alert>
          )}
        </TabPanel>

        {/* Body Composition Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          {compositionAnalytics ? (
            <BodyCompositionAnalytics analytics={compositionAnalytics} />
          ) : (
            <Alert severity="info">
              No body composition analytics data available
            </Alert>
          )}
        </TabPanel>

        {/* Overall Progress Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            🎯 Overall Progress Summary
          </Typography>
          
          <Grid container spacing={3}>
            {/* Summary Stats */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.50' }}>
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {(bodyMetricsAnalytics?.totalMeasurements || 0) + (weightAnalytics?.totalEntries || 0) + (compositionAnalytics?.totalMeasurements || 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Entries
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.50' }}>
                    <Typography variant="h4" color="success.main" fontWeight={600}>
                      {bodyMetricsAnalytics ? '✓' : '○'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Body Metrics
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'info.50' }}>
                    <Typography variant="h4" color="info.main" fontWeight={600}>
                      {weightAnalytics ? '✓' : '○'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weight Tracking
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.50' }}>
                    <Typography variant="h4" color="warning.main" fontWeight={600}>
                      {compositionAnalytics ? '✓' : '○'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Body Composition
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Quick Insights */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, bgcolor: 'primary.50' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  📈 Progress Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Track your overall fitness journey across all metrics
                </Typography>
                {bodyMetricsAnalytics && (
                  <Typography variant="body2" color="text.secondary">
                    • Body measurements tracked over {bodyMetricsAnalytics.dateRange ? Math.ceil((new Date(bodyMetricsAnalytics.dateRange.end).getTime() - new Date(bodyMetricsAnalytics.dateRange.start).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                  </Typography>
                )}
                {weightAnalytics && (
                  <Typography variant="body2" color="text.secondary">
                    • Weight tracking with {weightAnalytics.totalEntries || 0} entries
                  </Typography>
                )}
                {compositionAnalytics && (
                  <Typography variant="body2" color="text.secondary">
                    • Body composition analysis available
                  </Typography>
                )}
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, bgcolor: 'success.50' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  🎯 Goals Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Monitor your progress towards fitness goals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Consistent tracking across all metrics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Comprehensive analytics available
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Trend analysis and progress visualization
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default Analytics;

