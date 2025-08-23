import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText,
  ListItemButton, Chip, Card, CardContent, Grid, IconButton, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControl,
  InputLabel, Select, MenuItem, InputAdornment
} from '@mui/material';
import {
  Send as SendIcon, FitnessCenter, Timer, Speed, TrendingUp,
  Add as AddIcon, Close as CloseIcon
} from '@mui/icons-material';

interface WorkoutOption {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'full_body' | 'cardio' | 'strength';
  description: string;
  exercises: Exercise[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DietOption {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: FoodItem[];
  timing: string;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'performance';
}

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits';
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;
  timeUnderTension?: number;
  notes?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  workoutOptions?: WorkoutOption[];
  selectedWorkout?: WorkoutOption;
  dietOptions?: DietOption[];
  selectedDiet?: DietOption;
  showOptions?: boolean;
}

const workoutOptions: WorkoutOption[] = [
  {
    id: 'push-1',
    name: 'Push Day - Chest, Shoulders, Triceps',
    type: 'push',
    description: 'Focus on pushing movements for upper body strength',
    estimatedDuration: 60,
    difficulty: 'intermediate',
    exercises: [
      { id: '1', name: 'Bench Press', sets: 4, reps: 8, weight: 135, restTime: 120, timeUnderTension: 3 },
      { id: '2', name: 'Overhead Press', sets: 3, reps: 10, weight: 95, restTime: 90, timeUnderTension: 3 },
      { id: '3', name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 50, restTime: 90, timeUnderTension: 3 },
      { id: '4', name: 'Dips', sets: 3, reps: 15, restTime: 60, timeUnderTension: 3 },
      { id: '5', name: 'Tricep Extensions', sets: 3, reps: 15, weight: 25, restTime: 60, timeUnderTension: 3 }
    ]
  },
  {
    id: 'pull-1',
    name: 'Pull Day - Back, Biceps',
    type: 'pull',
    description: 'Focus on pulling movements for back and bicep development',
    estimatedDuration: 55,
    difficulty: 'intermediate',
    exercises: [
      { id: '1', name: 'Deadlifts', sets: 4, reps: 6, weight: 185, restTime: 180, timeUnderTension: 4 },
      { id: '2', name: 'Pull-ups', sets: 3, reps: 8, restTime: 120, timeUnderTension: 3 },
      { id: '3', name: 'Barbell Rows', sets: 3, reps: 10, weight: 115, restTime: 90, timeUnderTension: 3 },
      { id: '4', name: 'Lat Pulldowns', sets: 3, reps: 12, weight: 120, restTime: 60, timeUnderTension: 3 },
      { id: '5', name: 'Bicep Curls', sets: 3, reps: 15, weight: 30, restTime: 60, timeUnderTension: 3 }
    ]
  },
  {
    id: 'legs-1',
    name: 'Leg Day - Quads, Hamstrings, Glutes',
    type: 'legs',
    description: 'Comprehensive lower body strength and development',
    estimatedDuration: 70,
    difficulty: 'intermediate',
    exercises: [
      { id: '1', name: 'Squats', sets: 4, reps: 8, weight: 155, restTime: 180, timeUnderTension: 4 },
      { id: '2', name: 'Romanian Deadlifts', sets: 3, reps: 10, weight: 135, restTime: 120, timeUnderTension: 4 },
      { id: '3', name: 'Leg Press', sets: 3, reps: 12, weight: 225, restTime: 90, timeUnderTension: 3 },
      { id: '4', name: 'Lunges', sets: 3, reps: 12, weight: 45, restTime: 90, timeUnderTension: 3 },
      { id: '5', name: 'Calf Raises', sets: 4, reps: 20, weight: 135, restTime: 60, timeUnderTension: 2 }
    ]
  },
  {
    id: 'full-body-1',
    name: 'Full Body Circuit',
    type: 'full_body',
    description: 'Complete body workout with minimal rest',
    estimatedDuration: 45,
    difficulty: 'beginner',
    exercises: [
      { id: '1', name: 'Push-ups', sets: 3, reps: 15, restTime: 60, timeUnderTension: 3 },
      { id: '2', name: 'Bodyweight Squats', sets: 3, reps: 20, restTime: 60, timeUnderTension: 3 },
      { id: '3', name: 'Plank', sets: 3, reps: 1, restTime: 60, timeUnderTension: 30 },
      { id: '4', name: 'Mountain Climbers', sets: 3, reps: 20, restTime: 60, timeUnderTension: 2 },
      { id: '5', name: 'Burpees', sets: 3, reps: 10, restTime: 90, timeUnderTension: 3 }
    ]
  }
];

const dietOptions: DietOption[] = [
  {
    id: 'breakfast-1',
    name: 'Protein-Packed Breakfast',
    type: 'breakfast',
    description: 'High-protein breakfast to fuel your morning and support muscle growth',
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 18,
    timing: '7:00 AM - 8:00 AM',
    fitnessGoal: 'muscle_gain',
    foods: [
      { id: '1', name: 'Eggs', quantity: '3 whole eggs', calories: 210, protein: 18, carbs: 0, fat: 15, category: 'protein' },
      { id: '2', name: 'Oatmeal', quantity: '1 cup cooked', calories: 150, protein: 6, carbs: 27, fat: 3, category: 'carbs' },
      { id: '3', name: 'Banana', quantity: '1 medium', calories: 90, protein: 1, carbs: 18, fat: 0, category: 'fruits' }
    ]
  },
  {
    id: 'lunch-1',
    name: 'Balanced Muscle Building Lunch',
    type: 'lunch',
    description: 'Complete meal with lean protein, complex carbs, and healthy fats',
    calories: 650,
    protein: 45,
    carbs: 65,
    fat: 22,
    timing: '12:00 PM - 1:00 PM',
    fitnessGoal: 'muscle_gain',
    foods: [
      { id: '1', name: 'Chicken Breast', quantity: '6 oz grilled', calories: 280, protein: 35, carbs: 0, fat: 6, category: 'protein' },
      { id: '2', name: 'Brown Rice', quantity: '1 cup cooked', calories: 220, protein: 5, carbs: 45, fat: 2, category: 'carbs' },
      { id: '3', name: 'Broccoli', quantity: '1 cup steamed', calories: 55, protein: 4, carbs: 11, fat: 0, category: 'vegetables' },
      { id: '4', name: 'Olive Oil', quantity: '1 tbsp', calories: 120, protein: 0, carbs: 0, fat: 14, category: 'fats' }
    ]
  },
  {
    id: 'dinner-1',
    name: 'Recovery Dinner',
    type: 'dinner',
    description: 'Light dinner to support recovery and muscle repair',
    calories: 500,
    protein: 40,
    carbs: 35,
    fat: 20,
    timing: '7:00 PM - 8:00 PM',
    fitnessGoal: 'muscle_gain',
    foods: [
      { id: '1', name: 'Salmon', quantity: '5 oz grilled', calories: 280, protein: 30, carbs: 0, fat: 16, category: 'protein' },
      { id: '2', name: 'Sweet Potato', quantity: '1 medium', calories: 120, protein: 2, carbs: 28, fat: 0, category: 'carbs' },
      { id: '3', name: 'Spinach', quantity: '2 cups raw', calories: 20, protein: 3, carbs: 3, fat: 0, category: 'vegetables' },
      { id: '4', name: 'Avocado', quantity: '1/4 medium', calories: 80, protein: 1, carbs: 4, fat: 7, category: 'fats' }
    ]
  },
  {
    id: 'pre-workout-1',
    name: 'Pre-Workout Energy Boost',
    type: 'pre_workout',
    description: 'Light snack to provide energy for your workout',
    calories: 200,
    protein: 15,
    carbs: 25,
    fat: 5,
    timing: '30-45 minutes before workout',
    fitnessGoal: 'performance',
    foods: [
      { id: '1', name: 'Greek Yogurt', quantity: '1/2 cup', calories: 100, protein: 15, carbs: 8, fat: 0, category: 'protein' },
      { id: '2', name: 'Apple', quantity: '1 medium', calories: 80, protein: 0, carbs: 17, fat: 0, category: 'fruits' },
      { id: '3', name: 'Almonds', quantity: '10 almonds', calories: 70, protein: 2, carbs: 2, fat: 6, category: 'fats' }
    ]
  },
  {
    id: 'post-workout-1',
    name: 'Post-Workout Recovery',
    type: 'post_workout',
    description: 'Fast-absorbing nutrients to kickstart recovery',
    calories: 300,
    protein: 25,
    carbs: 35,
    fat: 8,
    timing: 'Within 30 minutes after workout',
    fitnessGoal: 'performance',
    foods: [
      { id: '1', name: 'Whey Protein', quantity: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 1, category: 'protein' },
      { id: '2', name: 'Banana', quantity: '1 medium', calories: 90, protein: 1, carbs: 18, fat: 0, category: 'fruits' },
      { id: '3', name: 'Honey', quantity: '1 tbsp', calories: 60, protein: 0, carbs: 14, fat: 0, category: 'carbs' },
      { id: '4', name: 'Milk', quantity: '1/2 cup', calories: 60, protein: 4, carbs: 6, fat: 3, category: 'protein' }
    ]
  },
  {
    id: 'weight-loss-1',
    name: 'Weight Loss Breakfast',
    type: 'breakfast',
    description: 'Low-calorie, high-fiber breakfast to support weight loss',
    calories: 300,
    protein: 20,
    carbs: 35,
    fat: 10,
    timing: '7:00 AM - 8:00 AM',
    fitnessGoal: 'weight_loss',
    foods: [
      { id: '1', name: 'Egg Whites', quantity: '4 egg whites', calories: 80, protein: 16, carbs: 0, fat: 0, category: 'protein' },
      { id: '2', name: 'Steel Cut Oats', quantity: '1/2 cup cooked', calories: 150, protein: 6, carbs: 27, fat: 3, category: 'carbs' },
      { id: '3', name: 'Berries', quantity: '1/2 cup', calories: 40, protein: 1, carbs: 8, fat: 0, category: 'fruits' },
      { id: '4', name: 'Chia Seeds', quantity: '1 tbsp', calories: 30, protein: 2, carbs: 0, fat: 2, category: 'fats' }
    ]
  }
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI fitness and nutrition assistant. I can help you with:\n\n🏋️‍♂️ Workout plans and exercise recommendations\n🍎 Diet plans and meal timing\n⏰ What to eat based on your schedule\n💪 Nutrition for your fitness goals\n\nChoose an option below or type your request:",
      timestamp: new Date(),
      showOptions: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutOption | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietOption | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<{ [key: string]: Partial<Exercise> }>({});
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response based on user input
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let aiMessage: ChatMessage;

      if (lowerInput.includes('diet') || lowerInput.includes('eat') || lowerInput.includes('food') || lowerInput.includes('meal')) {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Great! Here are some diet options based on your request. Choose the one that fits your goals and timing:",
          timestamp: new Date(),
          dietOptions: dietOptions
        };
      } else if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('train')) {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "Great! Here are some workout options based on your request. Choose the one that fits your goals:",
          timestamp: new Date(),
          workoutOptions: workoutOptions
        };
      } else {
        aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I can help you with both workouts and diet! Would you like workout recommendations or meal planning? You can ask me about specific workouts, diet plans, or what to eat at different times of the day.",
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleWorkoutSelection = (workout: WorkoutOption) => {
    setSelectedWorkout(workout);
    const selectionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Perfect choice! Here's your ${workout.name} workout. You can customize each exercise with your specific reps, weight, and time under tension.`,
      timestamp: new Date(),
      selectedWorkout: workout
    };
    setMessages(prev => [...prev, selectionMessage]);
  };

  const handleDietSelection = (diet: DietOption) => {
    setSelectedDiet(diet);
    const selectionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Excellent choice! Here's your ${diet.name} meal plan. This ${diet.type} is perfect for ${diet.timing} and supports your ${diet.fitnessGoal} goals.`,
      timestamp: new Date(),
      selectedDiet: diet
    };
    setMessages(prev => [...prev, selectionMessage]);
  };

  const handleExerciseDetails = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setExerciseDetails(prev => ({
      ...prev,
      [exercise.id]: {
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        restTime: exercise.restTime,
        timeUnderTension: exercise.timeUnderTension
      }
    }));
    setDetailsDialogOpen(true);
  };

  const handleSaveDetails = () => {
    if (currentExercise) {
      setExerciseDetails(prev => ({
        ...prev,
        [currentExercise.id]: {
          ...prev[currentExercise.id],
          ...exerciseDetails[currentExercise.id]
        }
      }));
      setDetailsDialogOpen(false);
    }
  };

  const getWorkoutTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      push: 'error',
      pull: 'primary',
      legs: 'secondary',
      full_body: 'success',
      cardio: 'warning',
      strength: 'info'
    };
    return colors[type] || 'default';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'error'
    };
    return colors[difficulty] || 'default';
  };

  const getDietTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      breakfast: 'warning',
      lunch: 'primary',
      dinner: 'secondary',
      snack: 'info',
      pre_workout: 'success',
      post_workout: 'error'
    };
    return colors[type] || 'default';
  };

  const getFitnessGoalColor = (goal: string) => {
    const colors: { [key: string]: string } = {
      weight_loss: 'error',
      muscle_gain: 'success',
      maintenance: 'info',
      performance: 'warning'
    };
    return colors[goal] || 'default';
  };

  return (
    <Box sx={{ p: { xs: 0, sm: 0.5, md: 1 }, height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" sx={{ mb: { xs: 0.5, sm: 1 }, fontWeight: 600 }}>
        AI Fitness & Nutrition Assistant 💬
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, sm: 2 } }}>
        Chat with your AI trainer for personalized workouts and meal plans
      </Typography>

      {/* Chat Messages */}
      <Paper 
        elevation={2} 
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          p: 2, 
          overflow: 'auto',
          backgroundColor: '#f8f9fa'
        }}
      >
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  backgroundColor: message.type === 'user' ? 'primary.main' : 'white',
                  color: message.type === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, mt: 1, display: 'block' }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>

            {/* Workout Options */}
            {message.workoutOptions && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Available Workouts:
                </Typography>
                <Grid container spacing={1}>
                  {message.workoutOptions.map((workout) => (
                    <Grid item xs={12} sm={6} key={workout.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' }
                        }}
                        onClick={() => handleWorkoutSelection(workout)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {workout.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {workout.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={workout.type.replace('_', ' ')} 
                              size="small" 
                              color={getWorkoutTypeColor(workout.type) as any}
                            />
                            <Chip 
                              label={workout.difficulty} 
                              size="small" 
                              color={getDifficultyColor(workout.difficulty) as any}
                            />
                            <Chip 
                              label={`${workout.estimatedDuration} min`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Diet Options */}
            {message.dietOptions && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Available Meal Plans:
                </Typography>
                <Grid container spacing={1}>
                  {message.dietOptions.map((diet) => (
                    <Grid item xs={12} sm={6} key={diet.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' }
                        }}
                        onClick={() => handleDietSelection(diet)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {diet.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {diet.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            <Chip 
                              label={diet.type.replace('_', ' ')} 
                              size="small" 
                              color={getDietTypeColor(diet.type) as any}
                            />
                            <Chip 
                              label={diet.fitnessGoal.replace('_', ' ')} 
                              size="small" 
                              color={getFitnessGoalColor(diet.fitnessGoal) as any}
                            />
                            <Chip 
                              label={`${diet.calories} cal`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            ⏰ {diet.timing}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Selected Workout Details */}
            {message.selectedWorkout && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Your Workout Plan:
                </Typography>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                      {message.selectedWorkout.name}
                    </Typography>
                    <List dense>
                      {message.selectedWorkout.exercises.map((exercise) => (
                        <ListItem 
                          key={exercise.id} 
                          divider 
                          sx={{ px: 0 }}
                          secondaryAction={
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => handleExerciseDetails(exercise)}
                            >
                              Customize
                            </Button>
                          }
                        >
                          <ListItemText
                            primary={exercise.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </Typography>
                                {exercise.weight && (
                                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                    • {exercise.weight} lbs
                                  </Typography>
                                )}
                                {exercise.timeUnderTension && (
                                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                    • {exercise.timeUnderTension}s TUT
                                  </Typography>
                                )}
                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                  • {exercise.restTime}s rest
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Selected Diet Details */}
            {message.selectedDiet && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Your Meal Plan:
                </Typography>
                <Card variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                      {message.selectedDiet.name}
                    </Typography>
                    
                    {/* Nutrition Summary */}
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Nutrition Summary:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="error.main">
                              {message.selectedDiet.calories}
                            </Typography>
                            <Typography variant="caption">Calories</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="primary.main">
                              {message.selectedDiet.protein}g
                            </Typography>
                            <Typography variant="caption">Protein</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="warning.main">
                              {message.selectedDiet.carbs}g
                            </Typography>
                            <Typography variant="caption">Carbs</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="info.main">
                              {message.selectedDiet.fat}g
                            </Typography>
                            <Typography variant="caption">Fat</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Food Items */}
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      What to Eat:
                    </Typography>
                    <List dense>
                      {message.selectedDiet.foods.map((food) => (
                        <ListItem key={food.id} divider sx={{ px: 0 }}>
                          <ListItemText
                            primary={food.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" component="span">
                                  {food.quantity}
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                  • {food.calories} cal
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                  • P: {food.protein}g, C: {food.carbs}g, F: {food.fat}g
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Quick Option Buttons */}
            {message.showOptions && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Quick Options:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<FitnessCenter />}
                      onClick={() => {
                        const workoutMessage: ChatMessage = {
                          id: Date.now().toString(),
                          type: 'assistant',
                          content: "Great! Here are some workout options. Choose the one that fits your goals:",
                          timestamp: new Date(),
                          workoutOptions: workoutOptions
                        };
                        setMessages(prev => [...prev, workoutMessage]);
                      }}
                      sx={{ 
                        height: 60, 
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          🏋️‍♂️ Get Workout Plan
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Push/Pull/Legs, Full Body, etc.
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<FitnessCenter />}
                      onClick={() => {
                        const dietMessage: ChatMessage = {
                          id: Date.now().toString(),
                          type: 'assistant',
                          content: "Excellent! Here are some diet options. Choose the one that fits your goals and timing:",
                          timestamp: new Date(),
                          dietOptions: dietOptions
                        };
                        setMessages(prev => [...prev, dietMessage]);
                      }}
                      sx={{ 
                        height: 60, 
                        backgroundColor: 'secondary.main',
                        '&:hover': { backgroundColor: 'secondary.dark' }
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          🍎 Get Meal Plan
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Breakfast, Lunch, Dinner, Snacks
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        const timeMessage: ChatMessage = {
                          id: Date.now().toString(),
                          type: 'assistant',
                          content: "Perfect! Let me help you with time-based recommendations. What time is it now and what are your fitness goals?",
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, timeMessage]);
                      }}
                      sx={{ 
                        height: 60, 
                        borderColor: 'info.main',
                        color: 'info.main',
                        '&:hover': { 
                          borderColor: 'info.dark',
                          backgroundColor: 'info.light',
                          color: 'info.dark'
                        }
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          ⏰ Time-Based Advice
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          What to eat based on time
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        const goalMessage: ChatMessage = {
                          id: Date.now().toString(),
                          type: 'assistant',
                          content: "Great! I can help you with specific fitness goals. Are you looking to lose weight, build muscle, improve performance, or maintain your current fitness level?",
                          timestamp: new Date()
                        };
                        setMessages(prev => [...prev, goalMessage]);
                      }}
                      sx={{ 
                        height: 60, 
                        borderColor: 'success.main',
                        color: 'success.main',
                        '&:hover': { 
                          borderColor: 'success.dark',
                          backgroundColor: 'success.light',
                          color: 'success.dark'
                        }
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          🎯 Goal-Specific Plans
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Weight loss, muscle gain, etc.
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tell me about your workout goals today..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Paper>

      {/* Exercise Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Customize Exercise: {currentExercise?.name}
        </DialogTitle>
        <DialogContent>
          {currentExercise && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Sets"
                    type="number"
                    value={exerciseDetails[currentExercise.id]?.sets || currentExercise.sets}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], sets: parseInt(e.target.value) }
                    }))}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Reps"
                    type="number"
                    value={exerciseDetails[currentExercise.id]?.reps || currentExercise.reps}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], reps: parseInt(e.target.value) }
                    }))}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Weight (lbs)"
                    type="number"
                    value={exerciseDetails[currentExercise.id]?.weight || currentExercise.weight || ''}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], weight: parseInt(e.target.value) }
                    }))}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Rest Time (sec)"
                    type="number"
                    value={exerciseDetails[currentExercise.id]?.restTime || currentExercise.restTime}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], restTime: parseInt(e.target.value) }
                    }))}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Time Under Tension (sec)"
                    type="number"
                    value={exerciseDetails[currentExercise.id]?.timeUnderTension || currentExercise.timeUnderTension || ''}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], timeUnderTension: parseInt(e.target.value) }
                    }))}
                    size="small"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">sec</InputAdornment>,
                    }}
                    helperText="How long to take for each rep (e.g., 3 seconds down, 1 second up)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={2}
                    value={exerciseDetails[currentExercise.id]?.notes || ''}
                    onChange={(e) => setExerciseDetails(prev => ({
                      ...prev,
                      [currentExercise.id]: { ...prev[currentExercise.id], notes: e.target.value }
                    }))}
                    size="small"
                    placeholder="Any specific notes or modifications..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDetails} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
