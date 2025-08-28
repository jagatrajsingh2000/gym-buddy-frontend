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
  Chip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { bodyCompositionService, BodyComposition } from '../services/bodyMetricsService';

const BodyCompositionHistoryTest: React.FC = () => {
  const { token } = useAuth();
  const [compositions, setCompositions] = useState<BodyComposition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCompositionHistory = async (page: number = 1, limit: number = itemsPerPage) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const params: any = { page, limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await bodyCompositionService.getCompositionHistory(token, params);
      
      if (response.success && response.data) {
        setCompositions(response.data.compositions || []);
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage || 1);
          setTotalPages(response.data.pagination.totalPages || 1);
          setTotalItems(response.data.pagination.totalItems || 0);
          setItemsPerPage(response.data.pagination.itemsPerPage || 10);
        }
        setSuccess(`Successfully fetched ${response.data.compositions?.length || 0} composition records!`);
      } else {
        setError(response.message || 'Failed to fetch composition history');
        setCompositions([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error fetching composition history:', err);
      setCompositions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCompositionHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    fetchCompositionHistory(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (event: any) => {
    const newLimit = event.target.value;
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchCompositionHistory(1, newLimit);
  };

  const handleFilterSubmit = () => {
    setCurrentPage(1);
    fetchCompositionHistory(1, itemsPerPage);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    fetchCompositionHistory(1, itemsPerPage);
  };

  const handleRefresh = () => {
    fetchCompositionHistory(currentPage, itemsPerPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!token) {
    return (
      <Alert severity="warning">
        Please log in to test the Body Composition History API
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📚 Body Composition History API Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Testing GET /api/body-metrics/composition/history endpoint with pagination and filtering
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterIcon />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          {showFilters && (
            <Button 
              variant="outlined" 
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
              color="error"
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Filters */}
        {showFilters && (
          <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Date Filters
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
                <FormControl fullWidth size="small">
                  <InputLabel>Items Per Page</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label="Items Per Page"
                    onChange={handleItemsPerPageChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  onClick={handleFilterSubmit}
                  disabled={loading}
                  fullWidth
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Status Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Composition History Table */}
        {!loading && compositions.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Composition History ({totalItems} total records)
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Body Fat %</strong></TableCell>
                    <TableCell><strong>Muscle Mass</strong></TableCell>
                    <TableCell><strong>Bone Mass</strong></TableCell>
                    <TableCell><strong>Water %</strong></TableCell>
                    <TableCell><strong>Notes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compositions.map((composition) => (
                    <TableRow key={composition.id} hover>
                      <TableCell>
                        <Chip 
                          label={formatDate(composition.measurementDate)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="primary.main">
                          {composition.bodyFatPercentage ? `${composition.bodyFatPercentage}%` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main">
                          {composition.muscleMass ? `${composition.muscleMass} kg` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="warning.main">
                          {composition.boneMass ? `${composition.boneMass} kg` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="info.main">
                          {composition.waterPercentage ? `${composition.waterPercentage}%` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {composition.notes || 'No notes'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Pagination Info */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Page {currentPage} of {totalPages} • {totalItems} total items • {itemsPerPage} per page
              </Typography>
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {!loading && compositions.length === 0 && (
          <Alert severity="info">
            No body composition history available. This could mean:
            <ul>
              <li>No measurements have been logged yet</li>
              <li>The current filters don't match any data</li>
              <li>Data is being fetched...</li>
            </ul>
          </Alert>
        )}

        {/* API Response Details */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            API Response Details:
          </Typography>
          <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
            <strong>Endpoint:</strong> GET /api/body-metrics/composition/history<br />
            <strong>Status:</strong> {loading ? 'Loading...' : (error ? 'Error' : 'Success')}<br />
            <strong>Records:</strong> {compositions.length} / {totalItems}<br />
            <strong>Page:</strong> {currentPage} of {totalPages}<br />
            <strong>Filters:</strong> {startDate || endDate ? `Date: ${startDate || 'Any'} to ${endDate || 'Any'}` : 'None'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BodyCompositionHistoryTest;
