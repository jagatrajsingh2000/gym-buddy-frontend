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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Divider,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  Search, 
  Visibility, 
  Edit, 
  Delete, 
  ExpandMore, 
  ExpandLess,
  AccessTime,
  History,
  Straighten,
  Notes,
  Info,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, ExtendedBodyMeasurements } from '../services';

/**
 * Test Component for Body Metrics Get By ID API Integration
 * This demonstrates how to use the new GET /api/body-metrics/:id endpoint
 */
const BodyMetricsByIdTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [measurement, setMeasurement] = useState<ExtendedBodyMeasurements | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch available measurement IDs for testing
  const fetchAvailableIds = async () => {
    if (!token) return;

    try {
      const response = await bodyMeasurementsService.getBodyMetricsHistory(token, { page: 1, limit: 20 });
      
      if (response.success && response.data) {
        const ids = response.data.metrics.map(m => m.id);
        setAvailableIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch available IDs:', err);
    }
  };

  // Fetch measurement by ID
  const fetchMeasurement = async (id: number) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setMeasurement(null);

    try {
      const response = await bodyMeasurementsService.getBodyMetricsById(token, id);
      
      if (response.success && response.data) {
        setMeasurement(response.data.bodyMetrics);
        setShowDetails(true);
      } else {
        setError(response.message || 'Failed to fetch measurement');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search by ID
  const handleSearch = () => {
    const id = parseInt(searchId);
    if (isNaN(id) || id <= 0) {
      setError('Please enter a valid measurement ID');
      return;
    }
    fetchMeasurement(id);
  };

  // Handle quick ID selection
  const handleQuickSelect = (id: number) => {
    setSearchId(id.toString());
    fetchMeasurement(id);
  };

  // Get measurement summary for display
  const getMeasurementSummary = (measurement: ExtendedBodyMeasurements) => {
    const measurements = [];
    if (measurement.chest) measurements.push({ key: 'chest', label: 'Chest', value: measurement.chest });
    if (measurement.waist) measurements.push({ key: 'waist', label: 'Waist', value: measurement.waist });
    if (measurement.hips) measurements.push({ key: 'hips', label: 'Hips', value: measurement.hips });
    if (measurement.biceps) measurements.push({ key: 'biceps', label: 'Biceps', value: measurement.biceps });
    if (measurement.forearms) measurements.push({ key: 'forearms', label: 'Forearms', value: measurement.forearms });
    if (measurement.thighs) measurements.push({ key: 'thighs', label: 'Thighs', value: measurement.thighs });
    if (measurement.calves) measurements.push({ key: 'calves', label: 'Calves', value: measurement.calves });
    if (measurement.neck) measurements.push({ key: 'neck', label: 'Neck', value: measurement.neck });
    
    return measurements;
  };

  // Check if measurement is recent (within last 7 days)
  const isRecentMeasurement = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Load available IDs on component mount
  useEffect(() => {
    fetchAvailableIds();
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Get By ID API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Get By ID API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>GET /api/body-metrics/:id</code> endpoint for retrieving specific body measurements by their unique identifier
      </Typography>

      {/* Search Section */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search />
          Search Measurement by ID
        </Typography>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Measurement ID"
              placeholder="Enter Measurement ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              type="number"
              inputProps={{ min: 1 }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !searchId.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{ minWidth: '120px' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>

        {/* Available IDs for Quick Testing */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            🚀 Quick Test - Available Measurement IDs:
          </Typography>
          
          {availableIds.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {availableIds.slice(0, 10).map((id) => (
                <Chip
                  key={id}
                  label={`ID: ${id}`}
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickSelect(id)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
              {availableIds.length > 10 && (
                <Chip
                  label={`+${availableIds.length - 10} more`}
                  size="small"
                  variant="outlined"
                  color="default"
                />
              )}
            </Box>
          ) : (
            <Alert severity="info">
              No measurements found. Please log some measurements first to test the get by ID functionality.
            </Alert>
          )}
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
      </Card>

      {/* Measurement Details */}
      {measurement && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility />
              Measurement Details - ID: {measurement.id}
            </Typography>
            
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          {/* Basic Information */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              📊 Basic Information
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Measurement Date:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                    {isRecentMeasurement(measurement.measurementDate) && (
                      <Chip 
                        label="Recent" 
                        size="small" 
                        color="success" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Notes:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {measurement.notes || 'No notes provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Measurements Table */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              📏 Body Measurements
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Measurement</strong></TableCell>
                    <TableCell><strong>Value (cm)</strong></TableCell>
                    <TableCell><strong>Formatted</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getMeasurementSummary(measurement).map((item) => (
                    <TableRow key={item.key}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.value}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={bodyMetricsUtils.formatMeasurement(item.value)} 
                          size="small" 
                          variant="outlined"
                          icon={<Straighten />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {getMeasurementSummary(measurement).length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No measurements recorded for this entry.
              </Alert>
            )}
          </Box>

          {/* Expanded Information */}
          <Collapse in={expanded}>
            <Divider sx={{ mb: 3 }} />
            
            {/* Timestamp Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime />
                Timestamp Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                    <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600, mb: 1 }}>
                      📅 Created At:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {bodyMetricsUtils.formatTimestamp(measurement.created_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bodyMetricsUtils.getRelativeTime(measurement.created_at)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.50' }}>
                    <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
                      🔄 Updated At:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {bodyMetricsUtils.formatTimestamp(measurement.updated_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bodyMetricsUtils.getRelativeTime(measurement.updated_at)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Data Export Options */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <History />
                Data Export & Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      const data = JSON.stringify(measurement, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `measurement-${measurement.id}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📥 Export JSON
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      const csvData = [
                        ['Measurement', 'Value (cm)'],
                        ...getMeasurementSummary(measurement).map(item => [item.label, item.value]),
                        ['Date', measurement.measurementDate],
                        ['Notes', measurement.notes || ''],
                        ['Created', measurement.created_at],
                        ['Updated', measurement.updated_at]
                      ];
                      
                      const csv = csvData.map(row => row.join(',')).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `measurement-${measurement.id}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📊 Export CSV
                  </Button>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setMeasurement(null);
                      setSearchId('');
                      setError(null);
                    }}
                  >
                    🔄 New Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Get Body Metrics by ID API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>GET /api/body-metrics/:id</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response:</strong> JSON with complete measurement details including timestamps
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Use Cases:</strong> Detail views, edit forms, data verification, audit trails
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Features:</strong> Complete measurement data, creation/update timestamps, export options
        </Typography>
        <Typography variant="body2">
          <strong>Security:</strong> User can only access their own measurements
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsByIdTest;
