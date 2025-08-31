import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, shadows } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const OpenStreetMapWebView = forwardRef(({ 
  data = [], 
  onMarkerPress, 
  showUserLocation = true,
  initialRegion = null,
  showLegend = true
}, ref) => {
  const [region, setRegion] = useState(initialRegion || {
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const webViewRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (region, duration) => {
      if (webViewRef.current) {
        const script = `
          map.setView([${region.latitude}, ${region.longitude}], ${Math.round(14 - Math.log2(region.latitudeDelta))});
        `;
        webViewRef.current.injectJavaScript(script);
      }
    },
    fitToCoordinates: (coordinates, options) => {
      if (webViewRef.current && coordinates.length > 0) {
        const bounds = coordinates.reduce((bounds, coord) => {
          bounds[0] = Math.min(bounds[0], coord.latitude);
          bounds[1] = Math.min(bounds[1], coord.longitude);
          bounds[2] = Math.max(bounds[2], coord.latitude);
          bounds[3] = Math.max(bounds[3], coord.longitude);
          return bounds;
        }, [90, 180, -90, -180]);
        
        const script = `
          map.fitBounds([[${bounds[0]}, ${bounds[1]}], [${bounds[2]}, ${bounds[3]}]], { padding: [50, 50, 50, 50] });
        `;
        webViewRef.current.injectJavaScript(script);
      }
    }
  }));

  useEffect(() => {
    if (showUserLocation) {
      requestLocationPermission();
    }
  }, [showUserLocation]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        getCurrentLocation();
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Update region to include user location
      if (data.length === 0) {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const getMarkerColor = (item) => {
    if (item.type === 'report') {
      switch (item.status) {
        case 'pending': return colors.warning;
        case 'approved': return colors.success;
        case 'converted_to_task': return colors.info;
        default: return colors.gray;
      }
    } else {
      switch (item.status) {
        case 'active': return colors.primary;
        case 'upcoming': return colors.accent;
        case 'completed': return colors.success;
        default: return colors.gray;
      }
    }
  };

  const getMarkerIcon = (item) => {
    if (item.type === 'report') {
      return 'document-text';
    } else {
      return 'construct';
    }
  };

  const handleMarkerPress = (item) => {
    if (onMarkerPress) {
      onMarkerPress(item);
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation && webViewRef.current) {
      const script = `
        map.setView([${userLocation.latitude}, ${userLocation.longitude}], 15);
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  const fitAllMarkers = () => {
    if (data.length > 0 && webViewRef.current) {
      const coordinates = data.map(item => item.coordinate);
      const bounds = coordinates.reduce((bounds, coord) => {
        bounds[0] = Math.min(bounds[0], coord.latitude);
        bounds[1] = Math.min(bounds[1], coord.longitude);
        bounds[2] = Math.max(bounds[2], coord.latitude);
        bounds[3] = Math.max(bounds[3], coord.longitude);
        return bounds;
      }, [90, 180, -90, -180]);
      
      const script = `
        map.fitBounds([[${bounds[0]}, ${bounds[1]}], [${bounds[2]}, ${bounds[3]}]], { padding: [50, 50, 50, 50] });
      `;
      webViewRef.current.injectJavaScript(script);
    }
  };

  // Create HTML content for OpenStreetMap with Leaflet
  const createMapHTML = () => {
    const markers = data.map((item, index) => {
      const color = getMarkerColor(item);
      const icon = getMarkerIcon(item);
      return `
        var marker${index} = L.marker([${item.coordinate.latitude}, ${item.coordinate.longitude}])
          .addTo(map)
          .bindPopup('<b>${item.title}</b><br>${item.type === 'report' ? 'Report' : 'Task'}<br>Status: ${item.status}');
      `;
    }).join('\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${region.latitude}, ${region.longitude}], ${Math.round(14 - Math.log2(region.latitudeDelta))});
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          ${markers}
          
          map.on('click', function(e) {
            console.log('Map clicked at:', e.latlng.lat, e.latlng.lng);
          });
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: createMapHTML() }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          console.log('WebView message:', event.nativeEvent.data);
        }}
        onError={(error) => console.log('WebView error:', error)}
        onLoad={() => console.log('OpenStreetMap WebView loaded')}
      />

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={centerOnUserLocation}
          disabled={!hasLocationPermission}
        >
          <Ionicons 
            name="locate" 
            size={20} 
            color={hasLocationPermission ? colors.primary : colors.gray} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={fitAllMarkers}
          disabled={data.length === 0}
        >
          <Ionicons 
            name="resize" 
            size={20} 
            color={data.length > 0 ? colors.primary : colors.gray} 
          />
        </TouchableOpacity>
      </View>

      {/* Legend */}
      {showLegend && (
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.primary }]}>
              <Ionicons name="construct" size={12} color={colors.white} />
            </View>
            <Text style={styles.legendText}>Active Tasks</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.warning }]}>
              <Ionicons name="document-text" size={12} color={colors.white} />
            </View>
            <Text style={styles.legendText}>Pending Reports</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark-circle" size={12} color={colors.white} />
            </View>
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    ...shadows.medium,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: colors.text,
  },
});

export default OpenStreetMapWebView;
