import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { BodyMetrics } from '../../../services';

interface GoalDialogProps {
  open: boolean;
  onClose: () => void;
  currentMetrics: BodyMetrics | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const GoalDialog: React.FC<GoalDialogProps> = ({
  open,
  onClose,
  currentMetrics,
  onSuccess,
  onError
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Fitness Goal</DialogTitle>
      <DialogContent>
        <Typography>Goal dialog content will be implemented here</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSuccess('Goal set!')}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalDialog;
