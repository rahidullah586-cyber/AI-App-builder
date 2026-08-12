# Z AI - Android App (Expo)

A native Android app for Z AI built with **Expo** (React Native). Features a full chat interface, WebView browser mode, voice input, persistent memory, conversation history, and a beautiful dark/light theme.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Native Chat UI** | Full chat interface with message bubbles, code blocks, markdown, copy/speak |
| **WebView Mode** | Toggle to embedded browser mode for full Z AI web experience |
| **Voice Input** | Record audio for voice-based queries |
| **Text-to-Speech** | Tap to hear AI responses read aloud |
| **File Upload** | Attach images from gallery/camera and documents (PDF, DOCX, etc.) |
| **Conversation History** | All chats saved locally, searchable, pinnable |
| **Persistent Memory** | Store preferences and facts Z AI should remember |
| **Dark/Light/System Theme** | Beautiful adaptive theming |
| **Streaming Responses** | Watch AI responses generate in real-time |
| **Haptic Feedback** | Subtle vibrations on key actions |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- **Android Studio** (for Android builds) or **Expo Go** app on your phone
- **EAS CLI** (for cloud builds): `npm install -g eas-cli`

### 1. Install Dependencies

```bash
cd z-ai-app
npm install
```

### 2. Run on Your Phone (Fastest - Expo Go)

```bash
npx expo start
```

Then scan the QR code with the **Expo Go** app from the Play Store.

### 3. Run on Android Emulator

```bash
npx expo start --android
```

### 4. Run as Web App

```bash
npx expo start --web
```

---

## 📦 Building APK / AAB

### Option A: Local Build with EAS

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Configure EAS (creates eas.json)
eas build:configure

# Build APK (for direct install / sideloading)
eas build --platform android --profile preview

# Build AAB (for Play Store upload)
eas build --platform android --profile production
```

### Option B: Expo Prebuild + Android Studio

```bash
# Generate native Android project
npx expo prebuild

# Open in Android Studio
npx android
```

Then build from Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### Option C: Generate APK without EAS account

```bash
# Prebuild the native project
npx expo prebuild --platform android

# Build with Gradle
cd android
./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

---

## 🔌 Connecting to Real Z AI API

The app currently includes **simulated responses** for demo purposes. To connect to the actual Z AI backend:

### Step 1: Find the API

Inspect the Z AI web interface (https://z.ai) using browser DevTools → Network tab. Look for:
- Chat endpoint (likely a POST to an API route)
- Authentication headers (cookies, bearer tokens, etc.)

### Step 2: Update the Chat Screen

In `src/screens/ChatScreen.tsx`, replace the `simulateStreamResponse` function with a real API call:

```typescript
const simulateStreamResponse = async (convoId: string, userText: string) => {
  try {
    const response = await fetch('YOUR_ZAI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed
      },
      body: JSON.stringify({
        message: userText,
        // Add any required parameters
      }),
    });

    if (!response.ok) throw new Error('API Error');

    // For streaming:
    const reader = response.body.getReader();
    let current = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      current += new TextDecoder().decode(value);
      await updateLastAssistantMessage(convoId, current);
    }

    await updateLastAssistantMessage(convoId, current);
  } catch (err) {
    await updateLastAssistantMessage(convoId, 'Sorry, I encountered an error. Please try again.');
  }
  setIsStreaming(false);
};
```

### Step 3: Update the WebView URL (Optional)

Go to **Settings > Z AI Web URL** in the app to change the WebView target.

---

## 📁 Project Structure

```
z-ai-app/
├── app/
│   └── _layout.tsx          # Expo Router root layout
├── src/
│   ├── assets/              # Icons, splash screen
│   ├── components/
│   │   ├── ChatInput.tsx     # Message input with attachments
│   │   ├── MessageBubble.tsx # Chat message rendering
│   │   └── WebViewChat.tsx   # Embedded browser mode
│   ├── hooks/
│   │   ├── useConversations.ts # Chat state management
│   │   └── useVoiceInput.ts   # Voice recording + TTS
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Bottom tab navigation
│   ├── screens/
│   │   ├── ChatScreen.tsx    # Main chat screen
│   │   ├── ConversationsScreen.tsx # Chat history list
│   │   ├── MemoryScreen.tsx  # Persistent memory manager
│   │   └── SettingsScreen.tsx # App settings
│   ├── theme/
│   │   ├── colors.ts        # Light/dark color palettes
│   │   └── index.tsx        # Theme context & provider
│   └── utils/
│       ├── storage.ts       # AsyncStorage helpers
│       └── types.ts         # TypeScript interfaces
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── babel.config.js          # Babel config
```

---

## 🎨 Customization

### Change App Name / Colors

- **App name**: Edit `app.json` → `expo.name`
- **Primary color**: Edit `src/theme/colors.ts` → `primary` value in both `lightColors` and `darkColors`
- **Background color**: Edit `src/theme/colors.ts` → `background` value

### Add New Screens

1. Create a new file in `src/screens/`
2. Add a tab in `src/navigation/AppNavigator.tsx`

---

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Try `npm install --legacy-peer-deps` |
| WebView blank | Ensure you have internet permission in `app.json` |
| Build fails on Android | Run `cd android && ./gradlew clean` then rebuild |
| Icons not showing | Run `python3 scripts/generate-icons.py` to regenerate |
| Type errors | Run `npx tsc --noEmit` to check, fix accordingly |

---

## 📄 License

This is an unofficial client app. Z AI is a product of Z.ai.
