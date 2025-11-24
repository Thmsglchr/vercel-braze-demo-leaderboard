-- Migration pour ajouter le support multi-quiz
-- À exécuter dans Neon SQL Editor

-- Ajouter la colonne quiz_id
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS quiz_id VARCHAR(255);

-- Créer un index pour les performances
CREATE INDEX IF NOT EXISTS idx_leaderboard_quiz_id ON leaderboard(quiz_id);

-- Créer un index composite pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_leaderboard_quiz_score ON leaderboard(quiz_id, score DESC, updated_at ASC);

-- Mettre à jour les anciennes entrées (optionnel - leur donner un quiz_id par défaut)
UPDATE leaderboard 
SET quiz_id = 'default' 
WHERE quiz_id IS NULL;

-- Commentaires
COMMENT ON COLUMN leaderboard.quiz_id IS 'Identifiant du quiz (permet des leaderboards séparés)';

