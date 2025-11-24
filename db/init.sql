-- Script d'initialisation de la base de données
-- À exécuter dans Vercel Postgres Storage

-- Créer la table leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  score NUMERIC(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_updated_at ON leaderboard(updated_at DESC);

-- Commentaires sur les colonnes
COMMENT ON TABLE leaderboard IS 'Table pour stocker les scores des utilisateurs pour le leaderboard';
COMMENT ON COLUMN leaderboard.user_id IS 'ID unique de l''utilisateur (external_id de Braze)';
COMMENT ON COLUMN leaderboard.username IS 'Nom d''affichage de l''utilisateur';
COMMENT ON COLUMN leaderboard.score IS 'Score de l''utilisateur';
COMMENT ON COLUMN leaderboard.updated_at IS 'Date de dernière mise à jour du score';
COMMENT ON COLUMN leaderboard.created_at IS 'Date de première insertion';

-- Test data (optional - remove in production)
INSERT INTO leaderboard (user_id, username, score) VALUES
  ('demo_user_1', 'Alex Thompson', 9500),
  ('demo_user_2', 'Jordan Smith', 8750),
  ('demo_user_3', 'Taylor Martinez', 7890),
  ('demo_user_4', 'Morgan Lee', 6543),
  ('demo_user_5', 'Casey Brown', 5432)
ON CONFLICT (user_id) DO NOTHING;

