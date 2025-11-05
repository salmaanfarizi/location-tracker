import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import axios from 'axios';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to tag grocery stores.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS handles permissions automatically
};

/**
 * Get current GPS location
 */
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Location error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

/**
 * Reverse geocoding: Convert GPS coordinates to human-readable address
 * Using OpenStreetMap Nominatim API (free, no API key required)
 * For production, consider using Google Maps Geocoding API
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AlHasaGroceryTracker/1.0',
        },
      },
    );

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }

    // Fallback: just show coordinates
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Geocoding error:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

/**
 * Get location with address in one call
 */
export const getLocationWithAddress = async (): Promise<LocationData> => {
  const location = await getCurrentLocation();
  const address = await getAddressFromCoordinates(
    location.latitude,
    location.longitude,
  );
  return {
    ...location,
    address,
  };
};
