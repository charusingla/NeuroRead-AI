# NeuroRead AI - High-Level System Design

##  System Architecture Overview

NeuroRead is a full-stack, adaptive learning platform built on a client-server architecture with a focus on dyslexia-friendly interactive learning experiences.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (React + Vite)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UI Components: Auth, Dashboard, Labs, Admin Console     │   │
│  │  - Visual Anchor Lab (Gemini AI)                         │   │
│  │  - Phonics GameHub (4 interactive games)                 │   │
│  │  - OCR Reader Lab (Tesseract)                            │   │
│  │  - Speech Lab (Web Audio API)                            │   │
│  │  - Tutor Chat Companion (GenAI)                          │   │
│  │  - Adaptive Toolbar (Dyslexic Font, Ruler, Tints)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                     │
│              HTTP/REST (JSON payloads)                          │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                ┌──────────▼────────────┐
                │  Express API Gateway  │
                │  (Port 5000)          │
                └──────────┬────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │  Routes │   │ Middleware  │   │ Controllers │
    ├─────────┤   ├─────────────┤   ├─────────────┤
    │ /auth   │   │ authMW      │   │ authCtrl    │
    │ /admin  │   │ cors        │   │ aiCtrl      │
    │ /ocr    │   │ express.json│   └─────────────┘
    │ /ai     │   │ errorMW     │
    │ /speech │   └─────────────┘
    │ /games  │
    └─────────┘
         │
         ├─────────────────────────────────┐
         │                                 │
    ┌────▼────────────────────┐   ┌────────▼─────────────┐
    │   MongoDB Atlas         │   │  External Services   │
    │   (Mongoose ORM)        │   ├──────────────────────┤
    │ ┌─────────────────────┐ │   │ Google Gemini 2.5    │
    │ │ Users               │ │   │ Flash (AI)           │
    │ │ - Profile           │ │   │                      │
    │ │ - Gamification      │ │   │ Tesseract.js (OCR)   │
    │ │ - Progress          │ │   │ (local via eng.dat)  │
    │ │ - AccessSettings    │ │   │                      │
    │ │                     │ │   │ Web Audio API        │
    │ │ Analytics           │ │   │ (client-side)        │
    │ └─────────────────────┘ │   │                      │
    └─────────────────────────┘   └──────────────────────┘
