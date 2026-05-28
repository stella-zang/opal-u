# Opal U — board demo

**Opal U gets you to insight in under a minute.**

Enter a topic. A Socratic AI tutor asks five questions that make you think — no lectures, no walls of text. The moment you finish, save it and revisit it later.

Live app: **https://opal-u.vercel.app/learn**

---

## What to try

### 1. Sign in

Go to [https://opal-u.vercel.app/login](https://opal-u.vercel.app/login).

Enter your email. You'll get a magic link — no password needed. Click it and you're in.

### 2. Enter a topic

You land on the "What do you want to explore?" screen. Type anything:

- `compound interest`
- `why habits are hard to break`
- `how vaccines train the immune system`

Hit **Start →**.

### 3. Work through the session

The tutor responds with a question, not an answer. Reply with what you actually think. It will push back, reframe, or go deeper. After five rounds the session wraps.

> This is the core product moment — five minutes of thinking you wouldn't have done otherwise.

### 4. Save it

Click **Save this session** at the bottom. Opal U stores the full transcript and sends you to a permalink you can bookmark or share.

### 5. Revisit later

Click **← Back to library** or go to [/library](https://opal-u.vercel.app/library). Every saved session is there in reverse-chronological order. Click any row to read the full transcript.

---

## What this v0 proves

| Signal | What the app does today |
|--------|------------------------|
| Time to first insight | ~60 seconds from sign-in to first AI question |
| Save + revisit | Sessions persist across devices via Supabase |
| Auth | Magic-link, no password friction |
| Deploy | Prod on Vercel, auto-deploy on every merge to main |

---

## Not in scope yet

- Topic suggestions or onboarding prompts (post-v0)
- Mobile-native layout polish
- Custom domain (opal-u.vercel.app is the stable URL for now)

---

## v0 success checklist (for board members)

- [ ] Received magic link within 30 seconds
- [ ] Entered a topic and got a first question back
- [ ] Completed all five turns
- [ ] Saved the session and saw the permalink
- [ ] Revisited the transcript from the library

If any of these fail, comment on this issue and tag Stella.
