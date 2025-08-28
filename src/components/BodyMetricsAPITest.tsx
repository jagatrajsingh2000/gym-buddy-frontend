import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

/**
 * Test Component for Body Metrics API Integration
 * This demonstrates how to use the new /api/body-metrics/current endpoint
 */
const BodyMetricsAPITest: React.FC = () => {
  const { token } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch current body measurements
  const fetchCurrentMeasurements = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.getCurrentBodyMetrics(token);
      
      if (response.success) {
        if (response.data?.metrics) {
          setMeasurements(response.data.metrics);
          setSuccess('Body measurements loaded successfully!');
        } else {
          setMeasurements(null);
          setSuccess(response.message || 'No measurements found');
        }
      } else {
        setError(response.message || 'Failed to fetch measurements');
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
      fetchCurrentMeasurements();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>/api/body-metrics/current</code> endpoint
      </Typography>

      {/* API Test Controls */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={fetchCurrentMeasurements}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : '🔄 Refresh Data'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => {
            setMeasurements(null);
            setError(null);
            setSuccess(null);
          }}
        >
          🗑️ Clear Data
        </Button>
      </Box>

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
          <Typography sx={{ ml: 2 }}>Fetching body metrics...</Typography>
        </Box>
      )}

      {/* API Response Display */}
      {measurements && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📏 Current Body Measurements
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={`Last Updated: ${bodyMetricsUtils.formatMeasurementDate(measurements.measurementDate)}`}
              color="primary"
              variant="outlined"
            />
            {bodyMetricsUtils.isRecentMeasurement(measurements.measurementDate) && (
              <Chip 
                label="Recent (within 30 days)"
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Chest</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.chest)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Waist</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.waist)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Hips</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.hips)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Biceps</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.biceps)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Forearms</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.forearms)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Thighs</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.thighs)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Calves</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.calves)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary">Neck</Typography>
              <Typography variant="h6">
                {bodyMetricsUtils.formatMeasurement(measurements.neck)}
              </Typography>
            </Grid>
          </Grid>

          {/* Notes */}
          {measurements.notes && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Notes:
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{measurements.notes}"
              </Typography>
            </Box>
          )}
        </Card>
      )}

      {/* No Data State */}
      {!loading && !measurements && !error && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No body measurements data found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This means the user hasn't recorded any body measurements yet, or the API returned no data.
          </Typography>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'info.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>GET /api/body-metrics/current</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response Format:</strong> JSON with success/error structure
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Data Fields:</strong> chest, waist, hips, biceps, forearms, thighs, calves, neck
        </Typography>
        <Typography variant="body2">
          <strong>Notes:</strong> All measurements are in centimeters with decimal precision
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsAPITest;