```

---

## 1. Requirements

### 1.1 Functional Requirements

- **User Authentication & Authorization:** The system shall allow students and admins to sign up and log in securely using email and PIN.
- **Role-based Routing:** The system shall route users into the student dashboard or admin console depending on role.
- **OCR Text Extraction:** The system shall accept image uploads and return extracted text using Tesseract OCR.
- **Text Simplification:** The system shall simplify scanned text for dyslexia-friendly consumption using AI-powered text processing.
- **Visual Anchor Generation:** The system shall generate mnemonic visual anchor cards and syllable breakdowns for input words.
- **Tutor Chat Assistance:** The system shall provide a conversational AI tutor that responds to student questions with supportive literacy advice.
- **Speech Analysis:** The system shall analyze voice transcript input and return pronunciation feedback and phoneme-level guidance.
- **Gamified Activities:** The system shall provide interactive phonics games with XP rewards and progress tracking.
- **Progress Tracking:** The system shall update and persist user gamification metrics including XP, level, and streak.
- **Admin Monitoring:** The admin console shall display live online student sessions, metrics, and allow disconnecting active sessions.
- **Accessibility Settings:** The system shall allow students to adjust visual settings such as font size, overlays, and focus tools.
- **Error Handling:** The system shall handle failed AI calls gracefully by using fallback data or returning user-friendly messages.

### 1.2 Non-Functional Requirements

- **Performance:** The frontend shall render within 2 seconds on modern browsers, and backend API responses shall complete in less than 500ms for most requests.
- **Scalability:** The backend architecture shall support horizontal scaling with stateless API endpoints and a cloud-hosted MongoDB database.
- **Reliability:** The system shall continue operating for core student activities even during AI service interruptions via fallback paths.
- **Security:** The platform shall secure user data using JWT authentication, encrypted password storage, and environment-based secrets.
- **Privacy & Compliance:** The platform shall avoid tracking pixels and third-party analytics to maintain a COPPA-safe learning environment.
- **Accessibility:** The UI shall support dyslexia-friendly design, large readable fonts, high contrast modes, and keyboard-compatible controls.
- **Maintainability:** The codebase shall be organized by feature modules, with a clear separation between frontend components and backend routes/controllers.
- **Usability:** The application shall present an intuitive onboarding flow for students and a simple admin monitoring dashboard.
- **Compatibility:** The frontend shall support current major desktop browsers and progressive enhancements for Web Audio and file uploads.
- **Resilience:** The backend shall validate inputs and return clear error responses, while the frontend shall not crash on invalid or missing data.

---

## 2. Component Architecture

### 2.1 Frontend Module Structure

```
src/
├── App.jsx                          [Main router & state manager]
│
├── features/                        [Feature-based organization]
│   ├── auth/
│   │   └── AuthScreen.jsx           [Login/Signup, role detection]
│   │
│   ├── dashboard/
│   │   ├── StudentDashboard.jsx     [Main student portal]
│   │   └── NavigationSidebar.jsx    [Lab/game navigation menu]
│   │
│   ├── admin/
│   │   └── AdminDashboard.jsx       [Live student monitoring]
│   │
│   ├── ocr-lab/
│   │   └── OcrReaderLab.jsx         [Text OCR & rendering]
│   │
│   ├── ai-reader/
│   │   └── SpacerStudio.jsx         [Text spacing & formatting]
│   │
│   ├── anchor-lab/
│   │   └── VisualAnchorLab.jsx      [Gemini visual mnemonics]
│   │
│   ├── speech-lab/
│   │   └── AcousticSpeechLab.jsx    [Speech recognition & practice]
│   │
│   ├── gaming/
│   │   ├── GameHub.jsx              [Game launcher]
│   │   ├── GameCard.jsx             [Game card component]
│   │   └── games/
│   │       ├── SyllableQuest.jsx    [Phonics matching]
│   │       ├── MirrorLetters.jsx    [Letter inversion]
│   │       ├── SoundBlender.jsx     [Consonant clusters]
│   │       └── VisualPath.jsx       [Line scanning]
│   │
│   ├── tutor-chat/
│   │   └── TutorChatCompanion.jsx   [GenAI chat]
│   │
│   └── profile/
│       └── MyProfile.jsx            [User settings & gamification]
│
├── components/                      [Shared UI components]
│   ├── InteractiveBrainCanvas.jsx   [3D brain visualization]
│   ├── Toolbar.jsx                  [Adaptive lens controls]
│   ├── ToastContainer.jsx           [Notifications]
│   └── ...
│
├── assets/                          [Lottie animations]
│   ├── neuro-buddy.lottie          [Chat companion]
│   ├── SyllableBot.lottie          [Game character]
│   └── Among Us.lottie
│
└── data/
    └── gameData.js                 [Static game datasets]
