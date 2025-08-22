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
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Grid } from '../../components/common';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  LocationOn as LocationIcon,
  Event as EventIcon,
  Today as TodayIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// Static schedule data
const staticScheduleData = {
  currentWeek: [
    {
      day: "Monday",
      date: "2024-12-23",
      workouts: [
        {
          id: 1,
          name: "Upper Body Strength",
          time: "07:00",
          duration: "45 min",
          location: "Home Gym",
          type: "Strength",
          status: "Completed"
        }
      ]
    },
    {
      day: "Tuesday",
      date: "2024-12-24",
      workouts: [
        {
          id: 2,
          name: "Cardio HIIT",
          time: "18:00",
          duration: "30 min",
          location: "Local Park",
          type: "Cardio",
          status: "Scheduled"
        }
      ]
    },
    {
      day: "Wednesday",
      date: "2024-12-25",
      workouts: [
        {
          id: 3,
          name: "Lower Body Power",
          time: "08:00",
          duration: "60 min",
          location: "Home Gym",
          type: "Strength",
          status: "Scheduled"
        }
      ]
    },
    {
      day: "Thursday",
      date: "2024-12-26",
      workouts: [
        {
          id: 4,
          name: "Core & Stability",
          time: "19:00",
          duration: "25 min",
          location: "Home Gym",
          type: "Core",
          status: "Scheduled"
        }
      ]
    },
    {
      day: "Friday",
      date: "2024-12-27",
      workouts: [
        {
          id: 5,
          name: "Upper Body Strength",
          time: "07:00",
          duration: "45 min",
          location: "Home Gym",
          type: "Strength",
          status: "Scheduled"
        }
      ]
    },
    {
      day: "Saturday",
      date: "2024-12-28",
      workouts: [
        {
          id: 6,
          name: "Active Recovery",
          time: "10:00",
          duration: "30 min",
          location: "Local Park",
          type: "Recovery",
          status: "Scheduled"
        }
      ]
    },
    {
      day: "Sunday",
      date: "2024-12-29",
      workouts: []
    }
  ],
  upcomingWorkouts: [
    {
      id: 7,
      name: "Full Body Circuit",
      date: "2024-12-30",
      time: "08:00",
      duration: "50 min",
      location: "Home Gym",
      type: "Circuit",
      status: "Scheduled"
    },
    {
      id: 8,
      name: "Yoga & Stretching",
      date: "2024-12-31",
      time: "09:00",
      duration: "40 min",
      location: "Home Gym",
      type: "Flexibility",
      status: "Scheduled"
    }
  ],
  workoutTemplates: [
    { name: "Upper Body Strength", duration: "45 min", type: "Strength" },
    { name: "Lower Body Power", duration: "60 min", type: "Strength" },
    { name: "Cardio HIIT", duration: "30 min", type: "Cardio" },
    { name: "Core & Stability", duration: "25 min", type: "Core" },
    { name: "Active Recovery", duration: "30 min", type: "Recovery" }
  ]
};

