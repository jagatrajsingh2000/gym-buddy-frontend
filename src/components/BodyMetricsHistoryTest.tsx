import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

/**
 * Test Component for Body Metrics History API Integration
 * This demonstrates how to use the new /api/body-metrics/history endpoint
 */
const BodyMetricsHistoryTest: React.FC = () => {
  const { token } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Test parameters
  const [testPage, setTestPage] = useState(1);
  const [testLimit, setTestLimit] = useState(10);
  const [testStartDate, setTestStartDate] = useState('');
  const [testEndDate, setTestEndDate] = useState('');

  // Fetch body metrics history
  const fetchHistory = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params: any = {
        page: testPage,
        limit: testLimit
      };

      // Add date filters if set
      if (testStartDate) params.startDate = testStartDate;
      if (testEndDate) params.endDate = testEndDate;

      const response = await bodyMeasurementsService.getBodyMetricsHistory(token, params);
      
      if (response.success && response.data) {
        setMeasurements(response.data.metrics || []);
        setPagination(response.data.pagination || null);
        setSuccess(`History loaded successfully! Found ${response.data.metrics?.length || 0} measurements`);
      } else {
        setError(response.message || 'Failed to fetch history');
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
      fetchHistory();
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics History API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics History API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>/api/body-metrics/history</code> endpoint with pagination and filtering
      </Typography>

      {/* Test Parameters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 Test Parameters
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="number"
              label="Page"
              value={testPage}
              onChange={(e) => setTestPage(parseInt(e.target.value) || 1)}
              size="small"
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Limit</InputLabel>
              <Select
                value={testLimit}
                onChange={(e) => setTestLimit(parseInt(e.target.value as string))}
                label="Limit"
              >
                <MenuItem value={5}>5 per page</MenuItem>
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={25}>25 per page</MenuItem>
                <MenuItem value={50}>50 per page</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="Start Date (optional)"
              value={testStartDate}
              onChange={(e) => setTestStartDate(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="End Date (optional)"
              value={testEndDate}
              onChange={(e) => setTestEndDate(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={fetchHistory}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : '🔄 Test API'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              setTestPage(1);
              setTestLimit(10);
              setTestStartDate('');
              setTestEndDate('');
              fetchHistory();
            }}
          >
            🗑️ Reset & Test
          </Button>
        </Box>
      </Card>

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
          <Typography sx={{ ml: 2 }}>Testing history API...</Typography>
        </Box>
      )}

      {/* Pagination Info */}
      {pagination && (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'info.50' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📄 Pagination Information
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="text.secondary">Current Page</Typography>
              <Typography variant="h6">{pagination.currentPage}</Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="text.secondary">Total Pages</Typography>
              <Typography variant="h6">{pagination.totalPages}</Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="text.secondary">Total Items</Typography>
              <Typography variant="h6">{pagination.totalItems}</Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle2" color="text.secondary">Items Per Page</Typography>
              <Typography variant="h6">{pagination.itemsPerPage}</Typography>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* API Response Display */}
      {measurements.length > 0 && (
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            📏 Measurements History ({measurements.length} items)
          </Typography>
          
          <Grid container spacing={2}>
            {measurements.map((measurement, index) => (
              <Grid item xs={12} sm={6} md={4} key={measurement.id}>
                <Card sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                    </Typography>
                    <Chip 
                      label={`#${measurement.id}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Chest</Typography>
                      <Typography variant="body2">{bodyMetricsUtils.formatMeasurement(measurement.chest)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Waist</Typography>
                      <Typography variant="body2">{bodyMetricsUtils.formatMeasurement(measurement.waist)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Hips</Typography>
                      <Typography variant="body2">{bodyMetricsUtils.formatMeasurement(measurement.hips)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Biceps</Typography>
                      <Typography variant="body2">{bodyMetricsUtils.formatMeasurement(measurement.biceps)}</Typography>
                    </Grid>
                  </Grid>
                  
                  {measurement.notes && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">Notes:</Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                        "{measurement.notes}"
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* No Data State */}
      {!loading && measurements.length === 0 && !error && (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No measurements found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {testStartDate || testEndDate 
              ? 'No measurements found for the selected date range. Try adjusting your filters.'
              : 'No body measurements have been recorded yet, or the API returned no data.'
            }
          </Typography>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'success.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 History API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>GET /api/body-metrics/history</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Query Parameters:</strong> page, limit, startDate, endDate (all optional)
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response Format:</strong> JSON with metrics array and pagination object
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Pagination:</strong> Supports page-based navigation with configurable limits
        </Typography>
        <Typography variant="body2">
          <strong>Date Filtering:</strong> Filter measurements by date range (YYYY-MM-DD format)
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsHistoryTest;
