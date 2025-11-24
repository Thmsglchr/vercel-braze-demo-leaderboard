import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API Route pour vider complètement le leaderboard
 * 
 * Endpoint: DELETE /api/clear-leaderboard
 * 
 * ⚠️ ATTENTION : Cette route supprime TOUTES les entrées !
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quiz_id') || 'default';
    
    // Compter les entrées avant suppression
    const countResult = await sql`
      SELECT COUNT(*) as count FROM leaderboard
      WHERE quiz_id = ${quizId}
    `;
    
    const countBefore = parseInt(countResult.rows[0]?.count || '0');

    // Supprimer toutes les entrées de ce quiz
    await sql`
      DELETE FROM leaderboard
      WHERE quiz_id = ${quizId}
    `;

    console.log(`🗑️ Cleared leaderboard for quiz "${quizId}": ${countBefore} entries deleted`);

    return NextResponse.json({
      success: true,
      message: `Leaderboard for quiz "${quizId}" cleared successfully`,
      deleted_count: countBefore,
      quiz_id: quizId
    });

  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        deleted_count: 0
      },
      { status: 500 }
    );
  }
}

// Optionnel : endpoint GET pour info
export async function GET() {
  return NextResponse.json({
    message: 'Use DELETE method to clear the leaderboard',
    warning: 'This will delete ALL entries permanently!'
  });
}