const workoutTypes = ["Strength", "Cardio", "Core", "Flexibility", "Recovery", "Circuit"];
const workoutStatuses = ["Scheduled", "Completed", "Cancelled", "In Progress"];
const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState(staticScheduleData);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  const [workoutForm, setWorkoutForm] = useState({
    name: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    type: "",
    status: "Scheduled"
  });

  const handleOpenDialog = (workout?: any, day?: string) => {
    if (workout) {
      setEditingWorkout(workout);
      setWorkoutForm({
        name: workout.name,
        date: workout.date || day || "",
        time: workout.time,
        duration: workout.duration,
        location: workout.location,
        type: workout.type,
        status: workout.status
      });
    } else {
      setEditingWorkout(null);
      setWorkoutForm({
        name: "",
        date: day || "",
        time: "",
        duration: "",
        location: "",
        type: "",
        status: "Scheduled"
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingWorkout(null);
    setWorkoutForm({
      name: "",
      date: "",
      time: "",
      duration: "",
      location: "",
      type: "",
      status: "Scheduled"
    });
  };

  const handleSaveWorkout = () => {
    if (editingWorkout) {
      // Update existing workout
      const updatedSchedule = schedule.currentWeek.map(day => ({
        ...day,
        workouts: day.workouts.map(w => 
          w.id === editingWorkout.id 
            ? { ...w, ...workoutForm }
            : w
        )
      }));
      setSchedule({ ...schedule, currentWeek: updatedSchedule });
    } else {
      // Add new workout
      const newWorkout = {
        id: Date.now(),
        ...workoutForm
      };
      
      const updatedSchedule = schedule.currentWeek.map(day => {
        if (day.date === workoutForm.date) {
          return {
            ...day,
            workouts: [...day.workouts, newWorkout]
          };
        }
        return day;
      });
      
      setSchedule({ ...schedule, currentWeek: updatedSchedule });
    }
    handleCloseDialog();
  };

  const handleDeleteWorkout = (workoutId: number) => {
    const updatedSchedule = schedule.currentWeek.map(day => ({
      ...day,
      workouts: day.workouts.filter(w => w.id !== workoutId)
    }));
    setSchedule({ ...schedule, currentWeek: updatedSchedule });
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "Strength": return "primary";
      case "Cardio": return "secondary";
      case "Core": return "info";
      case "Flexibility": return "success";
      case "Recovery": return "warning";
      case "Circuit": return "error";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "success";
      case "Scheduled": return "info";
      case "In Progress": return "warning";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayOfWeek = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Workout Schedule
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Plan and manage your weekly workout routine
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Schedule Workout
        </Button>
        <Button
          variant="outlined"
          startIcon={<CalendarIcon />}
        >
          View Calendar
        </Button>
        <Button
          variant="outlined"
          startIcon={<FitnessCenterIcon />}
        >
          Workout Templates
        </Button>
      </Box>

      {/* Weekly Schedule */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            This Week's Schedule
          </Typography>
          
          <Grid container spacing={2}>
            {schedule.currentWeek.map((day, dayIndex) => (
              <Grid item xs={12} sm={6} md={3} key={dayIndex}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {day.day}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(day.date)}
                    </Typography>
                  </Box>
                  
                  {day.workouts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Rest Day
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog(null, day.date)}
                      >
                        Add Workout
                      </Button>
                    </Box>
                  ) : (
                    day.workouts.map((workout, workoutIndex) => (
                      <Box key={workoutIndex} sx={{ mb: 2 }}>
                        <Card variant="outlined" sx={{ mb: 1 }}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
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
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {workout.time}
                              </Typography>
                              <Box sx={{ mx: 1 }}>•</Box>
                              <TimerIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {workout.duration}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {workout.location}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={workout.type}
                                color={getWorkoutTypeColor(workout.type) as any}
                                size="small"
                              />
                              <Chip
                                label={workout.status}
                                color={getStatusColor(workout.status) as any}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Upcoming Workouts */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upcoming Workouts
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Workout</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.upcomingWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {formatDate(workout.date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getDayOfWeek(workout.date)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{workout.time}</TableCell>
                    <TableCell>{workout.name}</TableCell>
                    <TableCell>{workout.duration}</TableCell>
                    <TableCell>{workout.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={workout.type}
                        color={getWorkoutTypeColor(workout.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={workout.status}
                        color={getStatusColor(workout.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(workout)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Workout Templates */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Add from Templates
          </Typography>
          
          <Grid container spacing={2}>
            {schedule.workoutTemplates.map((template, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {template.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimerIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {template.duration}
                      </Typography>
                      <Box sx={{ mx: 1 }}>•</Box>
                      <Chip
                        label={template.type}
                        color={getWorkoutTypeColor(template.type) as any}
                        size="small"
                      />
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setWorkoutForm({
                          ...workoutForm,
                          name: template.name,
                          duration: template.duration,
                          type: template.type
                        });
                        setOpenDialog(true);
                      }}
                    >
                      Schedule
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Schedule/Edit Workout Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingWorkout ? 'Edit Workout' : 'Schedule New Workout'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Workout Name"
                  value={workoutForm.name}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Time</InputLabel>
                  <Select
                    value={workoutForm.time}
                    label="Time"
                    onChange={(e) => setWorkoutForm({ ...workoutForm, time: e.target.value })}
                  >
                    {timeSlots.map(time => (
                      <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  placeholder="e.g., 45 min"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g., Home Gym, Local Park"
                  value={workoutForm.location}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={workoutForm.type}
                    label="Type"
                    onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                  >
                    {workoutTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={workoutForm.status}
                    label="Status"
                    onChange={(e) => setWorkoutForm({ ...workoutForm, status: e.target.value })}
                  >
                    {workoutStatuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
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
            disabled={!workoutForm.name || !workoutForm.date || !workoutForm.time}
          >
            {editingWorkout ? 'Update' : 'Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule;
