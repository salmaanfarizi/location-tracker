export interface Grocery {
  id: string;
  photoUri: string;
  name: string;
  place: string;
  latitude: number;
  longitude: number;
  route: number;
  timestamp: string;
}

export const ROUTE_COLORS = {
  1: '#FF6B6B', // Red
  2: '#4ECDC4', // Teal
  3: '#FFD93D', // Yellow
  4: '#6BCB77', // Green
};

export const ROUTE_NAMES = {
  1: 'Route 1 (Red)',
  2: 'Route 2 (Teal)',
  3: 'Route 3 (Yellow)',
  4: 'Route 4 (Green)',
};
