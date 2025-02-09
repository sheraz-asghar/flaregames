export type GameType = 'dice' | 'coin' | 'lottery';

export interface GameResult {
  gameType: GameType;
  result: number | string;
  timestamp: number;
  won?: boolean;
  transactionHash?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
}

export interface LeaderboardEntry {
  address: string;
  wins: number;
  totalPlayed: number;
}