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
export async function DELETE() {
  try {
    // Compter les entrées avant suppression
    const countResult = await sql`
      SELECT COUNT(*) as count FROM leaderboard
    `;
    
    const countBefore = parseInt(countResult.rows[0]?.count || '0');

    // Supprimer toutes les entrées
    await sql`
      DELETE FROM leaderboard
    `;

    console.log(`🗑️ Cleared leaderboard: ${countBefore} entries deleted`);

    return NextResponse.json({
      success: true,
      message: 'Leaderboard cleared successfully',
      deleted_count: countBefore
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

