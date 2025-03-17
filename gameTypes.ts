export interface GameData {
  issue: string;
  number: number;
}

export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
  currentStreak: number;
  recentResults: ('win' | 'loss')[];
}