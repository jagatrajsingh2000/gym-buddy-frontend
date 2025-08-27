import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { BodyMetrics } from '../../../services';

interface WeightDialogProps {
  open: boolean;
  onClose: () => void;
  currentMetrics: BodyMetrics | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const WeightDialog: React.FC<WeightDialogProps> = ({
  open,
  onClose,
  currentMetrics,
  onSuccess,
  onError
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Log Weight Entry</DialogTitle>
      <DialogContent>
        <Typography>Weight dialog content will be implemented here</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSuccess('Weight logged!')}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeightDialog;
