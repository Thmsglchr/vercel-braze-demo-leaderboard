# 🎢 Parc Astérix - Leaderboard Braze

Application Next.js qui reçoit les scores via webhooks Braze et affiche un leaderboard en temps réel.

## 🏗️ Architecture

```
Braze (Score Update) 
    ↓ Webhook
Vercel API Route (/api/update-score)
    ↓
Vercel Postgres Database
    ↓
API Route (/api/leaderboard)
    ↓
Frontend Leaderboard (React)
```

## 📋 Prérequis

- Node.js 18+
- Compte Vercel
- Compte Braze avec accès API
- Vercel Postgres (ou autre base PostgreSQL)

## 🚀 Installation

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de la base de données

#### Sur Vercel (recommandé)

1. Va sur ton projet Vercel
2. Storage → Create Database → Postgres
3. Une fois créée, les variables d'environnement sont automatiquement ajoutées

#### En local

Crée un fichier `.env.local` :

```env
# Vercel Postgres (copié depuis Vercel Dashboard)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# Optionnel : Secret pour sécuriser le webhook
BRAZE_WEBHOOK_SECRET=your-secret-key-here
```

### 3. Initialiser la base de données

Dans Vercel Postgres Storage → Query :

```sql
-- Copier-coller le contenu de db/init.sql
```

Ou en local avec psql :

```bash
psql $POSTGRES_URL -f db/init.sql
```

### 4. Lancer l'application

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🔧 Configuration Braze

### 1. Créer un Webhook Campaign/Canvas

Dans Braze Dashboard :

1. **Campaigns** → **Create Campaign** → **Webhook**
2. **Webhook URL** : `https://ton-app.vercel.app/api/update-score`
3. **Request Method** : `POST`
4. **Request Headers** :
   - `Content-Type: application/json`
   - (Optionnel) `Authorization: Bearer your-secret-key-here`

### 2. Configurer le Payload

Dans le **Request Body**, configure ce JSON :

```json
{
  "user_id": "{{${user_id}}}",
  "external_id": "{{${external_id}}}",
  "username": "{{custom_attribute.${nom_utilisateur}}}",
  "score": {{custom_attribute.${score}}}
}
```

**⚠️ Important** : Remplace `nom_utilisateur` et `score` par les noms exacts de tes custom attributes dans Braze.

### 3. Définir le Trigger

Configure quand le webhook doit se déclencher :

**Option A - Action-Based (Temps réel)** :
- Trigger : Custom Event `score_updated`
- Ou : Attribute Change sur `score`

**Option B - Scheduled (Batch)** :
- Scheduled Delivery
- Segment : "Users with scores"
- Fréquence : Toutes les heures/jours

### 4. Tester le Webhook

1. Dans Braze, utilise **Test** pour envoyer un webhook de test
2. Vérifie les logs Vercel
3. Check le leaderboard sur ton site

## 📡 API Endpoints

### POST `/api/update-score`

Reçoit les scores depuis Braze.

**Request Body** :
```json
{
  "user_id": "abc123",
  "external_id": "user_123",
  "username": "Astérix",
  "score": 8750
}
```

**Response** :
```json
{
  "success": true,
  "message": "Score updated successfully",
  "data": {
    "user_id": "user_123",
    "username": "Astérix",
    "score": 8750
  }
}
```

### GET `/api/leaderboard`

Récupère le leaderboard.

**Query Params** :
- `limit` (optional) : Nombre de résultats (défaut: 100)

**Response** :
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "user_id": "user_123",
      "username": "Astérix",
      "score": 8750,
      "rank": 1,
      "updated_at": "2025-11-24T10:30:00Z"
    }
  ],
  "timestamp": "2025-11-24T10:35:00Z"
}
```

## 🎨 Frontend

Le leaderboard est accessible sur la page d'accueil (`/`).

**Features** :
- 🏆 Top 3 mis en avant avec médailles
- 🔄 Auto-refresh toutes les 30 secondes
- 📱 Design responsive
- 🎨 UI moderne avec Tailwind CSS

## 🔐 Sécurité

### Webhook Secret (Recommandé)

Pour sécuriser ton endpoint webhook :

1. Génère un secret aléatoire :
```bash
openssl rand -hex 32
```

2. Ajoute-le dans Vercel :
```env
BRAZE_WEBHOOK_SECRET=ton-secret-genere
```

3. Dans Braze, ajoute le header :
```
Authorization: Bearer ton-secret-genere
```

## 🚀 Déploiement sur Vercel

### Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Via GitHub

1. Push ton code sur GitHub
2. Connecte le repo à Vercel
3. Vercel déploie automatiquement à chaque push

### Configuration Post-Déploiement

1. Crée la database Postgres dans Vercel Storage
2. Exécute le script `db/init.sql` dans l'onglet Query
3. Configure l'URL du webhook dans Braze avec ton domaine Vercel

## 📊 Monitoring

### Logs Vercel

Les logs sont disponibles dans :
- Vercel Dashboard → Ton Projet → Logs

### Debug

Pour tester l'endpoint webhook localement :

```bash
curl -X POST http://localhost:3000/api/update-score \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_123",
    "username": "Test User",
    "score": 9999
  }'
```

## 🛠️ Technologies Utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel Postgres** - Base de données
- **Braze** - Webhooks & User data

## 📝 Custom Attributes Requis dans Braze

Configure ces custom attributes dans Braze :

| Attribute | Type | Description |
|-----------|------|-------------|
| `nom_utilisateur` | String | Nom d'affichage de l'utilisateur |
| `score` | Number | Score de l'utilisateur |

## 🐛 Troubleshooting

### "Database not initialized"

→ Exécute le script `db/init.sql` dans Vercel Postgres

### "Unauthorized" sur le webhook

→ Vérifie que le `BRAZE_WEBHOOK_SECRET` est identique dans Vercel et Braze

### Le leaderboard ne se met pas à jour

→ Vérifie les logs Vercel pour voir si les webhooks arrivent
→ Teste l'endpoint avec curl

### Erreur "Missing required fields"

→ Vérifie que les noms des custom attributes dans Braze correspondent au payload

## 📞 Support

Pour toute question, vérifie :
- Les logs Vercel
- Les webhooks logs dans Braze Dashboard
- La console browser pour les erreurs frontend

---

Made with 💜 for Parc Astérix

