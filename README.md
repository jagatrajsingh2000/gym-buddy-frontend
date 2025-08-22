# 🏋️‍♂️ Gym Buddy Frontend

A modern, responsive fitness app frontend built with React, TypeScript, and Material-UI, integrated with a comprehensive backend API.

## ✨ Features

- **Modern UI/UX**: Clean, fitness-themed design with Material-UI components
- **Responsive Design**: Mobile-first approach that works on all devices
- **Real API Integration**: Connected to production-ready backend APIs
- **Authentication**: Secure login system with JWT tokens
- **Dashboard**: Real-time fitness stats and workout tracking
- **Component-Based**: Reusable, maintainable component architecture
- **TypeScript**: Full type safety and better development experience

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see API documentation below)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your API URL
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔌 **Backend API Integration**

This frontend is fully integrated with the Gym Buddy backend API, which provides:

### **Phase 1: MVP Foundation (25+ endpoints)**
- **Authentication**: Register, login, profile management
- **User Management**: Client, trainer, and gym profiles
- **Role-based Access**: Secure endpoints based on user type

### **Phase 2: Workout Tracking**
- **Workout Management**: Create, read, update, delete workouts
- **Exercise Tracking**: Sets, reps, weight, rest time
- **Progress Monitoring**: Status tracking and analytics

### **API Base URL**
- **Development**: `http://localhost:3000/api`
- **Production**: Configure via `REACT_APP_API_URL` environment variable

## 🔐 **Authentication**

The app uses JWT tokens for secure authentication:
1. **Register** → Create account and get token
2. **Login** → Authenticate and receive token
3. **Protected Routes** → Token required for dashboard access

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Button, Input, Card
│   └── layout/         # Header, Sidebar
├── pages/              # Page components
│   ├── auth/           # Login, Register
│   └── dashboard/      # Main dashboard
├── services/           # API service layer
│   ├── api.ts         # Base API configuration
│   ├── authService.ts # Authentication API calls
│   └── workoutService.ts # Workout API calls
├── context/            # React context providers
├── theme/              # MUI theme configuration
├── constants/          # Static data and constants
└── App.tsx            # Main app component
```

## 🎨 **Design System**

- **Primary Color**: Blue (#1976d2) - Fitness/health
- **Secondary Color**: Orange (#ff6b35) - Energy/motivation
- **Success**: Green (#4caf50) - Progress/achievement
- **Typography**: Roboto font family for readability

## 🛠️ **Available Scripts**

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔮 **Future Features**

- **Phase 3**: AI Chat System for fitness guidance
- **Phase 4**: Communication system between users
- **Phase 5**: Advanced analytics and progress tracking
- **Phase 6**: Social features and community challenges

## 📱 **Responsive Design**

The app is built with a mobile-first approach and includes:
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for mobile performance
- Breakpoint-based design adjustments

## 🧪 **Testing the App**

### **1. Start the Backend**
Ensure your Gym Buddy backend is running on `http://localhost:3000`

### **2. Test API Endpoints**
```bash
# Health check
curl http://localhost:3000/api/health

# Get available endpoints
curl http://localhost:3000/api/
```

### **3. Create a Test Account**
Use the registration endpoint to create a new user account

### **4. Login and Explore**
- Navigate through the dashboard
- Create and manage workouts
- Test responsive design on different devices

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with the backend API
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ for fitness enthusiasts everywhere!** 💪

**Frontend + Backend = Complete Fitness Solution!** 🚀
