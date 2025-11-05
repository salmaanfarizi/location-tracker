import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestLocationPermission, getLocationWithAddress} from './src/services/location';
import {saveToGoogleSheets, saveToLocalStorage} from './src/services/googleSheets';
import {Grocery, ROUTE_COLORS} from './src/types';
import MapView from './src/components/MapView';

function App(): JSX.Element {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>('');
  const [location, setLocation] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [groceries, setGroceries] = useState<Grocery[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadGroceries();
  }, []);

  const loadGroceries = async () => {
    try {
      const data = await AsyncStorage.getItem('groceries');
      if (data) {
        setGroceries(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading groceries:', error);
    }
  };

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      // Step 1: Launch Camera
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: true,
        includeBase64: false,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        setLoading(false);
        return;
      }

      const photoUri = result.assets[0].uri!;
      setCurrentPhoto(photoUri);

      // Step 2: Get GPS Location
      const locationData = await getLocationWithAddress();
      setLocation(locationData);

      setLoading(false);

      // Show success message
      Alert.alert(
        '✅ Photo & Location Captured!',
        `Location: ${locationData.address}\n\nNow enter shop name, select route, and save.`,
        [{text: 'OK'}],
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('❌ Error', 'Failed to capture data. Please try again.');
      console.error('Photo capture error:', error);
    }
  };

  const handleSave = async () => {
    if (!currentPhoto || !shopName.trim() || !location) {
      Alert.alert('⚠️ Incomplete Data', 'Please take photo and enter shop name!');
      return;
    }

    setLoading(true);

    const groceryData: Grocery = {
      id: Date.now().toString(),
      photoUri: currentPhoto,
      name: shopName.trim(),
      place: location.address || 'Unknown',
      latitude: location.latitude,
      longitude: location.longitude,
      route: selectedRoute,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to local storage
      await saveToLocalStorage(AsyncStorage, groceryData);

      // Try to save to Google Sheets
      const sheetSuccess = await saveToGoogleSheets(groceryData);

      if (sheetSuccess) {
        Alert.alert('✅ Success!', 'Data saved to Google Sheets successfully!');
      } else {
        Alert.alert(
          '⚠️ Saved Locally',
          'Data saved on device. Will sync to Google Sheets when configured.',
        );
      }

      // Reset form
      setCurrentPhoto(null);
      setShopName('');
      setLocation(null);
      await loadGroceries();
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to save data. Please try again.');
      console.error('Save error:', error);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏪 Al Hasa Grocery Tracker</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setShowMap(!showMap)}>
          <Text style={styles.mapButtonText}>
            {showMap ? '📷 Capture' : '🗺️ Map'}
          </Text>
        </TouchableOpacity>
      </View>

      {showMap ? (
        <MapView groceries={groceries} />
      ) : (
        <ScrollView style={styles.content}>
          {/* Main Capture Button */}
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePhoto}
            disabled={loading}>
            <Text style={styles.captureButtonText}>
              📸 CAPTURE PHOTO & LOCATION
            </Text>
            <Text style={styles.captureSubtext}>
              Photo + GPS + Address
            </Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}

          {/* Preview Section */}
          {currentPhoto && (
            <View style={styles.previewSection}>
              <Image source={{uri: currentPhoto}} style={styles.previewImage} />

              {/* Shop Name Input */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>🏪 Shop Name:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter shop name..."
                  value={shopName}
                  onChangeText={setShopName}
                  autoFocus={true}
                />
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>📍 Location:</Text>
                <Text style={styles.infoValue}>
                  {location?.address || 'Loading...'}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>🌐 GPS:</Text>
                <Text style={styles.infoValue}>
                  {location
                    ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                    : 'Loading...'}
                </Text>
              </View>

              {/* Route Selection */}
              <View style={styles.routeSection}>
                <Text style={styles.routeLabel}>Select Route:</Text>
                <View style={styles.routeButtons}>
                  {[1, 2, 3, 4].map(route => (
                    <TouchableOpacity
                      key={route}
                      style={[
                        styles.routeButton,
                        {
                          backgroundColor: ROUTE_COLORS[route as keyof typeof ROUTE_COLORS],
                          opacity: selectedRoute === route ? 1 : 0.5,
                        },
                      ]}
                      onPress={() => setSelectedRoute(route)}>
                      <Text style={styles.routeButtonText}>{route}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading || !shopName.trim()}>
                <Text style={styles.saveButtonText}>✅ SAVE TO GOOGLE SHEETS</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Collection Stats</Text>
            <Text style={styles.statsText}>Total Groceries: {groceries.length}</Text>
            <Text style={styles.statsText}>
              Goal: 1750 stores | Progress: {groceries.length}/1750 ({((groceries.length / 1750) * 100).toFixed(1)}%)
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mapButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureSubtext: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  previewSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputCard: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  routeSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  routeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  routeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default App;
