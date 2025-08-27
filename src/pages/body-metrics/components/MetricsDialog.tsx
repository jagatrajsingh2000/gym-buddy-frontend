import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography
} from '@mui/material';
import { BodyMetrics } from '../../../services';
import { bodyMetricsService } from '../../../services';
import { useAuth } from '../../../context/AuthContext';

interface MetricsDialogProps {
  open: boolean;
  onClose: () => void;
  currentMetrics: BodyMetrics | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface MetricsForm {
  weight: string;
  bodyFatPercentage: string;
  muscleMass: string;
  chest: string;
  waist: string;
  hips: string;
  biceps: string;
  thighs: string;
  calves: string;
  notes: string;
}

const MetricsDialog: React.FC<MetricsDialogProps> = ({
  open,
  onClose,
  currentMetrics,
  onSuccess,
  onError
}) => {
  const { token } = useAuth();
  const [form, setForm] = useState<MetricsForm>({
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    chest: '',
    waist: '',
    hips: '',
    biceps: '',
    thighs: '',
    calves: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentMetrics && open) {
      setForm({
        weight: currentMetrics.weight?.toString() || '',
        bodyFatPercentage: currentMetrics.bodyFatPercentage?.toString() || '',
        muscleMass: currentMetrics.muscleMass?.toString() || '',
        chest: currentMetrics.chest?.toString() || '',
        waist: currentMetrics.waist?.toString() || '',
        hips: currentMetrics.hips?.toString() || '',
        biceps: currentMetrics.biceps?.toString() || '',
        thighs: currentMetrics.thighs?.toString() || '',
        calves: currentMetrics.calves?.toString() || '',
        notes: currentMetrics.notes || ''
      });
    } else if (open) {
      setForm({
        weight: '',
        bodyFatPercentage: '',
        muscleMass: '',
        chest: '',
        waist: '',
        hips: '',
        biceps: '',
        thighs: '',
        calves: '',
        notes: ''
      });
    }
  }, [currentMetrics, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const metricsData = {
        measurementDate: new Date().toISOString().split('T')[0],
        weight: form.weight ? parseFloat(form.weight) : undefined,
        bodyFatPercentage: form.bodyFatPercentage ? parseFloat(form.bodyFatPercentage) : undefined,
        muscleMass: form.muscleMass ? parseFloat(form.muscleMass) : undefined,
        chest: form.chest ? parseFloat(form.chest) : undefined,
        waist: form.waist ? parseFloat(form.waist) : undefined,
        hips: form.hips ? parseFloat(form.hips) : undefined,
        biceps: form.biceps ? parseFloat(form.biceps) : undefined,
        thighs: form.thighs ? parseFloat(form.thighs) : undefined,
        calves: form.calves ? parseFloat(form.calves) : undefined,
        notes: form.notes || undefined
      };

      if (currentMetrics && currentMetrics.id) {
        await bodyMetricsService.updateMetrics(token!, currentMetrics.id, metricsData);
      } else {
        await bodyMetricsService.createMetrics(token!, metricsData);
      }

      onSuccess('Body metrics saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving metrics:', error);
      onError('Failed to save metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0px 25px 80px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          📊 Record Body Metrics
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="70.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#3742fa' },
                  '&.Mui-focused fieldset': { borderColor: '#3742fa' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Body Fat %"
              value={form.bodyFatPercentage}
              onChange={(e) => setForm({ ...form, bodyFatPercentage: e.target.value })}
              placeholder="22.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#e94560' },
                  '&.Mui-focused fieldset': { borderColor: '#e94560' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Muscle Mass (kg)"
              value={form.muscleMass}
              onChange={(e) => setForm({ ...form, muscleMass: e.target.value })}
              placeholder="35.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#00d4aa' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4aa' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Chest (cm)"
              value={form.chest}
              onChange={(e) => setForm({ ...form, chest: e.target.value })}
              placeholder="95.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#3742fa' },
                  '&.Mui-focused fieldset': { borderColor: '#3742fa' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Waist (cm)"
              value={form.waist}
              onChange={(e) => setForm({ ...form, waist: e.target.value })}
              placeholder="78.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#ff9f43' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9f43' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hips (cm)"
              value={form.hips}
              onChange={(e) => setForm({ ...form, hips: e.target.value })}
              placeholder="95.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#e94560' },
                  '&.Mui-focused fieldset': { borderColor: '#e94560' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Biceps (cm)"
              value={form.biceps}
              onChange={(e) => setForm({ ...form, biceps: e.target.value })}
              placeholder="28.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#00d4aa' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4aa' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Thighs (cm)"
              value={form.thighs}
              onChange={(e) => setForm({ ...form, thighs: e.target.value })}
              placeholder="52.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#3742fa' },
                  '&.Mui-focused fieldset': { borderColor: '#3742fa' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Calves (cm)"
              value={form.calves}
              onChange={(e) => setForm({ ...form, calves: e.target.value })}
              placeholder="35.00"
              type="number"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#ff9f43' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9f43' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes about your measurements..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover fieldset': { borderColor: '#1a1a2e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a1a2e' }
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            borderColor: '#1a1a2e',
            color: '#1a1a2e',
            borderWidth: '2px',
            '&:hover': {
              borderColor: '#e94560',
              color: '#e94560',
              backgroundColor: 'rgba(233, 69, 96, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e94560 0%, #ff9f43 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #d63384 0%, #e94560 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0px 8px 25px rgba(233, 69, 96, 0.3)'
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Metrics'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricsDialog;
