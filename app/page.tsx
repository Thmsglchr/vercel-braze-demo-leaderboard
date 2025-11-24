'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        setLastUpdate(new Date().toLocaleTimeString('en-US'));
        setError(null);
      } else {
        setError(data.message || 'Error loading leaderboard');
      }
    } catch (err) {
      setError('Unable to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchLeaderboard, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-[#FFA524]';
    if (rank === 2) return 'text-white';
    if (rank === 3) return 'text-[#FFA4FB]';
    return 'text-white/60';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#300266] via-[#801ED7] to-[#300266]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Braze Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Image 
                src="/braze-logo.svg" 
                alt="Powered by Braze" 
                width={240}
                height={80}
                className="h-16 w-auto object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
          
          {/* Title */}
          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-10 py-4 inline-block border border-white/20">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Real-time Leaderboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#FFA524] to-transparent rounded-full"></div>
            <p className="text-[#FFA4FB] text-lg font-medium">
              Live Updates via Webhooks
            </p>
            <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#FFA524] to-transparent rounded-full"></div>
          </div>
          
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 text-sm text-white/60 mt-4">
              <div className="w-2 h-2 bg-[#FFA524] rounded-full animate-pulse"></div>
              <p>Live • Last update: {lastUpdate}</p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {loading && leaderboard.length === 0 ? (
            <div className="text-center text-white text-xl">
              <div className="animate-pulse">Loading...</div>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border-2 border-red-500 rounded-full p-6 text-center backdrop-blur-sm">
              <p className="text-red-200 text-lg mb-2">❌ Error</p>
              <p className="text-red-300">{error}</p>
              <button 
                onClick={fetchLeaderboard}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full transition-all text-white font-semibold"
              >
                Retry
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white/5 border-2 border-[#FFA4FB]/30 rounded-full p-8 text-center backdrop-blur-sm">
              <p className="text-[#FFA4FB] text-xl mb-2">
                🎮 No scores yet
              </p>
              <p className="text-white/60 mt-2">
                Leaderboard will automatically populate via Braze webhooks
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`
                    backdrop-blur-sm rounded-full p-5 
                    border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                    ${entry.rank <= 3 
                      ? 'border-[#FFA524] bg-gradient-to-r from-[#FFA524]/20 to-[#FFA4FB]/20 shadow-lg shadow-[#FFA524]/30' 
                      : 'border-white/20 bg-white/5 hover:border-[#801ED7]/50 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    {/* Rank + Name */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`text-3xl font-bold w-14 text-center ${getRankColor(entry.rank)}`}>
                        {getMedalEmoji(entry.rank) || `#${entry.rank}`}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xl font-bold truncate">
                          {entry.username}
                        </p>
                        <p className="text-white/50 text-sm">
                          {new Date(entry.updated_at).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${entry.rank <= 3 ? 'text-[#FFA524]' : 'text-[#FFA4FB]'}`}>
                        {entry.score.toLocaleString('en-US')}
                      </p>
                      <p className="text-white/50 text-sm">
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
                className="px-10 py-3 bg-white hover:bg-white/90 text-[#300266] rounded-full font-bold transition-all hover:scale-105 shadow-lg"
              >
                Refresh Now
              </button>
            </div>
          )}
          
          {/* Powered by Braze footer */}
          <div className="text-center mt-12 pb-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <span className="text-white/60 text-sm">Powered by</span>
              <span className="text-[#FFA524] font-bold text-lg">Braze</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

