import React from 'react';
import { BodyMetrics } from '../../../services';
import MetricsDialog from './MetricsDialog';
import MeasurementsDialog from './MeasurementsDialog';
import CompositionDialog from './CompositionDialog';
import WeightDialog from './WeightDialog';
import GoalDialog from './GoalDialog';

interface MetricsDialogsProps {
  metricsDialogOpen: boolean;
  measurementsDialogOpen: boolean;
  compositionDialogOpen: boolean;
  weightDialogOpen: boolean;
  goalDialogOpen: boolean;
  onCloseMetricsDialog: () => void;
  onCloseMeasurementsDialog: () => void;
  onCloseCompositionDialog: () => void;
  onCloseWeightDialog: () => void;
  onCloseGoalDialog: () => void;
  currentMetrics: BodyMetrics | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const MetricsDialogs: React.FC<MetricsDialogsProps> = ({
  metricsDialogOpen,
  measurementsDialogOpen,
  compositionDialogOpen,
  weightDialogOpen,
  goalDialogOpen,
  onCloseMetricsDialog,
  onCloseMeasurementsDialog,
  onCloseCompositionDialog,
  onCloseWeightDialog,
  onCloseGoalDialog,
  currentMetrics,
  onSuccess,
  onError
}) => {
  return (
    <>
      <MetricsDialog
        open={metricsDialogOpen}
        onClose={onCloseMetricsDialog}
        currentMetrics={currentMetrics}
        onSuccess={onSuccess}
        onError={onError}
      />
      
      <MeasurementsDialog
        open={measurementsDialogOpen}
        onClose={onCloseMeasurementsDialog}
        onSuccess={onSuccess}
        onError={onError}
      />
      
      <CompositionDialog
        open={compositionDialogOpen}
        onClose={onCloseCompositionDialog}
        onSuccess={onSuccess}
        onError={onError}
      />
      
      <WeightDialog
        open={weightDialogOpen}
        onClose={onCloseWeightDialog}
        currentMetrics={currentMetrics}
        onSuccess={onSuccess}
        onError={onError}
      />
      
      <GoalDialog
        open={goalDialogOpen}
        onClose={onCloseGoalDialog}
        currentMetrics={currentMetrics}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
};

export default MetricsDialogs;
