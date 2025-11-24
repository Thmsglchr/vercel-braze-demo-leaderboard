# 🎯 How to Use the Braze Real-time Leaderboard

**For Braze Solutions Consultants**

This guide will help you set up and use the real-time leaderboard for customer demos and workshops.

---

## 🚀 Quick Start (5 minutes)

### What You'll Need
- Your unique quiz ID (e.g., `demo-john-dec-2024`)
- A Braze Canvas with webhook capability
- Custom event or landing page that sends `score` data

### Your Leaderboard URL
```
https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/quiz/YOUR-QUIZ-ID
```

**Example**: 
```
https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/quiz/demo-john-dec-2024
```

---

## 📋 Step-by-Step Setup

### Step 1: Choose Your Quiz ID

Pick a **unique identifier** for your leaderboard. Use lowercase letters, numbers, and hyphens only.

**Good examples**:
- `workshop-customer-abc`
- `demo-john-q4-2024`
- `black-friday-quiz`

**Avoid**:
- Spaces or special characters
- Names already used by other SolCons

---

### Step 2: Create Your Braze Canvas

1. **Create a new Canvas** in Braze
2. **Entry Trigger**: Choose one of:
   - Custom Event (e.g., "Quiz Completed")
   - API-triggered entry
   - Landing page submission

3. **Add a Webhook Step** with these settings:

#### Webhook Configuration

**URL**:
```
https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/api/update-score
```

**HTTP Method**:
```
POST
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{event_properties.${score}}},
  "quiz_id": "YOUR-QUIZ-ID"
}
```

⚠️ **Important**: Replace `YOUR-QUIZ-ID` with your actual quiz ID!

---

### Step 3: Configure Your Event/Landing Page

Make sure your event or landing page sends a `score` property:

**For Custom Events**:
```javascript
braze.logCustomEvent("Quiz Completed", {
  score: 850
});
```

**For Landing Pages**:
Ensure your form includes a score field that gets passed to Braze as an event property.

---

### Step 4: Test Your Setup

#### Option A: Test with API Trigger (Postman)

If using API-triggered Canvas:

**Endpoint**:
```
POST https://rest.fra-02.braze.eu/canvas/trigger/send
```

**Headers**:
```
Content-Type: application/json
Authorization: Bearer 732000a8-9673-4f3d-85b7-607cd5e84fca
```

**Body**:
```json
{
  "canvas_id": "YOUR-CANVAS-ID",
  "recipients": [
    {
      "external_user_id": "test-user-123",
      "attributes": {
        "first_name": "John",
        "last_name": "Demo",
        "score": 9500
      }
    }
  ]
}
```

#### Option B: Test with Custom Event

Trigger your custom event from SDK or test in Braze with a test user.

#### Verify It Works

1. Visit your leaderboard: `https://.../quiz/YOUR-QUIZ-ID`
2. You should see your test entry appear within 2 seconds! ⚡

---

## 🎨 Leaderboard Features

### Real-time Updates
- Updates every **2 seconds** (polling)
- Only refreshes when new data is received (no flickering)
- Smooth transitions

### Visual Design
- **Top 3**: White background with orange scores 🥇🥈🥉
- **Rank 4+**: Lavender background with purple scores
- **Mobile responsive**: Works on all devices

### Tiebreaker Logic
If two users have the same score, the one who achieved it **first** ranks higher.

---

## 🎭 Demo Best Practices

### Before the Demo

1. **Clear your leaderboard**:
   - Go to: `https://.../clear`
   - Enter your quiz ID
   - Click "Clear Quiz Leaderboard"

2. **Pre-load with sample data** (optional):
   - Send 3-5 test webhooks with different scores
   - Creates a more realistic demo experience

3. **Test the full flow**:
   - Submit form/trigger event
   - Watch leaderboard update in real-time
   - Verify rankings are correct

### During the Demo

1. **Show the real-time aspect**:
   - Have the leaderboard open on a second screen
   - Submit a new score
   - Point out the 2-second update

2. **Highlight key features**:
   - "This updates in real-time via Braze webhooks"
   - "Notice how the top 3 are highlighted"
   - "Users who score the same points are ranked by speed"

