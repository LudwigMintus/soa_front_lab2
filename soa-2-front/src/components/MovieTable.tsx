import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Movie } from '../types/types';

const formatDate = (timestamp: number | string) => {
    if (!timestamp) return 'N/A';
    const newDate = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
    return newDate.toLocaleString(); // Приводим дату к читаемому формату
};

interface MovieTableProps {
    movies: Movie[];
    onEdit: (movie: Movie) => void;
    onDelete: (id: number) => void;
}

const MovieTable: React.FC<MovieTableProps> = ({ movies, onEdit, onDelete }) => {
    console.log('Movies in MovieTable:', movies);

    if (!Array.isArray(movies) || movies.length === 0) {
        return <div>No movies available</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Coordinates</TableCell>
                        <TableCell>Creation Date</TableCell>
                        <TableCell>Length</TableCell>
                        <TableCell>Oscar Count</TableCell>
                        <TableCell>Budget</TableCell>
                        <TableCell>Total Box Office</TableCell>
                        <TableCell>MPAA Rating</TableCell>
                        <TableCell>Director Name</TableCell>
                        <TableCell>Director Birthday</TableCell>
                        <TableCell>Director Weight</TableCell>
                        <TableCell>Director Location</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {movies.map((movie) => (
                        <TableRow key={movie.id}>
                            <TableCell>{movie.id}</TableCell>
                            <TableCell>{movie.name}</TableCell>
                            <TableCell>{movie.coordinates ? `x: ${movie.coordinates.x}, y: ${movie.coordinates.y}` : 'N/A'}</TableCell>
                            <TableCell>{formatDate(movie.creationDate)}</TableCell>
                            <TableCell>{movie.length}</TableCell>
                            <TableCell>{movie.oscarCount}</TableCell>
                            <TableCell>{movie.budget}</TableCell>
                            <TableCell>{movie.totalBoxOffice}</TableCell>
                            <TableCell>{movie.mpaaRating}</TableCell>
                            <TableCell>{movie.director?.name || 'N/A'}</TableCell>
                            <TableCell>{movie.director?.birthday ? formatDate(movie.director.birthday) : 'N/A'}</TableCell>
                            <TableCell>{movie.director?.weight || 'N/A'}</TableCell>
                            <TableCell>
                                {movie.director?.location
                                    ? `x: ${movie.director.location.x}, y: ${movie.director.location.y}, z: ${movie.director.location.z}`
                                    : 'N/A'}
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" onClick={() => onEdit(movie)} sx={{ marginRight: 1 }}>
                                    Edit
                                </Button>
                                <Button variant="contained" color="error" onClick={() => onDelete(movie.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MovieTable;
