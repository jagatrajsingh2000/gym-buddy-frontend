import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Alert, 
  CircularProgress,
  Grid,
  TextField,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Pagination,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Mood as MoodIcon,
  Bedtime as BedtimeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMetricsService } from '../services/bodyMetricsService';

interface WeightEntry {
  id: number;
  userId: number;
  weight: string;
  weightUnit: string;
  measurementDate: string;
  measurementTime: string | null;
  measurementCondition: string | null;
  notes: string | null;
  mood: string | null;
  sleepHours: number | null;
  stressLevel: string | null;
  bmi?: string;
  created_at: string;
  updated_at: string;
}

interface WeightPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const WeightHistoryTest: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [pagination, setPagination] = useState<WeightPagination | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Load weight history on component mount
  useEffect(() => {
    if (token) {
      fetchWeightHistory();
    }
  }, [token, currentPage, itemsPerPage]);

  const fetchWeightHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: { page?: number; limit?: number; startDate?: string; endDate?: string } = {
        page: currentPage,
        limit: itemsPerPage
      };
      
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await bodyMetricsService.getWeightHistory(token!, params);
      
      if (response.success && response.data) {
        setWeightHistory(response.data.weightHistory || []);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.message || 'Failed to fetch weight history');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching weight history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleItemsPerPageChange = (event: any) => {
    setItemsPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDateFilterChange = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchWeightHistory();
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    fetchWeightHistory();
  };

  const getMoodIcon = (mood: string | null) => {
    if (!mood) return null;
    
    switch (mood.toLowerCase()) {
      case 'good':
        return <MoodIcon color="success" />;
      case 'bad':
        return <MoodIcon color="error" />;
      case 'okay':
        return <MoodIcon color="warning" />;
      default:
        return <MoodIcon color="disabled" />;
    }
  };

  const getStressLevelColor = (level: string | null) => {
    if (!level) return 'default';
    
    switch (level.toLowerCase()) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getWeightTrend = (entries: WeightEntry[], currentIndex: number): 'increasing' | 'decreasing' | 'stable' => {
    if (currentIndex === 0 || entries.length < 2) return 'stable';
    
    const currentWeight = parseFloat(entries[currentIndex].weight);
    const previousWeight = parseFloat(entries[currentIndex - 1].weight);
    
    if (isNaN(currentWeight) || isNaN(previousWeight)) return 'stable';
    
    const difference = currentWeight - previousWeight;
    if (Math.abs(difference) < 0.1) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon color="error" />;
      case 'decreasing':
        return <TrendingDownIcon color="success" />;
      case 'stable':
        return <TrendingFlatIcon color="info" />;
      default:
        return <TrendingFlatIcon color="disabled" />;
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const formatWeight = (weight: string, unit: string): string => {
    if (!weight) return 'N/A';
    return `${weight} ${unit}`;
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Weight History API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ⚖️ Weight History API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/weight/history endpoint with pagination, filtering, and comprehensive data display
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={() => setShowFilters(!showFilters)}
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showFilters ? 'Hide Filters' : 'Show Date Filters'}
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchWeightHistory}
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </Button>
          {showFilters && (
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              startIcon={<CalendarIcon />}
              color="warning"
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Date Filters */}
        <Collapse in={showFilters}>
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Date Range Filters (Optional)
            </Typography>
            
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  onClick={handleDateFilterChange}
                  disabled={loading}
                  fullWidth
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Collapse>

        {/* Pagination Controls */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Items per page:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                disabled={loading}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {pagination && (
            <Typography variant="body2" color="text.secondary">
              Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total items • {pagination.itemsPerPage} per page
            </Typography>
          )}
        </Box>

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Weight History Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : weightHistory.length === 0 ? (
          <Alert severity="info">
            No weight history data found. Create some weight entries first.
          </Alert>
        ) : (
          <Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Condition</TableCell>
                    <TableCell>Mood</TableCell>
                    <TableCell>Sleep</TableCell>
                    <TableCell>Stress</TableCell>
                    <TableCell>BMI</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weightHistory.map((entry, index) => {
                    const trend = getWeightTrend(weightHistory, index);
                    return (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(entry.measurementDate)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatWeight(entry.weight, entry.weightUnit)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          <Tooltip title={`Weight ${trend}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getTrendIcon(trend)}
                            </Box>
                          </Tooltip>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(entry.measurementTime)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          {entry.measurementCondition ? (
                            <Chip 
                              label={entry.measurementCondition} 
                              size="small" 
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {entry.mood ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMoodIcon(entry.mood)}
                              <Typography variant="body2">
                                {entry.mood}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {entry.sleepHours ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <BedtimeIcon color="info" fontSize="small" />
                              <Typography variant="body2">
                                {entry.sleepHours}h
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {entry.stressLevel ? (
                            <Chip 
                              label={entry.stressLevel} 
                              size="small" 
                              color={getStressLevelColor(entry.stressLevel) as any}
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {entry.bmi || 'N/A'}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          {entry.notes ? (
                            <Tooltip title={entry.notes}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                  maxWidth: 100, 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {entry.notes}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  disabled={loading}
                />
              </Box>
            )}
          </Box>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> GET /api/body-metrics/weight/history<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : (weightHistory.length > 0 ? 'Success' : 'No Data'))}<br />
            <strong>Date Filters:</strong> {startDate || 'None'} to {endDate || 'None'}<br />
            <strong>Pagination:</strong> {pagination ? `Page ${pagination.currentPage}/${pagination.totalPages}` : 'Not available'}<br />
            <strong>Records:</strong> {weightHistory.length} items loaded
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeightHistoryTest;
