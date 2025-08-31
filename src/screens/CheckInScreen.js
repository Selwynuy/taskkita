import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, shadows } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const CheckInScreen = ({ navigation, route }) => {
  const { task } = route.params;
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for check-in');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleCheckIn = () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Unable to get your location. Please try again.');
      return;
    }

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      task.location.latitude,
      task.location.longitude
    );

    if (distance > 0.5) { // 500 meters radius
      Alert.alert(
        'Location Mismatch',
        'You must be within 500 meters of the task location to check in.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: getCurrentLocation },
        ]
      );
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsCheckedIn(true);
      Alert.alert(
        'Check-in Successful!',
        'You have successfully checked in for the task.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ProofSubmission', { task }),
          },
        ]
      );
    }, 2000);
  };

  const handleCheckOut = () => {
    Alert.alert(
      'Check Out',
      'Are you sure you want to check out? This will end your task session.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out',
          onPress: () => {
            setIsCheckedIn(false);
            navigation.navigate('ProofSubmission', { task });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Task Check-in</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskLocation}>{task.location.address}</Text>
          <Text style={styles.taskTime}>{task.date} at {task.time}</Text>
        </View>

        <View style={styles.checkInContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={isCheckedIn ? 'checkmark-circle' : 'location'}
              size={80}
              color={isCheckedIn ? colors.success : colors.primary}
            />
          </View>

          <Text style={styles.checkInTitle}>
            {isCheckedIn ? 'Checked In Successfully!' : 'Check In for Task'}
          </Text>

          <Text style={styles.checkInDescription}>
            {isCheckedIn
              ? 'You are now checked in for this task. Complete your work and submit proof when done.'
              : 'Make sure you are at the task location before checking in.'}
          </Text>

          {currentLocation && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                Your location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.checkInButton,
              isCheckedIn && styles.checkOutButton,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
            disabled={isLoading}
          >
            <Text style={styles.checkInButtonText}>
              {isLoading
                ? 'Processing...'
                : isCheckedIn
                ? 'Check Out'
                : 'Check In'}
            </Text>
            {isLoading && (
              <View style={styles.loadingSpinner}>
                <Ionicons name="reload" size={20} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
            • You must be within 500 meters of the task location{'\n'}
            • Take photos before and after completing the task{'\n'}
            • Submit proof of completion to receive payment
          </Text>
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
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  taskInfo: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    ...shadows.small,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  taskLocation: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  taskTime: {
    fontSize: 14,
    color: colors.gray,
  },
  checkInContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...shadows.medium,
  },
  iconContainer: {
    marginBottom: 16,
  },
  checkInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  checkInDescription: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  locationInfo: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  checkInButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.medium,
  },
  checkOutButton: {
    backgroundColor: colors.warning,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  checkInButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    marginLeft: 10,
  },
  instructions: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 20,
  },
});

export default CheckInScreen;
