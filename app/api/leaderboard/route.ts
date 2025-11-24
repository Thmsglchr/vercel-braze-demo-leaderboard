import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Désactive le cache

/**
 * API Route pour récupérer le leaderboard
 * 
 * Endpoint: GET /api/leaderboard
 * 
 * Query params (optionnels):
 * - limit: nombre de résultats (défaut: 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const quizId = searchParams.get('quiz_id') || 'default';

    // Récupérer le top scores, triés par score décroissant
    // En cas d'égalité, celui qui a atteint le score en premier est mieux classé
    const result = await sql`
      SELECT 
        user_id,
        username,
        score,
        updated_at,
        ROW_NUMBER() OVER (ORDER BY score DESC, updated_at ASC) as rank
      FROM leaderboard
      WHERE quiz_id = ${quizId}
      ORDER BY score DESC, updated_at ASC
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    // Si la table n'existe pas, retourner un message explicite
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database not initialized',
          message: 'Please run the SQL initialization script. See README.md'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

