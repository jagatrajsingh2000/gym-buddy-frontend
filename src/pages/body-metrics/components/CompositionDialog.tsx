import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface CompositionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const CompositionDialog: React.FC<CompositionDialogProps> = ({
  open,
  onClose,
  onSuccess,
  onError
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Log Body Composition</DialogTitle>
      <DialogContent>
        <Typography>Composition dialog content will be implemented here</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSuccess('Composition saved!')}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompositionDialog;
