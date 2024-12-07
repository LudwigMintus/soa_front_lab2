import { Coordinates, DirectorLocation } from "./types/types.tsx";

const API_BASE_URL = 'https://localhost:8443/first-service-0.0.1-SNAPSHOT/movies';
const API_BASE_URL_2 = 'https://localhost:7171/second-service-1.0-SNAPSHOT/api/movies'; // Замените на ваш базовый URL API

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
};

const handleResponseNull = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
    }
    const string = await response.text();
    return string === "" ? {} : JSON.parse(string);
};

export const getMovies = async (page: number, pageSize: number, sort: string) => {
    const response = await fetch(`${API_BASE_URL}?page=${page}&pageSize=${pageSize}&sort=${sort}`, {
        headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
};

export const getMovieById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`,{
        headers: {
            'Content-Type': 'application/json',
        },});
    return handleResponse(response);
};

export const addMovie = async (movie: {
    totalBoxOffice: number;
    director: { birthday: number | string; name: string; weight: number; location: DirectorLocation };
    name: string;
    length: number;
    coordinates: Coordinates;
    oscarCount: number | null;
    creationDate: number | null;
    mpaaRating: string;
    budget: number
}) => {
    // Приведение данных к требуемому формату
    const formattedMovie = {

        id: null, // Если создается новый фильм, id может быть null
        name: movie.name,
        coordinates: {
            x: parseFloat(movie.coordinates.x.toString()),
            y: parseFloat(movie.coordinates.y.toString()),
        },
        creationDate: movie.creationDate
            ? typeof movie.creationDate === 'string'
                ? parseFloat((Date.parse(movie.creationDate) / 1000).toFixed(9)) // Приведение строки к формату с 9 знаками после запятой
                : parseFloat(movie.creationDate.toFixed(9)) // Приведение к формату с 9 знаками после запятой
            : null,// Приведение к формату с 9 знаками после запятой
        oscarCount: movie.oscarCount,
        length: movie.length,
        budget: movie.budget,
        totalBoxOffice: movie.totalBoxOffice,
        mpaaRating: movie.mpaaRating,
        director: {
            name: movie.director.name,
            birthday: typeof movie.director.birthday === 'string'
                ? (Date.parse(movie.director.birthday) / 1000).toFixed(9) // Приведение к формату с плавающей запятой
                : (movie.director.birthday / 1000).toFixed(9), // Приведение к формату с 9 знаками после запятой
            weight: movie.director.weight,
            location: {
                x: movie.director.location.x,
                y: movie.director.location.y,
                z: movie.director.location.z,
            },
        },
    };


    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedMovie),
    });
    return handleResponse(response);
};

export const updateMovie = async (id: number, movie: {
    totalBoxOffice: number;
    director: { birthday: number | string; name: string; weight: number; location: DirectorLocation };
    name: string;
    length: number;
    coordinates: Coordinates;
    oscarCount: number | null;
    creationDate: number | null;
    mpaaRating: string;
    budget: number
}) => {
    const formattedMovie = {
        id: id,
        creationDate: movie.creationDate
            ? typeof movie.creationDate === 'string'
                ? parseFloat((Date.parse(movie.creationDate) / 1000).toFixed(9)) // Приведение строки к формату с 9 знаками после запятой
                : parseFloat(String(movie.creationDate)) // Приведение к формату с 9 знаками после запятой
            : null,// Если это число, то приводим его к формату с 9 знаками после запятой
        name: movie.name,
        coordinates: {
            x: parseFloat(movie.coordinates.x.toString()),
            y: parseFloat(movie.coordinates.y.toString()),
        },
        oscarCount: movie.oscarCount,
        length: movie.length,
        budget: movie.budget,
        totalBoxOffice: movie.totalBoxOffice,
        mpaaRating: movie.mpaaRating,
        director: {
            name: movie.director.name,
            birthday: movie.director.birthday
                ? typeof movie.director.birthday === 'string'
                    ? parseFloat((Date.parse(movie.director.birthday) / 1000).toFixed(9)) // Приведение строки к формату с 9 знаками после запятой
                    : parseFloat(movie.director.birthday.toFixed(9)) // Приведение к формату с 9 знаками после запятой
                : null,
            weight: movie.director.weight,
            location: {
                x: movie.director.location.x,
                y: movie.director.location.y,
                z: movie.director.location.z,
            },
        },
    };

    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedMovie),
    });
    return handleResponse(response);
};

export const deleteMovie = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponseNull(response);
};

export const getMoviesByOscarCount = async (count: number, page: number, pageSize: number, sort: string) => {
    const response = await fetch(`${API_BASE_URL}/oscars?oscarsCount=${count}&page=${page}&pageSize=${pageSize}&sort=${sort}`, {
        headers: { "Content-Type": "application/json" },
    })
    return handleResponse(response);
};

export const getMoviesByName = async (name: string, page: number, pageSize: number, sort: string) => {
    const response = await fetch(`${API_BASE_URL}/name?substr=${name}&page=${page}&pageSize=${pageSize}&sort=${sort}`, {
        headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
};

export const deleteMoviesByRating = async (rating: string) => {
    const response = await fetch(`${API_BASE_URL}/rating?mpaaRating=${rating}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponseNull(response);
};

export const rewardMoviesByRating = async () => {
    const response = await fetch(`${API_BASE_URL_2}/reward-r`,{
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    });
    return handleResponseNull(response);
};

export const honorMoviesByLength = async (minLength: number, oscarsToAdd: number) => {
    const url = `${API_BASE_URL_2}/honor-by-length/${minLength}/oscars-to-add?oscarsCount=${oscarsToAdd}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};
