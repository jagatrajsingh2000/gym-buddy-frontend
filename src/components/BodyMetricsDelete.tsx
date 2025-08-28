import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Delete,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  History,
  CalendarToday,
  Straighten
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

interface BodyMetricsDeleteProps {
  measurement: BodyMeasurements;
  onSuccess?: (data: any) => void;
  onRefresh?: () => void;
  onCancel?: () => void;
}

const BodyMetricsDelete: React.FC<BodyMetricsDeleteProps> = ({ 
  measurement, 
  onSuccess, 
  onRefresh, 
  onCancel 
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Handle final confirmation
  const handleFinalConfirm = () => {
    setShowFinalConfirmation(true);
  };

  // Execute the delete operation
  const executeDelete = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.deleteBodyMetrics(token, measurement.id);
      
      if (response.success) {
        setSuccess('Body metrics deleted successfully!');
        
        // Call success callback
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Refresh data if callback provided
        if (onRefresh) {
          onRefresh();
        }
        
        // Close dialogs
        setShowDeleteDialog(false);
        setShowFinalConfirmation(false);
      } else {
        setError(response.message || 'Failed to delete body metrics');
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
    setError(null);
    setSuccess(null);
  };

  // Get measurement summary for display
  const getMeasurementSummary = () => {
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

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to delete body metrics
      </Alert>
    );
  }

  if (!measurement) {
    return (
      <Alert severity="error">
        No measurement data provided for deletion
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Delete color="error" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🗑️ Delete Body Metrics
            </Typography>
            <Chip 
              label={`ID: ${measurement.id}`} 
              size="small" 
              variant="outlined" 
              color="error" 
            />
          </Box>
          
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Warning Alert */}
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Warning: This action cannot be undone!
          </Typography>
          <Typography variant="body2">
            Deleting this measurement will permanently remove it from your records. 
            This may affect your progress tracking and analytics.
          </Typography>
        </Alert>

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

        {/* Collapsible Content */}
        <Collapse in={expanded}>
          <Divider sx={{ mb: 3 }} />
          
          {/* Measurement Details */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info />
            Measurement Details to be Deleted
          </Typography>
          
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  📅 Measurement Date:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  📝 Notes:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {measurement.notes || 'No notes provided'}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              📏 Measurements:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {getMeasurementSummary().map((measurement, index) => (
                <Chip 
                  key={index} 
                  label={measurement} 
                  size="small" 
                  variant="outlined"
                  icon={<Straighten />}
                />
              ))}
            </Box>
          </Paper>

          {/* Impact Analysis */}
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            Impact Analysis
          </Typography>
          
          <Box sx={{ mb: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
              <strong>⚠️ This deletion will affect:</strong>
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Progress tracking calculations</li>
              <li>Analytics and trend analysis</li>
              <li>Goal progress calculations</li>
              <li>Historical data completeness</li>
            </ul>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              startIcon={<Info />}
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteClick}
              disabled={loading}
              startIcon={<Delete />}
            >
              Delete Measurement
            </Button>
          </Box>
        </Collapse>
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
          
          <Box sx={{ p: 2, bgcolor: 'error.50', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 600, mb: 1 }}>
              Measurement Details:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Date:</strong> {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Measurements:</strong> {getMeasurementSummary().length} recorded
            </Typography>
            {measurement.notes && (
              <Typography variant="body2">
                <strong>Notes:</strong> {measurement.notes}
              </Typography>
            )}
          </Box>
          
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
          
          <Box sx={{ p: 2, bgcolor: 'error.100', borderRadius: 1, mb: 2 }}>
            <Typography variant="h6" color="error.main" sx={{ fontWeight: 600, mb: 1 }}>
              Body Measurement ID: {measurement.id}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Date:</strong> {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
            </Typography>
            <Typography variant="body2">
              <strong>Measurements:</strong> {getMeasurementSummary().join(', ')}
            </Typography>
          </Box>
          
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
            Type "DELETE" to confirm you understand this action is permanent.
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
          📝 Delete Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>DELETE /api/body-metrics/{measurement.id}</code>
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
        <Typography variant="body2">
          <strong>Important:</strong> This action is permanent and cannot be undone
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsDelete;
