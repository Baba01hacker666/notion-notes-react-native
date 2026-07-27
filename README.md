# 🚀 Modern Notion Notes - React Native (Hermes Engine Enabled)

A premium-quality, offline-first Notes application built with **React Native**, **Hermes JavaScript Engine enabled by default**, **TypeScript**, **MMKV Local Storage**, and **Reanimated**.

---

## 🌟 Key Features

### 🎨 Notion-Inspired UI & UX
- **Dynamic Aesthetic Themes**: Light, Midnight Dark, Notion Dark, Material You, and Cyberpunk.
- **Custom Accent Palettes**: Indigo, Emerald, Amber, Rose, Violet, and Cyan.
- **Fluid Micro-Animations**: 60 FPS transition states powered by Reanimated.
- **Responsive Layouts**: Seamless experience across phones, tablets, and web displays.
- **Card & List Views**: Instant toggle between high-density list and visual card grid layouts.

### 📝 Rich Note Capabilities
- **Markdown & Rich Content**: Live preview & edit mode support.
- **Interactive Checklists**: Multi-item task management.
- **Code Syntax Blocks**: Formatted code snippets.
- **Drawing Canvas**: Touch/mouse hand-sketching canvas.
- **Voice Notes**: Audio recorder with timer waveforms and player.
- **Export Options**: Export notes as **Markdown (.md)**, **PDF**, **HTML**, **JSON**, and **TXT**.
- **Real-Time Word & Reading Stats**: Instant word, character, and reading time counter.
- **Auto-Save**: Background persistence with zero loss.

### 🗂️ High Performance Organisation
- **Nested Folders**: Hierarchical folder & subfolder structure.
- **Smart Filter Pills**: All Notes, Favorites, Pinned, Archived, Trash.
- **Instant Search**: Sub-millisecond filter by title, content, or tag.
- **Custom Tags**: Categorization with color badges.

### 🔒 Security & Privacy
- **Offline First**: All data stored locally using an MMKV abstraction layer.
- **App Lock (4-Digit PIN)**: Protect sensitive notes with custom PIN authentication.
- **Biometric Unlock Simulation**: Modern biometric security interface.
- **Local Data Encryption**: Secure payload obfuscation in MMKV storage.
- **Full Backup & Restore**: Export/Import entire database in JSON format.

---

## 🛠️ Tech Stack & Architecture

- **Core**: React Native, React Native Web, React 18, TypeScript
- **JS Engine**: Hermes Engine (Pre-compiled Bytecode AOT)
- **State & Storage**: Custom Hooks + MMKV High-Speed Storage Abstraction Layer
- **Icons**: Lucide Icons
- **Build System**: Vite (Web), Metro (React Native / Expo), Gradle (Android)

---

## 📂 Project Structure

\`\`\`
notion-notes-react-native/
├── .github/
│   └── workflows/
│       └── android.yml           # GitHub Actions CI/CD pipeline
├── android/
│   ├── build.gradle              # Top-level Gradle configuration
│   └── app/
│       └── build.gradle          # Android App Gradle (enableHermes: true)
├── src/
│   ├── assets/                   # Static assets & images
│   ├── components/               # UI components
│   │   ├── common/               # Header, FAB, Skeleton, Toast
│   │   ├── editor/               # RichMarkdownEditor, DrawingCanvas, VoiceRecorder
│   │   ├── notes/                # NoteCard, NoteFilterBar
│   │   └── security/             # PinLockModal
│   ├── constants/                # Default notes, themes, config
│   ├── hooks/                    # useNotes, useTheme, useAuth
│   ├── models/                   # Type definitions
│   ├── services/                 # ExportService, SecurityService, HapticsService
│   ├── storage/                  # MMKVStorage abstraction layer
│   ├── theme/                    # Color palettes & theme definitions
│   ├── types/                    # TypeScript interfaces
│   ├── utils/                    # textUtils, dateUtils
│   ├── App.tsx                   # Main React Native App container
│   └── index.tsx                 # Entrypoint
├── app.json                      # Expo & React Native Hermes configuration
├── babel.config.js               # Babel plugins (Reanimated)
├── metro.config.js               # Metro bundler config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # Strict TypeScript configuration
└── vite.config.ts                # Vite React Native Web configuration
\`\`\`

---

## ⚡ Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Development Server (Web / Local Preview)
\`\`\`bash
npm run dev
\`\`\`
Open your browser at `http://localhost:3000`.

### 3. Typecheck & Lint
\`\`\`bash
npm run typecheck
npm run lint
\`\`\`

### 4. Build Production Bundle
\`\`\`bash
npm run build
\`\`\`

---

## 🤖 Android Native Build (Hermes JS Engine)

The project includes pre-configured Android Gradle settings with Hermes enabled by default in `android/app/build.gradle`:

\`\`\`groovy
project.ext.react = [
    enableHermes: true, // Hermes JS Engine ENABLED
]
\`\`\`

To build APK locally with Android SDK:
\`\`\`bash
cd android
./gradlew assembleDebug
./gradlew assembleRelease
\`\`\`

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The repository features a workflow under `.github/workflows/android.yml` that automatically:
1. Runs ESLint, TypeScript checks, and test suite on push/PR.
2. Caches Node modules, npm, and Gradle builds.
3. Compiles Android Debug & Release APKs with Hermes enabled.
4. Uploads generated APKs as workflow artifacts.
