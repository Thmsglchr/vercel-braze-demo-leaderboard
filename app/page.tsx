'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
  updated_at: string;
}

export default function Home() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leaderboard?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
        setLastUpdate(new Date().toLocaleTimeString('fr-FR'));
        setError(null);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger le leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(fetchLeaderboard, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🔥 Braze Demo
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-200 mb-2">
            Real-time Leaderboard
          </h2>
          <p className="text-gray-300">
            Powered by Braze Webhooks
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-400 mt-2">
              Last update: {lastUpdate}
            </p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {loading && leaderboard.length === 0 ? (
            <div className="text-center text-white text-xl">
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-center">
              <p className="text-red-200 text-lg mb-2">❌ Error</p>
              <p className="text-red-300">{error}</p>
              <button 
                onClick={fetchLeaderboard}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Retry
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-8 text-center">
              <p className="text-blue-200 text-xl">
                🎮 No scores yet
              </p>
              <p className="text-gray-400 mt-2">
                Leaderboard will automatically populate via Braze webhooks
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`
                    bg-white/10 backdrop-blur-sm rounded-xl p-4 
                    border-2 transition-all duration-300 hover:scale-[1.02]
                    ${entry.rank <= 3 
                      ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                      : 'border-blue-400/30 hover:border-blue-400/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank + Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`text-3xl font-bold w-12 text-center ${getRankColor(entry.rank)}`}>
                        {getMedalEmoji(entry.rank) || `#${entry.rank}`}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xl font-semibold truncate">
                          {entry.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(entry.updated_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${entry.rank <= 3 ? 'text-yellow-300' : 'text-blue-300'}`}>
                        {entry.score.toLocaleString('fr-FR')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        points
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Refresh Button */}
          {!loading && !error && (
            <div className="text-center mt-8">
              <button
                onClick={fetchLeaderboard}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
              >
                🔄 Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

