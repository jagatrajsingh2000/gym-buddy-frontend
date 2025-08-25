import React, { useState, useEffect, useCallback } from 'react';
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
  bodyMeasurementsService,
  bodyCompositionService,
  BodyMetrics, 
  BodyMeasurements,
  BodyComposition,
  WeightHistory, 
  CreateBodyMetricsRequest,
  UpdateBodyMetricsRequest,
  CreateBodyMeasurementsRequest,
  CreateBodyCompositionRequest,
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
  const { user: authUser, token, loading: authLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states - Separated structure
  const [currentMetrics, setCurrentMetrics] = useState<BodyMetrics | null>(null); // Legacy compatibility
  const [currentMeasurements, setCurrentMeasurements] = useState<BodyMeasurements | null>(null);
  const [currentComposition, setCurrentComposition] = useState<BodyComposition | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<BodyMetrics[]>([]);
  const [measurementsHistory, setMeasurementsHistory] = useState<BodyMeasurements[]>([]);
  const [compositionHistory, setCompositionHistory] = useState<BodyComposition[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightHistory[]>([]);
  const [goals, setGoals] = useState<BodyMetrics[]>([]);

  // Dialog states
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false); // Legacy compatibility
  const [measurementsDialogOpen, setMeasurementsDialogOpen] = useState(false);
  const [compositionDialogOpen, setCompositionDialogOpen] = useState(false);
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [editingMetrics, setEditingMetrics] = useState<BodyMetrics | null>(null); // Legacy compatibility
  const [editingMeasurements, setEditingMeasurements] = useState<BodyMeasurements | null>(null);
  const [editingComposition, setEditingComposition] = useState<BodyComposition | null>(null);
  const [heightWarningShown, setHeightWarningShown] = useState(false);

  // Form states - Separated for new API structure
  const [measurementsForm, setMeasurementsForm] = useState({
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    forearms: '',
    thighs: '',
    calves: '',
    neck: '',
    notes: '',
    measurementDate: new Date().toISOString().split('T')[0]
  });

  const [compositionForm, setCompositionForm] = useState({
    bodyFatPercentage: '',
    muscleMass: '',
    boneMass: '',
    waterPercentage: '',
    notes: '',
    measurementDate: new Date().toISOString().split('T')[0]
  });

  // Legacy form for backward compatibility
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
      targetMuscleMass: '',
      targetChest: '',
      targetWaist: '',
      targetHips: '',
      targetDate: futureDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
      notes: ''
    };
  });









  const fetchAllData = useCallback(async () => {
    console.log('🔍 fetchAllData called with:', {
      hasToken: !!token,
      hasUser: !!authUser,
      currentLoading: loading,
      tokenType: token ? (token.startsWith('demo_token_') ? 'demo' : 'regular') : 'none'
    });

    if (!token) {
      console.log('❌ No token available for data fetch');
      return;
    }

    if (loading) {
      console.log('⏳ Already loading data, skipping duplicate request');
      return;
    }

    console.log('🔄 Starting data fetch...');
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('User:', authUser);
    console.log('Current loading state:', loading);

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
        // Fetch from real API with new separated structure
        try {
          // Fetch current metrics (legacy)
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

          // Fetch current measurements (new API)
          try {
            const measurementsResponse = await bodyMeasurementsService.getCurrentMeasurements(token);
            if (measurementsResponse.success && measurementsResponse.data) {
              const measurementsData = (measurementsResponse.data as any).metrics || measurementsResponse.data;
              console.log('✅ Setting current measurements:', measurementsData);
              setCurrentMeasurements(measurementsData);
            }
          } catch (error) {
            console.log('⚠️ New measurements API not available, extracting from legacy data');
            // Extract measurements data from currentMetrics for fallback
            const legacyMetrics = (currentResponse.success && currentResponse.data) ? 
              ((currentResponse.data as any).metrics || currentResponse.data) : null;
            
            if (legacyMetrics) {
              const extractedMeasurements: BodyMeasurements = {
                id: legacyMetrics.id,
                userId: legacyMetrics.userId,
                chest: legacyMetrics.chest ? parseFloat(legacyMetrics.chest) : null,
                waist: legacyMetrics.waist ? parseFloat(legacyMetrics.waist) : null,
                hips: legacyMetrics.hips ? parseFloat(legacyMetrics.hips) : null,
                biceps: legacyMetrics.biceps ? parseFloat(legacyMetrics.biceps) : null,
                forearms: legacyMetrics.forearms ? parseFloat(legacyMetrics.forearms) : null,
                thighs: legacyMetrics.thighs ? parseFloat(legacyMetrics.thighs) : null,
                calves: legacyMetrics.calves ? parseFloat(legacyMetrics.calves) : null,
                neck: legacyMetrics.neck ? parseFloat(legacyMetrics.neck) : null,
                measurementDate: legacyMetrics.measurementDate,
                notes: legacyMetrics.notes,
                isGoal: legacyMetrics.isGoal,
                created_at: legacyMetrics.created_at,
                updated_at: legacyMetrics.updated_at
              };
              console.log('✅ Extracted measurements from legacy data:', extractedMeasurements);
              setCurrentMeasurements(extractedMeasurements);
            }
          }

          // Fetch current composition (new API)
          try {
            const compositionResponse = await bodyCompositionService.getCurrentComposition(token);
            if (compositionResponse.success && compositionResponse.data) {
              const compositionData = (compositionResponse.data as any).composition || compositionResponse.data;
              console.log('✅ Setting current composition:', compositionData);
              setCurrentComposition(compositionData);
            }
          } catch (error) {
            console.log('⚠️ New composition API not available, extracting from legacy data');
            // Extract composition data from currentMetrics for fallback
            const legacyMetrics = (currentResponse.success && currentResponse.data) ? 
              ((currentResponse.data as any).metrics || currentResponse.data) : null;
            
            if (legacyMetrics) {
              const extractedComposition: BodyComposition = {
                id: legacyMetrics.id,
                userId: legacyMetrics.userId,
                bodyFatPercentage: legacyMetrics.bodyFatPercentage ? parseFloat(legacyMetrics.bodyFatPercentage) : null,
                muscleMass: legacyMetrics.muscleMass ? parseFloat(legacyMetrics.muscleMass) : null,
                boneMass: legacyMetrics.boneMass ? parseFloat(legacyMetrics.boneMass) : null,
                waterPercentage: legacyMetrics.waterPercentage ? parseFloat(legacyMetrics.waterPercentage) : null,
                measurementDate: legacyMetrics.measurementDate,
                notes: legacyMetrics.notes,
                isGoal: legacyMetrics.isGoal,
                created_at: legacyMetrics.created_at,
                updated_at: legacyMetrics.updated_at
              };
              console.log('✅ Extracted composition from legacy data:', extractedComposition);
              setCurrentComposition(extractedComposition);
            }
          }

          // Fetch metrics history and separate into measurements and composition
          const historyResponse = await bodyMetricsService.getMetricsHistory(token, { limit: 10 });
          if (historyResponse.success && historyResponse.data) {
            console.log('History response:', historyResponse.data);
            // API returns data.metrics, not data.items
            const historyData = historyResponse.data.metrics || historyResponse.data.items || [];
            console.log('Setting metrics history:', historyData);
            setMetricsHistory(historyData || []);

            // Separate history data for the new UI tabs
            const measurementsData: BodyMeasurements[] = [];
            const compositionData: BodyComposition[] = [];

            historyData.forEach((item: any) => {
              // Check if this item has measurement data (circumference)
              if (item.chest || item.waist || item.hips || item.biceps || item.forearms || item.thighs || item.calves || item.neck) {
                measurementsData.push({
                  id: item.id,
                  userId: item.userId,
                  chest: item.chest ? parseFloat(item.chest) : null,
                  waist: item.waist ? parseFloat(item.waist) : null,
                  hips: item.hips ? parseFloat(item.hips) : null,
                  biceps: item.biceps ? parseFloat(item.biceps) : null,
                  forearms: item.forearms ? parseFloat(item.forearms) : null,
                  thighs: item.thighs ? parseFloat(item.thighs) : null,
                  calves: item.calves ? parseFloat(item.calves) : null,
                  neck: item.neck ? parseFloat(item.neck) : null,
                  measurementDate: item.measurementDate,
                  notes: item.notes,
                  isGoal: item.isGoal,
                  created_at: item.created_at,
                  updated_at: item.updated_at
                });
              }

              // Check if this item has composition data
              if (item.bodyFatPercentage || item.muscleMass || item.boneMass || item.waterPercentage) {
                compositionData.push({
                  id: item.id,
                  userId: item.userId,
                  bodyFatPercentage: item.bodyFatPercentage ? parseFloat(item.bodyFatPercentage) : null,
                  muscleMass: item.muscleMass ? parseFloat(item.muscleMass) : null,
                  boneMass: item.boneMass ? parseFloat(item.boneMass) : null,
                  waterPercentage: item.waterPercentage ? parseFloat(item.waterPercentage) : null,
                  measurementDate: item.measurementDate,
                  notes: item.notes,
                  isGoal: item.isGoal,
                  created_at: item.created_at,
                  updated_at: item.updated_at
                });
              }
            });

            console.log('✅ Separated measurements history:', measurementsData);
            console.log('✅ Separated composition history:', compositionData);
            setMeasurementsHistory(measurementsData);
            setCompositionHistory(compositionData);
          } else {
            setMetricsHistory([]);
            setMeasurementsHistory([]);
            setCompositionHistory([]);
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
          console.error('API Error details:', apiError);
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
  }, [token, authUser]);

  // Single useEffect to fetch data when component mounts and auth is ready
  useEffect(() => {
    console.log('🔄 BodyMetrics useEffect triggered:', {
      hasToken: !!token,
      hasUser: !!authUser,
      authLoading
    });
    
    if (token && authUser && !authLoading) {
      console.log('✅ All conditions met, fetching data...');
      fetchAllData();
    }
  }, [token, authUser, authLoading]);

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

  // Handler for body measurements dialog
  const handleMeasurementsSubmit = async () => {
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Create measurements data object
      const measurementsData: CreateBodyMeasurementsRequest = {
        measurementDate: measurementsForm.measurementDate,
        notes: measurementsForm.notes || undefined
      };

      // Add non-empty measurements
      if (measurementsForm.chest) measurementsData.chest = parseFloat(measurementsForm.chest);
      if (measurementsForm.waist) measurementsData.waist = parseFloat(measurementsForm.waist);
      if (measurementsForm.hips) measurementsData.hips = parseFloat(measurementsForm.hips);
      if (measurementsForm.biceps) measurementsData.biceps = parseFloat(measurementsForm.biceps);
      if (measurementsForm.forearms) measurementsData.forearms = parseFloat(measurementsForm.forearms);
      if (measurementsForm.thighs) measurementsData.thighs = parseFloat(measurementsForm.thighs);
      if (measurementsForm.calves) measurementsData.calves = parseFloat(measurementsForm.calves);
      if (measurementsForm.neck) measurementsData.neck = parseFloat(measurementsForm.neck);

      console.log('Submitting measurements:', measurementsData);

      // Try new API first, fallback to legacy
      try {
        await bodyMeasurementsService.createMeasurements(token, measurementsData);
      } catch (newApiError) {
        console.log('New measurements API not available, using legacy API');
        await bodyMetricsService.createMetrics(token, measurementsData);
      }

      setSuccess('Body measurements saved successfully!');
      setMeasurementsDialogOpen(false);
      
      // Reset form
      setMeasurementsForm({
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        forearms: '',
        thighs: '',
        calves: '',
        neck: '',
        notes: '',
        measurementDate: new Date().toISOString().split('T')[0]
      });
      
      // Refresh data
      fetchAllData();
    } catch (error) {
      console.error('Error saving measurements:', error);
      setError('Failed to save measurements. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handler for body composition dialog
  const handleCompositionSubmit = async () => {
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Create composition data object
      const compositionData: CreateBodyCompositionRequest = {
        measurementDate: compositionForm.measurementDate,
        notes: compositionForm.notes || undefined
      };

      // Add non-empty composition data
      if (compositionForm.bodyFatPercentage) compositionData.bodyFatPercentage = parseFloat(compositionForm.bodyFatPercentage);
      if (compositionForm.muscleMass) compositionData.muscleMass = parseFloat(compositionForm.muscleMass);
      if (compositionForm.boneMass) compositionData.boneMass = parseFloat(compositionForm.boneMass);
      if (compositionForm.waterPercentage) compositionData.waterPercentage = parseFloat(compositionForm.waterPercentage);

      console.log('Submitting composition:', compositionData);

      // Try new API first, fallback to legacy
      try {
        await bodyCompositionService.logComposition(token, compositionData);
      } catch (newApiError) {
        console.log('New composition API not available, using legacy API');
        await bodyMetricsService.createMetrics(token, compositionData);
      }

      setSuccess('Body composition saved successfully!');
      setCompositionDialogOpen(false);
      
      // Reset form
      setCompositionForm({
        bodyFatPercentage: '',
        muscleMass: '',
        boneMass: '',
        waterPercentage: '',
        notes: '',
        measurementDate: new Date().toISOString().split('T')[0]
      });
      
      // Refresh data
      fetchAllData();
    } catch (error) {
      console.error('Error saving composition:', error);
      setError('Failed to save composition. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenGoalDialog = () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now
    
    setGoalForm({
      targetWeight: currentMetrics?.targetWeight || '',
      targetBodyFat: currentMetrics?.targetBodyFat || '',
      targetMuscleMass: currentMetrics?.targetMuscleMass || '',
      targetChest: currentMetrics?.targetChest || '',
      targetWaist: currentMetrics?.targetWaist || '',
      targetHips: currentMetrics?.targetHips || '',
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
          muscleMass: goalForm.targetMuscleMass ? parseFloat(goalForm.targetMuscleMass) : undefined,
          chest: goalForm.targetChest ? parseFloat(goalForm.targetChest) : undefined,
          waist: goalForm.targetWaist ? parseFloat(goalForm.targetWaist) : undefined,
          hips: goalForm.targetHips ? parseFloat(goalForm.targetHips) : undefined,
          notes: goalForm.notes || undefined,
          isGoal: true
        };

        console.log('🎯 Submitting goal data:', goalData);

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

  // Debug logging for render conditions
  console.log('🎯 BodyMetrics render check:', {
    hasToken: !!token,
    hasUser: !!authUser,
    authLoading,
    willShowLoading: !token || !authUser || authLoading
  });

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
        {/* Hero Header Section */}
        <Box sx={{ 
          mb: 6,
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Background Decorative Elements */}
          <Box sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 200,
            background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0
          }} />
          
          <Typography variant="h1" sx={{ 
            mb: 2,
            background: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '4rem' },
            position: 'relative',
            zIndex: 1
          }}>
            BODY METRICS
          </Typography>
          
          <Typography variant="h5" sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
            position: 'relative',
            zIndex: 1
          }}>
            Transform your fitness journey with precision tracking and beautiful insights
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleOpenMetricsDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 25px rgba(233, 69, 96, 0.3)'
                }
              }}
            >
              Record Metrics
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Scale />}
              onClick={handleOpenWeightDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: '#1a1a2e',
                color: '#1a1a2e',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#e94560',
                  color: '#e94560',
                  backgroundColor: 'rgba(233, 69, 96, 0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Log Weight
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<Target />}
              onClick={handleOpenGoalDialog}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: '#00d4aa',
                color: '#00d4aa',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: '#00b894',
                  color: '#00b894',
                  backgroundColor: 'rgba(0, 212, 170, 0.05)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Set Goal
            </Button>
          </Box>
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
                fontSize: '1rem',
                boxShadow: '0px 4px 20px rgba(0, 212, 170, 0.2)',
                border: '1px solid rgba(0, 212, 170, 0.3)'
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
                fontSize: '1rem',
                boxShadow: '0px 4px 20px rgba(255, 71, 87, 0.2)',
                border: '1px solid rgba(255, 71, 87, 0.3)'
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Current Metrics Dashboard */}
        {currentMetrics && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 700,
              color: 'text.primary'
            }}>
              Current Status
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}>
                    {currentMetrics.weight || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    mb: 2
                  }}>
                    {currentMetrics.weight ? (currentMetrics.weightUnit || 'kg') : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Current Weight
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}>
                    {currentMetrics.height || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    mb: 2
                  }}>
                    {currentMetrics.height ? (currentMetrics.heightUnit || 'cm') : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Height
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}>
                    {currentMetrics.bmi || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    mb: 2
                  }}>
                    BMI
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Body Mass Index
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }} />
                  <Typography variant="h2" sx={{ 
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}>
                    {currentMetrics.bodyFatPercentage || 'N/A'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    mb: 2
                  }}>
                    {currentMetrics.bodyFatPercentage ? '%' : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Body Fat
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Enhanced Tabbed Interface */}
        <Card sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ 
            background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)',
            px: 3
          }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="body metrics tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #e94560 0%, #ff9f43 100%)'
                }
              }}
            >
              <Tab 
                label="Measurements" 
                icon={<FitnessCenter />} 
                iconPosition="start"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  '&.Mui-selected': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
              <Tab 
                label="Composition" 
                icon={<Analytics />} 
                iconPosition="start"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  '&.Mui-selected': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
              <Tab 
                label="Weight" 
                icon={<Scale />} 
                iconPosition="start"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  '&.Mui-selected': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
              <Tab 
                label="History" 
                icon={<History />} 
                iconPosition="start"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  '&.Mui-selected': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
              <Tab 
                label="Goals" 
                icon={<Target />} 
                iconPosition="start"
                sx={{
                  color: 'white',
                  opacity: 0.8,
                  '&.Mui-selected': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
            </Tabs>
          </Box>

          {/* Tab Content with Enhanced Styling */}
          <Box sx={{ p: 4, background: 'white' }}>
            {/* Tab 0: Body Measurements (Circumference) */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Body Measurements (Circumference)</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setMeasurementsDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Record Measurements
                </Button>
              </Box>

              {/* Current Measurements Display */}
              {currentMeasurements || currentMetrics ? (
                <Card sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Current Measurements</Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Chest', value: (currentMeasurements?.chest || currentMetrics?.chest), unit: 'cm' },
                      { label: 'Waist', value: (currentMeasurements?.waist || currentMetrics?.waist), unit: 'cm' },
                      { label: 'Hips', value: (currentMeasurements?.hips || currentMetrics?.hips), unit: 'cm' },
                      { label: 'Biceps', value: (currentMeasurements?.biceps || currentMetrics?.biceps), unit: 'cm' },
                      { label: 'Forearms', value: (currentMeasurements?.forearms || currentMetrics?.forearms), unit: 'cm' },
                      { label: 'Thighs', value: (currentMeasurements?.thighs || currentMetrics?.thighs), unit: 'cm' },
                      { label: 'Calves', value: (currentMeasurements?.calves || currentMetrics?.calves), unit: 'cm' },
                      { label: 'Neck', value: (currentMeasurements?.neck || currentMetrics?.neck), unit: 'cm' }
                    ].map((measurement) => (
                      <Grid item xs={12} sm={6} md={3} key={measurement.label}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h6" color="primary.main">
                            {measurement.value || 'N/A'} {measurement.value ? measurement.unit : ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {measurement.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No body measurements recorded yet. Click "Record Measurements" to start tracking your circumference measurements.
                </Alert>
              )}

              {/* Measurements History */}
              <Typography variant="h6" sx={{ mb: 2 }}>Measurements History</Typography>
              {Array.isArray(measurementsHistory) && measurementsHistory.length > 0 ? (
                <Box>
                  {measurementsHistory.map((measurement, index) => (
                    <Card key={measurement.id || index} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Date</Typography>
                          <Typography variant="body1">{measurement.measurementDate}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Chest</Typography>
                          <Typography variant="body1">{measurement.chest || 'N/A'} cm</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Waist</Typography>
                          <Typography variant="body1">{measurement.waist || 'N/A'} cm</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Hips</Typography>
                          <Typography variant="body1">{measurement.hips || 'N/A'} cm</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Biceps</Typography>
                          <Typography variant="body1">{measurement.biceps || 'N/A'} cm</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                          <Typography variant="body2" color="text.secondary">Thighs</Typography>
                          <Typography variant="body1">{measurement.thighs || 'N/A'} cm</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No measurements history available yet. Start recording your body measurements to see your progress here.
                </Typography>
              )}
            </TabPanel>

            {/* Tab 1: Body Composition (Body Fat, Muscle Mass, etc.) */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Body Composition</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCompositionDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Log Composition
                </Button>
              </Box>

              {/* Current Composition Display */}
              {currentComposition || currentMetrics ? (
                <Card sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Current Body Composition</Typography>
                  <Grid container spacing={3}>
                    {[
                      { label: 'Body Fat %', value: (currentComposition?.bodyFatPercentage || currentMetrics?.bodyFatPercentage), unit: '%' },
                      { label: 'Muscle Mass', value: (currentComposition?.muscleMass || currentMetrics?.muscleMass), unit: 'kg' },
                      { label: 'Bone Mass', value: (currentComposition?.boneMass || currentMetrics?.boneMass), unit: 'kg' },
                      { label: 'Water %', value: (currentComposition?.waterPercentage || currentMetrics?.waterPercentage), unit: '%' }
                    ].map((composition) => (
                      <Grid item xs={12} sm={6} md={3} key={composition.label}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h6" color="secondary.main">
                            {composition.value || 'N/A'} {composition.value ? composition.unit : ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {composition.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No body composition data recorded yet. Click "Log Composition" to start tracking your body fat percentage, muscle mass, and more.
                </Alert>
              )}

              {/* Composition History */}
              <Typography variant="h6" sx={{ mb: 2 }}>Composition History</Typography>
              {Array.isArray(compositionHistory) && compositionHistory.length > 0 ? (
                <Box>
                  {compositionHistory.map((composition, index) => (
                    <Card key={composition.id || index} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Date</Typography>
                          <Typography variant="body1">{composition.measurementDate}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Body Fat %</Typography>
                          <Typography variant="body1">{composition.bodyFatPercentage || 'N/A'}%</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Muscle Mass</Typography>
                          <Typography variant="body1">{composition.muscleMass || 'N/A'} kg</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Water %</Typography>
                          <Typography variant="body1">{composition.waterPercentage || 'N/A'}%</Typography>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No composition history available yet. Start logging your body composition to see your progress here.
                </Typography>
              )}
            </TabPanel>

            {/* Tab 2: Weight Tracking */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Weight History</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setWeightDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Log Weight
                </Button>
              </Box>

              {/* Current Weight Display */}
              {currentMetrics?.weight && (
                <Card sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Current Weight</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" color="primary.main">
                          {currentMetrics.weight} {currentMetrics.weightUnit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Current Weight
                        </Typography>
                      </Box>
                    </Grid>
                    {currentMetrics.height && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="secondary.main">
                            {currentMetrics.height} {currentMetrics.heightUnit}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Height
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {currentMetrics.bmi && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="info.main">
                            {currentMetrics.bmi}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            BMI
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )}
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

            {/* Tab 3: History */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Complete Metrics History</Typography>
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
                          <Typography variant="body2" color="text.secondary">Body Fat</Typography>
                          <Typography variant="body1">{metric.bodyFatPercentage || 'N/A'}%</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Typography variant="body2" color="text.secondary">Muscle Mass</Typography>
                          <Typography variant="body1">{metric.muscleMass || 'N/A'} kg</Typography>
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

            {/* Tab 4: Goals */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Fitness Goals</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setGoalDialogOpen(true)}
                  sx={{ ml: 2 }}
                >
                  Set Goal
                </Button>
              </Box>

              {/* Current Goal Display */}
              {goals.length > 0 && (
                <Card sx={{ mb: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Current Active Goal</Typography>
                  <Grid container spacing={3}>
                    {goals[0].targetWeight && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="primary.main">
                            {goals[0].targetWeight} {goals[0].weightUnit || 'kg'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Target Weight
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {goals[0].targetBodyFat && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="secondary.main">
                            {goals[0].targetBodyFat}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Target Body Fat %
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {goals[0].targetMuscleMass && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="info.main">
                            {goals[0].targetMuscleMass} kg
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Target Muscle Mass
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {goals[0].measurementDate && (
                      <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                          <Typography variant="h4" color="warning.main">
                            {new Date(goals[0].measurementDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Target Date
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Card>
              )}
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
          </Box>
        </Card>
      </Container>

      {/* Beautifully Redesigned Dialogs */}
      
      {/* Metrics Dialog */}
      <Dialog 
        open={metricsDialogOpen} 
        onClose={() => setMetricsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            📊 Record Body Metrics
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Body Fat %"
                value={metricsForm.bodyFatPercentage}
                onChange={(e) => setMetricsForm({ ...metricsForm, bodyFatPercentage: e.target.value })}
                placeholder="22.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Muscle Mass (kg)"
                value={metricsForm.muscleMass}
                onChange={(e) => setMetricsForm({ ...metricsForm, muscleMass: e.target.value })}
                placeholder="35.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                value={metricsForm.chest}
                onChange={(e) => setMetricsForm({ ...metricsForm, chest: e.target.value })}
                placeholder="95.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                value={metricsForm.waist}
                onChange={(e) => setMetricsForm({ ...metricsForm, waist: e.target.value })}
                placeholder="78.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                value={metricsForm.hips}
                onChange={(e) => setMetricsForm({ ...metricsForm, hips: e.target.value })}
                placeholder="95.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Biceps (cm)"
                value={metricsForm.biceps}
                onChange={(e) => setMetricsForm({ ...metricsForm, biceps: e.target.value })}
                placeholder="28.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thighs (cm)"
                value={metricsForm.thighs}
                onChange={(e) => setMetricsForm({ ...metricsForm, thighs: e.target.value })}
                placeholder="52.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calves (cm)"
                value={metricsForm.calves}
                onChange={(e) => setMetricsForm({ ...metricsForm, calves: e.target.value })}
                placeholder="35.00"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#1a1a2e'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a1a2e'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Button 
            onClick={() => setMetricsDialogOpen(false)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#1a1a2e',
              color: '#1a1a2e',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#e94560',
                color: '#e94560',
                backgroundColor: 'rgba(233, 69, 96, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleMetricsSubmit} 
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 25px rgba(233, 69, 96, 0.3)'
              }
            }}
          >
            Save Metrics
          </Button>
        </DialogActions>
      </Dialog>

      {/* Body Measurements Dialog */}
      <Dialog 
        open={measurementsDialogOpen} 
        onClose={() => setMeasurementsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            📏 Record Body Measurements
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                value={measurementsForm.chest}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, chest: e.target.value })}
                placeholder="95.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                value={measurementsForm.waist}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, waist: e.target.value })}
                placeholder="78.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hips (cm)"
                value={measurementsForm.hips}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, hips: e.target.value })}
                placeholder="95.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Biceps (cm)"
                value={measurementsForm.biceps}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, biceps: e.target.value })}
                placeholder="32.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Forearms (cm)"
                value={measurementsForm.forearms}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, forearms: e.target.value })}
                placeholder="28.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thighs (cm)"
                value={measurementsForm.thighs}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, thighs: e.target.value })}
                placeholder="58.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calves (cm)"
                value={measurementsForm.calves}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, calves: e.target.value })}
                placeholder="38.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Neck (cm)"
                value={measurementsForm.neck}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, neck: e.target.value })}
                placeholder="40.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Measurement Date"
                type="date"
                value={measurementsForm.measurementDate}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, measurementDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={measurementsForm.notes}
                onChange={(e) => setMeasurementsForm({ ...measurementsForm, notes: e.target.value })}
                placeholder="Any notes about these measurements..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#00d4aa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4aa'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Button 
            onClick={() => setMeasurementsDialogOpen(false)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#00d4aa',
              color: '#00d4aa',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#00b894',
                color: '#00b894',
                backgroundColor: 'rgba(0, 212, 170, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleMeasurementsSubmit} 
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #00d4aa 0%, #00b894 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 25px rgba(0, 212, 170, 0.3)'
              }
            }}
          >
            Save Measurements
          </Button>
        </DialogActions>
      </Dialog>

      {/* Body Composition Dialog */}
      <Dialog 
        open={compositionDialogOpen} 
        onClose={() => setCompositionDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            🧬 Log Body Composition
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Body Fat %"
                value={compositionForm.bodyFatPercentage}
                onChange={(e) => setCompositionForm({ ...compositionForm, bodyFatPercentage: e.target.value })}
                placeholder="22.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Muscle Mass (kg)"
                value={compositionForm.muscleMass}
                onChange={(e) => setCompositionForm({ ...compositionForm, muscleMass: e.target.value })}
                placeholder="35.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bone Mass (kg)"
                value={compositionForm.boneMass}
                onChange={(e) => setCompositionForm({ ...compositionForm, boneMass: e.target.value })}
                placeholder="3.20"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Water %"
                value={compositionForm.waterPercentage}
                onChange={(e) => setCompositionForm({ ...compositionForm, waterPercentage: e.target.value })}
                placeholder="62.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Measurement Date"
                type="date"
                value={compositionForm.measurementDate}
                onChange={(e) => setCompositionForm({ ...compositionForm, measurementDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={compositionForm.notes}
                onChange={(e) => setCompositionForm({ ...compositionForm, notes: e.target.value })}
                placeholder="Any notes about this body composition measurement..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#3742fa'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3742fa'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Button 
            onClick={() => setCompositionDialogOpen(false)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#3742fa',
              color: '#3742fa',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#5c6bc0',
                color: '#5c6bc0',
                backgroundColor: 'rgba(55, 66, 250, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCompositionSubmit} 
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 25px rgba(55, 66, 250, 0.3)'
              }
            }}
          >
            Save Composition
          </Button>
        </DialogActions>
      </Dialog>

      {/* Weight Dialog */}
      <Dialog 
        open={weightDialogOpen} 
        onClose={() => setWeightDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            ⚖️ Log Weight Entry
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight"
                value={weightForm.weight}
                onChange={(e) => setWeightForm({ ...weightForm, weight: e.target.value })}
                placeholder="68.50"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Weight Unit</InputLabel>
                <Select
                  value={weightForm.weightUnit}
                  onChange={(e) => setWeightForm({ ...weightForm, weightUnit: e.target.value })}
                  label="Weight Unit"
                  sx={{
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }}
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
                    setHeightWarningShown(true);
                    if (!confirmed) {
                      return;
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
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
                  sx={{
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                value={weightForm.measurementTime}
                onChange={(e) => setWeightForm({ ...weightForm, measurementTime: e.target.value })}
                type="time"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={weightForm.measurementCondition}
                  onChange={(e) => setWeightForm({ ...weightForm, measurementCondition: e.target.value })}
                  label="Condition"
                  sx={{
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }}
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
                  sx={{
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Stress Level</InputLabel>
                <Select
                  value={weightForm.stressLevel}
                  onChange={(e) => setWeightForm({ ...weightForm, stressLevel: e.target.value })}
                  label="Stress Level"
                  sx={{
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#ff9f43'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff9f43'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Button 
            onClick={() => setWeightDialogOpen(false)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#ff9f43',
              color: '#ff9f43',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#f39c12',
                color: '#f39c12',
                backgroundColor: 'rgba(255, 159, 67, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWeightSubmit} 
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ff9f43 0%, #f39c12 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 25px rgba(255, 159, 67, 0.3)'
              }
            }}
          >
            Log Weight
          </Button>
        </DialogActions>
      </Dialog>

      {/* Goal Dialog */}
      <Dialog 
        open={goalDialogOpen} 
        onClose={() => setGoalDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #e94560 0%, #d63384 100%)',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            🎯 Set Fitness Goal
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Weight (kg)"
                value={goalForm.targetWeight}
                onChange={(e) => setGoalForm({ ...goalForm, targetWeight: e.target.value })}
                placeholder="65.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Muscle Mass (kg)"
                value={goalForm.targetMuscleMass}
                onChange={(e) => setGoalForm({ ...goalForm, targetMuscleMass: e.target.value })}
                placeholder="35.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Chest (cm)"
                value={goalForm.targetChest}
                onChange={(e) => setGoalForm({ ...goalForm, targetChest: e.target.value })}
                placeholder="95.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Waist (cm)"
                value={goalForm.targetWaist}
                onChange={(e) => setGoalForm({ ...goalForm, targetWaist: e.target.value })}
                placeholder="78.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Hips (cm)"
                value={goalForm.targetHips}
                onChange={(e) => setGoalForm({ ...goalForm, targetHips: e.target.value })}
                placeholder="95.00"
                type="number"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                type="date"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '&:hover fieldset': {
                      borderColor: '#e94560'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#e94560'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Button 
            onClick={() => setGoalDialogOpen(false)}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderColor: '#e94560',
              color: '#e94560',
              borderWidth: '2px',
              '&:hover': {
                borderColor: '#d63384',
                color: '#d63384',
                backgroundColor: 'rgba(233, 69, 96, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGoalSubmit} 
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #e94560 0%, #d63384 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d63384 0%, #c2255c 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0px 8px 25px rgba(233, 69, 96, 0.3)'
              }
            }}
          >
            Set Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BodyMetricsPage;
