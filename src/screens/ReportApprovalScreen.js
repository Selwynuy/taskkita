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
import { mockReports, mockUsers } from '../data/mockData';

const ReportApprovalScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [reports, setReports] = useState(mockReports);

  const filters = [
    { id: 'pending', label: 'Pending', count: mockReports.filter(r => r.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: mockReports.filter(r => r.status === 'approved').length },
    { id: 'converted', label: 'Converted', count: mockReports.filter(r => r.status === 'converted_to_task').length },
  ];

  const getFilteredReports = () => {
    if (selectedFilter === 'all') return reports;
    return reports.filter(report => report.status === selectedFilter);
  };

  const handleApprove = (reportId) => {
    Alert.alert(
      'Approve Report',
      'Are you sure you want to approve this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setReports(prev => 
              prev.map(report => 
                report.id === reportId 
                  ? { ...report, status: 'approved' }
                  : report
              )
            );
            Alert.alert('Success', 'Report approved successfully');
          },
        },
      ]
    );
  };

  const handleReject = (reportId) => {
    Alert.alert(
      'Reject Report',
      'Are you sure you want to reject this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setReports(prev => 
              prev.map(report => 
                report.id === reportId 
                  ? { ...report, status: 'rejected' }
                  : report
              )
            );
            Alert.alert('Success', 'Report rejected');
          },
        },
      ]
    );
  };

  const handleConvertToTask = (reportId) => {
    Alert.alert(
      'Convert to Task',
      'This will create a new task from this report. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Convert',
          onPress: () => {
            setReports(prev => 
              prev.map(report => 
                report.id === reportId 
                  ? { ...report, status: 'converted_to_task' }
                  : report
              )
            );
            Alert.alert('Success', 'Report converted to task successfully');
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
      case 'converted_to_task': return colors.info;
      default: return colors.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'converted_to_task': return 'Converted';
      default: return 'Unknown';
    }
  };

  const renderReportItem = ({ item }) => {
    const submitter = mockUsers.find(user => user.id === item.submittedBy);
    
    return (
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.reportContent}>
          <Text style={styles.reportDescription}>{item.description}</Text>
          
          <View style={styles.reportInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color={colors.gray} />
              <Text style={styles.infoText}>Submitted by: {submitter?.name || 'Unknown'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.gray} />
              <Text style={styles.infoText}>{item.location.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={colors.gray} />
              <Text style={styles.infoText}>
                {new Date(item.submittedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {item.photos && item.photos.length > 0 && (
            <View style={styles.photoContainer}>
              <Text style={styles.photoLabel}>Evidence:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.photos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.photo} />
                ))}
              </ScrollView>
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
            <TouchableOpacity
              style={[styles.actionButton, styles.convertButton]}
              onPress={() => handleConvertToTask(item.id)}
            >
              <Ionicons name="construct" size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>Convert</Text>
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

      {/* Reports List */}
      <FlatList
        data={getFilteredReports()}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reportsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.gray} />
            <Text style={styles.emptyText}>No {selectedFilter} reports</Text>
            <Text style={styles.emptySubtext}>
              Reports will appear here once submitted by citizens
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
  reportsList: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadows.small,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  reportTitle: {
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
  reportContent: {
    padding: 16,
  },
  reportDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  reportInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  photoContainer: {
    marginTop: 12,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
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
  convertButton: {
    backgroundColor: colors.info,
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

export default ReportApprovalScreen;
