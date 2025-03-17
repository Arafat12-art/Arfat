import React, { useState, useEffect, useCallback } from 'react';
import TrendChart from '../components/TrendChart';
import { Audio } from 'expo-av';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameHeader from '../components/GameHeader';
import PredictionCard from '../components/PredictionCard';
import GameTable from '../components/GameTable';
import MenuDrawer from '../components/MenuDrawer';
import { GameData, GameStats } from '../types/gameTypes';

export default function HomeScreen() {  const [gameData, setGameData] = useState<GameData[]>([]);
  const [sound, setSound] = useState<Audio.Sound>();
  const [prediction, setPrediction] = useState<string>('');
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [previousResult, setPreviousResult] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    winPercentage: 0,
    currentStreak: 0,
    recentResults: [] as ('win' | 'loss')[],
  });

  const [borderAnim] = useState(new Animated.Value(0));

  const playSound = async (type: 'win' | 'loss') => {
    try {
      const soundFile = type === 'win' 
        ? 'https://api.a0.dev/assets/sound/win.mp3'
        : 'https://api.a0.dev/assets/sound/loss.mp3';
      const { sound } = await Audio.Sound.createAsync({ uri: soundFile });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const animateBorder = (isWin: boolean) => {
    Animated.sequence([
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };  const playPredictionSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://api.a0.dev/assets/sound/prediction.mp3' }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const fetchGameData = useCallback(async () => {
    try {
      const response = await fetch('https://api.bdg88zf.com/api/webapi/GetNoaverageEmerdList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageSize: 10,
          pageNo: 1,
          typeId: 1,
          language: 0,
          random: "ded40537a2ce416e96c00e5218f6859a",
          signature: "69306982EEEB19FA940D72EC93C62552",
          timestamp: Math.floor(Date.now() / 1000)
        })
      });
      
      const data = await response.json();
      if (data?.data?.list) {
        setGameData(data.data.list.map((item: any) => ({
          issue: item.issueNumber,
          number: Number(item.number)
        })));
      }
    } catch (error) {
      console.log('Error fetching game data:', error);
    }
  }, []);

  const updateGamePeriod = async () => {
    const now = new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    const formattedDate = now.getUTCFullYear().toString() +
      ("0" + (now.getUTCMonth() + 1)).slice(-2) +
      ("0" + now.getUTCDate()).slice(-2);
    
    const periodNumber = "1000" + (10001 + totalMinutes);
    setCurrentPeriod(formattedDate + periodNumber);
    generatePrediction(periodNumber);
  };  const generatePrediction = (periodNumber: string) => {
    const num = parseInt(periodNumber.slice(-4));
    const factor = 7937;
    const offset = 4421;
    
    const isBig = (((num * factor + offset) % 2) === 0) ? "BIG" : "SMALL";
    const num1 = (((num * (factor + 717) + offset) % 10) + 10) % 10;
    const num2 = (((num * (factor + 983) + offset) % 10) + 10) % 10;    
    const predictionText = `${isBig} ${num1} ${num2}`;
    
    if (prediction !== predictionText) {
      setPrediction(predictionText);
      playPredictionSound().catch(console.error);
    }

    // Check prediction accuracy and update stats
    if (prediction && prediction !== predictionText) {
      setPreviousResult(prediction);      // Get the most recent game result
      const currentNumber = gameData[0]?.number;
      if (currentNumber !== undefined) {
        // Extract the prediction type (BIG/SMALL) from the current prediction
        const [predictedType] = prediction.split(' ');
        // Determine actual result
        const actualType = currentNumber > 4 ? 'BIG' : 'SMALL';
        // Check if prediction was correct
        const wasCorrect = predictedType === actualType;
        
        // Play appropriate sound effect
        playSound(wasCorrect ? 'win' : 'loss');
        animateBorder(wasCorrect);
        
        // Update game statistics
        setGameStats(prev => {
          const newRecentResults = [...prev.recentResults.slice(-9), wasCorrect ? 'win' : 'loss'];
          const newTotalGames = prev.totalGames + 1;
          const newTotalWins = prev.totalWins + (wasCorrect ? 1 : 0);
          const newTotalLosses = prev.totalLosses + (wasCorrect ? 0 : 1);
          const newWinPercentage = Number((newTotalWins / newTotalGames * 100).toFixed(2));
          
          return {
            totalGames: newTotalGames,
            totalWins: newTotalWins,
            totalLosses: newTotalLosses,
            winPercentage: newWinPercentage,
            currentStreak: wasCorrect ? prev.currentStreak + 1 : 0,
            recentResults: newRecentResults,
          };
        });

        // Log prediction results for debugging
        console.log(`Prediction: ${predictedType}, Actual: ${actualType}, Result: ${wasCorrect ? 'WIN' : 'LOSS'}`);
        console.log(`Number: ${currentNumber}, Issue: ${gameData[0]?.issue}`);
      }
    }
  };

  const categorizeNumber = (number: number): string => 
    (number >= 0 && number <= 4) ? "Small" : "Big";  useEffect(() => {
    updateGamePeriod();
    fetchGameData();
    const gameInterval = setInterval(updateGamePeriod, 1000);
    const dataInterval = setInterval(fetchGameData, 5000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(dataInterval);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [fetchGameData]);

  return (    <SafeAreaView style={[styles.container, {
      borderWidth: 2,
      borderColor: borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', gameStats.recentResults[gameStats.recentResults.length - 1] === 'win' ? '#4ECDC4' : '#FF6B6B'],
      }),
    }]}>
      <GameHeader onMenuPress={() => setIsDrawerOpen(true)} />      <ScrollView style={styles.content}>
        <PredictionCard
          prediction={prediction}
          currentPeriod={currentPeriod}
          previousResult={previousResult}
        />        <GameTable data={gameData} />        <TrendChart 
          data={gameData} 
          prediction={prediction}
          onNumberPredict={(numbers) => {
            const [num1, num2] = numbers.split('-');
            setPrediction(prev => {
              const [type] = prev.split(' ');
              return `${type} ${num1} ${num2}`;
            });
          }}
        />
      </ScrollView>
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        gameStats={gameStats}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});