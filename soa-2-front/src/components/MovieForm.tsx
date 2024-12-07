import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box } from '@mui/material';
import { MovieFormProps } from '../types/types'; // Правильный импорт типов
import { addMovie, updateMovie } from "../api.tsx";  // Импортируем функции

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSuccess }) => {
    const [name, setName] = useState(movie?.name || '');
    const [oscarCount, setOscarCount] = useState<number | null>(movie?.oscarCount ?? null);
    const [length, setLength] = useState(movie?.length || 0);
    const [budget, setBudget] = useState(movie?.budget || 0);
    const [totalBoxOffice, setTotalBoxOffice] = useState(movie?.totalBoxOffice || 0);
    const [mpaaRating, setMpaaRating] = useState(movie?.mpaaRating || '');
    const [directorName, setDirectorName] = useState(movie?.director?.name || '');
    const [directorBirthday, setDirectorBirthday] = useState(movie?.director?.birthday || '');
    const [directorWeight, setDirectorWeight] = useState<number>(movie?.director?.weight || 0);
    const [directorLocation, setDirectorLocation] = useState(movie?.director?.location || { x: 0, y: 0, z: 0 });
    const [coordinates, setCoordinates] = useState(movie?.coordinates || { x: 0, y: 0 });
    const [creationDate, setCreationDate] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!movie) {
            const currentDate = (Date.now() / 1000).toFixed(9); // Генерация даты создания в нужном формате
            setCreationDate(currentDate);
        } else {
            setCreationDate(movie.creationDate.toString());
        }
    }, [movie]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (length <= 0) newErrors.length = "Length must be greater than zero";
        if (budget <= 0) newErrors.budget = "Budget must be greater than zero";
        if (totalBoxOffice <= 0) newErrors.totalBoxOffice = "Total box office must be greater than zero";
        if (!mpaaRating) newErrors.mpaaRating = "MPAA rating is required";

        // Coordinates validation
        if (coordinates.x === null) newErrors.coordinatesX = "Coordinates X is required";
        if (coordinates.y === null) newErrors.coordinatesY = "Coordinates Y is required";

        // Director validation
        if (!directorName.trim()) newErrors.directorName = "Director's name is required";
        if (!directorBirthday) newErrors.directorBirthday = "Director's birthday is required";
        if (directorWeight <= 0) newErrors.directorWeight = "Director's weight must be greater than zero";
        if (directorLocation.x === undefined || directorLocation.y === undefined || directorLocation.z === undefined) {
            newErrors.directorLocation = "Director's location is required";
        }

        // Oscar Count validation: it can be null or greater than 0
        if (oscarCount !== null && oscarCount <= 0) {
            newErrors.oscarCount = "Oscar count must be greater than zero or be empty";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            return;
        }
        const newMovie = {
            name,
            length,
            oscarCount,
            budget,
            totalBoxOffice,
            mpaaRating,
            director: {
                name: directorName,
                birthday: directorBirthday,
                weight: directorWeight,
                location: directorLocation,
            },
            coordinates,
            creationDate: creationDate ? parseFloat(creationDate) : null,
        };


        try {
            if (movie) {
                console.log(typeof newMovie.director.birthday)
                await updateMovie(movie.id, newMovie);
            } else {
                await addMovie(newMovie);
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving movie", error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto' }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Length"
                type="number"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                fullWidth
                error={Boolean(errors.length)}
                helperText={errors.length}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Oscar Count"
                type="number"
                value={oscarCount !== null ? oscarCount : ''} // Используем пустое значение, если oscarCount равен null
                onChange={(e) => {
                    const value = e.target.value !== '' ? parseInt(e.target.value, 10) : null;
                    setOscarCount(value);
                }}
                fullWidth
                error={Boolean(errors.oscarCount)}
                helperText={errors.oscarCount}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                fullWidth
                error={Boolean(errors.budget)}
                helperText={errors.budget}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Total Box Office"
                type="number"
                value={totalBoxOffice}
                onChange={(e) => setTotalBoxOffice(parseInt(e.target.value, 10))}
                fullWidth
                error={Boolean(errors.totalBoxOffice)}
                helperText={errors.totalBoxOffice}
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth error={Boolean(errors.mpaaRating)} sx={{ mb: 2 }}>
                <InputLabel>MPAA Rating</InputLabel>
                <Select
                    value={mpaaRating}
                    onChange={(e) => setMpaaRating(e.target.value)}
                >
                    <MenuItem value="PG_13">PG_13</MenuItem>
                    <MenuItem value="R">R</MenuItem>
                    <MenuItem value="NC_17">NC_17</MenuItem>
                </Select>
                <FormHelperText>{errors.mpaaRating}</FormHelperText>
            </FormControl>
            <TextField
                label="Director's Name"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                fullWidth
                error={Boolean(errors.directorName)}
                helperText={errors.directorName}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Director's Birthday"
                type="date"
                value={directorBirthday}
                onChange={(e) => setDirectorBirthday(e.target.value)}
                fullWidth
                error={Boolean(errors.directorBirthday)}
                helperText={errors.directorBirthday}
                sx={{ mb: 2 }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="Director's Weight"
                type="number"
                value={directorWeight}
                onChange={(e) => setDirectorWeight(parseInt(e.target.value, 10))} // Используем parseInt для целочисленного значения
                fullWidth
                error={Boolean(errors.directorWeight)}
                helperText={errors.directorWeight}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Director's Location X"
                type="number"
                value={directorLocation.x}
                onChange={(e) => setDirectorLocation({ ...directorLocation, x: parseInt(e.target.value, 10) })} // Используем parseInt для целочисленного значения
                fullWidth
                error={Boolean(errors.directorLocation)}
                helperText={errors.directorLocation}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Director's Location Y"
                type="number"
                value={directorLocation.y}
                onChange={(e) => setDirectorLocation({ ...directorLocation, y: parseFloat(e.target.value) })}
                fullWidth
                error={Boolean(errors.directorLocation)}
                helperText={errors.directorLocation}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Director's Location Z"
                type="number"
                value={directorLocation.z}
                onChange={(e) => setDirectorLocation({ ...directorLocation, z: parseFloat(e.target.value) })}
                fullWidth
                error={Boolean(errors.directorLocation)}
                helperText={errors.directorLocation}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Coordinates X"
                type="number"
                value={coordinates.x}
                onChange={(e) => setCoordinates({ ...coordinates, x: parseFloat(e.target.value) })}
                fullWidth
                error={Boolean(errors.coordinatesX)}
                helperText={errors.coordinatesX}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Coordinates Y"
                type="number"
                value={coordinates.y}
                onChange={(e) => setCoordinates({ ...coordinates, y: parseFloat(e.target.value) })}
                fullWidth
                error={Boolean(errors.coordinatesY)}
                helperText={errors.coordinatesY}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleSubmit} sx={{ width: '48%', mt: 2 }}>
                {movie ? "Update Movie" : "Add Movie"}
            </Button>
            <Button variant="outlined" sx={{ width: '48%', mt: 2, backgroundColor: '#f4f4f4', color: '#a31919' }} onClick={() => onSuccess()}>
                Cancel
            </Button>
        </Box>
    );
};

export default MovieForm;
