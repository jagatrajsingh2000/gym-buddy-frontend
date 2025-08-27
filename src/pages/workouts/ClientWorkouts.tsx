import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Alert, CircularProgress
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  FitnessCenter, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Timer, Speed,
  TrendingUp, Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { workoutService, Workout } from '../../services/workoutService';

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

interface WorkoutForm {
  id?: string;
  name: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  exercises: Exercise[];
}

const ClientWorkouts: React.FC = () => {
  const { user, token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutForm | null>(null);
  const [workoutForm, setWorkoutForm] = useState<WorkoutForm>({
    name: '',
    description: '',
    duration: 30,
    difficulty: 'beginner',
    type: 'mixed',
    exercises: []
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const workoutData = await workoutService.getUserWorkouts(token!);
        setWorkouts(workoutData);
      } catch (err) {
        setError('Failed to fetch workouts');
        console.error('Error fetching workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && user) {
      fetchWorkouts();
    }
  }, [token, user]);

  const handleOpenDialog = (workout?: Workout) => {
    if (workout) {
      setEditingWorkout({
        id: workout.id,
        name: workout.name,
        description: workout.notes || '',
        duration: workout.duration || 30,
        difficulty: 'beginner',
        type: 'mixed',
        exercises: workout.exercises.map(ex => ({
          id: ex.exerciseId.toString(),
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime,
          timeUnderTension: 0,
          notes: ''
        })) || []
      });
      setWorkoutForm({
        id: workout.id,
        name: workout.name,
        description: workout.notes || '',
        duration: workout.duration || 30,
        difficulty: 'beginner',
        type: 'mixed',
        exercises: workout.exercises.map(ex => ({
          id: ex.exerciseId.toString(),
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime,
          timeUnderTension: 0,
          notes: ''
        })) || []
      });
    } else {
      setEditingWorkout(null);
      setWorkoutForm({
        name: '',
        description: '',
        duration: 30,
        difficulty: 'beginner',
        type: 'mixed',
        exercises: []
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWorkout(null);
    setWorkoutForm({
      name: '',
      description: '',
      duration: 30,
      difficulty: 'beginner',
      type: 'mixed',
      exercises: []
    });
  };

  const handleSaveWorkout = () => {
    if (!workoutForm.name.trim()) return;

    if (editingWorkout) {
      // Update existing workout
      setWorkouts(prev => prev.map(w => 
        w.id === workoutForm.id 
          ? { 
              ...w, 
              name: workoutForm.name,
              notes: workoutForm.description,
              duration: workoutForm.duration,
              exercises: workoutForm.exercises.map(ex => ({
                exerciseId: parseInt(ex.id),
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                restTime: ex.restTime
              }))
            }
          : w
      ));
    } else {
      // Create new workout
      const newWorkout: Workout = {
        id: Date.now().toString(),
        name: workoutForm.name,
        type: 'full_body',
        date: new Date().toISOString(),
        duration: workoutForm.duration,
        status: 'planned',
        exercises: workoutForm.exercises.map(ex => ({
          exerciseId: parseInt(ex.id),
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          restTime: ex.restTime
        })),
        notes: workoutForm.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkouts(prev => [...prev, newWorkout]);
    }

    handleCloseDialog();
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'primary';
      case 'cardio': return 'secondary';
      case 'flexibility': return 'info';
      case 'mixed': return 'default';
      default: return 'default';
    }
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
            My Workout Plans 💪
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage your personalized workout routines
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 140 }}
        >
          Create Workout
        </Button>
      </Box>

      {/* Workout Cards */}
      <GridComponent container spacing={2}>
        {workouts.map((workout) => (
          <GridComponent item xs={12} md={6} lg={4} key={workout.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {workout.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(workout)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteWorkout(workout.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {workout.notes || 'No description available'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label="Beginner"
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={workout.type}
                    color={getTypeColor(workout.type) as any}
                    size="small"
                  />
                  <Chip
                    label={`${workout.duration} min`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {workout.exercises?.length || 0} exercises
                  </Typography>
                  <Chip
                    label={workout.status}
                    color={workout.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </GridComponent>
        ))}
      </GridComponent>

      {/* Create/Edit Workout Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingWorkout ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <GridComponent container spacing={2}>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Workout Name"
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
                  onChange={(e) => setWorkoutForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
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
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Workout Type</InputLabel>
                  <Select
                    value={workoutForm.type}
                    label="Workout Type"
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <MenuItem value="strength">Strength Training</MenuItem>
                    <MenuItem value="cardio">Cardio</MenuItem>
                    <MenuItem value="flexibility">Flexibility</MenuItem>
                    <MenuItem value="mixed">Mixed</MenuItem>
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
                  sx={{ mb: 3 }}
                />
              </GridComponent>
            </GridComponent>

            {/* Exercises Section */}
            <Box sx={{ mb: 3 }}>
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
                        value={exercise.timeUnderTension}
                        onChange={(e) => updateExercise(exercise.id, 'timeUnderTension', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={exercise.notes}
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
            {editingWorkout ? 'Update' : 'Create'} Workout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientWorkouts;
