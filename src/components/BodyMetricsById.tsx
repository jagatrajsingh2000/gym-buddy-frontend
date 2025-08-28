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
  Divider,
  IconButton,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  Visibility,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  CalendarToday,
  AccessTime,
  History,
  Straighten,
  Notes,
  Info,
  Warning
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, ExtendedBodyMeasurements } from '../services';

interface BodyMetricsByIdProps {
  measurementId?: number;
  onEdit?: (measurement: ExtendedBodyMeasurements) => void;
  onDelete?: (measurement: ExtendedBodyMeasurements) => void;
  onRefresh?: () => void;
}

const BodyMetricsById: React.FC<BodyMetricsByIdProps> = ({ 
  measurementId, 
  onEdit, 
  onDelete, 
  onRefresh 
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [measurement, setMeasurement] = useState<ExtendedBodyMeasurements | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchId, setSearchId] = useState<string>('');

  // Load measurement if ID is provided
  useEffect(() => {
    if (measurementId && token) {
      fetchMeasurement(measurementId);
    }
  }, [measurementId, token]);

  // Fetch measurement by ID
  const fetchMeasurement = async (id: number) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await bodyMeasurementsService.getBodyMetricsById(token, id);
      
      if (response.success && response.data) {
        setMeasurement(response.data.bodyMetrics);
      } else {
        setError(response.message || 'Failed to fetch measurement');
        setMeasurement(null);
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
      setMeasurement(null);
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

  // Handle edit action
  const handleEdit = () => {
    if (measurement && onEdit) {
      onEdit(measurement);
    }
  };

  // Handle delete action
  const handleDelete = () => {
    if (measurement && onDelete) {
      onDelete(measurement);
    }
  };

  // Get measurement summary for display
  const getMeasurementSummary = () => {
    if (!measurement) return [];
    
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

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to view body metrics
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Search color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🔍 View Body Metrics by ID
            </Typography>
          </Box>
          
          {measurement && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>

        {/* Search Form */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🔍 Search Measurement
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <input
                type="number"
                placeholder="Enter Measurement ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                min="1"
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
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Measurement Details */}
        {measurement && (
          <>
            {/* Basic Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info />
                Measurement Details
              </Typography>
              
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      📊 Measurement ID:
                    </Typography>
                    <Chip 
                      label={measurement.id} 
                      size="small" 
                      variant="outlined" 
                      color="primary" 
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      📅 Measurement Date:
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
                      ⏰ Created:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bodyMetricsUtils.formatTimestamp(measurement.created_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bodyMetricsUtils.getRelativeTime(measurement.created_at)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      🔄 Last Updated:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bodyMetricsUtils.formatTimestamp(measurement.updated_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bodyMetricsUtils.getRelativeTime(measurement.updated_at)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Measurements Table */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Straighten />
                Body Measurements
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Measurement</strong></TableCell>
                      <TableCell><strong>Value</strong></TableCell>
                      <TableCell><strong>Formatted</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getMeasurementSummary().map((item) => (
                      <TableRow key={item.key}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.label}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.value} cm
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
              
              {getMeasurementSummary().length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No measurements recorded for this entry.
                </Alert>
              )}
            </Box>

            {/* Notes Section */}
            {measurement.notes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Notes />
                  Notes
                </Typography>
                
                <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                  <Typography variant="body2">
                    "{measurement.notes}"
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setExpanded(!expanded)}
                startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
              
              {onEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  startIcon={<Edit />}
                >
                  Edit Measurement
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setShowDeleteConfirm(true)}
                  startIcon={<Delete />}
                >
                  Delete Measurement
                </Button>
              )}
            </Box>

            {/* Expanded Information */}
            <Collapse in={expanded}>
              <Divider sx={{ mb: 3 }} />
              
              {/* Timestamp Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        <strong>Date:</strong> {bodyMetricsUtils.formatTimestamp(measurement.created_at)}
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
                        <strong>Date:</strong> {bodyMetricsUtils.formatTimestamp(measurement.updated_at)}
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
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
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
                          ...getMeasurementSummary().map(item => [item.label, item.value]),
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
                        if (onRefresh) onRefresh();
                      }}
                    >
                      🔄 Refresh Data
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </>
        )}

        {/* No Measurement State */}
        {!loading && !measurement && !error && (
          <Alert severity="info">
            Enter a measurement ID above to view detailed information.
          </Alert>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete measurement ID {measurement?.id}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          📝 Get Body Metrics by ID API Endpoint Information
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
        <Typography variant="body2">
          <strong>Features:</strong> Complete measurement data, creation/update timestamps, export options
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsById;
