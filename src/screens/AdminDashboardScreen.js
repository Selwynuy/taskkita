import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockDashboardStats, mockNotifications } from '../data/mockData';

const AdminDashboardScreen = ({ navigation }) => {
  const stats = mockDashboardStats;

  const quickActions = [
    {
      id: 'reports',
      title: 'Review Reports',
      icon: 'document-text-outline',
      color: colors.primary,
      onPress: () => navigation.navigate('Reports'),
    },
    {
      id: 'applications',
      title: 'Task Applications',
      icon: 'people-outline',
      color: colors.secondary,
      onPress: () => navigation.navigate('Applications'),
    },
    {
      id: 'tasks',
      title: 'Manage Tasks',
      icon: 'construct-outline',
      color: colors.accent,
      onPress: () => Alert.alert('Manage Tasks', 'Task management will be implemented here'),
    },
    {
      id: 'payments',
      title: 'Payment Status',
      icon: 'card-outline',
      color: colors.success,
      onPress: () => Alert.alert('Payment Status', 'Payment management will be implemented here'),
    },
  ];

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={item.onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color={colors.white} />
      </View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(item.type) }]}>
        <Ionicons name={getNotificationIcon(item.type)} size={16} color={colors.white} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  );

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'error': return colors.error;
      default: return colors.info;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      default: return 'information-circle';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, Admin</Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricNumber}>{stats.totalReports}</Text>
              <Text style={styles.metricLabel}>Total Reports</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="time-outline" size={24} color={colors.warning} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricNumber}>{stats.pendingApprovals}</Text>
              <Text style={styles.metricLabel}>Pending Approvals</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="construct-outline" size={24} color={colors.accent} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricNumber}>{stats.activeTasks}</Text>
              <Text style={styles.metricLabel}>Active Tasks</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name="people-outline" size={24} color={colors.success} />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricNumber}>{stats.totalWorkersEngaged}</Text>
              <Text style={styles.metricLabel}>Workers Engaged</Text>
            </View>
          </View>
        </View>

        {/* Payment Overview */}
        <View style={styles.paymentContainer}>
          <Text style={styles.sectionTitle}>Payment Overview</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Total Payments</Text>
              <Text style={styles.paymentAmount}>₱{stats.paymentStatus.total.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Pending</Text>
              <Text style={styles.paymentAmount}>₱{stats.paymentStatus.pending.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Completed</Text>
              <Text style={styles.paymentAmount}>₱{stats.paymentStatus.completed.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </View>

        {/* Recent Notifications */}
        <View style={styles.notificationsContainer}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationsCard}>
            <FlatList
              data={mockNotifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyNotifications}>
                  <Ionicons name="notifications-outline" size={48} color={colors.gray} />
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              }
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Task "Beach Cleanup" completed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="person-add" size={16} color={colors.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New worker registered</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="document-text" size={16} color={colors.warning} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>New report submitted</Text>
                <Text style={styles.activityTime}>6 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeSection: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: '1%',
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  metricIcon: {
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.gray,
  },
  paymentContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  paymentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.text,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 10,
  },
  quickActionsList: {
    paddingRight: 16,
  },
  quickActionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    ...shadows.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  notificationsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  notificationsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 10,
    color: colors.gray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
  },
  activityContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default AdminDashboardScreen;
