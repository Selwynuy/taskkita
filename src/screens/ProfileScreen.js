import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockUsers } from '../data/mockData';

const ProfileScreen = ({ navigation }) => {
  const [user] = useState(mockUsers[0]); // Mock current user

  const menuItems = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing functionality will be implemented here'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Notifications', 'Notification settings will be implemented here'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Privacy', 'Privacy settings will be implemented here'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help', 'Help and support will be implemented here'),
    },
    {
      id: 'about',
              title: 'About TrashKita',
      icon: 'information-circle-outline',
              onPress: () => Alert.alert('About', 'About TrashKita information will be displayed here'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>


        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: user.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
          {user.joinDate && (
            <Text style={styles.joinDate}>
              Member since {new Date(user.joinDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        {/* Badges */}
        <View style={styles.badgesContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <View style={styles.badgeIcon}>
                <Ionicons name="time-outline" size={24} color={colors.primary} />
              </View>
              <Text style={styles.badgeNumber}>{user.badges.cleanupHours}</Text>
              <Text style={styles.badgeLabel}>Cleanup Hours</Text>
            </View>
            <View style={styles.badge}>
              <View style={styles.badgeIcon}>
                <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
              </View>
              <Text style={styles.badgeNumber}>{user.badges.tasksCompleted}</Text>
              <Text style={styles.badgeLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.badge}>
              <View style={styles.badgeIcon}>
                <Ionicons name="star-outline" size={24} color={colors.accent} />
              </View>
              <Text style={styles.badgeNumber}>4.8</Text>
              <Text style={styles.badgeLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Role-specific Stats */}
        {user.role === 'Worker' && (
          <View style={styles.workerStatsContainer}>
            <Text style={styles.sectionTitle}>Worker Profile</Text>
            <View style={styles.workerStats}>
              <View style={styles.workerStat}>
                <Text style={styles.workerStatLabel}>Hourly Rate</Text>
                <Text style={styles.workerStatValue}>₱{user.hourlyRate || 150}/hr</Text>
              </View>
              <View style={styles.workerStat}>
                <Text style={styles.workerStatLabel}>Specializations</Text>
                <Text style={styles.workerStatValue}>
                  {user.specializations ? user.specializations.join(', ') : 'General'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₱{user.badges.tasksCompleted * 500}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.badges.cleanupHours * 2}</Text>
            <Text style={styles.statLabel}>Hours Worked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TrashKita v1.0.0</Text>
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

  profileContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 12,
    ...shadows.medium,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  joinDate: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
  },
  badgesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadows.small,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadows.small,
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
    textAlign: 'center',
  },
  workerStatsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  workerStats: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...shadows.small,
  },
  workerStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  workerStatLabel: {
    fontSize: 14,
    color: colors.gray,
  },
  workerStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default ProfileScreen;
