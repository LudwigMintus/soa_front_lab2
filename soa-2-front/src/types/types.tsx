// types.tsx
export interface Coordinates {
    x: number;
    y: number;
}

export interface DirectorLocation {
    x: number;
    y: number;
    z: number;
}

export interface Director {
    name: string;
    birthday: number;
    weight: number;
    location: DirectorLocation;
}

export interface Movie {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: string;
    length: number;
    oscarCount: number;
    budget: number;
    totalBoxOffice: number;
    mpaaRating: string;
    director: Director;
}

export interface MovieFormProps {
    movie?: Movie | null;
    onSuccess: () => void;
}
