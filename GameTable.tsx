import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GameTableProps {
  data: Array<{
    issue: string;
    number: number;
  }>;
}

export default function GameTable({ data }: GameTableProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>Recent Results</Text>
      </LinearGradient>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {data.map((item, index) => (
            <View key={item.issue} style={styles.resultItem}>
              <Text style={styles.periodText}>{item.issue.slice(-4)}</Text>
              <View style={[
                styles.numberCircle,
                { backgroundColor: item.number > 4 ? '#FF6B6B' : '#4ECDC4' }
              ]}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>
              <View style={styles.typeContainer}>
                <MaterialCommunityIcons 
                  name={item.number > 4 ? 'arrow-up-bold' : 'arrow-down-bold'} 
                  size={16} 
                  color={item.number > 4 ? '#FF6B6B' : '#4ECDC4'} 
                />
                <Text style={[
                  styles.typeText,
                  { color: item.number > 4 ? '#FF6B6B' : '#4ECDC4' }
                ]}>
                  {item.number > 4 ? 'BIG' : 'SMALL'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerGradient: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tableContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  resultItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 70,
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  numberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});