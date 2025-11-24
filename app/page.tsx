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
  const [lastDbUpdate, setLastDbUpdate] = useState<string | null>(null);

  const fetchLeaderboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
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

  // Fonction ultra-légère qui check juste le timestamp
  const checkForUpdates = async () => {
    try {
      const response = await fetch('/api/leaderboard-timestamp');
      const data = await response.json();
      
      if (data.success && data.last_update) {
        // Si c'est la première fois ou si le timestamp a changé
        if (!lastDbUpdate || lastDbUpdate !== data.last_update) {
          setLastDbUpdate(data.last_update);
          // Fetch silencieux (sans loading spinner)
          await fetchLeaderboard(true);
        }
      }
    } catch (err) {
      console.error('Error checking updates:', err);
    }
  };

  useEffect(() => {
    // Premier chargement
    fetchLeaderboard();
    
    // Polling intelligent : vérifie le timestamp toutes les 2 secondes
    // Ne recharge les données QUE si le timestamp a changé (= nouveau webhook reçu)
    const interval = setInterval(checkForUpdates, 2000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'text-[#FFA524]';
    return 'text-[#801ED7]';
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
                src="/braze-logo.png" 
                alt="Powered by Braze" 
                width={375}
                height={125}
                className="h-25 w-auto object-contain drop-shadow-lg"
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
            <p className="text-[#FFA4FB] text-lg font-medium">
              Live Updates via Webhooks
            </p>
          </div>
          
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 text-sm text-white/60 mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
                onClick={() => fetchLeaderboard()}
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
                    rounded-full p-5 
                    transition-all duration-300 hover:scale-[1.02]
                    ${entry.rank <= 3 
                      ? 'bg-white' 
                      : 'bg-[#C9C4FF]'
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
                        <p className="text-[#300266] text-xl font-bold truncate">
                          {entry.username}
                        </p>
                        <p className="text-[#801ED7]/60 text-sm">
                          {new Date(entry.updated_at).toLocaleDateString('en-US')}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${entry.rank <= 3 ? 'text-[#FFA524]' : 'text-[#801ED7]'}`}>
                        {entry.score.toLocaleString('en-US')}
                      </p>
                      <p className="text-[#801ED7]/60 text-sm">
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
                onClick={() => fetchLeaderboard()}
                className="px-10 py-3 bg-white hover:bg-white/90 text-[#300266] rounded-full font-bold transition-all hover:scale-105"
              >
                Refresh Now
              </button>
            </div>
          )}
          
          {/* Powered by Braze footer */}
          <div className="text-center mt-12 pb-8">
            <Image 
              src="/powered-by-braze-logo.png" 
              alt="Powered by Braze" 
              width={200}
              height={60}
              className="h-[60px] w-auto object-contain mx-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

