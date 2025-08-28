import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  TextField,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  Clear, 
  Update, 
  History,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements, UpdateBodyMetricsRequest } from '../services';

/**
 * Test Component for Body Metrics Update API Integration
 * This demonstrates how to use the new PUT /api/body-metrics/update/:id endpoint
 */
const BodyMetricsUpdateTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurements | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateBodyMetricsRequest>({});
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());
  
  // Test form state
  const [testData, setTestData] = useState<UpdateBodyMetricsRequest>({
    chest: 96.0,
    waist: 77.5,
    notes: 'Updated test measurement'
  });

  // Fetch measurements for testing
  const fetchMeasurements = async () => {
    if (!token) return;

    try {
      const response = await bodyMeasurementsService.getBodyMetricsHistory(token, { page: 1, limit: 10 });
      
      if (response.success && response.data) {
        setMeasurements(response.data.metrics || []);
      } else {
        setError('Failed to fetch measurements for testing');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    }
  };

  // Handle test data changes
  const handleTestDataChange = (field: string, value: string) => {
    const newData = { ...testData };
    
    if (field === 'measurementDate' || field === 'notes') {
      newData[field] = value;
    } else {
      const parsedValue = bodyMetricsUtils.parseMeasurementValue(value);
      if (parsedValue !== undefined) {
        (newData as any)[field] = parsedValue;
      } else {
        delete (newData as any)[field];
      }
    }
    
    setTestData(newData);
  };

  // Test the update API with a specific measurement ID
  const testUpdateMetrics = async (measurementId: number) => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.updateBodyMetrics(token, measurementId, testData);
      
      if (response.success && response.data) {
        setSuccess(`Metrics updated successfully! ID: ${measurementId}`);
        
        // Refresh measurements
        fetchMeasurements();
        
        // Reset test data
        setTestData({
          chest: 96.0,
          waist: 77.5,
          notes: 'Updated test measurement'
        });
      } else {
        setError(response.message || 'Failed to update metrics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open update dialog for a specific measurement
  const openUpdateDialog = (measurement: BodyMeasurements) => {
    setSelectedMeasurement(measurement);
    
    // Initialize update data with current values
    const initialData: UpdateBodyMetricsRequest = {};
    if (measurement.chest) initialData.chest = parseFloat(measurement.chest);
    if (measurement.waist) initialData.waist = parseFloat(measurement.waist);
    if (measurement.hips) initialData.hips = parseFloat(measurement.hips);
    if (measurement.biceps) initialData.biceps = parseFloat(measurement.biceps);
    if (measurement.forearms) initialData.forearms = parseFloat(measurement.forearms);
    if (measurement.thighs) initialData.thighs = parseFloat(measurement.thighs);
    if (measurement.calves) initialData.calves = parseFloat(measurement.calves);
    if (measurement.neck) initialData.neck = parseFloat(measurement.neck);
    if (measurement.measurementDate) initialData.measurementDate = measurement.measurementDate;
    if (measurement.notes) initialData.notes = measurement.notes;
    
    setUpdateData(initialData);
    setModifiedFields(new Set());
    setShowUpdateDialog(true);
  };

  // Handle update dialog data changes
  const handleUpdateDataChange = (field: string, value: string) => {
    if (!selectedMeasurement) return;

    const newData = { ...updateData };
    const originalValue = selectedMeasurement[field as keyof BodyMeasurements];
    const newModifiedFields = new Set(modifiedFields);
    
    if (field === 'measurementDate' || field === 'notes') {
      newData[field] = value;
    } else {
      const parsedValue = bodyMetricsUtils.parseMeasurementValue(value);
      if (parsedValue !== undefined) {
        (newData as any)[field] = parsedValue;
      } else {
        delete (newData as any)[field];
      }
      
      // Track modifications for measurement fields
      const originalNum = originalValue ? parseFloat(originalValue as string) : undefined;
      if (parsedValue !== originalNum) {
        newModifiedFields.add(field);
      } else {
        newModifiedFields.delete(field);
      }
    }
    
    setUpdateData(newData);
    
    // Track modifications for non-measurement fields
    if (field === 'measurementDate' || field === 'notes') {
      if (value !== (originalValue || '')) {
        newModifiedFields.add(field);
      } else {
        newModifiedFields.delete(field);
      }
    }
    setModifiedFields(newModifiedFields);
  };

  // Submit update from dialog
  const submitUpdate = async () => {
    if (!token || !selectedMeasurement) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.updateBodyMetrics(token, selectedMeasurement.id, updateData);
      
      if (response.success && response.data) {
        setSuccess('Measurement updated successfully!');
        setShowUpdateDialog(false);
        fetchMeasurements();
      } else {
        setError(response.message || 'Failed to update measurement');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate random update data
  const generateRandomUpdate = () => {
    const randomData: UpdateBodyMetricsRequest = {
      chest: Math.round((90 + Math.random() * 10) * 10) / 10,
      waist: Math.round((75 + Math.random() * 8) * 10) / 10,
      notes: `Random update ${new Date().toLocaleTimeString()}`
    };
    
    setTestData(randomData);
  };

  // Clear test data
  const clearTestData = () => {
    setTestData({
      chest: 96.0,
      waist: 77.5,
      notes: 'Updated test measurement'
    });
    setSuccess(null);
    setError(null);
  };

  // Load measurements on component mount
  useEffect(() => {
    fetchMeasurements();
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Update API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Update API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>PUT /api/body-metrics/:id</code> endpoint for updating existing body measurements
      </Typography>

      {/* Test Form */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 Test Update Data Form
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Chest (cm)"
              value={testData.chest || ''}
              onChange={(e) => handleTestDataChange('chest', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Waist (cm)"
              value={testData.waist || ''}
              onChange={(e) => handleTestDataChange('waist', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Notes"
              value={testData.notes || ''}
              onChange={(e) => handleTestDataChange('notes', e.target.value)}
              size="small"
              multiline
              rows={1}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Measurement Date"
              type="date"
              value={testData.measurementDate || ''}
              onChange={(e) => handleTestDataChange('measurementDate', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={generateRandomUpdate}
            disabled={loading}
          >
            🎲 Generate Random Update
          </Button>
          
          <Button
            variant="outlined"
            onClick={clearTestData}
            disabled={loading}
          >
            🗑️ Clear Test Data
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

      {/* Measurements Table */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <History />
          Available Measurements for Testing
        </Typography>
        
        {measurements.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Chest</strong></TableCell>
                  <TableCell><strong>Waist</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell>
                      <Chip label={measurement.id} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                    </TableCell>
                    <TableCell>
                      {measurement.chest ? `${measurement.chest} cm` : '-'}
                    </TableCell>
                    <TableCell>
                      {measurement.waist ? `${measurement.waist} cm` : '-'}
                    </TableCell>
                    <TableCell>
                      {measurement.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Update />}
                          onClick={() => testUpdateMetrics(measurement.id)}
                          disabled={loading}
                        >
                          Test Update
                        </Button>
                        
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => openUpdateDialog(measurement)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            No measurements found. Please log some measurements first to test the update functionality.
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={fetchMeasurements}
            disabled={loading}
            startIcon={<History />}
          >
            🔄 Refresh Measurements
          </Button>
        </Box>
      </Card>

      {/* Update Dialog */}
      <Dialog 
        open={showUpdateDialog} 
        onClose={() => setShowUpdateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          ✏️ Update Measurement ID: {selectedMeasurement?.id}
        </DialogTitle>
        <DialogContent>
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Original Values:
          </Typography>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Chest:</strong> {selectedMeasurement?.chest || '-'} cm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Waist:</strong> {selectedMeasurement?.waist || '-'} cm
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Date:</strong> {selectedMeasurement?.measurementDate || '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Notes:</strong> {selectedMeasurement?.notes || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Update Values:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Chest (cm)"
                value={updateData.chest || ''}
                onChange={(e) => handleUpdateDataChange('chest', e.target.value)}
                size="small"
                type="number"
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Waist (cm)"
                value={updateData.waist || ''}
                onChange={(e) => handleUpdateDataChange('waist', e.target.value)}
                size="small"
                type="number"
                inputProps={{ step: 0.1, min: 0 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Measurement Date"
                type="date"
                value={updateData.measurementDate || ''}
                onChange={(e) => handleUpdateDataChange('measurementDate', e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notes"
                value={updateData.notes || ''}
                onChange={(e) => handleUpdateDataChange('notes', e.target.value)}
                size="small"
                multiline
                rows={1}
              />
            </Grid>
          </Grid>
          
          {modifiedFields.size > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
                🔄 Fields to be Updated:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {Array.from(modifiedFields).map((field) => (
                  <Chip 
                    key={field} 
                    label={field} 
                    size="small" 
                    color="warning" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={submitUpdate} 
            variant="contained" 
            color="warning"
            disabled={loading || modifiedFields.size === 0}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Measurement'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'warning.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Update Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>PUT /api/body-metrics/update/:id</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Content-Type:</strong> application/json
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Validation:</strong> At least one field required, all values must be positive
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Request Fields:</strong> All fields are optional, but at least one must be provided
        </Typography>
        <Typography variant="body2">
          <strong>Response:</strong> JSON with updated metrics object and success message
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsUpdateTest;
