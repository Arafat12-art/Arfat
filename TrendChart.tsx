import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameData } from '../types/gameTypes';

interface TrendChartProps {
  data: GameData[];
  prediction: string;
}

const CHART_HEIGHT = 200;
const POINT_RADIUS = 6;

export default function TrendChart({ data, prediction }: TrendChartProps) {
  const chartWidth = Dimensions.get('window').width - 64;
  
  const getTrendResults = () => {
    if (!data || data.length < 2) return [];
    
    return data.slice(0, 10).map(item => {
      const number = item.number;
      const actualResult = number > 4 ? 'BIG' : 'SMALL';
      const predictedResult = prediction.split(' ')[0];
      return actualResult === predictedResult ? 'win' : 'loss';
    });
  };

  const results = getTrendResults();
  const pointSpacing = chartWidth / Math.max(1, results.length - 1);

  const getYPosition = (result: 'win' | 'loss') => {
    return result === 'win' ? CHART_HEIGHT * 0.2 : CHART_HEIGHT * 0.8;
  };

  const renderChartLine = () => {
    return results.map((result, index) => {
      if (index === results.length - 1) return null;

      const startX = index * pointSpacing;
      const startY = getYPosition(result);
      const endX = (index + 1) * pointSpacing;
      const endY = getYPosition(results[index + 1]);

      return (
        <View
          key={`line-${index}`}
          style={[
            styles.line,
            {
              width: Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)),
              left: startX,
              top: startY,
              transform: [{
                rotate: `${Math.atan2(endY - startY, endX - startX)}rad`
              }],
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Prediction Accuracy Trend</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="circle" size={12} color="#4ECDC4" />
            <Text style={styles.legendText}>Correct</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialCommunityIcons name="circle" size={12} color="#FF6B6B" />
            <Text style={styles.legendText}>Incorrect</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LinearGradient
          colors={['rgba(78, 205, 196, 0.1)', 'rgba(255, 107, 107, 0.1)']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {[...Array(5)].map((_, i) => (
          <View
            key={`grid-${i}`}
            style={[
              styles.gridLine,
              {
                top: (CHART_HEIGHT / 4) * i,
              },
            ]}
          />
        ))}

        <View style={styles.chartArea}>
          {renderChartLine()}

          {results.map((result, index) => {
            const x = index * pointSpacing;
            const y = getYPosition(result);

            return (
              <View
                key={`point-${index}`}
                style={[
                  styles.point,
                  {
                    backgroundColor: result === 'win' ? '#4ECDC4' : '#FF6B6B',
                    left: x - POINT_RADIUS,
                    top: y - POINT_RADIUS,
                  },
                ]}
              >
                <View style={styles.pointInner} />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    height: CHART_HEIGHT,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  chartArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#E8E8E8',
  },
  point: {
    position: 'absolute',
    width: POINT_RADIUS * 2,
    height: POINT_RADIUS * 2,
    borderRadius: POINT_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  pointInner: {
    width: POINT_RADIUS,
    height: POINT_RADIUS,
    borderRadius: POINT_RADIUS / 2,
    backgroundColor: 'white',
  },
});