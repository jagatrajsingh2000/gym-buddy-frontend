import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { Grid } from '../../components/common';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Static workout data
const staticWorkouts = [
  {
    id: 1,
    name: "Upper Body Strength",
    category: "Strength",
    difficulty: "Intermediate",
    duration: "45 min",
    exercises: [
      { name: "Push-ups", sets: 3, reps: 12, weight: "Bodyweight" },
      { name: "Pull-ups", sets: 3, reps: 8, weight: "Bodyweight" },
      { name: "Dumbbell Rows", sets: 3, reps: 10, weight: "25 lbs" },
      { name: "Overhead Press", sets: 3, reps: 10, weight: "30 lbs" }
    ],
    lastPerformed: "2024-12-19",
    totalWorkouts: 15
  },
  {
    id: 2,
    name: "Lower Body Power",
    category: "Strength",
    difficulty: "Advanced",
    duration: "60 min",
    exercises: [
      { name: "Squats", sets: 4, reps: 8, weight: "135 lbs" },
      { name: "Deadlifts", sets: 3, reps: 6, weight: "185 lbs" },
      { name: "Lunges", sets: 3, reps: 12, weight: "45 lbs" },
      { name: "Calf Raises", sets: 4, reps: 15, weight: "90 lbs" }
    ],
    lastPerformed: "2024-12-17",
    totalWorkouts: 12
  },
  {
    id: 3,
    name: "Cardio HIIT",
    category: "Cardio",
    difficulty: "Beginner",
    duration: "30 min",
    exercises: [
      { name: "Burpees", sets: 4, reps: 10, weight: "Bodyweight" },
      { name: "Mountain Climbers", sets: 4, reps: 20, weight: "Bodyweight" },
      { name: "Jump Squats", sets: 3, reps: 15, weight: "Bodyweight" },
      { name: "High Knees", sets: 3, reps: 30, weight: "Bodyweight" }
    ],
    lastPerformed: "2024-12-20",
    totalWorkouts: 8
  },
  {
    id: 4,
    name: "Core & Stability",
    category: "Core",
    difficulty: "Beginner",
    duration: "25 min",
    exercises: [
      { name: "Planks", sets: 3, reps: "60 sec", weight: "Bodyweight" },
      { name: "Russian Twists", sets: 3, reps: 20, weight: "10 lbs" },
      { name: "Leg Raises", sets: 3, reps: 15, weight: "Bodyweight" },
      { name: "Bicycle Crunches", sets: 3, reps: 20, weight: "Bodyweight" }
    ],
    lastPerformed: "2024-12-18",
    totalWorkouts: 20
  }
];

const workoutCategories = ["All", "Strength", "Cardio", "Core", "Flexibility", "Sports"];
const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState(staticWorkouts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    category: "",
    difficulty: "",
    duration: "",
    exercises: []
  });

  const filteredWorkouts = workouts.filter(workout => {
    const categoryMatch = selectedCategory === "All" || workout.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "All" || workout.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleOpenDialog = (workout?: any) => {
    if (workout) {
      setEditingWorkout(workout);
      setWorkoutForm({
        name: workout.name,
        category: workout.category,
        difficulty: workout.difficulty,
        duration: workout.duration,
        exercises: workout.exercises
      });
    } else {
      setEditingWorkout(null);
      setWorkoutForm({
        name: "",
        category: "",
        difficulty: "",
        duration: "",
        exercises: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkout(null);
    setWorkoutForm({
      name: "",
      category: "",
      difficulty: "",
      duration: "",
      exercises: []
    });
  };

  const handleSaveWorkout = () => {
    if (editingWorkout) {
      // Update existing workout
      setWorkouts(workouts.map(w => 
        w.id === editingWorkout.id 
          ? { ...editingWorkout, ...workoutForm }
          : w
      ));
    } else {
      // Add new workout
      const newWorkout = {
        id: Date.now(),
        ...workoutForm,
        lastPerformed: new Date().toISOString().split('T')[0],
        totalWorkouts: 0
      };
      setWorkouts([...workouts, newWorkout]);
    }
    handleCloseDialog();
  };

  const handleDeleteWorkout = (workoutId: number) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "success";
      case "Intermediate": return "warning";
      case "Advanced": return "error";
      default: return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Strength": return "primary";
      case "Cardio": return "secondary";
      case "Core": return "info";
      case "Flexibility": return "success";
      case "Sports": return "warning";
      default: return "default";
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workouts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your workout routines and track your fitness progress
        </Typography>
      </Box>

      {/* Filters and Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {workoutCategories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={selectedDifficulty}
            label="Difficulty"
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {difficultyLevels.map(level => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Workout
        </Button>
      </Box>

      {/* Workouts Grid */}
      <Grid container spacing={3}>
        {filteredWorkouts.map((workout) => (
          <Grid xs={12} md={6} lg={4} key={workout.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
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

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={workout.category}
                    color={getCategoryColor(workout.category) as any}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={workout.difficulty}
                    color={getDifficultyColor(workout.difficulty) as any}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {workout.duration}
                  </Typography>
                  <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {workout.totalWorkouts} workouts
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Last performed: {workout.lastPerformed}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Exercises ({workout.exercises.length}):
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={exercise.name}
                        secondary={`${exercise.sets} sets × ${exercise.reps} reps`}
                      />
                      {exercise.weight !== "Bodyweight" && (
                        <Typography variant="caption" color="text.secondary">
                          {exercise.weight}
                        </Typography>
                      )}
                    </ListItem>
                  ))}
                  {workout.exercises.length > 3 && (
                    <ListItem sx={{ px: 0, py: 0.5 }}>
                      <ListItemText
                        primary={`+${workout.exercises.length - 3} more exercises`}
                        sx={{ fontStyle: 'italic' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create/Edit Workout Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workout Name"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  placeholder="e.g., 45 min"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={workoutForm.category}
                    label="Category"
                    onChange={(e) => setWorkoutForm({ ...workoutForm, category: e.target.value })}
                  >
                    {workoutCategories.slice(1).map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={workoutForm.difficulty}
                    label="Difficulty"
                    onChange={(e) => setWorkoutForm({ ...workoutForm, difficulty: e.target.value })}
                >
                    {difficultyLevels.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveWorkout} 
            variant="contained"
            disabled={!workoutForm.name || !workoutForm.category || !workoutForm.difficulty}
          >
            {editingWorkout ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workouts;
