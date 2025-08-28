import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Collapse,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  ExpandMore,
  ExpandLess,
  FilterList,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyMeasurementsService, bodyMetricsUtils, BodyMeasurements } from '../services';

interface BodyMetricsHistoryProps {
  onRefresh?: () => void;
}

const BodyMetricsHistory: React.FC<BodyMetricsHistoryProps> = ({ onRefresh }) => {
  const { token } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState('30');
  
  // UI state
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Fetch measurements history
  const fetchHistory = async (page: number = 1, limit: number = 10) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit
      };

      // Add date filters if set
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await bodyMeasurementsService.getBodyMetricsHistory(token, params);
      
      if (response.success && response.data) {
        setMeasurements(response.data.metrics || []);
        setTotalPages(response.data.pagination?.totalPages || 0);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setItemsPerPage(response.data.pagination?.itemsPerPage || 10);
      } else {
        setError(response.message || 'Failed to fetch measurements history');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchHistory(page, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event: any) => {
    const newLimit = parseInt(event.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchHistory(1, newLimit);
  };

  // Handle date range change
  const handleDateRangeChange = (event: any) => {
    const range = event.target.value;
    setDateRange(range);
    
    if (range === 'custom') {
      // Keep custom dates
    } else if (range !== 'all') {
      const { startDate: start, endDate: end } = bodyMetricsUtils.getDateRange(parseInt(range));
      setStartDate(start);
      setEndDate(end);
      setCurrentPage(1);
      fetchHistory(1, itemsPerPage);
    } else {
      setStartDate('');
      setEndDate('');
      setCurrentPage(1);
      fetchHistory(1, itemsPerPage);
    }
  };

  // Apply custom date filters
  const applyCustomDateFilter = () => {
    setCurrentPage(1);
    fetchHistory(1, itemsPerPage);
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Calculate change from previous measurement
  const getMeasurementChange = (current: BodyMeasurements, index: number) => {
    if (index === measurements.length - 1) return null; // No previous measurement
    
    const previous = measurements[index + 1];
    return {
      chest: bodyMetricsUtils.calculateChange(current.chest, previous.chest),
      waist: bodyMetricsUtils.calculateChange(current.waist, previous.waist),
      hips: bodyMetricsUtils.calculateChange(current.hips, previous.hips),
      biceps: bodyMetricsUtils.calculateChange(current.biceps, previous.biceps),
      forearms: bodyMetricsUtils.calculateChange(current.forearms, previous.forearms),
      thighs: bodyMetricsUtils.calculateChange(current.thighs, previous.thighs),
      calves: bodyMetricsUtils.calculateChange(current.calves, previous.calves),
      neck: bodyMetricsUtils.calculateChange(current.neck, previous.neck)
    };
  };

  // Get change icon and color
  const getChangeDisplay = (change: any) => {
    if (!change || change.value === 0) {
      return { icon: <Remove />, color: 'default' as const };
    }
    
    if (change.isPositive) {
      return { icon: <TrendingUp />, color: 'success' as const };
    } else {
      return { icon: <TrendingDown />, color: 'error' as const };
    }
  };

  // Initial fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (token) {
      fetchHistory(1, 10);
    }
  }, [token]);

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to view body metrics history
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        📊 Body Metrics History
      </Typography>

      {/* Filters Section */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={handleDateRangeChange}
                label="Date Range"
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="60">Last 60 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              fullWidth
              disabled={dateRange !== 'custom'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              fullWidth
              disabled={dateRange !== 'custom'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => applyCustomDateFilter()}
                disabled={dateRange !== 'custom'}
                size="small"
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setDateRange('30');
                  setStartDate('');
                  setEndDate('');
                  fetchHistory(1, itemsPerPage);
                }}
                size="small"
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading measurements history...</Typography>
        </Box>
      )}

      {/* Measurements Table */}
      {!loading && measurements.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Chest</TableCell>
                  <TableCell>Waist</TableCell>
                  <TableCell>Hips</TableCell>
                  <TableCell>Biceps</TableCell>
                  <TableCell>Thighs</TableCell>
                  <TableCell>Calves</TableCell>
                  <TableCell>Neck</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {measurements.map((measurement, index) => {
                  const changes = getMeasurementChange(measurement, index);
                  const isExpanded = expandedRows.has(measurement.id);
                  
                  return (
                    <React.Fragment key={measurement.id}>
                      <TableRow hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                          </Typography>
                          {bodyMetricsUtils.isRecentMeasurement(measurement.measurementDate) && (
                            <Chip 
                              label="Recent" 
                              size="small" 
                              color="success" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.chest)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.chest).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.chest).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.chest)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.waist)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.waist).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.waist).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.waist)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.hips)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.hips).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.hips).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.hips)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.biceps)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.biceps).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.biceps).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.biceps)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.thighs)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.thighs).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.thighs).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.thighs)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.calves)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.calves).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.calves).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.calves)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {bodyMetricsUtils.formatMeasurement(measurement.neck)}
                          </Typography>
                          {changes && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              {getChangeDisplay(changes.neck).icon}
                              <Typography 
                                variant="caption" 
                                color={getChangeDisplay(changes.neck).color}
                                sx={{ ml: 0.5 }}
                              >
                                {bodyMetricsUtils.formatChangeLegacy(changes.neck)}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {measurement.notes ? (
                            <Tooltip title="Click to view notes">
                              <IconButton
                                size="small"
                                onClick={() => toggleRowExpansion(measurement.id)}
                              >
                                {isExpanded ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No notes
                            </Typography>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => toggleRowExpansion(measurement.id)}
                          >
                            {isExpanded ? 'Less' : 'More'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row for Notes */}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, p: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="h6" gutterBottom>
                                Notes for {bodyMetricsUtils.formatMeasurementDate(measurement.measurementDate)}
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                "{measurement.notes}"
                              </Typography>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* No Data State */}
      {!loading && measurements.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No measurements found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {startDate || endDate 
              ? 'No measurements found for the selected date range. Try adjusting your filters.'
              : 'No body measurements have been recorded yet.'
            }
          </Typography>
        </Card>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} measurements
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  label="Per Page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Card>
      )}

      {/* Refresh Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => fetchHistory(currentPage, itemsPerPage)}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
};

export default BodyMetricsHistory;
