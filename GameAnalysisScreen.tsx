import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameHeader from '../components/GameHeader';
import AnalysisPrediction from '../components/AnalysisPrediction';
import AnalysisHistory from '../components/AnalysisHistory';
import AnalysisStats from '../components/AnalysisStats';
import { GameData, GameStats } from '../types/gameTypes';

export default function GameAnalysisScreen() {
  const [gameData, setGameData] = useState<GameData[]>([]);
  const [trendHistory, setTrendHistory] = useState<Array<{
    period: string;
    prediction: string;
    actualResult: string;
    result: 'Win' | 'Loss';
  }>>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    winPercentage: 0,
    currentStreak: 0,
    recentResults: [],
  });
  const [lastPeriod, setLastPeriod] = useState<string | null>(null);

  const categorizeNumber = (number: number): "Small" | "Big" => 
    (number >= 0 && number <= 4) ? "Small" : "Big";

  const improvedPredictionAlgorithm = (data: GameData[]): string => {
    if (data.length < 5) return "No Data";

    const recentData = data.slice(0, 5);
    const bigCount = recentData.filter(item => item.number > 4).length;
    const smallCount = recentData.filter(item => item.number <= 4).length;

    if (bigCount >= 3) return "Big";
    else if (smallCount >= 3) return "Small";
    return Math.random() > 0.5 ? "Big" : "Small";
  };

  const updateGameStats = (prediction: string, actualResult: string) => {
    const isWin = prediction === actualResult;
    
    setGameStats(prev => ({
      totalGames: prev.totalGames + 1,
      totalWins: prev.totalWins + (isWin ? 1 : 0),
      totalLosses: prev.totalLosses + (isWin ? 0 : 1),
      winPercentage: Number((((prev.totalWins + (isWin ? 1 : 0)) / (prev.totalGames + 1)) * 100).toFixed(2)),
      currentStreak: isWin ? prev.currentStreak + 1 : 0,
      recentResults: [...prev.recentResults, isWin ? 'win' : 'loss'].slice(-10),
    }));

    setTrendHistory(prev => [{
      period: gameData[0].issue,
      prediction,
      actualResult,
      result: isWin ? 'Win' : 'Loss'
    }, ...prev].slice(0, 50));
  };

  const fetchGameData = async () => {
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
        const newGameData = data.data.list.map((item: any) => ({
          issue: item.issueNumber,
          number: Number(item.number)
        }));
        
        setGameData(newGameData);

        if (newGameData.length > 0 && lastPeriod !== newGameData[0].issue) {
          setLastPeriod(newGameData[0].issue);
          const prediction = improvedPredictionAlgorithm(newGameData);
          const actualResult = categorizeNumber(newGameData[0].number);
          updateGameStats(prediction, actualResult);
        }
      }
    } catch (error) {
      console.log('Error fetching game data:', error);
    }
  };

  useEffect(() => {
    fetchGameData();
    const interval = setInterval(fetchGameData, 1000);
    return () => clearInterval(interval);
  }, [lastPeriod]);

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader onMenuPress={() => {}} />
      <ScrollView style={styles.content}>
        <AnalysisPrediction
          gameData={gameData}
          prediction={improvedPredictionAlgorithm(gameData)}
          lastPeriod={lastPeriod}
        />
        <AnalysisStats gameStats={gameStats} />
        <AnalysisHistory history={trendHistory} />
      </ScrollView>
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