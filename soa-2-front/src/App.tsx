import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import MovieTable from './components/MovieTable';
import MovieForm from './components/MovieForm';
import FilterMovies from './components/FilterMovies';
import {deleteMovie, getMovies, getMoviesByOscarCount} from './api';
import { Movie } from './types/types';

const App: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [editableMovie, setEditableMovie] = useState<Movie | null>(null);
    const [sortField, setSortField] = useState('creationDate'); // Поле для сортировки
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Порядок сортировки
    const [dataSource, setDataSource] = useState<'default' | 'filter' | 'custom'>('default'); // Источник данных

    useEffect(() => {
        if (dataSource === 'default') {
            fetchMovies();
        }
        if(dataSource === 'custom'){
            fetchMoviesOscar();
        }
    }, [page, pageSize, sortField, sortOrder, dataSource]);

    const fetchMovies = async () => {
        try {
            const sortParam = `${sortField},${sortOrder}`;
            const result = await getMovies(page - 1, pageSize, sortParam);
            console.log('Fetched movies:', result);

            if (result && result.movies && Array.isArray(result.movies)) {
                setMovies(result.movies);
                setTotalPages(result.totalPages);
            } else {
                console.error('Unexpected data format:', result);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchMoviesOscar = async () => {
        const oscarCount = localStorage.getItem('oscarCount');

        try {
            if (oscarCount !== null) {
                const sortParam = `${sortField},${sortOrder}`;
                const result = await getMoviesByOscarCount(Number(oscarCount), page - 1, pageSize, sortParam);
                console.log('Fetched movies:', result);

                if (result && result.movies && Array.isArray(result.movies)) {
                    setMovies(result.movies);
                    setTotalPages(result.totalPages);
                } else {
                    console.error('Unexpected data format:', result);
                }
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }

    };


    const handleSuccess = () => {
        setShowForm(false);
        setEditableMovie(null);
        fetchMovies();
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleEditMovie = (movie: Movie) => {
        setEditableMovie(movie);
        setShowForm(true);
    };

    const handleDeleteMovie = async (id: number) => {
        try {
            await deleteMovie(id);
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
        }
    };

    const handleAddMovie = () => {
        setEditableMovie(null);
        setShowForm(true);
    };

    const handlePageSizeChange = (event: SelectChangeEvent) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPageSize(newPageSize);
    };

    const handleSortFieldChange = (event: SelectChangeEvent) => {
        setSortField(event.target.value);
    };

    const handleSortOrderChange = (event: SelectChangeEvent) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const handleMoviesFetched = (movies: Movie[]) => {
        setMovies(movies);
        setDataSource('custom'); // Устанавливаем кастомный источник данных
    };

    return (
        <div>
            <Grid item xs={12}>
                <Button
                    onClick={handleAddMovie}
                    variant="contained"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                >
                    Add Movie
                </Button>
            </Grid>
            <Dialog open={showForm} onClose={() => setShowForm(false)}>
                <DialogTitle>{editableMovie ? 'Edit Movie' : 'Add New Movie'}</DialogTitle>
                <DialogContent>
                    <MovieForm movie={editableMovie} onSuccess={handleSuccess} />
                </DialogContent>
                <DialogActions></DialogActions>
            </Dialog>

            <FilterMovies
                page={page}
                pageSize={pageSize}
                fetchMovies={fetchMovies}
                onMoviesFetched={handleMoviesFetched}
                setDataSource={setDataSource}
            />

            <MovieTable movies={movies} onEdit={handleEditMovie} onDelete={handleDeleteMovie} />

            <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ marginTop: 2 }}>
                <Grid item>
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Page Size</InputLabel>
                        <Select
                            value={pageSize.toString()}
                            onChange={handlePageSizeChange}
                            fullWidth
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Sort Field</InputLabel>
                        <Select
                            value={sortField}
                            onChange={handleSortFieldChange}
                            fullWidth
                        >
                            <MenuItem value="name">Name</MenuItem>
                            <MenuItem value="creationDate">Creation Date</MenuItem>
                            <MenuItem value="oscarCount">Oscar Count</MenuItem>
                            <MenuItem value="length">Length</MenuItem>
                            <MenuItem value="budget">Budget</MenuItem>
                            <MenuItem value="totalBoxOffice">Total Box Office</MenuItem>
                            <MenuItem value="mpaaRating">MPAA Rating</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl>
                        <InputLabel>Sort Order</InputLabel>
                        <Select
                            value={sortOrder}
                            onChange={handleSortOrderChange}
                            fullWidth
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    );
};

export default App;
