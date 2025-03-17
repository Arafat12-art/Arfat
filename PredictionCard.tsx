import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PredictionCardProps {
  prediction: string;
  currentPeriod: string;
  previousResult?: string;
}

export default function PredictionCard({ prediction, currentPeriod, previousResult }: PredictionCardProps) {
  const [fadeAnim] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [prediction]);

  const [bigSmall, num1, num2] = prediction.split(' ');
  const gradientColors = bigSmall === 'BIG' ? ['#FF6B6B', '#FF8E8E'] : ['#4ECDC4', '#45B7AF'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.periodText}>Period: {currentPeriod}</Text>
        <Animated.View style={[styles.predictionContainer, { opacity: fadeAnim }]}>
          <Text style={styles.predictionTitle}>Prediction</Text>
          <Text style={styles.predictionText}>{bigSmall}</Text>
          <View style={styles.numbersContainer}>
            <Text style={styles.numberText}>{num1}</Text>
            <Text style={styles.numberText}>{num2}</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {previousResult && (
        <View style={styles.previousResultContainer}>
          <Text style={styles.previousResultTitle}>Previous Result</Text>
          <Text style={styles.previousResultText}>{previousResult}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  periodText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  predictionContainer: {
    alignItems: 'center',
  },
  predictionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  predictionText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  numbersContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  numberText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previousResultContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  previousResultTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  previousResultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});