import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Chip,
  List, ListItem, ListItemText, Divider, Alert, CircularProgress, Switch, FormControlLabel
} from '@mui/material';
import { Grid as GridComponent } from '../../components/common';
import {
  Restaurant, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Timer, Scale,
  TrendingUp, Save as SaveIcon, Cancel as CancelIcon, AccessTime, LocalDining
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timing: string;
  notes: string;
}

interface MealPlan {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  timing: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foods: FoodItem[];
  notes: string;
  isActive: boolean;
}

interface DietForm {
  id?: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  timing: string;
  foods: FoodItem[];
  notes: string;
}

const ClientDiet: React.FC = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<DietForm | null>(null);
  const [mealForm, setMealForm] = useState<DietForm>({
    name: '',
    type: 'breakfast',
    timing: '',
    foods: [],
    notes: ''
  });

  // Mock data for demo purposes
  useEffect(() => {
    const mockMealPlans: MealPlan[] = [
      {
        id: '1',
        name: 'High Protein Breakfast',
        type: 'breakfast',
        timing: '7:00 AM',
        totalCalories: 450,
        totalProtein: 35,
        totalCarbs: 25,
        totalFat: 22,
        foods: [
          {
            id: '1',
            name: 'Eggs',
            quantity: '3 whole eggs',
            calories: 210,
            protein: 18,
            carbs: 1,
            fat: 15,
            timing: '7:00 AM',
            notes: 'Scrambled with butter'
          },
          {
            id: '2',
            name: 'Oatmeal',
            quantity: '1 cup cooked',
            calories: 150,
            protein: 6,
            carbs: 27,
            fat: 3,
            timing: '7:00 AM',
            notes: 'With honey and berries'
          },
          {
            id: '3',
            name: 'Greek Yogurt',
            quantity: '1/2 cup',
            calories: 90,
            protein: 11,
            carbs: 7,
            fat: 4,
            timing: '7:00 AM',
            notes: 'Plain, unsweetened'
          }
        ],
        notes: 'Perfect for muscle building and sustained energy',
        isActive: true
      },
      {
        id: '2',
        name: 'Post-Workout Recovery',
        type: 'post_workout',
        timing: '6:00 PM',
        totalCalories: 380,
        totalProtein: 28,
        totalCarbs: 45,
        totalFat: 12,
        foods: [
          {
            id: '4',
            name: 'Chicken Breast',
            quantity: '4 oz grilled',
            calories: 180,
            protein: 35,
            carbs: 0,
            fat: 4,
            timing: '6:00 PM',
            notes: 'Seasoned with herbs'
          },
          {
            id: '5',
            name: 'Sweet Potato',
            quantity: '1 medium',
            calories: 120,
            protein: 2,
            carbs: 28,
            fat: 0,
            timing: '6:00 PM',
            notes: 'Baked with cinnamon'
          },
          {
            id: '6',
            name: 'Broccoli',
            quantity: '1 cup steamed',
            calories: 55,
            protein: 4,
            carbs: 11,
            fat: 0,
            timing: '6:00 PM',
            notes: 'Lightly seasoned'
          },
          {
            id: '7',
            name: 'Protein Shake',
            quantity: '1 scoop',
            calories: 25,
            protein: 20,
            carbs: 3,
            fat: 1,
            timing: '6:00 PM',
            notes: 'Mixed with water'
          }
        ],
        notes: 'Optimal recovery meal with 3:1 carb to protein ratio',
        isActive: true
      }
    ];

    setMealPlans(mockMealPlans);
  }, []);

  const handleOpenDialog = (meal?: MealPlan) => {
    if (meal) {
      setEditingMeal(meal);
      setMealForm({
        id: meal.id,
        name: meal.name,
        type: meal.type,
        timing: meal.timing,
        foods: meal.foods,
        notes: meal.notes
      });
    } else {
      setEditingMeal(null);
      setMealForm({
        name: '',
        type: 'breakfast',
        timing: '',
        foods: [],
        notes: ''
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMeal(null);
    setMealForm({
      name: '',
      type: 'breakfast',
      timing: '',
      foods: [],
      notes: ''
    });
  };

  const handleSaveMeal = () => {
    if (!mealForm.name.trim()) return;

    if (editingMeal) {
      // Update existing meal
      setMealPlans(prev => prev.map(m => 
        m.id === mealForm.id 
          ? { 
              ...m, 
              ...mealForm,
              totalCalories: calculateTotalCalories(mealForm.foods),
              totalProtein: calculateTotalProtein(mealForm.foods),
              totalCarbs: calculateTotalCarbs(mealForm.foods),
              totalFat: calculateTotalFat(mealForm.foods)
            }
          : m
      ));
    } else {
      // Create new meal
      const newMeal: MealPlan = {
        id: Date.now().toString(),
        name: mealForm.name,
        type: mealForm.type,
        timing: mealForm.timing,
        foods: mealForm.foods,
        notes: mealForm.notes,
        totalCalories: calculateTotalCalories(mealForm.foods),
        totalProtein: calculateTotalProtein(mealForm.foods),
        totalCarbs: calculateTotalCarbs(mealForm.foods),
        totalFat: calculateTotalFat(mealForm.foods),
        isActive: true
      };
      setMealPlans(prev => [...prev, newMeal]);
    }

    handleCloseDialog();
  };

  const handleDeleteMeal = (mealId: string) => {
    setMealPlans(prev => prev.filter(m => m.id !== mealId));
  };

  const toggleMealActive = (mealId: string) => {
    setMealPlans(prev => prev.map(m => 
      m.id === mealId ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const addFood = () => {
    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      timing: '',
      notes: ''
    };
    setMealForm(prev => ({
      ...prev,
      foods: [...prev.foods, newFood]
    }));
  };

  const updateFood = (foodId: string, field: keyof FoodItem, value: any) => {
    setMealForm(prev => ({
      ...prev,
      foods: prev.foods.map(f => 
        f.id === foodId ? { ...f, [field]: value } : f
      )
    }));
  };

  const removeFood = (foodId: string) => {
    setMealForm(prev => ({
      ...prev,
      foods: prev.foods.filter(f => f.id !== foodId)
    }));
  };

  const calculateTotalCalories = (foods: FoodItem[]) => {
    return foods.reduce((total, food) => total + food.calories, 0);
  };

  const calculateTotalProtein = (foods: FoodItem[]) => {
    return foods.reduce((total, food) => total + food.protein, 0);
  };

  const calculateTotalCarbs = (foods: FoodItem[]) => {
    return foods.reduce((total, food) => total + food.carbs, 0);
  };

  const calculateTotalFat = (foods: FoodItem[]) => {
    return foods.reduce((total, food) => total + food.fat, 0);
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'success';
      case 'lunch': return 'primary';
      case 'dinner': return 'secondary';
      case 'snack': return 'warning';
      case 'pre_workout': return 'info';
      case 'post_workout': return 'error';
      default: return 'default';
    }
  };

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snack';
      case 'pre_workout': return 'Pre-Workout';
      case 'post_workout': return 'Post-Workout';
      default: return type;
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
            My Diet Plans 🍎
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage your personalized nutrition plans
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ minWidth: 140 }}
        >
          Create Meal Plan
        </Button>
      </Box>

      {/* Nutrition Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Scale sx={{ mr: 1 }} />
          Daily Nutrition Summary
        </Typography>
        <GridComponent container spacing={2}>
          <GridComponent item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="h4" color="error.dark" sx={{ fontWeight: 600 }}>
                {mealPlans.reduce((total, meal) => total + meal.totalCalories, 0)}
              </Typography>
              <Typography variant="body2" color="error.dark">
                Total Calories
              </Typography>
            </Box>
          </GridComponent>
          <GridComponent item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="h4" color="primary.dark" sx={{ fontWeight: 600 }}>
                {mealPlans.reduce((total, meal) => total + meal.totalProtein, 0)}g
              </Typography>
              <Typography variant="body2" color="primary.dark">
                Total Protein
              </Typography>
            </Box>
          </GridComponent>
          <GridComponent item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="h4" color="warning.dark" sx={{ fontWeight: 600 }}>
                {mealPlans.reduce((total, meal) => total + meal.totalCarbs, 0)}g
              </Typography>
              <Typography variant="body2" color="warning.dark">
                Total Carbs
              </Typography>
            </Box>
          </GridComponent>
          <GridComponent item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="h4" color="info.dark" sx={{ fontWeight: 600 }}>
                {mealPlans.reduce((total, meal) => total + meal.totalFat, 0)}g
              </Typography>
              <Typography variant="body2" color="info.dark">
                Total Fat
              </Typography>
            </Box>
          </GridComponent>
        </GridComponent>
      </Paper>

      {/* Meal Plan Cards */}
      <GridComponent container spacing={2}>
        {mealPlans.map((meal) => (
          <GridComponent item xs={12} md={6} lg={4} key={meal.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {meal.name}
                  </Typography>
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={meal.isActive}
                          onChange={() => toggleMealActive(meal.id)}
                          size="small"
                        />
                      }
                      label=""
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(meal)}
                      sx={{ mr: 0.5 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={getMealTypeLabel(meal.type)}
                    color={getMealTypeColor(meal.type) as any}
                    size="small"
                  />
                  <Chip
                    label={meal.timing}
                    variant="outlined"
                    size="small"
                    icon={<AccessTime />}
                  />
                  <Chip
                    label={meal.isActive ? 'Active' : 'Inactive'}
                    color={meal.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {meal.foods.length} food items
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meal.totalCalories} cal
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`P: ${meal.totalProtein}g`} size="small" variant="outlined" />
                  <Chip label={`C: ${meal.totalCarbs}g`} size="small" variant="outlined" />
                  <Chip label={`F: ${meal.totalFat}g`} size="small" variant="outlined" />
                </Box>

                {meal.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                    {meal.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </GridComponent>
        ))}
      </GridComponent>

      {/* Create/Edit Meal Plan Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMeal ? 'Edit Meal Plan' : 'Create New Meal Plan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <GridComponent container spacing={2}>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Meal Plan Name"
                  value={mealForm.name}
                  onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Meal Type</InputLabel>
                  <Select
                    value={mealForm.type}
                    label="Meal Type"
                    onChange={(e) => setMealForm(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="lunch">Lunch</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                    <MenuItem value="snack">Snack</MenuItem>
                    <MenuItem value="pre_workout">Pre-Workout</MenuItem>
                    <MenuItem value="post_workout">Post-Workout</MenuItem>
                  </Select>
                </FormControl>
              </GridComponent>
              <GridComponent item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Timing"
                  placeholder="e.g., 7:00 AM, 12:30 PM"
                  value={mealForm.timing}
                  onChange={(e) => setMealForm(prev => ({ ...prev, timing: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </GridComponent>
              <GridComponent item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={mealForm.notes}
                  onChange={(e) => setMealForm(prev => ({ ...prev, notes: e.target.value }))}
                  sx={{ mb: 3 }}
                />
              </GridComponent>
            </GridComponent>

            {/* Foods Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Food Items</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addFood}
                  size="small"
                >
                  Add Food
                </Button>
              </Box>

              {mealForm.foods.map((food, index) => (
                <Paper key={food.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Food Item {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFood(food.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <GridComponent container spacing={2}>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Food Name"
                        value={food.name}
                        onChange={(e) => updateFood(food.id, 'name', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        placeholder="e.g., 1 cup, 4 oz"
                        value={food.quantity}
                        onChange={(e) => updateFood(food.id, 'quantity', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Calories"
                        type="number"
                        value={food.calories}
                        onChange={(e) => updateFood(food.id, 'calories', parseInt(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Protein (g)"
                        type="number"
                        value={food.protein}
                        onChange={(e) => updateFood(food.id, 'protein', parseFloat(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Carbs (g)"
                        type="number"
                        value={food.carbs}
                        onChange={(e) => updateFood(food.id, 'carbs', parseFloat(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fat (g)"
                        type="number"
                        value={food.fat}
                        onChange={(e) => updateFood(food.id, 'fat', parseFloat(e.target.value) || 0)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Timing"
                        placeholder="e.g., 7:00 AM"
                        value={food.timing}
                        onChange={(e) => updateFood(food.id, 'timing', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                    <GridComponent item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Notes"
                        value={food.notes}
                        onChange={(e) => updateFood(food.id, 'notes', e.target.value)}
                        size="small"
                      />
                    </GridComponent>
                  </GridComponent>
                </Paper>
              ))}

              {mealForm.foods.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                  <Restaurant sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body1">No food items added yet</Typography>
                  <Typography variant="body2">Click "Add Food" to start building your meal</Typography>
                </Box>
              )}
            </Box>

            {/* Nutrition Summary */}
            {mealForm.foods.length > 0 && (
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Meal Nutrition Summary:
                </Typography>
                <GridComponent container spacing={2}>
                  <GridComponent item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="error.main">
                        {calculateTotalCalories(mealForm.foods)}
                      </Typography>
                      <Typography variant="caption">Calories</Typography>
                    </Box>
                  </GridComponent>
                  <GridComponent item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary.main">
                        {calculateTotalProtein(mealForm.foods)}g
                      </Typography>
                      <Typography variant="caption">Protein</Typography>
                    </Box>
                  </GridComponent>
                  <GridComponent item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="warning.main">
                        {calculateTotalCarbs(mealForm.foods)}g
                      </Typography>
                      <Typography variant="caption">Carbs</Typography>
                    </Box>
                  </GridComponent>
                  <GridComponent item xs={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="info.main">
                        {calculateTotalFat(mealForm.foods)}g
                      </Typography>
                      <Typography variant="caption">Fat</Typography>
                    </Box>
                  </GridComponent>
                </GridComponent>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMeal}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!mealForm.name.trim()}
          >
            {editingMeal ? 'Update' : 'Create'} Meal Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientDiet;
