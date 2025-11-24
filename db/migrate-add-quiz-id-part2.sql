-- Migration partie 2 : Modifier la contrainte UNIQUE
-- À exécuter APRÈS migrate-add-quiz-id.sql

-- Supprimer l'ancienne contrainte unique sur user_id
ALTER TABLE leaderboard 
DROP CONSTRAINT IF EXISTS leaderboard_user_id_key;

-- Créer une nouvelle contrainte unique sur (user_id, quiz_id)
-- Permet au même user d'être dans plusieurs quiz différents
ALTER TABLE leaderboard 
ADD CONSTRAINT leaderboard_user_quiz_unique UNIQUE (user_id, quiz_id);