```

### 2.2 Backend Module Structure

```
backend/
├── server.js                       [Express app init & seed admin]
│
├── config/
│   └── db.js                       [MongoDB connection setup]
│
├── middleware/
│   └── authMiddleware.js           [JWT token verification]
│
├── models/
│   ├── User.js                     [User schema: profile, roles, gamification]
│   └── Analytics.js                [Progress & metrics tracking]
│
├── controllers/
│   └── authController.js           [Register & login logic]
│
├── routes/
│   ├── auth.js                     [POST /api/auth/signup, login]
│   ├── admin.js                    [GET live-status, students-metrics]
│   ├── ocr.js                      [POST file upload → Tesseract]
│   ├── ocrLab.js                   [Text processing & formatting]
│   ├── ai.js                       [Gemini requests for visual anchors]
│   ├── mnemonic.js                 [Mnemonic data & generation]
│   ├── progress.js                 [XP/level/streak updates]
│   ├── speechLab.js                [Speech validation routes]
│   └── tutorChat.js                [GenAI conversational routes]
│
├── utils/
│   ├── sessionStore.js             [In-memory active session tracking]
│   └── ...
│
└── eng.traineddata                 [Tesseract OCR language pack]
```

---

## 3. Data Flow Architecture

### 3.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User enters email & PIN in AuthScreen.jsx                    │
├─────────────────────────────────────────────────────────────────┤
│ 2. Frontend POST /api/auth/login { email, password }            │
├─────────────────────────────────────────────────────────────────┤
│ 3. Backend (authController.js):                                 │
│    - Query User model by email                                  │
│    - bcryptjs.compare(password, hashedPassword)                 │
│    - If valid: generateToken(userID)                            │
│    - Return { _id, username, role, token, gamification }        │
├─────────────────────────────────────────────────────────────────┤
│ 4. Auth middleware logs to activeSessions if role !== 'admin'   │
├─────────────────────────────────────────────────────────────────┤
│ 5. Frontend stores token in localStorage                        │
├─────────────────────────────────────────────────────────────────┤
│ 6. Route redirects:                                             │
│    - role === 'admin' → AdminDashboard                          │
│    - role === 'student' → StudentDashboard                      │
└─────────────────────────────────────────────────────────────────┘
```

**Default Admin Credentials (auto-seeded on server start):**
- Email: `admin@neuroread.com`
- PIN: `9999`
- Role: `admin`

### 3.2 Student Learning Flow

```
┌──────────────────────────────────────────────────────────────┐
│ StudentDashboard                                             │
├────────────────────┬──────────────────┬──────────────────────┤
│ NavigationSidebar  │    Selected      │   Feature Panel      │
│                    │    Feature       │                      │
│ - Games            │                  │  (Renders the lab    │
│ - OCR Lab          │                  │   or game based on   │
│ - Speech Lab       │   Renders        │   currentView state) │
│ - Chat Tutor       │   component      │                      │
│ - Anchors          │   based on       │  E.g., SpeechLab →   │
│ - Profile          │   sidebar        │  - Record audio      │
│                    │   selection      │  - Submit to backend │
│                    │                  │  - Get feedback      │
└────────────────────┴──────────────────┴──────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ On activity completion (game win, correct answer, etc.)      │
├──────────────────────────────────────────────────────────────┤
│ 1. Frontend triggers XP reward calculation                   │
│ 2. POST /api/progress { userId, xpEarned, activityType }     │
│ 3. Backend updates User.gamification: { xp, level, streak }  │
│ 4. Admin can see live metrics in AdminDashboard              │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 AI Lab Feature Flow

```
User Input (VisualAnchorLab or TutorChat)
        │
        ▼
    Frontend captures text/query
        │
        ▼
POST /api/ai { prompt, mode: 'anchor' | 'chat' }
        │
        ▼
    Backend aiController.js
        │
        ├─ Try: Call Google Gemini 2.5 Flash
        │   with structured JSON output config
        │
        ├─ Success: Parse JSON response
        │   (syllables, definitions, shapes)
        │
        └─ 503 Error: Fall back to local dictionary
            (graceful degradation)
        │
        ▼
Return formatted { syllables, definitions, mnemonic }
        │
        ▼
