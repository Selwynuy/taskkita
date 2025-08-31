import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockTaskApplications, mockTasks, mockUsers } from '../data/mockData';

const TaskApplicationApprovalScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [applications, setApplications] = useState(mockTaskApplications);

  const filters = [
    { id: 'pending', label: 'Pending', count: mockTaskApplications.filter(a => a.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: mockTaskApplications.filter(a => a.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: mockTaskApplications.filter(a => a.status === 'rejected').length },
  ];

  const getFilteredApplications = () => {
    if (selectedFilter === 'all') return applications;
    return applications.filter(app => app.status === selectedFilter);
  };

  const handleApprove = (applicationId) => {
    Alert.alert(
      'Approve Application',
      'Are you sure you want to approve this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setApplications(prev => 
              prev.map(app => 
                app.id === applicationId 
                  ? { ...app, status: 'approved' }
                  : app
              )
            );
            Alert.alert('Success', 'Application approved successfully');
          },
        },
      ]
    );
  };

  const handleReject = (applicationId) => {
    Alert.alert(
      'Reject Application',
      'Are you sure you want to reject this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setApplications(prev => 
              prev.map(app => 
                app.id === applicationId 
                  ? { ...app, status: 'rejected' }
                  : app
              )
            );
            Alert.alert('Success', 'Application rejected');
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const renderApplicationItem = ({ item }) => {
    const task = mockTasks.find(t => t.id === item.taskId);
    const user = item.user;
    
    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <Text style={styles.taskTitle}>{task?.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.applicantInfo}>
          <View style={styles.applicantHeader}>
            <Image source={{ uri: user.photo }} style={styles.applicantPhoto} />
            <View style={styles.applicantDetails}>
              <Text style={styles.applicantName}>{user.name}</Text>
              <Text style={styles.applicantRole}>{user.role}</Text>
              <Text style={styles.applicationDate}>
                Applied: {new Date(item.appliedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.applicantStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.badges.cleanupHours}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.badges.tasksCompleted}</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {task && (
            <View style={styles.taskInfo}>
              <View style={styles.taskInfoRow}>
                <Ionicons name="location-outline" size={16} color={colors.gray} />
                <Text style={styles.taskInfoText}>{task.location.address}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.gray} />
                <Text style={styles.taskInfoText}>{task.date} at {task.time}</Text>
              </View>
              <View style={styles.taskInfoRow}>
                <Ionicons name="people-outline" size={16} color={colors.gray} />
                <Text style={styles.taskInfoText}>
                  {task.slots.filled}/{task.slots.total} slots filled
                </Text>
              </View>
            </View>
          )}
        </View>

        {item.status === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark" size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close" size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterTab, selectedFilter === filter.id && styles.filterTabActive]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[styles.filterText, selectedFilter === filter.id && styles.filterTextActive]}>
              {filter.label}
            </Text>
            <View style={[styles.filterCount, selectedFilter === filter.id && styles.filterCountActive]}>
              <Text style={[styles.filterCountText, selectedFilter === filter.id && styles.filterCountTextActive]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Applications List */}
      <FlatList
        data={getFilteredApplications()}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.applicationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.gray} />
            <Text style={styles.emptyText}>No {selectedFilter} applications</Text>
            <Text style={styles.emptySubtext}>
              Task applications will appear here once workers apply
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.small,
  },
  filterTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  filterTextActive: {
    color: colors.white,
  },
  filterCount: {
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  filterCountActive: {
    backgroundColor: colors.white,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gray,
  },
  filterCountTextActive: {
    color: colors.primary,
  },
  applicationsList: {
    padding: 16,
  },
  applicationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  applicantInfo: {
    padding: 16,
  },
  applicantHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  applicantPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  applicantDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  applicantRole: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 12,
    color: colors.gray,
  },
  applicantStats: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  taskInfo: {
    marginBottom: 16,
  },
  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default TaskApplicationApprovalScreen;
