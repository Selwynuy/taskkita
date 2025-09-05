import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { colors, shadows } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.3);
  const textOpacity = new Animated.Value(0);
  const loadingOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo appearance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>♻️</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: textOpacity }]}>
        <Text style={styles.appName}>TrashKita</Text>
        <Text style={styles.tagline}>Clean Communities, Better Future</Text>
      </Animated.View>

      <Animated.View style={[styles.loadingContainer, { opacity: loadingOpacity }]}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  logoText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: '0ms',
  },
  dot2: {
    animationDelay: '200ms',
  },
  dot3: {
    animationDelay: '400ms',
  },
});

export default SplashScreen;