Frontend renders visual anchors or chat response
```

---

## 3.4 API Endpoint Catalog

This section lists every backend API endpoint used by the NeuroRead frontend, including request payloads, response schema, and authorization requirements.

### Authentication

- `POST /api/auth/signup`
  - Request:
    - `email` (string)
    - `password` (string)
    - `role` (string) — `student` or `admin`
    - `username` (string) — required for student signup
  - Response:
    - `_id`, `username`, `role`, `token`, `gamification`
  - Notes: creates a student profile; admin signup is blocked by frontend guard.

- `POST /api/auth/login`
  - Request:
    - `email` (string)
    - `password` (string)
  - Response:
    - `_id`, `username`, `role`, `token`, `gamification`, `accessibilitySettings`
  - Notes: successful login stores JWT in local storage and routes users by role.

### Admin

- `GET /api/admin/live-status`
  - Headers: `Authorization: Bearer <token>` (admin or authenticated user)
  - Response:
    - `onlineCount` (number)
    - `onlineStudents` (array of student session objects)
      - `username`, `lastActive`, `role`, `email`, `gamification`
  - Notes: returns active session telemetry merged with database gamification data.

- `GET /api/admin/students-metrics`
  - Headers: `Authorization: Bearer <token>` (admin or authenticated user)
  - Response:
    - `totalCount` (number)
    - `students` (sorted array)
      - `_id`, `username`, `email`, `gamification`
        - `xp`, `level`, `streak`
  - Notes: resets stale streaks automatically when a student misses more than one calendar day.

- `POST /api/admin/logout-student`
  - Headers: `Authorization: Bearer <token>` (admin or authenticated user)
  - Request:
    - `username` (string)
  - Response:
    - `message` confirming the session disconnect
  - Notes: removes the named student from the in-memory `activeSessions` map.

### OCR

- `POST /api/ocr/scan`
  - Request: `multipart/form-data` with `image`
  - Response:
    - `text` (string)
  - Notes: performs raw OCR extraction with Tesseract and returns the recognized text.

- `POST /api/ocr-lab/analyze`
  - Request: `multipart/form-data` with `image`
  - Response:
    - `success` (boolean)
    - `lines` (array of strings)
    - `wordCount` (number)
  - Notes: advanced OCR lab route that returns structured lines for text reflow and spacing.

### AI / Generative Intelligence

- `POST /api/ai/ocr-simplify`
  - Headers: `Authorization: Bearer <token>`
  - Request: `multipart/form-data` with `image`
  - Response:
    - `simplifiedText` (string)
  - Notes: combines Tesseract OCR and Gemini simplification to produce dyslexia-friendly text output.

- `POST /api/ai/chat`
  - Headers: `Authorization: Bearer <token>`
  - Request:
    - `message` (string)
  - Response:
    - `reply` (string)
  - Notes: proxy chat endpoint that forwards student text to Gemini and returns an AI-generated response.

- `POST /api/mnemonic/generate`
  - Request:
    - `word` (string)
  - Response:
    - `word` (string)
    - `syllables` (string)
    - `definition` (string)
    - `visualEmojis` (string)
    - `memoryTrick` (string)
    - `isFallback` (boolean, optional)
  - Notes: generates mnemonic cards; returns a fallback payload if the AI service fails.

### Tutor Chat

- `POST /api/tutor-chat/message`
  - Request:
    - `message` (string)
    - `chatHistory` (array, optional)
  - Response:
    - `reply` (string)
  - Notes: builds a chat history payload and asks Gemini to play the Neuro tutor role.

### Speech Lab

- `POST /api/speech-lab/analyze`
  - Request:
    - `spokenText` (string)
    - `targetWord` (string, optional)
  - Response:
    - `isMatch` (boolean)
    - `phonemes` (string)
    - `feedback` (string)
  - Notes: sends a voice transcript to Gemini for pronunciation evaluation and returns structured feedback.

### Progress & Gamification

- `POST /api/progress/earn-xp`
  - Request:
    - `userId` (string)
    - `xpGained` (number)
  - Response:
    - `message` (string)
    - `gamification` (object)
      - `xp`, `level`, `streak`
  - Notes: updates user XP and level, then syncs the in-memory session store for live admin visibility.

---

## 4. Authentication & Authorization Model

### 4.1 Role-Based Access Control

```
┌────────────────────────────────────────────────────────────┐
│ User Roles & Permissions                                   │
├──────────────────┬──────────────────┬──────────────────────┤
│ Student          │ Teacher          │ Admin                │
├──────────────────┼──────────────────┼──────────────────────┤
│ • View dashboard │ (Future role)    │ • AdminDashboard     │
│ • Access labs    │ (Not yet used)   │ • live-status        │
│ • Play games     │                  │ • students-metrics   │
│ • Chat tutor     │                  │ • logout-student     │
│ • Upload OCR     │                  │ • View sessions      │
│ • See profile    │                  │ • Manage users       │
│ • Earn XP        │                  │                      │
└──────────────────┴──────────────────┴──────────────────────┘
```

### 4.2 JWT Token Structure

```javascript
// Payload (decoded example)
{
  id: "507f1f77bcf86cd799439011",     // User MongoDB _id
  iat: 1687345200,                     // Issued at
  exp: 1690023600                      // Expires in 30 days
}

