import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Alert, CircularProgress, Card, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { bodyMetricsService, bodyMeasurementsService, BodyMetrics, WeightHistory, BodyMeasurements } from '../../services';
import MetricsDashboard from './components/MetricsDashboard';
import MetricsTabs from './components/MetricsTabs';
import MetricsDialogs from './components/MetricsDialogs';
import BodyMetricsHistory from '../../components/BodyMetricsHistory';
import BodyMetricsAnalyticsComponent from '../../components/BodyMetricsAnalytics';
import BodyMetricsGoals from '../../components/BodyMetricsGoals';
import BodyCompositionTest from '../../components/BodyCompositionTest';
import BodyCompositionHistoryTest from '../../components/BodyCompositionHistoryTest';
import BodyCompositionLogTest from '../../components/BodyCompositionLogTest';
import BodyCompositionUpdateTest from '../../components/BodyCompositionUpdateTest';
import BodyCompositionDeleteTest from '../../components/BodyCompositionDeleteTest';
import BodyCompositionAnalyticsTest from '../../components/BodyCompositionAnalyticsTest';
import WeightHistoryCard from '../../components/WeightHistoryCard';
import BodyMetricsCard from '../../components/BodyMetricsCard';

const BodyMetricsPage: React.FC = () => {
  const { user: authUser, token, loading: authLoading } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [currentMetrics, setCurrentMetrics] = useState<BodyMetrics | null>(null);
  const [currentMeasurements, setCurrentMeasurements] = useState<BodyMeasurements | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<BodyMetrics[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [goals, setGoals] = useState<BodyMetrics[]>([]);

  // Dialog states
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [measurementsDialogOpen, setMeasurementsDialogOpen] = useState(false);
  const [compositionDialogOpen, setCompositionDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    
    try {
      const promises = [
        // Get current body metrics (legacy)
        bodyMetricsService.getCurrentMetrics(token).then(response => {
          if (response.success && response.data) {
            setCurrentMetrics(response.data);
          }
          return 'currentMetrics';
        }),
        // Get current body measurements (new API)
        bodyMeasurementsService.getCurrentBodyMetrics(token).then(response => {
          if (response.success && response.data) {
            setCurrentMeasurements(response.data.metrics);
          }
          return 'currentMeasurements';
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            📊 Body Metrics
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontWeight: 400,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Transform your fitness journey with precision tracking and beautiful insights
          </Typography>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Alert 
              severity="success" 
              onClose={() => setSuccess(null)}
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '1.1rem'
              }}
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
              sx={{ 
                borderRadius: 3, 
                px: 4, 
                py: 2, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '1.1rem'
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Quick Action Buttons */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setMetricsDialogOpen(true)}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #ee5a24 0%, #d63031 100%)',
                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.6)'
              }
            }}
          >
            ➕ Record Metrics
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setWeightDialogOpen(true)}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              borderColor: '#2d3436',
              color: '#2d3436',
              borderWidth: 2,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                borderColor: '#636e72',
                backgroundColor: 'rgba(255,255,255,1)'
              }
            }}
          >
            ⚖️ Log Weight
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setGoalDialogOpen(true)}
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              borderColor: '#00b894',
              color: '#00b894',
              borderWidth: 2,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                borderColor: '#00a085',
                backgroundColor: 'rgba(255,255,255,1)'
              }
            }}
          >
            🎯 Set Goal
          </Button>
        </Box>

        {/* Main Content - Single Column Layout */}
        {/* Metrics Dashboard */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🎯 Current Measurements Overview
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Your latest body metrics and progress indicators
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <MetricsDashboard 
              currentMetrics={currentMetrics}
              currentMeasurements={currentMeasurements}
              onOpenMetricsDialog={() => setMetricsDialogOpen(true)}
              onOpenWeightDialog={() => setWeightDialogOpen(true)}
              onOpenGoalDialog={() => setGoalDialogOpen(true)}
            />
          </Box>
        </Card>

        {/* Fitness Goals */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            p: 3,
            color: '#8B4513'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🎯 Fitness Goals
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Set and track your measurement targets
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyMetricsGoals currentMeasurements={currentMeasurements} />
          </Box>
        </Card>

        {/* Body Metrics History */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📈 Measurement History
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Track your progress over time with detailed measurements
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyMetricsHistory />
          </Box>
        </Card>

        {/* Body Metrics Analytics */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📊 Progress Analytics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Advanced insights and trend analysis for your fitness journey
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyMetricsAnalyticsComponent />
          </Box>
        </Card>

        {/* Body Composition Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🧬 Body Composition API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing the new Body Composition API endpoints
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionTest />
          </Box>
        </Card>

        {/* Body Composition History Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📚 Body Composition History API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing GET /api/body-metrics/composition/history with pagination and filtering
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionHistoryTest />
          </Box>
        </Card>

        {/* Body Composition Log Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ➕ Body Composition Log API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing POST /api/body-metrics/composition/log with form validation
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionLogTest />
          </Box>
        </Card>

        {/* Body Composition Update Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ✏️ Body Composition Update API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing PUT /api/body-metrics/composition/:id with form pre-population and field updates
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionUpdateTest />
          </Box>
        </Card>

        {/* Body Composition Delete Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🗑️ Body Composition Delete API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing DELETE /api/body-metrics/composition/:id with confirmation dialogs and data refresh
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionDeleteTest />
          </Box>
        </Card>

        {/* Body Composition Analytics Test */}
        <Card sx={{ 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📊 Body Composition Analytics API Test
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
              Testing GET /api/body-metrics/composition/analytics with progress tracking and trend analysis
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <BodyCompositionAnalyticsTest />
          </Box>
        </Card>

        {/* Integrated Body Metrics Card */}
        <BodyMetricsCard />

        {/* Integrated Weight Tracking Card */}
        <WeightHistoryCard />

        {/* Hidden Test Components - Keep code but hide from UI */}
        {/* 
        <Box sx={{ mb: 6 }}>
          <BodyMetricsAPITest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsHistoryTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsAnalyticsTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsGoalsTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsLogTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsUpdateTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsDeleteTest />
        </Box>

        <Box sx={{ mb: 6 }}>
          <BodyMetricsByIdTest />
        </Box>
        */}

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
