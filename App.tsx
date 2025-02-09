import React, { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { GameCard } from './components/GameCard';
import { Leaderboard } from './components/Leaderboard';
import { GameType, LeaderboardEntry, GameResult } from './types';
import { Dices } from 'lucide-react';
import { useAccount } from 'wagmi';

function App() {
  const { isConnected } = useAccount();
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isPlayingLottery, setIsPlayingLottery] = useState(false);

  // Mock leaderboard data
  const leaderboardEntries: LeaderboardEntry[] = [
    { address: '0x1234567890abcdef', wins: 10, totalPlayed: 15 },
    { address: '0xabcdef1234567890', wins: 8, totalPlayed: 12 },
    { address: '0x9876543210fedcba', wins: 5, totalPlayed: 9 },
  ];

  const handleGamePlay = async (gameType: GameType) => {
    if (gameType === 'dice') {
      setIsRolling(true);
      
      // Simulate dice roll with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const roll = Math.floor(Math.random() * 6) + 1;
      const won = roll >= 4;
      
      const result: GameResult = {
        gameType: 'dice',
        result: roll,
        timestamp: Date.now(),
        won
      };
      
      setGameResults(prev => [result, ...prev]);
      setIsRolling(false);
      
      // Show result
      alert(`You rolled a ${roll}! ${won ? 'You won!' : 'Try again!'}`);
    } else if (gameType === 'coin') {
      setIsFlipping(true);
      
      // Simulate coin flip with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const flip = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = flip === 'heads';
      
      const result: GameResult = {
        gameType: 'coin',
        result: flip,
        timestamp: Date.now(),
        won
      };
      
      setGameResults(prev => [result, ...prev]);
      setIsFlipping(false);
      
      // Show result
      alert(`Coin landed on ${flip}! ${won ? 'You won!' : 'Try again!'}`);
    } else if (gameType === 'lottery') {
      if (selectedNumbers.length !== 6) {
        alert('Please select exactly 6 numbers between 1 and 49');
        return;
      }

      setIsPlayingLottery(true);
      
      // Simulate lottery draw with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate winning numbers
      const winningNumbers = Array.from({ length: 6 }, () => 
        Math.floor(Math.random() * 49) + 1
      ).sort((a, b) => a - b);
      
      // Count matches
      const matches = selectedNumbers.filter(num => 
        winningNumbers.includes(num)
      ).length;
      
      const won = matches >= 3;
      
      const result: GameResult = {
        gameType: 'lottery',
        result: `${matches} matches`,
        timestamp: Date.now(),
        won
      };
      
      setGameResults(prev => [result, ...prev]);
      setIsPlayingLottery(false);
      
      // Show result
      alert(`Winning numbers: ${winningNumbers.join(', ')}\nYour numbers: ${selectedNumbers.join(', ')}\nMatches: ${matches}\n${won ? 'You won!' : 'Try again!'}`);
      
      // Reset selected numbers
      setSelectedNumbers([]);
    }
  };

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers(prev => [...prev, number].sort((a, b) => a - b));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Dices className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Flare Games</h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GameCard
            type="dice"
            onPlay={() => handleGamePlay('dice')}
            disabled={!isConnected || isRolling}
            isLoading={isRolling}
            isConnected={isConnected}
          />
          <GameCard
            type="coin"
            onPlay={() => handleGamePlay('coin')}
            disabled={!isConnected || isFlipping}
            isLoading={isFlipping}
            isConnected={isConnected}
          />
          <GameCard
            type="lottery"
            onPlay={() => handleGamePlay('lottery')}
            disabled={!isConnected || isPlayingLottery || selectedNumbers.length !== 6}
            isLoading={isPlayingLottery}
            isConnected={isConnected}
          >
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Select 6 numbers (1-49):</p>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 49 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumberSelect(num)}
                    className={`p-1 text-xs rounded ${
                      selectedNumbers.includes(num)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    disabled={!isConnected || (selectedNumbers.length >= 6 && !selectedNumbers.includes(num))}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedNumbers.join(', ') || 'None'}
              </p>
            </div>
          </GameCard>
        </div>

        {gameResults.length > 0 && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Games</h2>
            <div className="space-y-3">
              {gameResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    result.won ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <p className="text-gray-800">
                    {result.gameType === 'dice' && (
                      <>Rolled a {result.result} - {result.won ? 'Won!' : 'Lost'}</>
                    )}
                    {result.gameType === 'coin' && (
                      <>Coin landed on {result.result} - {result.won ? 'Won!' : 'Lost'}</>
                    )}
                    {result.gameType === 'lottery' && (
                      <>Lottery: {result.result} - {result.won ? 'Won!' : 'Lost'}</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Leaderboard entries={leaderboardEntries} />
      </main>
    </div>
  );
}

export default App;