// Sent as: Authorization: Bearer <token>
```

---

## 5. Feature Modules Architecture

### 5.1 Visual Anchor Lab

**Purpose:** Convert complex words into memorable visual/syllable breakdowns.

```
┌───────────────────────────────────────────────────────┐
│ Frontend: VisualAnchorLab.jsx                         │
│ - User enters a word                                  │
│ - Sends to /api/ai with mode: 'anchor'                │
└───────────────┬───────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────┐
│ Backend: aiController.js                              │
│ - Call Google Gemini 2.5 Flash                        │
│ - Structured output:                                  │
│   { syllables: [...], definitions: [...],             │
│     mnemonicShapes: [...] }                           │
└───────────────┬───────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────┐
│ Frontend renders:                                    │
│ - Color-coded syllables                              │
│ - Hover-reveal definitions                           │
│ - Visual shape associations                          │
│ - Lottie animations for reinforcement                │
└──────────────────────────────────────────────────────┘
```

### 5.2 GameHub (4-Game Suite)

```
GameHub.jsx
├── SyllableQuest
│   └── Tests: Open/closed vowel rules
│       Reward: +50 XP per correct match
│
├── MirrorLetters
│   └── Tests: Horizontal/vertical letter inversions
│       (b↔d, p↔q, m↔w)
│       Reward: +75 XP per correct series
│
├── SoundBlender
│   └── Tests: Consonant clusters (Str-, Spl-)
│       and terminal digraphs (-tch, -ng)
│       Reward: +60 XP per correct blend
│
└── VisualPath
    └── Tests: Line-scanning speed & precision
        Reward: +40 XP + streak multiplier
```

### 5.3 OCR Reader Lab & Spacer Studio

```
OcrReaderLab.jsx
├── Input: User uploads image or PDF page
│
└── Backend processing:
    ├── Tesseract.js / eng.traineddata
    └── Extract raw text layer
        │
        ▼ (Send to SpacerStudio)
        
SpacerStudio.jsx
├── Customizable rendering:
│   ├── Font type (dyslexic-friendly fonts)
│   ├── Character spacing (adjust letter gaps)
│   ├── Line height (adjust padding)
│   ├── Background tint (Irlen Syndrome colors)
│   └── Font size (14px–26px scale)
│
└── Live preview with sliders
```

### 5.4 Speech Lab

```
AcousticSpeechLab.jsx
├── Record: Capture student's phoneme/word
├── Validate: Compare against expected pronunciation
├── Feedback: Real-time accuracy score + encouragement
└── Reward: +50–100 XP based on accuracy
```

### 5.5 Tutor Chat Companion

```
TutorChatCompanion.jsx
├── Input: Student types question or statement
│
└── Backend:
    ├── Route /api/tutor-chat { message }
    │
    └── Controller calls Google Gemini
        ├── System prompt: "Be a friendly dyslexia coach"
        ├── Context: Student profile & progress
        └── Response: Tailored advice + positive reinforcement
        │
        ▼ (Lottie animation: neuro-buddy.lottie plays)
        │
        └── Frontend renders response in chat bubble
