import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Scale,
  FitnessCenter,
  Flag as Target,
  History,
  Analytics,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { 
  bodyMetricsService, 
  BodyMetrics, 
  WeightHistory, 
  CreateBodyMetricsRequest,
  UpdateBodyMetricsRequest,
  CreateWeightEntryRequest,
  CreateGoalRequest
} from '../../services';

// Demo data creation function
const createDemoBodyMetrics = (email: string) => {
  const now = new Date();
  const userId = 1;

  // Current metrics based on user type
  const currentMetrics: BodyMetrics = {
    id: 1,
    userId,
    height: "170.00",
    heightUnit: "cm",
    weight: "68.50",
    weightUnit: "kg",
    bodyFatPercentage: "22.00",
    muscleMass: "35.00",
    boneMass: null,
    waterPercentage: null,
    chest: "95.00",
    waist: "78.00",
    hips: "95.00",
    biceps: "28.00",
    forearms: null,
    thighs: "52.00",
    calves: "35.00",
    neck: null,
    targetWeight: "65.00",
    targetBodyFat: "18.00",
    bmi: "23.7",
    bmr: "1456.75",
    measurementDate: now.toISOString().split('T')[0],
    notes: "Demo body metrics data",
    isGoal: false,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  // Sample metrics history
  const history: BodyMetrics[] = [
    { ...currentMetrics, id: 1, measurementDate: "2024-01-22", weight: "68.50", bmi: "23.7" },
    { ...currentMetrics, id: 2, measurementDate: "2024-01-15", weight: "69.00", bmi: "23.9" },
    { ...currentMetrics, id: 3, measurementDate: "2024-01-08", weight: "69.50", bmi: "24.0" },
    { ...currentMetrics, id: 4, measurementDate: "2024-01-01", weight: "70.00", bmi: "24.2" }
  ];

  // Sample weight history
  const weightHistory: WeightHistory[] = [
    {
      id: 1,
      userId,
      weight: "68.5",
      weightUnit: "kg",
      measurementDate: "2024-01-22",
      measurementTime: "08:00:00",
      measurementCondition: "morning",
      notes: "Feeling good today",
      mood: "good",
      sleepHours: 7.5,
      stressLevel: "low",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    },
    {
      id: 2,
      userId,
      weight: "69.0",
      weightUnit: "kg",
      measurementDate: "2024-01-21",
      measurementTime: "08:15:00",
      measurementCondition: "morning",
      notes: "After good workout yesterday",
      mood: "excellent",
      sleepHours: 8,
      stressLevel: "low",
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    }
  ];

  // Sample goals
  const goals: BodyMetrics[] = [
    {
      ...currentMetrics,
      id: 10,
      weight: "65.00",
      bodyFatPercentage: "18.00",
      measurementDate: "2024-03-01",
      isGoal: true,
      notes: "Target weight and body fat for summer"
    }
  ];

  return {
    currentMetrics,
    history,
    weightHistory,
    goals
  };
};

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
      id={`body-metrics-tabpanel-${index}`}
      aria-labelledby={`body-metrics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BodyMetricsPage: React.FC = () => {
  const { user: authUser, token } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [currentMetrics, setCurrentMetrics] = useState<BodyMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<BodyMetrics[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [goals, setGoals] = useState<BodyMetrics[]>([]);

  // Dialog states
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState<BodyMetrics | null>(null);
  const [heightWarningShown, setHeightWarningShown] = useState(false);

  // Form states
  const [metricsForm, setMetricsForm] = useState({
    bodyFatPercentage: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    calves: '',
    notes: ''
  });
  const [weightForm, setWeightForm] = useState(() => {
    const now = new Date();
    return {
      weight: '',
      weightUnit: 'kg',
      height: '',
      heightUnit: 'cm',
      measurementDate: now.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
      measurementTime: now.toTimeString().slice(0, 5),
      measurementCondition: 'morning',
      notes: '',
      mood: 'good',
      sleepHours: 7,
      stressLevel: 'low'
    };
  });
  const [goalForm, setGoalForm] = useState(() => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now
    return {
      targetWeight: '',
      targetBodyFat: '',
      targetDate: futureDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
      notes: ''
    };
  });

  // Fetch all data on component mount
  useEffect(() => {
    if (token && authUser) {
      fetchAllData();
    }
  }, [token, authUser]);





  const fetchAllData = async () => {
    if (!token) return;

    console.log('🔄 Refreshing body metrics data...');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('User:', authUser);

    try {
      setLoading(true);
      setError(null);

      // Check if using demo token (fallback to demo data)
      if (token.startsWith('demo_token_')) {
        // Use demo data - convert from existing progress data
        const demoData = createDemoBodyMetrics(authUser?.email || 'client@gymbuddy.com');
        console.log('🎭 Demo data created:', demoData);
        console.log('📊 Demo weight history count:', demoData.weightHistory?.length);
        setCurrentMetrics(demoData.currentMetrics);
        setMetricsHistory(demoData.history || []);
        setWeightHistory(demoData.weightHistory || []);
        setGoals(demoData.goals || []);
      } else {
        // Fetch from real API
        try {
          // Fetch current metrics
          const currentResponse = await bodyMetricsService.getCurrentMetrics(token);
          console.log('🔍 Current metrics response:', currentResponse);
          if (currentResponse.success && currentResponse.data) {
            // API returns data.metrics, not data directly
            const metricsData = (currentResponse.data as any).metrics || currentResponse.data;
            console.log('✅ Setting current metrics:', metricsData);
            setCurrentMetrics(metricsData);
          } else {
            console.log('❌ No current metrics data:', currentResponse);
            setCurrentMetrics(null);
          }

          // Fetch metrics history
          const historyResponse = await bodyMetricsService.getMetricsHistory(token, { limit: 10 });
          if (historyResponse.success && historyResponse.data) {
            console.log('History response:', historyResponse.data);
            // API returns data.metrics, not data.items
            const historyData = historyResponse.data.metrics || historyResponse.data.items || [];
            console.log('Setting metrics history:', historyData);
            setMetricsHistory(historyData || []);
          } else {
            setMetricsHistory([]);
          }

          // Fetch weight history
          const weightResponse = await bodyMetricsService.getWeightHistory(token, { limit: 20 });
          console.log('⚖️ Weight history response:', weightResponse);
          if (weightResponse.success && weightResponse.data) {
            console.log('Weight history response data:', weightResponse.data);
            // API returns data.weightHistory according to documentation
            const weightData = weightResponse.data.weightHistory || [];
            console.log('✅ Setting weight history:', weightData);
            console.log('📊 Weight history count:', weightData.length);
            setWeightHistory(weightData || []);
            
            // Get the most recent weight entry for current metrics display
            if (weightData.length > 0) {
              const mostRecentWeight = weightData[0]; // Assuming API returns sorted by date desc
              console.log('🎯 Most recent weight entry:', mostRecentWeight);
              
              // Update current metrics with the most recent weight if we have it
              if (currentMetrics) {
                const updatedMetrics = {
                  ...currentMetrics,
                  weight: mostRecentWeight.weight,
                  weightUnit: mostRecentWeight.weightUnit,
                  height: mostRecentWeight.height || currentMetrics.height,
                  heightUnit: mostRecentWeight.heightUnit || currentMetrics.heightUnit,
                  bmi: mostRecentWeight.bmi || currentMetrics.bmi,
                  measurementDate: mostRecentWeight.measurementDate
                };
                console.log('🔄 Updating current metrics with recent weight data:', updatedMetrics);
                setCurrentMetrics(updatedMetrics);
              }
            }
          } else {
            console.log('❌ No weight history data:', weightResponse);
            setWeightHistory([]);
          }

          // Fetch goals
          const goalsResponse = await bodyMetricsService.getGoals(token);
          console.log('🎯 Goals response:', goalsResponse);
          if (goalsResponse.success && goalsResponse.data) {
            console.log('✅ Setting goals:', goalsResponse.data);
            // API returns data.goals as an array
            let goalsData;
            if (Array.isArray(goalsResponse.data)) {
              // Direct array
              goalsData = goalsResponse.data;
            } else if ((goalsResponse.data as any).goals) {
              // Array wrapped in goals property
              goalsData = (goalsResponse.data as any).goals;
            } else if ((goalsResponse.data as any).items) {
              // Array wrapped in items property
              goalsData = (goalsResponse.data as any).items;
            } else if ((goalsResponse.data as any).metrics) {
              // Single goal item wrapped in metrics
              goalsData = [(goalsResponse.data as any).metrics];
            } else {
              // Fallback to empty array
              goalsData = [];
            }
            console.log('📊 Processed goals data:', goalsData);
            console.log('📊 Goals count:', goalsData.length);
            setGoals(goalsData);
          } else {
            console.log('❌ No goals data:', goalsResponse);
            setGoals([]);
          }
        } catch (apiError) {
          console.log('API not available, using demo data');
          // Fallback to demo data if API fails
          const demoData = createDemoBodyMetrics(authUser?.email || 'client@gymbuddy.com');
          setCurrentMetrics(demoData.currentMetrics);
          setMetricsHistory(demoData.history || []);
          setWeightHistory(demoData.weightHistory || []);
          setGoals(demoData.goals || []);
        }
      }

    } catch (err) {
      console.error('Failed to fetch body metrics data:', err);
      setError('Failed to load body metrics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Dialog handlers
  const handleOpenMetricsDialog = () => {
    if (currentMetrics) {
      setMetricsForm({
        bodyFatPercentage: currentMetrics.bodyFatPercentage || '',
        muscleMass: currentMetrics.muscleMass || '',
        chest: currentMetrics.chest || '',
        waist: currentMetrics.waist || '',
        hips: currentMetrics.hips || '',
        biceps: currentMetrics.biceps || '',
        thighs: currentMetrics.thighs || '',
        calves: currentMetrics.calves || '',
        notes: currentMetrics.notes || ''
      });
    } else {
      // Reset form if no current metrics
      setMetricsForm({
        bodyFatPercentage: '',
        muscleMass: '',
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: '',
        calves: '',
        notes: ''
      });
    }
    setMetricsDialogOpen(true);
  };

  const handleOpenWeightDialog = () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    setWeightForm({
      weight: currentMetrics?.weight || '',
      weightUnit: currentMetrics?.weightUnit || 'kg',
      height: currentMetrics?.height || '',
      heightUnit: currentMetrics?.heightUnit || 'cm',
      measurementDate: currentDate,
      measurementTime: currentTime,
      measurementCondition: 'morning',
      notes: '',
      mood: 'good',
      sleepHours: 7,
      stressLevel: 'low'
    });
    setWeightDialogOpen(true);
  };

  const handleOpenGoalDialog = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now
    
    setGoalForm({
      targetWeight: currentMetrics?.targetWeight || '',
      targetBodyFat: currentMetrics?.targetBodyFat || '',
      targetDate: futureDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
      notes: ''
    });
    setGoalDialogOpen(true);
  };

  // Form submission handlers
  const handleMetricsSubmit = async () => {
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (token.startsWith('demo_token_')) {
        // Demo mode - update local state
        if (currentMetrics) {
          const updatedMetrics = {
            ...currentMetrics,
            bodyFatPercentage: metricsForm.bodyFatPercentage || currentMetrics.bodyFatPercentage,
            muscleMass: metricsForm.muscleMass || currentMetrics.muscleMass,
            chest: metricsForm.chest || currentMetrics.chest,
            waist: metricsForm.waist || currentMetrics.waist,
            hips: metricsForm.hips || currentMetrics.hips,
            biceps: metricsForm.biceps || currentMetrics.biceps,
            thighs: metricsForm.thighs || currentMetrics.thighs,
            calves: metricsForm.calves || currentMetrics.calves,
            notes: metricsForm.notes || currentMetrics.notes,
            updated_at: new Date().toISOString()
          };
          setCurrentMetrics(updatedMetrics);
          setSuccess('Body metrics updated successfully! (Demo Mode)');
        }
      } else {
        // Real API call
        console.log('Current metrics state:', currentMetrics);
        console.log('Current metrics ID:', currentMetrics?.id);
        
        const metricsData = {
          measurementDate: new Date().toISOString().split('T')[0],
          bodyFatPercentage: metricsForm.bodyFatPercentage ? parseFloat(metricsForm.bodyFatPercentage) : undefined,
          muscleMass: metricsForm.muscleMass ? parseFloat(metricsForm.muscleMass) : undefined,
          chest: metricsForm.chest ? parseFloat(metricsForm.chest) : undefined,
          waist: metricsForm.waist ? parseFloat(metricsForm.waist) : undefined,
          hips: metricsForm.hips ? parseFloat(metricsForm.hips) : undefined,
          biceps: metricsForm.biceps ? parseFloat(metricsForm.biceps) : undefined,
          thighs: metricsForm.thighs ? parseFloat(metricsForm.thighs) : undefined,
          calves: metricsForm.calves ? parseFloat(metricsForm.calves) : undefined,
          notes: metricsForm.notes || undefined
        };

        console.log('Metrics data to send:', metricsData);

        if (currentMetrics && currentMetrics.id) {
          // Update existing metrics
          const response = await bodyMetricsService.updateMetrics(token, currentMetrics.id, metricsData);
          if (response.success && response.data) {
            setCurrentMetrics(response.data);
            setSuccess('Body metrics updated successfully!');
          } else {
            setError(response.message || 'Failed to update metrics');
          }
        } else {
          // Create new metrics
          console.log('Creating new metrics - no existing metrics found');
          const response = await bodyMetricsService.createMetrics(token, metricsData);
          if (response.success && response.data) {
            setCurrentMetrics(response.data);
            setSuccess('Body metrics created successfully!');
          } else {
            setError(response.message || 'Failed to create metrics');
          }
        }
      }
      
      setMetricsDialogOpen(false);
    } catch (error) {
      console.error('Error updating metrics:', error);
      setError('Failed to update metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWeightSubmit = async () => {
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (token.startsWith('demo_token_')) {
        // Demo mode - update local state
        const newWeightEntry: WeightHistory = {
          id: Date.now(),
          userId: currentMetrics?.userId || 1,
          weight: weightForm.weight,
          weightUnit: weightForm.weightUnit,
          height: weightForm.height,
          heightUnit: weightForm.heightUnit,
          measurementDate: weightForm.measurementDate,
          measurementTime: weightForm.measurementTime,
          measurementCondition: weightForm.measurementCondition,
          notes: weightForm.notes,
          mood: weightForm.mood,
          sleepHours: weightForm.sleepHours,
          stressLevel: weightForm.stressLevel,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setWeightHistory(prev => {
          const currentWeightHistory = Array.isArray(prev) ? prev : [];
          return [newWeightEntry, ...currentWeightHistory];
        });
        setSuccess('Weight logged successfully! (Demo Mode)');
      } else {
        // Real API call
        const weightData = {
          weight: parseFloat(weightForm.weight),
          weightUnit: weightForm.weightUnit,
          height: weightForm.height ? parseFloat(weightForm.height) : undefined,
          heightUnit: weightForm.heightUnit,
          measurementDate: weightForm.measurementDate,
          measurementTime: weightForm.measurementTime,
          measurementCondition: weightForm.measurementCondition,
          notes: weightForm.notes || undefined,
          mood: weightForm.mood,
          sleepHours: weightForm.sleepHours,
          stressLevel: weightForm.stressLevel
        };

        const response = await bodyMetricsService.logWeight(token, weightData);
        if (response.success && response.data) {
          setWeightHistory(prev => {
            const currentWeightHistory = Array.isArray(prev) ? prev : [];
            return [response.data as WeightHistory, ...currentWeightHistory];
          });
          setSuccess('Weight logged successfully!');
        } else {
          setError(response.message || 'Failed to log weight');
        }
      }
      
      setWeightDialogOpen(false);
    } catch (error) {
      console.error('Error logging weight:', error);
      setError('Failed to log weight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async () => {
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (token.startsWith('demo_token_')) {
        // Demo mode - update local state
        const newGoal: BodyMetrics = {
          id: Date.now(),
          userId: currentMetrics?.userId || 1,
          height: currentMetrics?.height || '',
          heightUnit: currentMetrics?.heightUnit || 'cm',
          weight: goalForm.targetWeight,
          weightUnit: currentMetrics?.weightUnit || 'kg',
          bodyFatPercentage: goalForm.targetBodyFat,
          muscleMass: currentMetrics?.muscleMass || '',
          boneMass: null,
          waterPercentage: null,
          chest: currentMetrics?.chest || '',
          waist: currentMetrics?.waist || '',
          hips: currentMetrics?.hips || '',
          biceps: currentMetrics?.biceps || '',
          forearms: null,
          thighs: currentMetrics?.thighs || '',
          calves: currentMetrics?.calves || '',
          neck: null,
          targetWeight: goalForm.targetWeight,
          targetBodyFat: goalForm.targetBodyFat,
          bmi: '',
          bmr: '',
          measurementDate: goalForm.targetDate,
          notes: goalForm.notes,
          isGoal: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setGoals(prev => {
          const currentGoals = Array.isArray(prev) ? prev : [];
          return [newGoal, ...currentGoals];
        });
        setSuccess('Goal set successfully! (Demo Mode)');
      } else {
        // Real API call
        const goalData = {
          measurementDate: goalForm.targetDate,
          weight: goalForm.targetWeight ? parseFloat(goalForm.targetWeight) : undefined,
          bodyFatPercentage: goalForm.targetBodyFat ? parseFloat(goalForm.targetBodyFat) : undefined,
          notes: goalForm.notes || undefined
        };

        const response = await bodyMetricsService.createGoal(token, goalData);
        if (response.success && response.data) {
          setGoals(prev => {
            const currentGoals = Array.isArray(prev) ? prev : [];
            return [response.data as BodyMetrics, ...currentGoals];
          });
          setSuccess('Goal set successfully!');
        } else {
          setError(response.message || 'Failed to set goal');
        }
      }
      
      setGoalDialogOpen(false);
    } catch (error) {
      console.error('Error setting goal:', error);
      setError('Failed to set goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Body Metrics 📊
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your body measurements, weight progress, and fitness goals
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenMetricsDialog}
            >
              Record Metrics
            </Button>
            <Button
              variant="outlined"
              startIcon={<Scale />}
              onClick={handleOpenWeightDialog}
            >
              Log Weight
            </Button>
            <Button
              variant="outlined"
              startIcon={<Target />}
              onClick={handleOpenGoalDialog}
            >
              Set Goal
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchAllData}
              disabled={loading}
              sx={{ 
                borderColor: 'warning.main', 
                color: 'warning.main',
                '&:hover': {
                  borderColor: 'warning.dark',
                  backgroundColor: 'warning.light',
                  color: 'warning.dark'
                }
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </Box>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Debug Information */}
        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              🔍 Debug Info
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Current Metrics:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {currentMetrics ? '✅ Loaded' : '❌ Not loaded'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Goals Count:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {Array.isArray(goals) ? goals.length : 'Not array'} goals
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">History Count:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {Array.isArray(metricsHistory) ? metricsHistory.length : 'Not array'} items
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">Weight History:</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {Array.isArray(weightHistory) ? weightHistory.length : 'Not array'} entries
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Current Metrics Summary */}
        {currentMetrics && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                Current Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h6" color="primary.main">
                      {currentMetrics.weight} {currentMetrics.weightUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weight
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h6" color="secondary.main">
                      {currentMetrics.height} {currentMetrics.heightUnit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Height
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h6" color="success.main">
                      {currentMetrics.bmi}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      BMI
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="h6" color="warning.main">
                      {currentMetrics.bodyFatPercentage}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Body Fat
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="body metrics tabs">
              <Tab label="History" icon={<History />} iconPosition="start" />
              <Tab label="Weight Tracking" icon={<Scale />} iconPosition="start" />
              <Tab label="Goals" icon={<Target />} iconPosition="start" />
              <Tab label="Analytics" icon={<Analytics />} iconPosition="start" />
            </Tabs>
          </Box>



          {/* History Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" sx={{ mb: 2 }}>Metrics History</Typography>
            {Array.isArray(metricsHistory) && metricsHistory.length > 0 ? (
              <Box>
                {metricsHistory.map((metric, index) => (
                  <Card key={metric.id || index} sx={{ mb: 2, p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">{metric.measurementDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Weight</Typography>
                        <Typography variant="body1">{metric.weight || 'N/A'} {metric.weightUnit}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Height</Typography>
                        <Typography variant="body1">{metric.height || 'N/A'} {metric.heightUnit}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Body Fat</Typography>
                        <Typography variant="body1">{metric.bodyFatPercentage || 'N/A'}%</Typography>
                      </Grid>
                      {metric.notes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Notes</Typography>
                          <Typography variant="body1">{metric.notes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No metrics history available</Typography>
            )}
          </TabPanel>

          {/* Weight Tracking Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ mb: 2 }}>Weight History</Typography>
            {Array.isArray(weightHistory) && weightHistory.length > 0 ? (
              <Box>
                {weightHistory.map((entry, index) => (
                  <Card key={entry.id || index} sx={{ mb: 2, p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">{entry.measurementDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Weight</Typography>
                        <Typography variant="body1">{entry.weight} {entry.weightUnit}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Time</Typography>
                        <Typography variant="body1">{entry.measurementTime}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Condition</Typography>
                        <Typography variant="body1">{entry.measurementCondition}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Mood</Typography>
                        <Typography variant="body1">{entry.mood}</Typography>
                        </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Sleep</Typography>
                        <Typography variant="body1">{entry.sleepHours}h</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Stress</Typography>
                        <Typography variant="body1">{entry.stressLevel}</Typography>
                      </Grid>
                      {entry.notes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Notes</Typography>
                          <Typography variant="body1">{entry.notes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No weight history available</Typography>
            )}
          </TabPanel>

          {/* Goals Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" sx={{ mb: 2 }}>Fitness Goals</Typography>
            {Array.isArray(goals) && goals.length > 0 ? (
              <Box>
                {goals.map((goal, index) => (
                  <Card key={goal.id || index} sx={{ mb: 2, p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Target Date</Typography>
                        <Typography variant="body1">{goal.measurementDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Target Weight</Typography>
                        <Typography variant="body1">{goal.targetWeight || goal.weight || 'N/A'} {goal.weightUnit}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Target Body Fat</Typography>
                        <Typography variant="body1">{goal.targetBodyFat || goal.bodyFatPercentage || 'N/A'}%</Typography>
                      </Grid>
                      {goal.notes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Goal Notes</Typography>
                          <Typography variant="body1">{goal.notes}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No fitness goals set</Typography>
            )}
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>Progress Analytics</Typography>
            <Typography color="text.secondary">Analytics and charts will be displayed here</Typography>
          </TabPanel>
        </Card>
      </Box>

      {/* Metrics Dialog */}
      <Dialog open={metricsDialogOpen} onClose={() => setMetricsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record Body Metrics</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Body Fat %"
                value={metricsForm.bodyFatPercentage}
                onChange={(e) => setMetricsForm({ ...metricsForm, bodyFatPercentage: e.target.value })}
                placeholder="22.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Muscle Mass (kg)"
                value={metricsForm.muscleMass}
                onChange={(e) => setMetricsForm({ ...metricsForm, muscleMass: e.target.value })}
                placeholder="35.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                value={metricsForm.chest}
                onChange={(e) => setMetricsForm({ ...metricsForm, chest: e.target.value })}
                placeholder="95.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                value={metricsForm.waist}
                onChange={(e) => setMetricsForm({ ...metricsForm, waist: e.target.value })}
                placeholder="78.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                value={metricsForm.hips}
                onChange={(e) => setMetricsForm({ ...metricsForm, hips: e.target.value })}
                placeholder="95.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Biceps (cm)"
                value={metricsForm.biceps}
                onChange={(e) => setMetricsForm({ ...metricsForm, biceps: e.target.value })}
                placeholder="28.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thighs (cm)"
                value={metricsForm.thighs}
                onChange={(e) => setMetricsForm({ ...metricsForm, thighs: e.target.value })}
                placeholder="52.00"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calves (cm)"
                value={metricsForm.calves}
                onChange={(e) => setMetricsForm({ ...metricsForm, calves: e.target.value })}
                placeholder="35.00"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={metricsForm.notes}
                onChange={(e) => setMetricsForm({ ...metricsForm, notes: e.target.value })}
                placeholder="Any additional notes about your measurements..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleMetricsSubmit} variant="contained">Save Metrics</Button>
        </DialogActions>
      </Dialog>

      {/* Weight Dialog */}
      <Dialog open={weightDialogOpen} onClose={() => setWeightDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Weight Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                value={weightForm.weight}
                onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
                placeholder="68.50"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Weight Unit</InputLabel>
                <Select
                  value={weightForm.weightUnit}
                  onChange={(e) => setWeightForm({ ...weightForm, weightUnit: e.target.value })}
                  label="Weight Unit"
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="lbs">lbs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height"
                value={weightForm.height}
                onChange={(e) => {
                  const newHeight = e.target.value;
                  if (weightForm.height && weightForm.height !== '' && newHeight !== weightForm.height && !heightWarningShown) {
                    const confirmed = window.confirm(
                      '⚠️ Warning: Changing height will affect BMI calculations and historical data consistency. Are you sure you want to proceed?\n\nThis warning will only be shown once per session.'
                    );
                    setHeightWarningShown(true); // Mark warning as shown
                    if (!confirmed) {
                      return; // Don't update if user cancels
                    }
                  }
                  setWeightForm({ ...weightForm, height: newHeight });
                }}
                placeholder="175.00"
                type="number"
                helperText={weightForm.height && !heightWarningShown ? "⚠️ Height changes affect BMI calculations" : ""}
                FormHelperTextProps={{
                  sx: { 
                    color: 'warning.main',
                    fontSize: '0.75rem',
                    fontStyle: 'italic'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Height Unit</InputLabel>
                <Select
                  value={weightForm.heightUnit}
                  onChange={(e) => setWeightForm({ ...weightForm, heightUnit: e.target.value })}
                  label="Height Unit"
                >
                  <MenuItem value="cm">cm</MenuItem>
                  <MenuItem value="ft">ft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                value={weightForm.measurementDate}
                onChange={(e) => setWeightForm({ ...weightForm, measurementDate: e.target.value })}
                type="date"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                value={weightForm.measurementTime}
                onChange={(e) => setWeightForm({ ...weightForm, measurementTime: e.target.value })}
                type="time"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={weightForm.measurementCondition}
                  onChange={(e) => setWeightForm({ ...weightForm, measurementCondition: e.target.value })}
                  label="Condition"
                >
                  <MenuItem value="morning">Morning</MenuItem>
                  <MenuItem value="afternoon">Afternoon</MenuItem>
                  <MenuItem value="evening">Evening</MenuItem>
                  <MenuItem value="after_workout">After Workout</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Mood</InputLabel>
                <Select
                  value={weightForm.mood}
                  onChange={(e) => setWeightForm({ ...weightForm, mood: e.target.value })}
                  label="Mood"
                >
                  <MenuItem value="excellent">Excellent</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="okay">Okay</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sleep Hours"
                value={weightForm.sleepHours}
                onChange={(e) => setWeightForm({ ...weightForm, sleepHours: Number(e.target.value) })}
                type="number"
                inputProps={{ min: 0, max: 24, step: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Stress Level</InputLabel>
                <Select
                  value={weightForm.stressLevel}
                  onChange={(e) => setWeightForm({ ...weightForm, stressLevel: e.target.value })}
                  label="Stress Level"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={weightForm.notes}
                onChange={(e) => setWeightForm({ ...weightForm, notes: e.target.value })}
                placeholder="How are you feeling today? Any notes about your weight..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWeightDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleWeightSubmit} variant="contained">Log Weight</Button>
        </DialogActions>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onClose={() => setGoalDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Set Fitness Goal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Weight (kg)"
                value={goalForm.targetWeight}
                onChange={(e) => setGoalForm({ ...goalForm, targetWeight: e.target.value })}
                placeholder="65.00"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Body Fat %"
                value={goalForm.targetBodyFat}
                onChange={(e) => setGoalForm({ ...goalForm, targetBodyFat: e.target.value })}
                placeholder="18.00"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                type="date"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Goal Notes"
                value={goalForm.notes}
                onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                placeholder="Describe your fitness goal and motivation..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleGoalSubmit} variant="contained">Set Goal</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BodyMetricsPage;
