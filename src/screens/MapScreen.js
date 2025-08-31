import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockReports, mockTasks } from '../data/mockData';
import OpenStreetMapWebView from '../components/OpenStreetMapWebView';
import MapSearchBar from '../components/MapSearchBar';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showLegend, setShowLegend] = useState(true);
  const mapRef = useRef(null);

  const filters = [
    { id: 'all', label: 'All', icon: 'apps-outline' },
    { id: 'reports', label: 'Reports', icon: 'document-text-outline' },
    { id: 'active', label: 'Active Tasks', icon: 'play-circle-outline' },
    { id: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
  ];

  const getFilteredData = () => {
    switch (selectedFilter) {
      case 'reports':
        return mockReports.map(report => ({
          ...report,
          type: 'report',
          coordinate: {
            latitude: report.location.latitude,
            longitude: report.location.longitude,
          },
        }));
      case 'active':
        return mockTasks.filter(task => task.status === 'active').map(task => ({
          ...task,
          type: 'task',
          coordinate: {
            latitude: task.location.latitude,
            longitude: task.location.longitude,
          },
        }));
      case 'completed':
        return mockTasks.filter(task => task.status === 'completed').map(task => ({
          ...task,
          type: 'task',
          coordinate: {
            latitude: task.location.latitude,
            longitude: task.location.longitude,
          },
        }));
      default:
        return [
          ...mockReports.map(report => ({
            ...report,
            type: 'report',
            coordinate: {
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            },
          })),
          ...mockTasks.map(task => ({
            ...task,
            type: 'task',
            coordinate: {
              latitude: task.location.latitude,
              longitude: task.location.longitude,
            },
          })),
        ];
    }
  };

  const handleMarkerPress = (item) => {
    if (item.type === 'report') {
      Alert.alert(
        item.title,
        item.description,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Details', onPress: () => navigation.navigate('ReportDetails', { report: item }) },
        ]
      );
    } else {
      navigation.navigate('TaskDetails', { task: item });
    }
  };

  const handleNewReport = () => {
    navigation.navigate('Report');
  };

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  const handleLocationSelect = (coordinate) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Map View</Text>
        
        <TouchableOpacity 
          style={styles.legendButton} 
          onPress={toggleLegend}
        >
          <Ionicons 
            name={showLegend ? "eye-off" : "eye"} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={selectedFilter === filter.id ? colors.white : colors.primary}
            />
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

                           {/* Map */}
        <View style={styles.mapContainer}>
          <OpenStreetMapWebView
            data={getFilteredData()}
            onMarkerPress={handleMarkerPress}
            showUserLocation={true}
            showLegend={showLegend}
            ref={mapRef}
          />
        
        {/* Search Bar */}
        <MapSearchBar
          onLocationSelect={handleLocationSelect}
          onSearch={(query) => console.log('Searching for:', query)}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewReport}>
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getFilteredData().length}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {getFilteredData().filter(item => item.type === 'report').length}
          </Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {getFilteredData().filter(item => item.type === 'task').length}
          </Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    ...shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  legendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    ...shadows.small,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    flex: 1,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  statsCard: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...shadows.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 2,
  },
});

export default MapScreen;
