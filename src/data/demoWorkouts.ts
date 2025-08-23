import { Workout } from '../services/workoutService';

export const demoWorkouts: { [key: string]: Workout[] } = {
  // Client workouts
  'client@gymbuddy.com': [
    {
      id: '1',
      name: 'Beginner Full Body',
      type: 'full_body',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      duration: 45,
      status: 'completed',
      exercises: [
        { exerciseId: 1, name: 'Push-ups', sets: 3, reps: 10, weight: 0, restTime: 60 },
        { exerciseId: 2, name: 'Squats', sets: 3, reps: 15, weight: 0, restTime: 60 },
        { exerciseId: 3, name: 'Plank', sets: 3, reps: 1, weight: 0, restTime: 30 }
      ],
      notes: 'Great first workout!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Cardio Session',
      type: 'cardio',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      duration: 30,
      status: 'completed',
      exercises: [
        { exerciseId: 4, name: 'Running', sets: 1, reps: 1, weight: 0, restTime: 0 },
        { exerciseId: 5, name: 'Jumping Jacks', sets: 3, reps: 20, weight: 0, restTime: 30 }
      ],
      notes: 'Felt energized after this!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Upper Body Focus',
      type: 'push',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      duration: 40,
      status: 'planned',
      exercises: [
        { exerciseId: 6, name: 'Dumbbell Press', sets: 3, reps: 12, weight: 15, restTime: 90 },
        { exerciseId: 7, name: 'Tricep Dips', sets: 3, reps: 10, weight: 0, restTime: 60 }
      ],
      notes: 'Focus on form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  'alex.client@gymbuddy.com': [
    {
      id: '4',
      name: 'Intermediate Strength',
      type: 'full_body',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      status: 'completed',
      exercises: [
        { exerciseId: 8, name: 'Deadlifts', sets: 4, reps: 8, weight: 135, restTime: 120 },
        { exerciseId: 9, name: 'Bench Press', sets: 4, reps: 10, weight: 115, restTime: 120 },
        { exerciseId: 10, name: 'Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 90 }
      ],
      notes: 'Progressive overload working well',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'HIIT Circuit',
      type: 'cardio',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 25,
      status: 'completed',
      exercises: [
        { exerciseId: 11, name: 'Burpees', sets: 4, reps: 15, weight: 0, restTime: 30 },
        { exerciseId: 12, name: 'Mountain Climbers', sets: 4, reps: 30, weight: 0, restTime: 30 }
      ],
      notes: 'High intensity, great cardio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  'maria.client@gymbuddy.com': [
    {
      id: '6',
      name: 'Advanced Powerlifting',
      type: 'full_body',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 90,
      status: 'completed',
      exercises: [
        { exerciseId: 13, name: 'Squats', sets: 5, reps: 5, weight: 225, restTime: 180 },
        { exerciseId: 14, name: 'Deadlifts', sets: 5, reps: 3, weight: 275, restTime: 240 },
        { exerciseId: 15, name: 'Overhead Press', sets: 4, reps: 6, weight: 135, restTime: 120 }
      ],
      notes: 'New PR on squats!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '7',
      name: 'Recovery Session',
      type: 'cardio',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 45,
      status: 'planned',
      exercises: [
        { exerciseId: 16, name: 'Light Jogging', sets: 1, reps: 1, weight: 0, restTime: 0 },
        { exerciseId: 17, name: 'Stretching', sets: 3, reps: 1, weight: 0, restTime: 60 }
      ],
      notes: 'Active recovery day',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  // Trainer workouts (they can see their clients' workouts)
  'trainer@gymbuddy.com': [
    {
      id: '8',
      name: 'Client Session - Emma',
      type: 'full_body',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 50,
      status: 'completed',
      exercises: [
        { exerciseId: 18, name: 'Assisted Pull-ups', sets: 3, reps: 8, weight: 0, restTime: 90 },
        { exerciseId: 19, name: 'Goblet Squats', sets: 3, reps: 12, weight: 25, restTime: 60 }
      ],
      notes: 'Emma is progressing well with form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  'mike.trainer@gymbuddy.com': [
    {
      id: '9',
      name: 'HIIT Group Class',
      type: 'cardio',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 45,
      status: 'planned',
      exercises: [
        { exerciseId: 20, name: 'Tabata Intervals', sets: 8, reps: 1, weight: 0, restTime: 10 },
        { exerciseId: 21, name: 'Circuit Training', sets: 4, reps: 1, weight: 0, restTime: 60 }
      ],
      notes: 'High energy class planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  
  // Admin can see all workouts
  'admin@gymbuddy.com': [
    {
      id: '10',
      name: 'Gym Overview',
      type: 'full_body',
      date: new Date().toISOString(),
      duration: 0,
      status: 'completed',
      exercises: [],
      notes: 'Administrative overview of all gym activities',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Helper function to get demo workouts for a user
export const getDemoWorkouts = (email: string): Workout[] => {
  return demoWorkouts[email] || [];
};

// Helper function to get demo workout by ID
export const getDemoWorkout = (email: string, workoutId: string): Workout | null => {
  const userWorkouts = demoWorkouts[email] || [];
  return userWorkouts.find(w => w.id === workoutId) || null;
};
