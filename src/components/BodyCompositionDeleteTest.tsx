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
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService, BodyComposition } from '../services/bodyMetricsService';

const BodyCompositionDeleteTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Composition selection and data
  const [selectedCompositionId, setSelectedCompositionId] = useState<number | ''>('');
  const [availableCompositions, setAvailableCompositions] = useState<BodyComposition[]>([]);
  const [selectedComposition, setSelectedComposition] = useState<BodyComposition | null>(null);

  // Confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compositionToDelete, setCompositionToDelete] = useState<BodyComposition | null>(null);

  // Load available compositions for selection
  useEffect(() => {
    if (token) {
      loadAvailableCompositions();
    }
  }, [token]);

  const loadAvailableCompositions = async () => {
    try {
      const response = await bodyCompositionService.getCompositionHistory(token!, { limit: 50 });
      if (response.success && response.data) {
        setAvailableCompositions(response.data.compositions || []);
      }
    } catch (err) {
      console.error('Error loading compositions:', err);
    }
  };

  const handleCompositionSelect = (compositionId: number) => {
    setSelectedCompositionId(compositionId);
    const composition = availableCompositions.find(c => c.id === compositionId);
    if (composition) {
      setSelectedComposition(composition);
      setShowForm(true);
    }
  };

  const handleDeleteClick = (composition: BodyComposition) => {
    setCompositionToDelete(composition);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!compositionToDelete) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setDeleteDialogOpen(false);

    try {
      const response = await bodyCompositionService.deleteComposition(token!, compositionToDelete.id);
      
      if (response.success) {
        setSuccess(response.message || 'Body composition deleted successfully!');
        
        // Remove from available compositions
        setAvailableCompositions(prev => prev.filter(c => c.id !== compositionToDelete.id));
        
        // Clear selection if it was the deleted one
        if (selectedCompositionId === compositionToDelete.id) {
          setSelectedCompositionId('');
          setSelectedComposition(null);
          setShowForm(false);
        }
        
        // Clear the composition to delete
        setCompositionToDelete(null);
      } else {
        setError(response.message || 'Failed to delete body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompositionToDelete(null);
  };

  const handleClearSelection = () => {
    setSelectedCompositionId('');
    setSelectedComposition(null);
    setShowForm(false);
  };

  const getCompositionSummary = (composition: BodyComposition): string => {
    const parts = [];
    if (composition.bodyFatPercentage) parts.push(`${composition.bodyFatPercentage}% fat`);
    if (composition.muscleMass) parts.push(`${composition.muscleMass}kg muscle`);
    if (composition.boneMass) parts.push(`${composition.boneMass}kg bone`);
    if (composition.waterPercentage) parts.push(`${composition.waterPercentage}% water`);
    
    return parts.length > 0 ? parts.join(', ') : 'No measurements';
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition Delete API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🗑️ Body Composition Delete API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing DELETE /api/body-metrics/composition/:id endpoint with confirmation dialogs and data refresh
        </Typography>

        {/* Composition Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Select Composition to View Details:
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Composition ID</InputLabel>
                <Select
                  value={selectedCompositionId}
                  onChange={(e) => handleCompositionSelect(e.target.value as number)}
                  label="Composition ID"
                >
                  {availableCompositions.map((comp) => (
                    <MenuItem key={comp.id} value={comp.id}>
                      ID {comp.id} - {comp.measurementDate}
                      {comp.bodyFatPercentage && ` (${comp.bodyFatPercentage}% fat)`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Button 
                variant="outlined" 
                onClick={loadAvailableCompositions}
                startIcon={<RefreshIcon />}
                size="small"
              >
                Refresh List
              </Button>
            </Grid>
            
            {selectedCompositionId && (
              <Grid item xs={12} sm={6} md={4}>
                <Button 
                  variant="outlined" 
                  onClick={handleClearSelection}
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="small"
                >
                  Clear Selection
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>

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

        {/* Selected Composition Display */}
        <Collapse in={showForm && !!selectedCompositionId}>
          {selectedComposition && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Composition Details (ID: {selectedComposition.id})
              </Typography>
              
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Body Fat: <strong>{selectedComposition.bodyFatPercentage ? `${selectedComposition.bodyFatPercentage}%` : 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Muscle Mass: <strong>{selectedComposition.muscleMass ? `${selectedComposition.muscleMass} kg` : 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Bone Mass: <strong>{selectedComposition.boneMass ? `${selectedComposition.boneMass} kg` : 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Water %: <strong>{selectedComposition.waterPercentage ? `${selectedComposition.waterPercentage}%` : 'N/A'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date: <strong>{selectedComposition.measurementDate}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Notes: <strong>{selectedComposition.notes || 'No notes'}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Delete Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => handleDeleteClick(selectedComposition)}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                  size="large"
                >
                  {loading ? 'Deleting...' : 'Delete This Composition'}
                </Button>
              </Box>
            </Box>
          )}
        </Collapse>

        {/* Available Compositions List */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Compositions ({availableCompositions.length})
          </Typography>
          
          {availableCompositions.length === 0 ? (
            <Alert severity="info">
              No body composition records found. Create some records first using the Log API.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {availableCompositions.map((composition) => (
                <Grid item xs={12} sm={6} md={4} key={composition.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      '&:hover': { 
                        boxShadow: 2,
                        borderColor: 'primary.main'
                      },
                      ...(selectedCompositionId === composition.id && {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                      })
                    }}
                    onClick={() => handleCompositionSelect(composition.id)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        ID {composition.id}
                      </Typography>
                      <Chip 
                        label="Delete" 
                        size="small" 
                        color="error" 
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(composition);
                        }}
                        icon={<DeleteIcon />}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {composition.measurementDate}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {getCompositionSummary(composition)}
                    </Typography>
                    
                    {composition.notes && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        "{composition.notes}"
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> DELETE /api/body-metrics/composition/:id<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Selected ID:</strong> {selectedCompositionId || 'None'}<br />
            <strong>Available Records:</strong> {availableCompositions.length}
          </Typography>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="error" />
              Confirm Deletion
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this body composition measurement?
            </DialogContentText>
            
            {compositionToDelete && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Composition to Delete:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>ID:</strong> {compositionToDelete.id}<br />
                  <strong>Date:</strong> {compositionToDelete.measurementDate}<br />
                  <strong>Measurements:</strong> {getCompositionSummary(compositionToDelete)}
                </Typography>
              </Box>
            )}
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Warning:</strong> This action cannot be undone. The record will be permanently removed from the database.
            </Alert>
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              {loading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionDeleteTest;