3. **Demonstrate scalability**:
   - "Each SolCon/customer can have their own isolated leaderboard"
   - "Just use a different quiz_id in the webhook"

### After the Demo

- Keep the leaderboard live for 1-2 days for follow-up
- Clear it before your next demo
- Share the URL with the customer for testing

---

## 🔧 Advanced Configuration

### Multiple Leaderboards

You can run multiple demos simultaneously! Each quiz ID is completely isolated:

```
/quiz/demo-customer-a  → Customer A's leaderboard
/quiz/demo-customer-b  → Customer B's leaderboard
/quiz/workshop-team-1  → Workshop Team 1
/quiz/workshop-team-2  → Workshop Team 2
```

### Dynamic Quiz IDs

Instead of hardcoding the quiz_id, you can pass it dynamically:

**From Event Properties**:
```json
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{event_properties.${score}}},
  "quiz_id": "{{event_properties.${quiz_id}}}"
}
```

**From Canvas Entry Properties**:
```json
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{event_properties.${score}}},
  "quiz_id": "{{canvas_entry_properties.${quiz_id}}}"
}
```

---

## 🐛 Troubleshooting

### "No scores yet" displayed

**Possible causes**:
1. Webhook not triggered → Check Canvas analytics
2. Webhook failed → Check Braze webhook error logs
3. Wrong quiz_id → Verify it matches your URL

**How to debug**:
- Check Braze Developer Console for webhook errors
- Verify the webhook URL is correct
- Ensure user has a `user_id` (not just external_id)

### Error 400 in Braze logs

**Common issues**:

1. **Missing user_id**:
   ```json
   {"error":"Missing user identifier: user_id or external_id required"}
   ```
   ✅ Fix: Add `"user_id": "{{${user_id}}}"` to webhook body

2. **Missing score**:
   ```json
   {"error":"Missing required fields: username and score are required"}
   ```
   ✅ Fix: Verify your event sends `score` property

3. **Invalid score format**:
   ✅ Fix: Score must be a number, not a string

### Leaderboard not updating

1. **Hard refresh** the page (Ctrl+Shift+R / Cmd+Shift+R)
2. **Check the webhook logs** in Braze
3. **Verify the quiz_id** matches between webhook and URL

### User appears twice

This happens if you change their `user_id` between submissions. Each `user_id` is treated as unique.

---

## 📞 Support & Questions

### Need Help?

Contact the Braze team or check:
- GitHub repo: `vercel-braze-demo-leaderboard`
- Vercel dashboard: `tgt-vercel-braze-demo-leaderboard`

### Feedback

If you have suggestions for improvements, reach out to the team!

---

## 🎯 Quick Reference Card

**Print this for easy access during demos:**

```
┌─────────────────────────────────────────────────┐
│  BRAZE REAL-TIME LEADERBOARD - QUICK REF       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Your Leaderboard URL:                          │
│  https://tgt-vercel-braze-demo-leaderboard-    │
│  braze.vercel.app/quiz/YOUR-QUIZ-ID            │
│                                                 │
│  Webhook URL:                                   │
│  https://tgt-vercel-braze-demo-leaderboard-    │
│  braze.vercel.app/api/update-score             │
│                                                 │
│  Webhook Body:                                  │
│  {                                              │
│    "user_id": "{{${user_id}}}",                │
│    "username": "{{${first_name}}}               │
│                {{${last_name}}}",               │
│    "score": {{event_properties.${score}}},     │
│    "quiz_id": "YOUR-QUIZ-ID"                   │
│  }                                              │
│                                                 │
│  Clear Leaderboard:                             │
│  https://tgt-vercel-braze-demo-leaderboard-    │
│  braze.vercel.app/clear                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✨ Tips for a Great Demo

1. **Practice first**: Run through the full flow at least once
2. **Have backup data**: Pre-load a few scores in case of technical issues
3. **Show the speed**: Emphasize the 2-second real-time update
4. **Mobile demo**: Show it works on phone screens too
5. **Multiple use cases**: Gamification, contests, training, events
6. **Emphasize isolation**: Each customer/team gets their own leaderboard

---

**Happy Demoing! 🚀**

Made with 💜 by the Braze team

