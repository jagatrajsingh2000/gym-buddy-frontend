// Demo Credentials for Different User Types
export interface DemoUser {
  email: string;
  password: string;
  userType: 'admin' | 'client' | 'trainer';
  profile: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
    permissions: string[];
    gymName?: string;
    specialization?: string;
    experience?: string;
    location?: string;
  };
}

export const demoCredentials: DemoUser[] = [
  // Gym Admin
  {
    email: "admin@gymbuddy.com",
    password: "admin123",
    userType: "admin",
    profile: {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      permissions: [
        "manage_gym",
        "manage_trainers", 
        "manage_clients",
        "view_analytics",
        "manage_equipment",
        "manage_memberships",
        "manage_classes",
        "manage_billing"
      ],
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  },
  
  // Fitness Trainer 1
  {
    email: "trainer@gymbuddy.com", 
    password: "trainer123",
    userType: "trainer",
    profile: {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      permissions: [
        "manage_clients",
        "create_workouts",
        "view_client_progress",
        "schedule_sessions",
        "manage_programs"
      ],
      specialization: "Strength Training & Weight Loss",
      experience: "5+ years",
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  },

  // Fitness Trainer 2
  {
    email: "mike.trainer@gymbuddy.com",
    password: "trainer123", 
    userType: "trainer",
    profile: {
      id: 3,
      firstName: "Mike",
      lastName: "Rodriguez",
      permissions: [
        "manage_clients",
        "create_workouts", 
        "view_client_progress",
        "schedule_sessions",
        "manage_programs"
      ],
      specialization: "HIIT & Cardio Training",
      experience: "3+ years",
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  },

  // Client 1 - Beginner
  {
    email: "client@gymbuddy.com",
    password: "client123",
    userType: "client", 
    profile: {
      id: 4,
      firstName: "Emma",
      lastName: "Davis",
      permissions: [
        "view_own_progress",
        "book_sessions",
        "view_workouts",
        "track_progress"
      ],
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  },

  // Client 2 - Intermediate
  {
    email: "alex.client@gymbuddy.com", 
    password: "client123",
    userType: "client",
    profile: {
      id: 5,
      firstName: "Alex",
      lastName: "Thompson",
      permissions: [
        "view_own_progress",
        "book_sessions", 
        "view_workouts",
        "track_progress"
      ],
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  },

  // Client 3 - Advanced
  {
    email: "maria.client@gymbuddy.com",
    password: "client123", 
    userType: "client",
    profile: {
      id: 6,
      firstName: "Maria",
      lastName: "Garcia",
      permissions: [
        "view_own_progress",
        "book_sessions",
        "view_workouts", 
        "track_progress"
      ],
      gymName: "FitLife Gym & Wellness Center",
      location: "New York, NY"
    }
  }
];

// Helper function to get demo user by email
export const getDemoUser = (email: string): DemoUser | null => {
  return demoCredentials.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};

// Helper function to validate demo credentials
export const validateDemoCredentials = (email: string, password: string): DemoUser | null => {
  const user = getDemoUser(email);
  return user && user.password === password ? user : null;
};
