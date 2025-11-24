'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearPage() {
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [quizId, setQuizId] = useState('');
  const router = useRouter();

  const clearDatabase = async () => {
    if (!quizId.trim()) {
      setResult('❌ Please enter a Quiz ID');
      return;
    }

    if (!confirm(`⚠️ Are you sure you want to DELETE ALL leaderboard data for quiz "${quizId}"? This cannot be undone!`)) {
      return;
    }

    setClearing(true);
    setResult(null);

    try {
      const response = await fetch(`/api/clear-leaderboard?quiz_id=${encodeURIComponent(quizId)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Success! Deleted ${data.deleted_count} entries from quiz "${quizId}".`);
        setTimeout(() => {
          router.push(`/quiz/${quizId}`);
        }, 2000);
      } else {
        setResult(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#300266] via-[#801ED7] to-[#300266] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-[#300266] mb-4">
          🗑️ Clear Leaderboard
        </h1>
        
        <p className="text-[#801ED7] mb-6">
          This will permanently delete all entries from the specified quiz leaderboard.
        </p>

        {/* Input Quiz ID */}
        <div className="mb-6">
          <label htmlFor="quiz-id" className="block text-left text-sm font-medium text-[#300266] mb-2">
            Quiz ID
          </label>
          <input
            id="quiz-id"
            type="text"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            placeholder="e.g., my-quiz-123"
            className="w-full px-4 py-3 border-2 border-[#801ED7]/30 rounded-full focus:border-[#801ED7] focus:outline-none text-[#300266] font-mono"
            disabled={clearing}
          />
          <p className="text-xs text-gray-500 mt-2 text-left">
            Enter the Quiz ID you want to clear
          </p>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-2xl ${
            result.includes('Success') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {result}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={clearDatabase}
            disabled={clearing || !quizId.trim()}
            className="w-full px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-full font-bold transition-all hover:scale-105 disabled:cursor-not-allowed"
          >
            {clearing ? 'Clearing...' : 'Clear Quiz Leaderboard'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full px-8 py-3 bg-[#801ED7] hover:bg-[#300266] text-white rounded-full font-bold transition-all hover:scale-105"
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          For demo purposes only. Use with caution!
        </p>
      </div>
    </div>
  );
}
