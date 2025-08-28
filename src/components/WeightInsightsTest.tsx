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
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Speed as SpeedIcon,
  Schedule as ScheduleIcon,
  Mood as MoodIcon,
  Bedtime as BedtimeIcon,
  Warning as StressIcon,
  Analytics as InsightsIcon,
  TipsAndUpdates as RecommendationsIcon,
  Timeline as PatternIcon,
  Analytics as SummaryIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService, WeightInsights } from '../services/bodyMetricsService';

interface WeightInsightsParams {
  period?: number;
  includeRecommendations?: boolean;
}

const WeightInsightsTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [insights, setInsights] = useState<WeightInsights | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<{
    insights: boolean;
    recommendations: boolean;
    patterns: boolean;
    summary: boolean;
  }>({
    insights: true,
    recommendations: true,
    patterns: true,
    summary: true
  });

  // Load insights on component mount
  useEffect(() => {
    if (token) {
      fetchInsights();
    }
  }, [token]);

  const fetchInsights = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params: WeightInsightsParams = {
        period: selectedPeriod,
        includeRecommendations
      };

      const response = await bodyMetricsService.getWeightInsights(token, params);
      
      if (response.success && response.data) {
        setInsights(response.data);
        setSuccess('Weight insights generated successfully!');
      } else {
        setError(response.message || 'Failed to generate weight insights');
      }
    } catch (err) {
      setError('An unexpected error occurred while generating insights');
      console.error('Error fetching weight insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: number) => {
    setSelectedPeriod(period);
    fetchInsights();
  };

  const handleRecommendationsToggle = () => {
    setIncludeRecommendations(!includeRecommendations);
    fetchInsights();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes('stable') || insight.toLowerCase().includes('consistent')) {
      return <CheckCircleIcon color="success" />;
    } else if (insight.toLowerCase().includes('improve') || insight.toLowerCase().includes('consider')) {
      return <LightbulbIcon color="warning" />;
    } else if (insight.toLowerCase().includes('excellent') || insight.toLowerCase().includes('great')) {
      return <CheckCircleIcon color="success" />;
    } else {
      return <PsychologyIcon color="info" />;
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('goal') || recommendation.toLowerCase().includes('target')) {
      return <TimelineIcon color="primary" />;
    } else if (recommendation.toLowerCase().includes('measure') || recommendation.toLowerCase().includes('track')) {
      return <AssessmentIcon color="secondary" />;
    } else if (recommendation.toLowerCase().includes('monitor') || recommendation.toLowerCase().includes('pattern')) {
      return <PatternIcon color="info" />;
    } else {
      return <LightbulbIcon color="warning" />;
    }
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getConsistencyLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Very Poor';
  };

  const getTrendStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'strong':
        return 'error';
      case 'moderate':
        return 'warning';
      case 'weak':
        return 'info';
      case 'stable':
        return 'success';
      default:
        return 'default';
    }
  };

  const getVariabilityColor = (variability: string) => {
    switch (variability.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCorrelationColor = (correlation: string) => {
    switch (correlation.toLowerCase()) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatWeightChange = (change: number) => {
    if (change === 0) return '0 kg';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} kg`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === 0) return '0%';
    const sign = percentage > 0 ? '+' : '';
    return `${sign}${percentage.toFixed(1)}%`;
  };

  const isInsightsDataComplete = (data: any): boolean => {
    return data && 
           data.summary && 
           data.insights && 
           Array.isArray(data.insights) &&
           Array.isArray(data.recommendations) &&
           data.summary.totalEntries !== undefined &&
           data.summary.period &&
           data.summary.weightChange !== undefined &&
           data.summary.weightChangePercentage !== undefined;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight Insights API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧠 Weight Insights API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/weight/insights endpoint with intelligent insights and personalized recommendations
        </Typography>

        {/* Controls */}
        <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            ⚙️ Analysis Parameters
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Analysis Period</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value as number)}
                  label="Analysis Period"
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
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={includeRecommendations}
                    onChange={handleRecommendationsToggle}
                    color="primary"
                  />
                }
                label="Include Recommendations"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                onClick={fetchInsights}
                startIcon={<RefreshIcon />}
                fullWidth
                disabled={loading}
              >
                Generate Insights
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
            <Typography>Generating intelligent insights...</Typography>
          </Box>
        )}

        {/* No Data State */}
        {!loading && !insights && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No insights data available. Click "Generate Insights" to fetch data.
          </Alert>
        )}

        {/* Incomplete Data State */}
        {!loading && insights && !isInsightsDataComplete(insights) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Insights data is incomplete. Some sections may not display properly.
          </Alert>
        )}

        {/* Insights Display */}
        {insights && isInsightsDataComplete(insights) && (
          <>
            {/* Summary Section */}
            <Accordion 
              expanded={expandedSections.summary}
              onChange={() => toggleSection('summary')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SummaryIcon color="primary" />
                  <Typography variant="h6">📊 Analysis Summary</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {insights.summary?.totalEntries || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Entries
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" color="secondary" gutterBottom>
                          {insights.summary?.period || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Analysis Period
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" color="info" gutterBottom>
                          {formatWeightChange(insights.summary?.weightChange || 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Weight Change
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPercentage(insights.summary?.weightChangePercentage || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" color={getConsistencyColor(insights.summary?.consistencyScore || 0)} gutterBottom>
                          {insights.summary?.consistencyScore || 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Consistency Score
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getConsistencyLabel(insights.summary?.consistencyScore || 0)}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={insights.summary?.consistencyScore || 0}
                          color={getConsistencyColor(insights.summary?.consistencyScore || 0)}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Trend Strength: 
                    <Chip 
                      label={insights.summary?.trendStrength || 'N/A'}
                      color={getTrendStrengthColor(insights.summary?.trendStrength || 'stable')}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Insights Section */}
            <Accordion 
              expanded={expandedSections.insights}
              onChange={() => toggleSection('insights')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsightsIcon color="info" />
                  <Typography variant="h6">
                    💡 Intelligent Insights ({insights.insights?.length || 0})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {insights.insights?.map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        {getInsightIcon(insight)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={insight}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  )) || (
                    <ListItem>
                      <ListItemText primary="No insights available" />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Recommendations Section */}
            {insights.recommendations && insights.recommendations.length > 0 && (
              <Accordion 
                expanded={expandedSections.recommendations}
                onChange={() => toggleSection('recommendations')}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RecommendationsIcon color="warning" />
                    <Typography variant="h6">
                      🎯 Personalized Recommendations ({insights.recommendations.length})
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {insights.recommendations.map((recommendation, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          {getRecommendationIcon(recommendation)}
                        </ListItemIcon>
                        <ListItemText 
                          primary={recommendation}
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Patterns Section - Only show if patterns data exists */}
            {insights.patterns && (
              <Accordion 
                expanded={expandedSections.patterns}
                onChange={() => toggleSection('patterns')}
                sx={{ mb: 2 }}
              >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PatternIcon color="secondary" />
                  <Typography variant="h6">🔍 Pattern Analysis</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon color="primary" />
                          Measurement Patterns
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Frequency
                          </Typography>
                          <Chip 
                            label={insights.patterns?.measurementFrequency || 'N/A'}
                            color="primary"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Best Time
                          </Typography>
                          <Chip 
                            label={insights.patterns?.bestMeasurementTime || 'N/A'}
                            color="secondary"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Variability
                          </Typography>
                          <Chip 
                            label={insights.patterns?.weightVariability || 'N/A'}
                            color={getVariabilityColor(insights.patterns?.weightVariability || 'low')}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PsychologyIcon color="secondary" />
                          Correlation Factors
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BedtimeIcon />
                            Sleep Impact
                          </Typography>
                          <Chip 
                            label={insights.patterns?.correlationFactors?.sleep || 'N/A'}
                            color={getCorrelationColor(insights.patterns?.correlationFactors?.sleep || 'low')}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StressIcon />
                            Stress Impact
                          </Typography>
                          <Chip 
                            label={insights.patterns?.correlationFactors?.stress || 'N/A'}
                            color={getCorrelationColor(insights.patterns?.correlationFactors?.stress || 'low')}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MoodIcon />
                            Mood Impact
                          </Typography>
                          <Chip 
                            label={insights.patterns?.correlationFactors?.mood || 'N/A'}
                            color={getCorrelationColor(insights.patterns?.correlationFactors?.mood || 'low')}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            )}

            {/* Raw Data Display */}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Raw Insights Data
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
                    <pre>{JSON.stringify(insights, null, 2)}</pre>
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
            <strong>Endpoint:</strong> GET /api/body-metrics/weight/insights<br />
            <strong>Status:</strong> {loading ? 'Generating...' : (error ? 'Error' : (insights ? 'Success' : 'Ready'))}<br />
            <strong>Selected Period:</strong> {selectedPeriod} days<br />
            <strong>Include Recommendations:</strong> {includeRecommendations ? 'Yes' : 'No'}<br />
            <strong>Insights Data:</strong> {insights ? 'Generated' : 'Not generated'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightInsightsTest;
