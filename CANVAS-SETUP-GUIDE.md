# 🎯 Real-time Quiz Leaderboard Setup

**For Braze SolCons - Canvas Configuration Guide**

---

## Overview

This Canvas creates an interactive quiz experience with real-time leaderboard updates using Braze Landing Pages, Agent Console, and Webhooks.

---

## Step-by-Step Setup

### 1. Create Your Quiz Landing Page

Create a Braze Landing Page with your quiz questions. Ensure:
- Each question captures user's answer as a form field
- Form submission triggers Canvas entry via custom event `Quiz Answers Submitted`
- Pass all answers as event properties (e.g., `question_1`, `question_2`, etc.)

**Example**: [Landing Page Template](https://dashboard-02.braze.eu/engagement/landing_pages/69246958432ab82fe41e7329/6578c2dc0142c1004d49fd6a)

---

### 2. Configure Canvas Entry

**Entry Trigger**: Custom Event `Quiz Answers Submitted`

**Entry Properties**: Capture all quiz answers from the landing page form.

---

### 3. Add Agent Console Step

Add a **Braze Agent Console** step to calculate the quiz score:

**Agent Instructions**:
```
Calculate the percentage of correct answers based on the quiz submission.
Compare user answers with the correct answers and return the score as a number between 0-100.

Correct answers:
- question_1: "answer_a"
- question_2: "answer_b"
- question_3: "answer_c"

User answers:
- question_1: {{event_properties.${question_1}}}
- question_2: {{event_properties.${question_2}}}
- question_3: {{event_properties.${question_3}}}

Return only the numeric score.
```

**Store Result**: Save the AI response as `canvas_entry_properties.${score}`

---

### 4. Add Webhook Step

Configure webhook to update the leaderboard:

**URL**:
```
https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/api/update-score
```

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{canvas_entry_properties.${score}}},
  "quiz_id": "your-quiz-id"
}
```

⚠️ **Replace `your-quiz-id`** with your unique quiz identifier (e.g., `demo-workshop-q4`)

---

### 5. Send Notification Message

Add an **Email** or **In-App Message** step:

**Subject**: "Your Quiz Results Are In! 🎯"

**Body**:
```
Hi {{${first_name}}},

You scored {{canvas_entry_properties.${score}}} points!

See where you rank on the leaderboard:
https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/quiz/your-quiz-id

Think you can do better? Retake the quiz and improve your score!
```

⚠️ **Replace `your-quiz-id`** with your actual quiz ID

---

## Testing Your Canvas

1. **Submit the quiz** via your landing page
2. **Check Agent Console logs** to verify score calculation
3. **Verify webhook success** in Canvas analytics
4. **View leaderboard** at your quiz URL
5. **Check user receives** the notification with their score

---

## Leaderboard Features

- ✅ **Real-time updates** (2-second polling)
- ✅ **Top 3 highlighted** with medals and orange scores
- ✅ **Mobile responsive** design
- ✅ **Tiebreaker logic** (faster responders rank higher)
- ✅ **Isolated per quiz_id** (each demo has its own leaderboard)

---

## Clear Leaderboard Between Demos

Before each demo, clear previous entries:
1. Visit: `https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/clear`
2. Enter your `quiz_id`
3. Click "Clear Quiz Leaderboard"

---

## Troubleshooting

**Webhook fails (400 error)**:
- Verify `user_id` is present: `"user_id": "{{${user_id}}}"`
- Ensure score is numeric (not string)
- Check `quiz_id` matches between webhook and URL

**Score not calculated correctly**:
- Review Agent Console prompt
- Verify event properties are captured from landing page
- Test Agent Console response independently

**Leaderboard doesn't update**:
- Hard refresh the page (Ctrl+Shift+R)
- Check webhook delivered successfully in Canvas analytics
- Verify quiz_id matches between webhook and leaderboard URL

---

## Example Canvas

Reference implementation: [Canvas Template](https://dashboard-02.braze.eu/engagement/canvas/692467e6401c9225edc704b0/6578c2dc0142c1004d49fd6a?locale=en&version=flow&isEditing=true)

---

## Questions?

Reach out to the Braze team for support or check the [full SolCon guide](./DEMO-GUIDE.md).

---

**Canvas Flow Summary**:
```
Landing Page → Quiz Submission → Entry Trigger → Agent Console (Calculate Score) 
→ Webhook (Update Leaderboard) → Send Message (Notify User) → Done ✅
```

