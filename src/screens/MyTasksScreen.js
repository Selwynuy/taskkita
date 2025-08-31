import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockTasks, mockTaskApplications, mockCompletedTasks } from '../data/mockData';

const MyTasksScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', icon: 'calendar-outline' },
    { id: 'applied', label: 'Applied', icon: 'time-outline' },
    { id: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTasksByStatus = () => {
    switch (selectedTab) {
      case 'upcoming':
        return mockTasks.filter(task => task.status === 'upcoming');
      case 'applied':
        return mockTaskApplications.map(app => ({
          ...app,
          task: mockTasks.find(task => task.id === app.taskId),
        }));
      case 'completed':
        return mockCompletedTasks;
      default:
        return [];
    }
  };

  const renderTaskItem = ({ item }) => {
    if (selectedTab === 'applied') {
      return (
        <TouchableOpacity
          style={styles.taskCard}
          onPress={() => navigation.navigate('TaskDetails', { task: item.task })}
        >
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{item.task.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
          <View style={styles.taskInfo}>
            <View style={styles.taskInfoRow}>
              <Ionicons name="location-outline" size={16} color={colors.gray} />
              <Text style={styles.taskInfoText}>{item.task.location.address}</Text>
            </View>
            <View style={styles.taskInfoRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.gray} />
              <Text style={styles.taskInfoText}>{item.task.date} at {item.task.time}</Text>
            </View>
            <View style={styles.taskInfoRow}>
              <Ionicons name="card-outline" size={16} color={colors.gray} />
              <Text style={styles.taskInfoText}>₱{item.task.payment.toLocaleString()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => navigation.navigate('TaskDetails', { task: item })}
      >
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <View style={styles.taskInfo}>
          <View style={styles.taskInfoRow}>
            <Ionicons name="location-outline" size={16} color={colors.gray} />
            <Text style={styles.taskInfoText}>{item.location.address}</Text>
          </View>
          <View style={styles.taskInfoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.gray} />
            <Text style={styles.taskInfoText}>{item.date} at {item.time}</Text>
          </View>
          <View style={styles.taskInfoRow}>
            <Ionicons name="card-outline" size={16} color={colors.gray} />
            <Text style={styles.taskInfoText}>₱{item.payment.toLocaleString()}</Text>
          </View>
        </View>
        {selectedTab === 'upcoming' && (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => navigation.navigate('CheckIn', { task: item })}
          >
            <Text style={styles.checkInButtonText}>Check In</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      case 'active': return colors.primary;
      case 'upcoming': return colors.accent;
      case 'completed': return colors.success;
      default: return colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const tasks = getTasksByStatus();

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={selectedTab === tab.id ? colors.white : colors.primary}
            />
            <Text
              style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color={colors.gray} />
            <Text style={styles.emptyText}>No {selectedTab} tasks</Text>
            <Text style={styles.emptySubtext}>
              {selectedTab === 'upcoming' && 'Tasks you\'re assigned to will appear here'}
              {selectedTab === 'applied' && 'Tasks you\'ve applied for will appear here'}
              {selectedTab === 'completed' && 'Tasks you\'ve completed will appear here'}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadows.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  tabTextActive: {
    color: colors.white,
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  taskInfo: {
    marginBottom: 12,
  },
  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  checkInButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  checkInButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
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

export default MyTasksScreen;
