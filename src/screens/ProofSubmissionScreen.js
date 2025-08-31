import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, shadows } from '../theme/colors';

const ProofSubmissionScreen = ({ navigation, route }) => {
  const { task } = route.params;
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (type === 'before') {
          setBeforePhoto(result.assets[0].uri);
        } else {
          setAfterPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async (type) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (type === 'before') {
          setBeforePhoto(result.assets[0].uri);
        } else {
          setAfterPhoto(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImagePicker = (type) => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: () => takePhoto(type) },
        { text: 'Gallery', onPress: () => pickImage(type) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!beforePhoto || !afterPhoto) {
      Alert.alert('Error', 'Please add both before and after photos');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Proof Submitted Successfully!',
        'Your proof has been submitted and is under review. You will be notified once approved.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Payment'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Submit Proof</Text>
        </View>

        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskLocation}>{task.location.address}</Text>
        </View>

        {/* Before Photo */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Before Photo</Text>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={() => showImagePicker('before')}
          >
            {beforePhoto ? (
              <Image source={{ uri: beforePhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={48} color={colors.gray} />
                <Text style={styles.photoPlaceholderText}>Tap to add before photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* After Photo */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>After Photo</Text>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={() => showImagePicker('after')}
          >
            {afterPhoto ? (
              <Image source={{ uri: afterPhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera-outline" size={48} color={colors.gray} />
                <Text style={styles.photoPlaceholderText}>Tap to add after photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Photo Comparison */}
        {beforePhoto && afterPhoto && (
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>Photo Comparison</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonPhoto}>
                <Text style={styles.comparisonLabel}>Before</Text>
                <Image source={{ uri: beforePhoto }} style={styles.comparisonImage} />
              </View>
              <View style={styles.comparisonPhoto}>
                <Text style={styles.comparisonLabel}>After</Text>
                <Image source={{ uri: afterPhoto }} style={styles.comparisonImage} />
              </View>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Proof'}
          </Text>
          {isSubmitting && (
            <View style={styles.loadingSpinner}>
              <Ionicons name="reload" size={20} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 40,
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
  taskInfo: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 12,
    padding: 16,
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
  },
  photoSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  photoContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  photoPlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.gray,
  },
  comparisonContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonPhoto: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  comparisonImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    ...shadows.medium,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    marginLeft: 10,
  },
});

export default ProofSubmissionScreen;
