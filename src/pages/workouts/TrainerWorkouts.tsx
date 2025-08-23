import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Chip,
  List, ListItem, ListItemText, Divider, Alert, CircularProgress, Switch, FormControlLabel,
  Avatar, Autocomplete
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  FitnessCenter, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Assignment as AssignmentIcon,
  Save as SaveIcon, Cancel as CancelIcon, Person, Group as GroupIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { workoutService, Workout } from '../../services/workoutService';
import { getDemoWorkouts } from '../../data/demoWorkouts';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
  timeUnderTension?: number;
  notes?: string;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  targetGoal: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';
  exercises: Exercise[];
  assignedClients: string[];
  isTemplate: boolean;
  createdAt: string;
}

interface WorkoutForm {
  id?: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  targetGoal: 'weight_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';
  exercises: Exercise[];
  isTemplate: boolean;
}

// Mock clients data
const mockClients = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', goal: 'weight_loss' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', goal: 'muscle_gain' },
  { id: '3', name: 'Carol Davis', email: 'carol@email.com', goal: 'strength' },
  { id: '4', name: 'David Wilson', email: 'david@email.com', goal: 'endurance' }
];

const TrainerWorkouts: React.FC = () => {
  const { user, token } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutForm | null>(null);
  const [selectedWorkoutForAssign, setSelectedWorkoutForAssign] = useState<WorkoutPlan | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>({
    name: '',
    description: '',
    duration: 60,
    difficulty: 'beginner',
    category: 'mixed',
    targetGoal: 'general_fitness',
    exercises: [],
    isTemplate: false
  });

  useEffect(() => {
    const loadWorkoutPlans = () => {
      // Mock data for trainer workout plans
      const mockPlans: WorkoutPlan[] = [
        {
          id: '1',
          name: 'Beginner Weight Loss Circuit',
          description: 'A comprehensive circuit training plan designed for weight loss',
          duration: 45,
          difficulty: 'beginner',
          category: 'mixed',
          targetGoal: 'weight_loss',
          exercises: [
            { id: '1', name: 'Bodyweight Squats', sets: 3, reps: 15, weight: 0, restTime: 60, notes: 'Focus on form' },
            { id: '2', name: 'Push-ups', sets: 3, reps: 10, weight: 0, restTime: 60, notes: 'Modify on knees if needed' },
            { id: '3', name: 'Mountain Climbers', sets: 3, reps: 20, weight: 0, restTime: 60, notes: 'Keep core tight' }
          ],
          assignedClients: ['1', '4'],
          isTemplate: true,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Advanced Strength Builder',
          description: 'High-intensity strength training for experienced lifters',
          duration: 75,
          difficulty: 'advanced',
          category: 'strength',
          targetGoal: 'strength',
          exercises: [
            { id: '4', name: 'Deadlifts', sets: 4, reps: 6, weight: 100, restTime: 180, notes: 'Progressive overload' },
            { id: '5', name: 'Bench Press', sets: 4, reps: 8, weight: 80, restTime: 120, notes: 'Full range of motion' },
            { id: '6', name: 'Squats', sets: 4, reps: 8, weight: 90, restTime: 150, notes: 'Below parallel' }
          ],
          assignedClients: ['2', '3'],
          isTemplate: true,
          createdAt: '2024-01-10'
        }
      ];
      setWorkoutPlans(mockPlans);
      setLoading(false);
    };

    loadWorkoutPlans();
  }, []);

  const handleOpenDialog = (workout?: WorkoutPlan) => {
    if (workout) {
      setEditingWorkout({
        id: workout.id,
        name: workout.name,
        description: workout.description,
        duration: workout.duration,
        difficulty: workout.difficulty,
        category: workout.category,
        targetGoal: workout.targetGoal,
        exercises: workout.exercises,
        isTemplate: workout.isTemplate
      });
      setWorkoutForm({
        id: workout.id,
        name: workout.name,
        description: workout.description,
        duration: workout.duration,
        difficulty: workout.difficulty,
        category: workout.category,
        targetGoal: workout.targetGoal,
        exercises: workout.exercises,
        isTemplate: workout.isTemplate
      });
    } else {
      setEditingWorkout(null);
      setWorkoutForm({
        name: '',
        description: '',
        duration: 60,
        difficulty: 'beginner',
        category: 'mixed',
        targetGoal: 'general_fitness',
        exercises: [],
        isTemplate: false
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWorkout(null);
  };

  const handleSaveWorkout = () => {
    if (!workoutForm.name.trim()) return;

    if (editingWorkout) {
      // Update existing workout
      setWorkoutPlans(prev => prev.map(plan => 
        plan.id === workoutForm.id 
          ? { 
              ...plan, 
              ...workoutForm,
              exercises: workoutForm.exercises
            }
          : plan
      ));
    } else {
      // Create new workout
      const newPlan: WorkoutPlan = {
        id: Date.now().toString(),
        name: workoutForm.name,
        description: workoutForm.description,
        duration: workoutForm.duration,
        difficulty: workoutForm.difficulty,
        category: workoutForm.category,
        targetGoal: workoutForm.targetGoal,
        exercises: workoutForm.exercises,
        assignedClients: [],
        isTemplate: workoutForm.isTemplate,
        createdAt: new Date().toISOString()
      };
      setWorkoutPlans(prev => [...prev, newPlan]);
    }

    handleCloseDialog();
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkoutPlans(prev => prev.filter(plan => plan.id !== workoutId));
  };

  const handleAssignWorkout = (workout: WorkoutPlan) => {
    setSelectedWorkoutForAssign(workout);
    setSelectedClients(workout.assignedClients);
    setAssignDialogOpen(true);
  };

  const handleSaveAssignment = () => {
    if (selectedWorkoutForAssign) {
      setWorkoutPlans(prev => prev.map(plan => 
        plan.id === selectedWorkoutForAssign.id 
          ? { ...plan, assignedClients: selectedClients }
          : plan
      ));
    }
    setAssignDialogOpen(false);
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
      timeUnderTension: 0,
      notes: ''
    };
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength': return 'primary';
      case 'cardio': return 'secondary';
      case 'flexibility': return 'info';
      case 'mixed': return 'default';
      default: return 'default';
    }
  };

  const getTargetGoalColor = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return 'error';
      case 'muscle_gain': return 'primary';
      case 'strength': return 'secondary';
      case 'endurance': return 'info';
      case 'general_fitness': return 'success';
      default: return 'default';
    }
  };

  const getClientsByGoal = (goal: string) => {
    return mockClients.filter(client => client.goal === goal);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1, md: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Workout Plans 💪
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage workout plans for your clients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 140 }}
        >
          Create Plan
        </Button>
      </Box>

      {/* Summary Cards */}
      <GridComponent container spacing={2} sx={{ mb: 3 }}>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {workoutPlans.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Plans
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {workoutPlans.reduce((total, plan) => total + plan.assignedClients.length, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Assignments
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {workoutPlans.filter(plan => plan.isTemplate).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Templates
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
        <GridComponent item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Person sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {mockClients.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clients
              </Typography>
            </CardContent>
          </Card>
        </GridComponent>
      </GridComponent>

      {/* Workout Plans */}
      <GridComponent container spacing={2}>
        {workoutPlans.map((plan) => (
          <GridComponent item xs={12} md={6} lg={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {plan.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(plan)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteWorkout(plan.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={plan.difficulty}
                    color={getDifficultyColor(plan.difficulty) as any}
                    size="small"
                  />
                  <Chip
                    label={plan.category}
                    color={getCategoryColor(plan.category) as any}
                    size="small"
                  />
                  <Chip
                    label={plan.targetGoal.replace('_', ' ')}
                    color={getTargetGoalColor(plan.targetGoal) as any}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${plan.duration} min`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={`${plan.exercises.length} exercises`}
                    variant="outlined"
                    size="small"
                  />
                  {plan.isTemplate && (
                    <Chip
                      label="Template"
                      variant="outlined"
                      size="small"
                      color="info"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Assigned to {plan.assignedClients.length} clients
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<AssignmentIcon />}
                  onClick={() => handleAssignWorkout(plan)}
                  fullWidth
                >
                  Assign to Clients
                </Button>
              </CardContent>
            </Card>
          </GridComponent>
        ))}
      </GridComponent>

      {/* Create/Edit Workout Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingWorkout ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <GridComponent container spacing={2}>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Plan Name"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Difficulty Level</InputLabel>
                  <Select
                    value={workoutForm.difficulty}
                    label="Difficulty Level"
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={workoutForm.category}
                    label="Category"
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <MenuItem value="strength">Strength Training</MenuItem>
                    <MenuItem value="cardio">Cardio</MenuItem>
                    <MenuItem value="flexibility">Flexibility</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Target Goal</InputLabel>
                  <Select
                    value={workoutForm.targetGoal}
                    label="Target Goal"
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, targetGoal: e.target.value as any }))}
                  >
                    <MenuItem value="weight_loss">Weight Loss</MenuItem>
                    <MenuItem value="muscle_gain">Muscle Gain</MenuItem>
                    <MenuItem value="strength">Strength</MenuItem>
                    <MenuItem value="endurance">Endurance</MenuItem>
                    <MenuItem value="general_fitness">General Fitness</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={workoutForm.description}
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={workoutForm.isTemplate}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, isTemplate: e.target.checked }))}
                    />
                  }
                  label="Save as Template"
                />
              </GridComponent>
            </GridComponent>

            {/* Exercises Section */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Exercises</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addExercise}
                  size="small"
                >
                  Add Exercise
                </Button>
              </Box>

              {workoutForm.exercises.map((exercise, index) => (
                <Paper key={exercise.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Exercise {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeExercise(exercise.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <GridComponent container spacing={2}>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Exercise Name"
                        value={exercise.name}
                        onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Sets"
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(exercise.id, 'sets', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Reps"
                        type="number"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(exercise.id, 'reps', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Weight (kg)"
                        type="number"
                        value={exercise.weight}
                        onChange={(e) => updateExercise(exercise.id, 'weight', parseFloat(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Rest Time (sec)"
                        type="number"
                        value={exercise.restTime}
                        onChange={(e) => updateExercise(exercise.id, 'restTime', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Time Under Tension (sec)"
                        type="number"
                        value={exercise.timeUnderTension || 0}
                        onChange={(e) => updateExercise(exercise.id, 'timeUnderTension', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={exercise.notes || ''}
                        onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                  </GridComponent>
                </Paper>
              ))}

              {workoutForm.exercises.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                  <FitnessCenter sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">No exercises added yet</Typography>
                  <Typography variant="body2">Click "Add Exercise" to start building your workout</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveWorkout}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!workoutForm.name.trim()}
          >
            {editingWorkout ? 'Update' : 'Create'} Plan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Workout Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign "{selectedWorkoutForAssign?.name}" to Clients
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select clients to assign this workout plan to:
          </Typography>
          <Autocomplete
            multiple
            options={mockClients}
            getOptionLabel={(option) => option.name}
            value={mockClients.filter(client => selectedClients.includes(client.id))}
            onChange={(event, newValue) => {
              setSelectedClients(newValue.map(client => client.id));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Clients"
                placeholder="Choose clients..."
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
          
          {selectedWorkoutForAssign && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Workout Summary:
              </Typography>
              <Typography variant="body2">
                <strong>Target Goal:</strong> {selectedWorkoutForAssign.targetGoal.replace('_', ' ')}
              </Typography>
              <Typography variant="body2">
                <strong>Difficulty:</strong> {selectedWorkoutForAssign.difficulty}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {selectedWorkoutForAssign.duration} minutes
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveAssignment}
            variant="contained"
            startIcon={<AssignmentIcon />}
          >
            Assign Workout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerWorkouts;
