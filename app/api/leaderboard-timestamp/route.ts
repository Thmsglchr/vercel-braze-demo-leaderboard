import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * API Route ultra-light pour vérifier s'il y a des mises à jour
 * Retourne seulement le timestamp de la dernière mise à jour
 * 
 * Endpoint: GET /api/leaderboard-timestamp
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quiz_id') || 'default';
    
    // Récupérer seulement le timestamp le plus récent (très rapide)
    const result = await sql`
      SELECT MAX(updated_at) as last_update
      FROM leaderboard
      WHERE quiz_id = ${quizId}
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      last_update: result.rows[0]?.last_update || null
    });

  } catch (error) {
    console.error('Error fetching timestamp:', error);
    return NextResponse.json(
      { 
        success: false,
        last_update: null
      },
      { status: 500 }
    );
  }
}

