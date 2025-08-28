import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
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
  Divider,
  Grid
} from '@mui/material';
import { 
  Delete, 
  Warning, 
  Error, 
  Info, 
  History,
  CheckCircle,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

/**
 * Test Component for Body Metrics Delete API Integration
 * This demonstrates how to use the new DELETE /api/body-metrics/delete/:id endpoint
 */
const BodyMetricsDeleteTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState<BodyMeasurements | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  // Open delete dialog for a specific measurement
  const openDeleteDialog = (measurement: BodyMeasurements) => {
    setSelectedMeasurement(measurement);
    setShowDeleteDialog(true);
  };

  // Handle final confirmation
  const handleFinalConfirm = () => {
    setShowFinalConfirmation(true);
  };

  // Execute the delete operation
  const executeDelete = async () => {
    if (!token || !selectedMeasurement) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.deleteBodyMetrics(token, selectedMeasurement.id);
      
      if (response.success) {
        setSuccess(`Measurement ID ${selectedMeasurement.id} deleted successfully!`);
        
        // Refresh measurements
        fetchMeasurements();
        
        // Close dialogs
        setShowDeleteDialog(false);
        setShowFinalConfirmation(false);
        setSelectedMeasurement(null);
      } else {
        setError(response.message || 'Failed to delete measurement');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel delete operation
  const handleCancel = () => {
    setShowDeleteDialog(false);
    setShowFinalConfirmation(false);
    setSelectedMeasurement(null);
    setError(null);
    setSuccess(null);
  };

  // Get measurement summary for display
  const getMeasurementSummary = (measurement: BodyMeasurements) => {
    const measurements = [];
    if (measurement.chest) measurements.push(`Chest: ${measurement.chest} cm`);
    if (measurement.waist) measurements.push(`Waist: ${measurement.waist} cm`);
    if (measurement.hips) measurements.push(`Hips: ${measurement.hips} cm`);
    if (measurement.biceps) measurements.push(`Biceps: ${measurement.biceps} cm`);
    if (measurement.forearms) measurements.push(`Forearms: ${measurement.forearms} cm`);
    if (measurement.thighs) measurements.push(`Thighs: ${measurement.thighs} cm`);
    if (measurement.calves) measurements.push(`Calves: ${measurement.calves} cm`);
    if (measurement.neck) measurements.push(`Neck: ${measurement.neck} cm`);
    
    return measurements;
  };

  // Load measurements on component mount
  useEffect(() => {
    fetchMeasurements();
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Delete API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Delete API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>DELETE /api/body-metrics/:id</code> endpoint for permanently removing body measurements
      </Typography>

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

      {/* Warning Alert */}
      <Alert severity="warning" sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          ⚠️ Important: Delete operations are permanent and cannot be undone!
        </Typography>
        <Typography variant="body2">
          This test component allows you to delete actual measurements from your account. 
          Please be careful and only delete measurements you are certain you want to remove permanently.
        </Typography>
      </Alert>

      {/* Measurements Table */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History />
            Available Measurements for Testing
          </Typography>
          
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        {measurements.length > 0 ? (
          <>
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
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => openDeleteDialog(measurement)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
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
          </>
        ) : (
          <Alert severity="info">
            No measurements found. Please log some measurements first to test the delete functionality.
          </Alert>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>
          🗑️ Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to delete this measurement?
          </Typography>
          
          {selectedMeasurement && (
            <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 600, mb: 1 }}>
                Measurement Details:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>ID:</strong> {selectedMeasurement.id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Date:</strong> {bodyMetricsUtils.formatMeasurementDate(selectedMeasurement.measurementDate)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Measurements:</strong> {getMeasurementSummary(selectedMeasurement).length} recorded
              </Typography>
              {selectedMeasurement.notes && (
                <Typography variant="body2">
                  <strong>Notes:</strong> {selectedMeasurement.notes}
                </Typography>
              )}
            </Box>
          )}
          
          <Alert severity="error">
            <Typography variant="body2">
              <strong>⚠️ This action cannot be undone!</strong> The measurement will be permanently removed.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleFinalConfirm} variant="contained" color="error">
            Continue to Final Confirmation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <Dialog open={showFinalConfirmation} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>
          ⚠️ Final Confirmation Required
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            This is your final warning. You are about to permanently delete:
          </Typography>
          
          {selectedMeasurement && (
            <Box sx={{ p: 2, bgcolor: 'error.100', borderRadius: 1, mb: 2 }}>
              <Typography variant="h6" color="error.main" sx={{ fontWeight: 600, mb: 1 }}>
                Body Measurement ID: {selectedMeasurement.id}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Date:</strong> {bodyMetricsUtils.formatMeasurementDate(selectedMeasurement.measurementDate)}
              </Typography>
              <Typography variant="body2">
                <strong>Measurements:</strong> {getMeasurementSummary(selectedMeasurement).join(', ')}
              </Typography>
            </Box>
          )}
          
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>🚨 PERMANENT DELETION:</strong> This action will:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Remove the measurement permanently</li>
              <li>Affect your progress calculations</li>
              <li>Cannot be undone or recovered</li>
            </ul>
          </Alert>
          
          <Typography variant="body2" color="text.secondary">
            Click "Permanently Delete" to confirm you understand this action is permanent.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={executeDelete} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Permanently Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'error.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Delete Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>DELETE /api/body-metrics/:id</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Security:</strong> User can only delete their own measurements
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Response:</strong> JSON with success message
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Important:</strong> This action is permanent and cannot be undone
        </Typography>
        <Typography variant="body2">
          <strong>Use Cases:</strong> Removing incorrect measurements, cleaning duplicates, data privacy requests
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsDeleteTest;
