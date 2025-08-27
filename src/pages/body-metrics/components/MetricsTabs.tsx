import React, { useState } from 'react';
import { Box, Card, Tabs, Tab, Grid, Typography, Button, Alert } from '@mui/material';
import { FitnessCenter, Analytics, Scale, History, Flag as Target, Add as AddIcon } from '@mui/icons-material';
import { BodyMetrics, WeightHistory } from '../../../services';
import TabPanel from './TabPanel';

interface MetricsTabsProps {
  currentMetrics: BodyMetrics | null;
  metricsHistory: BodyMetrics[];
  weightHistory: WeightHistory[];
  goals: BodyMetrics[];
  onOpenMeasurementsDialog: () => void;
  onOpenCompositionDialog: () => void;
  onOpenWeightDialog: () => void;
  onOpenGoalDialog: () => void;
}

const MetricsTabs: React.FC<MetricsTabsProps> = ({
  currentMetrics,
  metricsHistory,
  weightHistory,
  goals,
  onOpenMeasurementsDialog,
  onOpenCompositionDialog,
  onOpenWeightDialog,
  onOpenGoalDialog
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    if (event.target instanceof HTMLElement) {
      event.target.blur();
    }
  };

  return (
    <Card sx={{ 
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Tab Navigation */}
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
            },
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
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
              transition: 'all 0.3s ease',
              '&.Mui-selected': { color: 'white', opacity: 1 },
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
            }}
          />
          <Tab 
            label="Composition" 
            icon={<Analytics />} 
            iconPosition="start"
            sx={{
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              '&.Mui-selected': { color: 'white', opacity: 1 },
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
            }}
          />
          <Tab 
            label="Weight" 
            icon={<Scale />} 
            iconPosition="start"
            sx={{
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              '&.Mui-selected': { color: 'white', opacity: 1 },
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
            }}
          />
          <Tab 
            label="History" 
            icon={<History />} 
            iconPosition="start"
            sx={{
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              '&.Mui-selected': { color: 'white', opacity: 1 },
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
            }}
          />
          <Tab 
            label="Goals" 
            icon={<Target />} 
            iconPosition="start"
            sx={{
              color: 'white',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              '&.Mui-selected': { color: 'white', opacity: 1 },
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:focus-visible': { outline: 'none', boxShadow: 'none' }
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 4, background: 'white' }}>
        {/* Tab 0: Body Measurements */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {/* Current Measurements Display */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
                color: 'white',
                height: '100%'
              }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    📏 Current Measurements
                  </Typography>
                  {currentMetrics ? (
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                              {currentMetrics.chest || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Chest (cm)
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                              {currentMetrics.waist || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Waist (cm)
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                              {currentMetrics.hips || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Hips (cm)
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                              {currentMetrics.biceps || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              Biceps (cm)
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 2 }}>
                        Last updated: {new Date(currentMetrics.measurementDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      No measurements recorded yet
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>

            {/* Action Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                height: '100%'
              }}>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    📐 Record New Measurements
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Track your body circumference measurements to monitor muscle growth and body composition changes.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onOpenMeasurementsDialog}
                    sx={{
                      px: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #3742fa 0%, #5c6bc0 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5c6bc0 0%, #3f51b5 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0px 8px 25px rgba(55, 66, 250, 0.3)'
                      }
                    }}
                  >
                    Record Measurements
                  </Button>
                </Box>
              </Card>
            </Grid>

            {/* History Section */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
                    📊 Measurement History
                  </Typography>
                  
                  {metricsHistory.length > 0 ? (
                    <Box sx={{ overflowX: 'auto' }}>
                      <Grid container spacing={2}>
                        {metricsHistory.slice(0, 5).map((metric, index) => (
                          <Grid item xs={12} sm={6} md={4} key={metric.id || index}>
                            <Card sx={{ 
                              p: 2,
                              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                              border: '1px solid rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)'
                              }
                            }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                {new Date(metric.measurementDate).toLocaleDateString()}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Chest:</Typography>
                                <Typography variant="body2" fontWeight={600}>{metric.chest || 'N/A'} cm</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">Waist:</Typography>
                                <Typography variant="body2" fontWeight={600}>{metric.waist || 'N/A'} cm</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Hips:</Typography>
                                <Typography variant="body2" fontWeight={600}>{metric.hips || 'N/A'} cm</Typography>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No measurement history available
                    </Typography>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 1: Body Composition */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Body Composition</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onOpenCompositionDialog}
              sx={{ ml: 2 }}
            >
              Log Composition
            </Button>
          </Box>

          {/* Current Composition Display */}
          {currentMetrics ? (
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Current Body Composition</Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Body Fat %', value: currentMetrics.bodyFatPercentage, unit: '%' },
                  { label: 'Muscle Mass', value: currentMetrics.muscleMass, unit: 'kg' },
                  { label: 'Bone Mass', value: currentMetrics.boneMass, unit: 'kg' },
                  { label: 'Water %', value: currentMetrics.waterPercentage, unit: '%' }
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
                      <Typography variant="body2" color="text.secondary">Body Fat %</Typography>
                      <Typography variant="body1">{metric.bodyFatPercentage || 'N/A'}%</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Muscle Mass</Typography>
                      <Typography variant="body1">{metric.muscleMass || 'N/A'} kg</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Water %</Typography>
                      <Typography variant="body1">{metric.waterPercentage || 'N/A'}%</Typography>
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
              onClick={onOpenWeightDialog}
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

          {/* Weight History */}
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
              onClick={onOpenGoalDialog}
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

          {/* Goals List */}
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
  );
};

export default MetricsTabs;
