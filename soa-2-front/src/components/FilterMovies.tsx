import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import {
    getMoviesByOscarCount,
    getMoviesByName,
    getMovieById,
    deleteMoviesByRating,
    rewardMoviesByRating,
    honorMoviesByLength,
  //  getMovies
} from '../api';

interface FilterMoviesProps {
    onMoviesFetched: (movies: any[]) => void;
    page: number;
    pageSize: number;
    fetchMovies: () => void;
    setDataSource: (source: 'default' | 'filter' | 'custom') => void;
}

const FilterMovies: React.FC<FilterMoviesProps> = ({ onMoviesFetched, page, pageSize, fetchMovies, setDataSource }) => {
    const [oscarCount, setOscarCount] = useState<number>(0);
    const [searchName, setSearchName] = useState<string>('');
    const [rating, setRating] = useState<string>('');
    const [movieId, setMovieId] = useState<number | "">("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [honorLength, setHonorLength] = useState<number>(0);
    const [oscarsToAdd, setOscarsToAdd] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const handleOscarFilter = async () => {
        try {
            localStorage.setItem('oscarCount', String(oscarCount));
            setDataSource('custom');
            const result = await getMoviesByOscarCount(oscarCount, page - 1, pageSize, sortOrder);
            if (result && result.movies && Array.isArray(result.movies)) {
                onMoviesFetched(result.movies);
            } else {
                onMoviesFetched([]);
            }
        } catch (error) {
            console.error('Error fetching movies by Oscar count:', error);
            onMoviesFetched([]);
        }
    };

    const handleNameSearch = async () => {
        try {
            setDataSource('filter');
            const result = await getMoviesByName(searchName, page - 1, pageSize, sortOrder);
            if (result && result.movies && Array.isArray(result.movies)) {
                onMoviesFetched(result.movies);
            } else {
                onMoviesFetched([]);
            }
        } catch (error) {
            console.error('Error fetching movies by name:', error);
            onMoviesFetched([]);
        }
    };

    const handleGetMovieById = async () => {
        if (movieId !== "") {
            try {
                setDataSource('filter');
                const result = await getMovieById(movieId);
                if (result) {
                    onMoviesFetched([result]);
                } else {
                    onMoviesFetched([]);
                }
            } catch (error) {
                console.error('Error fetching movie by ID:', error);
                onMoviesFetched([]);
            }
        }
    };

    const handleDeleteByRating = async () => {
        try {
            await deleteMoviesByRating(rating);
            setDataSource('default');
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movies by rating:', error);
            onMoviesFetched([]);
        }
    };

    const handleRewardRMovies = async () => {
        try {
            await rewardMoviesByRating();
            setDataSource('default');
            fetchMovies();
        } catch (error) {
            console.error('Error rewarding movies by rating:', error);
            onMoviesFetched([]);
        }
    };

    const handleHonorMoviesByLength = async () => {
        if (honorLength > 0 && oscarsToAdd > 0) {
            try {
                await honorMoviesByLength(honorLength, oscarsToAdd);
                setDataSource('default');
                fetchMovies();
                setDialogOpen(false);
            } catch (error) {
                console.error('Error honoring movies by length:', error);
                onMoviesFetched([]);
            }
        }
    };

    const handleResetFilters = async () => {
        setOscarCount(0);
        setSearchName('');
        setRating('');
        setMovieId('');
        setHonorLength(0);
        setOscarsToAdd(0);
        setDataSource('default');
        fetchMovies();
        localStorage.clear();
    };

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleNameSearch} fullWidth>
                        Search by Name
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleDeleteByRating} fullWidth>
                        Delete by Rating
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleRewardRMovies} fullWidth>
                        Reward 'R' Movies
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleOscarFilter} fullWidth>
                        Filter by Oscar Count
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={() => setDialogOpen(true)} fullWidth>
                        Honor Movies by Length
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleGetMovieById} fullWidth>
                        Get Movie by ID
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button variant="contained" onClick={handleResetFilters} color="error" fullWidth>
                        Reset Filters
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Rating</InputLabel>
                        <Select
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="PG_13">PG_13</MenuItem>
                            <MenuItem value="R">R</MenuItem>
                            <MenuItem value="NC_17">NC_17</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Sort Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            fullWidth
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Movie ID"
                        type="number"
                        value={movieId}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > 0) {
                                setMovieId(value);
                            }
                        }}
                        fullWidth
                        error={movieId !== "" && movieId <= 0}
                        helperText={movieId !== "" && movieId <= 0 ? "Movie ID must be greater than zero" : ""}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Oscar Count Less Than"
                        type="number"
                        value={oscarCount}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > 0) {
                                setOscarCount(value);
                            }
                        }}
                        fullWidth
                        error={oscarCount <= 0}
                        helperText={oscarCount <= 0 ? "Oscar count must be greater than zero" : ""}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        label="Search by Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Honor Movies by Length</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Minimum Length"
                        type="number"
                        value={honorLength}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > 0) {
                                setHonorLength(value);
                            }
                        }}
                        fullWidth
                        margin="normal"
                        error={honorLength <= 0}
                        helperText={honorLength <= 0 ? "Minimum length must be greater than zero" : ""}
                    />
                    <TextField
                        label="Oscars to Add"
                        type="number"
                        value={oscarsToAdd}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > 0) {
                                setOscarsToAdd(value);
                            }
                        }}
                        fullWidth
                        margin="normal"
                        error={oscarsToAdd <= 0}
                        helperText={oscarsToAdd <= 0 ? "Oscars to add must be greater than zero" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleHonorMoviesByLength} color="primary" variant="contained">
                        Honor Movies
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FilterMovies;
