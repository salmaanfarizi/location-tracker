import React from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Grocery, ROUTE_COLORS} from '../types';

interface MapViewProps {
  groceries: Grocery[];
}

const GroceryMapView: React.FC<MapViewProps> = ({groceries}) => {
  // Default center (Al Hasa, Saudi Arabia coordinates)
  const initialRegion = {
    latitude: 25.4295,
    longitude: 49.5815,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  // Calculate center if we have groceries
  const mapRegion =
    groceries.length > 0
      ? {
          latitude:
            groceries.reduce((sum, g) => sum + g.latitude, 0) /
            groceries.length,
          longitude:
            groceries.reduce((sum, g) => sum + g.longitude, 0) /
            groceries.length,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }
      : initialRegion;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={mapRegion}
        showsUserLocation
        showsMyLocationButton>
        {groceries.map(grocery => (
          <Marker
            key={grocery.id}
            coordinate={{
              latitude: grocery.latitude,
              longitude: grocery.longitude,
            }}
            pinColor={ROUTE_COLORS[grocery.route as keyof typeof ROUTE_COLORS]}
            title={grocery.name}
            description={`Route ${grocery.route} - ${grocery.place}`}>
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor:
                    ROUTE_COLORS[grocery.route as keyof typeof ROUTE_COLORS],
                },
              ]}>
              <Text style={styles.markerText}>{grocery.route}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Routes</Text>
        {[1, 2, 3, 4].map(route => {
          const count = groceries.filter(g => g.route === route).length;
          return (
            <View key={route} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      ROUTE_COLORS[route as keyof typeof ROUTE_COLORS],
                  },
                ]}
              />
              <Text style={styles.legendText}>
                Route {route}: {count} stores
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default GroceryMapView;
