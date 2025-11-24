# 🔄 Migration vers Multi-Quiz

Cette migration ajoute le support de plusieurs leaderboards (un par quiz_id).

## 📋 Étapes de migration

### 1. Exécuter les scripts SQL

Dans Neon Console → SQL Editor, exécute dans l'ordre :

#### Script 1 : `db/migrate-add-quiz-id.sql`
```sql
-- Ajoute la colonne quiz_id et les index
```

#### Script 2 : `db/migrate-add-quiz-id-part2.sql`
```sql
-- Modifie la contrainte unique
```

### 2. Tester localement

```bash
npm run dev
```

Teste les URLs :
- `/` → Landing page minimaliste
- `/quiz/test-quiz` → Leaderboard du quiz "test-quiz"
- `/clear` → Page pour effacer un quiz spécifique

### 3. Configurer le webhook Braze

**Nouveau payload** :
```json
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{event_properties.${score}}},
  "quiz_id": "my-quiz-name"
}
```

💡 **Options pour quiz_id** :
- Hardcoder : `"quiz_id": "workshop-nov-2025"`
- Depuis event property : `"quiz_id": "{{event_properties.${quiz_id}}}"`
- Depuis Canvas property : `"quiz_id": "{{canvas_entry_properties.${quiz_id}}}"`

### 4. Structure des URLs

**Format** : `/quiz/[quiz-id]`

**Exemples** :
- `/quiz/workshop-parc-asterix`
- `/quiz/demo-customer-abc`
- `/quiz/black-friday-2025`

### 5. Partager avec collègues

Chaque collègue peut créer son propre quiz en :
1. Choisissant un `quiz_id` unique (ex: "demo-john")
2. Configurant son Canvas avec ce `quiz_id` dans le webhook
3. Partageant l'URL : `[...]/quiz/demo-john`

## ✨ Fonctionnalités

### ✅ Multi-quiz
Chaque quiz_id a son propre leaderboard isolé

### ✅ URLs propres
`/quiz/mon-quiz` au lieu de `/?quiz_id=mon-quiz`

### ✅ Landing publique
`/` affiche juste le logo Braze (pas de liste des quiz)

### ✅ Clear sélectif
`/clear` permet d'effacer UN quiz spécifique

### ✅ Rétrocompatible
Les anciennes entrées sans quiz_id reçoivent `quiz_id = 'default'`

## 🔧 APIs modifiées

- `GET /api/leaderboard?quiz_id=xxx`
- `GET /api/leaderboard-timestamp?quiz_id=xxx`
- `POST /api/update-score` (+ field `quiz_id`)
- `DELETE /api/clear-leaderboard?quiz_id=xxx`

## 📊 Schema DB

```sql
leaderboard (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  score NUMERIC(10, 2) NOT NULL,
  quiz_id VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  UNIQUE (user_id, quiz_id)  -- ← Nouveau !
)
```

