import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GameStats } from '../types/gameTypes';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gameStats: GameStats;
}

export default function MenuDrawer({ isOpen, onClose, gameStats }: MenuDrawerProps) {
  const slideAnim = React.useRef(new Animated.Value(-300)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatItem
            label="Total Games"
            value={gameStats.totalGames.toString()}
            icon="gamepad-variant"
          />
          <StatItem
            label="Wins"
            value={gameStats.totalWins.toString()}
            icon="trophy"
            color="#4ECDC4"
          />
          <StatItem
            label="Losses"
            value={gameStats.totalLosses.toString()}
            icon="close-circle"
            color="#FF6B6B"
          />          <StatItem
            label="Win Rate"
            value={`${gameStats.winPercentage}%`}
            icon="percent"
            color={gameStats.winPercentage >= 50 ? '#4ECDC4' : '#FF6B6B'}
          />
          <StatItem
            label="Current Streak"
            value={gameStats.currentStreak.toString()}
            icon="fire"
            color="#FFA726"
          />
        </View>
      </Animated.View>
    </View>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
}

function StatItem({ label, value, icon, color = "#333" }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <View style={styles.statText}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});