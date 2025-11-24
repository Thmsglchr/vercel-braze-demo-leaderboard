import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * API Route qui reçoit les webhooks de Braze
 * 
 * Endpoint: POST /api/update-score
 * 
 * Payload attendu depuis Braze:
 * {
 *   "user_id": "{{${user_id}}}",
 *   "external_id": "{{${external_id}}}",
 *   "username": "{{${nom_utilisateur}}}",
 *   "score": {{${score}}}
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Optionnel : Vérifier un secret pour sécuriser le webhook
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.BRAZE_WEBHOOK_SECRET;
    
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { user_id, external_id, username, score, quiz_id } = body;

    // Validation des données
    if (!username || score === undefined || score === null) {
      return NextResponse.json(
        { error: 'Missing required fields: username and score are required' },
        { status: 400 }
      );
    }

    // Utiliser external_id si disponible, sinon user_id
    const userId = external_id || user_id;
    
    // quiz_id par défaut si non fourni
    const quizIdentifier = quiz_id || 'default';

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user identifier: user_id or external_id required' },
        { status: 400 }
      );
    }

    // Convertir le score en nombre
    const scoreValue = typeof score === 'string' ? parseFloat(score) : score;

    if (isNaN(scoreValue)) {
      return NextResponse.json(
        { error: 'Invalid score value' },
        { status: 400 }
      );
    }

    // Insérer ou mettre à jour le score dans la DB
    // ON CONFLICT sur (user_id, quiz_id) pour permettre le même user dans plusieurs quiz
    await sql`
      INSERT INTO leaderboard (user_id, username, score, quiz_id, updated_at)
      VALUES (${userId}, ${username}, ${scoreValue}, ${quizIdentifier}, NOW())
      ON CONFLICT (user_id, quiz_id)
      DO UPDATE SET 
        username = EXCLUDED.username,
        score = EXCLUDED.score,
        updated_at = NOW()
    `;

    console.log(`✅ Score updated for user ${username}: ${scoreValue} (quiz: ${quizIdentifier})`);

    return NextResponse.json({
      success: true,
      message: 'Score updated successfully',
      data: {
        user_id: userId,
        username,
        score: scoreValue,
        quiz_id: quizIdentifier
      }
    });

  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optionnel : Endpoint GET pour tester que l'API fonctionne
export async function GET() {
  return NextResponse.json({
    message: 'Braze Webhook Receiver is running',
    endpoint: 'POST /api/update-score',
    expectedPayload: {
      user_id: 'string',
      external_id: 'string (optional)',
      username: 'string',
      score: 'number'
    }
  });
}

