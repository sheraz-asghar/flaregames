import React from 'react';
import { Dice1 as Dice, CoinsIcon as CoinIcon, Ticket, Loader2 } from 'lucide-react';
import { GameType } from '../types';

interface GameCardProps {
  type: GameType;
  onPlay: () => void;
  disabled: boolean;
  isLoading?: boolean;
  isConnected?: boolean;
  children?: React.ReactNode;
}

const gameConfig = {
  dice: {
    icon: Dice,
    title: 'Dice Roll',
    description: 'Roll a dice and win if you get 4 or higher!',
  },
  coin: {
    icon: CoinIcon,
    title: 'Coin Flip',
    description: 'Flip a coin and win on heads!',
  },
  lottery: {
    icon: Ticket,
    title: 'Lottery',
    description: 'Pick 6 numbers and match 3 or more to win!',
  },
};

export function GameCard({ type, onPlay, disabled, isLoading, isConnected, children }: GameCardProps) {
  const { icon: Icon, title, description } = gameConfig[type];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      {children}
      <button
        onClick={onPlay}
        disabled={disabled}
        className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } transition-colors`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {type === 'lottery' ? 'Drawing...' : type === 'coin' ? 'Flipping...' : 'Rolling...'}
          </>
        ) : disabled && !isConnected ? (
          'Connect Wallet to Play'
        ) : (
          'Play Now'
        )}
      </button>
    </div>
  );
}