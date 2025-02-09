import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
      </div>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={entry.address}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-600">#{index + 1}</span>
              <span className="text-gray-900">
                {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-medium">{entry.wins} wins</span>
              <span className="text-gray-500 text-sm">
                {entry.totalPlayed} games played
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}