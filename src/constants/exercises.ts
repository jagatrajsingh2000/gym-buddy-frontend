export const EXERCISES = [
  {
    id: 1,
    name: 'Bench Press',
    category: 'strength',
    muscleGroup: 'chest',
    difficulty: 'intermediate',
    equipment: 'barbell, bench',
    instructions: 'Lie on bench, lower bar to chest, press up',
    image: '/images/exercises/bench-press.jpg'
  },
  {
    id: 2,
    name: 'Squats',
    category: 'strength',
    muscleGroup: 'legs',
    difficulty: 'intermediate',
    equipment: 'barbell',
    instructions: 'Stand with feet shoulder-width, squat down, stand up',
    image: '/images/exercises/squats.jpg'
  },
  {
    id: 3,
    name: 'Deadlift',
    category: 'strength',
    muscleGroup: 'back',
    difficulty: 'advanced',
    equipment: 'barbell',
    instructions: 'Stand with feet hip-width, bend down, lift bar, stand up',
    image: '/images/exercises/deadlift.jpg'
  },
  {
    id: 4,
    name: 'Pull-ups',
    category: 'strength',
    muscleGroup: 'back',
    difficulty: 'intermediate',
    equipment: 'pull-up bar',
    instructions: 'Hang from bar, pull body up until chin over bar',
    image: '/images/exercises/pull-ups.jpg'
  },
  {
    id: 5,
    name: 'Push-ups',
    category: 'strength',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: 'none',
    instructions: 'Plank position, lower body, push back up',
    image: '/images/exercises/push-ups.jpg'
  }
];

export const WORKOUT_TYPES = [
  { value: 'push', label: 'Push Day', color: '#1976d2' },
  { value: 'pull', label: 'Pull Day', color: '#ff6b35' },
  { value: 'legs', label: 'Legs Day', color: '#4caf50' },
  { value: 'full_body', label: 'Full Body', color: '#9c27b0' },
  { value: 'cardio', label: 'Cardio', color: '#ff9800' }
];

export const MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'legs', 'abs', 'glutes', 'calves', 'full body'
];
