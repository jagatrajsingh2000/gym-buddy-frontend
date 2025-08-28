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
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService, BodyComposition } from '../services/bodyMetricsService';

const BodyCompositionTest: React.FC = () => {
  const { token } = useAuth();
  const [currentComposition, setCurrentComposition] = useState<BodyComposition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchCurrentComposition = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await bodyCompositionService.getCurrentComposition(token);
      
      if (response.success && response.data?.composition) {
        setCurrentComposition(response.data.composition);
        setSuccess('Successfully fetched current body composition!');
      } else if (response.success && !response.data?.composition) {
        setCurrentComposition(null);
        setSuccess('No body composition data found');
      } else {
        setError(response.message || 'Failed to fetch body composition');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching body composition:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentComposition();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRefresh = () => {
    fetchCurrentComposition();
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🧬 Body Composition API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/composition/current endpoint
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchCurrentComposition}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Fetch Current Composition'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
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

        {/* Current Composition Display */}
        {currentComposition ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Current Body Composition
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {currentComposition.bodyFatPercentage ? `${currentComposition.bodyFatPercentage}%` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Body Fat
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {currentComposition.muscleMass ? `${currentComposition.muscleMass} kg` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Muscle Mass
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {currentComposition.boneMass ? `${currentComposition.boneMass} kg` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bone Mass
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {currentComposition.waterPercentage ? `${currentComposition.waterPercentage}%` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Water %
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Measurement Date:</strong> {currentComposition.measurementDate}
              </Typography>
              {currentComposition.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Notes:</strong> {currentComposition.notes}
                </Typography>
              )}
            </Box>
          </Box>
        ) : !loading && (
          <Alert severity="info">
            No body composition data available. This could mean:
            <ul>
              <li>No measurements have been logged yet</li>
              <li>The user hasn't set up body composition tracking</li>
              <li>Data is being fetched...</li>
            </ul>
          </Alert>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> GET /api/body-metrics/composition/current<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : 'Success')}<br />
            <strong>Data:</strong> {currentComposition ? 'Available' : 'Not available'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionTest;
