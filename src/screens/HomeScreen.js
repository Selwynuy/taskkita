import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockReports, mockTasks } from '../data/mockData';
import OpenStreetMapWebView from '../components/OpenStreetMapWebView';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

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



  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        </ScrollView>
      </View>

      {/* Interactive Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMapWebView
          data={getFilteredData()}
          onMarkerPress={handleMarkerPress}
          showUserLocation={true}
          initialRegion={mapRegion}
        />
      </View>

      {/* Floating action buttons removed (capture now on center tab) */}

      {/* Quick stats removed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...shadows.small,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
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
  // floating action styles removed
  // quick stats styles removed
});

export default HomeScreen;