```

---

## 6. Admin Console Architecture

### 6.1 AdminDashboard Routes

```
AdminDashboard.jsx
│
├── GET /api/admin/live-status
│   └── Returns:
│       {
│         onlineCount: 12,
│         onlineStudents: [
│           {
│             username: "alice",
│             lastActive: "10:45:23",
│             role: "student",
│             email: "alice@school.edu",
│             gamification: { xp: 1250, level: 5, streak: 3 }
│           },
│           ...
│         ]
│       }
│
├── GET /api/admin/students-metrics
│   └── Returns:
│       {
│         totalCount: 156,
│         students: [
│           {
│             _id: "...",
│             username: "bob",
│             email: "bob@school.edu",
│             gamification: { xp: 2840, level: 8, streak: 7 }
│           },
│           ...
│         ]  // Sorted by XP descending
│       }
│
└── POST /api/admin/logout-student
    └── Body: { username: "alice" }
        Action: Remove from activeSessions Map
        Response: { message: "Session disconnected" }
```

### 6.2 Admin Dashboard UI Flow

```
┌───────────────────────────────────────────────────┐
│ System Admin Console (Admin Only)                 │
├────────────────┬──────────────────────────────────┤
│ Live Status    │  Students Metrics                │
│                │                                  │
│ • Online count │ • Total students registered      │
│ • Last active  │ • XP leaderboard (descending)    │
│ • Disconnect   │ • Level distribution             │
│   button       │ • Current streak counts          │
│                │                                  │
│ [Real-time     │ [Fetched on load, refresh btn]   │
│  polling]      │                                  │
└────────────────┴──────────────────────────────────┘
```

---

## 7. Database Schema

### 7.1 User Model

```javascript
{
  _id: ObjectId,
  username: String,
  email: String (unique, lowercase),
  password: String (hashed with bcryptjs),
  role: Enum["student", "admin", "teacher"],
  
  // Gamification tracking
  gamification: {
    xp: Number,
    level: Number,
    streak: Number,
    lastLoginDate: String (YYYY-MM-DD)
  },
  
  // Accessibility preferences
  accessibilitySettings: {
    fontType: String,
    fontSize: Number,
    charSpacing: Number,
    lineHeight: Number,
    overlayTint: String,
    focusRuler: Boolean,
    dyslexicFont: Boolean
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 7.2 Analytics Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  activityType: String (e.g., "game_complete", "ocr_upload"),
  xpEarned: Number,
  timestamp: Date,
  metadata: Object (activity-specific data)
}
```

---

## 8. Technology Decisions & Rationale

| Layer                  | Technology    | Rationale                                                     |
|------------------------|---------------|---------------------------------------------------------------|
| **Frontend Framework** | React 18      | Component reusability, large ecosystem                        |
| **Build Tool**         | Vite          | Fast cold start, HMR, optimal bundling                        |
| **Styling**            | Tailwind CSS  | Utility-first, rapid prototyping, dark mode                   |
| **Animations**         | Framer Motion | Smooth, performant, React-native integration                  |
| **Backend Runtime**    | Node.js       | Async I/O, JavaScript ecosystem, easy deployment              |
| **Framework**          | Express       | Lightweight, flexible, routing, middleware support            |
| **Database**           | MongoDB       | Flexible schema, document-oriented, cloud-ready               |
| **Authentication**     | JWT           | Stateless, scalable, mobile-friendly                          |
| **OCR Engine**         | Tesseract.js  | Open-source, runs client/server-side, supports 100+ languages |
| **Gen AI**             | Google Gemini 2.5 Flash | Fast, structured JSON output, cost-effective        |
| **3D Graphics**        | Three.js      | Interactive brain visualization, web-native                   |

---

## 9. Scalability & Performance Considerations

### 9.1 Frontend Optimization

- **Code splitting:** Feature-based lazy loading (games, labs, admin)
- **Asset optimization:** Compressed Lottie files, WebP images
- **Caching:** Service workers for offline support (future)
- **CDN:** Static assets (animations, fonts) served from CDN in production

### 9.2 Backend Optimization

- **Database indexing:** Indexes on `email`, `username`, `role` fields
- **In-memory sessions:** `sessionStore.js` Map for O(1) session lookups
- **API rate limiting:** Prevent bot abuse (future enhancement)
- **Load balancing:** Horizontal scaling via Docker/Kubernetes
- **Caching layer:** Redis for frequently accessed data (future)

### 9.3 External Service Resilience

- **Gemini 503 fallback:** Internal dictionary + cached responses
- **Tesseract timeout handling:** Graceful error messages
- **Web Audio API fallback:** Browser compatibility checks

---

## 10. Security Posture

### 10.1 COPPA Compliance

- ✅ No third-party tracking pixels
- ✅ No behavioral data collection
- ✅ No external analytics (Google Analytics, Mixpanel, etc.)
- ✅ Sandboxed student environment
- ✅ Parental consent workflow (future feature)

### 10.2 Data Protection

- **Password hashing:** bcryptjs (10 salt rounds)
- **JWT secrets:** Environment variable (`JWT_SECRET`)
- **HTTPS:** TLS/SSL enforced in production
- **CORS:** Restricted to known frontend domains
- **Input validation:** Server-side validation on all endpoints

### 10.3 Authorization Guards

- **Protected routes:** All student data behind `authMiddleware.js`
- **Admin-only endpoints:** Role check on `/api/admin/*` routes
- **Token expiry:** 30-day JWT expiration + refresh logic (future)

---

## 11. Deployment Architecture

```
┌────────────────────────────────────────────────────┐
│ Production Environment                             │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ CDN (Static Assets)                          │   │
│ │ - Lottie animations                          │   │
│ │ - CSS, JS bundles                            │   │
│ └──────────────────────────────────────────────┘   │
│                      │                             │
│ ┌────────────────────▼──────────────────────────┐  │
│ │ Frontend (Vercel / Netlify)                   │  │
│ │ - React SPA (static HTML + bundle)            │  │
│ │ - Env vars: VITE_API_BASE                     │  │
│ └─────────────────────┬─────────────────────────┘  │
│                       │                            │
│ ┌─────────────────────▼────────────────────────┐   │
│ │ API Gateway / Reverse Proxy (Nginx)          │   │
│ └─────────────────────┬────────────────────────┘   │
│                       │                            │
│ ┌─────────────────────▼────────────────────────┐   │
│ │ Backend (Docker / Node.js)                   │   │
│ │ - Express server (replicated instances)      │   │
│ │ - Env vars: MONGO_URI, JWT_SECRET            │   │ 
│ └─────────────────────┬────────────────────────┘   │
│                       │                            │
│ ┌─────────────────────▼────────────────────────┐   │
│ │ MongoDB Atlas (Cloud Database)               │   │
│ │ - Replica set for HA                         │   │
│ │ - Automated backups                          │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 12. Future Enhancements

1. **Teacher Dashboard:** Custom assignment creation, class analytics
2. **Parent Portal:** Child progress reports, parental controls
3. **Mobile Apps:** React Native for iOS/Android
4. **Offline Support:** Service workers + local storage sync
5. **Real-time Collaboration:** WebSockets for shared learning sessions
6. **Advanced Analytics:** Heatmaps, learning curve predictions (ML)
7. **Accessibility Audit:** WCAG 2.1 AAA compliance review
8. **Multi-language Support:** i18n framework for global reach
9. **Advanced OCR:** Handwriting recognition, diagram interpretation
10. **Personalized AI Tutoring:** Adaptive difficulty, spaced repetition

---

## 13. Development Workflow

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm start  # nodemon server.js (port 5000)

# Terminal 2: Frontend
cd frontend
npm install
npm run dev  # Vite (port 5173)

# Backend seeded admin on startup:
# Email: admin@neuroread.com
# PIN: 9999
```

### Testing & QA

- **Unit tests:** Jest for React & Node.js
- **E2E tests:** Cypress / Playwright for user flows
- **Load testing:** K6 for backend scalability
- **Accessibility testing:** Axe DevTools, manual WCAG audits

---

