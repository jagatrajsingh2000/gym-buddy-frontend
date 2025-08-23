export interface ProgressData {
  currentStats: {
    weight: number;
    bodyFat: number;
    muscleMass: number;
    strengthScore: number;
  };
  weeklyProgress: {
    date: string;
    weight: number;
    workouts: number;
    calories: number;
  }[];
  strengthGains: {
    exercise: string;
    previousMax: number;
    currentMax: number;
    improvement: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: string;
    icon: string;
  }[];
}

export const demoProgressData: { [key: string]: ProgressData } = {
  // Client progress data
  'client@gymbuddy.com': {
    currentStats: {
      weight: 68.5,
      bodyFat: 22,
      muscleMass: 35,
      strengthScore: 65
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 70, workouts: 3, calories: 1800 },
      { date: '2024-01-08', weight: 69.5, workouts: 4, calories: 1850 },
      { date: '2024-01-15', weight: 69, workouts: 4, calories: 1900 },
      { date: '2024-01-22', weight: 68.5, workouts: 5, calories: 1950 }
    ],
    strengthGains: [
      { exercise: 'Push-ups', previousMax: 8, currentMax: 15, improvement: 87.5 },
      { exercise: 'Squats', previousMax: 12, currentMax: 20, improvement: 66.7 },
      { exercise: 'Plank', previousMax: 30, currentMax: 60, improvement: 100 }
    ],
    achievements: [
      { id: '1', title: 'First Workout', description: 'Completed your first workout!', date: '2024-01-01', icon: '🎯' },
      { id: '2', title: 'Consistency', description: 'Worked out 3 days in a row', date: '2024-01-15', icon: '🔥' },
      { id: '3', title: 'Strength Gain', description: 'Improved push-ups by 87.5%', date: '2024-01-20', icon: '💪' }
    ]
  },

  'alex.client@gymbuddy.com': {
    currentStats: {
      weight: 75.2,
      bodyFat: 18,
      muscleMass: 42,
      strengthScore: 78
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 76, workouts: 4, calories: 2200 },
      { date: '2024-01-08', weight: 75.8, workouts: 5, calories: 2250 },
      { date: '2024-01-15', weight: 75.5, workouts: 5, calories: 2300 },
      { date: '2024-01-22', weight: 75.2, workouts: 6, calories: 2350 }
    ],
    strengthGains: [
      { exercise: 'Deadlifts', previousMax: 135, currentMax: 185, improvement: 37 },
      { exercise: 'Bench Press', previousMax: 115, currentMax: 155, improvement: 34.8 },
      { exercise: 'Pull-ups', previousMax: 8, currentMax: 12, improvement: 50 }
    ],
    achievements: [
      { id: '4', title: 'Intermediate', description: 'Reached intermediate level', date: '2024-01-10', icon: '⭐' },
      { id: '5', title: 'Strength Milestone', description: 'Deadlift 185 lbs', date: '2024-01-18', icon: '🏋️' },
      { id: '6', title: 'Consistency Master', description: '5+ workouts per week', date: '2024-01-22', icon: '📈' }
    ]
  },

  'maria.client@gymbuddy.com': {
    currentStats: {
      weight: 62.8,
      bodyFat: 15,
      muscleMass: 38,
      strengthScore: 92
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 63, workouts: 5, calories: 2500 },
      { date: '2024-01-08', weight: 62.9, workouts: 6, calories: 2550 },
      { date: '2024-01-15', weight: 62.8, workouts: 6, calories: 2600 },
      { date: '2024-01-22', weight: 62.8, workouts: 7, calories: 2650 }
    ],
    strengthGains: [
      { exercise: 'Squats', previousMax: 225, currentMax: 275, improvement: 22.2 },
      { exercise: 'Deadlifts', previousMax: 275, currentMax: 315, improvement: 14.5 },
      { exercise: 'Overhead Press', previousMax: 135, currentMax: 155, improvement: 14.8 }
    ],
    achievements: [
      { id: '7', title: 'Advanced Lifter', description: 'Reached advanced level', date: '2024-01-05', icon: '👑' },
      { id: '8', title: 'PR Master', description: 'New PR on squats', date: '2024-01-15', icon: '🏆' },
      { id: '9', title: 'Elite Status', description: '300+ lb deadlift', date: '2024-01-20', icon: '💎' }
    ]
  },

  // Trainer progress data
  'trainer@gymbuddy.com': {
    currentStats: {
      weight: 70.5,
      bodyFat: 16,
      muscleMass: 40,
      strengthScore: 85
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 70.5, workouts: 6, calories: 2400 },
      { date: '2024-01-08', weight: 70.5, workouts: 6, calories: 2400 },
      { date: '2024-01-15', weight: 70.5, workouts: 7, calories: 2450 },
      { date: '2024-01-22', weight: 70.5, workouts: 7, calories: 2450 }
    ],
    strengthGains: [
      { exercise: 'Bench Press', previousMax: 185, currentMax: 205, improvement: 10.8 },
      { exercise: 'Squats', previousMax: 245, currentMax: 265, improvement: 8.2 },
      { exercise: 'Pull-ups', previousMax: 15, currentMax: 18, improvement: 20 }
    ],
    achievements: [
      { id: '10', title: 'Certified Trainer', description: 'ACE Personal Trainer', date: '2023-12-01', icon: '🎓' },
      { id: '11', title: 'Client Success', description: 'Helped 50+ clients', date: '2024-01-10', icon: '🤝' },
      { id: '12', title: 'Strength Coach', description: 'Specialized in strength', date: '2024-01-15', icon: '💪' }
    ]
  },

  'mike.trainer@gymbuddy.com': {
    currentStats: {
      weight: 73.2,
      bodyFat: 14,
      muscleMass: 41,
      strengthScore: 88
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 73.2, workouts: 5, calories: 2600 },
      { date: '2024-01-08', weight: 73.2, workouts: 6, calories: 2650 },
      { date: '2024-01-15', weight: 73.2, workouts: 6, calories: 2700 },
      { date: '2024-01-22', weight: 73.2, workouts: 7, calories: 2750 }
    ],
    strengthGains: [
      { exercise: 'Clean & Jerk', previousMax: 155, currentMax: 175, improvement: 12.9 },
      { exercise: 'Snatch', previousMax: 115, currentMax: 135, improvement: 17.4 },
      { exercise: 'Box Jumps', previousMax: 36, currentMax: 42, improvement: 16.7 }
    ],
    achievements: [
      { id: '13', title: 'HIIT Specialist', description: 'Certified HIIT trainer', date: '2023-11-15', icon: '⚡' },
      { id: '14', title: 'Group Leader', description: 'Led 100+ group classes', date: '2024-01-05', icon: '👥' },
      { id: '15', title: 'Cardio Expert', description: 'Specialized in cardio', date: '2024-01-18', icon: '❤️' }
    ]
  },

  // Admin progress overview
  'admin@gymbuddy.com': {
    currentStats: {
      weight: 0,
      bodyFat: 0,
      muscleMass: 0,
      strengthScore: 0
    },
    weeklyProgress: [
      { date: '2024-01-01', weight: 0, workouts: 0, calories: 0 },
      { date: '2024-01-08', weight: 0, workouts: 0, calories: 0 },
      { date: '2024-01-15', weight: 0, workouts: 0, calories: 0 },
      { date: '2024-01-22', weight: 0, workouts: 0, calories: 0 }
    ],
    strengthGains: [],
    achievements: [
      { id: '16', title: 'Gym Manager', description: 'Managing FitLife Gym', date: '2024-01-01', icon: '🏢' },
      { id: '17', title: 'Team Leader', description: 'Leading 10+ trainers', date: '2024-01-10', icon: '👨‍💼' },
      { id: '18', title: 'Business Growth', description: 'Increased membership by 25%', date: '2024-01-20', icon: '📊' }
    ]
  }
};

// Helper function to get demo progress for a user
export const getDemoProgress = (email: string): ProgressData => {
  return demoProgressData[email] || demoProgressData['client@gymbuddy.com'];
};
