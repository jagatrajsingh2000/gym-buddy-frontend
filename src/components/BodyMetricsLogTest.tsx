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
  TableRow
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, LogBodyMetricsRequest } from '../services';

/**
 * Test Component for Body Metrics Logging API Integration
 * This demonstrates how to use the new POST /api/body-metrics/log endpoint
 */
const BodyMetricsLogTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [lastLoggedMetrics, setLastLoggedMetrics] = useState<any>(null);
  
  // Test form state
  const [testData, setTestData] = useState<LogBodyMetricsRequest>({
    chest: 95.5,
    waist: 78.2,
    measurementDate: bodyMetricsUtils.getTodayDate(),
    notes: 'Test measurement from API test component'
  });

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

  // Test the logging API
  const testLogMetrics = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bodyMeasurementsService.logBodyMetrics(token, testData);
      
      if (response.success && response.data) {
        setSuccess('Metrics logged successfully!');
        setLastLoggedMetrics(response.data.metrics);
        
        // Reset test data
        setTestData({
          chest: 95.5,
          waist: 78.2,
          measurementDate: bodyMetricsUtils.getTodayDate(),
          notes: 'Test measurement from API test component'
        });
      } else {
        setError(response.message || 'Failed to log metrics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate random test data
  const generateRandomData = () => {
    const randomData: LogBodyMetricsRequest = {
      chest: Math.round((90 + Math.random() * 10) * 10) / 10,
      waist: Math.round((75 + Math.random() * 8) * 10) / 10,
      hips: Math.round((95 + Math.random() * 8) * 10) / 10,
      biceps: Math.round((30 + Math.random() * 6) * 10) / 10,
      forearms: Math.round((26 + Math.random() * 6) * 10) / 10,
      thighs: Math.round((55 + Math.random() * 8) * 10) / 10,
      calves: Math.round((36 + Math.random() * 6) * 10) / 10,
      neck: Math.round((37 + Math.random() * 4) * 10) / 10,
      measurementDate: bodyMetricsUtils.getTodayDate(),
      notes: 'Random test data generated for API testing'
    };
    
    setTestData(randomData);
  };

  // Clear test data
  const clearTestData = () => {
    setTestData({
      chest: 95.5,
      waist: 78.2,
      measurementDate: bodyMetricsUtils.getTodayDate(),
      notes: 'Test measurement from API test component'
    });
    setLastLoggedMetrics(null);
    setSuccess(null);
    setError(null);
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Metrics Logging API
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Body Metrics Logging API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This component tests the new <code>POST /api/body-metrics/</code> endpoint for creating new body measurements
      </Typography>

      {/* Test Form */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔧 Test Data Form
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
              label="Hips (cm)"
              value={testData.hips || ''}
              onChange={(e) => handleTestDataChange('hips', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Biceps (cm)"
              value={testData.biceps || ''}
              onChange={(e) => handleTestDataChange('biceps', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Forearms (cm)"
              value={testData.forearms || ''}
              onChange={(e) => handleTestDataChange('forearms', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Thighs (cm)"
              value={testData.thighs || ''}
              onChange={(e) => handleTestDataChange('thighs', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Calves (cm)"
              value={testData.calves || ''}
              onChange={(e) => handleTestDataChange('calves', e.target.value)}
              size="small"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Neck (cm)"
              value={testData.neck || ''}
              onChange={(e) => handleTestDataChange('neck', e.target.value)}
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
              value={testData.measurementDate || ''}
              onChange={(e) => handleTestDataChange('measurementDate', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={testLogMetrics}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : '🧪 Test Log Metrics API'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={generateRandomData}
            disabled={loading}
          >
            🎲 Generate Random Data
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

      {/* Last Logged Metrics */}
      {lastLoggedMetrics && (
        <Card sx={{ p: 3, mb: 3, bgcolor: 'success.50' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            ✅ Last Logged Metrics
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(lastLoggedMetrics).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <Chip label={key} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {value !== null && value !== undefined ? value.toString() : 'null/undefined'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {typeof value}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* API Information */}
      <Card sx={{ p: 3, mt: 3, bgcolor: 'warning.50' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          🔍 Log Metrics API Endpoint Information
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Endpoint:</strong> <code>POST /api/body-metrics/log</code>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Authentication:</strong> Bearer Token required
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Content-Type:</strong> application/json
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Validation:</strong> At least one measurement required, all values must be positive
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Request Fields:</strong> All measurement fields are optional, but at least one is required
        </Typography>
        <Typography variant="body2">
          <strong>Response:</strong> JSON with created metrics object and success message
        </Typography>
      </Card>
    </Box>
  );
};

export default BodyMetricsLogTest;
