import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { bodyMetricsService, BodyMetrics, WeightHistory } from '../../services';
import MetricsDashboard from './components/MetricsDashboard';
import MetricsTabs from './components/MetricsTabs';
import MetricsDialogs from './components/MetricsDialogs';

const BodyMetricsPage: React.FC = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [currentMetrics, setCurrentMetrics] = useState<BodyMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<BodyMetrics[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [goals, setGoals] = useState<BodyMetrics[]>([]);

  // Dialog states
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [measurementsDialogOpen, setMeasurementsDialogOpen] = useState(false);
  const [compositionDialogOpen, setCompositionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    
    try {
      const promises = [
        bodyMetricsService.getCurrentMetrics(token).then(response => {
          if (response.success && response.data) {
            setCurrentMetrics(response.data);
          }
          return 'currentMetrics';
        }),
        bodyMetricsService.getMetricsHistory(token, { limit: 10 }).then(response => {
          if (response.success && response.data) {
            const historyData = response.data.metrics || response.data.items || [];
            setMetricsHistory(historyData);
          }
          return 'history';
        }),
        bodyMetricsService.getGoals(token).then(response => {
          if (response.success && response.data) {
            setGoals(response.data);
          }
          return 'goals';
        }),
        bodyMetricsService.getWeightHistory(token, { limit: 10 }).then(response => {
          if (response.success && response.data) {
            const weightData = response.data.weightHistory || response.data.items || [];
            setWeightHistory(weightData);
          }
          return 'weightHistory';
        })
      ];

      await Promise.allSettled(promises);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && authUser && !authLoading) {
      fetchAllData();
    }
  }, [token, authUser, authLoading, fetchAllData]);

  // Wait for authentication to be ready
  if (!token || !authUser || authLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            {!token || !authUser ? 'Loading authentication...' : 'Loading body metrics...'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Success/Error Messages */}
        {success && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Alert 
              severity="success" 
              onClose={() => setSuccess(null)}
              sx={{ borderRadius: 3, px: 4, py: 2 }}
            >
              {success}
            </Alert>
          </Box>
        )}

        {error && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ borderRadius: 3, px: 4, py: 2 }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Metrics Dashboard */}
        <MetricsDashboard 
          currentMetrics={currentMetrics}
          onOpenMetricsDialog={() => setMetricsDialogOpen(true)}
          onOpenWeightDialog={() => setWeightDialogOpen(true)}
          onOpenGoalDialog={() => setGoalDialogOpen(true)}
        />

        {/* Metrics Tabs */}
        <MetricsTabs 
          currentMetrics={currentMetrics}
          metricsHistory={metricsHistory}
          weightHistory={weightHistory}
          goals={goals}
          onOpenMeasurementsDialog={() => setMeasurementsDialogOpen(true)}
          onOpenCompositionDialog={() => setCompositionDialogOpen(true)}
          onOpenWeightDialog={() => setWeightDialogOpen(true)}
          onOpenGoalDialog={() => setGoalDialogOpen(true)}
        />

        {/* Dialogs */}
        <MetricsDialogs 
          metricsDialogOpen={metricsDialogOpen}
          measurementsDialogOpen={measurementsDialogOpen}
          compositionDialogOpen={compositionDialogOpen}
          weightDialogOpen={weightDialogOpen}
          goalDialogOpen={goalDialogOpen}
          onCloseMetricsDialog={() => setMetricsDialogOpen(false)}
          onCloseMeasurementsDialog={() => setMeasurementsDialogOpen(false)}
          onCloseCompositionDialog={() => setCompositionDialogOpen(false)}
          onCloseWeightDialog={() => setWeightDialogOpen(false)}
          onCloseGoalDialog={() => setGoalDialogOpen(false)}
          currentMetrics={currentMetrics}
          onSuccess={(message: string) => {
            setSuccess(message);
            fetchAllData();
          }}
          onError={(message: string) => setError(message)}
        />
      </Container>
    </Box>
  );
};

export default BodyMetricsPage;
