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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Divider
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  RestoreFromTrash as RestoreIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService } from '../services/bodyMetricsService';

interface WeightEntry {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
  measurementDate: string;
  measurementTime: string | null;
  measurementCondition: string | null;
  notes: string | null;
  mood: string | null;
  sleepHours: number | null;
  stressLevel: string | null;
  bmi?: string;
  created_at: string;
  updated_at: string;
}

interface DeletedEntry {
  entry: WeightEntry;
  timestamp: string;
}

const WeightDeleteTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableEntries, setAvailableEntries] = useState<WeightEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<WeightEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deletedEntries, setDeletedEntries] = useState<DeletedEntry[]>([]);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);
  const [lastDeletedEntry, setLastDeletedEntry] = useState<DeletedEntry | null>(null);

  // Load available weight entries on component mount
  useEffect(() => {
    if (token) {
      loadAvailableEntries();
    }
  }, [token]);

  const loadAvailableEntries = async () => {
    try {
      const response = await bodyMetricsService.getWeightHistory(token!, { limit: 50 });
      if (response.success && response.data) {
        setAvailableEntries(response.data.weightHistory || []);
      }
    } catch (err) {
      console.error('Error loading weight entries:', err);
    }
  };

  const handleDeleteClick = (entry: WeightEntry) => {
    setSelectedEntry(entry);
    setConfirmationText('');
    setDeleteDialogOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEntry) return;

    // Check if user typed the confirmation text
    if (confirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm deletion');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMetricsService.deleteWeightEntry(token!, selectedEntry.id);
      
      if (response.success) {
        // Store deleted entry for potential undo
        const deletedEntry: DeletedEntry = {
          entry: selectedEntry,
          timestamp: new Date().toISOString()
        };
        
        setDeletedEntries(prev => [deletedEntry, ...prev]);
        setLastDeletedEntry(deletedEntry);
        
        // Remove from available entries
        setAvailableEntries(prev => prev.filter(entry => entry.id !== selectedEntry.id));
        
        setSuccess(`Weight entry #${selectedEntry.id} deleted successfully!`);
        setDeleteDialogOpen(false);
        setSelectedEntry(null);
        setConfirmationText('');
        
        // Show undo snackbar
        setShowUndoSnackbar(true);
      } else {
        setError(response.message || 'Failed to delete weight entry');
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting the entry');
      console.error('Error deleting weight entry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
    setConfirmationText('');
    setError(null);
  };

  const handleUndoDelete = () => {
    if (lastDeletedEntry) {
      // Add back to available entries
      setAvailableEntries(prev => [lastDeletedEntry.entry, ...prev]);
      
      // Remove from deleted entries
      setDeletedEntries(prev => prev.filter(deleted => deleted.timestamp !== lastDeletedEntry.timestamp));
      
      setSuccess(`Weight entry #${lastDeletedEntry.entry.id} restored successfully!`);
      setLastDeletedEntry(null);
      setShowUndoSnackbar(false);
    }
  };

  const handleBulkDelete = async () => {
    if (availableEntries.length === 0) {
      setError('No entries available for deletion');
      return;
    }

    if (confirmationText !== 'DELETE ALL') {
      setError('Please type "DELETE ALL" to confirm bulk deletion');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Store all entries for potential undo
      const entriesToDelete = [...availableEntries];
      const deletedEntriesList: DeletedEntry[] = entriesToDelete.map(entry => ({
        entry,
        timestamp: new Date().toISOString()
      }));

      // Delete entries one by one
      let successCount = 0;
      let errorCount = 0;

      for (const entry of entriesToDelete) {
        try {
          const response = await bodyMetricsService.deleteWeightEntry(token!, entry.id);
          if (response.success) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
        }
      }

      // Update state
      setDeletedEntries(prev => [...deletedEntriesList, ...prev]);
      setAvailableEntries([]);
      
      if (errorCount === 0) {
        setSuccess(`Successfully deleted ${successCount} weight entries!`);
      } else {
        setSuccess(`Deleted ${successCount} entries, ${errorCount} failed`);
      }

      setDeleteDialogOpen(false);
      setConfirmationText('');
      
    } catch (err) {
      setError('An unexpected error occurred during bulk deletion');
      console.error('Error during bulk deletion:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const formatWeight = (weight: string, unit: string): string => {
    if (!weight) return 'N/A';
    return `${weight} ${unit}`;
  };

  const getRiskLevel = (entry: WeightEntry): 'low' | 'medium' | 'high' => {
    // Simple risk assessment based on entry age and completeness
    const entryDate = new Date(entry.measurementDate);
    const daysOld = Math.floor((Date.now() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOld > 30) return 'low'; // Old entries are lower risk
    if (entry.notes || entry.mood || entry.sleepHours) return 'medium'; // Detailed entries
    return 'high'; // Recent, basic entries
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high'): 'success' | 'warning' | 'error' => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
    }
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight Delete API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🗑️ Weight Delete API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing DELETE /api/body-metrics/weight/:id endpoint with confirmation dialogs and safety features
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={loadAvailableEntries}
            startIcon={<RefreshIcon />}
          >
            Refresh Entries
          </Button>
          {availableEntries.length > 0 && (
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => {
                setSelectedEntry(null);
                setConfirmationText('');
                setDeleteDialogOpen(true);
                setError(null);
                setSuccess(null);
              }}
              startIcon={<DeleteIcon />}
            >
              Bulk Delete All
            </Button>
          )}
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

        {/* Available Entries Table */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              📋 Available Weight Entries ({availableEntries.length})
            </Typography>
            
            {availableEntries.length === 0 ? (
              <Alert severity="info">
                No weight entries found. Create some entries first using the Weight Log API.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Actions</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Mood</TableCell>
                      <TableCell>Risk Level</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableEntries.map((entry) => {
                      const riskLevel = getRiskLevel(entry);
                      return (
                        <TableRow key={entry.id} hover>
                          <TableCell>
                            <Tooltip title="Delete this entry">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeleteClick(entry)}
                                disabled={loading}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(entry.measurementDate)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(entry.measurementTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {formatWeight(entry.weight, entry.weightUnit)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {entry.measurementCondition ? (
                              <Chip 
                                label={entry.measurementCondition} 
                                size="small" 
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.mood ? (
                              <Chip 
                                label={entry.mood} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={riskLevel.toUpperCase()} 
                              size="small" 
                              color={getRiskColor(riskLevel)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                maxWidth: 150, 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {entry.notes || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Deleted Entries History */}
        {deletedEntries.length > 0 && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="error">
                🗑️ Recently Deleted Entries ({deletedEntries.length})
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Entry ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Weight</TableCell>
                      <TableCell>Deleted At</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deletedEntries.slice(0, 10).map((deletedEntry) => (
                      <TableRow key={deletedEntry.timestamp} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            #{deletedEntry.entry.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(deletedEntry.entry.measurementDate)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatWeight(deletedEntry.entry.weight, deletedEntry.entry.weightUnit)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(deletedEntry.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Restore this entry">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => {
                                // Add back to available entries
                                setAvailableEntries(prev => [deletedEntry.entry, ...prev]);
                                
                                // Remove from deleted entries
                                setDeletedEntries(prev => 
                                  prev.filter(deleted => deleted.timestamp !== deletedEntry.timestamp)
                                );
                                
                                setSuccess(`Weight entry #${deletedEntry.entry.id} restored successfully!`);
                              }}
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {deletedEntries.length > 10 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Showing 10 most recent deletions. Total: {deletedEntries.length}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            Confirm Deletion
          </DialogTitle>
          
          <DialogContent>
            {selectedEntry ? (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Are you sure you want to delete this weight entry? This action cannot be undone.
                </DialogContentText>
                
                {/* Entry Details */}
                <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Entry to be deleted:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Entry ID
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        #{selectedEntry.id}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Weight
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatWeight(selectedEntry.weight, selectedEntry.weightUnit)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedEntry.measurementDate)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Risk Level
                      </Typography>
                      <Chip 
                        label={getRiskLevel(selectedEntry).toUpperCase()} 
                        size="small" 
                        color={getRiskColor(getRiskLevel(selectedEntry))}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  
                  {selectedEntry.notes && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {selectedEntry.notes}
                      </Typography>
                    </>
                  )}
                </Card>
              </>
            ) : (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Are you sure you want to delete ALL weight entries? This action cannot be undone.
                </DialogContentText>
                
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Warning:</strong> This will permanently delete {availableEntries.length} weight entries.
                    This action cannot be undone and may affect your analytics and progress tracking.
                  </Typography>
                </Alert>
              </>
            )}
            
            <DialogContentText sx={{ mb: 2 }}>
              To confirm deletion, please type <strong>"{selectedEntry ? 'DELETE' : 'DELETE ALL'}"</strong> below:
            </DialogContentText>
            
            <TextField
              fullWidth
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={selectedEntry ? 'Type DELETE to confirm' : 'Type DELETE ALL to confirm'}
              error={confirmationText !== '' && confirmationText !== (selectedEntry ? 'DELETE' : 'DELETE ALL')}
              helperText={
                confirmationText !== '' && confirmationText !== (selectedEntry ? 'DELETE' : 'DELETE ALL')
                  ? 'Please type the exact confirmation text'
                  : ''
              }
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={selectedEntry ? handleDeleteConfirm : handleBulkDelete}
              color="error"
              variant="contained"
              disabled={
                loading || 
                confirmationText !== (selectedEntry ? 'DELETE' : 'DELETE ALL')
              }
              startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            >
              {loading ? 'Deleting...' : (selectedEntry ? 'Delete Entry' : 'Delete All Entries')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Undo Snackbar */}
        <Snackbar
          open={showUndoSnackbar}
          autoHideDuration={10000}
          onClose={() => setShowUndoSnackbar(false)}
          message={`Weight entry #${lastDeletedEntry?.entry.id} deleted. You can restore it from the deleted entries list.`}
          action={
            <Button 
              color="primary" 
              size="small" 
              onClick={handleUndoDelete}
              startIcon={<RestoreIcon />}
            >
              Undo
            </Button>
          }
        />

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> DELETE /api/body-metrics/weight/:id<br />
            <strong>Status:</strong> {loading ? 'Deleting...' : (error ? 'Error' : (success ? 'Success' : 'Ready'))}<br />
            <strong>Available Entries:</strong> {availableEntries.length}<br />
            <strong>Deleted Entries:</strong> {deletedEntries.length}<br />
            <strong>Dialog Open:</strong> {deleteDialogOpen ? 'Yes' : 'No'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightDeleteTest;
