# 🧠 NeuroRead AI

Link: https://neuro-read-ai.vercel.app/

NeuroRead AI is an advanced, gamified, and highly adaptive educational technology ecosystem engineered specifically to support individuals with dyslexia, dysgraphia, auditory processing challenges, and visual sensitivities (such as Irlen Syndrome). By combining modern AI engines, machine learning OCR, and client-side web audio engines, the platform deconstructs text rules seamlessly into multi-sensory visual anchors, phonics exercises, and real-time speech processing labs to control visual fatigue and eliminate learning barriers.

---

## 🛡️ Core Pillars & Security Compliance

* **🛡️ COPPA Private Workspace Policy Active:** Operating inside a fully sandboxed architecture compliant with the Children's Online Privacy Protection Act. The application bypasses all standard behavioral tracking networks, pixels, and third-party data-fingerprinting scripts.
* **⚡ Upstream Model Demand Intercepts:** Routes include built-in `try/catch` recovery layers. If upstream AI models experience a 503 service overload, the backend dynamically redirects to internal data dictionaries to keep student experiences responsive and crash-free.

---

## ✨ System Functionalities

### 🎨 1. Visual Anchor Lab
Transforms complex or unfamiliar terms into high-contrast visual memory frames on the fly. 
* Leverages **Gemini 2.5 Flash** with strict structured output mapping to break text into distinct syllables, child-friendly one-sentence definitions, and mnemonic physical tracking shapes.
* Features hover-reveal extraction hooks (`Trash2`) controlled through frontend array manipulation state filtering.

### 🎮 2. Interactive Gamified Phonics Deck (`GameHub`)
Houses four core gamified visual tracking exercises populated via robust static datasets (`gameData.js`) paired with engaging, hardware-accelerated `.lottie` motion characters:
* **SyllableQuest (`SyllableBot.lottie`):** Closed and open vowel segment matching rules.
* **MirrorLetters:** Retrains horizontal flips (**b vs d**, **p vs q**) and vertical inversions (**m vs w**) using animal-themed mnemonics.
* **SoundBlender:** Isolates consonant clusters (`Str-`, `Spl-`) and terminal digraph blocks (`-tch`, `-ng`).
* **VisualPath:** Reinforces layout line-scanning speed and precision.

### 👁️ 3. OcrReaderLab & SpacerStudio
* **OcrReaderLab:** Utilizes an integrated backend engine backed by a localized language layout engine (`eng.traineddata`) to parse raw text layers out of physical uploaded book sheets or images.
* **SpacerStudio:** Re-renders scanned texts instantly into customizable view containers, adjusting layout tracking, padding multipliers, and baseline character gaps to alleviate text crowding.

### 🗣️ 4. AcousticSpeechLab & TutorChatCompanion
* **AcousticSpeechLab:** Interfaces with the Web Audio API and server-side analysis streams to validate spoken phone/blend pronunciations.
* **TutorChatCompanion (`neuro-buddy.lottie`):** A secure, AI-powered conversational partner offering friendly, real-time literacy advice and immediate positive reinforcement.

### 🎛️ 5. Real-Time Adaptive Lens Toolbar
A global layout customization bar that instantly manipulates active document views:
* **Dyslexic Font Option:** Switches typography system-wide to heavily weighted accessible fonts.
* **Focus Ruler Guide:** Projects a mouse-tracking reading line to keep the eye aligned and prevent line skipping.
* **Dynamic Font Resizing:** Scales layout typography smoothly from $14\text{px}$ up to $26\text{px}$.
* **Irlen Syndrome Tints:** Drops a colored overlay matrix over the active window. **System Guard:** Automatically disables selection flags (`disabled={theme === 'dark'}`) during dark mode states to maintain essential baseline text contrast.

---

## 🛠️ Architecture

### Backend (Model-View-Controller)
* **Runtime Env:** Node.js with Express asynchronously mapping endpoint routes.
* **Database Layer:** MongoDB Atlas configured via Mongoose Object Data Modeling (`db.js`).
* **Authentication:** Secure state authorization using encrypted JWT payloads and a custom lookup memory layer (`sessionStore.js`).
* **OCR Engines:** Tesseract node layers processing local training rules (`eng.traineddata`).
* **Generative Intelligence:** Google Gen AI SDK utilizing `gemini-2.5-flash` with strict JSON configurations.

### Frontend
* **Core View Engine:** React (v18+) compiled with the high-velocity **Vite** toolchain.
* **Styling & Layout:** Tailwind CSS v4 using the native file-less Vite compiler plugin (`@tailwindcss/vite`) and root engine configurations (`@theme { --variant-dark: .dark &; }`).
* **Animations:** Framer Motion pipelines paired with `@dotlottie/react-player` asset loaders.
* **Canvas Engines:** Interactive HTML5 Canvas interfaces (`InteractiveBrainCanvas.jsx`) mapped using a custom brain feature atlas layout.

