import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { mockPayments } from '../data/mockData';

const PaymentScreen = ({ navigation }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const totalEarned = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = 1200; // Mock pending amount
  const availableAmount = totalEarned - pendingAmount;

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      'Choose your withdrawal method:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'GCash', onPress: () => processWithdrawal('GCash') },
        { text: 'Maya', onPress: () => processWithdrawal('Maya') },
        { text: 'Bank Transfer', onPress: () => processWithdrawal('Bank') },
      ]
    );
  };

  const processWithdrawal = (method) => {
    if (availableAmount <= 0) {
      Alert.alert('Error', 'No available funds to withdraw');
      return;
    }

    setIsWithdrawing(true);

    // Simulate withdrawal process
    setTimeout(() => {
      setIsWithdrawing(false);
      Alert.alert(
        'Withdrawal Successful!',
        `₱${availableAmount.toLocaleString()} has been sent to your ${method} account.`,
        [{ text: 'OK' }]
      );
    }, 2000);
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentTitle}>{item.taskTitle}</Text>
        <Text style={styles.paymentDate}>
          {new Date(item.completedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.paymentAmount}>
        <Text style={styles.amountText}>₱{item.amount.toLocaleString()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>


        {/* Earnings Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="card-outline" size={24} color={colors.primary} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Total Earned</Text>
              <Text style={styles.summaryAmount}>₱{totalEarned.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="time-outline" size={24} color={colors.warning} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryAmount}>₱{pendingAmount.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
            </View>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryLabel}>Available</Text>
              <Text style={styles.summaryAmount}>₱{availableAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Withdraw Button */}
        <View style={styles.withdrawContainer}>
          <TouchableOpacity
            style={[styles.withdrawButton, isWithdrawing && styles.withdrawButtonDisabled]}
            onPress={handleWithdraw}
            disabled={isWithdrawing || availableAmount <= 0}
          >
            <Ionicons name="cash-outline" size={24} color={colors.white} />
            <Text style={styles.withdrawButtonText}>
              {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.withdrawNote}>
            Minimum withdrawal: ₱100 | Processing time: 1-3 business days
          </Text>
        </View>

        {/* Payment History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Payment History</Text>
          <FlatList
            data={mockPayments}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="receipt-outline" size={48} color={colors.gray} />
                <Text style={styles.emptyText}>No payment history yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete tasks to see your earnings here
                </Text>
              </View>
            }
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockPayments.length}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.round(totalEarned / mockPayments.length) || 0}
            </Text>
            <Text style={styles.statLabel}>Average per Task</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Date().getMonth() + 1}
            </Text>
            <Text style={styles.statLabel}>This Month</Text>
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

  summaryContainer: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  summaryIcon: {
    marginRight: 16,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  withdrawContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  withdrawButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  withdrawButtonDisabled: {
    opacity: 0.7,
  },
  withdrawButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  withdrawNote: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  historyContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  paymentItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.small,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: colors.gray,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    ...shadows.small,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default PaymentScreen;
