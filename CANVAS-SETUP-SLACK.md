# 🎯 Real-time Quiz Leaderboard Setup
For Braze SolCons

---

## Quick Setup (5 Steps)

### Step 1: Create Quiz Landing Page
• Create a Braze Landing Page with your quiz questions
• Form submission triggers custom event: Quiz Answers Submitted
• Pass all answers as custom attributes (question_1, question_2, etc.)

Example: https://dashboard-02.braze.eu/engagement/landing_pages/69246958432ab82fe41e7329/6578c2dc0142c1004d49fd6a

---

### Step 2: Canvas Entry Trigger
• Trigger: Custom Event "Quiz Answers Submitted"
• Quiz answers stored as custom attributes on user profile

---

### Step 3: Add Agent Console Step
Use Braze Agent Console to calculate the quiz score:

Agent Prompt:
"Calculate the percentage of correct answers. Compare user answers with correct answers and return score as number 0-100.

Correct answers:
- question_1: answer_a
- question_2: answer_b

User answers:
- question_1: {{custom_attribute.${question_1}}}
- question_2: {{custom_attribute.${question_2}}}

Return only the numeric score."

Save result as: canvas_entry_properties.${score}

---

### Step 4: Add Webhook Step
• URL: https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/api/update-score
• Method: POST
• Headers: Content-Type: application/json

Body:
{
  "user_id": "{{${user_id}}}",
  "username": "{{${first_name}}} {{${last_name}}}",
  "score": {{canvas_entry_properties.${score}}},
  "quiz_id": "your-quiz-id"
}

⚠️ Replace "your-quiz-id" with your unique identifier

---

### Step 5: Send Notification
Email or In-App Message with:

"Hi {{${first_name}}},

You scored {{canvas_entry_properties.${score}}} points!

See your ranking: https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/quiz/your-quiz-id"

---

## Testing Checklist
✅ Submit quiz via landing page
✅ Check Agent Console calculated score
✅ Verify webhook success in analytics
✅ View leaderboard at your URL
✅ Confirm user receives notification

---

## Clear Leaderboard
Before demos: https://tgt-vercel-braze-demo-leaderboard-braze.vercel.app/clear
Enter your quiz_id and click clear

---

## Troubleshooting

Problem: Webhook fails (400 error)
→ Check user_id is present in webhook body
→ Ensure score is numeric not string
→ Verify quiz_id matches URL

Problem: Score not calculated
→ Review Agent Console prompt
→ Check custom attributes set correctly from landing page

Problem: Leaderboard doesn't update
→ Hard refresh page (Ctrl+Shift+R)
→ Verify webhook delivered in Canvas analytics

---

## Reference Canvas
https://dashboard-02.braze.eu/engagement/canvas/692467e6401c9225edc704b0/6578c2dc0142c1004d49fd6a

---

Flow: Landing Page → Entry → Agent (Score) → Webhook (Leaderboard) → Message → Done ✅