---

## Tech Stack

- Frontend:
  - React 18
  - Vite
  - Tailwind CSS
  - Framer Motion
  - Three.js / React Three Fiber
  - Lottie animations
- Backend:
  - Node.js
  - Express
  - MongoDB / Mongoose
  - JWT authentication
  - Tesseract.js OCR
  - Google GenAI client (`@google/genai`)
- Utilities:
  - bcryptjs
  - cors
  - dotenv
  - multer
  - http-errors

## 📁 Project Folder Structure

```
NeuroRead_AI/
├── backend/
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   └── authController.js
│   ├── eng.traineddata
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Analytics.js
│   │   └── User.js
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── admin.js
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── mnemonic.js
│   │   ├── ocr.js
│   │   ├── ocrLab.js
│   │   ├── progress.js
│   │   ├── speechLab.js
│   │   └── tutorChat.js
│   ├── server.js
│   └── utils/
│       └── sessionStore.js
└── frontend/
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── node_modules/
    ├── package-lock.json
    ├── package.json
    ├── public/
    ├── README.md
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   ├── assets/
    │   │   ├──brain-features-map.png
    │   │   ├── Among Us.lottie
    │   │   ├── neuro-buddy.lottie
    │   │   └── SyllableBot.lottie
    │   ├── components/
    │   │   ├── InteractiveBrainCanvas.jsx
    │   │   ├── ToastContainer.jsx
    │   │   └── Toolbar.jsx
    │   ├── data/
    │   │   └── gameData.js
    │   └── features/
    │       ├── admin/
    │       │   └── AdminDashboard.jsx
    │       ├── ai-reader/
    │       │   └── SpacerStudio.jsx
    │       ├── anchor-lab/
    │       │   └── VisualAnchorLab.jsx
    │       ├── auth/
    │       │   └── AuthScreen.jsx
    │       ├── dashboard/
    │       │   ├── NavigationSidebar.jsx
    │       │   └── StudentDashboard.jsx
    │       ├── gaming/
    │       │   ├── GameCard.jsx
    │       │   ├── GameHub.jsx
    │       │   └── games/
    │       │       ├── MirrorLetters.jsx
    │       │       ├── SoundBlender.jsx
    │       │       ├── SyllableQuest.jsx
    │       │       └── VisualPath.jsx
    │       ├── ocr-lab/
    │       │   └── OcrReaderLab.jsx
    │       ├── profile/
    │       │   └── MyProfile.jsx
    │       ├── speech-lab/
    │       │   └── AcousticSpeechLab.jsx
    │       └── tutor-chat/
    │           └── TutorChatCompanion.jsx
    └── vite.config.js
```

## Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_json_web_token_secret_key
    GEMINI_API_KEY=your_google_ai_studio_api_key
   ```
4. Start the server:
   ```bash
   node server.js
   ```

> The backend listens on port `5000` by default.

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

> The frontend runs on the default Vite port, usually `http://localhost:5173`.

## Running the Full App

- Start the backend first: `cd backend && node server.js`
- Start the frontend second: `cd frontend && npm run dev`
- Open the frontend URL shown by Vite.
- The frontend will communicate with the backend using configured API endpoints such as `/api/auth`, `/api/ocr`, `/api/tutor-chat`, and `/api/admin`.

## Authentication and Admin Access

### Admin account

The backend seeds a default admin account automatically if one does not already exist:

- Email: `admin@neuroread.com`
- PIN: `9999`
- Role: `admin`

### How to access the admin panel

1. Open the app in the browser.
2. Go to the login screen.
3. Enter `admin@neuroread.com` and PIN `9999`.
4. After login, the app shows the `AdminDashboard` view if the user has the admin role.

### Admin endpoints

- `GET /api/admin/live-status` — fetch current online student sessions
- `GET /api/admin/students-metrics` — fetch student gamification metrics
- `POST /api/admin/logout-student` — disconnect an active student session

## Dependencies

### Backend

- `@google/genai`
- `bcryptjs`
- `cors`
- `dotenv`
- `express`
- `http-errors`
- `jsonwebtoken`
- `mongoose`
- `multer`
- `tesseract.js`

### Frontend

- `@lottiefiles/dotlottie-react`
- `@react-three/drei`
- `@react-three/fiber`
- `@tailwindcss/vite`
- `framer-motion`
- `lottie-react`
- `lucide-react`
- `maath`
- `react`
- `react-dom`
- `tailwindcss`
- `three`

## Environment variables

The backend requires:
- `PORT` — 5000
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret key for JWT token signing
- `GEMINI_API_KEY` — your_google_ai_studio_api_key

## Notes

- The project currently does not provide a frontend build script beyond Vite's default `npm run build`.
- If you want a local admin console, use `admin@neuroread.com` and `9999` after backend startup.
- The backend seeds the admin user automatically in MongoDB if the admin account is missing.
