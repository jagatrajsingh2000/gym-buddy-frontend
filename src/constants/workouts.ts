export const SAMPLE_WORKOUTS = [
  {
    id: 1,
    name: 'Push Day - Chest & Shoulders',
    type: 'push',
    date: '2024-12-19',
    duration: 45,
    status: 'completed',
    exercises: [
      {
        exerciseId: 1,
        name: 'Bench Press',
        sets: 4,
        reps: 10,
        weight: 135,
        restTime: 90
      },
      {
        exerciseId: 5,
        name: 'Push-ups',
        sets: 3,
        reps: 15,
        weight: 0,
        restTime: 60
      }
    ]
  },
  {
    id: 2,
    name: 'Pull Day - Back & Biceps',
    type: 'pull',
    date: '2024-12-20',
    duration: 50,
    status: 'planned',
    exercises: [
      {
        exerciseId: 4,
        name: 'Pull-ups',
        sets: 3,
        reps: 8,
        weight: 0,
        restTime: 90
      },
      {
        exerciseId: 3,
        name: 'Deadlift',
        sets: 4,
        reps: 6,
        weight: 185,
        restTime: 120
      }
    ]
  },
  {
    id: 3,
    name: 'Legs Day - Quads & Glutes',
    type: 'legs',
    date: '2024-12-21',
    duration: 55,
    status: 'planned',
    exercises: [
      {
        exerciseId: 2,
        name: 'Squats',
        sets: 4,
        reps: 12,
        weight: 155,
        restTime: 90
      }
    ]
  }
];
