import React, { useState } from 'react';
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
import { Image } from 'react-native';
import { colors, shadows } from '../theme/colors';

const { width } = Dimensions.get('window');

const TaskDetailsScreen = ({ navigation, route }) => {
  const { task } = route.params;
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    Alert.alert(
      'Apply for Task',
      `Are you sure you want to apply for "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            setIsApplying(true);
            // Simulate API call
            setTimeout(() => {
              setIsApplying(false);
              Alert.alert(
                'Application Submitted',
                'Your application has been submitted and is pending approval.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return colors.primary;
      case 'upcoming': return colors.accent;
      case 'completed': return colors.success;
      default: return colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{task.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
              <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
            </View>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=200&fit=crop' }}
            style={styles.mapPlaceholder}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>{task.location.address}</Text>
            <View style={[styles.locationMarker, { backgroundColor: getStatusColor(task.status) }]}>
              <Ionicons name="location" size={16} color={colors.white} />
            </View>
          </View>
        </View>

        {/* Task Details */}
        <View style={styles.detailsContainer}>
          {/* Date & Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {task.date} at {task.time} ({task.duration})
              </Text>
            </View>
          </View>

          {/* Slots */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Available Slots</Text>
              <Text style={styles.detailValue}>
                {task.slots.available} of {task.slots.total} slots available
              </Text>
              <View style={styles.slotsBar}>
                <View
                  style={[
                    styles.slotsProgress,
                    { width: `${(task.slots.filled / task.slots.total) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Payment */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="card-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment</Text>
              <Text style={styles.detailValue}>₱{task.payment.toLocaleString()}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>

          {/* Required Outfit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Outfit</Text>
            <View style={styles.requirementsContainer}>
              {task.requiredOutfit.split(', ').map((item, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.requirementText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Provided Gear */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Provided Gear</Text>
            <View style={styles.requirementsContainer}>
              {task.providedGear.split(', ').map((item, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="construct" size={16} color={colors.info} />
                  <Text style={styles.requirementText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.applyButton, isApplying && styles.applyButtonDisabled]}
          onPress={handleApply}
          disabled={isApplying || task.status === 'completed'}
        >
          <Text style={styles.applyButtonText}>
            {isApplying ? 'Applying...' : 'Apply for Task'}
          </Text>
          {isApplying && (
            <View style={styles.loadingSpinner}>
              <Ionicons name="reload" size={20} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
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
  },
  backButton: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    marginRight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapContainer: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  mapPlaceholder: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapOverlayText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  locationMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  detailRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  slotsBar: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    marginTop: 8,
  },
  slotsProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    ...shadows.small,
  },
  requirementsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    ...shadows.medium,
  },
  applyButtonDisabled: {
    opacity: 0.7,
  },
  applyButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    marginLeft: 10,
  },
});

export default TaskDetailsScreen;
